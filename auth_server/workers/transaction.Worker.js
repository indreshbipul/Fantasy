const redisWorker = require("../config/redis.worker.Config");
const redisProducer = require("../config/redis.producer.Config");
const depositeFlow = require('../flows/deposit.flow');
const buy_Market_Flow = require('../flows/buy.flow');
const {sell_Market_Flow} = require("../flows/sell.flow");


const start_TransactionWorker = async()=>{
    while(true){
        try{
            const job = await redisWorker.txn_worker.brpoplpush("txn-queue", "process-queue",0);
            if (!job) continue;
            const work = JSON.parse(job);

            // For Paper Deposite
            if(work.type === "DEPOSIT" && work.accountType === "PAPER"){
               const res = await depositeFlow.paper_DepositeFlow(work.transactionId);
               if(res === "SUCCESS" || res === "FAILED"){
                    await redisWorker.txn_worker.lrem("process-queue", 1, job);
               } 
               if(res === "RETRY"){
                    await redisProducer.lpush("txn-retry-queue", job);
                    await redisWorker.txn_worker.lrem("process-queue", 1, job);
               }
            }
            
            // For Buy  
            if(work.type === "BUY"){
                const res = await buy_Market_Flow(work.transactionId);
                if(res === "SUCCESS" || res === "FAILED"){
                    await redisWorker.txn_worker.lrem("process-queue", 1, job);
                } 
                if(res === "RETRY"){
                    await redisProducer.lpush("txn-retry-queue", job);
                    await redisWorker.txn_worker.lrem("process-queue", 1, job);
                }
            }

            // For Sell
            if(work.type === "SELL"){
                const res = await sell_Market_Flow(work.transactionId);
                if(res === "SUCCESS" || res === "FAILED"){
                    await redisWorker.lrem("process-queue", 1, job);
                } 
                if(res === "RETRY"){
                    await redisProducer.lpush("txn-retry-queue", job);
                    await redisWorker.lrem("process-queue", 1, job);
                }
            }
        }
        catch(err){ 
            console.log("error in worker",err)
            break
        }
    }
}

// const start_Retry_Worker = async()=>{
//     while(true){
//         const job = await redisWorker.txn_Retry_worker.brpoplpush("txn-retry-queue", "process-queue");
//         if (!job) continue;
//         const work = JSON.parse(job);
        
//     }
// }

module.exports = {start_TransactionWorker}