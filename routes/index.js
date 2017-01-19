var express = require('express');
var request = require('request'); 
var router = express.Router();
var passport = require('passport'); 
var localStrategy = require('passport-local').Strategy; 
var bodyparser = require("body-parser")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next){
	res.render('login.hbs');
});

router.post('/login', function(req, res, next){
	
});


module.exports = router; 
