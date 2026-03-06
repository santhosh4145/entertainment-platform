from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/merch", tags=["merch"])

@router.get("/", response_model=list[schemas.MerchSchema])
def get_merch(db: Session = Depends(get_db)):
    return db.query(models.MerchItem).all()

@router.get("/{item_id}", response_model=schemas.MerchSchema)
def get_merch_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.MerchItem).filter(models.MerchItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/", response_model=schemas.MerchSchema)
def create_merch(item: schemas.MerchCreate, token: str, db: Session = Depends(get_db)):
    from app.auth import decode_token
    from jose import JWTError
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user or user.is_admin != "true":
            raise HTTPException(status_code=403, detail="Admin access required")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    db_item = models.MerchItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}")
def delete_merch(item_id: int, token: str, db: Session = Depends(get_db)):
    from app.auth import decode_token
    from jose import JWTError
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user or user.is_admin != "true":
            raise HTTPException(status_code=403, detail="Admin access required")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    item = db.query(models.MerchItem).filter(models.MerchItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}