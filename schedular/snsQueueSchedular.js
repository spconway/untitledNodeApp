var schedule = require('node-schedule');
var async = require('async');
var Message = require('../models/sns');
var User = require('../models/user-account');
var sqs = require('../config/aws-connect').sqs;
var sns = require('../routes/aws-sns');
var uuidv1 = require('uuid/v1');

/**
 * *    *    *    *    *    *
 * ┬    ┬    ┬    ┬    ┬    ┬
 * │    │    │    │    │    │
 * │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
 * │    │    │    │    └───── month (1 - 12)
 * │    │    │    └────────── day of month (1 - 31)
 * │    │    └─────────────── hour (0 - 23)
 * │    └──────────────────── minute (0 - 59)
 * └───────────────────────── second (0 - 59, OPTIONAL)
 */

var snsRecurrenceRule = new schedule.RecurrenceRule();
snsRecurrenceRule.minute = new schedule.Range(0, 59, 3);

schedule.scheduleJob(snsRecurrenceRule, function(fireDate) {
	console.log("Launching snsJob. Scheduled time is: ", fireDate);
	console.log("Step 1: Poll database for message with executionDate <= Date.now: ");
	Message.findByExecutionDateLessThanNowAndSubmitted(function(err, data) {
		var messages = data;
		if(err){
			return;
		}else{
			console.log("Step 2: Publish messages");
			for(message in messages) {
				var m = messages[message];
				console.log("Sending message: ", m);
				sns.publish(m.phone, m.message, null, function(err, data) {
					if(err){
						console.log("Error publishing message: ", err);
					}else{
						var publishedMessage = data;
						var date = new Date();
  					var now = date.toISOString();
						var values = {
							status: "DELIVERED",
							messageId: publishedMessage.MessageId,
							modificationDate: now
						}
						console.log("Successfully published message: ", data.MessageId);
						console.log("Step 3: Updating records to status DELIVERED");
						Message.update(m._id, values, function(err, data) {
							if(err){
								return;
							}else{
								console.log("Successfully updated records");
							}
						});
					}
				});
			}
		}
	});
});

/*
var snsRecurrenceRuleWithQueue = new schedule.RecurrenceRule();
snsRecurrenceRuleWithQueue.minute = new schedule.Range(0, 59, 1);

schedule.scheduleJob(snsRecurrenceRule, function(fireDate) {
	console.log("Launching snsJob. Scheduled time is: ", fireDate);
	console.log("Step 1: Poll database for message with executionDate <= Date.now: ", now);
	Message.findByExecutionDateLessThanNowAndSubmitted(function(err, data) {
		if(err){
			return;
		}else{
			console.log("Step 2: Create queue");
			createQueue(function(err, data) {
				if(err){
					return;
				}else{
					var queueUrl = data.QueueUrl;
					console.log("Step 3: Send messages to queue");
					createQueue(function(err, data) {
						if(err)
					});
				}
			});
		}
	});
});
*/

function createQueue(cb) {
	var uuid_value = uuidv1();
	var queName = 'que_' + uuid_value;
	var params = {
	  QueueName: queName, /* required */
	  Attributes: {
	    'uuid': uuid_value,
	    'created': Date().now()
	  }
	};

	sqs.createQueue(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	  cb(err, data);												// data.QueueUrl
	});
}

/**
 * [sendMessageBatch can only take up to 10 messages at a time]
 * @param  {[type]}   messages [description]
 * @param  {Function} cb       [description]
 * @return {[type]}            [description]
 */
function sendMessageBatch(messages, queueUrl, cb) {
	var params = {
	  Entries: [buildQueueMessage(messages)],
	  QueueUrl: queueUrl /* required */
	};
	sqs.sendMessageBatch(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});
}

function buildQueueMessage(messages) {
	var Entries = [];
	var entry;

	for (message in messages) {
		entry = {
			Id: message._id, // where can i get the id from?
			MessageBody: message.message,
		}
		Entries.push(entry);
	}

	return Entries;
}

async.series([], function(r1, r2) {

});