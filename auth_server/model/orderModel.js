const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usersAccount",
        required: true,
        index: true
    },
    transactionId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required : true,
        index : true
    },
    orderRef: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    orderType: {
        type: String,
        enum: ["BUY", "SELL"],
        required: true,
        index: true
    },
    orderMode: { 
        type: String,
        enum: ["MARKET", "LIMIT",],
        required: true,
        index: true
    },
    baseSymbol: {
        type: String,
        required: true,
        uppercase: true
    },
    quoteSymbol: {
        type: String,
        required: true,
        uppercase: true
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
    },
    quantity: {
        type: mongoose.Schema.Types.Decimal128,
    },
    status: {
        type: String,
        enum: ["OPEN", "PARTIALLY_FILLED", "FILLED", "CANCELLED"],
        default: "OPEN",
        index: true
    },
    filledQuantity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    },

}, { timestamps: true })

orderSchema.index({ baseSymbol: 1, quoteSymbol: 1, orderType: 1, price: 1, status: 1 });

module.exports = new mongoose.model("Order", orderSchema)