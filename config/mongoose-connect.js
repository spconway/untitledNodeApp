var mongoose = require('mongoose');

var mongoDB = 'mongodb://stephen:Crossfit1987@ds229468.mlab.com:29468/untitlednodeapp';
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('established database connection.');
  console.log('host: ', db.host);
  console.log('name: ', db.name);
  console.log('port: ', db.port);
})

module.exports = db;