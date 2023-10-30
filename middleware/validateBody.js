const httpErrors = require('../helpers/httpErrors');

const validateBody = schema => {
  return function (req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) next(httpErrors(400, error.message));
    next();
  };
};

module.exports = validateBody;
