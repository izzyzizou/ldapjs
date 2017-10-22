var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//BEGIN ldapAUTH
var ldapAuth = require('ldapauth-fork');
var basicAuth = require('basic-auth');

var options = {
  url: 'ldap://ldap.appl.chrysler.com:389',
  bindDN: "dc=dx.com",
  searchBase: 'ou=people',
  searchFilter: '(uid={{username}})',
  reconnect: true
};
var auth = new ldapAuth(options);

var rejectBasicAuth = function(res) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="Example"');
  res.end('Access denied');
};

var basicAuthMiddleware = function(req, res, next){
  var credentials = basicAuth(req);
  if(!credentials){
    return rejectBasicAuth(res);
  }
  auth.authenticate(credentials.name, credentials.pass, function(err, user){
    if(err){
      return rejectBasicAuth(res);
    }
    req.user = user;
    next();
  });
};
/*auth.authenticate(username, passowrd, function(err, user){
  username = "t7849ia";
  password = "secret";
  if(err){
    console.log(err);
  }else{
    console.log(user);
  }
});

auth.close(function(err){
  if(err){
    console.error(err);
  }
});*/

//END ldapAuth
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

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
app.listen(8080, function(){
  console.log("running");
});
