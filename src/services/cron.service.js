// import { schedule } from 'node-cron';
import { schedule } from 'node-cron';
import config from '../config';
import logger from '../config/logger';
import _FormService from './form.service';

export default class CronService {
 static sendReminder() {
  logger.info('auto send reminder...');
  //   run cron every 5 minutes
  schedule(
   '*/5 * * * *',
   () => {
    logger.info('auto send reminder is now running');
    _FormService.sendReminder();
   },
   {}
  );
 }

 static run() {
  if (config.settings.enableCron !== true) {
   logger.verbose('Cron jobs currently disabled');
   return;
  }

  this.sendReminder();
 }
}
