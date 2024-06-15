from fastapi import FastAPI
# from routes.user import router
from routes import text_to_desc
app = FastAPI(title="AmazonAsist")




app.include_router(text_to_desc.router, prefix="/assist")

@app.get("/")
def server_started():
    return {"message": "Server started successfully"}
