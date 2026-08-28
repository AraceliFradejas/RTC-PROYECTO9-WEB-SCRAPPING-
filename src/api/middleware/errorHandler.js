export const errorHandler = (error, _request, response, _next) => {
  let status = error.status ?? 500;
  let message = error.message || "Error interno del servidor";

  if (error.name === "ValidationError") status = 400;
  if (error.code === 11000) {
    status = 409;
    message = "Ya existe un libro con esa URL";
  }
  if (status === 500) message = "Error interno del servidor";

  if (process.env.NODE_ENV !== "test" && status === 500) console.error(error);
  response.status(status).json({ success: false, message });
};
