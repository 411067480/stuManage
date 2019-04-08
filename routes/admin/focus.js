/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    var page=ctx.query.page ||1;
    var pageSize=7;
    var result= await DB.find('focus',{},{},{
        page,
        pageSize,
        sortJson:{
            "A_time":-1
        }
    });
    var count= await  DB.count('focus',{});  /*总数量*/
    await  ctx.render('admin/focus/list',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/list/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.focusTitle;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('focus',{'focusTitle':searchValueResult},{},{});
    console.log(result);
    await  ctx.render('admin/focus/list',{
        list:result
    });
})

router.get('/add',async (ctx)=>{
    var count = await DB.count('focus');
    console.log(count);
    if(count<7){
        await ctx.render('admin/focus/add');
    }else if(count=7){
        //console.log('失败');
        ctx.render('admin/error',{
            message:'轮播图数量已经达上限，无法继续添加',
            redirect:ctx.state.__HOST__+'/admin/focus'
        })
    }
    
})

router.post('/doAdd',tools.multer_focus().single('pic'),async (ctx)=>{
    //接受post传过来的数据
    //注意：在模板中配置  enctype="multipart/form-data"
    //ctx.body = {
    //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
    //    body:ctx.req.body
    //}
    //增加到数据库
    console.log(ctx.req.file);
    var focusTitle=ctx.req.body.focusTitle;
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var url=ctx.req.body.url;
    var sort=ctx.req.body.sort;
    var A_time=tools.getTime();
    var focusStatus=ctx.req.body.focusStatus;
    
    await  DB.insert('focus',{
        focusTitle,pic,url,sort,focusStatus,A_time
    })
    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/focus');
})
//编辑
router.get('/edit',async (ctx)=>{
    var id=ctx.query.id;
    var result=await DB.find('focus',{"_id":DB.getObjectId(id)});
    console.log(result)
    await  ctx.render('admin/focus/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage
    });
})
//执行编辑数据
router.post('/doEdit',tools.multer_focus().single('pic'),async (ctx)=>{
    var id=ctx.req.body.id;
    var focusTitle=ctx.req.body.focusTitle;
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var url=ctx.req.body.url;
    var sort=ctx.req.body.sort;
    var A_time=tools.getTime();
    var focusStatus=ctx.req.body.focusStatus;
    var prevPage=ctx.req.body.prevPage;
    if(pic){
        var json={
            focusTitle,pic,url,sort,focusStatus,A_time
        }
    }else{
        var json={
            focusTitle,url,sort,focusStatus,A_time
        }
    }
    await  DB.update('focus',{'_id':DB.getObjectId(id)},json);
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/focus');
    }
})



module.exports=router.routes();