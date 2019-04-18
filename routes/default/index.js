var router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/',async (ctx)=>{
    var a=ctx.state.F;
    console.log(ctx.state.F);
    console.time('start');
    var vote = await DB.find('vote',{},{},{});
    /*导航栏nav获取 */
    var nav = await DB.find('nav',{},{},{});
    /*获取社联公告第一条*/ 
    var association_announce_result = await DB.find('association_announce',{},{},{});
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
            'update_time':-1
        }
    });
    var aResult = await DB.find('associationcate',{},{},{
        sortJson:{
            'update_time':-1
        }
    });
    //查询社团----总数量count有多少？
    var count=await DB.count('associationcate',{});
    /* 获取社团活动 */
    var page =ctx.query.page||1;
    var pageSize=7;
    var news = await DB.find('news',{},{},{
        page,
        pageSize,
        sortJson:{
            'add_time':-1
        }
    });
    console.timeEnd('start');
    ctx.render('default/index',{
        vote:vote,
        aResult:aResult,
        nav:nav,
        dataG:a,
        focus:focusResult,
        associationcateResult:associationcateResult,
        page:page,
        totalPages:Math.ceil(count/pageSize),
        association_announce_result:association_announce_result[0],
        news:news
    });
})

//动态路由获取get传值
router.get('/fromIndexToplaySummaryContent/:id',async(ctx)=>{
    //console.log(ctx.params); 获取成功
    var id=ctx.params.id;
    //打印出被选择对象的id
    console.log(id);
    var result = await DB.find('associationcate',{'_id':DB.getObjectId(id)}); 

    ctx.render('default/fromIndexToplaySummaryContent',{
        list:result
    });

})


module.exports=router.routes();