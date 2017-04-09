var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var methodOverride = require('method-override');
var serveStatic = require('serve-static')
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
module.exports = function(app, env) {
  env = env || 'dev';
  app.use(bodyParser.json({ type: 'application/*+json' }))
  app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
  app.use(bodyParser.text({ type: 'text/html' }))
  app.use(cookieSession({
    name: 'session',
    keys: ['985867294@qq.com'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours 
  }));
  app.use(methodOverride());
  // 第三方登录中间件
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new GithubStrategy({
    clientID: "fb7b9391b2ce46a35af6",
    clientSecret: "f8c38d6aa92f9cdfed55166cb2ceb23f4de12b0f"
  }, function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }));
  passport.serializeUser(function(user, done) { //保存user对象
    done(null, user); //可以通过数据库方式操作
  });

  passport.deserializeUser(function(user, done) { //删除user对象
    done(null, user); //可以通过数据库方式操作
  });
  // 配置页面路由, 所有页面都必须先登录才能进
  // 先配置有限路由
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get("/fail", function(req, res) {
    res.end('fail');
  });
  app.get("/auth/github", passport.authenticate("github", { scope: "email" }));
  app.get("/auth/github/callback", passport.authenticate("github", {
    successRedirect: '/',
    failureRedirect: '/fail'
  }));
  // 通用路由
  app.all('**', isLoggedIn);
  if (env !== 'dev') {
    app.get('/', function(req, res) {
      res.sendFile(__dirname + '/dist/index.html');
    });
    // 静态文件
    app.use('/', serveStatic('dist'));
    app.use('/vendor', serveStatic('src/vendor', { 'index': ['index.html'] }));
  }
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      res.cookie('userid', req.user.id, { expires: new Date(Date.now() + 900000000), httpOnly: true });
      next();
    } else {
      res.redirect('/auth/github');
    }
  }
};
