String.prototype.contains = function(str){
    return this.indexOf(str) > -1;
};

module.exports.isWin = function(){
    return process.platform === 'win32';
};

