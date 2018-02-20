var AWS = require('aws-sdk');
var async = require('async');
var logger = require('./logger');
var region = 'us-east-1';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: region,
  apiVersion: 'latest'
});

var sns = new AWS.SNS({
	MonthlySpendLimit: '0.00',
	DefaultSenderID: 'UntitledNodeApp'
});

var sqs = new AWS.SQS();

logger.info('Now connected to AWS SNS.');
logger.info('Endpoint: ', sns.config.endpoint);
logger.info('API: ', sns.config.apiVersion);
logger.info('Monthly Spending Limit: ', sns.config.MonthlySpendLimit);
logger.info('Default Sender Id: ', sns.config.DefaultSenderID);

module.exports = {
	sns: sns,
	sqs: sqs
};