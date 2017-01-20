var mongoose = require('mongoose');
var Booking = require('./booking.js');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    price: Number,
    booking: Booking.schema
}); 