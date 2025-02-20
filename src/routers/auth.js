import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper";
import { getAuthController, loginUserController, refreshUserController, logoutAuthController} from "../controllers/auth";
import { authenticate } from "../middlewares/authenticate";
const router = Router();
//loginlerde sorun var
router.user(authenticate);
router.post('/auth/register',ctrlWrapper(getAuthController));
router.post('/auth/login',ctrlWrapper(loginUserController));
router.post('/auth/refresh',ctrlWrapper(refreshUserController));
router.post('/auth/logout',ctrlWrapper(logoutAuthController));