import express from "express";
import { getAllResults } from "./kubios_controller.js";

export const kubiosRouter = express.Router();

kubiosRouter.route("/").get(getAllResults);