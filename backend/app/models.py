from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=False)
    location = Column(String, nullable=False)
    price = Column(Float, nullable=False)

class Artist(Base):
    __tablename__ = "artists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    subgenre = Column(String)
    bio = Column(String)
    monthly_listeners = Column(String)
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(String, default="false")
    created_at = Column(String, nullable=True)
    
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime
from datetime import datetime

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    purchased_at = Column(String, default=str(datetime.utcnow()))
    status = Column(String, default="confirmed")
    
class MerchItem(Base):
    __tablename__ = "merch"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    stock = Column(Integer, default=100)
    image_url = Column(String, nullable=True)