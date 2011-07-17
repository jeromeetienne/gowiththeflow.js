module.exports	= function(){ return new Flow(); }

var Flow	= module.exports = function(){
	this._stack	= [];
	this._timerId	= null;
}

Flow.prototype.seq	= function(callback)
{
	this._startTimer();
	this._stack.push(callback);
	
	return this;
}

Flow.prototype.par	= function(callback)
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


Flow.prototype._startTimer	= function()
{
	if( !this._timerId ){
		this._timerId	= setTimeout(this._next.bind(this), 0)
	}
}

Flow.prototype._next	= function(err, result){
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

