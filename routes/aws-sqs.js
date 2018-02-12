var sns = require('../config/aws-connect').sqs;
var uuidv1 = require('uuid/v1');

function createQue(cb) {
	var uuid_value = uuidv1();
	var queName = 'que_' + uuid_value;
	var params = {
	  QueueName: queName, /* required */
	  Attributes: {
	    'uuid': uuid_value,
	    'created': Date.now
	  }
	};

	sqs.createQueue(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	  cb(err, data);
	});
}