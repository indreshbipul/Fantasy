const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userAccount",
        required: true,
        index: true
    },
    walletId :{
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "Wallet",
    },
    counterWalletId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Wallet",
    },
    baseType :{
        type : String,
        enum: ["FIAT", "CRYPTO"],
        uppercase: true,
        required : true,
    },
    baseSymbol :{
        type : String,
        uppercase: true,
        required : true,
    },
    quoteType :{
        uppercase: true,
        enum: ["FIAT", "CRYPTO", null],
        type : String,
    },
    quoteSymbol :{
        type : String,
        uppercase: true,
    },
    amount :{
        type: mongoose.Schema.Types.Decimal128,
    },
    quantity : {
        type : mongoose.Schema.Types.Decimal128,
         
    },
    status :{
      type : String,
      enum: ["INITIATED", "PAYMENT_CONFIRMED", "PROCESSING", "SUCCESS", "FAILED"],
      default : "INITIATED",
    },
    transactionType :{
        type : String,
        enum : ["BUY", "SELL", "TRANSFER", "DEPOSIT", "WITHDRAW"],
        required : true,
        index : true,
    },
    transactionId :{
        type : String,
        unique : true, 
        required : true,
        index : true,
    },
    transactionMode :{
        type : String,
        enum : ["MARKET", "LIMIT"],
        index : true,
    },
    transactionRef :{
        type : String,
        required : true,
        index : true,
    },
    idempotencyKey :{
        type : String,
        required : true,
        index : true,
    },
    purpose :{
        type : String,
        default : null
    },
    gatewayId: {
        type: String,
        index: true
    },
    gatewayName: {
        type: String,
        enum: ["RAZORPAY", "STRIPE", null],
        default: null
    },
    remark :{
        type : String,
        default : null
    },
},
{timestamps: true})

transactionSchema.index({ walletId: 1, createdAt: -1 });
transactionSchema.index({ counterWalletId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, status: 1, createdAt: -1 });
transactionSchema.index({userId : 1, transactionRef : 1}, {unique : true})
transactionSchema.index({accountId: 1, idempotencyKey : 1 },{unique : true})

module.exports = new mongoose.model("Transaction", transactionSchema)