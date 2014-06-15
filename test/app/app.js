var yog = require('../../');
var app = require('express')();

app.use(yog({
    basedir: __dirname,
    viewdir: __dirname + '/views'
})).listen(4000);

console.log('please visit http://127.0.0.1:4000\n');
