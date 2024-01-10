import jwt, { decode } from "jsonwebtoken";
import { ApiError, ApiResponse } from "../utils/ApiErrorRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { Admin } from "../models/admin.model.js";

dotenv.config({ path: "././.env" });

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken;

    if (!token) throw new ApiError(401, "Unauthorised request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const admin = await Admin.findById(decodedToken?.id);

    if (!admin) {
        throw new ApiError(401, "Invalid access token");
    }

    req.admin = admin;
    next();
});
