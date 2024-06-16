from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    JSON,
    UUID,
    DateTime,
    Enum,
)
from sqlalchemy.orm import relationship
from database.dbconnect import Base
from uuid import uuid4
from sqlalchemy.sql import func

class Users(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid4)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String, nullable=True)
    createdAt = Column("created_at", DateTime(timezone=True), server_default=func.now())
    updatedAt = Column("updated_at", DateTime(timezone=True), onupdate=func.now())
