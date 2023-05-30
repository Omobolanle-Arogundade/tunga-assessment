import moment from 'moment';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

import { Answer } from '../models';
import ApiError from '../utils/ApiError';

import CrudService from './crud.service';
import _FormService from './form.service';

import FormHelper from '../helpers/form.helper';
import { answersGroupBy, formStatus } from '../utils/constants';

const { ObjectId } = mongoose.Types;

export class AnswerService extends CrudService {
 constructor() {
  super(Answer);
 }

 async answerQuestions(payload) {
  const { formId, answers, userId } = payload;
  const form = await _FormService.findOne({ _id: formId, sentTo: userId }, ['questions']);
  if (!form) {
   throw new ApiError(httpStatus.BAD_REQUEST, 'Form does not exist');
  }

  const isFormCompleted = FormHelper.checkFormCompletion(form.questions, answers);

  if (isFormCompleted) {
   await _FormService.updateById(formId, { status: formStatus.COMPLETED, completedAt: moment() });
  }

  await this.bulkWrite(answers, (_answer) => {
   const data = {
    question: _answer.questionId,
    answer: _answer.answer,
    form: formId,
    answeredBy: userId,
   };
   return {
    updateOne: {
     filter: { question: data.question, form: data.form },
     update: { $set: data },
     upsert: true,
    },
   };
  });
 }

 async fetchUserAnswers(patientId) {
  return this.aggregate([
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
     answeredBy: ObjectId(patientId),
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
 }

 async fetchAdminAnswers(query) {
  const { patient, groupBy } = query;
  let pipeline = [];
  if (patient) {
   pipeline.push({
    $match: {
     answeredBy: ObjectId(patient),
    },
   });
  }

  switch (groupBy) {
   case answersGroupBy.FORM:
    pipeline = pipeline.concat(pipeline, [
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
    break;

   case answersGroupBy.PATIENT:
    pipeline = pipeline.concat(pipeline, [
     {
      $lookup: {
       from: 'users',
       localField: 'answeredBy',
       foreignField: '_id',
       as: 'patient',
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
      $group: { _id: '$patient', answers: { $push: '$$ROOT' } },
     },
     {
      $project: {
       _id: 0,
       answers: 1,
       patient: { $arrayElemAt: ['$_id.fullName', 0] },
      },
     },
    ]);
    break;

   case answersGroupBy.QUESTION:
    pipeline = pipeline.concat(pipeline, [
     {
      $lookup: {
       from: 'questions',
       localField: 'question',
       foreignField: '_id',
       as: 'question',
      },
     },
     {
      $group: { _id: '$question', answers: { $push: '$$ROOT' } },
     },
     {
      $project: {
       _id: 0,
       answers: 1,
       question: { $arrayElemAt: ['$_id.label', 0] },
      },
     },
    ]);
    break;

   default:
    break;
  }

  return this.aggregate(pipeline);
 }
}

export default new AnswerService();
