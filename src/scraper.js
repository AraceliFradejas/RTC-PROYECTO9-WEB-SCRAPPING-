import { writeFile } from "node:fs/promises";
import puppeteer from "puppeteer";

const START_URL = "https://books.toscrape.com/";
const OUTPUT_FILE = new URL("../products.json", import.meta.url);
const PRODUCT_SELECTOR = "article.product_pod";

const closeObstructions = async (page) => {
  const closeSelectors = [
    "#onetrust-accept-btn-handler",
    ".modal button.close",
    '[aria-label*="close" i]',
    '[aria-label*="cerrar" i]'
  ];

  let closedElements = 0;

  for (const selector of closeSelectors) {
    const elements = await page.$$(selector);

    for (const element of elements) {
      const isVisible = await element.isVisible();

      if (isVisible) {
        await element.click();
        closedElements += 1;
      }
    }
  }

  return closedElements;
};

const extractProducts = (page) =>
  page.$$eval(PRODUCT_SELECTOR, (cards) => {
    const ratingValues = {
      One: 1,
      Two: 2,
      Three: 3,
      Four: 4,
      Five: 5
    };

    return cards.map((card) => {
      const titleLink = card.querySelector("h3 a");
      const priceText = card.querySelector(".price_color")?.textContent ?? "";
      const image = card.querySelector("img");
      const availability = card.querySelector(".availability")?.textContent ?? "";
      const ratingElement = card.querySelector(".star-rating");
      const ratingClass = [...(ratingElement?.classList ?? [])].find(
        (className) => className !== "star-rating"
      );

      return {
        name: titleLink?.getAttribute("title")?.trim() ?? "",
        price: Number(priceText.replace(/[^0-9.,]/g, "").replace(",", ".")),
        currency: "GBP",
        image: image ? new URL(image.getAttribute("src"), window.location.href).href : "",
        url: titleLink
          ? new URL(titleLink.getAttribute("href"), window.location.href).href
          : "",
        availability: availability.replace(/\s+/g, " ").trim(),
        rating: ratingValues[ratingClass] ?? null
      };
    });
  });

const validateProducts = (products) => {
  if (products.length === 0) {
    throw new Error("No se ha encontrado ningún producto en la página.");
  }

  const invalidProduct = products.find(
    (product) =>
      !product.name ||
      !Number.isFinite(product.price) ||
      !product.image ||
      !product.url
  );

  if (invalidProduct) {
    throw new Error(`Se ha encontrado un producto incompleto: ${invalidProduct.name || "sin nombre"}`);
  }
};

const saveProducts = (products) =>
  writeFile(OUTPUT_FILE, `${JSON.stringify(products, null, 2)}\n`, "utf8");

const scrape = async () => {
  let browser;

  try {
    console.log("🚀 Iniciando el scraper...");
    browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log(`🌐 Visitando ${START_URL}`);
    await page.goto(START_URL, {
      waitUntil: "domcontentloaded",
      timeout: 30_000
    });
    await page.waitForSelector(PRODUCT_SELECTOR, { timeout: 10_000 });

    const closedElements = await closeObstructions(page);
    console.log(`🧹 Elementos superpuestos cerrados: ${closedElements}`);

    const products = await extractProducts(page);
    validateProducts(products);
    await saveProducts(products);

    console.log(`✅ Productos extraídos de la primera página: ${products.length}`);
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
