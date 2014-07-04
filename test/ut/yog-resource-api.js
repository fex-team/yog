var rApi = require('../../middleware/yog-resource-api');
var path = require('path');
var expect = require('chai').expect;
var config_dir = path.join(__dirname, 'config');

describe('ResouceApi', function () {
    describe('ResourceApi.resolve', function () {
        it('not pkg', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.resolve('test:static/not-have-deps.css');
            expect(uri).to.equal('/static/test/not-have-deps.css');
        });
    });

    describe('ResourceApi.getInfo', function () {
        it('ignorePkg', function () {
            var r = new rApi.ResourceApi(config_dir);
            var i = r.getInfo('test:static/has-pkg.css');
            expect(i).to.deep.equal({
                "uri": "/static/test/pkg/pkg_0.css",
                "type": "css",
                "has": [
                    "test:static/has-pkg.css"
                ]
            })
        });

        it ('!ignorePkg', function () {
            var r = new rApi.ResourceApi(config_dir);
            var i = r.getInfo('test:static/has-pkg.css', true);
            expect(i).to.deep.equal({
                "uri": "test:static/has-pkg.css",
                "type": "css",
                "pkg": "p0"
            })
        });
    });
});
