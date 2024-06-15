from fastapi import FastAPI
# from routes.user import router
from routes import assist
app = FastAPI(title="AmazonAsist")




app.include_router(assist.router, prefix="/assist")

@app.get("/")
def server_started():
    return {"message": "Server started successfully"}
