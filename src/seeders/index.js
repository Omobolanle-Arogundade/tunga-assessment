import mongoose from 'mongoose';
import _UserService from '../services/user.service';
import admin from './mock/admin.seeder';
import logger from '../config/logger';
import config from '../config';

const connectDB = async () => {
 logger.info('connecting to db');
 await mongoose.connect(config.mongoose.url, config.mongoose.options);
};

const clearDB = async () => {
 logger.warn('clearing db');
 await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
};

const disconnectDB = async () => {
 logger.warn('disconnecting from db');
 await mongoose.disconnect();
};

const seedDB = async () => {
 try {
  logger.info('running seeder');
  await connectDB();
  await clearDB();

  logger.info('seeding admin');
  await _UserService.create(admin);

  logger.info('seeder completed');
 } catch (e) {
  logger.error(e);
 }

 await disconnectDB();
};

seedDB();
