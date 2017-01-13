var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var phantom = require('phantomjs');
var Horseman  = require('node-horseman');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lufthansa', function(req, res, next){
	//bad url
	form_url = 'http://www.lufthansa.com/online/portal/lh/us/booking?l=en&cid=1000390';
	var horseman = new Horseman();
	horseman
		// .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36')
		.open('http://www.lufthansa.com/online/portal/lh/us/homepage')
		// .click('input[id="tripTypeRoundtrip"]')
		.type('input[name="originName1"]', 'Boston')
		.type('input[name="destinationName1"]', 'London Heathrow')
		.type('input[name="fmOutboundDateDisplay"]', '01/14/2017')
		.type('input[name="fmInboundDateDisplay"]', '01/21/2017')
		.select('select[name="adults"]', '1')
		// .select('select[name="children"]', '0')
		// .select('select[name="infants"]', '0')
		.select('select[name="cabin"]', 'E')
		// .select('select[name="airline"]', 'LH')
		// // .click('input[id="couponsequenceRegular"]')
		.click('button:contains("Search flights")')
		.screenshot('public/capture2.png')
		.waitForNextPage()
		.screenshot('public/capture3.png')
		.plainText()
		.then(function(text){
			console.log(text);
			horseman.close();
		});
		res.send('opened');


	// url = 'http://www.lufthansa.com/online/portal/lh/us/booking?';
	// form_url = 'http://www.lufthansa.com/online/portal/lh/us/booking?l=en&cid=1000390';
	// var response;
	// request.post(form_url, {form:{tripType:"R", originName1:"BOS", destinationName1:"LON", fmOutboundDateDisplay:'01/13/2017', fmInboundDateDisplay:'01/21/2017', adults:'1', children: '0', infants:'0', accessCode:'', cabin:'E'}}, function(error, form_response, html){
	// 	console.log(error);
	// 	// console.log(response);
	// 	response = form_response;
	// 	console.log(html);
	// 	res.send(html);
	// });


});

module.exports = router;
