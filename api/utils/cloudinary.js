import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config({ path: "././.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFileUri) => {
    try {
        if (!localFileUri) return null;
        const response = await cloudinary.uploader.upload(localFileUri, {
            resource_type: "auto",
        });
        fs.unlinkSync(localFileUri);
        return response;
    } catch (error) {
        fs.unlinkSync(localFileUri);
        return null;
    }
};

export { uploadOnCloudinary };
