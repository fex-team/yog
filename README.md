yog
===

### install

on Linux/Unix
```bash
$ npm install fex-team/yog
```

on Windows

open a `cmd`

```bash
npm install fex-team/yog
```

### use

```
.
├── app.js
├── config  # some `map.json` and `config.json`
├── controllers
├── lib
├── models
├── public # static
└── views # views or template
```

_app.js_

```javascript
var yog = require('yog');
var app = require('express')();
var path = require('path');
var PORT = 4000;

app.use(yog({
    basedir: __dirname,
    viewdir: path.join(__dirname, 'views');
})).listen(PORT, function () {
    console.log('Listening *:' + PORT);
});
```

detail see directory `test/app`

### others

+ [swig](https://github.com/paularmstrong/swig/)
+ [yog-swig](https://github.com/fex-team/yog-swig)
+ [yog-log](https://github.com/fex-team/yog-log)