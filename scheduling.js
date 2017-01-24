var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/flightTracking');
var cron = require('node-cron');
var Ticket = require('./schemas/ticket.js');
var Booking = require('./schemas/booking.js');
var User = require('./schemas/user.js');
//'0 */6 * * *'
var util = require('util');
var Nightmare = require('nightmare');
var mailer = require('nodemailer');
var smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	auth: {
		user: 'book.your.flight.today@gmail.com',
		pass: 'penthouseplants'
	}
};
var transporter = mailer.createTransport(smtpConfig);




 
function flightSearch(fromAirport, toAirport, departDate, returnDate) {
  var url = util.format("https://www.kayak.com/flights/%s-%s/%s/%s", fromAirport, toAirport, departDate, returnDate);
 
}
 
function flightSearchOneWay(fromAirport, toAirport, departDate, booking, user) {
  var nightmare = Nightmare({
  executionTimeout: 20000, // in ms
  loadTimeout: 20000,
  // show: true
	});
  var url = util.format("https://www.kayak.com/flights/%s-%s/%s", fromAirport, toAirport, departDate);
  console.log(url);
  //ex: https://www.kayak.com/flights/DEN-PHX/2017-02-15
  nightmare
      .goto(url)
      .wait('.Flights-Results-FlightResultItem')
      .evaluate(function () {
        console.log("debug");
        var resultItems = document.querySelectorAll(".Flights-Results-FlightResultItem");
       
        var parsed = [];
        resultItems.forEach(function(item) {
            var price = item.querySelector(".price").innerHTML.replace(/^\s+|\s+$/g, '');
            var airline = item.querySelector(".airlineNames").innerHTML.replace(/<\/?[^>]+(>|$)/g, "").replace(/^\s+|\s+$/g, '');
            var flightElements = item.querySelectorAll(".flight");
           
            var bookingLink = item.querySelector(".bookingLink").querySelector("a").getAttribute("href");
           
            var flights = [];
            flightElements.forEach(function(flightElem) {
                var takeoff = flightElem.querySelector(".takeoff").innerHTML;
                var landing = flightElem.querySelector(".land").innerHTML;
                var duration = flightElem.querySelector(".duration").innerHTML;
                var flight = {
                    "takeoff": takeoff,
                    "landing": landing,
                    "duration": duration
                };
                flights.push(flight);
            });
           
            var resultItem = {
                "price": price,
                "airline": airline,
                "flights": flights,
                "bookingLink": bookingLink
            };
            parsed.push(resultItem);
        });
        return parsed;
      })
      .end()
      .then(function(data) {
      	createTickets(data, booking, user);
        // console.log("returned data:" + JSON.stringify(data));
        done();
      }).catch(function(err){
      		console.log(err);
      });
    
  }

// cron.schedule('* * * * *', function(){
function createTickets(parsedData, booking, user){
	console.log("got to create tickets");
	parsedData.forEach(function(result, index){
		//NaN checks if it's not a number so !NaN checks if it is a number
		console.log(result.price);
		console.log(index);
		if(result.price.charAt(0)=='$'){
		var ticketInfo = {
			price:parseInt(result.price.substring(1)),
			booking:booking,
			url:result.bookingLink,
			airline:result.airline,
			takeoffTime: result.flights[0].takeoff,
			landingTime:result.flights[0].landing,
			duration:result.flights[0].duration,
			batchNumber: booking.maxBatchNumber
		};
		Ticket.create(ticketInfo,function(err, ticket){
			if(index==parsedData.length-1){
				console.log("got to email update");
				sendEmailUpdate(user, booking);
			}
			if(err){
				console.log(err);
				return;
			}
			if(ticket){
				// console.log(ticket);
				return ticket;
			}

			// ideally need to handle this with a callback


		});
	
	}


	});

	console.log("got to end of create tickets");
}

var sendEmailUpdate = function sendEmailUpdate(user, booking){
	Ticket.findOne({'booking._id': booking._id, batchNumber:booking.maxBatchNumber}).sort({price:1}).exec(function(err, ticket){
		if(ticket.price<booking.priceThreshold){
			var email = user.email;
			console.log(email);
			console.log("need to send update");
			console.log(ticket.price);
			var url = 'kayal.com' + ticket.url;
			var mail = {
				from: '"Book It!" <book.your.flight.today@gmail.com>',
				to: email,
				subject:'Ticket Price Below Threshold',
				text: 'kayak.com' + ticket.url,
				// html:'<a href =' + url + '> Book your tickets here </a>'

			};
			transporter.sendMail(mail, function(err, info){
				if(err){
					console.log(err);
					return;
				}
				console.log(info.response);

			});

		}

	});

};


var updateTickets = function updateTickets(){
	User.find({},function(err, users){
			if(err){
				console.log(err);
				return;
			}
			if(users){
				console.log(users);
				users.forEach(function(user){
					console.log(JSON.stringify(user));
					var bookings = user.bookings;
					console.log(bookings);
					if (bookings!==undefined && bookings.length>0){
						bookings.forEach(function(booking, index){
							Booking.findOne({_id:booking._id}, function(err, booking){
								if(err){
									console.log(err);
								}
								if(booking){
									booking.maxBatchNumber+=1;
									booking.save(function(err, newBooking){
										if(err){
											console.log(err);
										}
										if (newBooking){
											console.log("got to new booking");
											console.log(newBooking);
											flightSearchOneWay(newBooking.deploc, newBooking.destloc, newBooking.depDate, newBooking, user);

										}

									});
								}
							});
						});
						console.log("got to end of update");
						return;
					}

				});

			}

		});
};

updateTickets();

module.exports.updateTickets = updateTickets;