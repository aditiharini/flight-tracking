var express = require('express');
var request = require('request'); 
var router = express.Router();
var passport = require('passport'); 
var User = require('../schemas/user.js');
var Booking = require('../schemas/booking.js');
var flash = require('connect-flash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
	res.render('login', {messages:req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {failureRedirect:'/login', successRedirect:'/'}));

router.get('/signup', function(req, res, next){
	res.render('signup');
});

router.post('/signup', function(req, res, next){
	console.log('got to post');
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	console.log(email);
	// find if user already exists by checking username and email
	// if already exists some error message
	// if not, add user to database and sign in
	User.findOne({email:email}, function(err, user){
		if(err){
			return res.send({message:"error please try again"});
		}
		if(user){
			return res.send({message:"email exists"});
		}
		User.findOne({username:username}, function(err, user){
			if(err){
				return res.send({message:"error please try again"});
			}
			if(user){
				return res.send({message:"username in use"});
			}
			var newUser = new User();
			newUser.email = email;
			newUser.password = newUser.generateHash(password);
			newUser.username = username;
			newUser.save(function(err){
				if(err){
					return res.send({message:"error please try again"});
				}
				else{
					return res.send({message:"check email for confirmation"});
				}
			});
			// User.create({username:username, email:email, password:password}, function(err, user){
			// 	if (err){
			// 		return res.send({message:"error please try again"});
			// 	}
			// 	if (user){
			// 		// res.redirect('/login');
			// 		return res.send({message:"check email for confirmation"});
			// 	}
			// });
		});
	});

	


});

router.get('/auth/google', passport.authenticate('google', {scope:['profile email']}));

router.get('/auth/google/callback', 
	passport.authenticate('google', {
		failureRedirect:'/login'
	}), function(req,res){
		res.redirect('/');

});

router.get('/book', isLoggedIn, function(req, res){
	res.render('book', {user:req.user});
});



function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


module.exports = router; 