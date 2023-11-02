const jwt = require('jsonwebtoken');
const { User } = require('../models/users');
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = ' ' } = req.headers;

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).json({ error: 'Not auth' });
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    req.user = user;
    next();
  } catch {
    next(res.status(401).json({ error: 'Not authorized all' }));
  }
};

module.exports = authenticate;
