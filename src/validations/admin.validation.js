import Joi from '@hapi/joi';
import { permissions } from '../config/permissions';
import { objectId } from './custom.validation';

const createUser = {
 body: Joi.object().keys({
  fullName: Joi.string().min(3).max(50).required().messages({
   'string.empty': `Full name cannot be an empty field`,
   'string.min': `Full name should have a minimum length of {#limit}`,
   'string.max': `Full name should have a maximum length of {#limit}`,
   'any.required': `Full name is a required field`,
  }),
  email: Joi.string().email().required(),
  permissions: Joi.array()
   .min(1)
   .max(8)
   .items(Joi.string().valid(...permissions))
   .required(),
  password: Joi.string().min(6).required().messages({
   'string.empty': `Password cannot be an empty field`,
   'string.min': `Password should have a minimum length of {#limit}`,
   'string.max': `Password should have a maximum length of {#limit}`,
   'any.required': `Password is a required field`,
  }),
 }),
};

const fetchUsers = {
 query: Joi.object().keys({
  fullName: Joi.string(),
  email: Joi.string(),
  sort: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
 }),
};

const updateUser = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
 body: Joi.object()
  .keys({
   fullName: Joi.string().min(3).max(50).optional().messages({
    'string.min': `Full name should have a minimum length of {#limit}`,
    'string.max': `Full name should have a maximum length of {#limit}`,
   }),
   email: Joi.string().email().optional(),
   permissions: Joi.array()
    .min(1)
    .max(8)
    .items(Joi.string().valid(...permissions))
    .optional(),
   password: Joi.string().min(6).optional().messages({
    'string.min': `Password should have a minimum length of {#limit}`,
    'string.max': `Password should have a maximum length of {#limit}`,
   }),
  })
  .min(1),
};

const getUser = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
};

const deleteUser = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
};

module.exports = {
 createUser,
 fetchUsers,
 updateUser,
 getUser,
 deleteUser,
};
