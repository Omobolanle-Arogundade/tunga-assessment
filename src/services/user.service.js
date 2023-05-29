import httpStatus from 'http-status';
import { User } from '../models';
import ApiError from '../utils/ApiError';
import { dateFilter } from '../utils/date';

// import { toJSON, pick } from '../utils/object';
import CrudService from './crud.service';

export class UserService extends CrudService {
 constructor() {
  super(User);
 }

 /**
  *
  * @param {*} email
  */
 userExists(email) {
  return (async () => {
   return this.model.isEmailTaken(email) || this.model.isNumberTaken(email);
  })();
 }

 /**
  *
  * @param {*} email
  */
 async getUserByEmail(email) {
  const user = await this.findOne({ email });
  if (!user) {
   throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
 }

 /**
  *
  * @param {*} email
  * @param {*} password
  */
 loginUserWithEmailAndPassword(email, password) {
  return (async () => {
   const user = await this.findOne({ email });
   if (user) {
    if (!(await user.isPasswordMatch(password))) {
     throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
   }
   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  })();
 }

 /**
  * Count Stores by state and date range
  * @param {*} param0
  * @returns
  */
 async countUsers({ state, time, role }) {
  const pipeline = [
   {
    $project: {
     day: { $dayOfYear: '$createdAt' },
     week: { $week: '$createdAt' },
     month: { $month: '$createdAt' },
     year: { $year: '$createdAt' },
     createdAt: 1,
     role: 1,
     gender: 1,
    },
   },
  ];

  if (time) pipeline.push({ $match: dateFilter(time) });
  if (state) pipeline.push({ $match: { state } });
  if (role) pipeline.push({ $match: { role } });

  const data = await this.aggregate(pipeline);

  return data.length;
 }
}

export default new UserService();
