import { selectCareTeam } from "./caregroup_model.js";

export const getAllTeams = async (req, res) => {
  console.log("Get all users from database");

  try {
    const result = await selectCareTeam();
    return res.status(201).contentType("application/json").json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: "Database error"});
  }
};
