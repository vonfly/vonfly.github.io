---
title: centos+git+gitolite 安装和部署
date: 2018-05-30 21:39:58
tags: [git, Centos, gitolite]
categories: Linux
---

部署环境：CentOS 6.8x64，git默认使用SSH协议，在服务器上基本上不用怎么配置就能直接使用。但是如果面向团队服务，需要控制权限的话，还是用gitolite方便些。一般来说，配置git服务器的话，需要一台服务器，还需要一个客户端来验证服务器是否搭建成功，而一般开发者基本都只有一台服务器，那就需要这台服务器既作为Git的服务器，又要作为客户端来使用了，下面的教程就是以服务器和客户端都是同一台服务器为例的。如果需要服务器和客户端分开的话，只需要将下面列出的服务器端和客户端的操作到相应的机器上操作就可以了。
<!-- more -->

## 创建git服务器专用账户（服务器端）：
1、创建用户git，并设置密码

``` base
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# useradd -m -s /bin/bash git
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# passwd git
```

2、切换到git用户，在家目录/home/git下创建安装目录bin

``` base
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# su - git
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# mkdir bin
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll
total 24
drwxr-xr-x 3 git  git  4096 Aug 20 10:38 ./
drwxr-xr-x 8 root root 4096 Aug 20 10:36 ../
-rw-r--r-- 1 git  git   220 Apr  3  2012 .bash_logout
-rw-r--r-- 1 git  git  3486 Apr  3  2012 .bashrc
drwxrwxr-x 2 git  git  4096 Aug 20 10:38 bin/
-rw-r--r-- 1 git  git   675 Apr  3  2012 .profile
```

3、获取 Gitolite 并安装，gitolite要安装在服务器端，安装之前要保证系统上已经安装了git

``` base
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# git clone https://github.com/sitaramc/gitolite
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll
total 28
drwxr-xr-x 4 git  git  4096 Aug 20 10:40 ./
drwxr-xr-x 8 root root 4096 Aug 20 10:36 ../
-rw-r--r-- 1 git  git   220 Apr  3  2012 .bash_logout
-rw-r--r-- 1 git  git  3486 Apr  3  2012 .bashrc
drwxrwxr-x 2 git  git  4096 Aug 20 10:38 bin/
drwxr-xr-x 6 git  git  4096 Aug 20 10:40 gitolite/
-rw-r--r-- 1 git  git   675 Apr  3  2012 .profile


[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# gitolite/install -ln
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll
total 28
drwxr-xr-x 4 git  git  4096 Aug 20 10:40 ./
drwxr-xr-x 8 root root 4096 Aug 20 10:36 ../
-rw-r--r-- 1 git  git   220 Apr  3  2012 .bash_logout
-rw-r--r-- 1 git  git  3486 Apr  3  2012 .bashrc
drwxrwxr-x 2 git  git  4096 Aug 20 10:44 bin/
drwxr-xr-x 6 git  git  4096 Aug 20 10:40 gitolite/
-rw-r--r-- 1 git  git   675 Apr  3  2012 .profile
```

## 创建 Gitolite 服务器管理员用户，并创建管理员用户密钥（客户端）：
因为我们是在同一台服务器上，直接exit退回到root用户，之后变身为客户端模式，如果客户端和服务器分开的话，不需要exit指令了，直接在客户端执行添加用户的指令就可以了。这里的Gitolite服务器管理员用户名我们叫gitAdmin

1、创建用户git，并设置密码

``` base
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# useradd -m -s /bin/bash gitAdmin
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# passwd gitAdmin
```

2、切换到gitAdmin用户

``` base
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# su - gitAdmin
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll
total 24
drwxr-xr-x 3 gitAdmin gitAdmin 4096 Aug 20 10:48 ./
drwxr-xr-x 9 root     root     4096 Aug 20 10:46 ../
-rw-r--r-- 1 gitAdmin gitAdmin  220 Apr  3  2012 .bash_logout
-rw-r--r-- 1 gitAdmin gitAdmin 3486 Apr  3  2012 .bashrc
-rw-r--r-- 1 gitAdmin gitAdmin  675 Apr  3  2012 .profile
drwxrwxr-x 2 gitAdmin gitAdmin 4096 Aug 20 10:48 .ssh/
```

3、创建用户密钥

``` base
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# ssh-keygen -t rsa
```

4、将管理员公钥（gitAdmin.pub)复制 到服务器上的 git 用户的家目录下

``` base
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# exit
logout

[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# cp /home/gitAdmin/.ssh/gitAdmin.pub /home/git/
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll /home/git

total 36
drwxr-xr-x 4 git  git  4096 Aug 20 10:53 ./
drwxr-xr-x 9 root root 4096 Aug 20 10:46 ../
-rw------- 1 git  git   788 Aug 20 10:45 .bash_history
-rw-r--r-- 1 git  git   220 Apr  3  2012 .bash_logout
-rw-r--r-- 1 git  git  3486 Apr  3  2012 .bashrc
drwxrwxr-x 2 git  git  4096 Aug 20 10:44 bin/
-rw-r--r-- 1 root root  412 Aug 20 10:53 gitAdmin.pub
drwxr-xr-x 6 git  git  4096 Aug 20 10:40 gitolite/
-rw-r--r-- 1 git  git   675 Apr  3  2012 .profile
```

## 配置 Gitolite 服务器（服务器端）：

``` base
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# su - git
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# gitolite setup -pk gitAdmin.pub

Initialized empty Git repository in /home/git/repositories/gitolite-admin.git/
Initialized empty Git repository in /home/git/repositories/testing.git/
WARNING: /home/git/.ssh missing; creating a new one
    (this is normal on a brand new install)
WARNING: /home/git/.ssh/authorized_keys missing; creating a new one
    (this is normal on a brand new install)

[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll

total 60
drwxr-xr-x 7 git  git  4096 Aug 20 10:57 ./
drwxr-xr-x 9 root root 4096 Aug 20 10:46 ../
-rw------- 1 git  git   788 Aug 20 10:45 .bash_history
-rw-r--r-- 1 git  git   220 Apr  3  2012 .bash_logout
-rw-r--r-- 1 git  git  3486 Apr  3  2012 .bashrc
drwxrwxr-x 2 git  git  4096 Aug 20 10:44 bin/
-rw-r--r-- 1 root root  412 Aug 20 10:53 gitAdmin.pub
drwxr-xr-x 6 git  git  4096 Aug 20 10:40 gitolite/
drwx------ 6 git  git  4096 Aug 20 10:57 .gitolite/
-rw------- 1 git  git  6662 Aug 20 10:57 .gitolite.rc
-rw-r--r-- 1 git  git   675 Apr  3  2012 .profile
-rw------- 1 git  git    12 Aug 20 10:57 projects.list
drwx------ 4 git  git  4096 Aug 20 10:57 repositories/
drwx------ 2 git  git  4096 Aug 20 10:57 .ssh/
```

## 验证Gitolite管理员账户访问服务器的别名以及验证别名是否成功（客户端）：
1、切换到gitAdmin账户

``` base
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]# exit
logout
[root@iZbp1c8ppw4ox72sq8z6hkZ ~]# su - gitAdmin
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll .ssh/

total 16
drwxrwxr-x 2 gitAdmin gitAdmin 4096 Aug 20 10:49 ./
drwxr-xr-x 3 gitAdmin gitAdmin 4096 Aug 20 10:53 ../
-rw------- 1 gitAdmin gitAdmin 1679 Aug 20 10:49 gitAdmin
-rw-r--r-- 1 gitAdmin gitAdmin  412 Aug 20 10:49 gitAdmin.pub
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# vi .ssh/config
```

2、在.ssh文件夹下新建config文件，输入下面内容

``` base
host git
        user git
        hostname xxx.xxx.xxx.xxx
        port 22
        identityfile ~/.ssh/gitAdmin
```

host： 随便定义，用于客户端标识所连接服务端的名字；
user ：随便定义
hostname ：服务器主机名，或者直接填写服务器 IP 地址；
port：服务器的ssh访问端口，默认22；
identityfile ：管理员登录服务器所使用的验证密钥；

3、使用服务器别名从 Gitolite 服务器 clone Gitolite 服务器管理仓库 gitolite-admin ，验证别名配置是否成功，以下表示已经clone成功了：

``` base
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# git clone git@git:gitolite-admin

Cloning into 'gitolite-admin'...
The authenticity of host 'xxx.xxx.xxx.xxx (xxx.xxx.xxx.xxx)' can't be established.
ECDSA key fingerprint is c1:c2:6a:7a:68:c8:e5:a6:87:f4:9b:95:d5:fd:ff:09.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'xxx.xxx.xxx.xxx' (ECDSA) to the list of known hosts.
remote: Counting objects: 6, done.
remote: Compressing objects: 100% (4/4), done.
Receiving objects: 100% (6/6), 763 bytes, done.
remote: Total 6 (delta 0), reused 0 (delta 0)
```

## 添加新项目以及分配权限（客户端）：
1、先登录进入客户端，查看家目录对应文件

``` base
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# ll -a

total 40
drwx------  4 gitadmin gitadmin 4096 May 24 09:18 .
drwxr-xr-x. 8 root     root     4096 May 22 14:48 ..
-rw-------  1 gitadmin gitadmin 2818 May 31 00:32 .bash_history
-rw-r--r--  1 gitadmin gitadmin   18 Mar 23  2017 .bash_logout
-rw-r--r--  1 gitadmin gitadmin  176 Mar 23  2017 .bash_profile
-rw-r--r--  1 gitadmin gitadmin  124 Mar 23  2017 .bashrc
-rw-rw-r--  1 gitadmin gitadmin   53 May 20 20:49 .gitconfig
drwxr-xr-x  5 gitadmin gitadmin 4096 May 20 20:26 gitolite-admin
drwx------  2 gitadmin gitadmin 4096 May 20 20:26 .ssh
-rw-------  1 gitadmin gitadmin  789 May 24 09:18 .viminfo

```

2、进入gitolite-admin目录，该目录就是管理项目和权限目录

``` base
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ ~]# cd gitolite-admin
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ ll

total 8
drwxrwxr-x 2 gitadmin gitadmin 4096 May 24 09:18 conf
drwxrwxr-x 2 gitadmin gitadmin 4096 May 22 16:32 keydir


[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ ll keydir/
total 20
-rw-rw-r-- 1 gitadmin gitadmin 390 May 20 22:48 bijiben.pub
-rw-r--r-- 1 root     root     401 May 22 16:32 company.pub
-rw-rw-r-- 1 gitadmin gitadmin 414 May 20 20:26 gitadmin.pub
-rw-r--r-- 1 root     root     410 May 22 15:23 test.pub
-rw-rw-r-- 1 gitadmin gitadmin 397 May 20 23:23 xiaoming.pub

[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ ll conf/
total 4
-rw-rw-r-- 1 gitadmin gitadmin 146 May 24 09:18 gitolite.conf

```

keydir目录就是放密钥的，公司员工在自己电脑生成密钥，然后给到管理员上传到该目录，分配对应项目权限即可，员工自己配置别名克隆项目就好了

conf目录是配置项目以及分配权限的目录

3、打开gitolite.conf

``` base
[gitAdmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ vim conf/gitolite.conf
```

如图所示：
![打开后](http://olixffhc0.bkt.clouddn.com/gitolite.jpg)

上面的配置含义是：

定义一个用户组： user

定义三个版本库： gitolite-admin 、testing 和 shop

项目gitolite-admin只有gitadmin用户才有权限操作

项目testing表示所有用户都可以进行操作

用户组成员对项目shop有（读 写 删除）RW+ 权限

一个组中有多个用户，则以空格为分割

4、每次修改这两个目录需要提交修改

``` base
[gitadmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ git add .
[gitadmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ git status
[gitadmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ git commit -m "test"
[gitadmin@iZbp1c8ppw4ox72sq8z6hkZ gitolite-admin]$ git push origin master
```

至此已经完成了

## （扩展）windows下克隆项目
1、生成对应密钥，并上传到客户端
``` base
ssh-keygen -t rsa
```

2、创建config文件，并配置别名
如图所示：
![如图所示](http://olixffhc0.bkt.clouddn.com/gitolite3.jpg)
![如图所示](http://olixffhc0.bkt.clouddn.com/gitolite4.jpg)

然后直接输入下边命令克隆即可（如果你的账户有权限包括git其他命令也可以使用、git push origin master等等）

``` base
git clone git@bijiben:testing
```

如果我还有其他的git服务器也要提交项目代码怎么办？很简单，生成多一个密钥，指定对应别名，如上图我还要对github.com网站上的项目进行提交代码，所以我就多生成一个密钥，在本地项目重新指定即可
假设我本地原本已经有了https://github.com/vonfly/vonfly.github.io.git这个项目了，只不过之前的密钥给删除了，或者覆盖了，我如何重新进行关联呢？

首先先在登录你github账户上，在本地找到 github.pub文件，用编辑器打开，复制其中的全部内容。
登陆你的GitHub账户，依次点击账号Settings > SSH and GPG keys > new SSH key，把github.
pub中的内容拷贝进去key项，title项随意填 。

至此就已经配置完SSH-Key了

然后本地执行下边代码进行重新关联

``` base
git remote rm origin
git remote add origin git@github:vonfly/vonfly.github.io.git
```

之后就可以执行git的提交和更新等操作了

## （扩展）使用git钩子完善完美的git服务器（暂时不知道怎么描述，因为有很多也不是很懂）：

1、首先，我们切换到gitadmin 用户（客户端），来到gitolite-admin/conf/目录下，在gitolite.conf中添加一个新的仓库，名字为：dong-admin

vim编辑后如下图
![编辑后](http://olixffhc0.bkt.clouddn.com/gitolite1.jpg)

操作步骤如下图
![编辑后](http://olixffhc0.bkt.clouddn.com/gitolite2.jpg)

2、切换到git用户（服务端）,进入repositories目录，已经有了dong-admin.git

``` base
[git@iZbp1c8ppw4ox72sq8z6hkZ ~]$ cd repositories/
[git@iZbp1c8ppw4ox72sq8z6hkZ repositories]$ ll
total 16
drwx------ 7 git git 4096 May 31 20:56 dong-admin.git
drwx------ 8 git git 4096 May 31 20:56 gitolite-admin.git
drwx------ 7 git git 4096 May 31 20:56 shop.git
drwx------ 7 git git 4096 May 31 20:56 testing.git
```

我们查看一下dong-admin.git目录里都有什么：

``` base
[git@iZbp1c8ppw4ox72sq8z6hkZ repositories]$ cd dong-admin.git/
[git@iZbp1c8ppw4ox72sq8z6hkZ dong-admin.git]$ ll
total 36
drwx------ 2 git git 4096 May 31 20:56 branches
-rw------- 1 git git   66 May 31 20:56 config
-rw------- 1 git git   73 May 31 20:56 description
-rw------- 1 git git    0 May 31 20:56 git-daemon-export-ok
-rw------- 1 git git  123 May 31 20:56 gl-conf
-rw------- 1 git git   23 May 31 20:56 HEAD
drwx------ 2 git git 4096 May 31 20:56 hooks
drwx------ 2 git git 4096 May 31 20:56 info
drwx------ 4 git git 4096 May 31 20:56 objects
drwx------ 4 git git 4096 May 31 20:56 refs

```

别的目录都不要管，可以看到有个hooks目录，继续查看

``` base
[git@iZbp1c8ppw4ox72sq8z6hkZ dong-admin.git]$ cd hooks/
[git@iZbp1c8ppw4ox72sq8z6hkZ hooks]$ ll
total 44
-rwx------ 1 git git  452 May 31 20:56 applypatch-msg.sample
-rwx------ 1 git git  896 May 31 20:56 commit-msg.sample
-rwx------ 1 git git  160 May 31 20:56 post-commit.sample
-rwx------ 1 git git  548 May 31 20:56 post-receive.sample
-rwx------ 1 git git  189 May 31 20:56 post-update.sample
-rwx------ 1 git git  398 May 31 20:56 pre-applypatch.sample
-rwx------ 1 git git 1578 May 31 20:56 pre-commit.sample
-rwx------ 1 git git 1239 May 31 20:56 prepare-commit-msg.sample
-rwx------ 1 git git 4951 May 31 20:56 pre-rebase.sample
lrwxrwxrwx 1 git git   39 May 31 20:56 update -> /home/git/.gitolite/hooks/common/update
-rwx------ 1 git git 3611 May 31 20:56 update.sample

```

好了，这里就是我们要找的目录了，我们需要在这个目录下创建钩子文件：
使用vim 创建一个新文件

``` base
[git@iZbp1c8ppw4ox72sq8z6hkZ hooks]$
```