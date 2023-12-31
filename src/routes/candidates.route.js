import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { addCandidate, countVotes, getCandidates } from '../controllers/candidate.controller.js'

const router = Router()

router.route("/add-candidate").post(upload.array(), addCandidate)
router.route("/countVotes").get(countVotes)
router.route("/getCandidates").get(getCandidates)

export default router