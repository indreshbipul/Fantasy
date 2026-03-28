const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    accountType : {
        type : String,
        enum: ["PAPER", "REAL"],
        required: true,
    },
    accountRef : {
        type : String,
        required : true,
        unique : true,
        index : true,
    },
    status: {
        type: String,
        enum: ["INACITVE", "ACTIVE", "SUSPENDED", "CLOSED"],
        default: "INACITVE"
    }
},{timestamps : true}
)

accountSchema.index({userId : 1, accountType : 1}, {unique : true})

module.exports = mongoose.model("usersAccount", accountSchema)