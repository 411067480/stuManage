//学院  社团 管理

var router = require('koa-router')();
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    var page=ctx.query.page ||1;

    var pageSize=6;

    //查询总数量

    var count= await  DB.count('association_announce',{});
    var result=await DB.find('association_announce',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    await  ctx.render('admin/association_announce/index',{
        list: result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/index/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.aAtitle;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('association_announce',{'aAtitle':searchValueResult},{},{});
    console.log(result);
    await  ctx.render('admin/association_announce/index',{
        list:result
    });
})


router.get('/add',async (ctx)=>{

    await  ctx.render('admin/association_announce/add');

})


router.post('/doAdd',async(ctx)=>{
    //1.获取表单提交的数据    console.log(ctx.req.body);
    console.log(ctx.request.body);
    //2.验证表单数据是否合法
    //3.在数据库查询当前要增加的社团是否已经存在
    //4.增加管理员
    //console.log(ctx.req.body);
    // var array = Object.keys(ctx.body.files);
    // console.log(array);
    var aAtitle = ctx.request.body.aAtitle;
    var content = ctx.request.body.content;
    var add_time=tools.getTime();
    var aAstatus=ctx.request.body.aAstatus;
    var json={
        aAtitle:aAtitle,
        content:content,
        add_time:add_time,
        aAstatus:aAstatus
    }
    let result = await DB.insert('association_announce',json);
    //console.log(pic);
    ctx.redirect(ctx.state.__HOST__+'/admin/association_announce');
    

})


router.get('/edit',async (ctx)=>{
    var id=ctx.query.id;
    var result=await DB.find('association_announce',{"_id":DB.getObjectId(id)});
    console.log(result);
    await  ctx.render('admin/association_announce/edit',{
        list:result[0]
    });

})


router.post('/doEdit',async(ctx)=>{
    //console.log(ctx.request.body);  //获取表单修改猴的信息
    var id=ctx.request.body.id;       /*前台设置隐藏表单域传过来*/
    var aAtitle=ctx.request.body.aAtitle;
    var content=ctx.request.body.content;
    var aAstatus=ctx.request.body.aAstatus;
    var add_time=tools.getTime();
    var json={
        aAtitle:aAtitle,
        content:content,
        aAstatus:aAstatus,
        add_time:add_time
    }
    var result=await DB.update('association_announce',{'_id':DB.getObjectId(id)},json);
    ctx.redirect(ctx.state.__HOST__+'/admin/association_announce');
})


module.exports=router.routes();