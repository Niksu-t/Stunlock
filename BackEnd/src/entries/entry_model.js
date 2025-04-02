import promisePool from "../utils/database.js";

export const QueryResult = {
    Success: "success",
    Fail: "fail"
};

export const getEntryById = async (entry_id) => {
    console.log(entry_id)
    const query = `SELECT * FROM diary_entries WHERE entry_id = ${entry_id}`
    const [row] = await promisePool.query(query);

    return row[0];
}

export const deleteEntryById = async (entry_id, new_entry) => {
    const query = `DELETE FROM diary_entries WHERE entry_id = ${entry_id}`;
    const params = [new_entry.mood, new_entry.sleep_hours, new_entry.weight, new_entry.notes];

    try {
        const rows = await promisePool.query(query, params);
        return QueryResult.Success;
    }
    catch(err) {
        console.log(err);
        return QueryResult.Fail;
    }
}

export const updateEntryById = async (entry_id, new_entry) => {
    const query = `UPDATE diary_entries SET pain_gauge = ?, sleep_gauge = ?, food_gauge = ?, activity_gauge = ?, stress_gauge = ?, notes = ? WHERE entry_id = ${entry_id}`;
    const params = [new_entry.pain,new_entry.sleep, new_entry.food, new_entry.activity, new_entry.stress, new_entry.notes];

    try {
        const rows = await promisePool.query(query, params);
        return QueryResult.Success;
    }
    catch(err) {
        console.log(err);
        return QueryResult.Fail;
    }
}

export const getAllEntries = async (user_id) => {
    const query = `SELECT * FROM diary_entries WHERE user_id = ${user_id}`
    const [rows] = await promisePool.query(query);

    return rows;
}

export const insertEntry = async (user, request_body) => {
    const query = `INSERT INTO diary_entries (user_id, entry_date, pain_gauge, sleep_gauge, food_gauge, activity_gauge, stress_gauge, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const entry_date = new Date().toJSON().slice(0, 10);
    const params = [user.user_id, entry_date, request_body.pain, request_body.sleep, request_body.food, request_body.activity, request_body.stress, request_body.notes]

    try {
        const rows = await promisePool.query(query, params);

        return rows[0].insertId;
    }
    catch {
        return 0;
    }
}