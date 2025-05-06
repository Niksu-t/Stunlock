import express from "express";
import { body } from "express-validator";

import { selectUserByEmail } from "./user_model.js";
import { postUser, getUser, validateInput } from "./user_controller.js";
import { authenticateToken, authorizeUser } from "../authentication/auth_middleware.js";
import { validationErrorHandler } from "../utils/error.js";

export const userRouter = express.Router();

/**
* @api {get} /users/:id Get a user by ID
* @apiName GetUser
* @apiGroup Users
* @apiPermission token or admin
*
* @apiHeader {String} Authorization Bearer token.
*
* @apiParam {Number} id User ID.
*
* @apiDescription Get a user with ID.
*
* @apiSuccess {Object} user User info.
*/

userRouter.route("/:id").get(authenticateToken, authorizeUser, getUser);

    /**
* @api {post} /users Create a new user.
* @apiName CreateUser
* @apiGroup Users
* @apiPermission all
*
*@apibody {String} fname First name of the user. Must be 2-25 characters long and alphanumeric.
*@apibody {String} lname Last name of the user. Must be 2-50 characters long and alphanumeric.
*@apibody {String} password password of the user. Must be 2-20 characters long
*@apibody {String} email Email of the user. Must be a valid email.
*@apibody {String} [role] Role of the user. Optional. Defaults to patient.
*@apibody {String} [careteam] Care team of the user. Optional. Defaults to null.
*
* @apiDescription Create a user.
*
* @apiSuccess {String} message Result of query.
*/
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

    /**
* @api {post} /users/validate validates a new user.
* @apiName validateUser
* @apiGroup Users
* @apiPermission all
*
*@apibody {String} fname First name of the user. Must be 2-25 characters long and alphanumeric.
*@apibody {String} lname Last name of the user. Must be 2-50 characters long and alphanumeric.
*@apibody {String} password password of the user. Must be 2-20 characters long
*@apibody {String} email Email of the user. Must be a valid email.
*
* @apiDescription Validates user.
*
* @apiSuccess {String} message Result of query.
*/

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