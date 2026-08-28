import { CLOSE_SELECTORS } from "../config/scraperConfig.js";

export const closeObstructions = async (page) => {
  let closedElements = 0;

  for (const selector of CLOSE_SELECTORS) {
    const elements = await page.$$(selector);

    for (const element of elements) {
      if (await element.isVisible()) {
        await element.click();
        closedElements += 1;
      }
    }
  }

  return closedElements;
};
