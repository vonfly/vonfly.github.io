---
title: coreseek中文分词
date: 2017-05-04 14:32:27
tags:
---

在 Centos5.5 上编译安装coreseek以及配置
<!-- more -->

## 下载对应安装包，并解压
``` base
# tar zxvf coreseek-3.2.14.tar.gz
```

## 先进入mmseg-3.2.14目录安装中文分词
``` base
# ls
# cd mmseg-3.2.14/
//检测环境配置是否会报错
# ./configure --prefix=/usr/local/mmseg
```

编译过程中报了一个config.status:error:cannot find input file:src/Makeefile.in这个的错误，然后运行以下指令再次编译就能通过了

``` base
# automake
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

