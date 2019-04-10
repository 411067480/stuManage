var router = require('koa-router')();

var DB=require('../model/db.js');

var url=require('url');

//配置中间件 获取url的地址
router.use(async (ctx,next)=>{
    //console.log(ctx.request.header.host);
     //模板引擎配置全局的变量
    ctx.state.__HOST__='http://'+ctx.request.header.host;
     //console.log(ctx.request.url);  //   /admin/user
    var pathname=url.parse(ctx.request.url).pathname;
    console.log(pathname);
    console.log('pathname中的ID值'+pathname.substr(50));//截取其中需要ID值字符
    // var pathnameID = pathname.substr(50);

    //导航条的数据//升序排序
    var navResult=await DB.find('nav',{$or:[{'status':1},{'status':'1'}]},{},{
        sortJson:{'sort':1}
    })
    //模板引擎配置全局的变量
    ctx.state.nav=navResult;
    ctx.state.pathname=pathname;

    //console.log(ctx.session.userinfo);//登录之后打印出登录会员的所有信息，未登录时刷新/login页面打印为undefined

    //权限判断
    // if(ctx.session.userinfo){
    //     //配置全局信息
    //     await  next();
    // }else{  //没有登录跳转到登录页面
    //     if(pathname=='/login' || pathname=='/login/doLogin'){
    //         await  next();
    //     }else{
    //         ctx.redirect('/login');
    //     }
    // }
    //配置全局 G

    ctx.state.F={
        userinfo:ctx.session.userinfo,
        // prevPage:ctx.request.headers['referer']   /*上一页的地址*/
    }
    ctx.state.prev={
        // userinfo:ctx.session.userinfo,
        prevPage:ctx.request.headers['referer']   /*上一页的地址*/
    };
    console.log(ctx.state.prev);

    await  next()

  
})



var index=require('./default/index.js');
var summary=require('./default/summary.js');
var association_announce=require('./default/association_announce.js');
var news=require('./default/news.js');
var vote=require('./default/vote.js');
var regist=require('./default/regist.js');
var login=require('./default/login.js');
var association_announceContent_more=require('./default/association_announceContent_more.js');
var video=require('./default/video.js');

router.use(index);
router.use('/regist',regist);
router.use('/login',login);
router.use('/summary',summary);
router.use('/association_announce',association_announce);
router.use('/news',news);
router.use('/vote',vote);
router.use('/association_announceContent_more',association_announceContent_more);
router.use('/video',video);

module.exports=router.routes();