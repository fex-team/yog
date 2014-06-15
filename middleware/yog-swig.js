var swig = require('yog-swig');
var log = require('yog-log');

module.exports = function (options) {
    return function (req, res, next) {
        res.render = function (path, obj) {
            res.end(swig(res, options).renderFile(options['viewdir'] + '/' + path, obj));
        };
        next();
    };
};