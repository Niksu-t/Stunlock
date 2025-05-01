import jwt from "jsonwebtoken";
import "dotenv/config";

import { linkKubios } from "../authentication/auth_controller.js";
import {
  getUserById,
  createUser,
  RegisterResult,
  selectUserByEmail
} from "./user_model.js";
import bcrpyt from "bcryptjs";

export const validateInput = async (req, res, next) => {
  const user = await selectUserByEmail(req.body.email);

  if(user) {
    return next(new Error("Email already in use"));
  }

  return res
    .status(200)
    .contentType("application/json")
    .json({ message: "Validation successfull" });
}

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
    const kubios_user = await linkKubios(req.body.kubios_email, req.body.kubios_password);

    const hash_salt = await bcrpyt.genSalt(10);
    const hashed_password = await bcrpyt.hash(req.body.password, hash_salt);

    const register_result = await createUser(
      req.body.fname,
      req.body.lname,
      hashed_password,
      req.body.email,
      kubios_user
    );

    // Handle registration result
    if (register_result == RegisterResult.Success) {
      let return_json = {
        message: `Resource successfully added.`
      };

      if(kubios_user) {
        return_json.kubios_token = kubios_user.id_token;
      }

      const user = await selectUserByEmail(req.body.email);

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        partitioned: true,
      })

      return res
        .status(201)
        .contentType("application/json")
        .json(return_json);
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
