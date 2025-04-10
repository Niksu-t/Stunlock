import {
  selectCareTeam,
  updateCareTeam,
  delCareTeam,
  addCareTeam,
} from "./caregroup_model.js";
import { customError } from "../utils/error.js";

export const getAllTeams = async (req, res) => {
  console.log("Get all users from database");

  try {
    const result = await selectCareTeam();
    return res.status(201).contentType("application/json").json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error" });
  }
};

export const updateTeam = async (req, res) => {
  console.log("Updated teams name: ", req.body.name);
  const name = req.body.name;
  const id = req.params.id;

  const team = await updateCareTeam(name, id);

  if (team != 0) {
    return res.status(201).json({ message: "Team updated" });
  } else {
    return next(customError("Team not found", 404));
  }
};

export const postTeam = async (req, res) => {
  console.log("Trying to create team: ", req.body.name);
  const name = req.body.name;

  const team = await addCareTeam(name);

  if (team != 0 ) {
    return res.status(201).json({message: "Team added"});
  }
  else {
    return next(customError("Internal server error", 500));
  }
};

export const delTeam = async (req, res) => {
  console.log("Deleting team with id of: ", req.params.id);

  const team = await delCareTeam();

  if (team != 0) {
    return res.status(201).json({message: "Team deleted"});
  }
  else {
    return next(customError("Internal server error", 500));
  }
}