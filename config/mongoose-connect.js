var mongoose = require('mongoose');
var logger = require('./logger');
var userName = process.env.DB_USERNAME;
var passWord = process.env.DB_PASSWORD;
var mongoDB = formatConnection(userName, passWord);

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

function formatConnection(u, p) {
	return 'mongodb://' + u + ':' + p + '@ds229468.mlab.com:29468/untitlednodeapp';
}

module.exports = db;