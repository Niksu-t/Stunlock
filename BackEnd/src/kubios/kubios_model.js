import fetch from "node-fetch";
import { customError } from "../utils/error.js";

export const resultSelf = async (token) => {
  const url = process.env.KUBIOS_RESULT_URL;
  const options = {
    method: "GET",
    headers: { Authorization: token },
  };

  try {
    const response = await fetch(url, options);
    console.log("Kubios response: ", response);
    return response;
  } catch (err) {
    console.log("Error: ", err);
    throw customError("Could not get results from kubios", 401);
  }
};
