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
                path: '/users/moye/home',
                route: 'home',
                folders:[
                    {
                        name: 'second',
                        path: '/users/moye/home/second',
                        route: 'home/second',
                        folders: [],
                        files: []
                    }
                ],
                files: []
            }
        ]
    };

    // neither have session nor have request
//    storageUtils.saveStorage(null, null, storage, function(err){
//        console.log('save completed');
//
//        storageUtils.getStorageRecord(null, null, function(err, record){
//            if(record)
//                console.log(JSON.stringify(record));
//
//            mongoUtils.disconnect();
//        });
//    });

    // add a folder to exist folder.
    storageUtils.addFolder(null, null, 'home/second', 'third', function(err){
        storageUtils.getStorageRecord(null, null, function(err, record){
            if(record)
                console.log(JSON.stringify(record));

            mongoUtils.disconnect();
        });
    });

})();