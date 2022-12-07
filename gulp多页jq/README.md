### gulp-proxy
gulp构建项目配置<br/>
使用browser-sync实现页面自动刷新<br/>
使用http-proxy-middleware实现反向代理功能<br/>
实现css背景图片小于8k转base64<br/>
实现es6转es5<br/>
实现include引入公共头部底部html<br/>
实现less编译以及自动添加浏览器前缀兼容<br/>
[node版本与gulp3不兼容](https://johnnashs.github.io/2021/05/17/Gulp%E4%B8%8ENode%E7%89%88%E6%9C%AC%E4%B8%8D%E5%85%BC%E5%AE%B9/), 先清空node_modules，然后在根目录新建npm-shrinkwrap.json，再重新npm i所有包<br/>
gulp-imagemin包问题，gulp-imagemin: "^7.1.0"， 版本要7.1.0, 之前4.1.0包一直有问题

### 环境
```code
node 14.18.2
npm  6.14.15
gulp 3.9.1
```

在根目录下新建一个npm-shrinkwrap.json文件，配置如下
```code
{
  "dependencies": {
    "graceful-fs": {
        "version": "4.2.2"
    }
  }
}
```

### 命令

```code
npm install #安装依赖包
npm run dev #开发环境
npm run build #生产环境
```