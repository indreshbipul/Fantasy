const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    userRef :{
      type: String,
      required: true,
      unique : true,
      index : true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false   
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    location:{
        type: String,
        trim: true        
    },
    status: {
      type: String,
      enum: [
        "UNVERIFIED",      // Email not verified
        "VERIFIED",  // Email verified
        "KYC_PENDING",     // Submitted KYC
        "KYC_APPROVED",    // KYC approved
        "KYC_REJECTED",    // KYC rejected
        "BLOCKED",         // Suspicious / fraud / admin block
        "CLOSED"           // User requested account closure
      ],
      default: 'UNVERIFIED',
      index: true
    }
  },
  { timestamps: true })

userSchema.index({ email: 1 }, { unique: true })


module.exports = mongoose.model("User", userSchema)
