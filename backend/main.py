from fastapi import FastAPI

from routes import assist





from routes.user import router
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
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]
app = FastAPI(middleware=middleware)
app.include_router(assist.router, prefix="/assist")
app.include_router(router)







@app.get("/")
def server_started():
    return {"message": "Server started successfully"}
