
var router = require('koa-router')();

const DB = require('../../model/db.js');

const tools = require('../../model/tools.js');
//验证码模块
var svgCaptcha = require('svg-captcha');

router.get('/',async (ctx)=>{
    
    await ctx.render('admin/login');

})

router.post('/doLogin',async (ctx)=>{

    //console.log(ctx.request.body);  //表单输入后提交打印出如下信息：{manageName: "admin", password: "123456", code: "11"}
    //ctx.redirect(ctx.state.__HOST__+'/admin');

    //首先前往数据库匹配数据

    var manageName = ctx.request.body.manageName;
    var password = ctx.request.body.password;
    var code = ctx.request.body.code; //输入的验证码为：code
   
    //1、验证用户名密码是否合法

    //2、去数据库匹配

    //3、成功以后把用户信息写入sessoin
    //(code.toLocaleLowerCase()==ctx.session.code.toLocaleLowerCase():大写英语转换小写
    if(code == ctx.session.code){//如果输入的验证码与随机生成的验证码一致，则 执行2、数据库匹配操作
        var result = await DB.find('admin',{'manageName':manageName,'password':tools.md5(password)});
        //await DB.insert('admin',{'manageName':manageName,'password':tools.md5(password)});
        //后台务必要验证用户名与密码是否合法
        //console.log(code);
        if(result.length>0){
            //console.log(result);
            //保存数据;
            ctx.session.userinfo=result[0];
           
            //更新用户表，改变用户登录的时间
            await DB.update('admin',{'_id':DB.getObjectId(result[0]._id)},{
                last_time:new Date()
            })

            var headerResult=await DB.find('admin',{"_id":DB.getObjectId(result[0]._id)});
            //console.log(headerResult);
            ctx.redirect(ctx.state.__HOST__+'/admin',{
                headerphoto:headerResult[0],
                headerphoto: console.log(headerResult[0])
            });
        }else{
            //console.log('失败');
            ctx.render('admin/error',{
                message:'用户名或密码错误',
                redirect:ctx.state.__HOST__+'/admin/login'
            })
        }
    }else{
         //console.log('失败');
         
         ctx.render('admin/error',{
            message:'用户名或密码错误',
            redirect:ctx.state.__HOST__+'/admin/login'
        })
    }
})


router.get('/code',async (ctx)=>{
    
    // var captcha = svgCaptcha.create({
    //     size:4,
    //     fontSize: 35,
    //     width: 120,
    //     height:34,
    //     background:"#cc9966"
    // });

    //加法的验证码
    var captcha = svgCaptcha.createMathExpr({
       size:4,
       fontSize: 35,
       width: 120,
       height:34,
       background:"#cc9966"
    });
    //console.log(captcha.text);

    //保存生成的验证码:captcha.text
    ctx.session.code=captcha.text;
    //设置响应头
    ctx.response.type = 'image/svg+xml';
    ctx.body=captcha.data;
})

router.get('/loginOut',async (ctx)=>{
    ctx.session.userinfo=null;
    ctx.redirect(ctx.state.__HOST__+'/admin/login');
})


module.exports=router.routes();