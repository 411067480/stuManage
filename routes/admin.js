var router = require('koa-router')();
//引入模块
var url=require('url');

const ueditor = require('koa2-ueditor');

//配置中间件 获取url的地址
router.use(async (ctx,next)=>{
    //console.log(ctx.request.header.host);
    //模板引擎配置全局的变量
    ctx.state.__HOST__='http://'+ctx.request.header.host;
    //console.log(ctx.request.url);  //   /admin/user
    //  /admin/login/code?t=709.0399997523431
    var pathname=url.parse(ctx.request.url).pathname.substring(1);
    //左侧菜单选中
    var splitUrl=pathname.split('/');
    
    //全局的userinfo
    ctx.state.G={
        url:splitUrl,
        userinfo:ctx.session.userinfo,
        prevPage:ctx.request.headers['referer']   /*上一页的地址*/
    }
    console.log(ctx.state.G);
   
    //权限判断
    if(ctx.session.userinfo){
        //配置全局信息
        await  next();
    }else{  //没有登录跳转到登录页面
        if(pathname=='admin/login' || pathname=='admin/login/doLogin'  || pathname=='admin/login/code'){
            await  next();
        }else{
            ctx.redirect('/admin/login');
        }
    }

})


var index=require('./admin/index.js');
var login=require('./admin/login.js');
var user=require('./admin/user.js');
var album=require('./admin/album.js');
var manage=require('./admin/manage.js');
var associationcate=require('./admin/associationcate.js');
var association_announce=require('./admin/association_announce.js');
var acivity=require('./admin/acivity.js');
var recruit=require('./admin/recruit.js');
var vote=require('./admin/vote.js');
var focus=require('./admin/focus.js');
var link=require('./admin/link.js');
var nav=require('./admin/nav.js');
var video=require('./admin/video.js');
var setting=require('./admin/setting.js');
var unitedHouses_announce=require('./admin/unitedHouses_announce.js');

//后台的首页
router.use(index);
router.use('/login',login);
router.use('/user',user);
router.use('/manage',manage);
router.use('/album',album);
router.use('/associationcate',associationcate);
router.use('/acivity',acivity);
router.use('/recruit',recruit);
router.use('/vote',vote);

router.use('/unitedHouses_announce',unitedHouses_announce);
router.use('/association_announce',association_announce);
router.use('/focus',focus);
router.use('/link',link);
router.use('/nav',nav);
router.use('/video',video);
router.use('/setting',setting);

//注意上传图片的路由   ueditor.config.js配置图片post的地址
router.all('/editorUpload', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports=router.routes();