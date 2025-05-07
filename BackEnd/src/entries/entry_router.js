import express, { json } from "express";
import { body } from "express-validator";

import {
  deleteEntry,
  getEntries,
  getEntry,
  postEntry,
  updateEntry,
} from "./entry_controller.js";
import {
  authenticateToken,
  authorizeEntry,
} from "../authentication/auth_middleware.js";
import { validationErrorHandler } from "../utils/error.js";

export const entryRouter = express.Router();

entryRouter
  .route("/:id")
  /**
* @api {get} /entries/:id Get a entry by ID
* @apiName GetEntry
* @apiGroup Entries
* @apiPermission token
*
* @apiHeader {String} Authorization Bearer token.
*
* @apiParam {Number} id Entry ID.
*
* @apiDescription Get a entry with ID.
*
* @apiSuccess {Object} entry Entry info.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*  "entry_id": 52,
*  "user_id": 21,
*  "pain_points": {"TMJ": "TRUE"}
*  "entry_date": 2025-03-09T22:00:00.000Z,
*  "stress_gauge": 1,
*  "pain_gauge": 2,
*  "stiffness_gauge": 3,
*  "sleep_gauge": 4,
*  "notes": lorem ipsum,
*  "create_at": 2025-03-10T16:14:50.000Z
* }
*/

  .get(authenticateToken, authorizeEntry, getEntry)
/**
* @api {delete} /entries/:id Delete a entry by ID
* @apiName DeleteEntry
* @apiGroup Entries
* @apiPermission token
*
* @apiHeader {String} Authorization Bearer token.
*
* @apiParam {Number} id Entry ID.
*
* @apiDescription Delete a entry with ID.
*
* @apiSuccess {String} message Query response.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*  "message": "Resource successfully removed",
* }
*/
  .delete(authenticateToken, authorizeEntry, deleteEntry)
/**
* @api {put} /entries/:id Modify a entry by ID
* @apiName PutEntry
* @apiGroup Entries
* @apiPermission token
*
* @apiHeader {String} Authorization Bearer token.
*
* @apiParam {Number} id Entry ID.
*
* @apiDescription Modify a entry with ID.
*
* @apiSuccess {String} message Query response.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*  "message": "Resource successfully modified",
* }
*/
  .put(
    authenticateToken,
    authorizeEntry,
    body("pain_points").notEmpty(),
    body("stress").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("pain").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("stiffness").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("sleep").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("notes").isLength({ min: 0, max: 1500 }).escape(),
    validationErrorHandler,
    updateEntry
  );

entryRouter
  .route("/")
/**
* @api {get} /entries Get all user entries
* @apiName GetEntry
* @apiGroup Entries
* @apiPermission token
*
* @apiHeader {String} Authorization Bearer token.
**
* @apiDescription Modify a entry with ID.
*
* @apiSuccess {Array} entries Array of entries.
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*  "entries": [
{
*  "entry_id": 52,
*  "user_id": 21,
    "pain_points: {"TMJ: TRUE"}"
*  "entry_date": 2025-03-09T22:00:00.000Z,
    "stress_gauge: 1",
    "pain_gauge: 2",
    "stiffness_gauge: 3",
    "sleep_gauge: 4",
    "notes: lorem ipsum",
*  "create_at": 2025-03-10T16:14:50.000Z
* },
{
*  "entry_id": 53,
*  "user_id": 21,
    "pain_points: {"TMJ: TRUE"}"
*  "entry_date": 2025-04-09T22:00:00.000Z,
    "stress_gauge: 2",
    "pain_gauge: 3",
    "stiffness_gauge: 4",
    "sleep_gauge: 6",
    "notes: lorem ipsum",
*  "create_at": 2025-03-10T16:14:50.000Z
* }
*/
  
  .get(authenticateToken, getEntries)
/**
* @api {post} /entries Create a entry.
* @apiName PostEntry
* @apiGroup Authentication
* @apiPermission token
*
* @apiHeader {String} Authorization Bearer token.
*
* @apiDescription Create a entry.
*
* @apiBody {json} pain_points
* @apiBody {Number} stress
* @apiBody {Number} pain
* @apiBody {Number} stiffness
* @apiBody {Number} sleep
* @apiBody {String} notes
*
* @apiParamExample {json} Request-Example:
*    {
*      "pain_points": {"TMJ: true"},
*      "stress": 5
*      "pain": 6
*      "stiffness": 10
*      "sleep": 5,
*      "notes": "example"
*    }
*
* @apiSuccess {String} message Entry ID.
*
* @apiSuccessExample Success-Response:
*    HTTP/1.1 200 OK
*    {
*      "message": 25
*    }
*/
  .post(
    authenticateToken,
    body("pain_points").notEmpty(),
    body("stress").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("pain").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("stiffness").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("sleep").trim().notEmpty().isInt({ min: 0, max: 10 }),
    body("notes").isLength({ min: 0, max: 1500 }).escape(),
    validationErrorHandler,
    postEntry
  );
