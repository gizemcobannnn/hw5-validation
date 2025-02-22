import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { createAuthController, loginUserController, refreshUserController, logoutAuthController} from "../controllers/auth.js";
import { authenticate } from "../middlewares/authenticate.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
import validateBody from '../middlewares/validateBody.js'

const router = Router();
//loginlerde sorun var
router.use(authenticate);
router.post('/auth/register',  validateBody(registerUserSchema),ctrlWrapper(createAuthController));
router.post('/auth/login', validateBody(loginUserSchema),ctrlWrapper(loginUserController));
router.post('/auth/refresh',ctrlWrapper(refreshUserController));
router.post('/auth/logout',ctrlWrapper(logoutAuthController));

export default router;
