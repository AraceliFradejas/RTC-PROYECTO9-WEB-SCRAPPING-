export const validateProducts = (products) => {
  if (products.length === 0) {
    throw new Error("No se ha encontrado ningún producto en el catálogo.");
  }

  const invalidProduct = products.find(
    (product) =>
      !product.name ||
      !Number.isFinite(product.price) ||
      !product.image ||
      !product.url
  );

  if (invalidProduct) {
    const productName = invalidProduct.name || "sin nombre";
    throw new Error(`Se ha encontrado un producto incompleto: ${productName}`);
  }

  const productUrls = products.map((product) => product.url);

  if (new Set(productUrls).size !== productUrls.length) {
    throw new Error("Se han encontrado productos duplicados en la extracción.");
  }

  return {
    total: products.length,
    invalid: 0,
    duplicates: 0
  };
};
