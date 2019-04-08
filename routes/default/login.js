var router = require('koa-router')();

var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');

router.get('/',async (ctx)=>{
    await ctx.render('default/login');
});

router.post('/doLogin',async (ctx)=>{

    //首先前往数据库匹配数据

    var stu_ID = ctx.request.body.stu_ID;
    var password = ctx.request.body.password;
   
   
    //1、验证学号，密码是否合法

    //2、去数据库匹配

    //3、成功以后把用户信息写入sessoin
    //(code.toLocaleLowerCase()==ctx.session.code.toLocaleLowerCase():大写英语转换小写
   
        var result = await DB.find('associator',{'stu_ID':stu_ID,'password':tools.md5(password)});
        
        //后台务必要验证学号与密码是否合法
        //console.log(code);

        if(result.length>0){
            ctx.session.userinfo=result[0];
           
            //更新会员表，改变会员登录的时间
            await DB.update('associator',{'_id':DB.getObjectId(result[0]._id)},{
                last_time:new Date()
            })

            var headerResult=await DB.find('associator',{"_id":DB.getObjectId(result[0]._id)});
            //console.log(headerResult);
            ctx.redirect(ctx.state.__HOST__+'/',{
                headerphoto:headerResult[0],
                headerphoto: console.log(headerResult[0])
            });
        }else{
            //console.log('失败');
            ctx.render('default/error',{
                message:'会员名或密码错误',
                redirect:ctx.state.__HOST__+'/login'
            })
        }
    
})



module.exports=router.routes();