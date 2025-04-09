import {
  getUserById,
  createUser,
} from "./user_model.js";
import bcrpyt from "bcryptjs";

export const getUser = async (req, res) => {
  console.log("getUsers request: ", req.params.id);

  if (req.params.id) {
    const entry = await getUserById(req.params.id);

    if (entry) {
      return res.status(201).contentType("application/json").json(entry);
    } else {
      return res
        .status(404)
        .contentType("application/json")
        .json({ message: "Resource not found" });
    }
  }
  res
    .status(400)
    .contentType("application/json")
    .json({ message: "Request is missing id property." });
};

/**
 * Create a new user. Request requires unique username, password and unique email.
 */
export const postUser = async (req, res) => {
  console.log("postUsers request: ", req.body);

  if (req.body.username && req.body.password && req.body.email) {
    const hash_salt = await bcrpyt.genSalt(10);
    const hashed_password = await bcrpyt.hash(req.body.password, hash_salt);

    const user_id = await createUser(
      req.body.username,
      hashed_password,
      req.body.email
    );
    console.log(user_id);

    if (user_id) {
      return res
        .status(201)
        .contentType("application/json")
        .json({ message: `Resource added: ${user_id}.` });
    } else {
      return res
        .status(500)
        .contentType("application/json")
        .json({ message: "Internal server error." });
    }
  }
  res
    .status(400)
    .contentType("application/json")
    .json({ message: "Request is missing name property." });
};
