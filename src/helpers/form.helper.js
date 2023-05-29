import { filter, map, difference } from 'lodash';
import logger from '../config/logger';

export default class FormHelper {
 static checkFormCompletion(questions, answers) {
  try {
   if (Array.isArray(questions) && Array.isArray(answers)) {
    const requiredQuestionIds = map(
     filter(questions, { required: true }),
     (question) => question._id && question._id.toString()
    );
    const answerQuestionIds = map(filter(answers, 'answer'), (answer) => answer.questionId && answer.questionId.toString());

    // check if all required questions have been answered
    const unAnsweredQuestionIds = difference(requiredQuestionIds, answerQuestionIds);
    return !unAnsweredQuestionIds.length;
   }
   return false;
  } catch (error) {
   logger.error(`error occurred in checkFormCompletion, ${error}`);
   return false;
  }
 }
}
