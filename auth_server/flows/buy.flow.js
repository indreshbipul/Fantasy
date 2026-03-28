const walletService = require('../services/wallet.Service');
const transactionModel = require('../model/transectionModel');
const marketService = require('../services/market.Service');
const Decimal = require('decimal.js');
const orderService = require('../services/order.Service');
const legderService = require('../services/ledger.Service');
const mongoose = require('mongoose');


class FlowError extends Error {
    constructor(type, message) {
        super(message);
        this.type = type;
    }
}

async function buy_Market_Flow(transactionId){
    const session = await mongoose.startSession();
    try {
        // Creating Session and Starting Transaction
        session.startTransaction()

        // Updating transaction status
        let transaction = await transactionModel.findOneAndUpdate(
            { _id : transactionId, status: "INITIATED" },
            { $set: { status: "PROCESSING" } },
            { new: true, session }  
        );
        if(!transaction){
            transaction = await transactionModel.findOne({ _id : transactionId },{ session });
            if(!transaction) {
                session.abortTransaction();
                return {res : false, type : "SYSTEM", message  : "Transaction Not Found"};
            }
        }
        
        // Fetching Price and calculating Quantity or Amount
        const price = await marketService.getPrice(transaction.quoteSymbol);
        if(price.res === false){
            session.abortTransaction();
            return {res : false, type : "", message : "Failed to fetch the price"};

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

        // Holding funds
        const holdResult = await walletService.amountHold(amount, transaction.walletId, transaction.accountId, session);
        if(!holdResult.res && holdResult.remark === "Insufficient Fund"){
            session.abortTransaction();
            throw new FlowError("BUSINESS", "Insufficient Fund");            
        }
        if(!holdResult.res){
            session.abortTransaction();
            throw new FlowError("RETRYABLE", "Hold failed");
        }

        //  Create order
        let order = await orderService.createOrder(transaction, executionPrice, quantity, "BUY", session);
        if(order.res === false){
            session.abortTransaction();
            throw new FlowError("RETRYABLE", "Order creation failed");
        }

        
        // Release fund
        const releaseFund = await walletService.buyTradeAmountRelease(amount, transaction.walletId, transaction.accountId, session);
        if(!releaseFund.res){
            session.abortTransaction();
            throw new FlowError("RETRYABLE", "Release failed");
        }


        // Credit fund
        const creditFund = await walletService.buyTradeAmountCredit(quantity, transaction.counterWalletId, transaction.accountId,executionPrice, session);
        if(!creditFund.res){
            session.abortTransaction();
            throw new FlowError("RETRYABLE", "Credit failed");
        }


        // Mark order complete
        const ordera = await orderService.markComplete(order.remark[0]._id, session);
        if(ordera.res === false){
            session.abortTransaction();
            throw new FlowError("RETRYABLE", "Order completion failed");
        }


        // Create ledger
        const ledger = await legderService.createTradeLedger(transaction, order.remark[0]._id, "DEBIT", "CREDIT", "TRADE_BUY",quantity, amount, session);
        if(!ledger.res){
            session.abortTransaction();
            throw new FlowError("SYSTEM", "Ledger creation failed");
        }

    
        // Mark SUCCESS
        const transactionComp = await transactionModel.updateOne(
            { _id: transaction._id },
            { $set: { status: "SUCCESS", remark : "Market Mode" } },
            { session },
        );
        if(!transactionComp){
            session.abortTransaction();
            throw new FlowError("SYSTEM", "Ledger creation failed");
        }

        await session.commitTransaction();
        return "SUCCESS";

    }
    catch(err){
        if(err.type === "BUSINESS"){
            await transactionModel.updateOne(
                {_id: transactionId },
                { $set: { status: "FAILED", remark: err.message } }
            );
            return "FAILED"
        }
        else if(err.type === "RETRYABLE"){
            return "RETRY"
        }
        else {
            console.error("System error:", err);
            return "RETRY"
        }
    }
    finally{
        session.endSession();
    }
}

module.exports = buy_Market_Flow