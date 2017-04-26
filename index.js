var express = require('express');
var url = require('url');
var app = express();
var setUp = require('./appset');
setUp(app, 'prod');
var proxy = require('http-proxy-middleware');
app.use('/my-project/mlife-guide-re/', proxy({
    target: 'http://www.mlife.top',
    changeOrigin: true, 
    secure: true,
    pathRewrite: {
        '^/my-project/mlife-guide-re' : '/project/mlife-guide-re'
    }
}));
app.listen(process.env.PORT || 5050);     