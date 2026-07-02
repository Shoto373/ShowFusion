from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationCreate(BaseModel):
    name: str
    phone: str
    event_type: str
    date: str
    time: Optional[str] = None
    comment: Optional[str] = None

class Application(ApplicationCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ReviewCreate(BaseModel):
    author: str
    text: str
    rating: int
    created_at: Optional[datetime] = None

class Review(ReviewCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PortfolioItemCreate(BaseModel):
    type: str
    image: str
    title: str

class PortfolioItem(PortfolioItemCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SiteSettingCreate(BaseModel):
    value: str

class SiteSetting(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ServiceCreate(BaseModel):
    key: str
    title: str
    description: str
    features: str
    image: str
    icon_name: str
    price: str

class Service(ServiceCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
