import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { app } from "../src/api/app.js";

describe("API REST", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let baseUrl;
  let server;

  before(async () => {
    process.env.NODE_ENV = "test";
    server = app.listen(0);
    await new Promise((resolve) => server.once("listening", resolve));

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it("responde en la ruta de estado", async () => {
    const response = await fetch(`${baseUrl}/api`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, "Books API REST disponible");
  });

  it("responde 404 para una ruta inexistente", async () => {
    const response = await fetch(`${baseUrl}/api/no-existe`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
    assert.match(body.message, /Ruta no encontrada/);
  });
});
