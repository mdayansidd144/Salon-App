const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack || ''} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
  })
);

const transport = new DailyRotateFile({
  filename: 'logs/%DATE%-app.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: logFormat
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  exceptionHandlers: [
    transport,
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    transport,
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

module.exports = logger;