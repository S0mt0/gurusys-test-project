/// <reference path="./types.d.ts" />

import "express-async-errors";
import "dotenv/config";

import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import formData from "express-form-data";
import mongoSanitize from "express-mongo-sanitize";
import { connect } from "mongoose";
import swaggerUi from "swagger-ui-express";

// Imports - custom modules
import { corsOptions, envs, initializeCloudinary, swagger } from "./config";
import { errorHandler } from "./lib";
import router from "./config/router";

initializeCloudinary();
const app = express();
const PORT = envs.port || 5000;

app.use(cors(corsOptions));

// parse data with connect-multiparty.
app.use(formData.parse());
// delete from the request all empty files (size == 0)
app.use(formData.format());

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.json({ limit: "10mb", type: "application/json" }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(mongoSanitize());
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "/public")));

// Load app routes and handlers
app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "ui", "home.html"));
});

app.use(
  "/api/v1/doc(.html)?",
  swaggerUi.serve,
  swaggerUi.setup(swagger.config, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

app.use("/api/v1", router());

// Handle synchronous errors
process.on("uncaughtException", (err) => {
  // Log error only in development environment
  envs.env === "development" &&
    console.log(
      "[API UNCAUGHTEXCEPTION ERROR]: ",
      err.message,
      "\n\nERROR STACK: ",
      err.stack,
      "\n\nTIMESTAMP: ",
      new Date().toLocaleTimeString()
    );
});

// Asynchronous error handler
app.use(errorHandler);

/** Start Server only after successful connection to database */
const startServer = async () => {
  try {
    await connect(process.env.DB_URL!);
    console.log("Connection to database established successfully...");

    app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
  } catch (error) {
    console.log("Something went wrong, please try again :::", error);
  }
};

startServer();

// Quick connection to server without database
// app.listen(PORT, () =>
//   console.log(`Server is listening on port: ${PORT}`)
// );
