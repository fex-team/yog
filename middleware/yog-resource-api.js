/**
 * fis.baidu.com
 */

var fs = require('fs');
var log = require('yog-log');

function ResourceApi(config_dir) {
    this.config_dir = config_dir;
    this.loaded = {};

    //public
    // include all async files
    this.async = {};
    // include all sync files
    this.sync = {};
    //mark `mod.js`, mod.js ahead everything.
    this.framework = '';

    //collect all inner script
    this.scripts = [];

    //collect all inner style
    this.styles = [];

    this.maps = {};
    this.asyncDeleted = [];

    this.CSS_HOOK = '<!--FIS_CSS_HOOK-->';
    this.JS_HOOK = '<!--FIS_JS_HOOK-->';
}

ResourceApi.prototype = {
    /**
     * collect all inner js.
     * @param script  the code between <script> and </script>.
     */
    addScript: function (script) {
        this.scripts.push(script);
    },

    /**
     * collect all inner css
     * @param style  the code between <style> and </style>
     */
    addStyle: function (style) {
        this.styles.push(style);
    },

    /**
     * register a `map.json`
     * @param ns  namespace
     * @returns {boolean}
     */
    register: function (ns) {
        var map_json = this.config_dir;
        if (ns == '__global__') {
            map_json += '/map.json';
        } else {
            map_json += '/' + ns + '-map.json';
        }

        var stat;
        try {
            stat = fs.statSync(map_json);
        } catch(e) {
            log.error(e);
            return false;
        }

        if (stat && stat.isFile()) {
            try {
                this.maps[ns] = JSON.parse(fs.readFileSync(map_json));
            } catch (e) {
                log.error(e);
                return false;
            }
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
        //@TODO
        if (!id) return '';

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

                    //only the javascript file maybe is a async file.
                    if (!async || type == 'css') {
                        this.sync[type] = this.sync[type] || [];
                        this.sync[type].push(uri);
                    } else {
                        this.async[id] = resInfo;
                    }

                    return uri;
                } else {
                    log.warning('not found resource, resource `id` = ' + id);
                }
            } else {
                log.warning('can\'t found `' + ns + '-map.json`');
            }
        }
    },

    getResInfo: function (id) {
        var ns = this.getNS(id);
        var info;

        if (this.maps[ns] || this.register(ns)) {
            info = this.maps[ns]['res'][id];
            if (info['pkg']) {
                info = this.maps[ns]['pkg'][info['pkg']];
            }
        }

        return info;
    },

    getUri: function (id) {
        //@TODO
        if (!id) return '';

        var resInfo = this.getResInfo(id);
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
    },

    getResourceMap: function () {
        var id;
        var rMap;
        var pkg = {};

        for (id in this.async) {
            var res = this.async[id];

            if (res['type'] != 'js') {
                continue;
            }
            rMap = rMap || {};
            rMap['res'] = rMap['res'] || {};
            rMap['pkg'] = rMap['pkg'] || {};

            rMap['res'][id] = {
                'url': res['uri'],
                'deps': res['deps'] || [],
            }

            if (res['pkg']) {
                rMap['res'][id]['pkg'] = res['pkg'];
            }

            if (this.async[id]['pkg']) {
                pkg = this.getResInfo(id);
                rMap['pkg'][this.async[id]['pkg']] = {
                    'url': pkg['uri']
                }
            }
        }
        return rMap;
    },

    render: function (html) {
        var js = '';
        var css = '';
        var p;
        var loadModjs = (this.sync['js'] || this.getResourceMap()) && this.framework;
        if (loadModjs) {
            //if need `mod.js`, keep it first.
            js += '<script src="' + this.framework + '"></script>';
            if (this.getResourceMap()) {
                js += '<script>require.resourceMap(' + JSON.stringify(this.getResourceMap()) + ');</script>';
            }
        }

        if (this.sync['js']) {
            if ((p = this.sync['js'].indexOf(this.framework)) != -1) {
                this.sync['js'].splice(p, 1); //remove `mod.js`
            }

            js += '<script src="' + this.sync['js'].join('"></script>\n<script src="') + '"></script>';
        }

        if (this.scripts.length > 0) {
            js += '\n<script type="text/javascript">\n!function() {' + this.scripts.join('}();\n!function() {') + '}();</script>\n';
        }

        html = html.replace(this.JS_HOOK, js)


        if (this.sync['css']) {
            css += '<link rel="stylesheet" href="' + this.sync['css'].join('" />\n<link rel="stylesheet" href="') + '" />';
        }

        if (this.styles.length > 0) {
            css += '\n<style type="text/css">' + this.styles.join('\n') + '</style>';
        }

        html = html.replace(this.CSS_HOOK, css);

        return html;
    }
};

module.exports = function (options) {
    options = options || {};
    var config_dir = options['config_dir']
    return function (req, res, next) {
        res.fis = new ResourceApi(config_dir);
        res.ResourceApi = ResourceApi;
        next();
    };
};

//exports function
module.exports.ResourceApi = ResourceApi;