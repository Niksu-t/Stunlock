import express from "express";
import { body } from "express-validator";

import { postLogin, getMe, refreshToken, logOut } from "./auth_controller.js";
import { authenticateToken } from "./auth_middleware.js";
import { validationErrorHandler } from "../utils/error.js";

export const authRouter = express.Router();

/**
 * @api {post} /auth/login Login
 * @apiName PostLogin
 * @apiGroup Authentication
 * @apiPermission all
 *
 * @apiDescription Sign in and get an access and refresh token for the user.
 *
 * @apiBody {String} username Username of the user.
 * @apiBody {String} password Password of the user.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "johnd",
 *      "password": "examplepass"
 *    }
 *
 * @apiSuccess {String} token Token for the user authentication.
 * @apiSuccess {Object} user User info.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Logged in successfully",
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwid
 *                XNlcm5hbWUiOiJ1dXNpMSIsImVtYWlsIjoidXVzaTFAZXhhbXBsZS5jb20
 *                iLCJ1c2VyX2xldmVsX2lkIjoyLCJpYXQiOjE3MDEyNzkzMjJ9.3TbVTcXS
 *                dryTDm_huuXC_U1Lg4rL0SOFyn_WAsC6W0Y"
 *      "user": {
 *        "user_id": 21,
 *        "username": "johnd",
 *        "email": "johnd@example.com",
 *        "user_level": "regular"
 *      }
 *    } *
 */
authRouter.route("/login").post(postLogin);
/**
 * @api {get} /auth/me Request information about current user
 * @apiName GetMe
 * @apiGroup Authentication
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object} user User info.
 * @apiSuccess {Number} user.user_id Id of the User.
 * @apiSuccess {String} user.username Username of the User.
 * @apiSuccess {String} user.email email of the User.
 * @apiSuccess {Number} user.user_level_id User level id of the User.
 * @apiSuccess {Number} user.iat Token creation timestamp.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user_id": 21,
 *       "username": "johnd",
 *       "email": "johnd@example.com",
 *       "user_level_id": 2,
 *       "iat": 1701279021
 *     }
 *
 * @apiError InvalidToken Authentication token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "invalid token"
 *     }
 */

authRouter.route("/me").get(authenticateToken, getMe);
/**
 * @api {post} /auth/refresh Refresh access token
 * @apiName Refresh
 * @apiGroup Authentication
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} token Token for the user authentication.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwid
 *                XNlcm5hbWUiOiJ1dXNpMSIsImVtYWlsIjoidXVzaTFAZXhhbXBsZS5jb20
 *                iLCJ1c2VyX2xldmVsX2lkIjoyLCJpYXQiOjE3MDEyNzkzMjJ9.3TbVTcXS
 *                dryTDm_huuXC_U1Lg4rL0SOFyn_WAsC6W0Y"
 *     }
 *
 * @apiError InvalidToken Authentication token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "invalid token"
 *     }
 */
authRouter.route("/refresh").post(refreshToken);

    /**
 * @api {GET} /auth/logout Logs user out
 * @apiName Logout
 * @apiGroup Authentication
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {String} token Token for the user authentication.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": "User logged out Succesfully"
 *     }
 *
 * @apiError InvalidToken Authentication token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Forbidden
 *     {
 *       "message": "internall server error"
 *     }
 */

authRouter.route("/logout").get(logOut);
