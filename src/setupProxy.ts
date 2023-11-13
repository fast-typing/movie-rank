const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(proxy('/api_kinoafisha', 
        { target: 'http://213.171.9.36/api_kinoafisha' }
    ));
}