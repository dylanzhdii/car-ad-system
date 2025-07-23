const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;