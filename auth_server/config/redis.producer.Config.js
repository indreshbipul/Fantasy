const redis = require('ioredis');

const redisProducer_Client = new redis({
    host: process.env.redis_Host,
    port: process.env.redis_Port,

    retryStrategy(times) {
        console.log(`Retrying Redis... Attempt ${times}`);
        return Math.min(times * 50, 2000); 
    }
})

redisProducer_Client.on("connect", () => {
  console.log("Producer Redis Connected");
});

redisProducer_Client.on("error", (err) => {
  console.error("Producer Redis Connection Error:", err);
});

module.exports =  redisProducer_Client;