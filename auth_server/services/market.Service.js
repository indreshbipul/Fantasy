async function getPrice(symbol){
    try{
        const marketUri = `${process.env.MARKET_PRICE_URI}${symbol.toUpperCase()}USDT`
        const response  = await fetch(marketUri,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            }
        })
        if(response.status === 200){
            const respo = await response.json()
            return {res : true, data : respo.price}
        }
        return {res : false, message : "Market Server is not working"}
    }
    catch(err){
        return {res : false, message : "Market Server is not working"}
    }
}

module.exports = {getPrice}