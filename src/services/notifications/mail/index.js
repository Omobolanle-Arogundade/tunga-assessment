import logger from '../../../config/logger';

export default class MailService {
 /**
  * Send individual email
  * @param {*} email
  * @param {*} template
  * @param {*} payload
  * @param {*} subject
  */
 static async sendMail(payload) {
  logger.info(payload);
 }

 /**
  * Send email to array of receivers
  * @param {*} receivers
  * @param {*} template
  * @param {*} payload
  * @param {*} subject
  */
 static async sendMails(receivers, template, payload, subject) {
  logger.info(receivers, template, payload, subject);
 }
}
