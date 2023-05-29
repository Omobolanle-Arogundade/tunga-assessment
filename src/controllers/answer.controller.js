import httpStatus from 'http-status';
import mongoose from 'mongoose';

import _AnswerService from '../services/answer.service';

const { ObjectId } = mongoose.Types;

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
  const data = await _AnswerService.aggregate([
   {
    $lookup: {
     from: 'forms',
     localField: 'form',
     foreignField: '_id',
     as: 'form',
    },
   },
   {
    $lookup: {
     from: 'questions',
     localField: 'question',
     foreignField: '_id',
     as: 'question',
    },
   },
   {
    $match: {
     answeredBy: ObjectId(req.user._id),
    },
   },
   {
    $group: { _id: '$form', answers: { $push: '$$ROOT' } },
   },
   {
    $project: {
     _id: 0,
     answers: 1,
     form: { $arrayElemAt: ['$_id.title', 0] },
    },
   },
  ]);
  res.status(httpStatus.OK).send({ message: 'Answers fetched successfully', data });
 }
}
