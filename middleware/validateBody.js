const {httpError} = require('../helpers')
const validateBody = (schema) => {
  return function (req, res, next) {
    if (!Object.keys(req.body).length) {
      next(httpError(400, "Missing fields!"))
    }
    const { error } = schema.validate(req.body);
    if (error) next(httpError(400, error.message))
    next()
    }
  }


module.exports = validateBody;
