const Joi = require('joi')
const userModel = require('../model/userModel')
const token = require("../utils/token")
const uuid = require('../utils/uuid')

const userValidation = Joi.object({
    firstName : Joi.string().min(3).required().label("First Name"),
    lastName : Joi.string().min(3).required().label("Last Name"),
    email  : Joi.string().email().required().label("Email"),
    password : Joi.string().min(3).required().label("Password"),
    mobile : Joi.number().label("Mobile number")
})

const login = async(req,res,next)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message :"Please enter your email and password"})
    }
    try{
        const User = await userModel.findOne({"email" : email}).select("+password")
        if(!User){
            return res.status(401).json({message :"Invalid email or password"})
        }
        if(User.password === password){
            const tkn = token.genToken(User._id)
            return res.status(200).cookie("sid",tkn,{maxAge : 60*60*1000*24*7}).json({
            "message" : "Session Found",
            data : {
                "email" : User.email,
                "firstName" : User.firstName,
                "lastName" : User.lastName,
                "status"  : User.status
            }

        })
        }
        return res.status(401).json({message : "Invalid email or password"})
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"})
    }
}

const signup = async(req,res,next)=>{
    const data = req.body
    if(!data){
        return res.status(400).json({message: "No data recieved"})
    }
    const {error,value} = userValidation.validate(data)
    if(error){
        return res.status(422).json({message : error.details[0].message})
    }
    try{
        const userRef = `usr-${uuid().replace(/-/g, '').slice(0, 12)}`
        await userModel.create({...value,userRef})
        return res.status(201).json({message : "user data Registered sucessfully"})
    }
    catch(err){
        if(err.code === 11000){
            if(err.keyPattern?.mobile){
                return res.status(409).json({message : `Mobile Number already exists`})
            }
            return res.status(409).json({message : `Email Id already exists`})
        }
        return res.status(500).json({message : "Please try again in a moment"})
    }
}

const session = async(req,res)=>{
    const userId  = req.user
    if(!userId){
        return res.status(401).json({message : "Unauthorized"})
    }
    try{
        user = await userModel.findById(userId).select("firstName status -_id")
        if(!user){
            return res.status(404).json({message : "User Not Found"})
        }
        return res.status(200).json({
            "message" : "Session Found",
            user
        })
    }
    catch(err){
        return res.status(500).json({message : "Please try again in a moment"})
    }
    
}

const logout = async(req,res,next)=>{
    const userId = req.user
    if(!userId){
        return res.status(401).json({message: "Unauthorized"})
    }
    try{
        const user = await userModel.findOne({_id : userId})
        if(!user){
            return res.status(404).json({message : "User Not Found"})
        }
        res.clearCookie("sid")
        return res.status(200).json("logout")
    }
    catch(err){
        return res.status(500).json({message: "Please try again in a moment"})
    }

}

module.exports = {login,signup,session,logout};