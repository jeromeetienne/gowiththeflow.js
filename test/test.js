var Flow	= require('../lib/flow.js');

if( false ){
	Flow()
		.seq(function(next, err, result){
			console.log("step0", err, '|', result);
			next(null, "step0 result");
		})
		.seq(function(next, err, result){
			setTimeout(function(){
				console.log("step1", err, '|', result);
				next(null, "step1 result");		
			}, 1*1000)
		})
		.seq(function(next, err, result){
			setTimeout(function(){
				console.log("step2", err, '|', result);
				next(null, "step2 result");		
			}, 0.5*1000)
		});	
}else{
	Flow()
		.seq(function(next){
			console.log("step0 sequential")
			next()
		})
		.par(function(next){
			setTimeout(function(){
				console.log("step1");
				next(null, "ss");		
			}, 1*1000)
		})
		.par(function(next){
			setTimeout(function(){
				console.log("step2");
				next();		
			}, 0.5*1000)
		})	
		.par(function(next){
			setTimeout(function(){
				console.log("step3");
				next("rr");		
			}, 0.8*1000)
		})
		.seq(function(next, err, result){
			console.log("last step", err, '|', result);
			next();
		});
}

