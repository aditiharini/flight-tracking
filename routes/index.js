var express = require('express');
var request = require('request'); 
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scrape', function(req, res, next) {

	request.post('http://www.britishairways.com/travel/home/public/en_gb', {
		form: {
		depCountry: 'United Kingdom',
		from: 'London', 
		journeyTypeRT: 'on', 
		to: 'Hyderabad',
		depDate: '12/01/17', 
		retDate: '1/01/17', 
		cabin: 'Economy', 
		restrictionType: 'Lowest price', 
		ad: '1', 
		ya: '0', 
		ch: '0', 
		inf: '0', 
		getFlights: 'Find Flights'
		}
	}, function (error, response, body){
		if (error) {
			console.log ("Submission failed"); 
		} else { 
			console.log(body); 
		}
		
	})
}); 

module.exports = router; 
