
import express from "express";
import {body} from "express-validator";


import { getAllTeams } from "./caregroup_controller.js";


export const teamRouter = express.Router();
  /**
 * @api {GET} /careteams Gets all careteams
 * @apiName GetTeams
 * @apiGroup Caregroups
 * @apiPermission all
 *
 * @apiSuccess {String} message message with caregroups
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       Care teams: {"Name: example caregoup, ID: x "}
 *     }
 *
 * @apiError 500 server error.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Forbidden
 *     {
 *       "message": "internall server error"
 *     }
 */
teamRouter.route("/").get(getAllTeams);

//teamRouter.route("/:id").put()