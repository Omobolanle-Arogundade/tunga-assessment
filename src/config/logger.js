const winston = require('winston');
const config = require('.');

const enumerateErrorFormat = winston.format((info) => {
 if (info instanceof Error) {
  Object.assign(info, { message: info.stack });
 }
 return info;
});

const logger = winston.createLogger({
 format: winston.format.combine(
  enumerateErrorFormat(),
  config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
  winston.format.splat(),
  winston.format.printf(({ level, message }) => `${level}: ${message}`)
 ),
 transports: [
  new winston.transports.Console({
   stderrLevels: ['error'],
  }),
 ],
});

module.exports = logger;
