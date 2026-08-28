import { writeFile } from "node:fs/promises";
import { OUTPUT_FILE } from "../config/scraperConfig.js";

export const saveProducts = (products) =>
  writeFile(OUTPUT_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");
