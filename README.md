# GoWithTheFlow.js - a javascript flow control micro library

GoWithTheFlow.js is a javascript asynchronous flow-control micro library which works **in
node.js and in browser**. It allow to control how your
asynchronous code is executed, sequentially or in parallel.
Flow() is only 30lines. 

# How to use it

Let start with a basic example. 2 jobs run in sequence. The first job is a timeout
so the result is delivered asynchronously, and a second job is run only *after* the
completion of the first.

    var Flow = require('gowiththeflow')
    Flow().seq(function(next){
        console.log("step 1: started, it will last 1sec");
        setTimeout(function(){
            console.log("step 1: 1sec expired. Step 1 completed");
            next();
        }, 1000);
    }).seq(function(next){
        console.log("step 2: run after step1 has been completed");
    })

It will display the following

    step 1: started, it will last 1sec
    step 1: 1sec expired. Step 1 completed
    step 2: run after step1 has been completed

# Methods

In order to keep it as simple as possible, Flow has only 2 methods.

## .seq(callback) to execute job sequentially

```.seq()``` is used to execute functions sequentially. The *callback* parameter
will be executed only after all previous jobs are completed. 
The callback signature is ```callback(next, error, result)```

* ```next(error, result)``` is the function to call when the job is completed. *error* is to notify an error
to the next job. *result* to notify a result. *error* and *result* may be omitted, if so they are considered
equal to ```undefined```

* ```error``` is the error send by previous jobs

* ```result``` is the result send by previous jobs

for example

    Flow().seq(function(next){
        console.log("first job");
        next();
    }).seq(function(next){    
        console.log("second job. run *after* first job");
        next();
    })


## .par(callback) to execute job in parallel

```.par()``` is used to execute functions in parallel. The *callback* parameter is the same as for ```.seq()```.
If multiple .par() are declared one after another, they are run in parallel. The first ```.seq()``` after them
will receive all the *error* and *result* in Array. One array item per previous ```.par()```

for example

    Flow().par(function(next){
        console.log("job foo");
        next(null, "foo");
    }).par(function(next){
        console.log("job bar");
        next(null, "bar");
    }).seq(function(next, errors, results){
        console.log("job run *after* the completion of foo and bar");
        console.assert(errors.length == 2 && errors[0] === null && errors[1] == null)
        console.assert(results.length == 2 && results[0] === 'foo' && results[1] == 'bar')
        next();
    })

That's it

# Conclusion

GoWithTheFlow.js is available on github <a href='https://github.com/jeromeetienne/gowiththeflow.js'>here</a>
under <a href='https://github.com/jeromeetienne/gowiththeflow.js/blob/master/MIT-LICENSE.txt'>MIT license</a>.
If you hit bugs, fill issues on github.
Feel free to fork, modify and have fun with it :)
