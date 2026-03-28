const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
        index : true,
    },
    walletRef :{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    accountId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "usersAccount",
        required : true,
        index : true,
    },
    walletType :{
        type : String,
        enum : ["FIAT", "CRYPTO"],
        required : true,
        index : true,
    },
    balance :{
        type: mongoose.Schema.Types.Decimal128,
        default : "0",
    },
    asset :{
        type : String,
        required : true,
        uppercase : true
    },
    lockedBalance : {
        type: mongoose.Schema.Types.Decimal128,
        default : "0",
    },
    status :{
        type: String,
        enum: ["ACTIVE", "BLOCKED", "INACTIVE"],
        default: "INACTIVE"
    },
    averageBuyPrice : {
        type : mongoose.Schema.Types.Decimal128,
        default : "0"
    }
},
{ timestamps: true })

walletSchema.index({userId : 1, walletType : 1, asset : 1}, {unique : true}),

module.exports = mongoose.model('Wallet', walletSchema )