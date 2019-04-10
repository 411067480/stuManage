var router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/',async (ctx)=>{

    var a=ctx.state.F;

    //ctx.body="社团活动";
    console.time('start');
    /*导航栏nav获取 */
    var nav=await DB.find('nav',{},{},{});
    /*获取社联公告第一条*/ 
    var association_announce_result = await DB.find('association_announce',{},{},{});

    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候将状态转化成number类型
    var focusResult=await DB.find('focus',{$or:[{'focusStatus':1},{'focusStatus':'1'}]},{},{
        sortJson:{'sort':1}
    });

    /* 页码选择器设置 */
    var page=ctx.query.page ||1;  //如果没有当前页，默认为第1页
    var pageSize=7;  //设置每页显示7条数据
    //查询总数量
    var count = await  DB.count('news',{});
    /*获取社团所有社团活动*/
    var news = await DB.find('news',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'edit_time':-1  
            //'edit_time':-1：倒序排序，最新修改或增加的数据会优先显示在第一条
            //'edit_time':1：正序排序，最新修改或增加的数据会优先显示在最后一条
        }
    });
    //console.log(news);

    console.timeEnd('start');
    ctx.render('default/news',{
        nav:nav,
        dataG:a,
        focus:focusResult,
        association_announce_result:association_announce_result[0],
        news:news,
        page:page,
        totalPages:Math.ceil(count/pageSize)//计算总页数，平均每页7条数据
    });

})



//动态路由获取get传值

router.get('/newsContent/:id',async(ctx)=>{
    /*导航栏nav获取 */
    var nav = await DB.find('nav',{},{},{});
    var a=ctx.state.F;
    //console.log(ctx.params);
    var id=ctx.params.id;
    // //打印出被选择对象的id
    console.log(id);
    var currentResult = await DB.find('news',{'_id':DB.getObjectId(id)}); 
    //console.log(result[0].associationName);
    var allData = await DB.find('news',{},{},{});
    ctx.render('default/newsContent',{
        nav:nav,
        currentResult:currentResult,
        dataG:a,
        allData:allData
    });

})



module.exports=router.routes();