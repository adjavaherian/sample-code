// async_series.js
// example of using reduce and promises and closure to create async results in series

var q = require('Q');
var results = [1, 2, 3, 4, 5];

function workCollection(arr) {

    return arr.reduce(function(promise, item, index) {
        return promise.delay(1000).then(function(result) {
            console.log('item', item, 'result', result, 'index', index);
            return true;
		});
    }, q(true));

}

	q()
		.then(function(){
			console.log('start');
            return results
		})
        .then(workCollection)
        .then(function(){
            console.log('done');
        }, function(err){
            console.error(err);
        });
