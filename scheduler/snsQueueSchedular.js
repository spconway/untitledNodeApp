var schedule = require('node-schedule');
var async = require('async');
var Message = require('../models/sns');
var User = require('../models/user-account');
var sqs = require('../config/aws-connect').sqs;
var sns = require('../routes/aws-sns');
var uuidv1 = require('uuid/v1');
var logger = require('../config/logger');

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
	logger.info("Launching snsJob. Scheduled time is: ", fireDate);
	logger.info("Step 1: Poll database for message with executionDate <= Date.now: ");
	Message.findByExecutionDateLessThanNowAndSubmitted(function(err, data) {
		var messages = data;
		if(err){
			return;
		}else{
			logger.debug("Messages returned: ", messages);
			logger.info("Step 2: Publish messages");
			if(messages.length > 0){
				for(message in messages) {
					var m = messages[message];
					logger.info("Sending message: ", m);
					sns.publish(m.phone, m.message, null, function(err, data) {
						if(err){
							logger.error("Error publishing message: ", err);
						}else{
							var publishedMessage = data;
							var date = new Date();
	  					var now = date.toISOString();
							var values = {
								status: "DELIVERED",
								messageId: publishedMessage.MessageId,
								modificationDate: now
							}
							logger.info("Successfully published message: ", data.MessageId);
							logger.info("Step 3: Updating records to status DELIVERED");
							Message.update(m._id, values, function(err, data) {
								if(err){
									return;
								}else{
									logger.info("Successfully updated records");
								}
							});
						}
					});
				}
			}else{
				logger.info("No messages found. Job complete.");
			}
		}
	});
});

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
	  if (err) logger.error(err, err.stack); // an error occurred
	  else     logger.info(data);           // successful response
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
	  if (err) logger.error(err, err.stack); // an error occurred
	  else     logger.info(data);           // successful response
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