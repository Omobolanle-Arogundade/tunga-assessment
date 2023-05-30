/* eslint-disable class-methods-use-this */
import config from 'config';
import httpStatus from 'http-status';
import MailService from './notifications/mail/mailgun.service';
import OTPService from './otp.service';
import ApiError from '../utils/ApiError';
import _UserService from './user.service';
import _TokenService from './token.service';
import { clean } from '../utils/object';
import logger from '../config/logger';
import { authMethods, sendOTPActions, socialActions } from '../utils/constants';
import { User } from '../models';

export default class AuthService {
 /**
  * Generate OTP and then send email containing OTP to the user with provided email
  * @param {*} email
  * @param {*} action
  */
 static async sendOTP(email, action) {
  const user = await User.isEmailTaken(email);
  if (action === sendOTPActions.REGISTER) {
   if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists', true);
   }
  } else if (action === sendOTPActions.RESET_PASSWORD) {
   if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exists', true);
   }
  }

  const otp = await OTPService.cacheTheOTP(email);
  const template = config.email && config.email.template && config.email.template.SENDOTP;
  const subject = config.email && config.email.subject && config.email.subject.SENDOTP;

  return MailService.sendMail({ email, template, payload: { otp }, subject });
 }

 /**
  *
  * @param {*} email
  * @param {*} otp
  */
 static async verifyOTP(email, otp) {
  const cachedOtp = await OTPService.getOTPKey(email);
  if (cachedOtp && +cachedOtp === +otp) {
   return {
    success: true,
    message: 'Valid OTP',
   };
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, 'invalid OTP');
 }

 /**
  *
  * @param {*} email
  * @param {*} otp
  * @param {*} password
  */
 static async resetPassword(email, password) {
  const user = await _UserService.getUserByEmail(email);
  await _UserService.updateById(user.id, clean({ password, resetPassword: false }));
 }

 /**
  *
  * @param {*} email
  * @param {*} oldPassword
  * @param {*} newPassword
  */
 static async updatePassword(user, { oldPassword, newPassword }) {
  if (!(await user.isPasswordMatch(oldPassword))) {
   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect old password');
  }
  const data = await _UserService.updateById(user.id, clean({ password: newPassword }));

  return data;
 }

 /**
  *
  * @param {*} user
  * @param {*} password
  * @returns
  */
 static async verifyPassword(user, password) {
  if (!(await user.isPasswordMatch(password))) {
   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }
  return true;
 }

 /**
  *
  * @param {*} refreshToken
  */
 static async refreshAuth(refreshToken) {
  try {
   const refreshTokenDoc = await _TokenService.verifyToken(refreshToken, 'refresh');
   const user = await _UserService.fetchById(refreshTokenDoc.user);
   if (!user) {
    throw new Error();
   }
   await refreshTokenDoc.remove();
   return _TokenService.generateAuthTokens(user);
  } catch (error) {
   throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
 }

 /**
  *
  * @param {*} profile
  * @returns
  */
 static async facebookAuth(profile) {
  try {
   logger.info('profile is', JSON.stringify(profile, undefined, 2));
   if (profile && profile.emails && profile.emails[0] && profile.emails[0].value) {
    let user;
    try {
     user = await _UserService.getUserByEmail(profile.emails[0].value);
    } catch (error) {
     logger.verbose('user does not exist');
    }
    let tokens;

    if (user) {
     // User already exists in the database
     const _authMethods = user.authMethods || [];

     if (_authMethods.indexOf(authMethods.FACEBOOK) < 0) _authMethods.push(authMethods.FACEBOOK);

     user = JSON.parse(
      JSON.stringify(
       await _UserService.updateById(user.id, {
        isEmailVerified: true,
        authMethods: _authMethods,
       })
      )
     );
     tokens = await _TokenService.generateAuthTokens(user);
     return {
      action: socialActions.LOGIN,
      user,
      tokens,
     };
    }
    // user is  trying to signup
    return {
     action: socialActions.SIGNUP,
     profile,
    };
   }
   //    throw new ApiError(httpStatus.UNAUTHORIZED, 'User does not exist');
  } catch (error) {
   logger.error(error);
   throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.toString());
  }
 }

 static async googleAuth(profile) {
  try {
   logger.info('profile is', JSON.stringify(profile, undefined, 2));
   if (profile && profile.emails && profile.emails[0] && profile.emails[0].value) {
    let user;
    try {
     user = await _UserService.getUserByEmail(profile.emails[0].value);
    } catch (error) {
     logger.verbose('user does not exist');
    }
    let tokens;

    if (user) {
     // User already exists in the database
     const _authMethods = user.authMethods || [];

     if (_authMethods.indexOf(authMethods.GOOGLE) < 0) _authMethods.push(authMethods.GOOGLE);

     user = JSON.parse(
      JSON.stringify(
       await _UserService.updateById(user.id, {
        isEmailVerified: true,
        authMethods: _authMethods,
       })
      )
     );

     tokens = await _TokenService.generateAuthTokens(user);
     return {
      action: socialActions.LOGIN,
      user,
      tokens,
     };
    }
   }
   // user is  trying to signup
   return {
    action: socialActions.SIGNUP,
    profile,
   };
   // throw new ApiError(httpStatus.UNAUTHORIZED, 'User does not exist');
  } catch (error) {
   logger.error(error);
   throw new ApiError(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.toString());
  }
 }
}
