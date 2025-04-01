import express from "express";
import { body } from "express-validator";

import { postLogin, getMe, refreshToken } from "./auth_controller.js";
import { authenticateToken } from "./auth_middleware.js";
import { validationErrorHandler } from "../utils/error.js";

export const authRouter = express.Router();

authRouter.route("/login").post(postLogin);

authRouter.route("/me").get(authenticateToken, getMe);

authRouter.route("/refresh").post(refreshToken);
