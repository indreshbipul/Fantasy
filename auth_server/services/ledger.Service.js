const ledgerModel = require('../model/ledgerModel')

async function createTradeLedger(transaction,orderId, direction, counterDirection,transactionType, quantity, amount, session){
    const ledger = await ledgerModel.create([{
        userId : transaction.userId,
        accountId : transaction.accountId,
        walletId : transaction.walletId,
        transactionId : transaction._id,
        orderId : orderId,
        assetSymbol : transaction.baseSymbol,
        amount : amount.toString(),
        direction : direction,
        transactionType : transactionType,
    }],{session})
    if(!ledger){
        return {res : false}
    }
    const counterLedger =  await ledgerModel.create([{
        userId : transaction.userId,
        accountId : transaction.accountId,
        walletId : transaction.counterWalletId,
        transactionId : transaction._id,
        orderId : orderId,
        assetSymbol : transaction.baseSymbol,
        amount : quantity.toString(),
        direction : counterDirection,
        transactionType : transactionType,
    }],{session})
    if(!counterLedger){
        return {res : false}
    }
    return {res : true}
}

async function createDepositLedger(transaction, session){
    const ledger = await ledgerModel.create([{
        userId : transaction.userId,
        accountId : transaction.accountId,
        walletId : transaction.walletId,
        transactionId : transaction._id,
        assetSymbol : transaction.baseSymbol,
        amount : transaction.amount,
        direction : "CREDIT",
        transactionType : "DEPOSIT",
    }], { session });
    if(!ledger){
        return {res : false}
    }
    return {res : true}
}

module.exports = {createTradeLedger,createDepositLedger}