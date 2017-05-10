var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var project = require('./routes/project');
var position = require('./routes/position');

var db = require('./dao/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

/*var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        session: function () {
          return 'German Donoso';
        }
    }
});*/
//Se asocia la página de masterPage
app.engine('.hbs', exphbs(
        {extname: '.hbs',
         defaultLayout: 'master_page',
         layoutsDir: __dirname + '/views/layouts/',
         partialsDir: __dirname + '/views/partials/'}));

app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configuración de la session
app.use(session({
  secret: 'gestion-proyectos',
  resave: true,
  saveUninitialized: true
}));

app.use('/', index);
app.use('/users', users);
app.use('/project', project);
app.use('/charges', position);

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

db.getConnection();

module.exports = app;
