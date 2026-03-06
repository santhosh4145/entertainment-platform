from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.TokenResponse)
def register(user: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        (models.User.email == user.email) | 
        (models.User.username == user.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email or username already exists")
    
    new_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password),
        created_at=str(datetime.utcnow())
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(token: str, db: Session = Depends(get_db)):
    from app.auth import decode_token
    from jose import JWTError
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")