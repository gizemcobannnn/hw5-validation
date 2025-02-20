import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper";
import { getAuthController } from "../controllers/auth";
const router = Router();

router.post('/auth/register',ctrlWrapper(getAuthController));
router.post('/auth/login',ctrlWrapper);