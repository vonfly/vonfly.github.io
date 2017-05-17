---
title: 搭建SVN服务器
date: 2017-02-26 09:24:08
tags: [SVN, Centos, 版本控制]
categories: Linux
---

在 Centos5.5 上搭建SVN服务器并实现自动同步至web目录。
<!-- more -->

## 一、搭建svn环境并创建仓库：

### 安装Subversion
``` base
yum install -y subversion
```

### 检测是否安装成功(查看svn版本号)
``` base
svnserve --version
```

### 创建版本库（没有规定在哪创建目录）
``` base
mkdir /home/svn	//先建目录
cd /home/svn		//进入目录
svnadmin create /home/svn/test	//创建版本库
cd test	//进入创建的版本库
ls		//会看到自动生成的版本库文件（如下图）
```
![版本库文件列表](http://olixffhc0.bkt.clouddn.com/server_svn1.jpg)


## 创建用户组及用户
进入版本库中的配置目录conf

### 修改权限配置文件
``` base
vim authz
```
![权限配置](http://olixffhc0.bkt.clouddn.com/server_svn2.jpg)

### 配置用户名命令文件
``` base
vim passwd
```
![用户名密码配置](http://olixffhc0.bkt.clouddn.com/server_svn3.jpg)

### 配置SVN服务综合配置文件
``` base
vim svnserve.conf
```
//找到以下配置项，将前面的#号去掉（注意：所有配置项前面不能留空格），然后做相应的配置
anon-access = none  	//匿名用户访问权限:无
auth-access = write     //普通用户访问权限:写
password-db = passwd    //引入密码文件
authz-db = authz        //引入权限配置文件
realm = /home/svn/test   //版本库所在

### 启动svn服务
``` base
svnserve -d -r /home/svn
```
其中 -d表示(独立端口运行)	-r表示(仓库地址)
svn服务走svn协议，端口号是3690

如果提示：svnserve: E000098: Can't bind server socket: Address already in use
证明现在svn已经被启动了，由于我们修改了配置文件，因此要重启svn服务，所以要先关闭svn再重启svn

查看svn服务详情（如下图所示）
``` base
ps aux | grep svn
```

将svn服务强制停止  其中790为svn服务的ID号，-9是kill的参数
``` base
kill -9 790
```
最后再重新运行 svnserve -d -r /var/svn

### 测试有没有成功
``` base
cd /www
mkdir test
svn co svn://localhost/test /www/test --username vonfly(SVN账号) --password vonfly(SVN密码)
```
如果提示：Checked out revision 0. 
表示checkout成功
![Checked](http://olixffhc0.bkt.clouddn.com/server_svn4.jpg)

## 本地拉取、推送（本地要先安装SVN客户端）
输入远程链接：svn://服务器iP地址/test，再输入用户名和密码即可链接


## 本地commit时自动同步到web目录
实现本地更新同步到服务器项目：配置项目仓库的钩子配置,可以把钩子看成是WEB项目于SVN项目仓库之间的一个关联，通过向SVN项目仓库提交脚本代码，利用钩子shell脚本可以自动向web项目中将脚本文件更新过去

### 进入/var/svn/project/hooks下，建立post-commit文件
``` base
cd /var/svn/project/hooks
vim post-commit
```

在该文件里添加如下代码：

#!/bin/sh
export LANG=zh_CN.UTF-8
SVN_PATH=/usr/bin/svn   //这里不用改
WEB_PATH=/www/test  //对应自己web目录
//这里的用户随便一个就好
$SVN_PATH update $WEB_PATH --username 'vonfly' --password 'vonfly' --no-auth-cache

![post-commit](http://olixffhc0.bkt.clouddn.com/server_svn5.jpg)

### 给post-commit 执行权限
``` base
chmod 755 post-commit
```

## 扩展

### 具体权限表示
r(read)读【有update操作】	w(write)写【有commit操作】

### 开启只操作某个目录的权限
要求：给帐号设置只操作temp目录的权限，只能给操作temp目录的用户只读权限
对应的权限文件（authz）设置
[test:/temp]
temp1 = r
temp2 = r
.....
对应的本地客户端拉取就要：输入远程链接：svn://服务器iP地址/test/temp
说明：这样的设置不会影响到之前[test:/]的设置，两个设置可以共存
