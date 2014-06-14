var kraken = require('kraken-js');
var bootstrap = require('./lib/bootstrap.js');

module.exports = function (options) {

    options = options || {};

    options.basedir = options.basedir || __dirname;

    var app = kraken(options);
    
    app.on('mount', function (parent) {
        //bootstrap
        bootstrap(parent, options);
    });

    return app;
};