let koa = require('koa')
let jwt = require('koa-jwt')
let json = require('koa-json')
let logger = require('koa-logger')
let parser = require('koa-bodyparser')
let router = new require('koa-router')()
let routerList = require('../server/routes/auth')
let static = require('koa-static')
let path = require('path')
let historyApiFallback = require('koa-history-api-fallback');



let app = new koa()
app.use(json())
app.use(logger())
app.use(parser())
app.use(historyApiFallback()); // 在这个地方加入。一定要加在静态文件的serve之前，否则会失效。


//启动服务器
app.listen(80 ,()=> {
  console.log('[koa] start!')
})

// 静态文件serve在koa-router的其他规则之上
app.use(static(
  path.join(__dirname, "../dist")
));



router.use('/api', routerList.routes()) //装载父路由
app.use(routerList.routes()) // 注册路由



// app.use(async (next)=> { //  如果JWT验证失败，返回验证失败信息
//   try {
//     await next;
//   } catch (err) {
//     if (401 == err.status) {
//       this.status = 401;
//       this.body = {
//         success: false,
//         token: null,
//         info: 'Protected resource, use Authorization header to get access'
//       };
//     } else {
//       throw err;
//     }
//   }
// });



//koa.use("/api",jwt({secret: 'vue-koa-demo'}),api.routes())
// 所有走/api/打头的请求都需要经过jwt中间件的验证。secret密钥必须跟我们当初签发的secret一致
module.exports = app;