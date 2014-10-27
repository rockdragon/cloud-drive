if (typeof String.prototype.contains !== 'function') {
    String.prototype.contains = function (str) {
        return this.indexOf(str) > -1;
    };
}

if(typeof String.prototype.startsWith !== 'function'){
    String.prototype.startsWith = function(str) {
        return new RegExp('^' + str).test(this);
    };
}

if(typeof String.prototype.endsWith !== 'function'){
    String.prototype.endsWith = function(str) {
        return new RegExp(str + '$').test(this);
    };
}

module.exports.isWin = function(){
    return process.platform === 'win32';
};

