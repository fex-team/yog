var api = require('api-client');
var debug = require('yog-debug')('user');
var log = require('yog-logging');

module.export = function () {
    function get(id, cb) {
        api.getUser(id, function (err, r) {
            if (err) {
                log.error(err);
            }
            cb(r);
        });
    }

    function del(id, cb) {
        api.delUser(id, function (err, r) {
            if (err) {
                log.error(err);
            }
            cb(r);
        });
    }

    return {
        get: get,
        del: del
    }
};