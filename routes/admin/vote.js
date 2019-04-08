//学院  社团 管理

var router = require('koa-router')();
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    
    var page=ctx.query.page ||1;

    var pageSize=10;

    //查询总数量

    var count= await  DB.count('vote',{});
    var result=await DB.find('vote',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'vote_time':-1
        }
    });
    await  ctx.render('admin/vote/index',{

        list: result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/index/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.voteTitle;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('vote',{'voteTitle':searchValueResult},{},{});
    console.log(result);
    await  ctx.render('admin/vote/index',{
        list:result
       
    });
})


router.get('/add',async (ctx)=>{
    var catelist=await DB.find('associationcate',{});
    await  ctx.render('admin/vote/add',{
        catelist:tools.cateToList(catelist)
    });

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
    let pid=ctx.request.body.pid;
    let associationName=ctx.request.body.associationName.trim();
    var voteTitle = ctx.request.body.voteTitle;
    var voteUrl = ctx.request.body.voteUrl;
    var vote_time=tools.getTime();
    var voteStatus=ctx.request.body.voteStatus;
    var json={
        pid:pid,
        associationName:associationName,
        voteTitle:voteTitle,
        voteUrl:voteUrl,
        vote_time:vote_time,
        voteStatus:voteStatus
    }
    let result = await DB.insert('vote',json);
    //console.log(pic);
    ctx.redirect(ctx.state.__HOST__+'/admin/vote');
    

})


router.get('/edit',async (ctx)=>{
    var id=ctx.query.id;
    //分类
    var catelist=await DB.find('associationcate',{});
    var result=await DB.find('vote',{"_id":DB.getObjectId(id)});
    console.log(result);
    await  ctx.render('admin/vote/edit',{
        list:result[0],
        catelist:tools.cateToList(catelist),
        prevPage :ctx.state.G.prevPage   /*保存上一页的值*/
    });

})


router.post('/doEdit',async(ctx)=>{
    //console.log(ctx.request.body);  //获取表单修改猴的信息
    var id=ctx.request.body.id;       /*前台设置隐藏表单域传过来*/
    var pid=ctx.request.body.pid;
    var associationName=ctx.request.body.associationName.trim();
    //console.log(pid,associationName);
    var voteTitle=ctx.request.body.voteTitle;
    var voteUrl=ctx.request.body.voteUrl;
    var voteStatus=ctx.request.body.voteStatus;
    var vote_time=tools.getTime();
    
    var json={
        pid:pid,
        associationName:associationName,
        voteTitle:voteTitle,
        voteUrl:voteUrl,
        voteStatus:voteStatus,
        vote_time:vote_time
    }
    var result=await DB.update('vote',{'_id':DB.getObjectId(id)},json);
    ctx.redirect(ctx.state.__HOST__+'/admin/vote');
})


module.exports=router.routes();