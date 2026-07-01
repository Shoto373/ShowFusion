from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base
from datetime import datetime, timezone

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String)
    event_type = Column(String)
    date = Column(String)
    comment = Column(Text, nullable=True)
    status = Column(String, default="Новая")
    tg_user_id = Column(Integer, nullable=True) # To store the Telegram User ID if created from bot
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    author = Column(String)
    text = Column(Text)
    rating = Column(Integer)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PortfolioItem(Base):
    __tablename__ = "portfolio_items"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # e.g. 'fire', 'smoke', 'light', 'fountain'
    image = Column(String) # URL or path to image
    title = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SiteSetting(Base):
    __tablename__ = "site_settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(Text)
    description = Column(String, nullable=True)
