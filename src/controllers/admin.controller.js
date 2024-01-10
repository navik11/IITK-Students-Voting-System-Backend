import dotenv from "dotenv";
import { Admin } from "../models/admin.model.js";
import { Candidate } from "../models/candidates.model.js";
import { GBM } from "../models/gbm.model.js";
import { Vote } from "../models/vote.model.js";
import { ApiError, ApiResponse } from "../utils/ApiErrorRes.js";
import { validateUserCCAuth } from "../utils/Nodemailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

dotenv.config({ path: "././.env" });

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await Admin.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (e) {
        throw new ApiError(500, "Unable to generate access and refresh tokens");
    }
};

const ccLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !email.includes(`@${process.env.COLLEGE_DOMAIN}`)) {
        throw new ApiError(405, "Not a valid college email");
    }

    if (!password) throw new ApiError(408, "Please enter password");

    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new ApiError(403, "You are not an admin");
    }

    await validateUserCCAuth(email, password)
        .then((r) => {
            console.log("Authenticated");
        })
        .catch((error) => {
            throw new ApiError(401, "Wrong credentials", error);
        });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        admin._id
    );

    const httpOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    };

    return res
        .status(202)
        .cookie("accessToken", accessToken, httpOptions)
        .cookie("refreshToken", refreshToken, httpOptions)
        .json(
            new ApiResponse(
                202,
                { accessToken, refreshToken },
                "Admin logged in successfully"
            )
        );
});

const countVotes = asyncHandler(async (req, res) => {
    const positionCodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const totalGbmAppeared = await GBM.countDocuments();
    const totalVoteDropped = await Vote.countDocuments();

    let results = {};

    results = { totalGbmAppeared };
    results = { ...results, totalVoteDropped };

    for (const positionCode of positionCodes) {
        const result = await Candidate.aggregate([
            {
                $match: {
                    positioncode: positionCode,
                },
            },
            {
                $project: {
                    fullname: 1,
                    rollno: 1,
                    totalVoteCount: 1,
                    pref1VoteCount: 1,
                    pref2VoteCount: 1,
                    pref3VoteCount: 1,
                },
            },
            {
                $sort: {
                    totalVoteCount: -1,
                },
            },
        ]);
        results = { ...results, [positionCode]: result };
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { results }, "Vote counting done"));
});
export { ccLogin, countVotes };
