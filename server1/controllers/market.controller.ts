import type { Request, Response } from "express"

const getCoins = async (req : Request,res : Response)=>{
    try{
        const uri = `${process.env.SERVER_3_URI}/api/getcoins`
        const response = await fetch(uri,{
            method : "GET",
            headers : {
                "Content-Type" : "application/json"
            },
        })
        if(!response || response.status != 200){
            console.log("SERVER 3 is not responding")
        }
        const data : object = await response.json()
        res.status(200).json({message : "sucess", data})
    }
    catch(err){
        res.status(500).json({message : "Please try again in a Moment"})
    }

}

const getCoinDetails = async (req:Request, res:Response)=>{
    const coinSymbol = req.body.payload
    const uri = `${process.env.SERVER_3_URI}/api/getcoindetails`
    const response = await fetch(uri,{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({payload :coinSymbol})
    })
    if(!response || response.status != 200){
        console.log("SERVER 3 is not responding")
    }
    const data : object = await response.json() 
    res.status(200).json({message : "sucess", data})
}

export {getCoins, getCoinDetails}