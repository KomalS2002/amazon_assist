from fastapi import FastAPI,APIRouter,Depends
from dto.userRequest import AuthRequestDTO
from sqlalchemy.orm import Session
from views.user import createUser
from database.dbconnect import get_db,Base
from sqlalchemy.orm import Session
from models.user import Users
from authUtils.JWTBearer import JWTBearer
from views.history import fetchHistory

router = APIRouter(prefix="/history")


@router.get("/all")
async def history(db:Session = Depends(get_db)):
    return fetchHistory(db)

