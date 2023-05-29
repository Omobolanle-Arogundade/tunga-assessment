import Joi from '@hapi/joi';

const uploadImage = {
 body: Joi.object().keys({
  path: Joi.string().optional(),
  tags: Joi.string().optional(),
  height: Joi.number().optional(),
  width: Joi.number().optional(),
 }),
};

const removeImage = {
 body: Joi.object().keys({
  path: Joi.string().required(),
  image: Joi.string().required(),
 }),
};

module.exports = {
 uploadImage,
 removeImage,
};
