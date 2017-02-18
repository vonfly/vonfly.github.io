---
title: GitHub+Hexo+Next搭建免费独立个人博客
date: 2016-01-22 20:20:58
tags: [hexo]
categories: 其它
---
我为什么要搭建个人博客呢，一来有自己的博客会显得高大尚一点，二来也可以当作学习新知识

<!-- more -->

## 搭建步骤
node.js Git 是必须工具

### 安装Git
前往[Git官网](https://git-scm.com/downloads)下载Windows版本压缩包，下载完成后解压安装。（一直下一步即可）

当你安装Git后首先要做的事情是设置你的用户名称和e-mail地址。这是非常重要的，因为每次Git提交都会使用该信息。它被永远的嵌入到了你的提交中：在命令行中输入：
``` bash
$ git config --global user.name "your username"
$ git config --global user.email "your e-mail"
```
重申一遍，你只需要做一次这个设置。如果你传递了 --global 选项，因为Git将总是会使用该信息来处理你在系统中所做的一切操作。如果你希望在一个特定的项目中使用不同的名称或e-mail地址，你可以在该项目中运行该命令而不要--global选项。



### 安装Node.js
前往[Node.js官方](https://nodejs.org/en/download/)下载网站，选择适合自己系统的进行下载，下载完成后同样解压安装。（一直下一步即可）


### 注册Github账户

前往Github网站，注册一个新用户。创建一个新的repository

在自己的Github主页右上角的加号,创建一个新的repository。比如我的Github用户名为vonfly，那么我创建的repository的名字应该是 vonfly.github.io


### 给本机配置SSH-Key
打开Git Bash，在命令行中输入：

``` bash
$ ssh-keygen -t rsa -C "your e-mail"
```
之后一直回车，就可以了
成功之后在命令行中找到这两段
Your identification has been saved in /c/Users/XZY-06/.ssh/id_rsa.
Your public key has been saved in /c/Users/XZY-06/.ssh/id_rsa.pub.
打开所对应的文件夹，找到 id_rsa.pub文件，用编辑器打开，复制其中的全部内容。
登陆你的GitHub账户，依次点击账号Settings > SSH and GPG keys > new SSH key，把id_rsa.
pub中的内容拷贝进去key项，title项随意填 。

至此就已经配置完SSH-Key了


### 安装Hexo（安装需要花一些时间）
点击鼠标右键，看是否有Git bash Here选项。如果没有可以前往Git安装根目录，启动git-base.exe也可以。在命令行中输入：

``` bash
$ npm install -g hexo-cli
```

### 创建myblog文件夹
找到想要放置博客的文件夹，比如（F:\myblog），在该目录下鼠标右击打开Gitbash工具。在命令行中输入：

``` bash
$ hexo init
```

这里init后面可以跟文件目录，比如我想在F:\text下创建博客文件夹，那么可以用下面的命令：

``` bash
$ hexo init F:\text
```

### 安装依赖包
在myblog目录下，执行以下命令

``` bash
$ npm install
```

### 安装完后的目录结构

``` bash
├── _config.yml //网站的配置信息（也就是站点配置文件）
├── package.json //应用程序数据，指明hexo的版本等信息
├── scaffolds //模版文件夹。当您新建文章时，Hexo 会根据 scaffold 来建立文件。
├── source //文章源码目录，该目录下的markdown和html文件均会被hexo处理。
| ├── _posts  //新建的文章都将存放在此目录下。编辑<文件名>.md文件可修改内容。
└── themes //主题文件夹。Hexo会根据主题来生成静态页面。
```

### 本地调试（在myblog目录下，依次执行以下命令）
#### 1.生成网站
``` bash
$ hexo generate
```
#### 2.本地服务器
``` bash
$ hexo server
```
然后在浏览器中输入 localhost:4000 就可以看到自己的博客了
如果打开很慢或者打开不了，可以更改下端口
``` bash
$ hexo server -p 3000
```

重新在浏览器中输入 localhost:3000即可，至此我们已经搭建好自己的Hexo博客了，不过博客采用的主题是默认的主题，而我们要使用简洁优雅且易于使用NexT主题

### Next主题

#### 1.下载Next主题（下载需要一点时间）
在myblog目录下，执行以下命令

``` bash
$ git clone https://github.com/iissnan/hexo-theme-next themes/next
```

#### 2.启用Next主题

下载完成后，打开站点配置文件(即更目录下的_config.yml)，找到theme字段，并将其值更改为 next。
再重新执行本地调试那一步骤的命令查看效果即可

### 将本地的文件部署（上传）到Github账户中
打开站点配置文件(即更目录下的_config.yml)，在最后添加如下代码（在你修改时，把 repository更换成之前步骤创建新的repository仓库地址）

``` bash
deploy:
  type: git
  repository: https://github.com/vonfly/vonfly.github.io.git
  branch: master
```

执行以下指令即可完成部署（如果提示错误，可以看下面出错原因及解决方法）：

``` bash
$ hexo generate
$ hexo deploy
```

1.每次修改本地文件，都需要命令$ hexo generate才能保存。而且每次使用命令都必须在myblog根目录下使用。

2.如果你在执行$ hexo deloy,如果提示 ERROR Deployer not found: git，
那说明你没有安装hexo-deployer-git依赖包，进入F:\Hexo\node_modules发现真的没有hexo-deployer-git。
解决方法：
①只需要输入下面命令创建hexo-deployer-git依赖包

``` bash
$ npm install hexo-deployer-git --save
```
　
②然后再执行hexo deploy就能上传成功了
``` bash
$ hexo deploy
```

直接在浏览器访问vonfly.github.io试试

博客安装和主题配置参考：
[hexo官网](https://hexo.io/zh-cn/docs/)
[next主题官网](http://theme-next.iissnan.com/getting-started.html#top)