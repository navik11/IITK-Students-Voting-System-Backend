import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    addCandidate,
    getCandidates,
} from "../controllers/candidate.controller.js";

const router = Router();

router.route("/getCandidates").get(getCandidates);

export default router;
