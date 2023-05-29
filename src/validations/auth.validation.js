import Joi from '@hapi/joi';
// const { password } = require('./custom.validation');

const sendOTP = {
 body: Joi.object().keys({
  email: Joi.string().email().required(),
  action: Joi.string().required().valid('register', 'reset-password'),
 }),
};

const verifyOTP = {
 body: Joi.object().keys({
  email: Joi.string().email().required(),
  otp: Joi.string().length(4).required(),
 }),
};

const login = {
 body: Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
 }),
};

const resetPassword = {
 body: Joi.object().keys({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
 }),
};

const updatePassword = {
 body: Joi.object().keys({
  newPassword: Joi.string().min(6).required().messages({
   'string.empty': `New Password cannot be an empty field`,
   'string.min': `New Password should have a minimum length of {#limit}`,
   'string.max': `New Password should have a maximum length of {#limit}`,
   'any.required': `New Password is a required field`,
  }),
  oldPassword: Joi.string().required().messages({
   'string.empty': `Old Password cannot be an empty field`,
   'any.required': `Old Password is a required field`,
  }),
 }),
};

const verifyPassword = {
 body: Joi.object().keys({
  password: Joi.string().min(6).required().messages({
   'string.empty': `Password cannot be an empty field`,
   'string.min': `Password should have a minimum length of {#limit}`,
   'string.max': `Password should have a maximum length of {#limit}`,
   'any.required': `Password is a required field`,
  }),
 }),
};

const refreshTokens = {
 body: Joi.object().keys({
  refreshToken: Joi.string().required(),
 }),
};
const register = {
 body: {
  fullName: Joi.string().min(3).max(50).required().messages({
   'string.empty': `Full name cannot be an empty field`,
   'string.min': `Full name should have a minimum length of {#limit}`,
   'string.max': `Full name should have a maximum length of {#limit}`,
   'any.required': `Full name is a required field`,
  }),
  email: Joi.string().email().required(),
  dob: Joi.string().isoDate().required(),
  mobile: Joi.string().required(),
  password: Joi.string().min(6).required().messages({
   'string.empty': `Password cannot be an empty field`,
   'string.min': `Password should have a minimum length of {#limit}`,
   'string.max': `Password should have a maximum length of {#limit}`,
   'any.required': `Password is a required field`,
  }),
 },
};

module.exports = {
 sendOTP,
 verifyOTP,
 login,
 register,
 resetPassword,
 updatePassword,
 refreshTokens,
 verifyPassword,
};
