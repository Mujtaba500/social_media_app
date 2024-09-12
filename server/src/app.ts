import express from "express";
import "dotenv/config";
import morgan from "morgan";
import allRoutes from "./routes/allRoutes.js";
import cookieparser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./utils/corsSetup.js";

const app = express();

const logger = morgan("dev");

app.use(cors(corsOptions));
app.use(logger);
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "API live",
  });
});

app.use("/api/v1", allRoutes);

export default app;
