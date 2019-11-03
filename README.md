react-native-lxh-cli
===
简介
===
这是一个基于 react-native-cli 的react-native项目构建脚手架；同时带有模板文件。  

安装：  
---
    npm install -g react-native-lxh-cli
    
如果你还没有安装过yarn和react-native-cli，请先安装：

    npm install -g yarn react-native-cli   
使用
---
    newrn init projectName 
创建一个带有如下功能的React-Native项目：
1、页面路由；  
2、redux状态管理；  
3、axios网络请求；  
4、async-storage本地缓存；   
5、DateFormat时间格式化；    
6、LoadImg图片缓存；   
7、adaptation页面自适应；   
8、Loading组件；   
9、Massage多功能提示框；   
10、template组件模板（components/template）。  

由于初始化项目仍然使用的 react-native-cli，所以不必担心版本不是最新的问题。  
提示：你可以使用--version参数（注意是两个杠）创建指定 react-native 版本的项目。例如 newrn init MyApp --version 0.44.3。注意版本号必须精确到两个小数点。

本地测试
---
    npm link  
    newrn init projectName
