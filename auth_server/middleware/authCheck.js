const jwt = require('jsonwebtoken')

const authCheck = (req,res,next)=>{
    const token = req.cookies.sid
    if(!token){
        return res.status(401).json({ message: "Unauthorized" })
    }
    try{
        const decode = jwt.verify(token, process.env.jwt_secret)
        req.user = decode.data
        next()
    }
    catch(err){
        return res.status(401).json({ message: "Invalid Token" })
    }
}

module.exports = authCheck