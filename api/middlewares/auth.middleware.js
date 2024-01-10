import jwt, { decode } from "jsonwebtoken";
import { ApiError } from "../utils/ApiErrorRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { GBM } from "../models/gbm.model.js";

dotenv.config({ path: "././.env" });

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken;

    if (!token) throw new ApiError(401, "Unauthorised request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const gbm = await GBM.findById(decodedToken?.id).select(
        "-otp -refreshToken"
    );

    if (!gbm) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = gbm;
    next();
});
