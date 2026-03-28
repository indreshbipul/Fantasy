const mongoose = require('mongoose')

const paperLimitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true
    },
    walletId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
        unique: true,
        index: true
    },     
    accountId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "usersAccount",
        required: true,
        unique: true,
        index: true
    },
    weeklyLimit: {
        type: Number,
        default: 10000,
        min: 0
    },
    usedLimit: {
        type: Number,
        default: 0,
        min: 0
    },
    plan: {
        type: String,
        enum: ["BASIC", "PRO", "VIP"],
        default: "BASIC"
    },
    planExpire : {
        type : Date,
    },
    windowStart: {
        type: Date,
        default: Date.now
    },
    windowEnd: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
},{timestamps : true})

module.exports = mongoose.model("paperDeposite", paperLimitSchema)