import WebSocket from "ws";

const URL: string = process.env.STREAM_SERVICE_URI || "";
let ws: WebSocket;

interface Ticker {
  currentPrice: number;
  changePercent: number;
  volume24h: number;
}
interface BinanceTicker {
  s: string;   // symbol (BTCUSDT)
  c: string;   // current price
  P: string;   // % price change
  q: string;   // 24h volume (USDT)
}

const latestTickers: Record<string, Ticker> = {};

function connect() {
  ws = new WebSocket(URL);

  ws.on("open", () => {
    console.log("Connected to Binance WebSocket");
  });

  ws.on("message", (data) => {
    const arr = JSON.parse(data.toString());
    for (const t of arr) {
      if (!t.s.endsWith("USDT")) continue;
      const coin = t.s.replace("USDT", "");

      latestTickers[coin] = {
        volume24h: Number(t.q),         
        currentPrice: Number(t.c) * 95,
        changePercent: Number(t.P)        
      };
    }
  });

  ws.on("close", () => {
    console.log("Connection closed. Reconnecting in 3s...");
    setTimeout(connect, 3000);
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
    ws.close();
  });
}

export default connect;
export { latestTickers };
