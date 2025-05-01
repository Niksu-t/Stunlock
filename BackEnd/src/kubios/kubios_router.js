import express from "express";
import { getAllResults, postLoginKubios, validateKubios } from "./kubios_controller.js";
import { authenticateToken } from "../authentication/auth_middleware.js";

export const kubiosRouter = express.Router();

kubiosRouter.route("/").get(getAllResults);

kubiosRouter.route("/login").post(authenticateToken, postLoginKubios);

kubiosRouter.route("/validate").post(validateKubios);