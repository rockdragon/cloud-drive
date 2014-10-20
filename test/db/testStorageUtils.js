(function () {
    var storageUtils = require('../../modules/db/storageUtils');
    var mongoUtils = require('../../modules/db/mongoUtils');

    var storage = {
        files: [
            {
                name: '1.zip',
                path: '/users/moye/1.zip',
                size: '1.1M'
            },
            {
                name: '2.zip',
                path: '/users/moye/2.zip',
                size: '2.1M'
            }
        ],
        folders: [
            {
                name: 'home',
                path: '/users/moye/home'
            }
        ]
    };

    // neither have session nor have request
    storageUtils.saveStorage(null, null, storage, function(err){
        console.log('save completed');

        storageUtils.getStorageRecord(null, null, function(err, record){
            if(record)
                console.log(JSON.stringify(record));

            mongoUtils.disconnect();
        });
    });

})();