module.exports = function (router) {
    router.get('/', function (req, res) {
        res.render('test/page/index.tpl');
    })
};