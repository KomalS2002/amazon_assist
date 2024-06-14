from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from pathlib import Path

dotenv_path = Path('/home/avengers/amazon_assist/backend/.env')
load_dotenv(dotenv_path=dotenv_path)

DB_USERNAME:str = os.getenv('DB_USERNAME')
DB_PASSWORD:str = os.getenv('DB_PASSWORD')
DB_HOST:str = os.getenv('DB_HOST')
DB_NAME:str = os.getenv('DB_NAME')

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