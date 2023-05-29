import httpStatus from 'http-status';

import _FormService from '../services/form.service';
import { pick } from '../utils/object';
import { roles } from '../utils/constants';
import ApiError from '../utils/ApiError';

export default class FormController {
 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async createForm(req, res) {
  const data = await _FormService.createForm({ ...req.body, sentBy: req.user });
  res.status(httpStatus.CREATED).send({ message: 'Form created successfully', data });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async fetchForms(req, res) {
  const filter = pick(req.query, ['sentTo', 'sentBy', 'title']);
  const options = pick(req.query, ['sort', 'limit', 'page']);

  if (req.user && req.user.role !== roles.ADMIN) {
   filter.sentTo = req.user.id;
  }

  const data = await _FormService.find({ ...filter }, options, ['questions']);
  res.send({ data, message: 'forms fetched successfully' });
 }

 /**
  *
  * @param {*} req
  * @param {*} res
  */
 static async getForm(req, res) {
  const { id } = req.params;
  const data = await _FormService.fetchById(id, ['questions', 'sentBy', 'sentTo']);
  if (!data) {
   throw new ApiError(httpStatus.NOT_FOUND, 'Form not Found!');
  }
  res.status(httpStatus.OK).send({ message: 'Form fetched successfully', data });
 }

 static async updateForm(req, res) {
  const {
   params: { id },
   body,
  } = req;

  const data = await _FormService.updateForm(id, body);
  res.status(httpStatus.OK).send({ message: 'Form updated successfully', data });
 }

 static async deleteForm(req, res) {
  const { id } = req.params;
  const data = await _FormService.deleteById(id);
  res.status(httpStatus.OK).send({ message: 'Form deleted successfully', data });
 }
}
