import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs";

import {
  selectUserByNameAndPassword,
  getUserHash,
} from "../users/user_model.js";
import { customError } from "../utils/error.js";

// TODO: Add results and return correct code

/**
 * Endpoint for user authentication. Request body requires username and password.
 * @param {Express.Request} req - Request object.
 * @param {Express.Response} res - Response object
 * @param {Function} next - Next function for Express.js to invoke.
 */
export const postLogin = async (req, res, next) => {
  console.log("postLogin", req.body);

  if (req.body.username && req.body.password) {
    const hash = await getUserHash(req.body.username);

    if (!hash) {
      return next(customError("User not found", 404));
    }

    const match = await bcrypt.compare(req.body.password, hash);

    if (!match) {
      return next(customError("Incorrect password", 401));
    }

    const user = await selectUserByNameAndPassword(req.body.username, hash);
    if (user) {
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        partitioned: true,
      });

      return res
        .status(200)
        .contentType("application/json")
        .json({ ...user, token });
    }
  }
  return next(customError("Internal serverl error", 500));
};

/**
 * Attemps to refresh the users access token. A refresh token cookie is required for this function.
 * @param {Express.Request} req - Request object.
 * @param {Express.Response} res - Response object
 * @param {Function} next - Next function for Express.js to invoke.
 */
export const refreshToken = async (req, res, next) => {
  console.log("refreshToken request");

  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    return next(customError("No refresh token provided", 401));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await selectUserByNameAndPassword(
      decoded.username,
      decoded.password
    );

    // Issue a new access token
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Send the new access token to the client
    res.json({ token });
  } catch (error) {
    return next(customError("Invalid or expired refresh token", 403));
  }
};

export const getMe = async (req, res) => {
  console.log("getMe request", req.user);
  if (req.user) {
    let response = req.user;
    delete response.password;

    res.json({ user: response });
  } else {
    res.sendStatus(401);
  }
};
