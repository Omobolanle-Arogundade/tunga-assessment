import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

export default class CrudService {
 constructor(model) {
  this.model = model;
 }

 /**
  *
  * @param {*} data
  */
 async create(data) {
  return this.model.create(data);
 }

 /**
  *
  * @param {*} criteria
  * @param {*} options
  */
 async find(criteria = {}, options = {}, populate = []) {
  // eslint-disable-next-line no-param-reassign
  options.limit = 100;

  const paginateOption = { ...options };
  paginateOption.populate = populate;
  return this.model.paginate(criteria, paginateOption);
 }

 /**
  *
  * @param {*} criteria
  * @param {*} update
  * @param {*} options
  * @returns
  */
 async findOneAndUpdate(criteria = {}, update, options = {}) {
  return this.model.findOneAndUpdate(criteria, update, options);
 }

 /**
  *
  * @param {*} criteria
  */
 async findAll(criteria = {}, options = {}, populate = []) {
  return this.model.find(criteria, null, options).populate(populate);
 }

 async count(criteria = {}) {
  return this.model.countDocuments(criteria);
 }

 /**
  *
  * @param {*} criteria
  */
 async findOne(criteria, populate = []) {
  return this.model.findOne(criteria).populate(populate);
 }

 /**
  *
  * @param {*} id
  */
 async fetchById(id, populate = []) {
  return this.model.findById(id).populate(populate);
 }

 /**
  *
  * @param {*} id
  * @param {*} body
  */
 async updateById(id, body) {
  const item = await this.fetchById(id);

  // eslint-disable-next-line new-cap
  const instance = new this.model({});
  const collectionName = instance.constructor.modelName;
  if (!item) {
   throw new ApiError(httpStatus.NOT_FOUND, `${collectionName.toUpperCase()} not found`);
  }

  Object.assign(item, body);

  await item.save();
  return item;
 }

 /**
  *
  * @param {*} criteria
  * @param {*} data
  */
 async updateMany(criteria, update, options = {}) {
  return this.model.updateMany(criteria, update, options);
 }

 /**
  *
  * @param {*} id
  */
 async deleteById(id) {
  const item = await this.fetchById(id);
  // eslint-disable-next-line new-cap
  const instance = new this.model({});
  const collectionName = instance.constructor.modelName;
  if (!item) {
   throw new ApiError(httpStatus.NOT_FOUND, `${collectionName.toUpperCase()} not found`);
  }
  await item.remove();
  return item;
 }

 /**
  *
  * @param {*} criteria
  */
 async deleteOne(criteria) {
  return this.model.findOneAndDelete(criteria);
 }

 /**
  *
  * @param {*} criteria
  */
 async deleteMany(criteria) {
  return this.model.deleteMany(criteria);
 }

 /**
  *
  * @param {*} array
  * @param {*} Fn
  * @returns
  */
 async bulkWrite(array, Fn) {
  return this.model.bulkWrite(array.map((data) => Fn(data)));
 }

 /**
  *
  * @param {*} pipeline
  */
 async aggregate(pipeline) {
  return this.model.aggregate(pipeline);
 }
}
