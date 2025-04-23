import "dotenv/config";
import fetch from 'node-fetch';
import {v4} from 'uuid';

import { resultSelf } from "./kubios_model.js";
import { customError } from "../utils/error.js";


function isOnWeeksAgo(dateStr, num_of_weeks = 0) {
  const now = new Date();

  const dayOfWeek = now.getDay(); // Sunday = 0
  const diffToMonday = (dayOfWeek + 6) % 7;

  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - diffToMonday);
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfTargetWeek = new Date(startOfThisWeek);
  startOfTargetWeek.setDate(startOfThisWeek.getDate() - num_of_weeks * 7);

  const endOfTargetWeek = new Date(startOfTargetWeek);
  endOfTargetWeek.setDate(startOfTargetWeek.getDate() + 6);
  endOfTargetWeek.setHours(23, 59, 59, 999);

  return dateStr >= startOfTargetWeek && dateStr <= endOfTargetWeek;
}

export const getAllResults = async (req, res) => {
  console.log("Kubios token: ", req.authorization);

  const token = req.headers["authorization"];

  try {
    const result = await resultSelf(token);
    console.log("Kubios result: ", result);

    // TODO: Remove nested results in model

    // Filters 
    const week_result = result.results
      .filter(item => isOnWeeksAgo(new Date(item.daily_result), 0))
      .map(item => ({ 
        date: item.daily_result,
        rmssd_ms: item.result.rmssd_ms 
    }));;

    console.log("This week:", week_result);

    return res.status(201).json({ Data: week_result });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const postLoginKubios = async (req, res, next) => {
  const csrf = v4();
  const headers = new Headers();
  headers.append('Cookie', `XSRF-TOKEN=${csrf}`);
  headers.append("User-Agent", process.env.KUBIOS_USER_AGENT);

  console.log(req.user);

  const params = new URLSearchParams({
    username: req.user.kubios_email,
    password: req.body.password,
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    response_type: 'token',
    scope: "openid",
    access_type: 'offline',
    _csrf: csrf,
  });

  const options = {
    method: 'POST',
    headers: headers,
    redirect: 'manual',
    body: params,
  };

  let response;

  try {
    response = await fetch(process.env.AUTH_URL, options);
  } catch (err) {
    console.error('Kubios login error', err);
    return next(customError(
      'Login with Kubios failed', 
      500
    ));
  }

  const location = response.headers.raw().location[0];
  // console.log(location);
  // If login fails, location contains 'login?null'
  if (location.includes('login?null')) {
    return next(customError(
      'Login with Kubios failed due bad username/password',
      401,
    ));
  }

  const regex = /id_token=(.*)&access_token=(.*)&expires_in=(.*)/;
  const match = location.match(regex);
  const idToken = match[1];

  return res
    .status(200)
    .contentType("application/json")
    .json({ token: idToken });

} 