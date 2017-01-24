var cron = require('node-cron');
cron.schedule('* * * * *', function(){
	console.log("testing");

}, true);