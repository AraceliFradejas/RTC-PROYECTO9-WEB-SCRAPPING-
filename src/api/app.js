import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

export const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(morgan("dev", { skip: () => process.env.NODE_ENV === "test" }));

app.get("/api", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Books API REST disponible",
    source: "Books to Scrape",
    version: "1.0.0"
  });
});

app.use(notFoundHandler);
app.use(errorHandler);
