import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
 if (err || info || !user) {
  return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication Required'));
 }

 req.user = user;
 resolve();
};

const auth = () => async (req, res, next) => {
 return new Promise((resolve, reject) => {
  passport.authenticate('user-rule', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
 })
  .then(() => next())
  .catch((err) => next(err));
};

module.exports = {
 auth,
};
