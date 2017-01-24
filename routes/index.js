var express = require('express');
var request = require('request'); 
var router = express.Router();
var passport = require('passport'); 
var User = require('../schemas/user.js');
var Booking = require('../schemas/booking.js');
var Ticket = require('../schemas/ticket.js');
var flash = require('connect-flash');
var validator = require("validator");


/* GET home page. */
router.get('/', function(req, res, next) {
	if(isLoggedIn){
		console.log(req.user);
	}
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
	res.render('login', {messages:req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {failureRedirect:'/login', successRedirect:'/book'}));

router.get('/signup', function(req, res, next){
	res.render('signup');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('login');
});

router.post('/signup', function(req, res, next){
	console.log('got to post');
	var email = req.body.email;
	var password = req.body.password;
	console.log(email);
	if(!validator.isEmail(email)){
		return res.send({message:"not a valid email"});
	}
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
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.generateHash(password);
		newUser.save(function(err){
			if(err){
				console.log(err);
				return res.send({message:"error cannot save please try again"});
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

router.get('/auth/google', passport.authenticate('google', {scope:['profile email']}));

router.get('/auth/google/callback', 
	passport.authenticate('google', {
		failureRedirect:'/login'
	}), function(req,res){
		res.redirect('/book');

});

router.get('/book', isLoggedIn, function(req, res){
	res.render('book');
});

router.post('/book', function(req, res, next){
	var depLoc = req.body.fromLoc;
	var destLoc = req.body.toLoc;
	var depDate = req.body.depDate;
	var threshold = parseInt(req.body.threshold);
	console.log(threshold);
	var booking = {
		deploc:depLoc,
		destloc:destLoc,
		depDate:depDate,
		priceThreshold:threshold
	};
	console.log(booking.maxBatchNumber);
	Booking.create(booking,function(err, booking){
		if(err){
			return res.send({message:"error please try again"});
		}
		if(booking){
			console.log(req.user);
			console.log(booking);
			console.log(booking.maxBatchNumber);
			User.findOne({_id:req.user._id}, function(err, user){
				if(err){
					return res.send({message:"error please try again"});
				}
				if(user){
					user.bookings.push(booking);
					user.save(function(err, user){
						if(err){
							res.send({message:"error updating user"});
						}
						if(user){
							res.send({message:"success"});
						}

					});
				}
			});
		}

	});


});
router.get("/viewBookings", isLoggedIn, function(req, res, next){
	var results = {};

	
	User.findOne({_id:req.user._id}, function(err, user){
		if(err){
			console.log(err);
			return res.render('flights', {message:"sorry there was an error"});
		}
		if(user){
			console.log(user);
			var bookings = user.bookings;
			bookings.forEach(function(booking, index, array){
				console.log(booking);
				var result = Ticket.findOne({'booking._id':booking._id, batchNumber:booking.maxBatchNumber}).sort({price:1}).exec(function(err, ticket){
				    console.log('got here');
				    if(err){
				        console.log(err);
				        results.booking=error;
				    }
				    if(ticket){
				        console.log(ticket);
				        results.booking = ticket;

				    }
				    if(index==bookings.length-1){
				    	console.log(results);
				    	return res.render('flights', {results:JSON.stringify(results)});
				    }		

				});
			});
		}
		
	});
});



function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


module.exports = router; 