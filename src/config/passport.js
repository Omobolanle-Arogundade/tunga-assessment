const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { Strategy: GoogleStrategy } = require('passport-google-oauth2');

const config = require('.');
const { User, Customer } = require('../models');
const logger = require('./logger');

const jwtOptions = {
 secretOrKey: config.jwt.secret,
 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtUserVerify = async (payload, done) => {
 try {
  const user = await User.findById(payload.sub);
  if (!user) {
   return done(null, false);
  }
  done(null, user);
 } catch (error) {
  done(error, false);
 }
};

const jwtCustomerVerify = async (payload, done) => {
 try {
  const user = await Customer.findById(payload.sub);
  if (!user) {
   return done(null, false);
  }
  done(null, user);
 } catch (error) {
  done(error, false);
 }
};

const facebookAuth = (_accessToken, _refreshToken, profile, done) => {
 try {
  logger.info('facebook profile is');
  logger.info(JSON.stringify(profile, undefined, 2));
  return done(null, profile);
 } catch (error) {
  done(error, false);
 }
};

const googleAuth = (_accessToken, _refreshToken, profile, done) => {
 try {
  logger.info('google profile is');
  logger.info(JSON.stringify(profile, undefined, 2));
  return done(null, profile);
 } catch (error) {
  done(error, false);
 }
};

const jwtUserStrategy = new JwtStrategy(jwtOptions, jwtUserVerify);
const jwtCustomerStrategy = new JwtStrategy(jwtOptions, jwtCustomerVerify);

const facebookStrategy = new FacebookStrategy(config.facebookAuth, facebookAuth);

const googleStrategy = new GoogleStrategy(config.googleAuth, googleAuth);

module.exports = {
 jwtUserStrategy,
 jwtCustomerStrategy,
 facebookStrategy,
 googleStrategy,
};
