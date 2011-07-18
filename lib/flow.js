var Flow	= function(){
	var self, _timerId, _stack = [];
	return self = {
		seq	: function(callback, isPar){
			if(!_timerId)	_timerId = setTimeout(self._next.bind(self), 0)
			if(isPar){
				if(!_stack.length || !(_stack[_stack.length-1] instanceof Array)) _stack.push([]);
				_stack[_stack.length-1].push(callback);
			}else _stack.push(callback);
			return self;
		},par	: function(callback){ return self.seq(callback, true);	},
		_next	: function(err, result){
			var callback	= _stack.shift();
			if( !callback )	return;
			else if( typeof callback === 'function' ){
				callback(self._next.bind(this), err, result)		
			}else{
				var errors	= [], results	= [];
				var nbPending	= callback.length;
				callback.forEach(function(fct, index){
					fct(function(err, result){
						errors[index]	= err;
						results[index]	= result;				
						if( --nbPending == 0 )	self._next(errors, results)
					}, err, result)
				})
			}
		}
	}
};

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= Flow;
}