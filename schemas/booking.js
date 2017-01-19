var mongoose = require('mongoose');
var bookingSchema = new Schema({
    airline: String,
    price: Number,
    depDate: String,
    retDate: String, 
    deploc: String, 
    destloc: String,
    cabin: String,
    numAdulttickets: Number,
    numInfanttickets: Number,
    numYoungAdulttickets: Number,
    numChildrentickets: Number,
    numStops: Number,
    isActive: Boolean
});

var Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;