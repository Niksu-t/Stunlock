import express from "express";
import { findData, storeToCache } from "./cache-controller.js";

export const cacheRouter = express.Router();


cacheRouter.route("/tocache/:id").post(storeToCache);

cacheRouter.route("/cache/:id").get(findData);