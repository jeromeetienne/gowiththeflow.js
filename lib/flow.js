var Seq	= function(){
	this._stack	= [];
	this._timerId	= null;
}

Seq.prototype.seq_	= function(callback)
{
	this._startTimer();
	this._stack.push(callback);
	
	return this;
}

Seq.prototype.par_	= function(callback)
{
	this._startTimer();
	var inPar	= false;
	if( this._stack.length && this._stack[this._stack.length-1] instanceof Array ){
		inPar	= true;
	}
	if( !inPar )	this._stack.push([]);	

	this._stack[this._stack.length-1].push(callback);
	
	return this;
}


Seq.prototype._startTimer	= function()
{
	if( !this._timerId ){
		this._timerId	= setTimeout(this._next.bind(this), 0)
	}
}

Seq.prototype._next	= function(err, result){
	console.log("timedout");
	var callback	= this._stack.shift();
	if( !callback )	return;

	if( typeof callback === 'function' ){
		callback(this._next.bind(this), err, result)		
	}else{
		var errors	= [];
		var results	= [];
		var nbPending	= callback.length;
		callback.forEach(function(fct, index){
			fct(function(err, result){
				errors[index]	= err;
				results[index]	= result;
				
				if( --nbPending == 0 )	this._next(errors, results)
				console.log("par is notified ", index+"-th")
			}.bind(this), err, result)
		}.bind(this))
	}
}



var seq	= new Seq();

if( true ){
	seq
		.seq_(function(next, err, result){
			console.log("step0", err, '|', result);
			next(null, "step0 result");
		})
		.seq_(function(next, err, result){
			setTimeout(function(){
				console.log("step1", err, '|', result);
				next(null, "step1 result");		
			}, 1*1000)
		})
		.seq_(function(next, err, result){
			setTimeout(function(){
				console.log("step2", err, '|', result);
				next(null, "step2 result");		
			}, 0.5*1000)
		});	
}else{
	seq
		.seq_(function(next){
			console.log("step0")
			next()
		})
		.par_(function(next){
			setTimeout(function(){
				console.log("step1");
				next(null, "ss");		
			}, 1*1000)
		})
		.par_(function(next){
			setTimeout(function(){
				console.log("step2");
				next();		
			}, 0.5*1000)
		})	
		.par_(function(next){
			setTimeout(function(){
				console.log("step3");
				next("rr");		
			}, 0.8*1000)
		})
		.seq_(function(next, err, result){
			console.log("last step", err, '|', result);
			next();
		});
	console.log(seq._stack)
}

