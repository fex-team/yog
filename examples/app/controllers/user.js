var util = require('yog-util');

module.exports = function (router) {

    router.get('/index', function (req, res) {
        var user = require('../models/user.js');
        var book = require('../models/book.js');
        var data = {
            title: 'this is a test'
        };

        res.renderPipe('user/page/index.tpl', data)
            .then(function(pagelets) {
                util.map(pagelets, function(name, pagelet) {
                    switch (name) {
                        case 'users':
                            
                            user.list(function (users) {
                                pagelet.render(users);
                            });

                            break;
                        case 'books':
                            book.list(function (books) {
                                pagelet.render(books);
                            });

                            break;
                    }
                });
            });
    });

    route.get('/add', function (req, res) {
        res.render('user/page/add.tpl');
    });
};