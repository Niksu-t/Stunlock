import { customError } from "../utils/error.js";
import { addKey, findWithKey } from "./cache-model.js";

// Tries to store data to cache by assigning a key to said data
export const storeToCache = async (req, res) => {
  console.log("Attempting to store to cache");

  // Trying to make the key user_id for easier identification
  const key = "user_id_" + req.params.id;
  const data = req.body.data;

  try {
    const response = await addKey(key, data);
    if (response == true) {
      res.sendStatus(201);
    } else {
      res.sendStatus(500);
    }
  } catch (err) {
    console.log("Error: ", err);
    throw customError("Failed to update cache", 500);
  }
};

// tries to find cached data
export const findData = async (req, res) => {
  console.log("Trying to find users data. Id: ", req.params.id);

  const key = "user_id_" + req.params.id;

  try {
    const response = await findWithKey(key);
    if (response != false) {
      res.status(200).json({ Data: response });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    console.log("Error: ", err);
    throw customError("Failed to find data", 500);
  }
};
