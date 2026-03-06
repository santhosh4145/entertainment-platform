from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import decode_token
from jose import JWTError

router = APIRouter(prefix="/tickets", tags=["tickets"])

def get_current_user(token: str, db: Session):
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/", response_model=schemas.TicketResponse)
def purchase_ticket(
    ticket: schemas.TicketCreate,
    token: str,
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    event = db.query(models.Event).filter(models.Event.id == ticket.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    existing = db.query(models.Ticket).filter(
        models.Ticket.user_id == user.id,
        models.Ticket.event_id == ticket.event_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already have a ticket for this event")
    
    new_ticket = models.Ticket(
        user_id=user.id,
        event_id=ticket.event_id
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

@router.get("/mine", response_model=list[schemas.TicketResponse])
def get_my_tickets(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    return db.query(models.Ticket).filter(models.Ticket.user_id == user.id).all()

@router.get("/all", response_model=list[schemas.TicketResponse])
def get_all_tickets(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    if user.is_admin != "true":
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(models.Ticket).all()