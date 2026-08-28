export const notFoundHandler = (request, response) => {
  response.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${request.method} ${request.originalUrl}`
  });
};
