const controllersWrapper = require('./controllersWrapper');
const validateBody = require('./validateBody');
const authenticate = require('./authenticate');
const upload = require('./upload');

module.exports = {
  controllersWrapper,
  validateBody,
  authenticate,
  upload,
};
