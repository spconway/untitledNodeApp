var AWS = require('aws-sdk');
var async = require('async');
var aws_key = 'AKIAIORSDPVVEBY6EGQQ';
var aws_secret = '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';
var region = 'us-east-1';

AWS.config.update({
  accessKeyId: aws_key,
  secretAccessKey: aws_secret,
  region: region,
  apiVersion: 'latest'
});

var sns = new AWS.SNS({
	MonthlySpendLimit: '0.00',
	DefaultSenderID: 'UntitledNodeApp'
});

console.log('Now connected to AWS SNS.');
console.log('Endpoint: ', sns.config.endpoint);
console.log('API: ', sns.config.apiVersion);
console.log('Monthly Spending Limit: ', sns.config.MonthlySpendLimit);
console.log('Default Sender Id: ', sns.config.DefaultSenderID);

module.exports = sns;
