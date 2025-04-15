import { resultSelf } from "./kubios_model.js";

export const getAllResults = async (req, res) => {
  console.log("Kubios token: ", req.authorization);

  const token = req.authorization;

  try {
    const result = await resultSelf(token);
    console.log("Kubios result: ", result);
    return res.status(201).json({ Data: result });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({ message: "internal server error" });
  }
};
