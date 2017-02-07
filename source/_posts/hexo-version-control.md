---
title: 多台电脑共同管理hexo博客
date: 2016-02-18 10:33:57
tags:
---

使用hexo搭建博客，如果换了电脑怎么更新博客？如果你有备份源文件那还好，但是每次都要备份感觉太麻烦了。
这里介绍一种方法就是使用github分支。一个分支用来存放Hexo生成的网站原始的文件，另一个分支用来存放生成的静态网页。
网上也有其他的方法，大家可以去搜一下，自己看看哪种适合自己，我用这种方法一方面我git命令也不太熟，所以想多写写，多学学。
<!-- more -->


## 情形1（本地没有开始搭建博客文件的情形）
1.在github官网上创建一个新的repository（比如命名为dongfangpiaoyang.github.io）
2.创建两个分支：master 与 hexo，设置hexo为默认分支（这个分支放博客源文件）
3.使用 git clone git@github.com:dongfangpiaoyang（你自己giuhub账号名）/dongfangpiaoyang.github.io（项目名）.git
完整写一遍：git clone git@github.com:dongfangpiaoyang/dongfangpiaoyang.github.io.git
这样就把项目拷贝到你本地上了

4.在本地文件夹dongfangpiaoyang.github.io，通过Git bash依次执行以下命令
``` bash
$ npm install -g hexo-cli
$ hexo init
$ npm install
$ npm install hexo-deployer-git
$ git init
$ git checkout -b hexo
```
(此时当前分支应显示为hexo)

5.打开站点配置文件(即根目录下的_config.yml)，分支为master
``` bash
deploy:
  type: git
  repository: https://github.com/dongfangpiaoyang/dongfangpiaoyang.github.io.git
  branch: master
```

6.通过Git bash依次执行以下命令:
``` bash
$ git add .
$ git commit -m "提交说明"
$ git pull origin hexo
$ git push origin hexo
```

7.执行以下指令即可完成部署:
``` bash
$ hexo generate
$ hexo deploy
```


## 情形2（本地已经搭建博客文件的情形，就是说源文件没有进行版本控制）

在博客文件夹下边依次输入以下指令(部分指令因为有提示可以自己修改下)

``` bash
$ git init
$ git checkout -b hexo
$ git remote add origin git@github.com:dongfangpiaoyang（你自己giuhub账号名）/dongfangpiaoyang.github.io（项目名）.git
$ git init
$ git add .
$ git push origin hexo
```
执行到这里我们就已经把本地的源文件添加到了分支hexo上。
部分文件需要自己添加即：
$ git add [file]



扩展：
### github常见操作和常见错误！

#### 如果输入$ git remote add origin git@github.com:dongfangpiaoyang（github帐号名）/dongfangpiaoyang.github.io（项目名）.git

提示出错信息：fatal: remote origin already exists.

解决办法如下：
    1、先输入$ git remote rm origin
    2、再输入$ git remote add origin git@github.com:dongfangpiaoyang/dongfangpiaoyang.github.io.git 就不会报错了！

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
    4、则需要重新输入$ git remote add origin git@github.com:dongfangpiaoyang/dongfangpiaoyang.github.io.git