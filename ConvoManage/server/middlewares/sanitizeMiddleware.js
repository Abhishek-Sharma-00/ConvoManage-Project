const mongoSanitize = require("express-mongo-sanitize");

const sanitizeRequest = (req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);
  next();
};

module.exports = sanitizeRequest;
