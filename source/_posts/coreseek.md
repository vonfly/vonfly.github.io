---
title: coreseek中文检索引擎
date: 2017-05-04 14:32:27
tags: [nosql]
category: 数据库
---

在 Centos6.5 上编译安装coreseek以及配置
<!-- more -->

## 下载对应安装包，并解压
``` base
# tar zxvf coreseek-3.2.14.tar.gz
```

## 先进入mmseg-3.2.14目录安装中文分词
``` base
# ls
# cd coreseek-3.2.14/mmseg-3.2.14/
//检测环境配置是否会报错
# ./configure --prefix=/usr/local/mmseg
```

编译过程中报了一个config.status:error:cannot find input file:src/Makeefile.in这个的错误，然后运行以下指令再次编译就能通过了

``` base
# aclocal
# libtoolize --force
# automake --add-missing
# autoconf
# autoheader
# make clean
# ./configure --prefix=/usr/local/mmseg
//开始编译
# make
//进行安装
# make install
```
到这里就安装完了mmseg

## 先进入csft-3.2.14目录安装csft
``` base
# ls
# cd csft-3.2.14/
//检测环境配置是否会报错
# ./configure --prefix=/usr/local/coreseek --with-mysql=/usr/local/mysql --with-mmseg=/usr/local/mmseg --with-mmseg-includes=/usr/local/mmseg/include/mmseg/ --with-mmseg-libs=/usr/local/mmseg/lib/

# make
# make install
```
到这里就安装完了csft

## 配置coreseek
``` base
//进入配置目录
# cd /usr/local/coreseek/etc
//复制一份配置文件并改名为csft.conf，因为coreseek默认加载的配置文件是csft.conf
# cp sphinx.conf.dist csft.conf
```
vim csft.conf，修改为：
如下图：


### 创建全文索引
配置文件没有错误了，就可以开始创建全文索引了

``` base
# /usr/local/coreseek/bin/indexer --all
```

## 用PHP连接使用Sphinx
1、先到http://pecl.php.net/package/sphinx下载所需要的扩展库
2、解压文件和进入解压目录

``` linux
# tar zxvf sphinx-1.3.3.tgz
# cd sphinx-1.3.3
```

3、调用phpize，生成configure

``` linux
//注意此处是你服务器上php安装的地址
# /usr/local/php/bin/phpize
```

4、检测环境配置

``` linux
# ./configure --with-php-config=/usr/local/php/bin/php-config --with-sphinx
```
报错，如下图：
![报错图片](http://olixffhc0.bkt.clouddn.com/shhinx.jpg)
5、进入以下目录(之前coreseek-3.2.14的解压目录)

``` linux
# cd /usr/local/src/coreseek-3.2.14/csft-3.2.14/api/libsphinxclient
# ./configure
# make && make install
```

6、重新到sphinx-1.3.3目录下执行

``` linux
# cd /usr/local/src/sphinx-1.3.3
# ./configure --with-php-config=/usr/local/php/bin/php-config --with-sphinx
# make && make install
```
执行结果如下图：
![成功](http://olixffhc0.bkt.clouddn.com/shhinx1.jpg)
7、修改php下php.ini文件

``` linux
# vim /usr/local/php/etc/php.ini
```
.......
; For example, on Windows:
;
;   extension=msql.dll
;
; ... or under UNIX:
;
;   extension=msql.so
extension=sphinx.so 	//添加如下这行