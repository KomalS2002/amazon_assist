from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    JSON,
    UUID,
    DateTime,
)
from sqlalchemy.orm import relationship
from database.dbconnect import Base
from uuid import uuid4
from sqlalchemy.sql import func


class Historys(Base):
    __tablename__ = "historys"

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_name = Column(String, nullable=False, default="")
    link = Column(String, nullable=True)
    createdAt = Column("created_at", DateTime(timezone=True), server_default=func.now())
    updatedAt = Column("updated_at", DateTime(timezone=True), onupdate=func.now())
    user_id = Column(UUID, ForeignKey("users.id"))
    user = relationship("Users", back_populates="history")
