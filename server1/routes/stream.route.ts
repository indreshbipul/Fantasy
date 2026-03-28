import { WebSocketServer } from "ws";
import type { Server } from "http";
import { coin_Event } from "../services/coin_stream.service.js";
import streamController from "../controllers/stream.controller.js";

interface socketMessage {
    type: "SUBSCRIBE" | "UNSUBSCRIBE";
    channel: "DASHBOARD" | "COINDETAILS";
    coin : string,
}

const dashboardRoom = new Set<any>()
const coinRooms = new Map<string, Set<any>>()
const activeCoins = new Set<string>()

function streamRoutes(server: Server) {
    const wsClient = new WebSocketServer({server, path: "/stream"});
    wsClient.on("connection", (ws) => {
        ws.on("message", (msg) => {
            const data: socketMessage = JSON.parse(msg.toString())
            // Subscribe dashboard summery
            if (data.type === "SUBSCRIBE" && data.channel === "DASHBOARD") {
                dashboardRoom.add(ws)
            } 

            // Unsubscribe dashboard summery
            if (data.type === "UNSUBSCRIBE" && data.channel === "DASHBOARD") {
                dashboardRoom.delete(ws)
            }

            // Subscribe COIN
            if (data.type === "SUBSCRIBE" && data.channel === "COINDETAILS" && data.coin) {
                if(!coinRooms.has(data.coin)){
                    coinRooms.set(data.coin, new Set())
                }
                if(coinRooms.get(data.coin)?.size === 0 && !activeCoins.has(data.coin) ){
                    activeCoins.add(data.coin)
                    coin_Event({type: "SUBSCRIBE", channel: "COINDETAILS", coin: data.coin})
                }
                coinRooms.get(data.coin)!.add(ws)
            }

            // unsubscribe coin
            if (data.type === "UNSUBSCRIBE" && data.channel === "COINDETAILS" && data.coin) {
                coinRooms.get(data.coin)?.delete(ws)
                if(coinRooms.get(data.coin)?.size == 0){
                    coin_Event({type: "UNSUBSCRIBE", channel: "COINDETAILS", coin: data.coin})
                    activeCoins.delete(data.coin)
                }
            }
        })
        ws.on("close", () => {
            dashboardRoom.delete(ws)
            coinRooms.forEach(room => room.delete(ws))
        })
    });
  
}
streamController()

export {dashboardRoom, coinRooms}
export default streamRoutes
