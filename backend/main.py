from fastapi import FastAPI
from routes import assist
from routes import user
from routes import history
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
# app = FastAPI(title="AmazonAsist")
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]
app = FastAPI(middleware=middleware)
app.include_router(assist.router, prefix="/assist")
app.include_router(user.router)
app.include_router(history.router)

@app.get("/")
def server_started():
    return {"message": "Server started successfully"}
