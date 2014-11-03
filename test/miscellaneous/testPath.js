(function () {
    var pathUtils = require('../../modules/upload/pathUtils');
    var path = require('path');
//    pathUtils.mkdirAbsoluteSync('D:\\files\\111');

    // String extension
    var utility = require('../../modules/other/utility');
//    console.log('hello'.startsWith('he'));
//
//    console.log('hello'.endsWith('he'));
//    console.log('hello'.endsWith('llo'));

    // Sync delete physical tree
    //pathUtils.deleteTreeSync('/Users/moye/files/1.html');

//    var basename = path.dirname('/Users/moye/files/1.html');
//    console.log(basename);

//    pathUtils.renameSync('f:\\npm-debug.log', 'npm-debug.1.log');

    var joinString = pathUtils.join('/path//', '//wot/', '1.jpg')
    console.log(joinString);
})();