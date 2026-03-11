# backend/app/main.py
import os
import stripe
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db, engine
from app import models, schemas
from app.ai import ask_openai
from app.models import Event

# ────────────────────────────────────────────────
# Create database tables
# ────────────────────────────────────────────────
models.Base.metadata.create_all(bind=engine)

# ────────────────────────────────────────────────
# Initialize FastAPI app
# ────────────────────────────────────────────────
app = FastAPI(title="Hotbox Underground API")

# ────────────────────────────────────────────────
# Load Stripe secret key (required for payments)
# ────────────────────────────────────────────────
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
if not stripe.api_key:
    raise ValueError("STRIPE_SECRET_KEY not found in .env")

# ────────────────────────────────────────────────
# CORS middleware (allow frontend localhost and live domain)
# ────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://hotboxunderground.com",
        "https://www.hotboxunderground.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ────────────────────────────────────────────────
# Include all route modules
# ────────────────────────────────────────────────
from app.routes import auth, tickets, admin, merch

app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(admin.router)
app.include_router(merch.router)

# ────────────────────────────────────────────────
# Root endpoint
# ────────────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Hotbox Underground API 🔥"}

# ────────────────────────────────────────────────
# Events endpoints
# ────────────────────────────────────────────────
@app.get("/events", response_model=list[schemas.EventSchema])
def get_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()

@app.get("/events/{event_id}", response_model=schemas.EventSchema)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.post("/events", response_model=schemas.EventSchema)
def create_event(event: schemas.EventSchema, db: Session = Depends(get_db)):
    db_event = models.Event(**event.model_dump(exclude={"id"}))
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# ────────────────────────────────────────────────
# Artists endpoints
# ────────────────────────────────────────────────
@app.get("/artists", response_model=list[schemas.ArtistSchema])
def get_artists(db: Session = Depends(get_db)):
    return db.query(models.Artist).all()

@app.post("/artists", response_model=schemas.ArtistSchema)
def create_artist(artist: schemas.ArtistSchema, db: Session = Depends(get_db)):
    db_artist = models.Artist(**artist.model_dump(exclude={"id"}))
    db.add(db_artist)
    db.commit()
    db.refresh(db_artist)
    return db_artist

# ────────────────────────────────────────────────
# AI Chat Endpoint
# ────────────────────────────────────────────────
class ChatMessage(BaseModel):
    message: str

@app.post("/ai/chat")
def ai_chat(chat: ChatMessage, db: Session = Depends(get_db)):
    message = chat.message.strip()

    if len(message) < 3:
        raise HTTPException(status_code=400, detail="Message too short")

    # Fetch real upcoming events
    events = db.query(Event).all()
    event_list = "\n".join([
        f"- {e.title} ({e.date}) in {e.location} - ${e.price}"
        for e in events
    ]) or "No upcoming events found."

    prompt = f"""
You are a fun, knowledgeable concierge for Hotbox Underground — a premium music events platform.
Use ONLY the following real upcoming events when answering questions about events, prices, dates, or locations.
Do NOT invent events that aren't listed.

REAL EVENTS:
{event_list}

Keep replies short, engaging, and helpful (under 150 words).
If the question is about artists/merch/tickets, answer naturally.
If unsure, say so and suggest browsing the site.

User message: {message}
"""

    reply = ask_openai(prompt, max_tokens=250)
    return {"reply": reply}

# ────────────────────────────────────────────────
# Stripe Checkout Session Endpoint (NEW)
# ────────────────────────────────────────────────
@app.post("/create-checkout-session")
async def create_checkout_session():
    try:
        # For now: hardcoded one item (later: read from cart via request body or session)
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Hotbox Underground Hoodie",
                        },
                        "unit_amount": 8900,  # $89.00 in cents
                    },
                    "quantity": 1,
                },
                # Example of adding another item (uncomment when dynamic)
                # {
                #     "price_data": {
                #         "currency": "usd",
                #         "product_data": {"name": "Classic Logo Tee"},
                #         "unit_amount": 4500,  # $45.00
                #     },
                #     "quantity": 1,
                # },
            ],
            mode="payment",
            success_url="https://hotboxunderground.com/checkout/success",
            cancel_url="https://hotboxunderground.com/checkout/cancel",
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))