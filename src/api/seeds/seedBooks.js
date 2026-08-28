import "dotenv/config";
import { readFile } from "node:fs/promises";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Book } from "../models/Book.js";
import { validateProducts } from "../../utils/validateProducts.js";

const PRODUCTS_FILE = new URL("../../../products.json", import.meta.url);

const seedBooks = async () => {
  try {
    const products = JSON.parse(await readFile(PRODUCTS_FILE, "utf8"));
    validateProducts(products);

    await connectDatabase();

    const operations = products.map((product) => ({
      updateOne: {
        filter: { url: product.url },
        update: { $setOnInsert: product },
        upsert: true,
        timestamps: false
      }
    }));

    const result = await Book.bulkWrite(operations, { ordered: false });
    const total = await Book.countDocuments();

    console.log("✅ Semilla de libros completada");
    console.log(`   ├─ Creados: ${result.upsertedCount}`);
    console.log(`   ├─ Modificados: ${result.modifiedCount}`);
    console.log(`   └─ Total en MongoDB: ${total}`);
  } catch (error) {
    console.error("❌ Error al ejecutar la semilla:", error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

await seedBooks();
