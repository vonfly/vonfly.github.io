---
title: mongodb数据库
date: 2017-05-01 18:29:41
tags: [nosql]
category: 数据库
---

NoSQL数据库的优缺点
优点：简单的扩展、快速的读写、低廉的成本、灵活的数据模型
不足：不提供对SQL的支持、支持的特性不够丰富、现有的产品不够成熟

<!-- more -->

## Mongodb特性
mongodb的特点是高性能、易部署、易使用，存储数据非常方便，主要的特性有：
面向集合存储，易于存储对象类型的数据
模式自由
支持动态查询
支持完全索引，包含内部对象
支持复制和故障恢复
使用高效的二进制数据存储，包括大型对象（如视频等）
自动处理碎片，以支持云计算层次的扩展性
文件存储格式为BSON（一种JSON的扩展）

## mongobd体系结构
逻辑结构关系对比
关系型数据库：
mysql数据库(database)、表(table)、记录(rows)三个层次概念组成
非关系型数据库：
mongodb数据库(database)、集合(collection)、文档对象(document)三个层次概念组成

## mongodb的安装（安装较简单，不用源码编译安装，直接拷贝bin目录到你的安装目录即可）
环境：Centos6.5
1、到[mongodb官网](http://www.mongodb.org)下载对应的安装包
2、解压压缩包

``` base
# tar zxvf mongodb-linux-x86_64-amazon-3.4.4.tgz
```

3、拷贝bin目录到指定文件夹(我这里安装到/usr/local/mongodb)

``` base
# cd mongodb-linux-x86_64-amazon-3.4.4/
# rsync -a bin /usr/local/mongodb
```

4、进入到安装目录（/usr/local/mongodb），创建专门放置数据库的目录,记载日志文件

``` base
# cd /usr/local/mongodb/
//创建放置数据库的目录
# mkdir data
//创建记载日志文件
# touch dblogs
```

至此mongodb已经安装完毕

扩展：mongodb开机自启动
将mongodb启动项目加入rc.local保证mongodb在服务器开机时启动
法1：
vim /etc/rc.local
加入
/usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data/ --logpath=/usr/local/mongodb/dblogs --fork

法2：

``` base
# echo "/usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data/ --logpath=/usr/local/mongodb/dblogs --fork" >> /etc/rc.local
```

### 启动mongodb
``` base
# /usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data/ --logpath=/usr/local/mongodb/dblogs --fork
```
启动命令常用参数选项说明：
--dbpath	//指定数据库的目录
--auth	//用户验证
--port	//指定数据库的端口，默认是27017
--bind_ip	//绑定ip
--directoryperdb	//为每个bd创建一个独立子目录
--logpath	//指定日志存放目录
--logappend	//指定日志生成方式(追加/覆盖)
--pidfilepath	//指定进程文件路径，如果不知道，将不产生进程文件
--keyFile	//集群模式的关键标识
--journal	//启用日志
--nssize	//指定.ns文件的大小，单位MB，默认是16M，最大2GB
--maxConns	//最大的并发连接数
--notablescan	//不允许进行表扫描
--noprealloc	//关闭数据文件的预分配功能
--fork	//以后台Daemon形式运行服务
更多参数选项利用mongod --help进行查看

### 关闭mongodb
``` base
//法1
# pkill mongod
//法2
# killall mongod
```
最好用上面两种的一种，如果用kill -9 进程id，会重启不了mongodb，需要到data目录下把锁文件(mongod.lock)删除掉，具体操作如下：

``` base
# cd /usr/local/mongodb/data
# rm -rf mongod.lock 	//把锁文件删除掉
```

### 用户授权（即登录需要用户名和密码）
1、每个mongodb实例中的数据库都有许多用户，如果启用了安全性认证后，只有数据库认证的用户才可以进行读写操作。mongodb默认的启动是不验证用户名和密码的，启动mongodb后，可以直接用mongo连接上来，对所有的库具有root权限。所以启动的时候指定参数，可以阻止客户端的访问和连接，只需在启动服务时指定 --auth参数即可

``` base
# /usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data/ --auth --logpath=/usr/local/mongodb/dblogs --fork
```

2、现在还是可以通过/usr/local/mongodb/bin/mongo可以直接进入客户端操作的
因为现在没有管理员帐号，mongodb分两种管理员，一种为超级管理员，一种为数据库管理员(即只对自己的数据库有权限)

2.1、先通过/usr/local/mongodb/bin/mongo进入到客户端创建帐号

2.2、创建超级管理员（一定要进入admin数据库创建才行）
//先进入admin数据库
use admin;
//创建帐号root,密码为123
db.addUser("root", "123");

2.3、创建数据库管理员
比如我需要为test数据库创建管理员，那我需要进入到test数据库先
use test;
db.addUser("test", "123");

2.4测试登录
创建好帐号后，退出客户端，再重新登录进入客户端
exit;
/usr/local/mongodb/bin/mongo -uroot -p123 localhost:27017/admin	//超级管理员登录进入admin数据库



2.5总结
超级管理员需要进入admin数据库进行创建，数据库管理员需要进入到对应的数据库进行创建。

## 参考
[mongodb中文社区](http://docs.mongoing.com/manual-zh/tutorial/insert-documents.html)
[菜鸟教程](http://www.runoob.com/mongodb/mongodb-capped-collections.html)