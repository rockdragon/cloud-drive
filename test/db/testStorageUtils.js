(function () {
    var storageUtils = require('../../modules/db/storageUtils');
    var mongoUtils = require('../../modules/db/mongoUtils');

    //mock up
    var storage = {
        name: 'root',
        path: '/users/moye/',
        route: '/',
        files: [
            {
                name: '1.zip',
                path: '/users/moye/1.zip',
                size: '1.1M',
                mime: { t: 'Archive', i: 's_web_page_white_compressed_32'},
                modified: '2011/04/25 11:20 AM'
            },
            {
                name: '2.zip',
                path: '/users/moye/2.zip',
                size: '2.1M',
                mime: { t: 'Archive', i: 's_web_page_white_compressed_32'},
                modified: '2011/04/25 10:00 PM'
            }
        ],
        folders: [
            {
                name: 'home',
                path: '/users/moye/home',
                route: 'home',
                folders: [
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
    storageUtils.saveStorage(null, null, storage, function (err) {
        console.log('save completed');

        storageUtils.getStorageRecord(null, null, function (err, record) {
            if (record)
                console.log(JSON.stringify(record));

            mongoUtils.disconnect();
        });
    });

    // add a folder to exist folder.
//    storageUtils.addFolder(null, null, 'home/second', 'third', function(err){
//        storageUtils.getStorageRecord(null, null, function(err, record){
//            if(record)
//                console.log(JSON.stringify(record));
//
//            mongoUtils.disconnect();
//        });
//    });

})();