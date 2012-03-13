var Flow	= Flow	|| require('../gowiththeflow.js');

var dateJob1	= null;

console.log("Test Flow().par() single of it")

var callbackRun	= false;
Flow()
	.par(function(next){
		callbackRun	= true;	
		next();
	})
	
var timeoutId	= setTimeout(function(){
	if( !callbackRun )	console.log("\t ERROR. callback not called");
	else			console.log("\t OK")
}, 0.1*1000)

