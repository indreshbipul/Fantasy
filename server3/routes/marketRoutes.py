from fastapi import APIRouter
from controllers import marketController
from pydantic import BaseModel
from typing import List

router = APIRouter()

class CoinRequest(BaseModel):
    payload: str

class CurrentPriceRequest(BaseModel):
    payload : List[str]

@router.get('/api/updatecoins')
async def market():
    res = await marketController.updateCoin()
    return res

@router.get("/api/getcoins")
async def getcoins():
    res = await marketController.getCoin()
    return res

@router.post("/api/getcoindetails")
async def getcoins(req: CoinRequest):
    symbol = req.payload
    res = await marketController.getCoinDetails(symbol)
    return res
    
@router.post("/getcurrentprices")
async def getCurrentPrices(req : CurrentPriceRequest):
    payload = req.payload
    res = await marketController.getCurrentPrice(payload)
    return res