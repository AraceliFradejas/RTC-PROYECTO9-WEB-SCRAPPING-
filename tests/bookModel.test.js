import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Book } from "../src/api/models/Book.js";

const validBook = {
  name: "A Light in the Attic",
  price: 51.77,
  currency: "GBP",
  image: "https://books.toscrape.com/media/example.jpg",
  url: "https://books.toscrape.com/catalogue/example/index.html",
  availability: "In stock",
  rating: 3
};

describe("modelo Book", () => {
  it("acepta un libro válido", async () => {
    await assert.doesNotReject(() => new Book(validBook).validate());
  });

  it("rechaza un precio negativo", async () => {
    await assert.rejects(
      () => new Book({ ...validBook, price: -1 }).validate(),
      /price/
    );
  });

  it("rechaza una valoración fuera de rango", async () => {
    await assert.rejects(
      () => new Book({ ...validBook, rating: 6 }).validate(),
      /rating/
    );
  });

  it("rechaza una URL de imagen inválida", async () => {
    await assert.rejects(
      () => new Book({ ...validBook, image: "imagen-local" }).validate(),
      /imagen debe ser una URL válida/
    );
  });
});
