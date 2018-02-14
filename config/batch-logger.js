var winston = require('winston');
const env = process.env.NODE_ENV;
const logDir = (env === 'production' ? '/var/log/' : './logs/batch/');
const fileName = 'untitledNodeApp-batch.log';
const fs = require('fs');

if (!fs.existsSync(logDir) && env !== 'production') {
  fs.mkdirSync(logDir);
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      filename: (logDir + fileName),
      level: env === 'production' ? 'error' : 'debug',
      json: false,
      timestamp: date,
      maxsize: 1048576,
      maxFiles: 10
    })
  ],
  exitOnError: false
});

function date() {
  var d = new Date();
  var now = d.toLocaleString();
  return now;
}

logger.stream = {
  write: function(message, encoding){
      logger.info(message);
  }
}

module.exports = logger;