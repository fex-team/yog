var yog = require('../../');
var app = require('express')();

app.use(yog({
    basedir: __dirname,
    viewdir: __dirname + '/views'
})).listen(4000);