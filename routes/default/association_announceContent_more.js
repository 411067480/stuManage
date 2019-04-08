var router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/',async(ctx)=>{
    var prev=ctx.state.prev;
    var all = await DB.find('association_announce',{},{},{});   //此处获取所有对象，方便一一列举。
    // console.log(all);
    ctx.render('default/association_announceContent_more',{
        prev:prev,
        list:all
    })
})


module.exports=router.routes();