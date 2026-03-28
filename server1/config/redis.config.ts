import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URI || ""
});

redisClient.on("connect", () => {
  console.log("Redis event: connected");
});

redisClient.on("end", () => {
  console.log("Redis event: disconnected");
});

redisClient.on("error", (err) => {
  console.error("Redis runtime error:", err.message);
});


const redis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect(); 
    }
    return true; 
  } 
  catch (err) {
    console.log(err)
    return Promise.reject(false); 
  }
};

export default redis;
export { redisClient };


