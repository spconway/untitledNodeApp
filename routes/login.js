var express = require('express');
var router = express.Router();
var User = require('../models/user-account');

/* GET one user */
router.post('/', function(req, res, next) {
	console.log('req.body: ', req.body);
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function(err, user) {
			if (err || !user) {
				var err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('/home');
			}
		});
	} else {
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}
});

module.exports = router;
