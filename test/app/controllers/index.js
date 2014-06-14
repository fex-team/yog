module.exports = function (router) {
    router.get('/', function (req, res) {
        console.log(res.fis);
        res.end('hello');
    })
};