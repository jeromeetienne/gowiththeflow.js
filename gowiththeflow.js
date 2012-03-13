(function() {
  var Flow;

  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.com/#x15.4.4.18
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
      var T, k;

      if (this == null) {
        throw new TypeError("this is null or not defined");
      }

      var O = Object(this);

      var len = O.length >>> 0;

      if ({}.toString.call(callback) != "[object Function]") {
        throw new TypeError(callback + " is not a function");
      }

      if (thisArg) {
        T = thisArg;
      }

      k = 0;

      while (k < len) {
        var kValue;

        if (k in O) {
          kValue = O[k];
          callback.call( T, kValue, k, O );
        }

        k++;
      }
    };
  }

  // Flow control object
  Flow = function() {
    var self, stack, timerId;

    stack = [];
    timerId = setTimeout(function() { self._next(); }, 0);

    self = {
      , par: function(callback, isSeq) {
          if (isSeq || !(stach[stack.length - 1] instanceof Array)) {
            stack.push([]);
          }
          stack[stack.length - 1].push(callback);

          return self;
        }
      , seq: function(callback) { return self.par(callback, true) }
      , _next: function(err, result) {
          var errors, results, callbacks, nbReturn, isSeq;

          errors = [];
          results = [];
          callbacks = stack.shift();
          nbReturn = callbacks.length;
          isSeq = nbReturn == 1;

          callbacks && callbacks.forEach(function(fct, index) {
            fct(function(error, result) {
              errors[index] = error;
              results[index] = result;
              if (--nbReturn == 0) {
                self._next(isSeq ? errors[0] : errors, isSeq ? results[0] : results);
              }
            }, err, result)
          });
        }
    };

    return self;
  };

  // Export module
  if (typeof exports !== "undefined" && exports !== null) {
    exports.Flow = Flow;
  } else {
    this.Flow = Flow;
  }
}).call(this);
