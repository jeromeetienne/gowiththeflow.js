var Flow	= Flow	|| require('../lib/flow.js');

var timeoutId	= setTimeout(function(){
	console.assert(false, "this timer should never fire")
}, 5*1000)
var timestamps	= [];

console.log("Test Flow().seq()")
Flow()
	.seq(function(next, err, result){
		console.log("\tTest: step1: empty seq")
		console.assert(typeof err === 'undefined')
		console.assert(typeof result === 'undefined')
		timestamps[0]	= Date.now();
		next("error1", "result1");
	})
	.seq(function(next, err, result){
		console.log("\tTest: step2: seq with 1sec timeout")
		console.assert(err === 'error1')
		console.assert(result === 'result1')
		console.assert(Date.now() - timestamps[0] < 0.1*1000)
		timestamps[1]	= Date.now();
		setTimeout(function(){
			next("error2", "result2");		
		}, 1*1000)
	})
	.seq(function(next, err, result){
		console.log("\tTest: step3: seq with 0.5sec timeout")
		console.assert(err === "error2")
		console.assert(result === 'result2')
		console.assert(Date.now() - timestamps[1] < 1.1*1000)
		timestamps[2]	= Date.now();
		setTimeout(function(){
			next(null, "result3");		
		}, 0.5*1000)
	})
	.seq(function(next){
		console.log("\tTest: step4: most basic seq")
		console.assert(Date.now() - timestamps[2] < 0.6*1000)
		next();
	})
	.seq(function(next){
		console.log("\tTest: Success - no error")
		clearTimeout(timeoutId)
	});
