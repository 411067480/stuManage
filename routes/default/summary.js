var router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/',async (ctx)=>{
    var a=ctx.state.F;

    //ctx.body="前台首页";
    console.time('start');
    /*导航栏nav获取 */
    var nav = await DB.find('nav',{},{},{});
    /*获取社联公告第一条*/ 
    // var association_announce_result = await DB.find('association_announce',{},{},{});
    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候将状态转化成number类型
    var focusResult=await DB.find('focus',{$or:[{'focusStatus':1},{'focusStatus':'1'}]},{},{
        sortJson:{'sort':1}
    })
   
    //获取社团分类
    var page =ctx.query.page||1;
    var pageSize=9;
    var associationcateResult = await DB.find('associationcate',{},{},{
        //查询的条件：第几页多少条？
        page,
        pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    //查询社团----总数量count有多少？
    var count=await DB.count('associationcate',{});

    
    /* 获取社团活动 */
    // var activity = await DB.find('acivity',{},{},{});

    console.timeEnd('start');

    ctx.render('default/summary',{
        nav:nav,
        dataG:a,
        focus:focusResult,
        associationcateResult:associationcateResult,
        page:page,
        totalPages:Math.ceil(count/pageSize),
        // association_announce_result:association_announce_result[0],
        // activity:activity
    });
})



//动态路由获取get传值
router.get('/fromIndexToplaySummaryContent/:id',async(ctx)=>{
    //console.log(ctx.params);
    var id=ctx.params.id;
    //打印出被选择对象的id
    //console.log(id);
    var result = await DB.find('associationcate',{'_id':DB.getObjectId(id)}); 
    console.log(result[0].introcoverphoto);

    ctx.render('default/fromIndexToplaySummaryContent',{
        list:result
    });

})
module.exports=router.routes();