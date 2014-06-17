var rApi = require('../../middleware/yog-resource-api');
var path = require('path');
var expect = require('chai').expect;
var config_dir = path.join(__dirname, 'config');

describe('ResouceApi.load', function () {
    describe('load css', function () {
        it('not have deps', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.load('test:static/not-have-deps.css');
            expect(uri).to.equal('/static/test/not-have-deps.css');
            expect(r.sync).to.have.property('css').with.length(1);
        });

        it ('have deps', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.load('test:static/have-deps.css');
            expect(uri).to.equal('/static/test/have-deps.css');
            expect(r.sync).to.have.property('css').with.length(2);
            expect(r.sync['css']).to.deep.equal(
                [
                    "/static/test/deps_01.css",
                    "/static/test/have-deps.css"
                ]
            );
        });
    });

    describe('load js', function () {
        it('not have deps', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.load('test:static/not-have-deps.js');
            expect(uri).to.equal('/static/test/not-have-deps.js');
            expect(r.sync).to.have.property('js').with.length(1);
            expect(r.sync['js']).to.deep.equal(['/static/test/not-have-deps.js']);
        });

        it ('deps css', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.load('test:static/have-css-deps.js');
            expect(uri).to.equal('/static/test/have-css-deps.js');
            expect(r.sync).to.have.property('js').with.length(1);
            expect(r.sync).to.have.property('css').with.length(1);
            expect(r.sync).to.deep.equal({
                'js': ['/static/test/have-css-deps.js'],
                'css': ['/static/test/deps_01.css']
            });
        });

        it ('deps js', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.load('test:static/have-js-deps.js');
            expect(uri).to.equal('/static/test/have-js-deps.js');
            expect(r.sync).to.have.property('js').with.length(2);
            expect(r.sync).to.deep.equal({
                'js': ['/static/test/deps_01.js', '/static/test/have-js-deps.js']
            });
        });

        it ('have async', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.load('test:static/have-async.js');
            expect(uri).to.equal('/static/test/have-async.js');
            expect(r.sync).to.have.property('js').with.length(1);
            expect(r.sync).to.deep.equal({
                'js': ['/static/test/have-async.js']
            });
            expect(r.async).to.have.property('test:static/async_01.js');
        });

        it ('js先异步加载后同步加载', function () {
            var r = new rApi.ResourceApi(config_dir);
            var uri = r.load('test:static/have-async.js', true); //异步加载
            expect(uri).to.equal('/static/test/have-async.js');
            r.load('test:static/have-async.js'); // 同步加载
            expect(r.sync).to.have.property('js').length(1);
            expect(r.async).to.have.property('test:static/async_01.js');
            expect(r.async).to.have.property('test:static/have-async.js');
        });
    });
});
