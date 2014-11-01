var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cloud-drive');
mongoose.connection.on('error', function (err) {
    console.log('Mongo connection occurs error: ' + err);
});

/*
    only for test-case caller
 */
module.exports.disconnect = function(){
  mongoose.disconnect();
};

var userStorageModel = mongoose.model('userStorage', mongoose.Schema({
    userType: String,
    userId: String,
    storage: {
        name: String,
        path: String,
        route: String,
        folders: Array,
        files: Array
    }
}));

module.exports.saveUserStorage = function(userType, userId, storage, callback){
    var record = new userStorageModel({userType: userType, userId: userId, storage: storage});
    record.save(function(err){
        if(err)
            console.log('saving user files error: ' + err);

        if (callback)
            callback(err);
    });
};

module.exports.updateUserStorage = function(record, callback){
    record.save(function(err){
        if(err)
            console.log('updating user files error: ' + err);

        if (callback)
            callback(err);
    });
};

module.exports.findUserStorage = function (userType, userId, callback) {
    userStorageModel.findOne({userType: userType, userId: userId}, function (err, record) {
        if(err)
            console.log('finding user files error: ' + err);

        if (callback)
            callback(err, record);
    });
};


