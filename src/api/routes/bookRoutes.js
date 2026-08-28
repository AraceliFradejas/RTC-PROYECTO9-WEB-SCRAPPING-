import { Router } from "express";
import { createBook, deleteBook, getBookById, getBooks, getBookStats, updateBook } from "../controllers/bookController.js";

export const bookRouter = Router();
bookRouter.get("/", getBooks);
bookRouter.get("/stats", getBookStats);
bookRouter.get("/:id", getBookById);
bookRouter.post("/", createBook);
bookRouter.put("/:id", updateBook);
bookRouter.delete("/:id", deleteBook);
