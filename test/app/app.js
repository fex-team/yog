var yog = require('../../');
var app = require('express')();

app.use(yog({
    basedir: __dirname
})).listen(4000);