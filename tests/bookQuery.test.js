import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildBookFilter, parsePagination } from "../src/api/utils/bookQuery.js";

describe("consultas de libros", () => {
  it("aplica una paginación predeterminada", () => assert.deepEqual(parsePagination({}), { page: 1, limit: 20 }));
  it("limita a 100 resultados por página", () => assert.deepEqual(parsePagination({ page: "2", limit: "500" }), { page: 2, limit: 100 }));
  it("construye los filtros admitidos", () => assert.deepEqual(
    buildBookFilter({ name: "light", minPrice: "10", maxPrice: "30", rating: "3" }),
    { name: { $regex: "light", $options: "i" }, price: { $gte: 10, $lte: 30 }, rating: 3 }
  ));
  it("escapa caracteres especiales", () => assert.equal(buildBookFilter({ name: "C++" }).name.$regex, "C\\+\\+"));
});
