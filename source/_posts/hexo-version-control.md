---
title: 多台电脑共同管理hexo博客
date: 2016-02-18 10:33:57
tags: [hexo]
categories: 其它
---

使用hexo搭建博客，如果换了电脑怎么更新博客？如果你有备份源文件那还好，但是每次都要备份感觉太麻烦了。
这里介绍一种方法就是使用github分支。一个分支用来存放Hexo生成的网站原始的文件，另一个分支用来存放生成的静态网页。
<!-- more -->

## 有博客源文件时，博客源文件我们放到hexo分支上
先删除主题文件下的.git文件，
可以直接删除或者执行下面的命令

``` bash
$ rm -rf .git
```

然后在本地博客文件夹下边依次输入以下指令(部分指令因为有提示可以自己修改下)

``` bash
$ git init
$ git checkout -b hexo
$ git remote add origin git@github.com:vonfly（你自己giuhub账号名）/vonfly.github.io（项目名）.git
$ git add .
$ git commit -m "提交说明"
$ git push origin hexo
```
执行到这里我们就已经把本地的源文件添加到了分支hexo上。

## 从github分支上拉取博客源文件

``` bash
$ git clone -b hexo git@github.com:vonfly/vonfly.github.io
$ npm install // 安装需要的包
$ hexo generate // 生成静态文件
$ hexo server -p 3000 // 本地服务测试查看
```

我的.gitignore文件内容为
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/


当然你也可以把node_modules/去掉，这样在另外的电脑克隆下来的项目就不用在运行上面的命令了


扩展：
### github常见操作和常见错误！

#### 如果输入$ git remote add origin git@github.com:vonfly（github帐号名）/vonfly.github.io（项目名）.git

提示出错信息：fatal: remote origin already exists.

解决办法如下：
    1、先输入$ git remote rm origin
    2、再输入$ git remote add origin git@github.com:vonfly/vonfly.github.io.git 就不会报错了！

#### 如果输入$ git remote rm origin 还是报错的话，
error: Could not remove config section 'remote.origin'. 我们需要修改gitconfig文件的内容
4、找到你的github的安装路径，我的是C:\Users\ASUS\AppData\Local\GitHub\PortableGit_ca477551eeb4aea0e4ae9fcd3358bd96720bb5c8\etc
5、找到一个名为gitconfig的文件，打开它把里面的[remote "origin"]那一行删掉就好了！


#### 如果输入$ git push origin master
提示出错信息：error:failed to push som refs to .......
解决办法如下：
    1、先输入$ git pull origin master //先把远程服务器github上面的文件拉下来
    2、再输入$ git push origin master
    3、如果出现报错 fatal: Couldn't find remote ref master或者fatal: 'origin' does not appear to be a git repository以及fatal: Could not read from remote repository.
    4、则需要重新输入$ git remote add origin git@github.com:vonfly/vonfly.github.io.git