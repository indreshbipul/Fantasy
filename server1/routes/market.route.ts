import { Router } from "express";
import { getCoins, getCoinDetails } from "../controllers/market.controller.js";

const marketRoute = Router()

marketRoute.get("/getcoins", getCoins)
marketRoute.post("/getcoindetails", getCoinDetails )

export default marketRoute