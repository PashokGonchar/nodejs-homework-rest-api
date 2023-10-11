const validationMiddleware = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next('Bad Request'(400, error.message));
    }

    next();
  };

  return func;
};

module.exports = validationMiddleware;
