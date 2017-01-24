var Nightmare = require('nightmare');
var nightmare = Nightmare({
  executionTimeout: 20000, // in ms
  loadTimeout: 20000,
  // show: true
	});
nightmare
	.goto('google.com')
	.catch(function(err){
		console.log("there was some error");
	});