var Flow	= Flow	|| require('../gowiththeflow.js');

console.log("Test Flow().Destroy()")


var callbackRun	= false;
var myflow	= Flow().seq(function(){
	callbackRun	= true;	
});
myflow.destroy();

var timeoutId	= setTimeout(function(){
	if( callbackRun )	console.log("\t ERROR. callback called");
	else			console.log("\t OK")
}, 0.1*1000)
