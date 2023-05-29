import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';

import config from '../config';
import { Token } from '../models';
import ApiError from '../utils/ApiError';
import CrudService from './crud.service';

export class TokenService extends CrudService {
 constructor() {
  super(Token);
 }
 /**
  * Generate token
  * @param {ObjectId} userId
  * @param {Moment} expires
  * @param {string} [secret]
  * @returns {string}
  */

 // eslint-disable-next-line class-methods-use-this
 generateToken(userId, expires, secret = config.jwt.secret) {
  const payload = {
   sub: userId,
   iat: moment().unix(),
   //    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
 }

 /**
  * Save a token
  * @param {string} token
  * @param {ObjectId} userId
  * @param {Moment} expires
  * @param {string} type
  * @param {boolean} [blacklisted]
  * @returns {Promise<Token>}
  */
 async saveToken(token, userId, expires, type, blacklisted = false) {
  const tokenDoc = await this.create({
   token,
   user: userId,
   expires: expires.toDate(),
   type,
   blacklisted,
  });
  return tokenDoc;
 }

 /**
  * Verify token and return token doc (or throw an error if it is not valid)
  * @param {string} token
  * @param {string} type
  * @returns {Promise<Token>}
  */
 async verifyToken(token, type) {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await this.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
   throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found');
  }
  return tokenDoc;
 }

 /**
  * Generate auth tokens
  * @param {User} user
  * @returns {Promise<Object>}
  */
 async generateAuthTokens(user) {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = this.generateToken(user.id, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = this.generateToken(user.id, refreshTokenExpires);

  const returnTokens = {
   access: {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
   },
   refresh: {
    token: refreshToken,
    expires: refreshTokenExpires.toDate(),
   },
  };

  await this.saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');

  return returnTokens;
 }
}

export default new TokenService();
