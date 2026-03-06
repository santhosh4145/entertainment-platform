from pydantic import BaseModel
from typing import Optional

class EventSchema(BaseModel):
    id: int
    title: str
    date: str
    location: str
    price: float

    class Config:
        from_attributes = True

class ArtistSchema(BaseModel):
    id: int
    name: str
    genre: str
    subgenre: str | None
    bio: str | None
    monthly_listeners: str | None

    class Config:
        from_attributes = True

class UserRegister(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    is_admin: bool

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TicketCreate(BaseModel):
    event_id: int

class TicketResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    purchased_at: str
    status: str

    class Config:
        from_attributes = True

class MerchSchema(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    category: str
    stock: int
    image_url: str | None

    class Config:
        from_attributes = True

class MerchCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    stock: int = 100
    image_url: Optional[str] = None