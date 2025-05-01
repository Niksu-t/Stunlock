import express from "express";
import { body } from "express-validator";

import { selectUserByEmail } from "./user_model.js";
import { postUser, getUser, validateInput } from "./user_controller.js";
import { authenticateToken, authorizeUser } from "../authentication/auth_middleware.js";
import { validationErrorHandler } from "../utils/error.js";

export const userRouter = express.Router();

userRouter.route("/:id").get(authenticateToken, authorizeUser, getUser);

userRouter
  .route("/")
  .post(
    body("fname", "Name must be 2-25 characters long and alphanumeric")
      .trim()
      .isLength({ min: 2, max: 25 })
      .matches(/^[a-zA-Z0-9-]+$/),
    body("lname", "Name must be 2-50 characters long")
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

userRouter
  .route("/validate")
  .post(
    body("fname", "Name must be 2-25 characters long and alphanumeric")
      .trim()
      .isLength({ min: 2, max: 25 })
      .matches(/^[a-zA-Z0-9-]+$/),
    body("lname", "Name must be 2-50 characters long")
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
      .normalizeEmail()
      .custom(async (email) => {
        const user = await selectUserByEmail(email);
      
        if(user) {
          throw new Error("Email already in use");
        }
        return true;
      }),
    body("role").optional(),
    body("careteam").optional(),
    validationErrorHandler,
    validateInput
  );