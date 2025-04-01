import { customError } from "../utils/error.js";
import {
  getEntryById,
  getAllEntries,
  insertEntry,
  updateEntryById,
  QueryResult,
  deleteEntryById,
} from "./entry_model.js";

export const getEntry = async (req, res) => {
  console.log("getEntryById request: ", req.params.id);
  if (req.params.id) {
    const entry = await getEntryById(req.params.id);

    if (entry) {
      return res.status(201).contentType("application/json").json(entry);
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};

export const deleteEntry = async (req, res, next) => {
  console.log("deleteEntry request: ", req.params.id);

  if (req.params.id) {
    const entry = await deleteEntryById(req.params.id, req.body);

    if (entry == QueryResult.Success) {
      return res
        .status(200)
        .contentType("application/json")
        .json({ message: "Resource succesfully removed" });
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};

export const updateEntry = async (req, res, next) => {
  console.log("updateEntry request: ", req.body);

  if (req.params.id) {
    const entry = await updateEntryById(req.params.id, req.body);

    if (entry == QueryResult.Success) {
      return res
        .status(201)
        .contentType("application/json")
        .json({ message: "Resource succesfully updated" });
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};

export const getEntries = async (req, res) => {
  console.log("getEntries request");

  const entries = await getAllEntries(req.user.user_id);

  if (entries) {
    return res.status(201).contentType("application/json").json(entries);
  } else {
    return next(customError("Resource not found", 404));
  }
};

export const postEntry = async (req, res) => {
  console.log("postEntry request: ", req.body);

  const entry_id = await insertEntry(req.user, req.body);

  if (entry_id) {
    return res
      .status(200)
      .contentType("application/json")
      .json({ message: entry_id });
  } else {
    return res
      .status(500)
      .contentType("application/json")
      .json({ message: "Internal server error" });
  }
};

export const getEntriesAdmin = async (req, res) => {
  console.log("getAdminEntries request");

  if (req.query.id) {
    const entry = await getAllEntries(req.query.id);

    if (entry) {
      return res.status(201).contentType("application/json").json(entry);
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};
