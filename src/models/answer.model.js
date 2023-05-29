import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { toJSON } from './plugins';

const answerSchema = mongoose.Schema(
 {
  id: String,
  answer: {
   type: String,
   required: true,
  },
  question: {
   type: mongoose.SchemaTypes.ObjectId,
   required: true,
   ref: 'questions',
  },
  form: {
   type: mongoose.SchemaTypes.ObjectId,
   required: true,
   ref: 'forms',
  },
  answeredBy: {
   type: mongoose.SchemaTypes.ObjectId,
   required: true,
   ref: 'users',
  },
 },
 { timestamps: true, versionKey: false }
);

mongoosePaginate.paginate.options = {
 customLabels: {
  totalDocs: 'totalResults',
  docs: 'results',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  pagingCounter: 'slNo',
  meta: 'paginator',
 },
};

// add plugin that converts mongoose to json
answerSchema.plugin(toJSON);
answerSchema.plugin(mongoosePaginate);

/**
 * @typedef Answer
 */
const Answer = mongoose.model('answers', answerSchema);

module.exports = Answer;
