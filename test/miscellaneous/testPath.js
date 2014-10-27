(function () {
    var pathUtils = require('../../modules/upload/pathUtils');
    pathUtils.mkdirAbsoluteSync('D:\\files\\111');

    var utility = require('../../modules/other/utility');

    console.log('hello'.startsWith('he'));

    console.log('hello'.endsWith('he'));
    console.log('hello'.endsWith('llo'));

})();