import promisePool from "../utils/database.js";


// search for care teams from database
export const selectCareTeam = async () => {
  console.log("Searching for Care teams");
  try {
    const query = `SELECT * FROM CareGroup`;
    const row = await promisePool.query(query);
    return row;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

// add care team to database
export const addCareTeam = async (team) => {
  console.log("Trying to create a care team");

  const query = `INSERT INTO CareGroup (name) VALUES (?)`;
  const params = [team.name];
  try {
    const rows = await promisePool.query(query, params);
    console.log("Affected rows: ", rows);
    return { message: "Care team added" };
  } catch (err) {
    console.log("Error: ", err);
    return 0;
  }
};

// Delete team
export const delCareTeam = async (id) => {
  console.log("Deleting care team with id: ", id);
  
  const query = `DELETE FROM CareGroup WHERE group_id=?`
  const params = [id];
  try {
    const rows = promisePool.query(query,params);
    console.log("Team deleted with: ", id);
    return {message: "Care team deleted"};
  }catch (err) {
    console.log("Error: ", err);
    return 0;
  }

};
