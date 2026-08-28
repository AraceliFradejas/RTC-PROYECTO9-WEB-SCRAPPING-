import mongoose from "mongoose";
import { Book } from "../models/Book.js";
import { buildBookFilter, parsePagination } from "../utils/bookQuery.js";

const EDITABLE_FIELDS = ["name", "price", "currency", "image", "url", "availability", "rating"];
const selectBookData = (body) => Object.fromEntries(
  EDITABLE_FIELDS.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
);
const ensureValidId = (id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    const error = new Error("El identificador del libro no es válido");
    error.status = 400;
    throw error;
  }
};

export const getBooks = async (request, response) => {
  const filter = buildBookFilter(request.query);
  const { page, limit } = parsePagination(request.query);
  const [books, total] = await Promise.all([
    Book.find(filter).sort({ name: 1 }).skip((page - 1) * limit).limit(limit),
    Book.countDocuments(filter)
  ]);
  response.status(200).json({
    success: true,
    data: books,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  });
};

export const getBookStats = async (_request, response) => {
  const [stats] = await Book.aggregate([{ $group: {
    _id: null, total: { $sum: 1 }, minimumPrice: { $min: "$price" },
    maximumPrice: { $max: "$price" }, averagePrice: { $avg: "$price" }
  } }]);
  const ratings = await Book.aggregate([
    { $group: { _id: "$rating", total: { $sum: 1 } } }, { $sort: { _id: 1 } }
  ]);
  response.status(200).json({ success: true, data: {
    ...(stats ?? { total: 0, minimumPrice: null, maximumPrice: null, averagePrice: null }),
    averagePrice: stats ? Number(stats.averagePrice.toFixed(2)) : null,
    ratings: Object.fromEntries(ratings.map(({ _id, total }) => [_id, total]))
  } });
};

export const getBookById = async (request, response) => {
  ensureValidId(request.params.id);
  const book = await Book.findById(request.params.id);
  if (!book) return response.status(404).json({ success: false, message: "Libro no encontrado" });
  return response.status(200).json({ success: true, data: book });
};

export const createBook = async (request, response) => {
  const book = await Book.create(selectBookData(request.body));
  response.status(201).json({ success: true, data: book });
};

export const updateBook = async (request, response) => {
  ensureValidId(request.params.id);
  const book = await Book.findByIdAndUpdate(request.params.id, selectBookData(request.body), { new: true, runValidators: true });
  if (!book) return response.status(404).json({ success: false, message: "Libro no encontrado" });
  return response.status(200).json({ success: true, data: book });
};

export const deleteBook = async (request, response) => {
  ensureValidId(request.params.id);
  const book = await Book.findByIdAndDelete(request.params.id);
  if (!book) return response.status(404).json({ success: false, message: "Libro no encontrado" });
  return response.status(200).json({ success: true, message: "Libro eliminado", data: book });
};
