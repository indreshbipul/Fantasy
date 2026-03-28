from fastapi import APIRouter

Router = APIRouter()

@Router.get('/api/mail')
def send():
    return "sucess"