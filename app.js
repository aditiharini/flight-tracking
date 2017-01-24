var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy; 
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var index = require('./routes/index');
var scheduler = require('./scheduling.js');
mongoose.connect('mongodb://bookitnow:eY2E8z6usp79i87JMK3iwgRJU1pYvWg5vQDXKvS707kQM03D6ml290lPHeBMAaIZWHWWRIQ5LEa6ehz7I1tJvQ==@bookitnow.documents.azure.com:10250/?ssl=true');
// mongodb://localhost/flightTracking

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
	secret: "giraffe",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', index);

//passport
var User = require('./schemas/user.js');

// passport.use(new LocalStrategy(User.authenticate()));
passport.use('local-login', new LocalStrategy({
	usernameField:'email',
	passwordField:'password',
	passReqToCallback: true
}, function(req, email, password, done){
	User.findOne({email:email}, function(err, user){
		console.log(user);
		if(err){
			return done(err);
		}
		if(!user){
			return done(null, false, req.flash('loginMessage', 'no matching user'));
		}
		if(!user.validPassword(password)){
			return done(null, false, req.flash('loginMessage, "wrong password'));
		}
		return done(null, user);
	});
}));
passport.use(new GoogleStrategy({
	clientID:'1062406632261-i6pjf2akod9nr4ur9konj4uqiff02acd.apps.googleusercontent.com',
	clientSecret:'p2QU9w7fymTv9-zB4KpNpWfJ',
	callbackURL:'http://localhost:3000/auth/google/callback',
}, function(token, refreshToken, profile, done){
	// console.log(profile);
	// done(null, profile);
		console.log('got to auth');
		console.log(profile);
		// User.findOrCreate({'google.id':profile.id}, function(err,user){
		// 	return done(err, user);
		// });
		process.nextTick(function(){
		User.findOne({email:profile.emails[0].value}, function(err, user){
			if (err){
				return done(err);
			}
			if (user){
				return done(null, user);
			}
			else{
				User.create({name:profile.displayName, email:profile.emails[0].value}, function(err, user){
					if(err){
						throw err;
					}
					return done(null, user);
				});
			}
		});
	});
}));

// passport.serializeUser(User.serializeUser());
passport.serializeUser(function(user,done){
	console.log('got to serialize');
	done(null, user);
});
// passport.deserializeUser(User.deserializeUser());
passport.deserializeUser(function(obj,done){
	console.log('got to deserialize');
	// User.findById(id, function(err,user){
	// 	done(null, user);
	// });
	done(null, obj);
});

setInterval(function(){
	scheduler.updateTickets();
	console.log("update finished");
}, 7200000);
//7200000 for 2 hrs
// supposed to be 21600000 for every 6 hrs

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
