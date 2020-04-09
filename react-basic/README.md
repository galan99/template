# 1、创建项目
```code
    npm i create-react-app -g // 全局安装create-react-app
    create-react-app --version //查看版本
    create-reat-app myproject // 创建项目

    // 新建项目比较慢切换淘宝源
    npm config set registry https://registry.npm.taobao.org
    npm config set registry https://registry.npmjs.org
```

https://www.jianshu.com/p/3fd7d90db01a 解决npm安装任何包失败

# 2、npm run eject
显示create-react-app默认配置文件以便安装less,sass
  
先执行npm run eject再去安装项目其他依赖

# 3、项目路径简写
npm run eject后在webpack.config.js中alias添加

```code
'@': path.resolve(__dirname,'../src'),
'@com':path.resolve(__dirname, '../src/components'),
```

# 4、按需加载ant-design组件
```code
    npm i antd --save
    npm install babel-plugin-import --save-dev
```
在package.json中加入
```javascript
{
    //...
    "babel": {
        "presets": [
            "react-app"
        ],
        "plugins": [
            [
                "import",
                {
                    "libraryName": "antd",
                    "libraryDirectory": "es",
                    "style": "css"
                }
            ]
        ]
    },
}
```

# 5、使用less或者scss

less使用
```code
    npm i less less-loader --save-dev
```
修改文件webpack.config.js
```javascript
    //const cssRegex = /\.css$/; 改成下面
    const cssRegex = /\.(css|less)$/;

    // 在getStyleLoaders函数添加以下
     {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('less-loader'),
        options: cssOptions,
      },
```

scss使用只安装node-sass

```code
    npm i node-sass --save-dev
```

# 6、react路由
```javascript
    // npm install react-router-dom --save
    import React from 'react';
    import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
    import Index from '../views/Index/index';
    import List from '../views/List/list';

    const routers = [
        {path: "/", component: Index},
        {path: "/list", component: List, auth: true},
        {path: "/login", component: Login},
    ]

    export default class BasicRoute extends React.Component{
        constructor(props){
            super(props)
        }
        render(){
            return (
                <HashRouter>
                    <Switch>
                        {
                            routers.map((item, index) => {
                                return <Route key={index} exact path={item.path}
                                    render={props => (<item.component {...props} />)}
                                />
                            })
                        } 
                    </Switch>
                </HashRouter>
            )
        }
    }
```

# 7、开发环境代理跨域

```code
npm install http-proxy-middleware --save-dev
```
在src目录新建setupProxy.js

```javascript
const { createProxyMiddleware } = require ('http-proxy-middleware');

const $url = 'http://sandbox-ipggsd.gamdream.com'
const proxylist = [
  '/user', '/config', '/site', '/menu', '/kf'
]

module.exports = function(app) {
  proxylist.forEach(key => {
    app.use(
      key,
      createProxyMiddleware({
        target: $url,
        changeOrigin: true,
      })
    );
  })
};
```

# 8、封装axios请求

```code
npm install axios --save
```
> 封装axios

```javascript
import axios from "axios"
import { message } from 'antd';
//  创建axios实例
const $axios = axios.create({
  baseURL: '/', // api的base_url
  timeout: 8000 // 请求超时时间
})


//  request拦截器
$axios.interceptors.request.use(config => {
  if (config.url.indexOf('login') === -1) {
    config.headers.common['token'] = localStorage.token
  }
  if (config.url.indexOf('uploadImg') !== -1) {
    config.headers.common['Content-Type'] = 'multipart/form-data'
  }
  return config
}, error => { 
  //请求错误处理   
  message.error(error);
  return Promise.reject(error)
})

//  response拦截器
$axios.interceptors.response.use(
  response => { 
    //成功请求到数据    
    if (response.status === 200) {
      if (!response.data.err) {
        return response.data
      } else {
        message.error(response.data.msg)
      }
    } else {
      message.error(response.data.msg)
    }
  },
  error => { 
    //响应错误处理
    message.error('网络异常，请重试')
    return Promise.reject(error)
  }
)

export default $axios
```

> 使用方法

```javascript
import $axios from "/src/utils/http";
async componentWillMount() {
    const result = await $axios.get('/config/list')
    console.log(result)
}
```

# 9、a链接标准写法
需要写上rel="noopener noreferrer"
```code
  <a target="_blank" rel="noopener noreferrer" href="//www.idreamsky.com/home/about/?type=introduce">关于我们</a>
```