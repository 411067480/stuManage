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

    var count= await  DB.count('associator',{});
    var result=await DB.find('associator',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    console.log(result);
    await  ctx.render('admin/user/list',{
        list: result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
    });
})

router.post('/list/doSearch',async (ctx)=>{
    //获取输入框输入的数据
    console.log(ctx.request.body);
    //将在输入框键入的数据复制给变量：searchValueResult
    var searchValueResult = ctx.request.body.username;
    //以：searchValueResult 作为关键字>>查询对应目标，最后在列表中渲染
    var result= await DB.find('associator',{'username':searchValueResult});
    console.log(result);
    await  ctx.render('admin/user/list',{
        list:result
    });
})

router.get('/add',async (ctx)=>{

    var catelist=await DB.find('associationcate',{});

    //console.log(tools.cateToList(catelist));

    await  ctx.render('admin/user/add',{

        catelist:tools.cateToList(catelist)
    });

})

router.post('/doAdd',tools.multer().single('pic'),async (ctx)=>{

    //1.获取表单提交的数据    console.log(ctx.request.body);

    //2.验证表单数据是否合法

    //3.在数据库查询当前要增加的管理员是否存在

    //4.增加管理员

    let pid=ctx.req.body.pid;
    let associationName=ctx.req.body.associationName.trim();
    //console.log(pid,associationName);
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    var stu_ID=ctx.req.body.stu_ID;
    var username=ctx.req.body.username;
    var sex=ctx.req.body.sex;
    var senior=ctx.req.body.senior;
    var department=ctx.req.body.department;
    var profession=ctx.req.body.profession;
    var whichclass=ctx.req.body.whichclass;
    var telphone=ctx.req.body.telphone;
    var password=ctx.req.body.password;
    var rpassword=ctx.req.body.rpassword;
    var add_time=tools.getTime();


    if(!/^[\u4e00-\u9fa5]{2,4}$/.test(username)){
        await ctx.render('admin/error',{
            message:'用户名必须为2-4位汉字',
            redirect:ctx.state.__HOST__+'/admin/user/add'
        })
    }else if(password!=rpassword ||password.length>6){
           await ctx.render('admin/error',{
                message:'密码和确认密码不一致，或者密码长度小于6位',
                redirect:ctx.state.__HOST__+'/admin/user/add'
            })
    }else{
        //数据库查询当前社团成员是否存在:根据学号来判断
        var findResult=await  DB.find('associator',{"stu_ID":stu_ID});
        if(findResult.length>0){
            await  ctx.render('admin/error',{
                message:'此学号已经存在，请换个学号',
                redirect:ctx.state.__HOST__+'/admin/user/add'
            })
        }else{
            if(pic){
                let json={
                    pid:pid,
                    associationName:associationName,
                    pic:pic,
                    stu_ID:stu_ID,
                    username:username,
                    sex:sex,
                    password:password,
                    senior:senior,
                    department:department,
                    profession:profession,
                    whichclass:whichclass,
                    telphone:telphone,
                    password:tools.md5(password),
                    rpassword:rpassword,
                    add_time:add_time
                }
                //增加社团成员
                var addResult =await DB.insert('associator',json);
            }else{
                let json={
                    pid:pid,
                    associationName:associationName,
                    stu_ID:stu_ID,
                    username:username,
                    sex:sex,
                    password:password,
                    senior:senior,
                    department:department,
                    profession:profession,
                    whichclass:whichclass,
                    telphone:telphone,
                    password:tools.md5(password),
                    rpassword:rpassword,
                    add_time:add_time
                }
                //增加社团成员
                 var addResult =await DB.insert('associator',json);
                //console.log(addResult);
            }
        
             ctx.redirect(ctx.state.__HOST__+'/admin/user');
             
        }
    }
})


router.get('/edit',async (ctx)=>{
    //查询分类数据
    var id=ctx.query.id;
    //分类
    var catelist=await DB.find('associationcate',{});
    //当前要编辑的数据
    var result=await DB.find("associator",{"_id":DB.getObjectId(id)});
    await ctx.render('admin/user/edit',{
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
        let associationName=ctx.req.body.associationName.trim();
        console.log(pid,associationName);
        let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
        var stu_ID=ctx.req.body.stu_ID;
        var username=ctx.req.body.username;
        var sex=ctx.req.body.sex;
        var senior=ctx.req.body.senior;
        var department=ctx.req.body.department;
        var profession=ctx.req.body.profession;
        var whichclass=ctx.req.body.whichclass;
        var telphone=ctx.req.body.telphone;
        var password=ctx.req.body.password;
        var rpassword=ctx.req.body.rpassword;
        if(pic){
            var json={
                pic:pic,
                pid:pid,
                associationName:associationName,
                stu_ID:stu_ID,
                username:username,
                sex:sex,
                senior:senior,
                department:department,
                profession:profession,
                whichclass:whichclass,
                telphone:telphone,
                password:tools.md5(password),
            
            }
        }else{
            var json={
                pid:pid,
                associationName:associationName,
                stu_ID:stu_ID,
                username:username,
                sex:sex,
                senior:senior,
                department:department,
                profession:profession,
                whichclass:whichclass,
                telphone:telphone,
                password:tools.md5(password),  
            }
        }

        if(password!=''){
            if(password!=rpassword || password.length<6){
                await ctx.render('admin/error',{
                    message:'密码和确认密码不一致，或者密码长度小于6位',
                    redirect:ctx.state.__HOST__+'/admin/user/edit?id='+id
                })
            }else{
                //更新社团成员信息
                var updateResult=await DB.update('associator',{"_id":DB.getObjectId(id)},json);
                ctx.redirect(ctx.state.__HOST__+'/admin/user');
            }
        }else{
            ctx.redirect(ctx.state.__HOST__+'/admin/user');
        }
    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:ctx.state.__HOST__+'/admin/user/edit?id='+id
        })
    }
})

router.get('/delete',async (ctx)=>{

    ctx.body="删除用户";

})

module.exports=router.routes();