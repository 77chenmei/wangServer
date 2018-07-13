#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const app = require('../lib/server');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 版本命令
program.version('0.0.1');

program
  .command('help')
  .description('显示使用帮助')
  .action(function () {
    program.outputHelp();
  })

program
  .command('start [dir]')
  .description('启动静态服务器')
  .action(function () {
    // 获取用户端口
    let filepath = path.resolve(process.cwd(), 'config.json');
    let port = 3000;
    fs.access(filepath, fs.constants.F_OK, (err) => {
      if (err) {
        // 文件不存在
        console.log(chalk.bgYellow(`不存在config.json文件，使用默认设置`))
      } else {
        // 文件存在
        let CONFIG = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'config.json'))) || {};
        port = CONFIG.port || 3000;
        console.log(chalk.bgGreen(`存在config.json文件，可以在文件中设置端口或者虚拟api接口`))
      }
      let server = app.listen(port)
      console.log(chalk.green(`静态服务器启动`))
      console.log(chalk.green(`路径：${process.cwd()}`))
      console.log(chalk.green(`端口：${port}`))
      let ipinfo = getipv4();
      if (ipinfo['本地连接']) {
        console.log(chalk.green(`本地IP：${ipinfo['本地连接'][1].address}`))
      }else if (ipinfo['以太网']) {
        console.log(chalk.green(`本地IP：${getipv4()['以太网'][1].address}`))
      }
      console.log(chalk.green(`日志： `))
    })
  })

program
  .command('init')
  .description('生成config.json文件模板')
  .action(function () {
    console.log(`生成config.json文件模板`)
  })

program
  .command('edit [dir]')
  .description('启动测试页面，编辑api接口')
  .action(function () {
    console.log(`测试页面已经启动，路径为${process.cwd()}`)
  })

program.parse(process.argv);

// 获取IPV4的地址
function getipv4() {
  return os.networkInterfaces()
}