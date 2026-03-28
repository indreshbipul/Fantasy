const userModel = require('../model/userModel');
const walletModel = require('../model/walletModel');
const accountModel = require('../model/accountModel');
const orderModel = require('../model/orderModel');
const uuidGenerate  = require('../utils/uuid');
const paperdepositModel = require('../model/paperdepositModel')
const Decimal = require("decimal.js");

function formatNumber(value, precision = 8) {
    const d = new Decimal(value.toString());
    if (d.isZero()) return "0.00";
    return d.toDecimalPlaces(precision).toString();
}

const profile = async(req,res,next)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message :"Unauthorized"});
    }
    try{
        const user = await userModel.findOne({_id : userId}).select("email firstName lastName mobile location status -_id");
        if(!user){
            return res.status(404).json({message :"User Not Found"});
        }
        return res.status(200).json({message : "user Found",data : user});
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"});
    }
}

const create_Account = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unathorized"});
    }
    const {type} = req.body || {};
    if(!type || (type != "PAPER" && type != "REAL")){
        return res.status(422).json({message : "Invalid Request"});
    }
    let accountRef;
    let status;
    if(type === "PAPER"){
        accountRef = `ppr-${uuidGenerate().replace(/-/g, '')}`;
        status = "ACTIVE"
    }
    else{
        accountRef = `rl-${uuidGenerate().replace(/-/g, '')}`;
        status = "INACITVE"
    }
    try{
        const user = await userModel.findOne({_id : userId}).select('status');
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        if (user.status === "UNVERIFIED"){
            return res.status(403).json({message : `Not permitted, User profile is not Verified`});
        }
        const account = await accountModel.create({
            userId,
            accountRef,
            accountType : type,
            status,
        })
        if(!account){
            return res.status(500).json({message : "Please try again in a moment"});
        }
        return res.status(200).json({message : "Account created Sucessfuly", 
            data  : {
                accountType : account.accountType,
                accountRef : account.accountRef
        }});
    }
    catch(err){
        if (err.code === 11000) {
            return res.status(409).json({message: "Account already exists for this type"});
        }
        return res.status(500).json({message : "Please try again in a moment"});
    }
}


const getAccounts = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status0(401).json({message : "Unauthorized"});
    }
    try{
        const account = await accountModel.find({userId}).select("accountType accountRef -_id");
        if(!account){
            return res.status(404).json({message : "No account Found"});
        }
        return res.status(200).json({message : "Sucess", data : account});
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"});
    }
}

const portfolio = async(req,res) =>{
    const userId = await req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorized"});
    }
    const {accountType} = req.body;
    if(!accountType){
        return res.status(422).json({message : "Invalid Request"});
    }
    try{
        const account = await accountModel.findOne({userId, accountType}).select("accountRef accountType status");
        if(account.length === 0){
            return res.status(404).json({message :  "No Active Accounts"});
        }
        const wallets = await walletModel.find({userId,accountId : account._id});
        if(wallets.length === 0){
            return res.status(404).json({message : "No Active Wallets" });
        }
        const orders = await orderModel.find({userId, accountId : account._id});
        const response = {
            accountRef : account.accountRef,
            accountType : accountType,
            status : account.status
        }
        const wal = []
        wallets.forEach(ele =>{
            wal.push({
                walletRef : ele.walletRef,
                walletType : ele.walletType ,
                asset : ele.asset,
                status : ele.status,
                balance : formatNumber(ele.balance),
                lockedBalance : formatNumber(ele.lockedBalance),
                averageBuyPrice : ele.averageBuyPrice.toString()
            })
        })
        response["wallets"] = wal
        return res.status(200).json({message : "Sucess", data : response});
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"});
    }
}


const paperDeposite_Limit = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorized"});
    }
    try{
        let limit = await paperdepositModel.findOne({userId});
        if(!limit){
            const account = await accountModel.findOne({userId, accountType : "PAPER"});
            if(!account){
                res.status(404).json({message : "User Do Not have Paper Account"});
            }
            const wallet = await walletModel.findOne({userId, accountId : account._id, asset : "INR", walletType : "FIAT"})
            if(!wallet){
                res.status(404).json({mesage : "Paper Wallet Not Found"});
            }
            limit = await paperdepositModel.create({ 
                userId,
                accountId : account._id,
                walletId : wallet._id,
            })
            if(!limit){
                return res.status(500).json({message : "Please try again in a moment"});
            }
        }
        return res.status(200).json({message : "Sucess", 
            data : {
                weeklyLimit : limit.weeklyLimit,
                usedLimit : limit.usedLimit,
                plan : limit.plan
            }
        })
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"});
    }
}

const getOrders = async(req, res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorized"});
    }
    const {accountType}  = req.body || {};
    if(!accountType){
        return res.status(422).json({message : "Invalid Request"});
    }
    try{
        const account = await accountModel.findOne({userId, accountType});
        if(!account){
            return res.status(404).json({message : "Account Not Found "});
        }
        const orders = await orderModel.find({userId, accountId :account._id}).populate({
            path : "transactionId",
            select : "transactionRef amount status purpose remark amount"
        }).sort({ createdAt: -1 })
        if(!orders){
            return res.status(404).json({message : "No order Found"});
        }
        const response = []
        orders.forEach(ord =>response.push({
            orderRef : ord.orderRef,
            orderType : ord.orderType,
            orderMode : ord.orderMode,
            base : ord.baseSymbol,
            quote : ord.quoteSymbol,
            price : ord.price.toString(),
            quantity : ord.quantity.toString(),
            status : ord.status,
            remark : ord.transactionId.remark,
            initiated : ord.createdAt,
            lastUpdate : ord.updatedAt,
            amount : ord.transactionId.amount.toString()
        }))
        return res.status(200).json({message : "Success",  data : response})
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message : "Please try again in a moment"});
    }
}

const getAccount = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status0(401).json({message : "Unauthorized"});
    }
    const {accountType} = req.body || {}
    if(!accountType){
        return res.status(422).json({message : "Invalid Request"});
    }
    try{
        const account = await accountModel.findOne({userId, accountType});
        if(!account){
            return res.status(404).json({message : "No account Found"});
        }
        return res.status(200).json({message : "Sucess", data : account});
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"});
    }
}

    
// Only add location and mobile number
const verify_Profile = async(req, res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorized"});
    }
    const {mobile , location} = req.body;
    if(!mobile || !location){
        return res.status(422).json({message : "Invalid Request"});
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(mobile.trim())) {
        return res.status(422).json({ message: "Invalid mobile number" });
    }
    try{
        const user = await userModel.findOneAndUpdate(
            {_id : userId}, 
            {$set : {mobile : mobile , location : location, status : "VERIFIED"}}, 
            {new : true}
        );
        if(!user){
            return res.status(500).json({message : "Please try again in a moment"});
        }
        return res.status(200).json({message : "Updated Sucessfully"})
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"})
    }

}

const update_Profile = async()=>{
 
}

const delete_Profile = async()=>{
    
}

const close_profile = async()=>{
    // it should block every thing like account, wallet,and profile these can be use for close also
}

module.exports = {profile, getAccounts , create_Account, portfolio, paperDeposite_Limit, getOrders, verify_Profile }