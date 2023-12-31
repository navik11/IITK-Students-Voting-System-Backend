import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/ApiErrorRes.js";
import { Candidate } from "../models/candidates.model.js";
import { GBM } from "../models/gbm.model.js";
import { Vote } from "../models/vote.model.js";

const addCandidate = asyncHandler(async (req, res) => {
    const { fullname, rollno, email, positioncode, avatar } = req.body;

    if (
        [fullname, rollno, email, positioncode, avatar].some(
            (feilds) => feilds == "" || feilds?.trim() === ""
        )
    ) {
        throw new ApiError(402, "All feilds are requires");
    }

    const existedCandidate = await Candidate.findOne({ rollno });

    if (existedCandidate) {
        throw new ApiError(403, "Candidate already exists");
    }

    const candidate = await Candidate.create({
        fullname,
        rollno,
        email,
        positioncode,
        avatar,
    });

    const createdUser = await Candidate.findById(candidate._id);

    if (!createdUser) {
        throw new ApiError(501, "User cant be created");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { createdUser }, "Candidate added"));
});

const getCandidates = asyncHandler(async (req, res) => {
    const positions = req.query.positions;

    if (!positions) {
        throw new ApiError(500, "Invalid request");
    }

    let positionCodes = String(positions).split(",");
    positionCodes = positionCodes.map(Number);

    let allCandidates = {};

    for (const positionCode of positionCodes) {
        const candidates = await Candidate.aggregate([
            {
                $match: {
                    positioncode: positionCode,
                },
            },
            {
                $project: {
                    rollno: 1,
                    fullname: 1,
                    avatar: 1,
                    email: 1,
                },
            },
        ]);

        allCandidates = { ...allCandidates, [positionCode]: candidates };
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { allCandidates },
                "Requested candidates fetched successfully"
            )
        );
});

const countVotes = asyncHandler(async (req, res) => {
    const positionCodes = [1, 2, 3];

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

export { addCandidate, countVotes, getCandidates };
