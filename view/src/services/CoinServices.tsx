// const uri = "http://127.0.0.1:3000"
const uri = "http://api.fantasy.ibipul.space/market"

const getCoins = async()=>{
    try{
        const response = await fetch(`${uri}/api/getcoins`,{
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            },
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}

const coinDetails = async(coinSymbol : string)=>{
    try{
        const response = await fetch(`${uri}/api/getcoindetails`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({payload : coinSymbol})
        })
        const res = await response.json()
        return {res, status : response.status}
    }
    catch(err){
        throw err
    }
}

const coinServices = {
    coinDetails, getCoins
}
export default coinServices