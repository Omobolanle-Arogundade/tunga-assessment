const mongoose = require('mongoose');
const http = require('http');

const app = require('./app');
const config = require('./config');
const logger = require('./config/logger');
const socket = require('./config/socket');
const { default: CronService } = require('./services/cron.service');
const { default: RedisClient } = require('./helpers/cache.helper');

let server;
mongoose
 .connect(config.mongoose.url, config.mongoose.options)
 .then(() => {
  logger.info('Connected to MongoDB');
 })
 .catch((err) => logger.error(`Error in mongoose connection ${err}`));

const redisClient = new RedisClient();

redisClient.client.on('connect', () => {
 logger.info('Redis client connected');
 logger.info(`connected to ${config.redis}`);
});

const port = config.port || '8080';

logger.info(`Serving on port, ${port}`);

logger.info(`ENVS are: , ${JSON.stringify(config, undefined, 2)}`);

const httpServer = http.createServer(app);
const serverInstance = httpServer.listen(port);

CronService.run();

const exitHandler = () => {
 if (server) {
  server.close(() => {
   logger.info('Server closed');
   process.exit(1);
  });
 } else {
  process.exit(1);
 }
};

const unexpectedErrorHandler = (error) => {
 logger.error(error);
 exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
 logger.info('SIGTERM received');
 if (server) {
  server.close();
 }
});

socket.init(serverInstance);
socket.connection();
