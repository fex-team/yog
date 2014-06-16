var kraken = require('kraken-js');
var config = require('./lib/config');
var path = require('path');
var caller = require('caller');

module.exports = function (options) {

    options = options || {};

    options.basedir = options.basedir || path.dirname(caller());

    // 插入 config 读取，让整体 config 的读取顺序如下：
    // - kranken-js/config/
    // - yog/config/
    // - app/config/
    if (__dirname !== options.basedir) {
        config(options);
    }

    var app = kraken(options);

    return app;
};