var Flow	= function(){
	var self, _timerId, _stack = [];
	return self = {
		par	: function(callback, isSeq){
			_timerId = _timerId || setTimeout(self._next.bind(self), 0)
			if(isSeq || !(_stack[_stack.length-1] instanceof Array)) _stack.push([]);
			_stack[_stack.length-1].push(callback);
			return self;
		},seq	: function(callback){ return self.par(callback, true);	},
		_next	: function(err, result){
			var errors = [], results = [], nbReturn = 0, callbacks = _stack.shift();
			callbacks && callbacks.forEach(function(fct, index){
				fct(function(error, result){
					errors[index]	= error;
					results[index]	= result;		
					if( ++nbReturn != callbacks.length )	return;
					callbacks.length > 1 ? self._next(errors, results) : self._next(errors[0], results[0])
				}, err, result)
			})
		}
	}
};

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= Flow;
}