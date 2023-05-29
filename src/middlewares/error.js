import httpStatus from 'http-status';
import config from '../config';
import logger from '../config/logger';
import Bugsnag from '../config/bugsnag';

import ApiError from '../utils/ApiError';
import { toSentenceCase } from '../utils/text';

const errorConverter = (err, req, res, next) => {
 let error = err;
 if (!(error instanceof ApiError)) {
  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = toSentenceCase(error.message || httpStatus[statusCode]);
  error = new ApiError(statusCode, message, false, err.stack);
 }
 next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
 let { statusCode, message } = err;

 Bugsnag.addMetadata('request', {
  body: req.body,
  query: req.query,
  path: req.originalUrl,
  method: req.method,
  params: req.params,
  stack: err.stack,
 });

 Bugsnag.notify(err);
 if (config.env === 'production' && !err.isOperational) {
  statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  message = 'An Error Occurred';
 }

 res.locals.errorMessage = err.message;

 const response = {
  code: statusCode,
  message,
  ...(config.env === 'development' && { stack: err.stack }),
 };

 if (config.env === 'development') {
  logger.error(err);
 }

 res.status(statusCode).send(response);
};

module.exports = {
 errorConverter,
 errorHandler,
};
