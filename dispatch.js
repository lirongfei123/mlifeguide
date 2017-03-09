var express = require('express');
var url = require('url');
var app = express();
var setUp = require('./appset');
setUp(app, 'prod');
var proxy = require('express-http-proxy');
app.use('/my-project/mlife-guide-re/', proxy('www.mlife.top', {
  forwardPath: function(req, res) {
    return '/my-project/mlife-guide-re/' + url.parse(req.url).path;
  }
}));
app.listen(5000);

