/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();
var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    var result=await DB.find('video',{});
    await  ctx.render('admin/video/list',{
        list:result
    })
})

router.post('/list/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.title;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('video',{'title':searchValueResult});
    console.log(result);
    await  ctx.render('admin/video/list',{
        list:result
    });
})
router.get('/add',async (ctx)=>{
    await  ctx.render('admin/video/add')
})

//执行增加操作
router.post('/doAdd',tools.multer_video().single('myfile'),async (ctx)=>{
    try{
        console.log(ctx.req.file);
        console.log(ctx.req.body);
        var title=ctx.req.body.title;
        let myfile=ctx.req.file? ctx.req.file.path.substr(7) :'';
        var sort=ctx.req.body.sort;
        var status=ctx.req.body.status;
        var add_time=tools.getTime();
        //假若更换myfile，则....
        var json={
            myfile:myfile,
            title:title,
            sort:sort,
            status:status,
            add_time:add_time
        }
            //更新
        await  DB.insert('video',json);
        ctx.redirect(ctx.state.__HOST__+'/admin/video');
        
    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:ctx.state.__HOST__+'/admin/video/add'
        })
    }   
})


router.get('/edit',async (ctx)=>{
    var id=ctx.query.id;//点击编辑按钮，获取被点击对象的_id的值，以方便有唯一性的检索的需要的信息
    //console.log(ctx.query);
    var result=await DB.find('video',{"_id":DB.getObjectId(id)});
        console.log(result);
    await  ctx.render('admin/video/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage//在跳转至编辑页面之前保存当前页信息
    });

})

//执行修改操作
router.post('/doEdit',tools.multer_video().single('myfile'),async (ctx)=>{
    //console.log(ctx.req.file);
    try{
        var id=ctx.req.body.id;
        var title=ctx.req.body.title;
        let myfile=ctx.req.file? ctx.req.file.path.substr(7) :'';
        var sort=ctx.req.body.sort;
        var status=ctx.req.body.status;
        var add_time=tools.getTime();
        //假若更换myfile，则....
        if(myfile){
            var json={
                myfile:myfile,
                title:title,
                sort:sort,
                status:status,
                add_time:add_time
            }
        }else{//否则....此时 console.log(ctx.req.file)为undefined
            var json={
                title:title,
                sort:sort,
                status:status,
                add_time:add_time
            }
    
        }

        if(title!=''){
                //更新
               await DB.update('video',{"_id":DB.getObjectId(id)},json);
                
                ctx.redirect(ctx.state.__HOST__+'/admin/video');
        }else{
            await ctx.render('admin/error',{
                message:'标题不能为空，请输入非空标题',
                redirect:ctx.state.__HOST__+'/admin/video/edit?id='+id
            })
        }
    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:ctx.state.__HOST__+'/admin/video/edit?id='+id
        })

    }
   
})

router.get('/delete',async (ctx)=>{

    ctx.body="删除此视频";

})
module.exports=router.routes();