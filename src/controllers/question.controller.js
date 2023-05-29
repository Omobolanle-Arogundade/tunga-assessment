import httpStatus from 'http-status';
// import config from 'config';

import _QuestionService from '../services/question.service';
import { clean, pick } from '../utils/object';
import ApiError from '../utils/ApiError';

// import ApiError from '../utils/ApiError';
// import { authMethods, roles } from '../utils/constants';
// import { clean, pick } from '../utils/object';

export default class QuestionController {
 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async createQuestion(req, res) {
  const { label } = req.body;
  const body = {
   ...req.body,
   createdBy: req.user,
  };
  if (await _QuestionService.labelExists(label)) {
   throw new ApiError(httpStatus.CONFLICT, 'Question already exists');
  }
  const data = JSON.parse(JSON.stringify(await _QuestionService.create(body)));
  delete data.createdBy;
  res.status(httpStatus.CREATED).send({ message: 'Question created successfully', data });
 }

 static async fetchQuestions(req, res) {
  const filter = pick(req.query, ['label', 'type']);
  const options = pick(req.query, ['sort', 'limit', 'page']);

  const filterKeys = Object.keys(filter);
  filterKeys.forEach((key) => {
   filter[key] = { $regex: filter[key], $options: 'i' };
  });

  const data = await _QuestionService.find({ ...filter }, options);
  res.send({ data, message: 'questions fetched successfully' });
 }

 static async getQuestion(req, res) {
  const { id } = req.params;
  const data = await _QuestionService.fetchById(id);
  if (!data) {
   throw new ApiError(httpStatus.NOT_FOUND, 'Question not Found!');
  }
  res.status(httpStatus.OK).send({ message: 'Question fetched successfully', data });
 }

 static async updateQuestion(req, res) {
  const {
   params: { id },
   body: { label, type, options },
  } = req;

  const data = await _QuestionService.updateById(id, clean({ label, type, options }));
  res.status(httpStatus.OK).send({ message: 'Question updated successfully', data });
 }

 static async deleteQuestion(req, res) {
  const { id } = req.params;
  const data = await _QuestionService.deleteById(id);
  res.status(httpStatus.OK).send({ message: 'Question deleted successfully', data });
 }
}
