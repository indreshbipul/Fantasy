const transactionRoute = require('express').Router();
const transactionController = require('../controllers/transaction.Controller')
const authCheck = require('../middleware/authCheck')

transactionRoute.post('/deposit', authCheck,transactionController.create_Deposite_Transaction)
transactionRoute.post('/transactions', authCheck, transactionController.getALl_Transaction)
transactionRoute.post('/buytrade', authCheck, transactionController.create_Buy_Transaction)
transactionRoute.post('/selltrade', authCheck, transactionController.create_Sell_Transaction)

module.exports = transactionRoute