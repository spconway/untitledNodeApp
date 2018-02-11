var sns = require('../config/aws-connect').sns;

/*
	Create topic
 */
function createTopic(cb) {
	sns.createTopic({ Name: 'Test'} , function(err, data) {
	  if (err) console.error(err, err.stack); // an error occurred
	  else     console.log('Successfully created topic ', data.TopicArn);           // successful response
	  cb(err, data);
	});
}

/*
	Create subscription with topic
 */
function subscribe(phoneNumber, topic, cb) {
	var subscribeParams = {
	  Protocol: 'sms', /* required */
	  TopicArn: topic, /* required */
	  Endpoint: '+1' + phoneNumber
	};

	sns.subscribe(subscribeParams, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log('Successfully subscribed to ', data.SubscriptionArn);           // successful response
	  cb(err, data);
	});
}

/*
	Publish with topic
 */
function publish(phoneNumber, message, topic, cb){
	var publishParams = {
	  Message: message, /* required */
	  TopicArn: topic,
	  PhoneNumber: '+1' + phoneNumber
	};
	sns.publish(publishParams, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log('Successfully published message: ', data);           // successful response
	  cb(err, data);
	});
}

module.exports = {
	createTopic: createTopic,
	subscribe: subscribe,
	publish: publish
}