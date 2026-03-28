const jwt = require("jsonwebtoken")

const genToken = (data)=>{
    const token = jwt.sign({data : data}, process.env.jwt_secret,{expiresIn: '7d'})
    return token
}

module.exports = {genToken}