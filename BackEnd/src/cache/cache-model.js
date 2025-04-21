import { tempCache } from "../index.js";

export const addKey = async (key, data) => {
  console.log("Adding ", data, " with key of ", key);

  try {
    const success = tempCache.set(key, data);
    console.log("Was successful: ", success);
    return success;
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const findWithKey = async (key) => {
  console.log("Finding data with key: ", key);

  try {
    const success = tempCache.get(key);
    console.log(success);
    if (success == undefined) {
      return false;
    } else {
      return success;
    }
  } catch (err) {
    console.log("Error:", err);
  }
};
