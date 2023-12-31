import dotenv from "dotenv";
import { ApiError, ApiResponse } from "../utils/ApiErrorRes.js";
import { asyncHandler, simpleAsyncHandler } from "../utils/asyncHandler.js";
import { sendMail } from "../utils/Nodemailer.js";
import { GBM } from "../models/gbm.model.js";
import { Vote } from "../models/vote.model.js";
import { Candidate } from "../models/candidates.model.js";

dotenv.config({ path: "././.env" });

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await GBM.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (e) {
        throw new ApiError(500, "Unable to generate access and refresh tokens");
    }
};

const sendOTP = asyncHandler(async (req, res) => {
    const email = String(req.query?.email).toLowerCase();

    if (!email || !email.includes(`@${process.env.COLLEGE_DOMAIN}`)) {
        throw new ApiError(405, "Not a valid college email");
    }

    const otp = String(Math.floor(Math.random() * 9000 + 1000));

    const mailOptions = {
        from: "Sachida <sachidanan22@iitk.ac.in>",
        to: email,
        subject: "OTP for Voting System Login",
        text: `Your OTP is: ${otp}`,
    };

    const eGbm = await GBM.findOne({ email });

    if (eGbm) {
        eGbm.otp = otp;
        await eGbm.save({ validateBeforeSave: false });
    } else {
        const cGbm = await GBM.create({
            email: email,
            otp: otp,
        });
        const gbm = await GBM.findById(cGbm._id);
        if (!gbm) {
            throw new ApiError(507, "Unable to create GBM");
        }
    }

    // Have to remove
    return res.json(`Messege sent, ${otp}`);

    await sendMail(mailOptions)
        .then((r) => {
            return res
                .status(200)
                .json(new ApiResponse(200, {}, "OTP sent successfuly"));
        })
        .catch((error) => {
            throw new ApiError(
                506,
                "Unable to send OTP, please call some Election Officer",
                error
            );
        });
});

const login = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !email.includes(`@${process.env.COLLEGE_DOMAIN}`)) {
        throw new ApiError(405, "Not a valid college email");
    }

    if (!otp) throw new ApiError(408, "Please enter otp");

    const gbm = await GBM.findOne({ email });

    if (!gbm) {
        throw new ApiError(408, "Please generate OTP first");
    }

    const isPasswordCorrect = await gbm.isOTPCorrect(otp);

    if (!isPasswordCorrect) {
        throw new ApiError(409, "Wrong OTP");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        gbm._id
    );

    const httpOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(202)
        .cookie("accessToken", accessToken, httpOptions)
        .cookie("refreshToken", refreshToken, httpOptions)
        .json(
            new ApiResponse(
                202,
                { accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

// verify JWT in advanced by multiware
const isVoted = asyncHandler(async (req, res) => {
    return res.status(406).json({isVoted: req.user.isVoted})
})

const submitVote = asyncHandler(async (req, res) => {
    if(req.user.isVoted) {
        throw new ApiError(403, "Your vote has been already submmited")
    }
    const voteData = req.body;
    const { pref1, pref2, pref3 } = voteData;

    if (!pref1 || !pref2 || !pref3) {
        throw new ApiError(402, "All prefrences is not selected");
    }

    const vote = await Vote.create({
        pref1,
        pref2,
        pref3,
    });

    const cVote = await Vote.findById(vote?._id);
    if (!cVote) {
        throw new ApiError(501, "Vote can't be created");
    }

    console.log(voteData, pref1, pref2, pref3);

    let messegeLog = [];

    for (const candidateRollno of pref1) {
        const candidate = await Candidate.findOne({
            rollno: candidateRollno,
        });
        if (!candidate) {
            throw new ApiError(
                502,
                `Invalid candidate!- Not registered in database ${candidateRollno}, \n${messegeLog}`
            );
        }

        candidate.pref1VoteCount = candidate.pref1VoteCount + 1;
        candidate.totalVoteCount = candidate.totalVoteCount + 3;
        await candidate.save({ validateBeforeSave: false });
        messegeLog.push(candidateRollno + ": +3");
    }
    for (const candidateRollno of pref2) {
        const candidate = await Candidate.findOne({
            rollno: candidateRollno,
        });
        if (!candidate) {
            throw new ApiError(
                502,
                `Invalid candidate!- Not registered in database ${candidateRollno}, \n${messegeLog}`
            );
        }

        candidate.pref2VoteCount = candidate.pref2VoteCount + 1;
        candidate.totalVoteCount = candidate.totalVoteCount + 2;
        await candidate.save({ validateBeforeSave: false });
        messegeLog.push(candidateRollno + ": +2");
    }
    for (const candidateRollno of pref3) {
        if (candidateRollno != 0) {
            const candidate = await Candidate.findOne({
                rollno: candidateRollno,
            });
            if (!candidate) {
                throw new ApiError(
                    502,
                    `Invalid candidate!- Not registered in database ${candidateRollno}, \n${messegeLog}`
                );
            }

            candidate.pref3VoteCount = candidate.pref3VoteCount + 1;
            candidate.totalVoteCount = candidate.totalVoteCount + 1;
            await candidate.save({ validateBeforeSave: false });
            messegeLog.push(candidateRollno + ": +1");
        } else {
            messegeLog.push("Third prefrence is undefined");
        }
    }

    const gbm = await GBM.findById(req.user._id)
    gbm.isVoted = true;
    await gbm.save({validateBeforeSave: false})

    return res.status(200).json(new ApiResponse(200, {messegeLog}, "Voting completed, Thank you!"));
});

export { sendOTP, login, submitVote, isVoted };
