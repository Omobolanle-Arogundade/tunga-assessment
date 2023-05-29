import 'idempotent-babel-polyfill';
import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import listAllRoutes from 'express-list-endpoints';
import Table from 'cli-table';

import config from 'config';
import morgan from 'config/morgan';
import Bugsnag from 'config/bugsnag';
import { jwtUserStrategy, jwtCustomerStrategy, facebookStrategy, googleStrategy } from 'config/passport';
import { authLimiter } from 'middlewares/rateLimiter';
import routes from 'routes/v1';
import { errorConverter, errorHandler } from 'middlewares/error';
import ApiError from 'utils/ApiError';
import logger from 'config/logger';

const app = express();

const middleware = Bugsnag.getPlugin('express');

if (config.env !== 'test') {
 app.use(morgan.successHandler);
 app.use(morgan.errorHandler);
}

// This must be the first piece of middleware in the stack.
// It can only capture errors in downstream middleware
app.use(middleware.requestHandler);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(
 cors({
  async origin(origin, callback) {
   // (like mobile apps or curl requests)
   if (!origin) return callback(null, true);
   const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
   return callback(new Error(msg), false);
  },
 })
);
// app.options('*', cors());
// jwt authentication
app.use(passport.initialize());
passport.use('user-rule', jwtUserStrategy);
passport.use('customer-rule', jwtCustomerStrategy);

passport.use(facebookStrategy);

passport.use(googleStrategy);

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
 done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
 done(null, user);
});

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
 app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// // Setup a default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.send({ message: `Welcome to Test API - ${config.env.toUpperCase()}` }));

// Temporal, to aid development: Lists all API endpoints and methods
let routesList = listAllRoutes(app);
routesList = routesList.map((route) => {
 const obj = {};
 obj[route.path] = route.methods.join(' | ');
 return obj;
});
const table = new Table();
table.push({ Endpoints: 'Methods' }, ...routesList);

logger.info(`Running on environment ${config.env}`);

logger.info(`THESE ARE THE AVAILABLE ENDPOINTS: \n${table.toString()}`);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
 next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
