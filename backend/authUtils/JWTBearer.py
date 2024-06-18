
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.requests import Request
from models.user import Users
from database.config import JWT_SECRET
from database.dbconnect import SessionLocal
import jwt

class JWTBearer(HTTPBearer):
    def __init__(self,auto_error:bool = True): 
        super(JWTBearer,self).__init__(auto_error=auto_error)
    
    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer,self).__call__(request)
        if credentials:
            if not credentials.scheme == 'Bearer':
                raise "InvalidJWTokenException"
            try:
                db = SessionLocal()
                data = jwt.decode(credentials.credentials,JWT_SECRET,algorithms="HS256")
                user = db.query(Users).filter(Users.id == data['id']).first()
                db.close()
                if user is  None:
                    raise "UserNotFoundException"
                return user
            except Exception as e:
                print(str(e))
                raise "InvalidJWTokenException"
        else:
            "TokenNotFoundException"