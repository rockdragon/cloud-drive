(function () {
    var storageUtils = require('../../modules/storage/storageUtils');
    var mongoUtils = require('../../modules/storage/mongoUtils');

    //mock up
    var record = {
        "userType" : "development",
        "userId" : "12345678",
        "storage" : {
            "folders" : [
                {
                    "files" : [
                        {
                            "name" : "Yosemite.jpg",
                            "path" : "/Users/moye/files/development/12345678/pictures/Yosemite.jpg",
                            "size" : 1804800,
                            "mime" : {
                                "t" : "Picture",
                                "i" : "s_web_page_white_picture_32"
                            },
                            "modified" : "10/27/2014 8:55 PM"
                        }
                    ],
                    "folders" : [
                        {
                            "files" : [],
                            "folders" : [],
                            "route" : "/pictures/jpgs",
                            "path" : "/Users/moye/files/development/12345678/pictures/jpgs",
                            "name" : "jpgs"
                        }
                    ],
                    "route" : "/pictures",
                    "path" : "/Users/moye/files/development/12345678/pictures",
                    "name" : "pictures"
                }
            ],
            "files" : [{
                "name" : "1.jpg",
                "path" : "/Users/moye/files/development/12345678/1.jpg",
                "size" : 1804800,
                "mime" : {
                    "t" : "Picture",
                    "i" : "s_web_page_white_picture_32"
                },
                "modified" : "10/27/2014 8:55 PM"
            }],
            "route" : "/",
            "path" : "/Users/moye/files/development/12345678",
            "name" : "root"
        }
    };

    // neither have session nor have request
//    storageUtils.saveStorage(null, null, storage, function (err) {
//        console.log('save completed');
//
//        storageUtils.getStorageRecord(null, null, function (err, record) {
//            if (record)
//                console.log(JSON.stringify(record));
//
//            mongoUtils.disconnect();
//        });
//    });

    // add a folder to exist folder.
//    storageUtils.addFolder(null, null, 'home/second', 'third', function(err){
//        storageUtils.getStorageRecord(null, null, function(err, record){
//            if(record)
//                console.log(JSON.stringify(record));
//
//            mongoUtils.disconnect();
//        });
//    });

    // find files
    var file = storageUtils.findFile(record.storage, '/pictures/Yosemite.jpg');
    console.log('file:', file);

    var file2 = storageUtils.findFile(record.storage, '/1.jpg');
    console.log('file:', file2);

    mongoUtils.disconnect();
})();