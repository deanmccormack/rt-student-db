const notFound = function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

/* eslint-disable-next-line no-unused-vars */
const errorHandler = function errorHandler(error, req, res, next) {
  res.status(res.statusCode === 200
    ? 500
    : res.statusCode);

  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production'
      ? 'stack'
      : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
