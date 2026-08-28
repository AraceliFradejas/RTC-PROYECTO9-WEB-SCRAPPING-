import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateProducts } from "../src/utils/validateProducts.js";

const validProduct = {
  name: "A Light in the Attic",
  price: 51.77,
  image: "https://books.toscrape.com/media/example.jpg",
  url: "https://books.toscrape.com/catalogue/example/index.html"
};

describe("validateProducts", () => {
  it("acepta una colección con productos completos y únicos", () => {
    const result = validateProducts([validProduct]);

    assert.deepEqual(result, {
      total: 1,
      invalid: 0,
      duplicates: 0
    });
  });

  it("rechaza una colección vacía", () => {
    assert.throws(
      () => validateProducts([]),
      /No se ha encontrado ningún producto/
    );
  });

  it("rechaza un producto sin un campo obligatorio", () => {
    const incompleteProduct = { ...validProduct, image: "" };

    assert.throws(
      () => validateProducts([incompleteProduct]),
      /producto incompleto/
    );
  });

  it("rechaza dos productos con la misma URL", () => {
    const duplicateProduct = { ...validProduct, name: "Otro libro" };

    assert.throws(
      () => validateProducts([validProduct, duplicateProduct]),
      /productos duplicados/
    );
  });
});
