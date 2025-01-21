const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(403).send('Access denied.');

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) return res.status(403).send('Invalid token.');

    req.admin = admin; // Add admin info to request
    next();
  });
};

module.exports = authenticateJWT;
