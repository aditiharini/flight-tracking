var mongoose = require('mongoose');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); 
var Booking = require('booking.js');
mongoose.connect('mongodb://localhost/')


var userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    bookings: [Booking]
});

var User = mongoose.model('User', userSchema);

module.exports = User;