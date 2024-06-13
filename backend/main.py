from fastapi import FastAPI
from routes.user import router
app = FastAPI(title="AmazonAsist")

app.include_router(router)

@app.get("/")
def server_started():
    return {"message": "Server started successfully"}