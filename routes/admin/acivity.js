//学院  社团 管理

var router = require('koa-router')();
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    
    var page=ctx.query.page ||1;
    var pageSize=6;
    //查询总数量
    var count = await  DB.count('acivity',{});
    var result = await DB.find('acivity',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'edit_time':-1  
            //'edit_time':-1：倒序排序，最新修改或增加的数据会优先显示在第一条
            //'edit_time':1：正序排序，最新修改或增加的数据会优先显示在最后一条
        }
    });
    await  ctx.render('admin/acivity/index',{
        list: result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/index/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.activityTitle;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('acivity',{'activityTitle':searchValueResult},{},{});
    console.log(result);
    await  ctx.render('admin/acivity/index',{
        list:result
    });
})


router.get('/add',async (ctx)=>{

    var catelist=await DB.find('associationcate',{});

    console.log(tools.cateToList(catelist));

    await ctx.render('admin/acivity/add',{

        catelist:tools.cateToList(catelist)
    });

})


router.post('/doAdd',tools.multer_activity().single('pic'),async(ctx)=>{
    //1.获取表单提交的数据    console.log(ctx.req.body);
    console.log(ctx.request.body);
    //2.验证表单数据是否合法
    //3.在数据库查询当前要增加的社团是否已经存在
    //4.增加管理员
    //console.log(ctx.req.body);
    // var array = Object.keys(ctx.body.files);
    // console.log(array);
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let pid=ctx.req.body.pid;
    let associationName=ctx.req.body.associationName.trim();
    var activityTitle = ctx.req.body.activityTitle;
    var mainArticle = ctx.req.body.mainArticle;
    //console.log(pid,associationName);
    var contributor = ctx.req.body.contributor;
    var activityContent = ctx.req.body.activityContent;
    var edit_time=tools.getTime();
    var activityStatus=ctx.req.body.activityStatus;
    var json={
        pic:pic,
        activityTitle:activityTitle,
        pid:pid,
        associationName:associationName,
        contributor:contributor,
        activityContent:activityContent,
        mainArticle,
        edit_time:edit_time,
        activityStatus:activityStatus
    }
    let result = await DB.insert('acivity',json);
    //console.log(pic);
    ctx.redirect(ctx.state.__HOST__+'/admin/acivity');
})


router.get('/edit',async (ctx)=>{
    var id=ctx.query.id;
    //查询分类
    var catelist=await DB.find('associationcate',{});
    var result=await DB.find('acivity',{"_id":DB.getObjectId(id)});
    console.log(result);
    await  ctx.render('admin/acivity/edit',{
        list:result[0],
        catelist:tools.cateToList(catelist),
        prevPage :ctx.state.G.prevPage   /*保存上一页的值*/
    });
})


router.post('/doEdit',tools.multer_activity().single('pic'),async(ctx)=>{
    //console.log(ctx.request.body);  //获取表单修改猴的信息
    var id=ctx.req.body.id;       /*前台设置隐藏表单域传过来*/
    var pid=ctx.req.body.pid;
    var pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var associationName=ctx.req.body.associationName.trim();
    var contributor = ctx.req.body.contributor;
    var activityTitle=ctx.req.body.activityTitle;
    var activityContent=ctx.req.body.activityContent;
    var mainArticle = ctx.req.body.mainArticle;
    var establishDate=ctx.req.body.establishDate;
    var activityStatus=ctx.req.body.activityStatus;
    var edit_time=tools.getTime();

    if(pic){
        var json={
            pic:pic,
            pid:pid,
            associationName:associationName,
            contributor:contributor,
            activityTitle:activityTitle,
            activityContent:activityContent,
            mainArticle:mainArticle,
            establishDate:establishDate,
            activityStatus:activityStatus,
            edit_time:edit_time
        }
    }else{
        var json={
            pid:pid,
            associationName:associationName,
            contributor:contributor,
            activityTitle:activityTitle,
            activityContent:activityContent,
            mainArticle:mainArticle,
            establishDate:establishDate,
            activityStatus:activityStatus,
            edit_time:edit_time      
        }
    }
    

    var result=await DB.update('acivity',{'_id':DB.getObjectId(id)},json);
    ctx.redirect(ctx.state.__HOST__+'/admin/acivity');
})


module.exports=router.routes();