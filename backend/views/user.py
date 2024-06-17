
from dto.userRequest import AuthRequestDTO
from dto.userResponse import LoginResponseDTO
from database.dbconnect import get_db
from sqlalchemy.orm import Session
from datetime import datetime,timedelta
from dotenv import load_dotenv
import os
from google.oauth2 import id_token
from google.auth.transport import requests
from models.user import Users
import jwt
from database.config import JWT_SECRET,GOOGLE_CLIENT_ID


def gLogin(authRequestDTO: AuthRequestDTO, db: Session):
    try:
        if authRequestDTO.idToken == None:
            raise "InvalidIdTokenException"
        request = requests.Request()
        id_info = id_token.verify_oauth2_token(
            authRequestDTO.idToken, request, GOOGLE_CLIENT_ID
        )
        email = id_info["email"]
        name = id_info["name"]
        user = db.query(Users).filter(Users.email == email).first()
        if user is None:
            user = Users(
                email=email,
                name=name,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    except Exception as e:
        raise "InvalidIdTokenException"



def createUser(authRequestDTO: AuthRequestDTO, db):
    try:
        user = gLogin(authRequestDTO, db)
        return LoginResponseDTO(
            token=jwt.encode(
                {
                    "email": user.email,
                    "id": str(user.id),
                    "expiry_time": str(datetime.now() - timedelta(days=7)),
                },
                algorithm="HS256",
                key=JWT_SECRET,
            ),
            email=user.email,
            name=user.name,
            createdAt=str(user.createdAt),
            updatedAt=str(user.updatedAt),
        )
    except Exception as e:
        print(str(e))
        raise e

