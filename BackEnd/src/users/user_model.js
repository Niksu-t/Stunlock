import promisePool from "../utils/database.js";

export const getUserById = async (id) => {
    const query = `SELECT * FROM Users WHERE user_id = ${id}`;
    const [row] = await promisePool.query(query);

    return row[0];
}

export const createUser = async (username, name,  password, email, careteam, role) => {
    const query = `INSERT INTO Users (username, name, password, email, care_team, role) VALUES (?, ?, ?, ?)`;
    const params = [username, name,  password, email, careteam,  role]

    try {
        const rows = await promisePool.query(query, params);

        return rows[0].insertId;
    }
    catch {
        return 0;
    }
}

export const loginResult = {
    Success: "Success",
    IncorrectPassword: "IncorrectPassword",
    UserNotFound: "UserNotFound"
}

export const selectUserByNameAndPassword = async (username, password) => {
    const query = `SELECT * FROM Users WHERE username = ? AND password = ?`;

    const params = [username, password];

    try {
        const rows = await promisePool.query(query, params);

        // Return only 1st user, ugly work-around
        return rows[0][0];
    }
    catch {
        return 0;
    }
}

export const getUserHash = async (username) => {
    const query = `SELECT password FROM Users WHERE username = ?`;

    const params = [username];

    try {
        const [rows] = await promisePool.query(query, params);
        
        // Return only 1st user, ugly work-around
        return rows[0].password;
    }
    catch {
        return 0;
    }
}