(function () {
    var shareUtils = require('../../modules/storage/shareUtils');

    var crypted = shareUtils.generateShareLinkSync('development', '12345678', 'folder', '/pictures');
    console.log('crypted: ', crypted);

    var decrypted = shareUtils.fromSharedLinkSync(crypted);
    console.log('decrypted:', decrypted);

    var nonCrypted = shareUtils.fromSharedLinkSync('cd1a72cfe60e883816334e57f76782ac4d5');
    console.log('non-crypted:', nonCrypted);

})();
