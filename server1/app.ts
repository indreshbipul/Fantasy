import "dotenv/config";
import express from "express"
import type { Request, Response } from "express";
import http from "http"
import cors from "cors"

import market_stream from "./services/market_Stream.service.js"
import redis from "./config/redis.config.js"
import streamRoutes from "./routes/stream.route.js"
import marketRoute from "./routes/market.route.js";
import coin_stream from "./services/coin_stream.service.js"

const app = express()
const server = http.createServer(app);

app.use(cors({
    origin : ['http://localhost:5173', 'http://fantasy.ibipul.space', 'https://fantasy.ibipul.space']
}))
app.use(express.json())
app.get('/',(req : Request,res : Response)=>{
    return res.status(200).json({message : "Server is running"})
})

streamRoutes(server)
app.use('/api',marketRoute)

const port : number= Number(process.env.PORT)
server.listen(port ,()=>{
    market_stream()
    coin_stream()
    // redis()
    console.log(`SERVER IS RUNNING ON PORT ${port}.`)
})