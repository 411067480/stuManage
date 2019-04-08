var router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/',async (ctx)=>{
    var a=ctx.state.F;
    //ctx.body="社团招新";
    console.time('start');
    /*导航栏nav获取 */
    var nav = await DB.find('nav',{},{},{});    
    /*获取社联公告第一条*/ 
    var association_announce_result = await DB.find('association_announce',{},{},{});

     /* 页码选择器设置 */
     var page=ctx.query.page ||1;  //如果没有当前页，默认为第1页
     var pageSize=5;  //设置每页显示7条数据
     //查询总数量
     var count = await  DB.count('vote',{});
    /*获取社联公告所有*/ 
    var allResult = await DB.find('vote',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'vote_time':-1  
            //'vote_time':-1：倒序排序，最新修改或增加的数据会优先显示在第一条
            //'vote_time':1：正序排序，最新修改或增加的数据会优先显示在最后一条
        }
    });
    console.log(association_announce_result);
    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候将状态转化成number类型
    var focusResult=await DB.find('focus',{$or:[{'focusStatus':1},{'focusStatus':'1'}]},{},{
        sortJson:{'sort':1}
    })

    console.timeEnd('start');
    ctx.render('default/vote',{
        nav:nav,
        dataG:a,
        focus:focusResult,
        association_announce_result:association_announce_result[0],
        allResult:allResult,
        page:page,
        totalPages:Math.ceil(count/pageSize)//计算总页数
    });
})

module.exports=router.routes();