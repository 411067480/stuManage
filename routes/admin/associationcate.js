//学院  社团 管理

var router = require('koa-router')();
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    var page=ctx.query.page ||1;

    var pageSize=6;

    //查询总数量

    var count= await  DB.count('associationcate',{});
    var result=await DB.find('associationcate',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'update_time':-1
        }
    });
    await  ctx.render('admin/associationcate/index',{
        list: result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/index/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.associationName;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('associationcate',{'associationName':searchValueResult},{},{});
    console.log(result);
    await  ctx.render('admin/associationcate/index',{
        list:result
    });
})


router.get('/add',async (ctx)=>{

    //获取一级分类

    var result=await DB.find('associationcate',{'pid':'0'});


    await  ctx.render('admin/associationcate/add',{

        catelist:result
    });

})


router.post('/doAdd',tools.multer().fields([{name:'pic',maxCount:1},{name:'introcoverphoto',maxCount:1}]),async(ctx)=>{
    //1.获取表单提交的数据    console.log(ctx.req.body);
    //console.log(ctx.req.body);
    //2.验证表单数据是否合法
    //3.在数据库查询当前要增加的社团是否已经存在
    //4.增加管理员
    //console.log(ctx.req.body);
    console.log(ctx.req.files);//打印出多图上传集合
    // var array = Object.keys(ctx.body.files);
    // console.log(array);
    let pid=ctx.req.body.pid;
    let pic=ctx.req.files.pic[0]? ctx.req.files.pic[0].path.substr(7) :'';
    //console.log(pic);
    let introcoverphoto=ctx.req.files.introcoverphoto[0]? ctx.req.files.introcoverphoto[0].path.substr(7) :'';
    //console.log(introcoverphoto);
    let associationName=ctx.req.body.associationName;
    let establishDate=ctx.req.body.establishDate;
    let slogan = ctx.req.body.slogan;
    let creater=ctx.req.body.creater;
    let introduction=ctx.req.body.introduction ||'';
    let aStatus=ctx.req.body.aStatus;
    let keywords=ctx.req.body.keywords;
    let add_time=tools.getTime();
    
    if(pic,introcoverphoto){
        var json={
            pic:pic,
            introcoverphoto:introcoverphoto,
            pid:pid,
            associationName:associationName,
            establishDate:establishDate,
            slogan:slogan,
            creater:creater,
            introduction:introduction,
            aStatus:aStatus,
            keywords:keywords,
            update_time:update_time
        }
        let result=await  DB.insert('associationcate',json);
        //console.log(pic);
        ctx.redirect(ctx.state.__HOST__+'/admin/associationcate');
    }else{
       //console.log('失败');
        ctx.render('admin/error',{
            message:'图片上传不完整',
            redirect:ctx.state.__HOST__+'/admin/associationcate'
        })
    }
    

})


router.get('/edit',async (ctx)=>{
    var id=ctx.query.id;
    var result=await DB.find('associationcate',{"_id":DB.getObjectId(id)});
    console.log(result);
      var associationcate=await DB.find('associationcate',{'pid':'0'});
    await  ctx.render('admin/associationcate/edit',{
        list:result[0],
        catelist:associationcate
    });

})


router.post('/doEdit',tools.multer().fields([{name:'pic',maxCount:1},{name:'introcoverphoto',maxCount:1}]),async(ctx)=>{
    var id=ctx.req.body.id;       /*前台设置隐藏表单域传过来*/
    var pid=ctx.req.body.pid;
    let pic=ctx.req.files.pic[0]? ctx.req.files.pic[0].path.substr(7) :'';
    let introcoverphoto=ctx.req.files.introcoverphoto[0]? ctx.req.files.introcoverphoto[0].path.substr(7) :'';
    let associationName=ctx.req.body.associationName;
    let establishDate=ctx.req.body.establishDate;
    let slogan = ctx.req.body.slogan;
    let creater=ctx.req.body.creater;
    let introduction=ctx.req.body.introduction ||'';
    let aStatus=ctx.req.body.aStatus;
    let keywords=ctx.req.body.keywords;
    let update_time=tools.getTime();
    //同时存在
    if(pic.value=!''&&introcoverphoto.value!=''){
        var json={
            pic:pic,
            introcoverphoto:introcoverphoto,
            pid:pid,
            associationName:associationName,
            establishDate:establishDate,
            slogan:slogan,
            creater:creater,
            introduction:introduction,
            aStatus:aStatus,
            keywords:keywords,
            update_time:update_time
        }
    }else{
        var json={
            pid:pid,
            associationName:associationName,
            establishDate:establishDate,
            slogan:slogan,
            creater:creater,
            introduction:introduction,
            aStatus:aStatus,
            keywords:keywords,
            update_time:update_time
        }
    }
    var result=await DB.update('associationcate',{'_id':DB.getObjectId(id)},json);
    
    
    console.log(result);

    
    ctx.redirect(ctx.state.__HOST__+'/admin/associationcate');

})


module.exports=router.routes();