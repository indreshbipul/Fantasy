const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    device: {
        type: {
            type: String,
            enum: ["mobile", "tablet", "desktop", "smarttv", "wearable", "embedded"],
            default: "desktop"
        },
        model: String,
        os: String,
        browser: String
    },
    location: {
        country: String,
        region: String,
        city: String
    },
    sessionRef: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }

}, { timestamps: true });

userSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("UserSession", userSessionSchema);