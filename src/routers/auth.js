import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { createAuthController, loginUserController, refreshUserController, logoutAuthController, requestResetEmailController} from "../controllers/auth.js";
//import { authenticate } from "../middlewares/authenticate.js";
import { loginUserSchema, registerUserSchema, requestResetEmailSchema } from "../validation/auth.js";
import validateBody from '../middlewares/validateBody.js'
import { resetPasswordSchema } from "../validation/auth.js";
import { resetPasswordController } from "../controllers/auth.js";

const router = Router();

router.post('/auth/register',  validateBody(registerUserSchema),ctrlWrapper(createAuthController));
router.post('/auth/login', validateBody(loginUserSchema),ctrlWrapper(loginUserController));
router.post('/auth/refresh',ctrlWrapper(refreshUserController));
router.post('/auth/logout',ctrlWrapper(logoutAuthController));
router.post('/auth/send-reset-email',validateBody(requestResetEmailSchema),ctrlWrapper(requestResetEmailController));
router.post('/auth/reset-pwd',validateBody(resetPasswordSchema),ctrlWrapper(resetPasswordController),)

export default router;
