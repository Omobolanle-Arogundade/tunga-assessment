import Joi from '@hapi/joi';
import { objectId } from './custom.validation';

const createForm = {
 body: {
  title: Joi.string().required().max(128),
  description: Joi.string().optional(),
  questions: Joi.array().items(Joi.string().custom(objectId).required()).required().min(1),
  duration: Joi.any().required(),
  sendTo: Joi.string().custom(objectId).required(),
 },
};

const fetchForms = {
 query: Joi.object().keys({
  sentBy: Joi.string().custom(objectId),
  sentTo: Joi.string().custom(objectId),
  title: Joi.string(),
  sort: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
 }),
};

const getForm = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
};

const updateForm = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
 body: Joi.object()
  .keys({
   title: Joi.string().optional().max(128),
   description: Joi.string().optional(),
   questions: Joi.array().items(Joi.string().custom(objectId).optional()).optional().min(1),
   duration: Joi.any().optional(),
  })
  .min(1),
};

const deleteForm = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
};

module.exports = {
 createForm,
 fetchForms,
 getForm,
 updateForm,
 deleteForm,
};
