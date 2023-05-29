import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roles } from '../utils/constants';

module.exports.isAdmin =
 (...requiredPermissions) =>
 async (req, res, next) => {
  try {
   const { user } = req;
   if (user && user.role === roles.ADMIN) {
    const { permissions } = user;
    const hasPermissions = requiredPermissions.some((permission) => {
     return permissions.includes(permission);
    });

    if (hasPermissions) {
     return next();
    }
   }
   return next(new ApiError(httpStatus.FORBIDDEN, 'User has no permission for this action', false));
  } catch (error) {
   const message = error.message || error;
   const code = error.code || httpStatus.INTERNAL_SERVER_ERROR;
   return next(new ApiError(code, message, false));
  }
 };
