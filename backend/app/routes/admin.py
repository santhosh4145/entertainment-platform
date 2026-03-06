from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import decode_token
from jose import JWTError

router = APIRouter(prefix="/admin", tags=["admin"])

def get_admin_user(token: str, db: Session):
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        if user.is_admin != "true":
            raise HTTPException(status_code=403, detail="Admin access required")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/stats")
def get_stats(token: str, db: Session = Depends(get_db)):
    get_admin_user(token, db)
    total_users = db.query(models.User).count()
    total_events = db.query(models.Event).count()
    total_tickets = db.query(models.Ticket).count()
    total_revenue = db.query(models.Event).all()
    
    tickets = db.query(models.Ticket).all()
    revenue = sum(
        db.query(models.Event).filter(models.Event.id == t.event_id).first().price
        for t in tickets
    )
    
    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_tickets": total_tickets,
        "total_revenue": revenue
    }

@router.post("/events", response_model=schemas.EventSchema)
def admin_create_event(
    event: schemas.EventSchema,
    token: str,
    db: Session = Depends(get_db)
):
    get_admin_user(token, db)
    db_event = models.Event(**event.model_dump(exclude={"id"}))
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/events/{event_id}")
def admin_delete_event(
    event_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    get_admin_user(token, db)
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}

@router.get("/users")
def get_all_users(token: str, db: Session = Depends(get_db)):
    get_admin_user(token, db)
    return db.query(models.User).all()

@router.get("/tickets")
def get_all_tickets(token: str, db: Session = Depends(get_db)):
    get_admin_user(token, db)
    return db.query(models.Ticket).all()