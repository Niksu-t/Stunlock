import express from "express";
import "cookie-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import NodeCache from "node-cache";

export const tempCache = new NodeCache({ stdTTL: 3600, checkperiod: 900 });

import { userRouter } from "./users/user_router.js";
import { entryRouter } from "./entries/entry_router.js";
import { authRouter } from "./authentication/auth_router.js";
import { errorHandler, notFoundHandler } from "./utils/error.js";
import { teamRouter } from "./caregroup/caregroup_router.js";
import { kubiosRouter } from "./kubios/kubios_router.js";

const HOSTNAME = "127.0.0.1";
const APP = express();
const PORT = 3000;

APP.use(express.static("dist"));

// For documentation of server
APP.use("/docs", express.static("docs"));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
];

APP.use(express.json())
  .use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  )
  .use(cookieParser());

APP.use("/users", userRouter);
APP.use("/entries", entryRouter);
APP.use("/auth", authRouter);
APP.use("/careteams", teamRouter);
APP.use("/kubios", kubiosRouter);

APP.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

APP.use(errorHandler);
APP.use(notFoundHandler);
