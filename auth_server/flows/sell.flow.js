const mongoose = require('mongoose');
const transactionModel = require('../model/transectionModel');
const walletService = require("../services/wallet.Service");
const orderService = require("../services/order.Service");
const accountModel = require("../model/accountModel");
const marketService = require('../services/market.Service');
const Decimal = require('decimal.js');
const ledgerService = require("../services/ledger.Service");

class FlowError extends Error {
    constructor(type,error){
        super(error),
        this.type = type
    }
}

async function sell_Market_Flow(transactionId){
    // Getting transaction Details
    const session = await  mongoose.startSession();
    try{
        session.startTransaction()

        let transaction = await transactionModel.findOneAndUpdate(
            {_id : transactionId , status : "INITIATED"},
            {$set : {status : "PROCESSING"}},
            {new : true , session},
        );
        if(!transaction){
            transaction = await transactionModel.findOne({_id : transactionId});
            if(!transaction){
                session.abortTransaction()
                throw new FlowError("SYSTEM", "Transaction not found in Sell");
            }
        };

        // Fetching Price and Calculating quantity
        const price = await marketService.getPrice(transaction.quoteSymbol);
        if(price.res === false){
            session.abortTransaction()
            throw new FlowError("system", "Error in fetching Price")
        }
        const executionPrice = new Decimal(price.data).mul(95);
        let quantity;
        let amount
        if(transaction.quantity){
            quantity = new Decimal((transaction.quantity).toString());
            amount = executionPrice.mul(quantity).toDecimalPlaces(8);
        }
        if(transaction.amount){
            amount = new Decimal((transaction.amount).toString());
            quantity = amount.div(executionPrice).toDecimalPlaces(8);
        }

        // Holding the asset
        const hold = await walletService.amountHold(quantity, transaction.counterWalletId, transaction.accountId, session);
        if(hold.res === false && hold.remark === "Insufficient Fund"){
            session.abortTransaction()
            throw new FlowError("Funds", "Insufficient Fund");
        }
        if(hold.res === false && hold.remark === "error"){
            session.abortTransaction()
            throw new FlowError("SYSTEM", "Error in amount Holding in Sell");
        }
        
        // Creating Order
        const order = await orderService.createOrder(transaction, executionPrice, quantity, "SELL", session);
        if(order.res === false){
            session.abortTransaction()
            throw new FlowError("Error in creating Order in Sell");
        }
        const account = await accountModel.findOne({_id : transaction.accountId , userId : transaction.userId});
        if(!account){
            session.abortTransaction()
            throw new FlowError("SYSTEM" ,"Error in Fetching Account in Sell");
        }

        // Order Mark Complete
        const orderUpdate = await orderService.markComplete(order.remark[0]._id, session);
        if(!orderUpdate){
            session.abortTransaction()
            throw new FlowError("SYSTEM", "Order Update Failed in order_MarketSell_FLow");
        }

        //Release asset
        const release = await walletService.sellTradeAmountRelease(quantity, transaction.counterWalletId, transaction.accountId, session)
        if(!release.res){
            session.abortTransaction()
            throw new FlowError("RETRY", release.remark)
        }

        // Creadit Amount
        const credit = await walletService.sellTradeAmountCredit(amount, transaction.walletId, transaction.accountId, session)
        if(!credit.res){
            session.abortTransaction()
            throw new FlowError("RETRY", credit.remark)
        }

        // ledger Update
        const ledger = await ledgerService.createTradeLedger(transaction, order.remark[0]._id, "CREDIT", "DEBIT", "TRADE_SELL", quantity, amount, session);
        if(!ledger.res){
            session.abortTransaction()
            throw new FlowError("RETRY", ledger.remark)
        }

        // Mark SUCCESS
        const transactionComp = await transactionModel.updateOne(
            { _id: transaction._id },
            { $set: { status: "SUCCESS", remark : "Market Mode", quantity : quantity, amount : amount }},
            { session },
        );
        if(!transactionComp){
            session.abortTransaction();
            throw new FlowError("SYSTEM", "Ledger creation failed");
        }
        await session.commitTransaction()
    }
    catch(err){
        if(err.type === "FUNDS"){
            await transactionModel.findOneAndUpdate(
                {_id : transactionId},
                {$set  : {status : "FAILED", remark : err.message}}
            )
            console.log("system Error" , err);
            return {res : "FAILED"};
        }
        else{
            console.log("system Error" , err);
            return {res : "RETRY"};
        }
    }
    finally{
        session.endSession();
    }
}


module.exports = {sell_Market_Flow}