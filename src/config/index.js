const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
 .keys({
  NODE_ENV: Joi.string().valid('production', 'staging', 'development', 'test').required(),
  PORT: Joi.any().default(8080),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  CLIENT_URL: Joi.string().required().description('Client url'),
  BASE_URL: Joi.string().required().description('Base url'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire').required(),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire').required(),

  EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app').required(),
  MAILGUN_API_KEY: Joi.string().description('Mailgun API Key is required').required(),
  MAILGUN_DOMAIN: Joi.string().description('Mailgun domain is required').required(),
  MAILGUN_HOST: Joi.string().description('Mailgun Host is required').required(),

  CLOUDINARY_CLOUD_NAME: Joi.string().description('Cloudinary cloud name is required').required(),
  CLOUDINARY_API_KEY: Joi.string().description('Cloudinary API Key is required').required(),
  CLOUDINARY_API_SECRET: Joi.string().description('Cloudinary API Secret is required').required(),

  GOOGLE_KEY: Joi.string().description('Google API key is required').required(),

  FACEBOOK_APP_ID: Joi.string().description('Facebook App ID').required(),
  FACEBOOK_APP_SECRET: Joi.string().description('Facebook App Secret').required(),
  FACEBOOK_REDIRECT_URL: Joi.string().description('Facebook Redirect URL').required(),

  GOOGLE_CLIENT_ID: Joi.string().description('Google Client ID').required(),
  GOOGLE_CLIENT_SECRET: Joi.string().description('Google Client Secret').required(),
  GOOGLE_REDIRECT_URL: Joi.string().description('Google Redirect URL').required(),

  ENABLE_CRON_JOBS: Joi.boolean().required().description('Enable Cron Jobs').required(),

  BUGSNAP_API_KEY: Joi.string().description('Bugsnag API Key').required(),
  ADMIN_PASSWORD: Joi.string().description('Admin password').required(),

  REDIS_URL: Joi.string().description('Redis url').required(),
 })
 .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
 throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
 env: envVars.NODE_ENV,
 port: envVars.PORT,
 client: {
  url: envVars.CLIENT_URL,
  baseUrl: envVars.BASE_URL,
 },
 mongoose: {
  url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  options: {
   useCreateIndex: true,
   useNewUrlParser: true,
   useUnifiedTopology: true,
  },
 },
 jwt: {
  secret: envVars.JWT_SECRET,
  accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  resetPasswordExpirationMinutes: 10,
 },
 mailgun: {
  from: envVars.EMAIL_FROM,
  api_key: envVars.MAILGUN_API_KEY,
  domain: envVars.MAILGUN_DOMAIN,
  host: envVars.MAILGUN_HOST,
 },
 cloudinary: {
  cloudName: envVars.CLOUDINARY_CLOUD_NAME,
  apiKey: envVars.CLOUDINARY_API_KEY,
  apiSecret: envVars.CLOUDINARY_API_SECRET,
 },
 email: {
  from: envVars.EMAIL_FROM,
  template: {
   SENDOTP: 'verification',
   USER_WELCOME: 'welcome',
   ADMIN_WELCOME: 'admin-welcome',
  },
  subject: {
   SENDOTP: 'OTP Verification',
   USER_WELCOME: 'Welcome Onboard',
   ADMIN_WELCOME: 'Welcome Onboard',
  },
 },
 googleAuth: {
  clientID: envVars.GOOGLE_CLIENT_ID,
  clientSecret: envVars.GOOGLE_CLIENT_SECRET,
  callbackURL: envVars.GOOGLE_REDIRECT_URL,
 },
 facebookAuth: {
  clientID: envVars.FACEBOOK_APP_ID,
  clientSecret: envVars.FACEBOOK_APP_SECRET,
  callbackURL: envVars.FACEBOOK_REDIRECT_URL,
  profileFields: ['id', 'displayName', 'link', 'photos', 'emails', 'name'],
 },
 facebookCustomerAuth: {
  clientID: envVars.FACEBOOK_APP_ID,
  clientSecret: envVars.FACEBOOK_APP_SECRET,
  callbackURL: envVars.FACEBOOK_CUSTOMERS_REDIRECT_URL,
  profileFields: ['id', 'displayName', 'link', 'photos', 'emails', 'name'],
 },
 settings: {
  enableCron: envVars.ENABLE_CRON_JOBS,
 },
 bugsnag: {
  apiKey: envVars.BUGSNAP_API_KEY,
 },
 admin: {
  password: envVars.ADMIN_PASSWORD,
 },
 redis: {
  url: envVars.REDIS_URL,
 },
};
