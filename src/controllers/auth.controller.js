import httpStatus from 'http-status';
import url from 'url';
import config from '../config';
import AuthService from '../services/auth.service';
import _TokenService from '../services/token.service';
import _UserService from '../services/user.service';
import { authMethods, roles, socialActions } from '../utils/constants';
import { pick } from '../utils/object';
import ApiError from '../utils/ApiError';

export default class AuthController {
 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async sendOTP(req, res) {
  const { email, action } = req.body;
  await AuthService.sendOTP(email, action);

  res.send({ message: 'email sent successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static verifyOTP(req, res) {
  const { email, otp } = req.body;
  AuthService.verifyOTP(email, otp);
  res.send({ message: 'Valid OTP' });
 }

 static async register(req, res) {
  const { email } = req.body;
  if (await _UserService.userExists(email)) {
   throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  const body = {
   ...pick(req.body, ['fullName', 'email', 'password', 'permissions']),
   role: roles.PATIENT,
   authMethods: [authMethods.LOCAL],
   resetPassword: false,
  };
  const data = await _UserService.create(body);
  const tokens = await _TokenService.generateAuthTokens(data);
  res.send({ data, tokens, message: 'registered successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async login(req, res) {
  const { email, password } = req.body;
  const data = await _UserService.loginUserWithEmailAndPassword(email, password);
  const tokens = await _TokenService.generateAuthTokens(data);
  res.send({ data, tokens, message: 'logged in successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async resetPassword(req, res) {
  const { email, password } = req.body;
  await AuthService.resetPassword(email, password);
  res.status(httpStatus.OK).send({ message: 'password reset successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async updatePassword(req, res) {
  const {
   body: { oldPassword, newPassword },
   user,
  } = req;
  await AuthService.updatePassword(user, { oldPassword, newPassword });
  res.status(httpStatus.OK).send({ message: 'password updated successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async verifyPassword(req, res) {
  const {
   body: { password },
   user,
  } = req;
  await AuthService.verifyPassword(user, password);
  res.status(httpStatus.OK).send({ message: 'password verified successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async refreshTokens(req, res) {
  const tokens = await AuthService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async getUser(req, res) {
  const { user } = req;
  const _user = await _UserService.fetchById(user.id);
  res.status(httpStatus.OK).send({ message: 'user retrieved successfully', data: _user });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async facebookAuth(req, res) {
  try {
   const {
    user,
    query: { clientUrl },
   } = req;
   const { action, tokens, profile } = await AuthService.facebookAuth(user);
   if (action === socialActions.LOGIN)
    return res.redirect(`${clientUrl || config.client.url}/facebook?token=${tokens.access.token}`);
   if (action === socialActions.SIGNUP)
    return res.redirect(
     url.format({
      pathname: `${clientUrl || config.client.url}/registration/register`,
      query: {
       profile: JSON.stringify(profile),
      },
     })
    );
  } catch (error) {
   return res.redirect(`${config.client.url}/login?usernotfound=true`);
  }
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async googleAuth(req, res) {
  try {
   const {
    user,
    query: { clientUrl },
   } = req;
   const { action, tokens, profile } = await AuthService.googleAuth(user);
   if (action === socialActions.LOGIN)
    return res.redirect(`${clientUrl || config.client.url}/google?token=${tokens.access.token}`);
   if (action === socialActions.SIGNUP)
    return res.redirect(
     url.format({
      pathname: `${clientUrl || config.client.url}/registration/register`,
      query: {
       profile: JSON.stringify(profile),
      },
     })
    );
  } catch (error) {
   return res.redirect(`${config.client.url}/login?usernotfound=true`);
  }
 }
}
