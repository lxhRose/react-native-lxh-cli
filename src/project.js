const inquirer = require('inquirer'); // inquirer负责问询
const fse = require('fs-extra'); // fs-extra负责文件的复制
const download = require('download-git-repo'); // download-git-repo负责下载对应模板项目的git仓库
const { TEMPLATE_GIT_REPO } = require('./constants');
const chalk = require('chalk'); // 改变命令行输出样式
const { green, red, grey } = chalk;
const ora = require('ora'); // 一个优雅地命令行交互spinner
const path = require('path');
const { getDirFileName } = require('./utils');
const { exec } = require('child_process'); // child_process负责执行命令行

function Project(options) {
  this.config = Object.assign({
    projectName: '',
    version: ''
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
  this.initReactNative();
}

/**
 * 1、用 React-Native 脚手架初始化项目
 */
Project.prototype.initReactNative = function () {
  const { projectName, version } = this.config;
  console.log();
  let _version = typeof version === 'string' ? `--version ${version}` : '';
  const RNINIT = `react-native init ${projectName} ${_version}`;
  const RNinitSpinner = ora(`初始化项目 ${green.bold(RNINIT)}, 大概需要几分钟的时间，请耐心等待...`);
  RNinitSpinner.start();
  exec(RNINIT, (error, stdout, stderr) => {
    if (error) {
      RNinitSpinner.color = 'red';
      RNinitSpinner.fail(red('初始化项目失败！请确保您已经全局安装过react-native-cli'));
      console.log(error);
    } else {
      RNinitSpinner.color = 'green';
      RNinitSpinner.succeed('初始化项目成功！');
      console.log(`${stderr}${stdout}`);
      this.downloadTemplate(projectName);
    }
  });
}

/**
 * 2、下载自己git上存放的模板和必要文件
 */
Project.prototype.downloadTemplate = function (projectName) {
  console.log();
  const downloadSpinner = ora('正在下载模板，请稍等...');
  downloadSpinner.start();
  const projectPath = path.join(process.cwd(), projectName);
  const downloadPath = path.join(projectPath, '__download__');
  download(TEMPLATE_GIT_REPO, downloadPath, { clone: true }, (err) => {
    if (err) {
      downloadSpinner.color = 'red';
      downloadSpinner.fail(err.message);
      return;
    }
    downloadSpinner.color = 'green';
    downloadSpinner.succeed('下载模板成功！');

    // 复制文件
    console.log();
    const copyFiles = getDirFileName(downloadPath);

    copyFiles.forEach((file) => {
      fse.copySync(path.join(downloadPath, file), path.join(projectPath, file));
      console.log(`${green('√')}${grey(` 创建: ${projectName}/${file}`)}`);
    });

    fse.remove(downloadPath);
    process.chdir(projectPath);
    this.installDependency();
  });
}

/**
 * 3、安装依赖
 */
Project.prototype.installDependency = function () {
  this.dependencyFunc('yarn add', (yarnSpinner, error) => {
    yarnSpinner.fail(red('安装项目依赖失败，将改用 npm install 安装！'));
    console.log(error);
    this.dependencyFunc('npm install', (yarnSpinner, error) => {
      yarnSpinner.fail(red('安装项目依赖失败，请自行重新安装！'));
      console.log(error);
    });
  });
}

Project.prototype.dependencyFunc = function (type, errorFunc) {
  console.log();
  const INSTALL = 'axios@^0.19.0 react-native-gesture-handler@^1.3.0 react-native-linear-gradient@^2.5.4 react-native-ui-lvxinghai react-native-webview@^5.12.1 react-navigation@^3.11.0 react-redux@^7.1.0 redux@^4.0.1 redux-logger@^3.0.6 redux-thunk@^2.3.0 @react-native-community/async-storage@^1.5.0';
  const yarnSpinner = ora(`安装项目依赖 ${green.bold(`${type} ${INSTALL}`)}, 请稍后...`);
  yarnSpinner.start();
  exec(`${type} ${INSTALL}`, (error, stdout, stderr) => {
    if (error) {
      yarnSpinner.color = 'red';
      errorFunc(yarnSpinner, error);
    } else {
      yarnSpinner.color = 'green';
      yarnSpinner.succeed('安装依赖成功！');
      console.log(`${stderr}${stdout}`);
      console.log();
      console.log(`${green('√')}${green(' 项目创建成功！')}`);
      console.log();
      console.log(`${green('√')}${green(' 开始愉快地搬砖吧！')}`);
    }
  });
}

module.exports = Project;
