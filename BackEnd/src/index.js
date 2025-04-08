import express from "express";
import "cookie-parser";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from "url";

import { userRouter } from "./users/user_router.js";
import { entryRouter } from "./entries/entry_router.js";
import { authRouter } from "./authentication/auth_router.js";
import { errorHandler, notFoundHandler } from "./utils/error.js";

const HOSTNAME = "127.0.0.1";
const APP = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

APP.use(express.static("dist"));

// Add pages when they are created for now empty
const pages = [];

// Redirect pretty URLs to correct HTML files
pages.forEach((page) => {
  APP.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/src/pages", `${page}.html`));
  });
});

// For documentation of server
APP.use("/docs", express.static("docs"));

APP.use(express.json())
  .use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  )
  .use(cookieParser());

APP.use("/api/users", userRouter);
APP.use("/api/entries", entryRouter);
APP.use("/api/auth", authRouter);

APP.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

APP.use(errorHandler);
APP.use(notFoundHandler);
