import { param } from "express-validator";
import promisePool from "../utils/database.js";
import { QueryResult } from "../utils/database.js";

export const getUserById = async (id) => {
  const query = `SELECT * FROM Users WHERE user_id = ${id}`;
  const [row] = await promisePool.query(query);

  return row[0];
};

export const modifyKubiosToken = async (token, expires_at, user_id) => {

  const query = `UPDATE Users SET kubios_token = ?, kubios_expires_at = ? WHERE user_id = ?`
  const params = [token, expires_at, user_id]

  try {
    const rows = await promisePool.query(query, params);
    return QueryResult.Success;
  }
  catch(err) {
      console.log(err);
      return QueryResult.Fail;
  }
}

export const createUser = async (
  fname,
  lname,
  password,
  email,
  kubios_user = null
) => {

  let query;
  let params = [];

  if(kubios_user) {
    query = `INSERT INTO Users (fname, lname, password, email, kubios_email, kubios_uuid, kubios_token, kubios_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    params = [fname, lname, password, email, kubios_user.email, kubios_user.uuid, kubios_user.id_token, kubios_user.expires_at]
  }
  else {
    query = `INSERT INTO Users (fname, lname, password, email) VALUES (?, ?, ?, ?)`;
    params = [fname, lname, password, email]


  }

  try {
    const rows = await promisePool.query(query, params);

    return RegisterResult.Success;

  } catch(error) {
    console.log(error)

    // Handle register errors
    switch(error.code) {
      // Duplicate email error
      case "ER_DUP_ENTRY":
        return RegisterResult.Duplicate;
    }

    // Default error
    return RegisterResult.Error;
  }
};

export const RegisterResult = {
  Success: "Register successfull",
  Duplicate: "Email already in use",
  Error: "Internal server error",
}

export const loginResult = {
  Success: "Success",
  IncorrectPassword: "IncorrectPassword",
  UserNotFound: "UserNotFound",
};

export const selectUserByNameAndPassword = async (username, password) => {
  const query = `SELECT * FROM Users WHERE username = ? AND password = ?`;

  const params = [username, password];

  try {
    const rows = await promisePool.query(query, params);

    // Return only 1st user, ugly work-around
    return rows[0][0];
  } catch {
    return 0;
  }
};

export const selectUserById = async (user_id) => {

    console.log("Searching for user with id of: ", user_id);

    try {
        const query = `SELECT * FROM Users where user_id=?`
        const params = [user_id]
        const row = await promisePool.query(query,params)

        if (row.length === 0) {
            return 0;
        }
        delete row[0].password;
        return row[0];
    }catch (err) {
        console.log("Error: " , err);
        return 0;
    }

};

export const selectUserByEmail = async (email) => {
  console.log("Searching for a user with an email of: ", email);

  try {
    const query = `SELECT * from Users where email=?`;
    const params = [email];
    const row = await promisePool.query(query, params);

    if (row.length === 0) {
      return 0
    }
    delete row[0].password;
    return row[0][0];
  } catch (err) {
    console.log("Error: ", err);
    return 0
  }
};

export const getUserHash = async (email) => {
  const query = `SELECT password FROM Users WHERE email = ?`;

  const params = [email];

  try {
    const [rows] = await promisePool.query(query, params);

    // Return only 1st user, ugly work-around
    return rows[0].password;
  } catch {
    return 0;
  }
};
