import { createContext, useEffect, useState } from "react";
import coinServices from "../services/CoinServices";

export const CoinContext = createContext(null)

export function CoinProvider({children}){
    const [error, setError] = useState<String | null>(null)
    const [coinsData, setCoinsData] = useState<object | null>(null)
    useEffect(()=>{
        coinServices.getCoins()
        .then(({res, status})=>{
            if(status !== 200){
                setError(res.message)
                return 
            }
            setCoinsData(res?.data)
        })
        .catch(()=>{
            setError("Please try agian after sometime")
        })
    },[])
    return(
        <CoinContext value={{coinsData, setCoinsData, error}}>{children}</CoinContext>
    )

}
