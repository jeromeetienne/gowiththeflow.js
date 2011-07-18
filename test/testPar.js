var Flow	= Flow	|| require('../lib/flow.js');

var timeoutId	= setTimeout(function(){
	console.assert(false, "this timer should never fire")
}, 5*1000)

var dateJob1	= null;

console.log("Test Flow().par()")
Flow()
	.par(function(next){
		console.log("\tTest: job1 started (will last 1-seq)")
		dateJob1	= Date.now();
		setTimeout(function(){
			console.log("\tTest: job1 completed")
			console.assert(Date.now() - dateJob1 < (1.0+0.1)*1000)
			next("error1", "result1");
		}, 1*1000)
	})
	.par(function(next){
		console.log("\tTest: job2 started (will last 0.5-seq)")
		dateJob2	= Date.now();
		setTimeout(function(){
			console.log("\tTest: job2 completed")
			console.assert(Date.now() - dateJob1 < (0.5+0.1)*1000)
			next(null, "result2");
		}, 0.5*1000)
	})	
	.par(function(next){
		console.log("\tTest: job3 started (will last 0.8-seq)")
		dateJob3	= Date.now();
		setTimeout(function(){
			console.log("\tTest: job3 completed")
			console.assert(Date.now() - dateJob3 < (0.8+0.1)*1000)
			next("error3", null);		
		}, 0.8*1000)
	})
	.seq(function(next, err, result){
		console.log("\tTest: all jobs completed. check .par() err/result in Array")
		console.assert(err instanceof Array)
		console.assert(err[0] === 'error1')
		console.assert(err[1] === null)
		console.assert(err[2] === 'error3')
		console.assert(result instanceof Array)
		console.assert(result[0] === 'result1')
		console.assert(result[1] === 'result2')
		console.assert(result[2] === null)
		next();
	})
	.seq(function(next){
		console.log("\tTest: Success - no error")
		clearTimeout(timeoutId)
	});	
