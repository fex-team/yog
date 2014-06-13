/**
 * fis.baidu.com
 */

var fs = require('fs');
var log = requrie('yog-log');

function ResourceApi(config_dir) {
    this.config_dir = config_dir;
    this.loaded = {};
    
    //public
    this.async = {};

    //public
    this.sync = {};

    this.maps = {};
    this.asyncDeleted = [];
}

ResourceApi.prototype = {
    register: function (ns) {
        var map_json = this.config_dir;
        if (ns == '__global__') {
            map_json += '/map.json';
        } else {
            map_json += '/' + ns + '-map.json';
        }

        if (fs.statSync(map_json).isFile()) {
            this.maps[ns] = JSON.parse(fs.readFileSync(map_json));
        } else {
            return false;
        }
        return true;

    },
    
    loadDeps: function (res, async) {
        var that = this;
        if (res['deps']) {
            res['deps'].forEach(function (id) {
                that.load(id, false);
            });
        }

        if (res['extras'] && res['extras']['async']) {
            res['extras']['async'].forEach(function (id) {
                that.load(id, true);
            });

        }
    },

    load: function(id, async) {
        var that = this;
        if (this.loaded[id] && !this.async[id]) {
            return this.loaded[id];
        } else {
            var ns = this.getNS(id);
            if (this.maps[ns] || this.register(ns)) {
                var map = this.maps[ns];
                var resInfo = map['res'][id];
                var uri = '';
                if (resInfo) {
                    var type = resInfo['type'];

                    if (resInfo['pkg']) {
                        var pkgInfo = map['pkg'][resInfo['pkg']];
                        uri = pkgInfo['uri'];

                        if (pkgInfo['has']) {
                            pkgInfo['has'].forEach(function (id) {
                                that.loaded[id] = uri;
                            });

                            pkgInfo['has'].forEach(function (id) {
                                that.loadDeps(map['res'][id], async);
                            });
                        }
                    } else {
                        uri = resInfo['uri'];
                        this.loaded[id] = uri;
                        this.loadDeps(resInfo, async);
                    }

                    if (!async) {
                        this.sync[type] = this.sync[type] || [];
                        this.sync[type].push(uri);
                    } else {
                        this.async[id] = resInfo;
                    }
                    return uri;
                }
            } else {
                log.warning('can\'t found ' + ns + '-map.json');
            }
        }
    },
    getUriInfo: function (id) {
        var ns = this.getNS(id);
        if (this.map[ns] || this.register(ns)) {
            return this.maps[ns][id];
        }
    },

    getUri: function (id) {
        var resInfo = this.getUriInfo(id);
        if (resInfo) {
            return resInfo['uri'];
        }
        return '';
    },

    getNS: function (id) {
        var p = id.indexOf(':');
        if (p != -1) {
            return id.substr(0, p);
        } else {
            return '__global__';
        }
    }
};

module.exports = function (options) {
    options = options || {};
    var config_dir = options['config_dir']
    return function (req, res, next) {
        res.fis = new ResourceApi(config_idr);
        next();
    };
};
