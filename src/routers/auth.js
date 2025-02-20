import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper";
const router = Router();

router.post('/auth/register',ctrlWrapper)