from models.history import Historys
from models.user import Users
from sqlalchemy.orm import Session


def fetchHistory( db: Session):
    try:
        history = db.query(Historys).order_by(Historys.createdAt.desc())[:6]
        if history==None:
            return "No items found"
        return history
    except Exception as e:
        print(e)
        raise e

    
    