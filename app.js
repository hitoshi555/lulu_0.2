var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('express-flash');

var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/usersRouter');
var projectRouter = require('./routes/projectRouter');
var companyRouter = require('./routes/companyRouter');

var app = express();

const bcrypt = require('bcrypt');

var passport = require('passport');
var session = require('express-session');
const User = require('./model/userSchema');

app.use(
  session({ 
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave:false,
    saveUninitialized:false,
    secret: 'passport test' 
  })
);

app.use(passport.initialize());
app.use(passport.session());
const LocalStrategy = require('passport-local').Strategy;
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        await User.findOne({ email: username }, (err, user) => {
          var has_password = bcrypt.compareSync(
            password,
            user.toObject().password
          );
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }
          if (!has_password) {
            return done(null, false);
          }
          return done(null, user);
        });
      } catch (err) {
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = req.flash();
  next();
});

//mongoDB
const mongoose = require('mongoose');
const connectOption = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
};
mongoose.connect(
  'mongodb+srv://dblulu:dblulu@cluster0-vowio.mongodb.net/test?retryWrites=true&w=majority',
  connectOption
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('DB connection successful'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/project', projectRouter);
app.use('/company', companyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
