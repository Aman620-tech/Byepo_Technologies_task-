const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized: No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  const decoded = verifyToken(token);
  if (!decoded) return sendError(res, 'Unauthorized: Invalid token', 401);

  if (decoded.role === 'super_admin') {
    req.user = { id: 'super_admin', role: 'super_admin', email: decoded.email };
    return next();
  }

  const user = await User.findById(decoded.id).populate('organization');
  if (!user || !user.isActive) return sendError(res, 'Unauthorized: User not found', 401);

  req.user = user;
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = { authenticate, authorize };
