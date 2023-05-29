import mailgun from 'mailgun-js';
import httpStatus from 'http-status';

import config from 'config';
import logger from 'config/logger';
import ApiError from '../../../utils/ApiError';
import { clean } from '../../../utils/object';
import MailService from '.';

const mailgunInstance = mailgun({
 apiKey: config.mailgun.api_key,
 domain: config.mailgun.domain,
 host: config.mailgun.host,
});

export default class MailGunService extends MailService {
 /**
  * Send individual email
  * @param {*} email
  * @param {*} template
  * @param {*} payload
  * @param {*} subject
  */
 static async sendMail({ from, email, template, payload, subject = '', text }) {
  try {
   const data = {
    from: from || config.mailgun.from,
    to: email,
    subject,
    template,
    text,
    'h:X-Mailgun-Variables': JSON.stringify({ ...payload }),
   };
   await mailgunInstance.messages().send(clean(data));
   logger.info('emails were sent successfully');
  } catch (error) {
   logger.error('error sending email');
   logger.error(error);
   //    throw new ApiError(error.code || httpStatus.INTERNAL_SERVER_ERROR, error || 'error sending email');
  }
 }

 /**
  * Send email to array of receivers
  * @param {*} receivers
  * @param {*} template
  * @param {*} payload
  * @param {*} subject
  */
 static async sendMails(receivers, template, payload, subject = '') {
  try {
   const to = receivers.map((receiver) => {
    return receiver.address;
   });
   const data = {
    from: config.mailgun.from,
    to,
    subject,
    template,
    'h:X-Mailgun-Variables': JSON.stringify({ ...payload }),
   };
   await mailgunInstance.messages().send(data);
   logger.info('emails were sent successfully');
  } catch (error) {
   logger.error('error sending email');
   logger.error(error);
   throw new ApiError(error.code || httpStatus.INTERNAL_SERVER_ERROR, error || 'error sending email');
  }
 }
}
