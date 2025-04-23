import { customError } from "../utils/error.js";
import { addKey, findWithKey } from "./cache-model.js";

// Tries to store data to cache by assigning a key to said data
export const storeToCache = async (user_id, userInfo, entries) => {
  console.log("Attempting to store to cache");

  // Trying to make the key user_id for easier identification
  const key = "user_id_" + user_id;
  // Trying to make data object contain two params
  const data = [userInfo, entries];

  try {
    // Returns either true or false
    const response = await addKey(key, data);
    return response;
  } catch (err) {
    console.log("Error: ", err);
    throw customError("Failed to update cache", 500);
  }
};

// tries to find cached data
export const findData = async (user_id) => {
  console.log("Trying to find users data. Id: ", user_id);

  // Sets key for finding data from cache;
  const key = "user_id_" + user_id;

  try {
    // Returns either true or false
    const response = await findWithKey(key);
    return response;
  } catch (err) {
    console.log("Error: ", err);
    throw customError("Failed to find data", 500);
  }
};
