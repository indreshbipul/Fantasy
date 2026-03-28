const mongoose = require('mongoose')
uri = process.env.MONGO_URI

const connect = async() =>{
    await mongoose.connect(uri)
    .then((data)=>{
        console.log("Mongo_DB Connect")
    })
    .catch((err)=>{
        console.log("Error while connecting DB")
        throw err        
    })
}

module.exports =  connect