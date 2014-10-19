var mongoose = require('mongoose');

var userStorageModel = mongoose.model('userStorage', mongoose.Schema({
    userType: String,
    userId: String,
    storage: {
        folders: Array,
        files: Array
    }
}));

module.exports.connect = function () {
    mongoose.connect('mongodb://localhost/cloud-drive');
};
module.exports.disconnect = function () {
    mongoose.disconnect();
};

module.exports.saveUserStorage = function(userType, userId, storage, callback){
    var record = new userStorageModel({userType: userType, userId: userId, storage: storage});
    record.save(function(err){
        if(err)
            console.log('saving user files error: ' + err);

        if (callback)
            callback(err);
    });
};

module.exports.findUserStorage = function (userType, userId, callback) {
    userStorageModel.findOne({userType: userType, userId: userId}, function (err, storage) {
        if(err)
            console.log('finding user files error: ' + err);

        if (callback)
            callback(err, storage);
    });
};


