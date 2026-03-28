const userRoutes = require('express').Router();
const authCheck = require("../middleware/authCheck");
const userControllers = require("../controllers/user.Controller");

userRoutes.get("/profile",authCheck,userControllers.profile);
userRoutes.get("/getaccount", authCheck, userControllers.getAccounts);
userRoutes.post("/createaccount", authCheck, userControllers.create_Account);
userRoutes.post("/getportfolio", authCheck, userControllers.portfolio);
userRoutes.get("/paperlimt", authCheck,userControllers.paperDeposite_Limit);
userRoutes.post("/orders",authCheck, userControllers.getOrders);
userRoutes.post("/verifyprofile", authCheck, userControllers.verify_Profile);
module.exports = userRoutes;