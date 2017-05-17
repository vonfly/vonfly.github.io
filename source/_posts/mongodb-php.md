---
title: mongodb-php结合开发
date: 2017-05-03 21:18:38
tags: [nosql, php]
category: 数据库
---

想要在PHP中调用mongobd需要安装mongodb的php扩展

<!-- more -->

### 下载最新的php mongodb扩展源码
http://pecl.php.net/package/mongo

### 把扩展编译到php中
``` base
//先解压文件
# tar xzf mongo-1.2.6.tgz
//进入解压后的目录
# cd mongo-1.2.6
//运行phpize来准备编译扩展环境
# /usr/local/php/bin/phpize

//查看编译参数
# ./configure -h
//开始编译(--with-php-config参数是告诉配置脚本php-cofig这个程序的路径)
# ./configure --with-php-config=/usr/local/php/bin/php-config --enable-mongo
//安装
# make && make install
```

//打开配置文件php.ini，把mongodb模块打开（即增加extension=mongo.so）
vim /usr/local/php/etc/php.ini
....
extension=msql.so
extension=mongo.so

接下来重启apache

``` base
# /usr/local/apache2/bin/apachect1 restart
```

最后查看php是否已经支持mongodb

``` base
# cd /usr/local/apache2/htdocs/
```

vim phpinfo.php
<?php
phpinfo();
最后浏览器访问该页面，搜索mongo，看是否有

### 实际操作
在php的mongo扩展中，提供了4类接口(对象)：
1、针对mongodb连接的操作：Mongo
2、针对mongodb中数据库的操作：MongoDB
3、针对mongodb中collection的操作：MongoCollection
4、针对查询结果集的操作：MongoCursor

#### PHP连接mongodb数据库
文件conn.php的内容：
<?php
$conn = new Mongo('mongodb://test1:123@localhost:27017/test');
$db = $conn->test;
?>

#### 查询数据
<?php
include "conn.php";
$c1 = $db->c1;
根据地址栏传过来_id查询数据
//db.c1.find({_id:ObjectId("dfd1dfjfkee")});
$oid = $_GET['oid'];
$objectId = new MongoId($oid);
$arr = array('_id'=>$objectId);
$rs = $c1->find($arr);
var_dump($rs);
$conn->close();	//关闭连接

#### 增加数据
<?php
include "conn.php";
$c1 = $db->c1;
//db.c1.insert({name:"user1000"});
$arr = array('name'=>'user1000');
if($c1->insert($arr)){
	echo "插入成功！";
}else{
	echo "插入失败！";
}
$conn->close();	//关闭连接

#### 删除数据
<?php
include "conn.php";
$c1 = $db->c1;
//db.c1.remove({name:"user1000"});
$arr = array('name'=>'user1000');
if($c1->remove($arr)){
	echo "删除成功！";
}else{
	echo "删除失败！";
}
$conn->close();	//关闭连接

#### 修改数据
<?php
include 'conn.php';
$c1 = $db->c1;
//db.c1.update({name:"user1"}, {$set:{name:"user100",sex:1}});
$sarr = array('name'=>'user1');
$darr = array('$set'=>array('name'=>'user100', 'sex'=>1));
$opts = array('upsert'=>0, 'multiple'=>1);
if($c1->update($sarr, $darr, $opts)){
	echo "修改成功！";
}else{
	echo "修改失败！";
}
$conn->close();	//关闭连接
