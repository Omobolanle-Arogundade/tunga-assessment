import crypto from 'crypto';
import CacheHelper from '../helpers/cache.helper';

const ttl = 300; // 5 minutes
const cache = new CacheHelper();

export default class OTPService {
 /**
  * Get OTP Key from email passed
  * @param {*} email
  */
 static getOTPKey(email) {
  return cache.get(`OTP_for_${email}`);
 }

 /**
  *
  * @param {*} email
  */
 static removetheOTP(email) {
  return cache.delete(`OTP_for_${email}`);
 }

 /**
  * Set OTP Key for email passed
  * @param {*} email
  */
 static async cacheTheOTP(email) {
  const KEY = `OTP_for_${email}`;
  const code = parseInt(crypto.randomBytes(3).toString('hex'), 16).toString().substring(0, 4);
  await cache.set(KEY, code, ttl);
  return code;
 }
}
