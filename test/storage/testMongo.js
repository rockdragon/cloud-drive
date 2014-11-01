(function () {
    var mongoUtils = require('../../modules/storage/mongoUtils');

    var userType = 'development';
    var userId = '12345678';

    mongoUtils.saveUserStorage(userType, userId,
        {
            files: [
                {
                    name: '1.zip',
                    path: '/users/moye/1.zip',
                    size: '1.1M',
                    lastModified: '2014-10-14T10:08:00',
                    type: 'file'
                }
            ],
            folders: [
                {
                    name: 'home',
                    path: '/users/moye/home',
                    type: 'folder'
                }
            ]
        },
        function (err) {
            if (!err) {
                mongoUtils.findUserStorage(userType, userId, function(err, record){
                    console.log('result:\n', JSON.stringify(record));

                    record.storage.files.splice(0, 1);

                    mongoUtils.updateUserStorage(record, function(err){
                        mongoUtils.findUserStorage(userType, userId, function(err, record2) {
                            console.log('result:\n', JSON.stringify(record2));

                            mongoUtils.disconnect();
                        });
                    });

                });
            } else {
            }
        });
})();