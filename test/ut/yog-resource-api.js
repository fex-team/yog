var rApi = require('../../middleware/yog-resource-api');
var path = require('path');

var r = new rApi.ResourceApi(path.join(__dirname, 'config'));

r.load('test:static/a.js');
console.log(r);
console.log(r.getResourceMap());