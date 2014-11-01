(function () {
    var pathUtils = require('../../modules/upload/pathUtils');
//    pathUtils.mkdirAbsoluteSync('D:\\files\\111');

    // String extension
    var utility = require('../../modules/other/utility');
    console.log('hello'.startsWith('he'));

    console.log('hello'.endsWith('he'));
    console.log('hello'.endsWith('llo'));

    // Sync delete physical tree
    pathUtils.deleteTreeSync('/Users/moye/files/1.html');

})();