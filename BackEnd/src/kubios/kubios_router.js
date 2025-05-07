import express from "express";
import {
  getAllResults,
  postLoginKubios,
  validateKubios,
} from "./kubios_controller.js";
import { authenticateToken } from "../authentication/auth_middleware.js";

export const kubiosRouter = express.Router();

/**
* @api {get} /kubios Get all user results
* @apiName GetResults
* @apiGroup Kubios
* @apiPermission token
*
* @apiHeader {String} Authorization token.
**
* @apiDescription Get user results from kubios cloud.
*
* @apiSuccess {Array} kubios Array of results.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
  "results": [
    {
      "create_timestamp": "2019-08-20T04:47:38.454525+00:00",
      "measured_timestamp": "2019-08-20T07:47:38.454525+03:00",
      "daily_result": "2019-08-20",
      "measure_id": "20b6d5bc-66b7-4527-b535-004b2e073635",
      "result": {},
      "result_id": "842bfc80-23d4-4b71-9baf-311f1456a40e",
      "result_type": "readiness"
    },
    {
      "create_timestamp": "2019-08-20T04:47:39.723131+00:00",
      "measured_timestamp": "2019-08-20T07:47:39.723131+03:00",
      "daily_result": null,
      "measure_id": "62862563-d73e-4d33-a0cf-9b6a345bacea",
      "result": {},
      "result_id": "6bd75bae-6fba-4ea2-ab2d-3a747d88d8f0",
      "result_type": "readiness"
    }
  ],
  "status": "ok"
}
 */
kubiosRouter.route("/").get(getAllResults);
/**
 * @api {post} /kubios/login Login
 * @apiName PostLoginKubios
 * @apiGroup Kubios
 * @apiPermission all
 *
 * @apiDescription Sign in and get an access token for the user.
 *
 * @apiBody {String} username Username of the user in kubios cloud the username is the email of the user.
 * @apiBody {String} password Password of the user.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "johndoe@email.com",
 *      "password": "examplepass"
 *    }
 *
 * @apiSuccess {String} token Token for kubios cloud results / measurements.
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
 *      }
 *    } *
 */
kubiosRouter.route("/login").post(authenticateToken, postLoginKubios);
/**
 * @api {post} /kubios/validate validates a new user.
 * @apiName validateKubios
 * @apiGroup Kubios
 * @apiPermission all
 *
 * @apiBody {String} username Username of the user in kubios cloud the username is the email of the user.
 * @apiBody {String} password Password of the user.
 *
 * @apiDescription Validates kubios.
 *
 * @apiSuccess {String} message Result of query.
 */
kubiosRouter.route("/validate").post(validateKubios);
