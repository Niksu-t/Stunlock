import promisePool from "../utils/database.js";

export const selectCareTeam = async () => {
  console.log("Searching for Care teams");
  try {
    const query = `SELECT * FROM CareGroup`;
    const row = await promisePool.query(query);
    return row;
  } catch (err) {
    console.log(err);
  }
};
