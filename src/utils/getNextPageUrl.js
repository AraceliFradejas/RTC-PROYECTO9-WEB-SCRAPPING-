import { NEXT_PAGE_SELECTOR } from "../config/scraperConfig.js";

export const getNextPageUrl = (page) =>
  page.$eval(NEXT_PAGE_SELECTOR, (link) => link.href).catch(() => null);
