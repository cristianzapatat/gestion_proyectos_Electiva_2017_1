var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');

var index = require('./routes/index');
//director
var project = require('./routes/manager/project');
var position = require('./routes/manager/position');
var member = require('./routes/manager/member');
var activity = require('./routes/manager/activity');
var meeting = require('./routes/manager/meeting');
var resources = require('./routes/manager/resources');
var task = require('./routes/manager/task');
//integrante
var selectProject = require('./routes/integrant/selectProject');
var listMeeting = require('./routes/integrant/listMeeting');
var listActivity = require('./routes/integrant/listActivity');
var listTask = require('./routes/integrant/listTask');
var listResource = require('./routes/integrant/listResource');

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
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'master_page',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

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
//director
app.use('/project', project);
app.use('/charges', position);
app.use('/member', member);
app.use('/activity', activity);
app.use('/meeting', meeting);
app.use('/resource', resources);
app.use('/task', task);
//integrant
app.use('/integrant', selectProject);
app.use('/listmeeting', listMeeting);
app.use('/listactivity', listActivity);
app.use('/listtask', listTask);
app.use('/listresource', listResource);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
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
