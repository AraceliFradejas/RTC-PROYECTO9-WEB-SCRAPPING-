export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Math.max(Number.parseInt(query.limit, 10) || 20, 1);
  return { page, limit: Math.min(requestedLimit, 100) };
};

export const buildBookFilter = (query) => {
  const filter = {};
  if (query.name?.trim()) filter.name = { $regex: escapeRegex(query.name.trim()), $options: "i" };

  const minPrice = Number(query.minPrice);
  const maxPrice = Number(query.maxPrice);
  if (query.minPrice !== undefined && Number.isFinite(minPrice)) filter.price = { ...filter.price, $gte: minPrice };
  if (query.maxPrice !== undefined && Number.isFinite(maxPrice)) filter.price = { ...filter.price, $lte: maxPrice };

  const rating = Number(query.rating);
  if (query.rating !== undefined && Number.isInteger(rating) && rating >= 1 && rating <= 5) filter.rating = rating;
  return filter;
};
