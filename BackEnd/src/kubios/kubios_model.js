import fetch from "node-fetch";
import { customError } from "../utils/error.js";

export const resultSelf = async (token) => {
  const url = process.env.KUBIOS_API_URI;
  const options = {
    method: "GET",
    headers: { Authorization: token },
  };

  try {
    const response = await fetch(`${url}/result/self?types=readiness&daily=yes&from=2019-08-19T05:50:52Z`, options);
    return await response.json();

  } catch (err) {
    console.log("Error: ", err);
    throw customError("Could not get results from kubios", 401);
  }
};
