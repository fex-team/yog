var kraken = require('kraken-js');
var config = require('./lib/config');
var path = require('path');
var caller = require('caller');

module.exports = function (options) {
    var app;

    options = options || {};

    options.basedir = options.basedir || path.dirname(caller());

    options.onconfig = options.onconfig || function(conf, done) {
        var engines = conf.get('view engines');

        Object.keys(engines).forEach(function(ext) {
            engines[ext].renderer.arguments.push(app);
        });

        done( null, conf);
    };

    // 插入 config 读取，让整体 config 的读取顺序如下：
    // - kranken-js/config/
    // - yog/config/
    // - app/config/
    config(options);

    app = kraken(options);

    return app;
};