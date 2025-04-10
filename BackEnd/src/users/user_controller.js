import { authenticateKubios } from "../authentication/auth_controller.js";
import {
  getUserById,
  createUser,
  RegisterResult,
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
 * Create a new user. Request requires fist name, last name, password and unique email.
 */
export const postUser = async (req, res) => {
  console.log("postUsers request: ", req.body);

  if (req.body.fname && req.body.lname && req.body.password && req.body.email) {
    if(req.body.kubios_password) {
      // Kubios login test, successfull. Not implemented anywhere
      // TODO: Add Kubios user id and id_token to database if login is succesfull
      const kubios_user = await authenticateKubios(req.body.kubios_email, req.body.kubios_password);
    }

    const hash_salt = await bcrpyt.genSalt(10);
    const hashed_password = await bcrpyt.hash(req.body.password, hash_salt);

    const register_result = await createUser(
      req.body.fname,
      req.body.lname,
      hashed_password,
      req.body.email
    );

    // Handle registration result
    if (register_result == RegisterResult.Success) {
      return res
        .status(201)
        .contentType("application/json")
        .json({ message: `Resource successfully added.` });
    } else {
      return res
        .status(500)
        .contentType("application/json")
        .json({ message: register_result });
    }
  }
  return res
    .status(400)
    .contentType("application/json")
    .json({ message: "Request is missing name property." });
};
