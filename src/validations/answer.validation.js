import Joi from '@hapi/joi';
import { objectId } from './custom.validation';

const answerQuestions = {
 body: Joi.object().keys({
  formId: Joi.string().custom(objectId).required(),
  answers: Joi.array()
   .items(
    Joi.object().keys({
     questionId: Joi.string().custom(objectId).required(),
     answer: Joi.string().required(),
    })
   )
   .required()
   .min(1),
 }),
};

const fetchUserAnswers = {
 query: Joi.object().keys({
  sort: Joi.string(),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
 }),
};

module.exports = {
 answerQuestions,
 fetchUserAnswers,
};
