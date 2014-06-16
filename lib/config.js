var confit = require('confit');
var caller = require('caller');
var path = require('path');
var handlers = require('shortstop-handlers');


function createHandlers(options) {
    var result;

    result = {
        file:    handlers.file(options.basedir),
        path:    handlers.path(options.basedir),
        base64:  handlers.base64(),
        env:     handlers.env(),
        require: handlers.require(options.basedir),
        exec:    handlers.exec(options.basedir),
        glob:    handlers.glob(options.basedir)
    };

    Object.keys(options.protocols || {}).forEach(function (protocol) {
        result[protocol] = options.protocols[protocol];
    });

    return result;
}


function noop(_, done) {
    done(null, _);
}

function chainFn(older, newbie) {
    return function(val, done) {
        older(val, function(err, val) {
            if (err) {
                return done(err, val);
            }

            newbie(val, function(err, val) {
                done(err, val);
            });
        });
    }
}

module.exports = function(options) {
    var basedir = options.basedir;

    options.protocols = createHandlers(options);
    options.basedir = path.dirname(__dirname);

    options.onconfig = chainFn(function(baseConf, done) {
        options.basedir = basedir;

        confit({
            basedir: path.join(options.basedir, 'config'),
            protocols: options.protocols
        }).create(function(err, config) {
            if (err) {
                done(err);
                return;
            }

            baseConf.merge(config);
            done(null, baseConf);
        });

    }, options.onconfig || noop);
};
