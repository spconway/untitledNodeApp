var mongoose = require('mongoose');
var logger = require('./logger');

var mongoDB = 'mongodb://stephen:Crossfit1987@ds229468.mlab.com:29468/untitlednodeapp';

mongoose.connect(mongoDB, {
	poolSize: 10
});

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', logger.error.bind(logger, 'connection error:'));
db.once('open', function() {
	logger.info('established database connection.');
  logger.info('host: ', db.host);
  logger.info('name: ', db.name);
  logger.info('port: ', db.port);
  logger.info('pool size: ', db._connectionOptions.poolSize);
})

module.exports = db;