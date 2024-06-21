from models.history import Historys
from models.user import Users
from sqlalchemy.orm import Session


def fetchHistory( db: Session,user):
    try:
        history = db.query(Historys).filter(Historys.user_id == user.id).order_by(Historys.createdAt.desc()).all()
        if history==None:
            return "No items found"
        return history
    except Exception as e:
        print(e)
        raise e

    
    