const walletRoutes = require('express').Router();
const walletController = require('../controllers/wallet.Controller');
const authCheck = require('../middleware/authCheck');

walletRoutes.post("/initializewallet", authCheck,walletController.createDefaultWallets );
walletRoutes.post("/tradewallets",authCheck, walletController.getTradeWallets);
walletRoutes.post("/createwallet", authCheck,walletController.createWallet );

module.exports = walletRoutes;
