import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const gbmSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        otp: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        isVoted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

gbmSchema.pre("save", async function (next) {
    if (!this.isModified("otp") || !this.otp) return next();
    this.otp = await bcrypt.hash(this.otp, 10);
    next();
});

gbmSchema.methods.isOTPCorrect = async function (OTP) {
    return await bcrypt.compare(OTP, this.otp);
};

gbmSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

gbmSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

export const GBM = new mongoose.model("GBM", gbmSchema);
