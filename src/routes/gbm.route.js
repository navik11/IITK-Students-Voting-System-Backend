import {Router} from "express"
import { ccLogin, login, logout, sendOTP, submitVote } from "../controllers/gbm.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { ApiResponse } from "../utils/ApiErrorRes.js"

const router = Router()

router.route("/sendOTP").post(sendOTP)
router.route("/login").post(upload.array(), login)
router.route("/ccLogin").post(upload.array(), ccLogin)
router.route("/logout").post(verifyJWT, logout)
router.route("/submitVote").post(verifyJWT, submitVote)
router.route("/check-auth").post(verifyJWT, (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "User is authed"))
})
export default router