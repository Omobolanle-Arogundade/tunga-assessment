import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';

import { toJSON } from './plugins';
import { authMethods, roles, userStatus } from '../utils/constants';
import ApiError from '../utils/ApiError';
import { permissions } from '../config/permissions';
import { toArray } from '../utils/object';

const userSchema = mongoose.Schema(
 {
  email: {
   type: String,
   trim: true,
   unique: true,
   lowercase: true,
   required: [true, 'Please provide your email'],
   validate: [validator.isEmail, 'Please provide a valid email'],
  },
  mobile: {
   type: String,
   trim: true,
   sparse: true,
  },
  fullName: {
   type: String,
  },
  status: {
   type: String,
   required: true,
   enum: Object.values(userStatus),
   default: userStatus.ACTIVE,
  },
  password: {
   type: String,
   trim: true,
   minlength: 6,
   private: true, // used by the toJSON plugin
  },
  role: {
   type: String,
   required: true,
   enum: Object.values(roles),
  },
  permissions: {
   type: [String],
   validate(value) {
    if (this.role === roles.ADMIN && !value) {
     throw new ApiError(httpStatus.BAD_REQUEST, `permissions are required for ${roles.ADMIN} users`);
    }
   },
   enum: permissions,
  },
  dob: {
   type: Date,
   validate(value) {
    if (this.role === roles.PATIENT && !value) {
     throw new ApiError(httpStatus.BAD_REQUEST, `Date of Birth is required for patients`);
    }
   },
  },
  createdBy: {
   type: mongoose.SchemaTypes.ObjectId,
   ref: 'users',
  },
  resetPassword: {
   type: Boolean,
   default: false,
  },
  isEmailVerified: {
   type: Boolean,
   default: false,
  },
  authMethods: [
   {
    type: String,
    enum: toArray(authMethods),
   },
  ],
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
userSchema.plugin(toJSON);
userSchema.plugin(mongoosePaginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
 const user = await this.findOne({ $and: [{ email, _id: { $ne: excludeUserId } }, { email: { $ne: null } }] });
 return !!user;
};

/**
 * Check if mobile number is taken
 * @param {string} mobile - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isNumberTaken = async function (mobile, excludeUserId) {
 const user = await this.findOne({ $and: [{ mobile, _id: { $ne: excludeUserId } }, { mobile: { $ne: null } }] });
 return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
 const user = this;
 const match = await bcrypt.compare(password, user.password);
 return match;
};

userSchema.pre('save', async function (next) {
 const user = this;
 if (user.isModified('password')) {
  user.password = await bcrypt.hash(user.password, 8);
 }
 next();
});

/**
 * @typedef User
 */
const User = mongoose.model('users', userSchema);

module.exports = User;
