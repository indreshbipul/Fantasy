from fastapi import FastAPI

from core.http_Client import async_client
from routes.marketRoutes import router as marketRouter
from routes.mailRoutes import Router as mailRouter

app = FastAPI()
app.include_router(marketRouter)
app.include_router(mailRouter)

@app.get('/')
def start():
    return {'message' : "python server started"}
