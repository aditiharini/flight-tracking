var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
    priceThreshold:Number,
    maxBatchNumber: {type:Number, default:0}
});

// bookingSchema.methods.findMinPrice = function(callback){
//     // should use same code used in router
//     return Ticket.findOne({'booking._id':this.ObjectId}).sort({price:1}).exec(callback);

// };

var Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;