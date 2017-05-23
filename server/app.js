const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const compression = require('compression');
//引用artTemplate模块
const template = require('art-template');
const config = require('./config');
const app = express();
const userApi = require('./model/user');
const roleConfigApi = require('./model/roleConfig');

const login = require('./routes/login');
const index = require('./routes/index');
const crflib = require('./routes/crflib');
const odm = require('./routes/odm');
const power=require('./routes/power');
const crf = require('./routes/crf');
const exp = require('./routes/exp');
const collect = require('./routes/collect');
const draft = require('./routes/draft');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//用art-template引擎替换默认的jade引擎
//app.set('view engine', 'jade');
template.config('base',app.get('views'));
template.config('extname','.html');
app.engine('.html',template.__express);
app.set('view engine','html');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'));
app.use(logger('common', {stream: accessLogStream}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(session({
     cookie: {name:"tms",maxAge: 3600*1000 },
     resave: true, // don't save session if unmodified
     saveUninitialized: false, // don't create session until something stored
     //store: new RedisStore(config.redis),
     secret: 'tms'
 }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'demo')));  //demo目录，
const urls = require("./public/assets/js/modules/urls");
//=========页面路由start=========
app.get('/',function (req, res, next) {
    res.redirect("/login");
});
app.get('/logout',function (req,res) {
    res.clearCookie('usercache', { path: '/' });
    res.redirect('/login');
});
app.use(function(req,res,next){
 if (!req.cookies.usercache) {
         if(req.url=="/login" || req.url.indexOf("/UserLogin") > -1){
            next();//如果请求的地址是登录则通过，进行下一个请求
         }else{
            res.redirect('/login');
         }
     } else if (req.cookies.usercache) {
        next();
     }
 });
app.use('/login', login);
app.use('/index', index);
app.use('/crflib', crflib);
app.use('/odm', odm);
app.use('/power',power);
app.use('/crf', crf);
app.use('/exp', exp);
app.use('/collect', collect);
app.use('/draft', draft);

//=========个别接口，Node层处理start===========
app.use('/User', userApi);
app.use('/RoleConfig', roleConfigApi);

// 该路由使用的中间件，所有异步接口入口
app.use("*",function(req, res, next) {
    var _url = req.originalUrl;
    if(_url.indexOf("undefined") < 0) {
        config.callback(req, res, next);
    }
    /*var _url = req.originalUrl;
    console.log("_url:" + _url);
        _url = _url.substr(1,_url.length);
        if(JSON.stringify(urls).indexOf(_url) > -1) {
            config.callback(req, res, next);
        }else{
            next();
    }*/
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("404页面没找到路径");
});

module.exports = app;