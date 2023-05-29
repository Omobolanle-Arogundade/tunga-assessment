const { toSentenceCase } = require('./text');

class ApiError extends Error {
 constructor(statusCode, message, isOperational = true, stack = '') {
  super(toSentenceCase(message.toLowerCase())); // Format error message for frontend
  this.statusCode = statusCode;
  this.isOperational = isOperational;
  if (stack) {
   this.stack = stack;
  } else {
   Error.captureStackTrace(this, this.constructor);
  }
 }
}

module.exports = ApiError;
