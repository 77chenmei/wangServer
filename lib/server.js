const Koa = require('koa')
const app = new Koa()

const fs = require('fs');
const path = require('path');
const serve = require('koa-static');
const chalk = require('chalk');

const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')

const router = new Router();

app.use(bodyParser())

// 获取配置文件及端口信息
if (fs.existsSync(path.resolve(process.cwd(), 'config.json'))) {
  let CONFIG = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'config.json'))) || {};
  if (CONFIG.apilist && CONFIG.apilist.length !== 0) {
    let apis = CONFIG.apilist;
    apis.forEach((item, index) => {
      if (item.method === "GET") {
        router.get(item.url, (ctx, next) => {

          ctx.set("Access-Control-Allow-Origin", "*");
          ctx.set("Access-Control-Allow-Methods", "GET, POST");
          if (item.cookies && item.cookies.length != 0) {
            item.cookies.forEach((i) => {
              ctx.cookies.set(i.name, i.value);
            })
          }
          ctx.body = item.res
          next()
        })
      }

      if (item.method === "POST") {
        router.post(item.url, async (ctx, next) => {
          ctx.set("Access-Control-Allow-Origin", "*");
          ctx.set("Access-Control-Allow-Methods", "GET, POST");
          if (item.cookies && item.cookies.length != 0) {
            item.cookies.forEach((i) => {
              ctx.cookies.set(i.name, i.value);
            })
          }

          ctx.response.body = ctx.request.body
          next()
        })
      }
    });
    // 启用配置路由
    app
      .use(router.routes())
      .use(router.allowedMethods());
  }
}

// 启动静态路由
app.use(serve(process.cwd()));

// logger
app.use(async (ctx, next) => {
  if (ctx.response.status === 404) {
    ctx.redirect('lib/index.html')
  }

  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(chalk.dim(`${ctx.method} ${ctx.url} - ${ms}ms`))
})

// console.log(`服务器已启动，监听端口${port}`);

module.exports = app;
