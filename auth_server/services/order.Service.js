const orderModel = require('../model/orderModel');
const uuidGenerate = require('../utils/uuid');

async function createOrder(transaction, price, quantity, orderType, session){
    const orderRef = `ord-${uuidGenerate().replace(/-/g, '').slice(0, 12)}`;
    try{
        const order = await orderModel.create([{
            userId : transaction.userId,
            accountId : transaction.accountId,
            transactionId : transaction._id,
            orderRef,
            quantity : quantity.toString(),
            orderType : orderType,
            orderMode : "MARKET",
            baseSymbol : transaction.baseSymbol,
            quoteSymbol : transaction.quoteSymbol,
            price : price.toString(),
            status : "OPEN",
        }],{session});
        if(!order){
            return {res: false, remark : "Error in creating order"};
        }
        return {res: true, remark : order};
    }
    catch(err){
        return {res: false, remark : "Error in creating order"};
    }
}

async function markComplete(orderId, session){
    const order =  await orderModel.findByIdAndUpdate(
        orderId,
        {$set : {status : "FILLED", }}, 
        {new:true, session}
    );
    if(!order){
        return {res: false, remark : "Error in marking order Complete"};
    }
    return {res: true, remark : order};
}



module.exports = {createOrder, markComplete};