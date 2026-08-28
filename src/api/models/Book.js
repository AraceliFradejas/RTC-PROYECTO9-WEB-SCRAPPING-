import mongoose from "mongoose";

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["GBP"], default: "GBP" },
    image: {
      type: String,
      required: true,
      validate: { validator: isHttpUrl, message: "La imagen debe ser una URL válida" }
    },
    url: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: { validator: isHttpUrl, message: "La URL del libro no es válida" }
    },
    availability: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    source: { type: String, default: "Books to Scrape", immutable: true }
  },
  { timestamps: true, versionKey: false }
);

export const Book = mongoose.model("Book", bookSchema);
