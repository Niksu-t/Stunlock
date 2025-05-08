import { customError } from "../utils/error.js";
import {
  getEntryById,
  getAllEntries,
  insertEntry,
  updateEntryById,
  deleteEntryById,
} from "./entry_model.js";

import { QueryResult } from "../utils/database.js";

export const getEntry = async (req, res) => {
  console.log("getEntryById request: ", req.params.id);
  if (req.params.id) {
    const entry = await getEntryById(req.params.id);

    if (entry) {
      const pain_points_json = painpointsToJson(entry.pain_points);
      const new_entry = SerializeReply(entry, pain_points_json)
      return res.status(201).contentType("application/json").json(new_entry);
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};

export const deleteEntry = async (req, res, next) => {
  console.log("deleteEntry request: ", req.params.id);

  if (req.params.id) {
    const entry = await deleteEntryById(req.params.id, req.body);

    if (entry == QueryResult.Success) {
      return res
        .status(200)
        .contentType("application/json")
        .json({ message: "Resource succesfully removed" });
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};

export const updateEntry = async (req, res, next) => {
  console.log("updateEntry request: ", req.body);

  if (req.params.id) {
    const pain_points = painpointsToBinary(req.body.pain_points);
    const new_entry = newBody(req.body, pain_points);
    const entry = await updateEntryById(req.params.id, new_entry);

    if (entry == QueryResult.Success) {
      return res
        .status(201)
        .contentType("application/json")
        .json({ message: "Resource succesfully updated" });
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};

export const getEntries = async (req, res) => {
  console.log("getEntries request");

  const entries = await getAllEntries(req.user.user_id);

  if (entries) {
    let new_entries = []
    entries.forEach((entry) => {
      const pain_points = painpointsToJson(entry.pain_points);
      const new_entry = SerializeReply(entry, pain_points);
      new_entries.push(new_entry);
    }) 

    return res.status(201).contentType("application/json").json(new_entries);
  } else {
    return next(customError("Resource not found", 404));
  }
};

export const postEntry = async (req, res) => {
  console.log("postEntry request: ", req.body);

  const pain_points = painpointsToBinary(req.body.pain_points)
  const new_entry = newBody(req.body, pain_points);
  
  const entry_id = await insertEntry(req.user, new_entry);

  if (entry_id) {
    return res
      .status(200)
      .contentType("application/json")
      .json({ message: entry_id });
  } else {
    return res
      .status(500)
      .contentType("application/json")
      .json({ message: "Internal server error" });
  }
};

export const getEntriesAdmin = async (req, res) => {
  console.log("getAdminEntries request");

  if (req.query.id) {
    const entry = await getAllEntries(req.query.id);

    if (entry) {
      return res.status(201).contentType("application/json").json(entry);
    } else {
      return next(customError("Resource not found", 404));
    }
  }

  return next(customError("Request is missing 'id' parameter", 400));
};

const painpointsToBinary = (pain_points) => {
  let binary = "";

  for (let x in pain_points) {
    if (pain_points[x]) {
      binary += "1";
    } else {
      binary += "0";
    }
  }
  return binary;
};

const painpointsToJson = (binary) => {
  console.log(binary)
  let pain_points = {
    TMJ: false,
    Cervical_Spine: false,
    Shoulder: false,
    Thoraic_Spine: false,
    Elbow: false,
    Lower_back_and_SI_Joints: false,
    Hands_fingers_and_wrist: false,
    Hips: false,
    Knees: false,
    Ankles: false,
    Feet_and_toes: false,
  };

  const str = binary;
  const arr = str.split("");

  let i = 0;
  Object.keys(pain_points).forEach(pain_point => {
    pain_points[pain_point] = arr[i] == "0" ? false : true;
    i++
});


  console.log(pain_points)
  return pain_points;
};

const newBody = (entry, pain_points) => {
  entry.pain_points = pain_points

  return entry;
};


const SerializeReply = (entry, pain_points) => {
  const data = {
    entry_id: entry.entry_id,
    pain_points: pain_points,
    user_id: entry.user_id,
    entry_date: entry.entry_date,
    stress_gauge: entry.stress_gauge,
    pain_gauge: entry.pain_gauge,
    stiffness_gauge: entry.stiffness_gauge,
    sleep_gauge: entry.sleep_gauge,
    notes: entry.notes,
  };
  return data;
};
