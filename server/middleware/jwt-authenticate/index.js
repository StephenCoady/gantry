const jwt = require('jsonwebtoken');

exports.jwtAuthenticate = function(options={}) {

  if (!options.secret) {
    throw new Error('Authentication module options.secret parameter is required');
  }

  function middleware(req, res, next) {
    if (!req.headers || !req.headers.authorization) {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

    const [schema='', token=''] = req.headers.authorization.split(' ');
    if (schema !== 'Bearer' || !token) {
      return res.status(403).send({
        success: false,
        message: 'Authorisation header should use "Bearer <token>" schema'
      });
    }

    jwt.verify(token, options.secret, (err, payload) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
      }

      req.decoded = payload;

      next(null);
    });
  }

  return middleware;
};