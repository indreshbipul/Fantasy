const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userAccount",
        required: true,
        index: true
    },
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
        index: true,
    },
    transactionId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required : true,
        index : true
    },
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        index: true
    },
    assetSymbol:{
        type : String,
        required : true,
        index : true
    },
    amount:{
        type: mongoose.Schema.Types.Decimal128,
        required : true,   
    },
    direction:{
        type: String,
        enum : ["DEBIT", "CREDIT"],
        required : true
    },
    transactionType: {
        type: String,
        enum: ["TRADE_BUY", "TRADE_SELL", "DEPOSIT", "WITHDRAW", "FEE", "ADJUSTMENT"],
        required: true,
        index: true
    },
},{timestamps : true})

ledgerSchema.index({walletId : 1, transactionId : 1}, {unique : true});
ledgerSchema.index({ walletId: 1, createdAt: -1 });

module.exports = mongoose.model("ledger", ledgerSchema)