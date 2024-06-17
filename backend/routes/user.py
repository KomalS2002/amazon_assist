from fastapi import FastAPI,APIRouter,Depends
from dto.userRequest import AuthRequestDTO
from sqlalchemy.orm import Session
from database.dbconnect import get_db
from views.user import createUser

router = APIRouter(prefix="/auth")


@router.post("")
async def loginorsignup(authrequestDTO: AuthRequestDTO, db:Session = Depends(get_db)):
    return createUser(authrequestDTO,db)

