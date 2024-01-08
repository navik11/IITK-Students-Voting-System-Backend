import { Router } from "express";
import { ccLogin, countVotes } from "../controllers/admin.controller.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";
import { ApiResponse } from "../utils/ApiErrorRes.js";
import { addCandidate } from "../controllers/candidate.controller.js";

const router = Router()

router.route("/ccLogin").post(upload.array(), ccLogin)
router.route("/check-auth").post(verifyAdminJWT, (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "Admin is authed"))
})
router.route("/countVotes").get(verifyAdminJWT, countVotes)
router.route("/addCandidate").post(upload.fields([
    {
        name: 'avatar',
        maxCount: 1,
    }
]), verifyAdminJWT, addCandidate)

export default router