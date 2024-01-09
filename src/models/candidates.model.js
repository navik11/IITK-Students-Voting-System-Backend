import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
    {
        rollno: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
            trim: true,
            unique: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        positioncode: {
            type: Number,
            index: true,
        },
        positionname: {
            type: String,
        },
        hashTag: {
            type: String,
        },
        avatar: {
            type: String,
            required: true,
        },
        totalVoteCount: {
            type: Number,
            default: 0,
        },
        pref1VoteCount: {
            type: Number,
            default: 0,
        },
        pref2VoteCount: {
            type: Number,
            default: 0,
        },
        pref3VoteCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Candidate = new mongoose.model("Candidate", candidateSchema);
