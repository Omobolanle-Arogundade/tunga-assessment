import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { toJSON } from './plugins';
import { questionTypes } from '../utils/constants';

const questionSchema = mongoose.Schema(
 {
  id: String,
  type: {
   type: String,
   enum: questionTypes,
   required: true,
  },
  label: String,
  options: [
   {
    type: String,
   },
  ],
  createdBy: {
   type: mongoose.SchemaTypes.ObjectId,
   required: true,
   ref: 'users',
  },
  required: {
   type: Boolean,
   default: false,
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
questionSchema.plugin(toJSON);
questionSchema.plugin(mongoosePaginate);

/**
 * Check if label is taken
 * @param {string} label - The question's label
 * @param {ObjectId} [excludeQuestionId] - The id of the question to be excluded
 * @returns {Promise<boolean>}
 */
questionSchema.statics.isLabelTaken = async function (label, excludeQuestionId) {
 const question = await this.findOne({ $and: [{ label, _id: { $ne: excludeQuestionId } }, { label: { $ne: null } }] });
 return !!question;
};

/**
 * @typedef Question
 */
const Question = mongoose.model('questions', questionSchema);

module.exports = Question;
