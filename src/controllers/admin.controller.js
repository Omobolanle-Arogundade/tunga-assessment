import httpStatus from 'http-status';
import config from 'config';

import adminPermissions from '../config/permissions';
import MailService from '../services/notifications/mail/mailgun.service';
import _UserService from '../services/user.service';

import ApiError from '../utils/ApiError';
import { authMethods, roles } from '../utils/constants';
import { clean, pick } from '../utils/object';

export default class AdminController {
 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async permissions(_req, res) {
  const data = adminPermissions;
  res.status(httpStatus.OK).send({ message: 'permssions retrieved successfully', data });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async createUser(req, res) {
  const { email, fullName, password } = req.body;
  if (await _UserService.userExists(email)) {
   throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }
  const body = {
   ...pick(req.body, ['fullName', 'email', 'password', 'permissions']),
   role: roles.ADMIN,
   authMethods: [authMethods.LOCAL],
   createdBy: req.user,
   resetPassword: true,
  };

  const data = await _UserService.create(body);

  // Send notification
  const template = config.email && config.email.template && config.email.template.ADMIN_WELCOME;
  const subject = config.email && config.email.subject && config.email.subject.ADMIN_WELCOME;
  MailService.sendMail({ email, template, payload: { password, email, fullName }, subject });
  // Send notification

  res.status(httpStatus.OK).send({ message: 'Admin created successfully', data });
 }

 static async fetchUsers(req, res) {
  const filter = pick(req.query, ['fullName', 'email']);
  const options = pick(req.query, ['sort', 'limit', 'page']);

  const filterKeys = Object.keys(filter);
  filterKeys.forEach((key) => {
   filter[key] = { $regex: filter[key], $options: 'i' };
  });

  const data = await _UserService.find({ ...filter, role: roles.ADMIN }, options);
  res.send({ data, message: 'admins fetched successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async updateUser(req, res) {
  const {
   params: { id },
   body: { fullName, email, permissions, password },
  } = req;

  const data = await _UserService.updateById(id, clean({ fullName, email, permissions, password }));
  res.status(httpStatus.OK).send({ message: 'admin updated successfully', data });
 }

 static async getUser(req, res) {
  const { id } = req.params;
  const data = await _UserService.fetchById(id);
  if (!data) {
   throw new ApiError(httpStatus.NOT_FOUND, 'Admin not Found!');
  }
  res.status(httpStatus.OK).send({ message: 'admin fetched successfully', data });
 }

 static async deleteUser(req, res) {
  const { id } = req.params;
  const data = await _UserService.deleteById(id);
  res.status(httpStatus.OK).send({ message: 'admin deleted successfully', data });
 }
}
