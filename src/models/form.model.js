import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { toJSON } from './plugins';
import { formStatus } from '../utils/constants';

const formSchema = mongoose.Schema(
 {
  id: String,
  title: {
   type: String,
   required: true,
  },
  description: String,
  questions: [
   {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'questions',
   },
  ],
  status: {
   type: String,
   required: true,
   enum: Object.keys(formStatus),
   default: formStatus.PENDING,
  },

  expires: {
   type: Date,
   required: true,
  },
  sentBy: {
   type: mongoose.SchemaTypes.ObjectId,
   required: true,
   ref: 'users',
  },
  sentTo: {
   type: mongoose.SchemaTypes.ObjectId,
   required: true,
   ref: 'users',
  },
  completedAt: Date,
  required: Boolean,
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
formSchema.plugin(toJSON);
formSchema.plugin(mongoosePaginate);

/**
 * Check if label is taken
 * @param {string} excludeTitleId - The form's title
 * @param {ObjectId} [excludeTitleId] - The id of the form to be excluded
 * @returns {Promise<boolean>}
 */
formSchema.statics.isTitleTaken = async function (title, excludeTitleId) {
 const form = await this.findOne({ $and: [{ title, _id: { $ne: excludeTitleId } }, { title: { $ne: null } }] });
 return !!form;
};

/**
 * @typedef Form
 */
const Form = mongoose.model('forms', formSchema);

module.exports = Form;
