const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect Middleware - checks if user is authenticated
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('No user found with this id', 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Authorize Middleware - checks if user has the required roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role matches any of the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('User role not authorized to access this resource', 403));
    }
    next();
  };
};