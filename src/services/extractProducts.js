import { PRODUCT_SELECTOR } from "../config/scraperConfig.js";

export const extractProducts = (page) =>
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
        image: image
          ? new URL(image.getAttribute("src"), window.location.href).href
          : "",
        url: titleLink
          ? new URL(titleLink.getAttribute("href"), window.location.href).href
          : "",
        availability: availability.replace(/\s+/g, " ").trim(),
        rating: ratingValues[ratingClass] ?? null
      };
    });
  });
