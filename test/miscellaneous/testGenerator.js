(function () {
    var fs = require('fs');
    var path = require('path');

    var readFile = function (dir) {
        return function (fn) {
            fs.readFile(dir, {encoding: 'utf8', flag: 'r'}, fn);
        };
    };

    //function *readFileGeneratorFunction(path, cb){
    //    console.log(yield readFile(path)(cb));
    //}
    //
    //var readFileIterator = readFileGeneratorFunction('testDate.js', callback);
    //function callback(err, data){
    //    readFileIterator.next(data);
    //}
    //readFileIterator.next();

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
        console.log('first');
        console.log(yield readFile('1.txt')(cb));
        console.log('second');
        console.log(yield readFile('2.txt')(cb));
    });





})();