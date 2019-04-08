/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require('../../model/db.js');


var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{

    var page=ctx.query.page ||1;

    var pageSize=12;

    //查询总数量

    var count= await  DB.count('album',{});
    var result=await DB.find('album',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    await  ctx.render('admin/album/list',{
        list: result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/list/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.catename;
    console.log(searchValueResult);
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('album',{'catename':searchValueResult});
    console.log(result);
    await  ctx.render('admin/album/list',{
        list:result
    });
})

router.get('/add',async (ctx)=>{

    var catelist=await DB.find('associationcate',{});

    //console.log(tools.cateToList(catelist));

    await  ctx.render('admin/album/add',{

        catelist:tools.cateToList(catelist)
    });

})

router.post('/doAdd',tools.multer().single('pic'),async (ctx)=>{

    //1.获取表单提交的数据    console.log(ctx.request.body);

    //2.验证表单数据是否合法

    //3.在数据库查询当前要增加的管理员是否存在

    //4.增加管理员

    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    console.log(pid,catename);
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    if(pic){
        let json={
            pid:pid,
            catename:catename,
            pic:pic,
        }
        //增加社团相片
        var addResult =await DB.insert('album',json);
    }else{
        let json={
            pid:pid,
            catename:catename,
        }
        //增加社团相片
            var addResult =await DB.insert('album',json);
    }
        ctx.redirect(ctx.state.__HOST__+'/admin/album');
    //console.log(addResult);
})


router.get('/edit',async (ctx)=>{

    //查询分类数据
    var id=ctx.query.id;
    //分类
    var catelist=await DB.find('associationcate',{});
    //当前要编辑的数据
    var result=await DB.find("album",{"_id":DB.getObjectId(id)});
    await ctx.render('admin/album/edit',{
        catelist:tools.cateToList(catelist),
        list:result[0],
        prevPage :ctx.state.G.prevPage   /*保存上一页的值*/
   })

})

router.post('/doEdit',tools.multer().single('pic'),async (ctx)=>{

      try{
        let prevPage=ctx.req.body.prevPage || '';  /*上一页的地址*/
        let id=ctx.req.body.id;
        let pid=ctx.req.body.pid;
        let catename=ctx.req.body.catename.trim();
        console.log(pid,catename);
        let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
       

        if(pic){
            var json={
                pic:pic,
                pid:pid,
                catename:catename,
            }
        }else{
            var json={
                pid:pid,
                catename:catename,
            }
        }
          //更新社团相册
        var updateResult=await DB.update('album',{"_id":DB.getObjectId(id)},json);
        ctx.redirect(ctx.state.__HOST__+'/admin/album');
        
    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:ctx.state.__HOST__+'/admin/album/edit?id='+id
        })
    }
})

router.get('/delete',async (ctx)=>{

    ctx.body="删除用户";

})

module.exports=router.routes();