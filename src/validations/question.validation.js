import Joi from '@hapi/joi';
import { objectId } from './custom.validation';

const createQuestion = {
 body: {
  label: Joi.string().required().max(128),
  type: Joi.string().required().valid('multi-choice', 'text', 'file'),
  options: Joi.array().min(4).max(4).items().optional().when('type', {
   is: 'multi-choice',
   then: Joi.required(),
  }),
  required: Joi.boolean().optional(),
 },
};

const fetchQuestions = {
 query: Joi.object().keys({
  label: Joi.string(),
  type: Joi.string(),
  sort: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
 }),
};

const getQuestion = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
};

const updateQuestion = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
 body: Joi.object()
  .keys({
   label: Joi.string().optional().max(128),
   type: Joi.string().valid('multi-choice', 'text', 'file').optional(),
   options: Joi.array().min(4).max(4).items().optional().when('type', {
    is: 'multi-choice',
    then: Joi.required(),
   }),
   required: Joi.boolean().optional(),
  })
  .min(1),
};

const deleteQuestion = {
 params: Joi.object().keys({
  id: Joi.string().custom(objectId).required(),
 }),
};

module.exports = {
 createQuestion,
 fetchQuestions,
 getQuestion,
 updateQuestion,
 deleteQuestion,
};
