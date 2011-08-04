var Flow	= function(){
	var self, _stack = [], _timerId = setTimeout(function(){ self._next(); }, 0);
	return self = {
		par	: function(callback, isSeq){
			if(isSeq || !(_stack[_stack.length-1] instanceof Array)) _stack.push([]);
			_stack[_stack.length-1].push(callback);
			return self;
		},seq	: function(callback){ return self.par(callback, true);	},
		_next	: function(err, result){
			var errors = [], results = [], callbacks = _stack.shift(), nbReturn = callbacks.length, isSeq = nbReturn == 1;
			callbacks && callbacks.forEach(function(fct, index){
				fct(function(error, result){
					errors[index]	= error;
					results[index]	= result;		
					if(--nbReturn == 0)	self._next(isSeq?errors[0]:errors, isSeq?results[0]:results)
				}, err, result)
			})
		}
	}
};

// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports	= Flow;
}