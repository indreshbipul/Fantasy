const uuidGenerate = require('../utils/uuid')
const userModel = require('../model/userModel')
const accountModel = require('../model/accountModel')
const walletModel = require('../model/walletModel')
const Decimal = require("decimal.js");

function formatNumber(value, precision = 8) {
    const d = new Decimal(value);
    if (d.isZero()) return "0.00";
    return d.toDecimalPlaces(precision).toString();
}

const createWallet = async(req,res)=>{
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message :"Unauthorized"});
    }
    const {accountType, asset, assetType } = req.body || {};
    if(!accountType || !asset || !assetType){
        return res.status(422).json({message : "Invalid request"});
    }
    try{
        const account = await accountModel.findOne({userId, accountType}).select('status _id')
        if (!account ) {
            return res.status(403).json({message: "Account Not Found"});
        }
        if(account && account.status === "INACITVE"){
            return res.status(404).json({message : `Account is ${account.status}`})
        }
        const fundingWallet = await walletModel.findOne({userId, accountId : account._id, walletType : "FIAT", asset : "INR"});
        if(!fundingWallet){
            return res.status(404).json({message : "Funding Wallet Not Found or Inactive"});
        }
        const walletRef = `${asset.toLowerCase()}-${uuidGenerate().replace(/[\/-]/g, '')}`;
        const wallet = await walletModel.create({
            userId : userId,
            accountId : account._id,
            walletType : assetType,
            asset : asset,
            walletRef : walletRef,
        });
        if(!wallet){
            return res.status(500).json({message : "Please try again in a moment"});
        }
        return res.status(200).json({message : "Wallet creates Sucessfully "});
    }
    catch(err){
        if(err.code === 11000){
            return res.status(409).json({message : `User already have ${asset} wallet`});
        }
        console.log(err)
        return res.status(500).json({message : "Please try again in a moment"});
    }
}

const getAll_Wallets = async(req,res)=>{
    const userId = req.user
    if(!userId){
        return res.status(401).json({message : "Unauthorized"})
    }
    const {accountType} = req.body.payload;
    if(!accountType){
        return res.status(422).json({message : "Invalid Request"});
    }
    try{
        const account = await accountModel.findOne({userId, accountType}).select("-__v");
        if(!account){
            return res.status(404).json({message : "User do not have account"})
        }
        const wallets = await walletModel.find({userId: userId, accountId : account._id}).select("-_id -__v ")
        if(wallets.length === 0){
            return res.status(200).json({message : "success", data : []})
        }
        return res.status(200).json({message : "success", data : wallets}) 
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"})
    }
}

const getTradeWallets = async(req,res)=>{
    const userId = req.user;
    const {accountType, asset, assetType} = req.body;
    if(!userId){
        return res.status(401).json({message : "Unauthorized"});
    }
    if(!accountType || !asset || !assetType){
        return res.status(422).json({message : "Invalid Request"});
    }
    try{
        const account = await accountModel.findOne({userId, accountType});
        if(!account){
            return res.status(404).json({message : "Account Not Found"});
        }
        const fiatWallet = await walletModel.findOne({userId, accountId : account._id, walletType : "FIAT", asset : "INR"});
        if(!fiatWallet){
            return res.status(404).json({message : "Funding Wallet is Not Found or Inactive"});
        }
        const cryptoWallet = await walletModel.findOne({userId, accountId : account._id, walletType : assetType, asset});
        if(!cryptoWallet){
            return res.status(404).json({message : "Wallet Not Found"});
        }
        return res.status(200).json({message : "Success", data : {
            fundWallet : {
                walletRef : fiatWallet.walletRef,
                balance : formatNumber(fiatWallet.balance.toString()),
                status : fiatWallet.status,
                asset : fiatWallet.asset,
            },
            tradeWallet :{
                walletRef : cryptoWallet.walletRef,
                balance : formatNumber(cryptoWallet.balance.toString()),
                status : cryptoWallet.status,
                asset : cryptoWallet.asset,
            }

        }})
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"})
    }

}

const createDefaultWallets = async(req,res) => {
    const userId = req.user;
    if(!userId){
        return res.status(401).json({message : "Unauthorized"})
    }
    const {accountType} = req.body || {};
    if(!accountType){
        return res.status(422).json({message : "Invalid Request"})
    }
    const fiatAssets = ["INR"];
    const cryptoAssets = ["BTC", "ETH", "TETHER", "BNB", "SOL", "XRP", "ADA", "DOGE"];
    const wallets = [];
    try{
        const account = await accountModel.findOne({userId, accountType});
        if(!account){
            return res.status(404).json({message : "No Active Account"});
        }
        if(account.status === "INACITVE"){
            return res.status(404).json({message : "Account is Inactive"});
        }

        // FIAT wallet
        fiatAssets.forEach(asset => {
            wallets.push({
                userId,
                accountId : account._id,
                walletType: "FIAT",
                asset,
                walletRef: `${asset.toLowerCase()}-${uuidGenerate().replace(/-/g, '')}`
            });
        });

        // CRYPTO wallets
        cryptoAssets.forEach(asset => {
            wallets.push({
                userId,
                accountId : account._id,
                walletType: "CRYPTO",
                asset,
                walletRef: `${asset.toLowerCase()}-${uuidGenerate().replace(/-/g, '')}`
            });
        });

        const Wallets = await walletModel.insertMany(wallets, { ordered: false });
        if(!Wallets){
            return res.status(500).json({message : "Please try again in a Movement"})
        }
        return res.status(200).json({message : "Wallets are Initialized"})
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"})
    }
};

module.exports = {createWallet, getAll_Wallets, getTradeWallets, createDefaultWallets}