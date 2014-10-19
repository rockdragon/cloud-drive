(function () {
    var mongoUtils = require('../../modules/db/mongoUtils');

    mongoUtils.connect();

    var userType = 'development';
    var userId = '12345678';

    mongoUtils.saveUserStorage(userType, userId,
        {
            files: [
                {
                    name: '1.zip',
                    path: '/users/moye/1.zip',
                    size: '1.1M'
                }
            ],
            folders: [
                {
                    name: 'home',
                    path: '/users/moye/home'
                }
            ]
        },
        function (err) {
            if (!err) {
                mongoUtils.findUserStorage(userType, userId, function(err, storage){
                    console.log('result:\n', JSON.stringify(storage));
                    mongoUtils.disconnect();
                });
            } else {
                mongoUtils.disconnect();
            }
        });
})();