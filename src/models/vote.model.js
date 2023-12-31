import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
    {
        pref1: [
            {
                type: Number,
                required: true,
            },
        ],
        pref2: [
            {
                type: Number,
                required: true,
            },
        ],
        pref3: [
            {
                type: Number,
                required: true,
            },
        ],
    },
    { timestamps: true }
);

export const Vote = new mongoose.model("Vote", voteSchema);
