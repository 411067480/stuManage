/**
 * Created by Administrator on 2018/3/20 0020.
 */
var router = require('koa-router')();

router.get('/',async (ctx)=>{
    ctx.body="api接口";
})
module.exports=router.routes();