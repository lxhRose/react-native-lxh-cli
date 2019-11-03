react-native-lxh-cli
===
简介
===
这是一个基于`react-native-cli`和`yarn`的`react-native`项目构建脚手架;  
它可以创建一个带有网络请求、路由菜单、组件模板......等等一系列必备功能的项目。  

安装：  
---
    npm install -g react-native-lxh-cli
    
如果你还没有安装过`yarn`和`react-native-cli`，请先安装：

    npm install -g yarn react-native-cli   
使用
---
    newrn init projectName 
    
执行如上命令，创建一个带有如下功能的`react-native`项目：  
  
1、页面路由；  
2、`redux`状态管理；  
3、`axios`网络请求；  
4、`async-storage`本地缓存；   
5、`DateFormat`时间格式化；    
6、`LoadImg`图片预加载；   
7、`adaptation`页面自适应；   
8、`Loading`组件；   
9、`Massage`多功能提示框；   
10、`template`组件模板（`components/template`）。  

    提示：你可以使用--version参数（注意是两个杠）创建指定 react-native 版本的项目。
    例如 newrn init MyApp --version 0.44.3。注意版本号必须精确到两个小数点。

本地测试
---
项目根目录执行：  

    node bin/begin init projectName 
  
或者link到全局：

    npm link  
    newrn init projectName
