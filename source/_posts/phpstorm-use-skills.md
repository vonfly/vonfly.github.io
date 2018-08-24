---
title: phpstorm 编辑器的使用技巧
date: 2016-05-18 21:39:58
tags: [phpstorm]
categories: phpstorm
---

phpstorm 编辑器的使用技巧
<!-- more -->

### 一些常用快捷键(默认配置)

1、快速查找文件
ctrl+shift+n

2、最近打开的文件，进行输入文件名搜索(Recent Files)
ctrl+e

3、优化导入的类和包(如移除没有用到的命名空间)
ctrl+alt+o

### 项目命名空间设置
![项目命名空间设置](http://olixffhc0.bkt.clouddn.com/phpstorm1.png)

### 断点调试设置

1、检测本地php环境是否安装了Xdebug
在本地输出phpinfo()；搜索Xdebug;如下图：
![phpinfo](http://olixffhc0.bkt.clouddn.com/phpstorm2.png)

如果没有安装，安装操作Xdebug如下： 
将phpinfo();的信息(浏览器中右键查看源代码 -> ctrl+a -> ctrl+c)全部输入网址： (http://xdebug.org/wizard.php) 中的框，得到适配的xdebug版本，按照下图中操作进行。 
![phpinfo](http://olixffhc0.bkt.clouddn.com/phpstorm3.png)
![phpinfo](http://olixffhc0.bkt.clouddn.com/phpstorm4.png)

2、安装好Xdebug之后，配置本地的php.ini。添加配置如下，如需添加其他Xdebug配置，可以查看phpinfo中xdebug配置，根据情况自己添加。

zend_extension="D:\phpStudy\PHPTutorial\php\php-5.6.27-nts\ext\php_xdebug.dll"
xdebug.remote_enable=1
xdebug.remote_handler=dbgp
xdebug.remote_mode=req
xdebug.remote_host=localhost
xdebug.remote_port=9000
xdebug.idekey="PHPSTORM"

说明：zend_extension的值根据自己的本地环境填写
xdebug.remote_port默认值为9000，这里需要跟phpstorm配置一致。phpstorm中的Debug默认配置也为9000(File->Settings->Languages & Frameworks->PHP->Debug)
然后重启服务

3、配置phpstorm
![phpinfo](http://olixffhc0.bkt.clouddn.com/phpstorm5.png)
![phpinfo](http://olixffhc0.bkt.clouddn.com/phpstorm6.png)