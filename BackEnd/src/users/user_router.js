import express from "express";
import { body } from "express-validator";

import { postUser, getUser } from "./user_controller.js";
import {
  authenticateToken,
  authorizeUser,
} from "../authentication/auth_middleware.js";
import { validationErrorHandler } from "../utils/error.js";

export const userRouter = express.Router();

userRouter.route("/:id").get(authenticateToken, authorizeUser, getUser);

userRouter
  .route("/")
  .post(
    body("username", "Name must be 3-20 characters long and alphanumeric")
      .trim()
      .isLength({ min: 3, max: 25 })
      .isAlphanumeric(),
    body("name", "Name must be 3-50 characters long")
      .trim()
      .isLength({ min: 2, max: 50 })
      .isAlphanumeric(),
    body("password", "Password must be 2-20 characters long")
      .trim()
      .isLength({ min: 2, max: 20 }),
    body("email", "Email must be valid")
      .trim()
      .isLength({ min: 8, max: 128 })
      .isEmail()
      .normalizeEmail(),
    body("role").optional(),
    body("careteam").optional(),
    validationErrorHandler,
    postUser
  );
