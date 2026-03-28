from core.http_Client import async_client
from config.dotenvConfig import env
from config.dbConfig import market_Db
from config.dbConfig import coin_Db
from pymongo import UpdateOne


async def updateCoin():

    # Fetching Market Data
    response = await async_client.get(env("MARKET_URI"))
    if response.status_code != 200:
        return {"message": "MARKET API SERVER IS NOT RESPONDING "}
    coins = response.json()
    coins = coins["data"]

    # Fetchind Descriptions
    desc = await async_client.get(env("DESC_URI"))
    if desc.status_code != 200:
        return {"message": "DESCRIPTION API SERVER IS NOT RESPONDING "}
    desc = desc.json()

    operations = []

    for coin in coins:
        symbol = coin["assetCode"]
        desc_key = f"symbol_desc_{symbol}"
        description = desc.get(desc_key, "NA")

        coin_data = async_client.get(env(f"COIN_URI{symbol}"))
        
        operations.append(
            UpdateOne(
                {"symbol": coin["assetCode"]},
                {
                    "$set": {
                        "name": coin["assetName"],
                        "symbol": coin["assetCode"],
                        "image": f"https://assets.coincap.io/assets/icons/{symbol.lower()}@2x.png",
                        "trading": coin["trading"],
                        "tags": coin["tags"],
                        "etf": coin["etf"],
                        "description": description
                    }
                },
                upsert=True
            )
        )

    if operations:
        await market_Db.bulk_write(operations)

    return {"message": "new coins Updated"}


async def getCoin():
    response =  market_Db.find({},{"_id" : 0, "__v" : 0})
    data = await response.to_list()
    return data
    
async def getCoinDetails(payload):
    data = await coin_Db.find_one({"symbol" : payload}, {"_id" : 0, "__v" : 0})
    if data:
        return data
    
    # call api to fetch coin data
    response = await async_client.get(f"{env('COIN_URI')}{payload}")
    if response.status_code != 200:
        return {"message" : "COIN DETAILS API IS NOT WORKING"}
    res = response.json()
    res = res["data"]
    if res is not None :
        details = {
            # --- Identity ---
            "name": res.get("sb"),         
            "symbol": res.get("alias"),    
            
            # --- Numbers  ---
            "marketCap": res.get("mc"),
            "rank": res.get("rk"),
            "circulatingSupply": res.get("cs"),
            "maxSupply": res.get("ms"),
            "totalSupply": res.get("ts"),
            "volume_24h": res.get("v"),
            "volumePercent_marketCap": res.get("vpm"),
            
            # --- Prices ---
            "allTime_hp": res.get("athpu"),
            "allTime_lp": res.get("atlpu"),
            "allTimeLowDate": res.get("ald"),
            "issuePrice": res.get("ipu"),
            "fullDiluted_marketCap": res.get("fdmc"),
            
            # --- Lists (Arrays) ---
            "explorers": res.get("eu"),   
            
            # ---  Links  ---
            "website": res.get("ws"),       
            "whitepaper_url": res.get("wpu"),
            "research_url": res.get("rsu"), 
            
            # --- X Social Media ---
            "x_url": res.get("xu"),
            "x_handle": res.get("xhn"),
            "x_message": res.get("xlm"),
            "x_feed": res.get("fu"),
            
            # --- GitHub ---
            "github_url": res.get("ru"),
            "github_desc": res.get("rd"),
            "github_repo": res.get("rhn"),
            
            # --- Misc ---
            "nerd_stat": res.get("hhi")
        }
        await coin_Db.insert_one(details.copy())
        return details
    
 