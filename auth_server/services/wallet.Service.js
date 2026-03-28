const walletModel = require('../model/walletModel');
const Decimal = require("decimal.js");


async function depositAmountCredit(amount, walletId, accountId, session){
   const decimalAmount = new Decimal(amount.toString());
   if (decimalAmount.lte(0)) {
      return { res: false, remark: "Invalid amount" };
   }
   try{
      const result = await walletModel.findOneAndUpdate(
         { _id: walletId, accountId },
         { $inc: { balance: amount }},
         { new: true, session }
      );
      if(!result){
         return { res: false, remark: "Wallet not found" };
      }
      return { res: true, remark: result };
   } 
   catch(err){
      console.log("Error while amount credit", err);
      return { res: false, remark: "Error" };
   }
}

async function amountHold(amount, walletId, accountId, session) {
   const decimalAmount = new Decimal(amount.toString());
   if (decimalAmount.lte(0)) {
      return { res: false, remark: "Invalid amount" };
   }
   try{
      const result = await walletModel.findOneAndUpdate(
         { _id: walletId, accountId, balance: { $gte: amount } },
         {$inc: { balance: decimalAmount.negated().toString(), lockedBalance: decimalAmount.toString()}},
         { new: true, session }
      );
      if (!result) {
         return { res: false, remark: "Insufficient Fund" };
      }
      return { res: true, remark: result };
   } 
   catch(err){
      console.log("Error while holding amount", err);
      return { res: false, remark: "Error" };
   }
}


async function buyTradeAmountRelease(amount, walletId, accountId, session){
   const decimalAmount = new Decimal(amount.toString());
   if (decimalAmount.lte(0)) {
      return { res: false, remark: "Invalid amount" };
   }
   try{
      const result = await walletModel.findOneAndUpdate(
         { _id: walletId, accountId, lockedBalance: { $gte: amount }},
         { $inc: { lockedBalance: -amount }},
         { new: true, session }
      );
      if(!result){
         return { res: false, remark: "Insufficient Fund" };
      }
      return { res: true, remark: result };
   } 
   catch(err){
      console.log("Error while amount release", err);
      return { res: false, remark: "Error" };
   }
}


async function amountReverse(amount, walletId, accountId, session){
   const decimalAmount = new Decimal(amount.toString());
   if (decimalAmount.lte(0)) {
      return { res: false, remark: "Invalid amount" };
   }
   try{
      const result = await walletModel.findOneAndUpdate(
         { _id: walletId, accountId, lockedBalance: { $gte: amount }},
         { $inc: { lockedBalance: -amount, balance: amount }},
         { new: true, session }
      );
      if(!result){
         return { res: false, remark: "Insufficient Fund" };
      }
      return { res: true, remark: result };
   } 
   catch(err){
      console.log("Error while amount reverse", err);
      return { res: false, remark: "Error" };
   } 
}


async function buyTradeAmountCredit(quantity, walletId, accountId, executionPrice, session){
   const decimalAmount = new Decimal(quantity.toString());
   if (decimalAmount.lte(0)) {
      return { res: false, remark: "Invalid amount" };
   }
   try{
      const wallet = await walletModel.findOne({ _id: walletId, accountId },null, { session });
      if(!wallet){
         return { res: false, remark: "Wallet not found" };
      }
      let avgBuy 
      const prevAvgBuy = new Decimal(wallet.averageBuyPrice.toString() || 0);
      if(prevAvgBuy.isZero()){
         avgBuy = prevAvgBuy.add(executionPrice)
      }
      else{
         avgBuy = prevAvgBuy.add(executionPrice).div(2) 
      }
      const result = await walletModel.findOneAndUpdate(
         {_id : walletId, accountId},
         {
            $inc : {balance : quantity},
            $set : {averageBuyPrice : avgBuy.toString()}
         },
         {new : true, session}
      )
      if(!result){
         return { res: false, remark: "Wallet not found" };
      }
      return { res: true, remark: result };
   } 
   catch(err){
      console.log("Error while amount credit", err);
      return { res: false, remark: "Error" };
   }
}



async function sellTradeAmountRelease(quantity, walletId, accountId, session){
   const decimalQuantity = new Decimal(quantity.toString());
   if (decimalQuantity.lte(0)) {
      return { res: false, remark: "Invalid quantity" };
   }
   try{
      const wallet = await walletModel.findOne({_id : walletId, accountId : accountId}, null, {session});
      if(!wallet){
         return {res : false , remark : "Wallet not found"};
      }
      const prevBalance = new Decimal((wallet.balance).toString() || 0);
      const prevAvgBuy = new Decimal((wallet.averageBuyPrice).toString() || 0);
      let avgBuy ;
      if(prevBalance.isZero()){
         avgBuy = new Decimal(0)
      }
      avgBuy = prevAvgBuy
      const result = await walletModel.findOneAndUpdate(
         {_id : walletId, accountId},
         {$set  : { lockedBalance : -quantity.toString(), averageBuyPrice : avgBuy.toString()}},
         {new : true, session},
      )
      if(!result){
         return {res: false , remark : "Failed to release Locked Fund"};
      }
      return {res : true, remark : "Updated"};
   }
   catch(err){ 
      console.log("hai bahi", err)
      return { res: false,  remark : err};
   }
}

async function sellTradeAmountCredit(amount, walletId, accountId, session ){
   const decimalAmount = new Decimal(amount.toString());
   if (decimalAmount.lte(0)) {
      return { res: false, remark: "Invalid amount" };
   }
   try{
      const wallet = await walletModel.findOneAndUpdate(
         {_id : walletId, accountId : accountId},
         {$inc : {balance : amount}},
         {new : true , session}
      );
      if(!wallet){
         return {res : false, remark : "Wallet not found"}
      }
      return {res : true, remark : "Amount Credited"} 
   }
   catch(err){
      return { res: false, remark : err}
   }
}

module.exports = { 
   amountHold, 
   buyTradeAmountRelease, 
   amountReverse, 
   depositAmountCredit , 
   buyTradeAmountCredit,
   sellTradeAmountRelease,
   sellTradeAmountCredit,
};