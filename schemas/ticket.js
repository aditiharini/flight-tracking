var mongoose = require('mongoose');
var Booking = require('./booking.js');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    price: Number,
    booking: Booking.schema,
    url: String,
    airline: String,
    takeoffTime:String,
    landingTime:String,
    duration:String,
    batchNumber:Number

});


var Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;