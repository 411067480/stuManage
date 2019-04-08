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
     var pageSize=2;  //设置每页显示7条数据
     //查询总数量
     var count = await  DB.count('association_announce',{});
    /*获取社联公告所有*/ 
    var allResult = await DB.find('association_announce',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1  
            //'add_time':-1：倒序排序，最新修改或增加的数据会优先显示在第一条
            //'add_time':1：正序排序，最新修改或增加的数据会优先显示在最后一条
        }
    });
    console.log(association_announce_result);
    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候将状态转化成number类型
    var focusResult=await DB.find('focus',{$or:[{'focusStatus':1},{'focusStatus':'1'}]},{},{
        sortJson:{'sort':1}
    })

    console.timeEnd('start');
    ctx.render('default/association_announce',{
        nav:nav,
        dataG:a,
        focus:focusResult,
        association_announce_result:association_announce_result[0],
        allResult:allResult,
        page:page,
        totalPages:Math.ceil(count/pageSize)//计算总页数
    });
})


//社联公告--动态路由获取get传值
router.get('/association_announceContent/:id',async(ctx)=>{
    //console.log(ctx.params);
    var id=ctx.params.id;
    //console.log('ctx.params中的ID值'+id);
    var oneResult = await DB.find('association_announce',{'_id':DB.getObjectId(id)}); //此处获取上一页被点击选择的对象。有且仅有一条数据
    //console.log(oneResult[0]);
    ctx.render('default/association_announceContent',{
        oneResult:oneResult,
    });
})





module.exports=router.routes();