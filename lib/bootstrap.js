module.exports = function (app, options) {
    //set middleware
    app.use(require('../middleware/yog-resource-api')({
        'config_dir': options.basedir + '/config'
    }));
    app.use(require('../middleware/yog-swig')(options))
};