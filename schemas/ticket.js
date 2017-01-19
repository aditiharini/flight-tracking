var mongoose = require('mongoose');
var Booking = require('booking.js');

var ticketSchema = new Schema({
    price: Number,
    booking: Booking
}); 