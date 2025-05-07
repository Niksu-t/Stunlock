import promisePool from "../utils/database.js";
import { QueryResult } from "../utils/database.js";

export const getEntryById = async (entry_id) => {
  console.log(entry_id);
  const query = `SELECT * FROM diary_entries WHERE entry_id = ${entry_id}`;
  const [row] = await promisePool.query(query);

  return row[0];
};

export const deleteEntryById = async (entry_id, new_entry) => {
  const query = `DELETE FROM diary_entries WHERE entry_id = ${entry_id}`;
  const params = [
    new_entry.mood,
    new_entry.sleep_hours,
    new_entry.weight,
    new_entry.notes,
  ];

  try {
    const rows = await promisePool.query(query, params);
    return QueryResult.Success;
  } catch (err) {
    console.log(err);
    return QueryResult.Fail;
  }
};

export const updateEntryById = async (entry_id, body) => {
  const query = `UPDATE diary_entries SET pain_points = ?,  stress_gauge = ?, pain_gauge = ?, stiffness_gauge = ?, sleep_gauge = ?, notes = ? WHERE entry_id = ${entry_id}`;
  const params = [
    body.pain_points,
    body.stress,
    body.pain,
    body.stiffness,
    body.sleep,
    body.notes,
  ];

  try {
    const rows = await promisePool.query(query, params);
    return QueryResult.Success;
  } catch (err) {
    console.log(err);
    return QueryResult.Fail;
  }
};

export const getAllEntries = async (user_id) => {
  const query = `SELECT * FROM diary_entries WHERE user_id = ${user_id}`;
  const [rows] = await promisePool.query(query);

  return rows;
};

export const insertEntry = async (user, body) => {
  const query = `INSERT INTO diary_entries (user_id, entry_date, pain_points, stress_gauge, pain_gauge, stiffness_gauge, sleep_gauge, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  let entry_date = new Date().toISOString().slice(0, 10);

  if (body.entry_date) entry_date = body.entry_date;

  const params = [
    user.user_id,
    entry_date,
    body.pain_points,
    body.stress,
    body.pain,
    body.stiffness,
    body.sleep,
    body.notes,
  ];

  try {
    const rows = await promisePool.query(query, params);

    return rows[0].insertId;
  } catch (e) {
    console.log(e);
    return 0;
  }
};

/**
 * Returns users entries on a given date. Only to be used for error handling purposes.
 * 
 * @param {*} date Day
 * @param {*} id 
 */
export const selectEntryByUserAndDate = async (date, id) => {
  const query = `SELECT * FROM diary_entries WHERE user_id = ? AND entry_date = ?`;

  try {
    const params = [id, date];

    const [rows] = await promisePool.query(query, params);

    return rows;
  } catch (e) {
    console.log(e);
    return 0;
  }
}
