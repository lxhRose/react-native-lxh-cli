const inquirer = require('inquirer'); // inquirer负责问询
const fse = require('fs-extra'); // fs-extra负责文件的复制
const download = require('download-git-repo'); // download-git-repo负责下载对应模板项目的git仓库
const { TEMPLATE_GIT_REPO } = require('./constants');
const chalk = require('chalk'); // 改变命令行输出样式
const { green, red, grey, yellow } = chalk;
const ora = require('ora'); // 一个优雅地命令行交互spinner
const path = require('path');
const { getDirFileName } = require('./utils');
const { exec } = require('child_process'); // child_process负责执行命令行

function Project(options) {
  this.config = Object.assign({
    projectName: ''
  }, options);
}

Project.prototype.create = function () {
  this.inquire()
    .then((answer) => {
      this.config = Object.assign(this.config, answer);
      this.generate();
    });
};

Project.prototype.inquire = function () {
  const prompts = [];
  const { projectName } = this.config;
  if (typeof projectName !== 'string') {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: '请输入项目名：',
      validate(input) {
        if (!input) {
          return '项目名不能为空';
        }
        if (fse.existsSync(input)) {
          return '当前目录已存在同名项目，请更换项目名';
        }
        return true;
      }
    });
  } else if (fse.existsSync(projectName)) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: '当前目录已存在同名项目，请更换项目名',
      validate(input) {
        if (!input) {
          return '项目名不能为空';
        }
        if (fse.existsSync(input)) {
          return '当前目录已存在同名项目，请更换项目名';
        }
        return true;
      }
    });
  }

  return inquirer.prompt(prompts);
};

Project.prototype.generate = function () {
  const { projectName } = this.config;

  // 用RN脚手架创建项目，以保证项目的依赖版本为最新
  console.log();
  const RNinitSpinner = ora(`初始化项目 ${green.bold(`react-native init ${projectName}`)}, 这个过程比较漫长，请耐心等待...`);
  RNinitSpinner.start();
  exec(`react-native init ${projectName}`, (error) => {
    if (error) {
      RNinitSpinner.color = 'red';
      RNinitSpinner.fail(red('初始化项目失败！'));
      console.log(error);
    } else {
      RNinitSpinner.color = 'green';
      RNinitSpinner.succeed('初始化项目成功！');

      const projectPath = path.join(process.cwd(), projectName);
      const downloadPath = path.join(projectPath, '__download__');

      // 下载模板
      console.log();
      const downloadSpinner = ora('正在下载模板，请稍等...');
      downloadSpinner.start();

      download(TEMPLATE_GIT_REPO, downloadPath, { clone: true }, (err) => {
        if (err) {
          downloadSpinner.color = 'red';
          downloadSpinner.fail(err.message);
          return;
        }
        downloadSpinner.color = 'green';
        downloadSpinner.succeed('下载成功！');

        // 复制文件
        console.log();
        const copyFiles = getDirFileName(downloadPath);

        copyFiles.forEach((file) => {
          fse.copySync(path.join(downloadPath, file), path.join(projectPath, file));
          console.log(`${green('√')}${grey(` 创建: ${projectName}/${file}`)}`);
        });

        fse.remove(downloadPath);
        process.chdir(projectPath);

        console.log();
        console.log(`${green('√')}${green(' 创建项目成功！')}`);
        console.log();
        console.log(`${green('√')}${green(' 开始愉快地搬砖吧！')}`);
        console.log();
        console.log();
        console.log(yellow(`完成如下两步，就大功告成了：`));
        console.log();
        console.log(yellow(`1、进入项目根目录：cd projectName`));
        console.log();
        console.log(yellow(`2、安装依赖：yarn add axios react-native-gesture-handler react-native-reanimated react-native-screens react-native-ui-lvxinghai react-native-webview react-navigation react-redux redux redux-logger redux-thunk @react-native-community/async-storage`));
        console.log(yellow(`（或者使用 npm install 代替 yarn add）`));
      })
    }
  })
}

module.exports = Project;
