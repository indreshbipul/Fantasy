from motor.motor_asyncio import AsyncIOMotorClient
from config.dotenvConfig import env

uri = env("MONGO_URI")

client = AsyncIOMotorClient(uri)
db = client["fantasy"]

market_Db = db["marketData"]
coin_Db = db["coinsData"]
