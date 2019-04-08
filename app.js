//引入 koa模块

var Koa=require('koa'),
    router = require('koa-router')(),
    path=require('path'),
    render = require('koa-art-template'),
    static = require('koa-static'),
    session = require('koa-session'),
    sd = require('silly-datetime'),
    jsonp = require('koa-jsonp'),
    bodyParser = require('koa-bodyparser');

//实例化
var app=new Koa();

//配置jsonp的中间件
app.use(jsonp());

//配置post提交数据的中间件
app.use(bodyParser());

//配置session的中间件

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 300000,
    // maxAge: 300000,  //此处设置多长时间后系统后台自动退出登录 此处为300秒，约合5分钟
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,   /*每次请求都重新设置session*/
    renew: false,
};
app.use(session(CONFIG, app));

//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        return sd.format(value, 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});

//public/upload/1525251917221.png
//配置中间件

//app.use(static('.'));   不安全

//配置 静态资源的中间件
app.use(static(__dirname + '/public'));

//引入模块
var index=require('./routes/index.js');
var api=require('./routes/api.js');
var admin=require('./routes/admin.js');

router.use('/admin',admin);
router.use('/api',api);
router.use(index);
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());
app.listen(6060);









// var Koa=require('koa');
// var router = require('koa-router')(),//注意：引入的方式
// //实例化koa.js框架
// var app=new Koa();
// router.get('/',function(ctx,next){
//     ctx.body('hello Koa');
// })
// router.get('/news',(ctx,next)=>{
//     ctx.body('新闻页面');
// })
// app.use(router.router());  //作用：启动路由
// app.use(router.allowedMethods());
// app.listen(6060,()=>{
//     console.log('starting at port 6060');
// });

const mongoose = require('mongoose');
//连接mongoDB数据库
mongoose.connect('mongodb://localhost/test') //test是数据库名称
//实例化连接对象
const db = mongoose.connection
db.on('error',console.error.bind(console,'连接错误:'))
db.once('open',(callback) => {
     console.log('MongoDB连接成功!');
})