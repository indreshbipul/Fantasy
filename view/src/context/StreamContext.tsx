import { createContext, useEffect, useRef, useState } from "react";

export const StreamContext = createContext(null)

export function StreamProvider({children}){
    let wsRef = useRef<WebSocket | null>(null)
    const [marketStream, setMarketStream] = useState(null)
    const [coinStream, setCoinStream] = useState(null)
    useEffect(()=>{
        // ws://api.fantasy.ibipul.space/market/stream
        const ws = new WebSocket("ws://localhost:3000/stream");
        wsRef.current = ws

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "SUBSCRIBE",
                channel: "DASHBOARD",
            }));
        };
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data && data.latestTickers) {
                setMarketStream(data);
            } 
            else if (data && data.coinTicker) {
                const newCoin = data.coinTicker;
                const symbol = newCoin.symbol; 
                setCoinStream((prev) => ({...prev, [symbol]: newCoin  }));
            }
        };
        ws.onerror = (err) => {
            console.error("WebSocket error", err);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        // return () => {
        //     if (ws.readyState === 1) {
        //         ws.close();
        //     }
        // };

    },[])

    function subscribe(data : object){
        wsRef.current?.send(JSON.stringify(data));
    }
    function unsubscribe(data : object){
        wsRef.current?.send(JSON.stringify(data));
    }
    return(
        <StreamContext.Provider value={{marketStream,coinStream, subscribe, unsubscribe}}>
            {children}
        </StreamContext.Provider>
    )
}