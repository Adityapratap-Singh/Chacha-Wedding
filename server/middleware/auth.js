
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment');
      return res.status(500).json({ msg: 'Server Configuration Error' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
