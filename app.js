var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var db = require('./config/mongoose-connect');
var aws = require('./config/aws-connect');
var batchJob = require('./scheduler/snsQueueSchedular');
var logger = require('./config/logger');

/* path setup */
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var home = require('./routes/home');
var logout = require('./routes/logout');

/* express initialization */
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// environment setup
// uncomment when moving to production environment
//app.set('env', 'production');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('combined', { 'stream': logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'super secret',
	resave: true,
	saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

/* custom login middleware */
function checkLogin(req, res, next) {
	if ((req.session && req.session.userId) || req.path == '/' || req.path == '/login') {
    next();
  } else {
  	res.redirect('/');
  }
}

// login validator
app.all('*', checkLogin);


app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/home', home);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
