const log = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  log.error(err.message, err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
