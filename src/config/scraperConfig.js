export const START_URL = "https://books.toscrape.com/";
export const OUTPUT_FILE = new URL("../../products.json", import.meta.url);
export const PRODUCT_SELECTOR = "article.product_pod";
export const NEXT_PAGE_SELECTOR = "li.next a";
export const REQUEST_DELAY_MS = 250;
export const NAVIGATION_TIMEOUT_MS = 30_000;

export const CLOSE_SELECTORS = [
  "#onetrust-accept-btn-handler",
  ".modal button.close",
  '[aria-label*="close" i]',
  '[aria-label*="cerrar" i]'
];
