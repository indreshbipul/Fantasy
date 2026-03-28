const authRoutes = require('express').Router()
const authCheck = require("../middleware/authCheck")
const authControllers = require('../controllers/auth.Controller')

authRoutes.post('/login',authControllers.login)
authRoutes.post('/signup', authControllers.signup)
authRoutes.get('/session',authCheck,authControllers.session)
authRoutes.put('/logout',authCheck,authControllers.logout)


module.exports = authRoutes