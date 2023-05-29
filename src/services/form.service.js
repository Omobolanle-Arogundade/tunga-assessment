import moment from 'moment';
import httpStatus from 'http-status';

import { Form } from '../models';
import ApiError from '../utils/ApiError';

import CrudService from './crud.service';
import _UserService from './user.service';
import { clean } from '../utils/object';
import { formStatus } from '../utils/constants';

export class FormService extends CrudService {
 constructor() {
  super(Form);
 }

 /**
  *
  * @param {*} label
  */
 titleExists(label) {
  return (async () => {
   return this.model.isTitleTaken(label);
  })();
 }

 /**
  *
  * @param {*} payload
  * @returns
  */
 async createForm(payload) {
  const { title, sendTo } = payload;
  const recipient = await _UserService.fetchById(sendTo);

  if (!recipient) {
   throw new ApiError(httpStatus.BAD_REQUEST, 'Recipient does not exist');
  }
  const body = {
   ...payload,
   expires: moment().add(payload.duration),
   sentTo: recipient,
  };

  if (await this.titleExists(title)) {
   throw new ApiError(httpStatus.CONFLICT, 'Form already exists');
  }
  const data = JSON.parse(JSON.stringify(await this.create(body)));
  delete data.sentBy;
  return data;
 }

 /**
  *
  * @param {*} id
  * @param {*} payload
  * @returns
  */
 async updateForm(id, payload) {
  const { duration } = payload;
  if (duration) {
   // eslint-disable-next-line no-param-reassign
   payload.expires = moment().add(duration);
  }
  return this.updateById(id, clean(payload));
 }

 async sendReminder() {
  const forms = await this.findAll({ expires: { $lte: new Date() }, status: { $ne: formStatus.COMPLETED } }, undefined, [
   { path: 'sentTo' },
  ]);

  await Promise.all(
   forms.map((form) => {
    const {
     sentTo: { email },
    } = form;
    // TODO => Send reminder emails to the recipients
    return email;
   })
  );
 }
}

export default new FormService();