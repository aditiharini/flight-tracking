var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); 
var Booking = require('./booking.js');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    bookings: [Booking.schema],
    google:{id:String, token:String, email:String, name:String}
});
// userSchema.plugin(passportLocalMongoose);
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};
var User = mongoose.model('User', userSchema);


module.exports = User;