var util = require('util');
var Nightmare = require('nightmare');
var nightmare = Nightmare({
  executionTimeout: 10000, // in ms
  loadTimeout: 10000,
  // show: true
});
 
flightSearchOneWay("ORD", "PHX", "2017-02-15");
 
function flightSearch(fromAirport, toAirport, departDate, returnDate) {
  var url = util.format("https://www.kayak.com/flights/%s-%s/%s/%s", fromAirport, toAirport, departDate, returnDate);
 
}
 
function flightSearchOneWay(fromAirport, toAirport, departDate) {
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
        console.log("returned data:" + JSON.stringify(data));
        done();
      });
    }
  console.log("test lol");