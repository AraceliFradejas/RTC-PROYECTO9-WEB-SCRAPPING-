export const errorHandler = (error, _request, response, _next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  response.status(error.status ?? 500).json({
    success: false,
    message: error.status ? error.message : "Error interno del servidor"
  });
};
