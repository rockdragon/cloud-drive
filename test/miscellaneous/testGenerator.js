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

    var slice = Array.prototype.slice;

    function run(generatorFunction) {
        try {
            var generatorItr = generatorFunction(callback);
            function callback(err, res) {
                if(err)
                    generatorItr.throw(err);
                else {
                    var args = slice.call(arguments, 1);
                    res = args.length > 1 ? args : res;
                    generatorItr.next(res);
                }
            }
            generatorItr.next();
        }
        catch (e){
            console.log(e.message | "I'm died.");
        }
    }

    run(function* rfGenFunc(cb) {
        console.log('first');
        console.log(yield readFile('1.txt')(cb));
        console.log('second');
        console.log(yield readFile('2.txt')(cb));
    });





})();