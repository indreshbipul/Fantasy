const walletModel = require('../model/walletModel')
const transactionModel = require("../model/transectionModel")
const userModel = require("../model/userModel")
const uuidGenerate = require('../utils/uuid')
const Joi = require('joi')
const redis = require('../config/redis.producer.Config')
const accountModel = require('../model/accountModel')

//______________sample request for trade__________________________
// {
//   "key" : "idempotenty-key"
//   "transactionType": "BUY",
//   "amount": "1000" or quantity : "1"
//   "transactionMode" : "Market"
//   "asset1": { "type": "FIAT", "symbol": "INR" },
//   "asset2": { "type": "CRYPTO", "symbol": "BTC" }
// }
//_______________________________________________________

const transerction_Request = Joi.object({
    key : Joi.string().required().label("key"),
    accountType : Joi.string().required().valid("PAPER", "REAL").label("Account Type"),
    amount : Joi.string().optional().label("Amount").custom((value, helpers) => {
        if (!/^[0-9]+(\.[0-9]+)?$/.test(value)) {
            return helpers.error("any.invalid");
        }
        if (Number(value) <= 0) {
            return helpers.error("any.invalid");
        }
        return value; 
    }, "Amount Validation"),
    quantity : Joi.string().optional().label("Quantity").custom((value, helpers)=>{
        if (!/^[0-9]+(\.[0-9]+)?$/.test(value)) {
            return helpers.error("any.invalid");
        }
        if (Number(value) <= 0) {
            return helpers.error("any.invalid");
        }
        return value; 
    }, "Quantity Validation"),
    transactionType : Joi.string().valid("BUY", "SELL", "TRANSFER", "DEPOSIT", "WITHDRAW").required().label("Transaction Type"),
    asset1 : Joi.object({
        type : Joi.string().valid("FIAT", "CRYPTO").required().label("Type"),
        symbol : Joi.string().label("Symbol").required()
    }).required().label("Primary Asset"),
    asset2 : Joi.object({
        type : Joi.string().valid("FIAT", "CRYPTO").required().label("Type"),
        symbol : Joi.string().label("Symbol").required()
    }).optional().allow(null).label("Secondary Asset"),
    purpose : Joi.string().optional().allow(null),
    transactionMode : Joi.string().valid("MARKET", "LIMIT").optional(),
})

const create_Buy_Transaction = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorize"})        
    }
    const {error, value} = transerction_Request.validate(req.body || {})
    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }
    if(value.transactionType !== "BUY" || value.asset1.type !== "FIAT" || !value.asset2 || value.asset2.type !== "CRYPTO"){
        return res.status(404).json({message : "Not Allowed"})
    }
    if(!value.quantity && !value.amount){
        return res.status(404).json({message : "Not Allowed"})
    }
    try{
        const account = await accountModel.findOne({userId, accountType : value.accountType});
        if(!account){
            return res.status(404).json({message : "User Account Not Found"})
        }
        if(account.status === "INACTIVE" || account.status === "SUSPENDED" || account.status === "CLOSED"){
            return res.status(403).json({message : `Account is ${account.status}`})
        }
        const duplicate = await transactionModel.findOne({accountId : account._id, idempotencyKey : value.key})
        if(duplicate){
            return res.status(409).json({message : "Transaction already Exists"})
        }
        const wallet = await walletModel.findOne({userId, accountId : account._id, asset : value.asset1.symbol})
        if(!wallet){
            return res.status(404).json({message : "Wallet not Found"})
        }
        const counterWallet = await walletModel.findOne({userId, accountId : account._id, asset : value.asset2.symbol})
        if(!counterWallet){
            return res.status(404).json({message : "Wallet not Found"})
        }
        const transactionId  = uuidGenerate();
        const transactionRef  = `Txn-${uuidGenerate().replace(/-/g, '').slice(0, 12)}`;
        const data = {
            userId,
            idempotencyKey : value.key,
            accountId : account._id,
            walletId : wallet._id,
            baseType : value.asset1.type,
            baseSymbol : value.asset1.symbol,
            quoteType : value.asset2?.type ,
            quoteSymbol : value.asset2?.symbol,
            counterWalletId : counterWallet?._id,
            transactionRef  : transactionRef ,
            transactionId,
            transactionType : "BUY",
            purpose : value.purpose || null,
            status : "INITIATED",
            ...(value.quantity ? { quantity: value.quantity } : { amount: value.amount })
        }
        const transaction = await transactionModel.create(data)
        if(!transaction){
            return res.status(500).json({message : "Please try again in a momemt"})
        }
        await redis.lpush("txn-queue", JSON.stringify({transactionId : transaction._id, type : "BUY"}))
        return res.status(202).json({message : `success`, data :{transactionRef }})
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a momemt"})
    }
}

const create_Sell_Transaction = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorize"})        
    }
    const {error, value} = transerction_Request.validate(req.body)
    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }
    if(value.transactionType !== "SELL" || value.asset1.type !== "FIAT" || !value.asset2 || value.asset2.type !== "CRYPTO"){
        return res.status(404).json({message : "Not Allowed"})
    }
    if(!value.quantity && !value.amount){
        return res.status(404).json({message : "Not Allowed"})
    }
    try{
        const account = await accountModel.findOne({userId, accountType : value.accountType});
        if(!account){
            return res.status(404).json({message : "User Account Not Found"})
        }
        if(account.status === "INACTIVE" || account.status === "SUSPENDED" || account.status === "CLOSED"){
            return res.status(403).json({message : `Account is ${account.status}`})
        }
        const duplicate = await transactionModel.findOne({accountId : account._id, idempotencyKey : value.key})
        if(duplicate){
            return res.status(409).json({message : "Transaction already Exists"})
        }
        const wallet = await walletModel.findOne({userId, accountId : account._id, asset : value.asset1.symbol})
        if(!wallet){
            return res.status(404).json({message : "Wallet not Found"})
        }
        const counterWallet = await walletModel.findOne({userId, accountId : account._id, asset : value.asset2.symbol})
        if(!counterWallet){
            return res.status(404).json({message : "Wallet not Found"})
        }
        const transactionId  = uuidGenerate();
        const transactionRef  = `Txn-${uuidGenerate().replace(/-/g, '').slice(0, 12)}`;
        const data = {
            userId,
            idempotencyKey : value.key,
            accountId : account._id,
            walletId : wallet._id,
            baseType : value.asset1.type,
            quoteType : value.asset2?.type ,
            baseSymbol : value.asset1.symbol,
            quoteSymbol : value.asset2?.symbol,
            counterWalletId : counterWallet?._id,
            transactionRef  : transactionRef ,
            transactionId,
            transactionType : "SELL",
            transactionMode : value.transactionMode,
            purpose : value.purpose || null,
            status : "INITIATED",
            ...(value.quantity ? { quantity: value.quantity } : { amount: value.amount })
        }
        const transaction = await transactionModel.create(data);
        if(!transaction){
            return res.status(500).json({message : "Please try again in a momemt"});
        }
        await redis.lpush("txn-queue", JSON.stringify({transactionId : transaction._id, type : "SELL"}))
        return res.status(202).json({message : `success`, data :{transactionRef }});
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a momemt"});
    }
}

const create_Deposite_Transaction = async(req,res,next)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorize"});
    }
    const {error, value} = transerction_Request.validate(req.body);
    if(error){
        return res.status(422).json({message : error.details[0].message});
    }
    if(!value.amount){
        return res.status(404).json({message : "Not Allowed"})
    }
    if(value.transactionType !== "DEPOSIT" || value.asset1.symbol !== "INR"){
        return res.status(404).json({message : "Not Allowed"});
    }
    
    try{
        const account = await accountModel.findOne({userId , accountType : value.accountType});
        if(!account){
            return res.status(400).json({message : "Account Not Found"});
        }
        const duplicate = await transactionModel.findOne({accountId : account._id, idempotencyKey : value.key});
        if(duplicate){
            return res.status(409).json({message : "Transaction already Exists"});
        }
        const wallet = await walletModel.findOne({userId, accountId : account._id, });
        if(!wallet){
            return res.status(404).json({message : "Wallet Not Found"});
        }
        const transactionRef  = `Txn-${uuidGenerate().replace(/-/g, '').slice(0, 12)}`;
        const transactionId = uuidGenerate()
        const transaction = await transactionModel.create({
            userId,
            transactionId,
            transactionRef : transactionRef ,
            accountId : account._id,
            idempotencyKey : value.key,
            transactionType : "DEPOSIT",
            amount : value.amount,
            walletId : wallet._id,
            baseType : value.asset1.type,
            baseSymbol : value.asset1.symbol,
            status : "INITIATED",
            purpose : value.purpose || null,
        })
        if(!transaction){
            return res.status(500).json({message : "Please try again in a momemt"})
        }
        const result = await redis.lpush("txn-queue", JSON.stringify({ type : "DEPOSIT", transactionId : transaction._id, accountType : account.accountType }))
        if(!result){
            return res.status(500).json({message : "Please try again in a momemt"})
        }
        return res.status(202).json({message : `Transaction Created with Reference Id : ${transactionRef}`})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message : "Please try again in a momemt"})
    }
}

const getALl_Transaction = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "UNAUTHORIZED"});
    }
    const {accountType} = req.body || {}
    if(!accountType){
        return res.status(422).json({message : "Invalid Request"})
    }
    try{
        const account = await accountModel.findOne({userId, accountType});
        if(!account){
            return res.status(404).json({message : "Account Not Found"})
        }
        const transactions = await transactionModel.find({userId, accountId : account._id}).sort({ createdAt: -1 }).limit(20);
        if(!transactions){
            return res.json(200).json({message : "Success", data : []});
        }
        const response = []
        transactions.forEach(txn =>{
            if(txn.transactionType === "DEPOSIT" || txn.transactionType === "WITHDRAW"){
                response.push({
                    transactionRef : txn.transactionRef,
                    type : txn.transactionType,
                    assetType : txn.baseType,
                    asset : txn.baseSymbol,
                    amount : txn.amount.toString(),
                    status : txn.status,
                    purpose : txn.purpose,
                    remark : txn.remark,
                    initiatedAt : txn.createdAt,
                    lastUpdateAt : txn.updatedAt,    
                })
            }
            if(txn.transactionType === "BUY" || txn.transactionType === "SELL"){
                response.push({
                    transactionRef : txn.transactionRef,
                    type : txn.transactionType,
                    assetType : txn.baseType,
                    asset : txn.baseSymbol,
                    quoteType : txn.quoteType,
                    quoteSymbol : txn.quoteSymbol,
                    amount : txn.amount?.toString() || "NA",
                    quantity : txn.quantity?.toString() || "NA",
                    status : txn.status,
                    purpose : txn.purpose,
                    remark : txn.remark,
                    initiatedAt : txn.createdAt,
                    lastUpdateAt : txn.updatedAt,    
                })
            }
            // for transfer  
        })
        return res.status(200).json({message : "sucess", data : response});
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message : "Please try again in a momemt"});
    }
}

const Txn_validation = Joi.object({
    accountType: Joi.string().valid("FIAT", "CRYPTO").required(),
    period: Joi.string().valid("7d", "30d", "3m", "1y").required(),
});

const get_Transaction = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "UNAUTHORIZED"});
    }
    const {error, value } = Txn_validation.validate(req.body);
    if (error) {
        return res.status(422).json({ message: error.details[0].message });
    }
    const now = new Date();
    let from = new Date();
    switch (value.period || "1y") {
        case "7d":
            from.setDate(from.getDate() - 7);
            break;
        case "30d":
            from.setDate(from.getDate() - 30);
            break;
        case "3m":
            from.setMonth(from.getMonth() - 3);
            break;
        case "1y":
            from.setFullYear(from.getFullYear() - 1);
            break;
    }
    try{
        const account = await accountModel.findOne({userId, accountType : value.accountType})
        if(!account){
            return res.status(404).json({message : "Account Not Found"})
        }
        const query = {
            userId,accountId : account._id,
            createdAt: { $gte: from, $lte: now },
            $and: [
                {$or: [{ baseType: value.asset_Type }, { quoteType: value.asset_Type }]},
                {$or: [{ baseSymbol: value.symbol }, { quoteSymbol: value.symbol }]}
            ]
        };
        const transactions  = await transactionModel.find({query}).sort({ createdAt: -1 }).limit(50);
        if(!transactions){
            return res.json(200).json({message : "Sucess", data : []})
        }
        return res.status(200).json({message : "Sucess" , data : transactions})
    }
    catch(errr){
        return res.status(500).json({message : "Please try again in a momemt"})
    }
}

const search_Transaction = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorized"})
    }
    const {transactionRef } = req.body.payload || {};
    if(!transactionRef ){
        return res.status(400).json({message : "Reference Id required"})
    }
    try{
        const transaction = await transactionModel.findOne({userId, transactionRef })
        if(!transaction){
            return res.status(404).json({ message: "Transaction not found" });
        }
        return res.status(200).json({message : "Sucess" , data : transaction})
    }
    catch(errr){
        return res.status(500).json({message : "Please try again in a momemt"})
    }
}

module.exports = {
    create_Buy_Transaction,
    create_Sell_Transaction,
    create_Deposite_Transaction,
    search_Transaction, 
    getALl_Transaction, 
    get_Transaction
}