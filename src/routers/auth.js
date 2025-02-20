import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper";
import { getAuthController, loginAuthController, loginUserController, refreshUserController, logoutAuthController} from "../controllers/auth";
const router = Router();
//loginlerde sorun var
router.post('/auth/register',ctrlWrapper(getAuthController));
router.post('/auth/login',ctrlWrapper(loginUserController));
router.post('/auth/refresh',ctrlWrapper(refreshUserController));
router.post('/auth/logout',ctrlWrapper(logoutAuthController));