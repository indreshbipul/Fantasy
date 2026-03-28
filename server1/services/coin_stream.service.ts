import WebSocket from "ws";

const uri : string = `${process.env.COIN_SERVICE_URI}`
let ws: WebSocket | null = null
let coin_Tickers : object | null = null

function connect(){
    ws = new WebSocket(uri)

    ws.on("open",()=>{
        console.log("Connected to Binance WebSocket 2");
    })

    ws.on("message",(msg)=>{
        const data = JSON.parse(msg.toString())
        coin_Tickers = data
    })

    ws.on("close", () => {
        console.log("Connection closed for 2. Reconnecting in 3s...");
        setTimeout(connect, 3000);
    });

    ws.on("error", (err)=>{
        console.error("WebSocket error:", err.message);
        ws!.close();

    })
}
let reqId = 1
interface Event{
    type : "SUBSCRIBE" | "UNSUBSCRIBE"
    coin: string,
    channel : "COINDETAILS"
}

function coin_Event(request : Event){
    if(!ws || ws.readyState !== WebSocket.OPEN){
        return
    }
    const data = {method : request.type, params: [`${request.coin.toLowerCase()}usdt@ticker`], id : reqId++ }
    ws.send(JSON.stringify(data))
}

export{coin_Event, coin_Tickers}
export default connect
