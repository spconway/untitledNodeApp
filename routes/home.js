var express = require('express');
var router = express.Router();
var sns = require('./aws-sns');

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

module.exports = router;
