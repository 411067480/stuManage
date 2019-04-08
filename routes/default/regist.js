var router = require('koa-router')();

var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    var catelist=await DB.find('associationcate',{},{},{});
    await ctx.render('default/regist',{
        catelist:tools.cateToList(catelist)
    });
});

router.post('/doRegist',async(ctx)=>{
    console.log(ctx.request.body);
    let pid=ctx.request.body.pid;
    var stu_ID = ctx.request.body.stu_ID;
    var username = ctx.request.body.username;
    var telphone = ctx.request.body.telphone;
    var password =ctx.request.body.password;
    var rpassword =ctx.request.body.rpassword;
    var senior = ctx.request.body.senior;
    var department = ctx.request.body.department;
    var profession = ctx.request.body.profession;
    var whichclass = ctx.request.body.whichclass;
    var associationName = ctx.request.body.associationName.trim();
    var sex = ctx.request.body.sex;
    var json={
        pid:pid,
        stu_ID:stu_ID,
        username:username,
        telphone:telphone,
        password:tools.md5(password),
        rpassword:rpassword,
        senior:senior,
        department:department,
        profession:profession,
        whichclass:whichclass,
        associationName:associationName,
        sex:sex
    }

    //数据库查询当前社团成员是否存在:根据学号来判断
    var findNumResult=await  DB.find('associator',{"stu_ID":stu_ID});
    var findTelResult=await  DB.find('associator',{"telphone":telphone});
    if(findNumResult.length>0){
        await  ctx.render('default/error',{
            message:'对不起，此学号已被注册',
            redirect:ctx.state.__HOST__+'/regist'
        })
    }else if(findTelResult.length>0){
        await  ctx.render('default/error',{
            message:'对不起，此手机号已被注册，请换个号码试试',
            redirect:ctx.state.__HOST__+'/regist'
        })
    }else{
        await DB.insert('associator',json);
        ctx.redirect(ctx.state.__HOST__+'/login');
    }
    
   
})

module.exports=router.routes();