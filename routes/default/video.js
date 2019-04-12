var router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/',async (ctx)=>{
   
    console.time('start');
    /*导航栏nav获取 */
    var nav = await DB.find('nav',{},{},{});
    //从数据库获取-视频-数据

    var page =ctx.query.page||1;
    var pageSize=2;
    var video = await DB.find('video',{},{},{
        page,
        pageSize,
        sortJson:{
            'add_time':1
        }
    });    
    var count=await DB.count('video',{});
    console.log(video);
    
    console.timeEnd('start');
    ctx.render('default/video',{
        videolist:video,
        nav:nav,
        page:page,
        totalPages:Math.ceil(count/pageSize),
    });
})

module.exports=router.routes();