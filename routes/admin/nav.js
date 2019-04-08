/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');


router.get('/',async (ctx)=>{
    var result=await DB.find('nav',{});
    await  ctx.render('admin/nav/list',{
        list:result
    })
})

router.post('/list/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.navTitle;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('nav',{'navTitle':searchValueResult});
    console.log(result);
    await  ctx.render('admin/nav/list',{
        list:result
    });
})

router.get('/add',async (ctx)=>{

    await  ctx.render('admin/nav/add')
})


//执行增加操作
router.post('/doAdd',async (ctx)=>{

    //接受数据
    console.log(ctx.req.body);
    var navTitle=ctx.request.body.navTitle;

    var navUrl=ctx.request.body.navUrl;

    var navSort=ctx.request.body.navSort;

    var navStatus=ctx.request.body.navStatus;

    var nav_time=tools.getTime();

    await  DB.insert('nav',{navTitle,navUrl,navSort,navStatus,nav_time});

    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/nav');


})


router.get('/edit',async (ctx)=>{

    var id=ctx.query.id;


    var result=await DB.find('nav',{"_id":DB.getObjectId(id)});

    await  ctx.render('admin/nav/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage
    });

})

//执行增加操作
router.post('/doEdit',async (ctx)=>{

    var id=ctx.request.body.id;

    var navTitle=ctx.request.body.navTitle;

    var navUrl=ctx.request.body.navUrl;

    var navSort=ctx.request.body.navSort;

    var navStatus=ctx.request.body.navStatus;

    var prevPage=ctx.request.body.prevPage;


    var nav_time=tools.getTime();

    await  DB.update('nav',{"_id":DB.getObjectId(id)},{navTitle,navUrl,navSort,navStatus,nav_time});

    //跳转
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/nav');

    }


})

module.exports=router.routes();