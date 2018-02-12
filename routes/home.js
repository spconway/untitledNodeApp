var express = require('express');
var router = express.Router();
var sns = require('./aws-sns');
var sqs = require('./aws-sqs');
var Message = require('../models/sns').Message;
var User = require('../models/user-account');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('home');
});

/* POST sns. */
router.post('/send', function(req, res, next) {
	console.log('req.body: ', req.body);
	var response = {
		message: '',
		error: null,
		messageId: null
	};

  sns.publish(req.body.phone, req.body.message, null, function(err, data){
  	if(err){
  		response.message = 'Error: your message could not be sent.';
  		response.error = err;
  		return res.status(500).json(response);
  	}
  	response.message = 'Successfully sent message.';
  	response.messageId = data.MessageId;
  	return res.status(201).json(response);
  });
});

/* POST sns in future */
router.post('/send/queued', function(req, res, next) {
  console.log('sending with queue: ', req.body);

  var response = {
    message: '',
    error: null,
    messageId: null
  }

  if (req.body.date && req.body.message && req.body.phone) {
    var messageDate = {
      executionDate: req.body.date,
      message: req.body.message,
      phone: req.body.phone
    }
    //use schema.create to insert data into the db
    Message.create(messageDate, function (err, message) {
      if (err) {
        return next(err);
      } else {
        console.log('message id: ', message._id);
        response.date = req.body.date;
        response.message = 'Your record will be sent on: ' + response.date;
        /* update parent record */
        User.findByIdAndUpdate(req.session.userId, { messages: message }, function(err, doc) {
          if(err){
            console.log('error finding by one and updating: ', err);
            response.message = 'There was an error processing your request.'
            res.status(500).json(response);
          }else{
            console.log('successfully found and updated parent record');
          }
        });
        return res.status(201).json(response);
      }
    });
  } else {
    response.message = 'There was an error processing your request.'
    res.status(500).json(response);
  }
});

module.exports = router;
