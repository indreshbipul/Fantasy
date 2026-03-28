import { WebSocket } from "ws";
import { latestTickers } from "../services/market_Stream.service.js";
import { dashboardRoom, coinRooms } from "../routes/stream.route.js";
import { coin_Tickers } from "../services/coin_stream.service.js";
import { topGainer, topLosser } from "../utils/topCoinCalculator.js";

interface BinanceTickerStream {
  stream: string
  data: {
    s: string
    c: string
    l: string
    h: string
    o: string
    p: string
    P: string
    q: string
  }
}

function streamController() {

  setInterval(() => {
    const gainer = topGainer()
    const losser = topLosser()

    const payload = JSON.stringify({
      latestTickers,
      gainer,
      losser
    })

    dashboardRoom.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload)
      }
    })

  }, 1000)

  setInterval(() => {

    const ticker = coin_Tickers as BinanceTickerStream

    coinRooms.forEach((room, coin) => {

      let payload = null

      if (coin && ticker) {

        if (ticker.stream === `${coin.toLowerCase()}usdt@ticker`) {

          const symbol = ticker.data.s.replace("USDT", "")

          payload = JSON.stringify({
            coinTicker: {
              symbol,
              currentPrice: Number(ticker.data.c),
              lowPrice_24h: Number(ticker.data.l),
              highPrice_24h: Number(ticker.data.h),
              openPrice_24h: Number(ticker.data.o),
              priceChange_24h: Number(ticker.data.p),
              priceChangePercent_24h: Number(ticker.data.P),
              volume_24h: Number(ticker.data.q),
            }
          })
        }
      }

      if (!payload) return

      room.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload)
        }
      })

    })

  }, 1000)
}

export default streamController