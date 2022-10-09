import express from "express";
import "./config";
import { Routes } from "./routes";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { NotFoundError } from "./errors";
import { errorHandler } from "./middlewares";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const imagePath = path.join(__dirname, "../images");

app.use("/images", express.static(imagePath));
app.use(morgan("dev"));
app.use(Routes);
app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
