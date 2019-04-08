/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

var DB=require('../../model/db.js');


var tools=require('../../model/tools.js');





router.get('/',async (ctx)=>{

    var page=ctx.query.page ||1;
    var pageSize=6;
    var result= await DB.find('link',{},{},{
        page,
        pageSize,
        sortJson:{
            "add_time":-1
        }
    });
    var count= await  DB.count('link',{});  /*总数量*/
    await  ctx.render('admin/link/list',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/list/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.title;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('link',{'title':searchValueResult});
    console.log(result);
    await  ctx.render('admin/link/list',{
        list:result
    });
})


router.get('/add',async (ctx)=>{


    await  ctx.render('admin/link/add');

})

router.post('/doAdd',tools.multer_link().single('pic'),async (ctx)=>{

    //接受post传过来的数据

    //注意：在模板中配置  enctype="multipart/form-data"

    //ctx.body = {
    //    filename:ctx.req.file?ctx.req.file.filename : '',  //返回文件名
    //    body:ctx.req.body
    //}

    //增加到数据库


    var title=ctx.req.body.title;

    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';

    var url=ctx.req.body.url;

    var sort=ctx.req.body.sort;

    var status=ctx.req.body.status;

    var add_time=tools.getTime();


    await  DB.insert('link',{

        title,pic,url,sort,status,add_time
    })
    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/link');


})
//编辑
router.get('/edit',async (ctx)=>{

    var id=ctx.query.id;


    var result=await DB.find('link',{"_id":DB.getObjectId(id)});

    console.log(result)

    await  ctx.render('admin/link/edit',{
        list:result[0],
        prevPage:ctx.state.G.prevPage
    });

})
//执行编辑数据
router.post('/doEdit',tools.multer_link().single('pic'),async (ctx)=>{

    var id=ctx.req.body.id;

    var title=ctx.req.body.title;

    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';

    var url=ctx.req.body.url;

    var sort=ctx.req.body.sort;

    var status=ctx.req.body.status;

    var add_time=tools.getTime();

    var prevPage=ctx.req.body.prevPage;


    if(pic){

        var json={

            title,pic,url,sort,status,add_time
        }
    }else{
        var json={

            title,url,sort,status,add_time
        }

    }
    await  DB.update('link',{'_id':DB.getObjectId(id)},json);


    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        //跳转
        ctx.redirect(ctx.state.__HOST__+'/admin/link');

    }

})

module.exports=router.routes();