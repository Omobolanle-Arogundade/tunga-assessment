import httpStatus from 'http-status';

import _AnswerService from '../services/answer.service';

export default class FormController {
 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async answerQuestions(req, res) {
  await _AnswerService.answerQuestions({ ...req.body, userId: req.user });
  res.status(httpStatus.CREATED).send({ message: 'Answers submitted successfully' });
 }

 static async fetchUserAnswers(req, res) {
  const data = await _AnswerService.fetchUserAnswers(req.user._id);
  res.status(httpStatus.OK).send({ message: 'Answers fetched successfully', data });
 }

 static async fetchAdminAnswers(req, res) {
  const data = await _AnswerService.fetchAdminAnswers(req.query);
  res.status(httpStatus.OK).send({ message: 'Answers fetched successfully', data });
 }
}
