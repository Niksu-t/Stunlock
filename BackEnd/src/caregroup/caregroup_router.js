
import express from "express";
import {body} from "express-validator";


import { getAllTeams } from "./caregroup_controller.js";


export const teamRouter = express.Router();

teamRouter.route("/").get(getAllTeams);
