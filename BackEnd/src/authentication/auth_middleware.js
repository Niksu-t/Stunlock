import jwt from "jsonwebtoken";
import "dotenv/config";
import { customError } from "../utils/error.js";
import { getEntryById } from "../entries/entry_model.js";

export const UserRole = {
  Regular: "regular",
  Admin: "admin",
};

/**
 * Used to authenticate logged in user. Must be invoked before invoking functions requiring user authentication.
 */
export const authenticateToken = (req, res, next) => {
  console.log("authenticateToken request");
  const accessToken = req.cookies?.auth_token;

  try {
    req.user = jwt.verify(accessToken, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(customError("Invalid token", 403));
  }
};

/**
 * Used to authorize that the requested entry ID is owned by the authenticated used.
 * Should be invoked after calling {@link authenticateToken}.
 */
export const authorizeEntry = async (req, res, next) => {
  console.log("authenticateEntry request");

  const entry = await getEntryById(req.params.id);

  if (!entry) {
    return next(customError("Resource not found", 404));
  }

  /// Check if request entry ID is owned by user
  if (
    req.user.user_level == UserRole.Admin ||
    entry.user_id == req.user.user_id
  ) {
    return next();
  }

  return next(customError("Unauthorized", 403));
};

/**
 * Used to authorize that the requested entry ID is owned by the authenticated used.
 * Should be invoked after calling {@link authenticateToken}.
 */
export const authorizeUser = async (req, res, next) => {
  console.log("authenticateUser request");

  if (
    req.user.user_level == UserRole.Admin ||
    req.user.user_id == req.params.id
  ) {
    return next();
  }

  return next(customError("Unauthorized", 403));
};
