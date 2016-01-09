var express = require('express');
var http = require('http');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressValidator = require('express-validator');
var flash = require('connect-flash');
var multer = require('multer');
var session = require('express-session');



var routes = require('./routes');
var users = require('./routes/user');

var app = express();

//===>>> STARTS:MIDDLEWARE <<<===
app.use(multer({dest:'./uploads/'}).single('singleInputFileName'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Express-session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
//Connect-flash
app.use(flash());
//Global vars (...are good for Jade templates!)
app.locals.moment = require('moment');
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Express-validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.get('/', routes.index);
app.get('/users', users.list);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
