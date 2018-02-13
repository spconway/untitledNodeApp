var winston = require('winston');

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      timestamp: date,
      colorize: true,
      handleExceptions: true,
      json: false
    })
  ]
});

logger.stream = {
  write: function(message, encoding){
      logger.info(message);
  }
};

function date() {
  var d = new Date();
  var now = d.toLocaleString();
  return now;
};

module.exports = logger;