import { setTimeout as delay } from "node:timers/promises";
import puppeteer from "puppeteer";
import {
  NAVIGATION_TIMEOUT_MS,
  PRODUCT_SELECTOR,
  REQUEST_DELAY_MS,
  START_URL
} from "./config/scraperConfig.js";
import { extractProducts } from "./services/extractProducts.js";
import { closeObstructions } from "./utils/closeObstructions.js";
import { getNextPageUrl } from "./utils/getNextPageUrl.js";
import { saveProducts } from "./utils/saveProducts.js";
import { validateProducts } from "./utils/validateProducts.js";

const scrape = async () => {
  let browser;

  try {
    console.log("🚀 Iniciando el scraper...");
    browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const products = [];
    const visitedPages = new Set();
    let currentUrl = START_URL;
    let pageNumber = 0;
    let totalClosedElements = 0;

    while (currentUrl) {
      if (visitedPages.has(currentUrl)) {
        throw new Error(`Se ha detectado un ciclo de paginación en ${currentUrl}`);
      }

      visitedPages.add(currentUrl);
      pageNumber += 1;
      console.log(`🌐 Página ${pageNumber}: ${currentUrl}`);

      await page.goto(currentUrl, {
        waitUntil: "domcontentloaded",
        timeout: NAVIGATION_TIMEOUT_MS
      });
      await page.waitForSelector(PRODUCT_SELECTOR, {
        timeout: NAVIGATION_TIMEOUT_MS
      });

      totalClosedElements += await closeObstructions(page);

      const pageProducts = await extractProducts(page);
      products.push(...pageProducts);
      console.log(
        `   └─ ${pageProducts.length} productos | acumulados: ${products.length}`
      );

      currentUrl = await getNextPageUrl(page);

      if (currentUrl) {
        await delay(REQUEST_DELAY_MS);
      }
    }

    validateProducts(products);
    await saveProducts(products);

    console.log("");
    console.log(`✅ Páginas procesadas: ${pageNumber}`);
    console.log(`✅ Productos extraídos: ${products.length}`);
    console.log(`🧹 Elementos superpuestos cerrados: ${totalClosedElements}`);
    console.log("💾 Resultados guardados en products.json");
  } catch (error) {
    console.error("❌ No se ha podido completar la extracción:", error.message);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
      console.log("🔒 Navegador cerrado correctamente");
    }
  }
};

await scrape();
