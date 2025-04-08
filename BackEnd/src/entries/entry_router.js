import express from "express";
import { body } from "express-validator";

import {
  deleteEntry,
  getEntries,
  getEntry,
  postEntry,
  updateEntry,
} from "./entry_controller.js";
import { authenticateToken, authorizeEntry } from "../authentication/auth_middleware.js";
import { validationErrorHandler } from "../utils/error.js";

export const entryRouter = express.Router();

entryRouter
  .route("/:id")

  .get(authenticateToken, authorizeEntry, getEntry)

  .delete(authenticateToken, authorizeEntry, deleteEntry)

  .put(
    authenticateToken,
    authorizeEntry,
    body("pain").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("sleep").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("food").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("activity").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("stress").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("notes").isLength({ min: 0, max: 1500 }).escape(),
    body("notes")
      .trim()
      .escape()
      .custom((value, { req }) => {
        console.log("custom validator", value);
        return !(req.body.mood === value);
      }),
    validationErrorHandler,
    updateEntry
  );

entryRouter
  .route("/")

  .get(authenticateToken, getEntries)

  .post(
    authenticateToken,
    body("pain").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("sleep").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("food").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("activity").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("stress").trim().notEmpty().isInt({ min: 1, max: 10 }),
    body("notes").isLength({ min: 0, max: 1500 }).escape(),
    body("notes")
      .trim()
      .escape()
      .custom((value, { req }) => {
        console.log("custom validator", value);
        return !(req.body.mood === value);
      }),
    validationErrorHandler,
    postEntry
  );
