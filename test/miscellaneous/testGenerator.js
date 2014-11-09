(function () {
    var fs = require('fs');
    var path = require('path');

    var readFile = function (dir) {
        return function (fn) {
            fs.readFile(dir, {encoding: 'utf8', flag: 'r'}, fn);
        };
    };

    function run(generatorFunction) {
        var generatorItr = generatorFunction(callback);
        function callback(err, data) {
            if(err)
                console.log(err);
            generatorItr.next(data);
        }
        generatorItr.next();
    }

    run(function* rfGenFunc(cb) {
        console.log(yield readFile('testDate.js')(cb));

        console.log(yield readFile('testPath.js')(cb));

    });

})();