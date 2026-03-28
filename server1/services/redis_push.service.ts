// import { redisClient } from "../config/redis.config.js";
// import { latestTickers } from "./market_Stream.service.js"

// setInterval(async () => {
//   if (!redisClient.isOpen) return;

//   const pipeline = redisClient.multi();

//   for (const symbol in latestTickers) {
//     pipeline.hSet("ticker", symbol,                 
//       JSON.stringify({
//         s: latestTickers[symbol]?.s,
//         c: latestTickers[symbol]?.c, // last price
//         p: latestTickers[symbol]?.P  // % change
//       })
//     );
//   }

//   await pipeline.exec();
//   await redisClient.publish("ticker:update", JSON.stringify(Object.values(latestTickers)));

// }, 900);
// //