react-native-lxh-cli
===
简介
===
这是一个`react-native`项目构建脚手架;  
它可以创建一个带有网络请求、导航器、组件模板......等等一系列必备功能的项目。  

安装：  
---
    npm install -g react-native-lxh-cli
    
如果你还没有安装过`yarn`和`react-native-cli`，请先安装：

    npm install -g yarn react-native-cli   
使用
---
    newrn init projectName 
    
执行如上命令，创建一个带有如下功能的`react-native`项目：  
  
1、导航器`react-navigation`；  
2、状态管理`redux`；  
3、网络请求`axios`；  
4、本地缓存`async-storage`；   
5、时间格式化`DateFormat`；    
6、图片预加载`LoadImg`；   
7、页面自适应`adaptation`；   
8、加载提示`Loading`；   
9、多功能消息弹框`Massage`；   
10、组件模板`template`（`src/components/template`）。  

    提示：你可以使用 --version 参数（注意是两个杠）创建指定 react-native 版本的项目。
    例如 newrn init MyApp --version 0.44.3。注意版本号必须精确到两个小数点。

本地测试
---
项目根目录执行：  

    node bin/begin init projectName 
  
或者link到全局：

    npm link  
    newrn init projectName
