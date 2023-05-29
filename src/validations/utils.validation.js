import Joi from '@hapi/joi';

const uploadFile = {
 body: Joi.object().keys({
  path: Joi.string().optional(),
  tags: Joi.string().optional(),
  height: Joi.number().optional(),
  width: Joi.number().optional(),
 }),
};

const removeFile = {
 query: Joi.object().keys({
  path: Joi.string().required(),
  file: Joi.string().required(),
 }),
};

module.exports = {
 uploadFile,
 removeFile,
};
