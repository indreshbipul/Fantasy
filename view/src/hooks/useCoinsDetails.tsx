import { useContext } from "react";
import { CoinContext } from "../context/CoinsContext";

function useCoinContext(){
    const context = useContext(CoinContext)
    return context
}

export default useCoinContext