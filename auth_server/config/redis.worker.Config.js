const redis = require('ioredis');

function createWorkerClient(name){
  const redisWorker_Client = new redis({
      host: process.env.redis_Host,
      port: process.env.redis_Port,

      retryStrategy(times) {
          console.log(`Retrying Redis... Attempt ${times}`);
          return Math.min(times * 50, 2000); 
      }
  })

  redisWorker_Client.on("connect", () => {
    console.log(`${name} Redis Connected`);
  });

  redisWorker_Client.on("error", (err) => {
    console.error(`${name} Redis Connection Error:`, err);
  });

  return redisWorker_Client;
}

const txn_worker = createWorkerClient("txn_worker");
const txn_Retry_worker = createWorkerClient("txn_Retry_worker");


module.exports =  {txn_worker, txn_Retry_worker};  