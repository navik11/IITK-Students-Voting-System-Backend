import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    batch: {
        type: String,
        required: true,
    },
});

export const Student = new mongoose.model("Student", studentSchema);
