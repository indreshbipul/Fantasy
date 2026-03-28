const transactionModel = require("../model/transectionModel");
const mongoose = require('mongoose');
const paperdepositModel = require('../model/paperdepositModel');
const ledgerService = require('../services/ledger.Service');
const walletService = require('../services/wallet.Service')


class FlowError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type;
  }
}

async function paper_DepositeFlow(transactionId){
    const session = await mongoose.startSession();
    try{
        await session.withTransaction(async () => {
            let transaction = await transactionModel.findOneAndUpdate(
                {_id : transactionId, status : "INITIATED"},
                {$set : {status : "PROCESSING" }},
                {new : true , session}
            );
            if(!transaction){
                transaction = await transactionModel.findOne({_id : transactionId});
                if(!transaction) {
                    throw new FlowError("SYSTEM", "Transaction not found");
                }
            }

            
            //Limit on deposite
            const paperLimit = await paperdepositModel.findOneAndUpdate(
                {walletId : transaction.walletId, 
                    $expr: {$lte: [{ $add: ["$usedLimit", transaction.amount] },"$weeklyLimit"]}},
                {$inc : {usedLimit : transaction.amount }},
                {new : true, session}
            );
            if(!paperLimit){
                throw new FlowError("BUSINESS", "Exceeded Weakly Limit");
            }

            // Crediting the money
            const creditFund = await walletService.depositAmountCredit(transaction.amount, transaction.walletId, transaction.accountId, session)
            if(!creditFund.res){
                throw new FlowError("SYSTEM", "Fund Credit Failed");
            }

            // creating ledger
            const ledger = await ledgerService.createDepositLedger(transaction, session);
            if(!ledger){
                throw new FlowError("SYSTEM", "Ledger creation failed");
            }

            // Marking Deposite Completed
            transaction = await transactionModel.findOneAndUpdate(
                {_id : transactionId}, 
                {$set : {status : "SUCCESS", remark : "Paper Deposite Completed"}},
                {new : true, session}
            )
            
        })
        return "SUCCESS"
    }
    catch(err){
        // BUSINESS ERROR - mark failed
        if(err.type === "BUSINESS"){
            await transactionModel.updateOne(
                {_id: transactionId },
                { $set: { status: "FAILED", remark: "Exceeded Weakly Limit" } }
            );
            return "FAILED";
        }

        // SYSTEM ERROR - log + retry
        else {
            console.error("System error:", err);
            return "RETRY"
        }
    }
    finally{
        session.endSession();
    }
}

module.exports = {paper_DepositeFlow}