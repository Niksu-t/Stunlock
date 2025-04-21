import { resultSelf } from "./kubios_model.js";

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

