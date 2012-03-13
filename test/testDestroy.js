var Flow	= Flow	|| require('../gowiththeflow.js');

var callbackRun	= false;
var myflow	= Flow().seq(function(){
	callbackRun	= true;	
});
myflow.destroy();

var timeoutId	= setTimeout(function(){
	if( callbackRun )	console.log("ERROR. .destroy() didnt work");
	else			console.log("OK .destroy() works as expected")
}, 0.1*1000)
