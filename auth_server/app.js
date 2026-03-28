// External imports
const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require('cors')

dotenv.config()

// Internal imports
const authRoutes = require('./routes/auth.Route')
const dbConnect = require('./config/mongo.Config')
const userRoutes = require('./routes/user.Route')
const walletRoutes = require('./routes/wallet.Route')
const transactionRoutes = require('./routes/transaction.Route')
const transactionWorker = require('./workers/transaction.Worker')

app = express()

app.use(cors({
    origin : ['http://localhost:5173', 'http://fantasy.ibipul.space','https://fantasy.ibipul.space'],
    credentials : true
}));

app.use(express.json())
app.use(cookieParser())
app.get('/',(req,res,next)=>{
    res.status(200).json("Welcome to our server of Fantasy")
})

app.use(authRoutes)
app.use(userRoutes)
app.use(walletRoutes)
app.use(transactionRoutes)

transactionWorker.start_TransactionWorker()

dbConnect()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`app started at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error at Listen")
})