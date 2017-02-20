---
title: gulp
date: 2016-11-02 23:40:09
tags: [gulp,代码优化]
categories: 自动化构建工具
---

初识gulp自动化构建工具。一开始只是听过这个东西，没有尝试用过。听起来好像很高大上的样子，一直想要去尝试用一下，但一直没有去用过。一来现在的项目没有用到；二来之前好像确实是挺忙的，没有找到什么合适的时间去尝试用下；三来嘛感觉这么高大上的东西可能学起来应该会很难，会花费很多时间。
ps：很多事情只有去尝试了才会知道难不难，很多东西你觉得难可能是因为你没有用过它，或者不知道它是用来做什么的，只有你勇敢的踏出一步去尝试用下，你就会发现其实没有那么难。(●'◡'●)
<!-- more -->

## 介绍
通过代码优于配置的策略，Gulp 让简单的任务简单，复杂的任务可管理。
利用 Node.js 流的威力，你可以快速构建项目并减少频繁的 IO 操作。
Gulp 严格的插件指南确保插件如你期望的那样简洁高质得工作。
通过最少的 API，掌握 Gulp 毫不费力，构建工作尽在掌握：如同一系列流管道。

## 入门指南
1. 全局安装 gulp：
``` bash
$ npm install --global gulp
```
2. 作为项目的开发依赖（devDependencies）安装：
``` bash
$ npm install --save-dev gulp
```
3. 在项目根目录下创建一个名为 gulpfile.js 的文件：
var gulp = require('gulp');

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});
4. 运行 gulp：
``` bash
$ gulp default
```

## 常用的一些插件

> * gulp-minify-css	压缩css
> * gulp-uglify	压缩js
> * gulp-htmlmin	压缩html
> * gulp-imagemin	压缩图片
### 安装
``` bash
$ npm install [plugins-name] --save
```
上述命令安装插件的同时也会把插件作为项目依赖写入package.json文件.

参考：
[guly官网(包含插件搜索)](http://gulpjs.com/)
[guly中文网站](http://www.gulpjs.com.cn/)