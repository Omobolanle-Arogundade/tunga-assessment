import moment from 'moment';
import httpStatus from 'http-status';

import { Answer } from '../models';
import ApiError from '../utils/ApiError';

import CrudService from './crud.service';
import _FormService from './form.service';

import FormHelper from '../helpers/form.helper';
import { formStatus } from '../utils/constants';

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
}

export default new AnswerService();
