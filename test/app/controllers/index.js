module.exports = function (router) {
    router.get('/', function (req, res) {
        res.render('test/page/index.tpl', {
            widget0_obj: {
                title: "HELLO, i'm a widget!"
            }
        });
    })
};