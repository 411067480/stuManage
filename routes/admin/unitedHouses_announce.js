//学院  社团 管理

var router = require('koa-router')();
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    var page=ctx.query.page ||1;

    var pageSize=6;

    //查询总数量

    var count= await  DB.count('unitedHouses_announce',{});
    var result=await DB.find('unitedHouses_announce',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'u_time':-1
        }
    });
    await  ctx.render('admin/unitedHouses_announce/index',{
        list: result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/index/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.uTitle;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('unitedHouses_announce',{'uTitle':searchValueResult},{},{});
    console.log(result);
    await  ctx.render('admin/unitedHouses_announce/index',{
        list:result
    });
})


router.get('/add',async (ctx)=>{
    var catelist=await DB.find('associationcate',{});
    await  ctx.render('admin/unitedHouses_announce/add',{
        catelist:tools.cateToList(catelist)
    });

})


router.post('/doAdd',tools.multer_united_announce().single('unitedA_logo'),async(ctx)=>{
    //1.获取表单提交的数据    console.log(ctx.req.body);
    console.log(ctx.request.body);
    //2.验证表单数据是否合法
    //3.在数据库查询当前要增加的社团是否已经存在
    //4.增加管理员
    //console.log(ctx.req.body);
    // var array = Object.keys(ctx.body.files);
    // console.log(array);
    var unitedA_logo=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var pid=ctx.req.body.pid;
    var associationName=ctx.req.body.associationName.trim();
    var uTitle = ctx.req.body.uTitle;
    var uContent = ctx.req.body.uContent;
    var u_time=tools.getTime();
    var uStatus=ctx.req.body.uStatus;
    var json={
        unitedA_logo:unitedA_logo,
        pid:pid,
        associationName:associationName,
        uTitle:uTitle,
        uContent:uContent,
        u_time:u_time,
        uStatus:uStatus
    }
    let result = await DB.insert('unitedHouses_announce',json);
    //console.log(pic);
    ctx.redirect(ctx.state.__HOST__+'/admin/unitedHouses_announce');
    

})


router.get('/edit',async (ctx)=>{
    var id=ctx.query.id;
    //分类
    var catelist=await DB.find('associationcate',{});
    var result=await DB.find('unitedHouses_announce',{"_id":DB.getObjectId(id)});
    console.log(result);
    await  ctx.render('admin/unitedHouses_announce/edit',{
        list:result[0],
        catelist:tools.cateToList(catelist),
        prevPage :ctx.state.G.prevPage   /*保存上一页的值*/
    });

})


router.post('/doEdit',tools.multer_united_announce().single('unitedA_logo'),async(ctx)=>{
    //console.log(ctx.request.body);  //获取表单修改猴的信息
    var id=ctx.req.body.id;       /*前台设置隐藏表单域传过来*/
    var unitedA_logo=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var pid=ctx.req.body.pid;
    var associationName=ctx.req.body.associationName.trim();
    var uTitle=ctx.req.body.uTitle;
    var uContent=ctx.req.body.uContent;
    var uStatus=ctx.req.body.uStatus;
    var u_time=tools.getTime();
    if(unitedA_logo){
        var json={
            unitedA_logo:unitedA_logo,
            pid:pid,
            associationName:associationName,
            uTitle:uTitle,
            uContent:uContent,
            uStatus:uStatus,
            u_time:u_time
        }
    }else{
        var json={
            pid:pid,
            associationName:associationName,
            uTitle:uTitle,
            uContent:uContent,
            uStatus:uStatus,
            u_time:u_time
        }
    }
    
    var result=await DB.update('unitedHouses_announce',{'_id':DB.getObjectId(id)},json);
    ctx.redirect(ctx.state.__HOST__+'/admin/unitedHouses_announce');
})


module.exports=router.routes();