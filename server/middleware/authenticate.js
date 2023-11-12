
const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt.config'); 

function authenticate(req, res, next) {
  const token = req.cookies.userToken; 

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token verification failed' });
    }

    // Attach user data to the request
    req.user = decoded;

    // Check token expiry 
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTimestamp) {
      return res.status(401).json({ message: 'Token has expired' });
    }

    next();
  });
}

module.exports = { authenticate };
