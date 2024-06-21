from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import DB_HOST,DB_NAME,DB_PASSWORD,DB_USERNAME

SQLALCHEMY_DATABASE_URL = f"postgresql+psycopg2://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_size=36, max_overflow=64)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()