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

var mail = {
	from: 'book.your.flight.today@gmail.com',
	to:'aditiharini@gmail.com',
	subject:'hello',
	text:'Hello'
};
transporter.sendMail(mail, function(err, info){
	if(err){
		console.log(err);
		return;
	}
	console.log(info.response);


});