import {Router} from "express"
import { login, sendOTP, submitVote } from "../controllers/gbm.controller.js"
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/sendOTP").post(sendOTP)
router.route("/login").post(upload.array(), login)
router.route("/submitVote").post(verifyJWT, submitVote)

export default router