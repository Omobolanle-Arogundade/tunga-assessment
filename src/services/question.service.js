// import httpStatus from 'http-status';
import { Question } from '../models';
// import ApiError from '../utils/ApiError';
// import { roles } from '../utils/constants';
// import { dateFilter } from '../utils/date';

// import { toJSON, pick } from '../utils/object';
import CrudService from './crud.service';

export class QuestionService extends CrudService {
 constructor() {
  super(Question);
 }

 /**
  *
  * @param {*} label
  */
 labelExists(label) {
  return (async () => {
   return this.model.isLabelTaken(label);
  })();
 }
}

export default new QuestionService();
