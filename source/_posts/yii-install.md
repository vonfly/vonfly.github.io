---
title: windows下安装yii
date: 2017-06-01 20:49:28
tags:
---

通过 Composer 安装
<!-- more -->

### Packagist / Composer中国全量镜像

#### 先安装 Composer
安装前请务必确保已经正确安装了 PHP。打开命令行窗口并执行 php -v 查看是否正确输出版本号。
打开命令行并依次执行下列命令安装最新版本的 Composer：

``` base
php -r "copy('https://install.phpcomposer.com/installer', 'composer-setup.php');"
```

``` base
php composer-setup.php
```

``` base
php -r "unlink('composer-setup.php');"
```

说明：
执行第一条命令下载下来的 composer-setup.php 脚本将简单地检测 php.ini 中的参数设置，如果某些参数未正确设置则会给出警告；然后下载最新版本的 composer.phar 文件到当前目录。

上述 3 条命令的作用依次是：

下载安装脚本 － composer-setup.php － 到当前目录。
执行安装过程。
删除安装脚本。

##### 全局安装
全局安装是将 Composer 安装到系统环境变量 PATH 所包含的路径下面，然后就能够在命令行窗口中直接执行 composer 命令了。

###### Mac 或 Linux 系统：
打开命令行窗口并执行如下命令将前面下载的 composer.phar 文件移动到 /usr/local/bin/ 目录下面：

``` base
# sudo mv composer.phar /usr/local/bin/composer
```

###### Windows 系统：
1、找到并进入 PHP 的安装目录（和你在命令行中执行的 php 指令应该是同一套 PHP）。
2、将 composer.phar 复制到 PHP 的安装目录下面，也就是和 php.exe 在同一级目录。
3、在 PHP 安装目录下新建一个 composer.bat 文件，并将下列代码保存到此文件中。

``` base
@php "%~dp0composer.phar" %*
```

最后重新打开一个命令行窗口试一试执行 composer --version 看看是否正确输出版本号。
如图所示：
![安装成功图片](http://olixffhc0.bkt.clouddn.com/yii-install1.PNG)

提示：不要忘了经常执行 composer selfupdate 以保持 Composer 一直是最新版本哦！

``` base
composer selfupdate		//命令行中执行
```

#### Packagist 镜像使用方法
系统全局配置： 即将配置信息添加到 Composer 的全局配置文件 config.json 中。见“方法一”
单个项目配置： 将配置信息添加到某个项目的 composer.json 文件中。见“方法二”

##### 方法一： 修改 composer 的全局配置文件（推荐方式）
打开命令行窗口（windows用户）或控制台（Linux、Mac 用户）并执行如下命令：

``` base
composer config -g repo.packagist composer https://packagist.phpcomposer.com
```

##### 方法二： 修改当前项目的 composer.json 配置文件：
打开命令行窗口（windows用户）或控制台（Linux、Mac 用户），进入你的项目的根目录（也就是 composer.json 文件所在目录），执行如下命令：

``` base
composer config repo.packagist composer https://packagist.phpcomposer.com
```

上述命令将会在当前项目中的 composer.json 文件的末尾自动添加镜像的配置信息（你也可以自己手工添加）：
"repositories": {
    "packagist": {
        "type": "composer",
        "url": "https://packagist.phpcomposer.com"
    }
}

##### 镜像原理：
一般情况下，安装包的数据（主要是 zip 文件）一般是从 github.com 上下载的，安装包的元数据是从 packagist.org 上下载的。

然而，由于众所周知的原因，国外的网站连接速度很慢，并且随时可能被“墙”甚至“不存在”。

“Packagist 中国全量镜像”所做的就是缓存所有安装包和元数据到国内的机房并通过国内的 CDN 进行加速，这样就不必再去向国外的网站发起请求，从而达到加速 composer install 以及 composer update 的过程，并且更加快速、稳定。因此，即使 packagist.org、github.com 发生故障（主要是连接速度太慢和被墙），你仍然可以下载、更新安装包。

### 开始使用Composer 安装yii
打开命令行，切换到一个可通过 Web 访问的目录（如我的是d:wamp/www），执行如下命令即可安装 Yii ：

``` base
composer global require "fxp/composer-asset-plugin:^1.2.0"

composer create-project --prefer-dist yiisoft/yii2-app-basic yiishop
```

第一条命令安装 Composer asset plugin， 它是通过 Composer 管理 bower 和 npm 包所必须的，此命令全局生效，一劳永逸。 第二条命令会将 Yii 安装在名为 yiishop 的目录中。如果你想使用其它目录名称，你可以选择其他目录名称。

注意: 在安装过程中 Composer 可能会询问你 GitHub 账户的认证信息，因为可能在使用中超过了 GitHub API （对匿名用户的）使用限制。因为 Composer 需要为所有扩展包从 GitHub 中获取大量信息，所以超限非常正常。（译注：也意味着作为程序猿没有 GitHub 账号，就真不能愉快地玩耍了）登陆 GitHub 之后可以得到更高的 API 限额，这样 Composer 才能正常运行。

如下图所示：
![需要github token](http://olixffhc0.bkt.clouddn.com/yii-install2.PNG)

我们需要提供一个githtb token 供Composer检索使用
具体操作：
进入 https://github.com/settings/tokens 点击 「Generate new token」 新建一个 Token，选择默认新建就行，然后就会得到一个 Token，然后输入这个值就 OK 了。

最后等待就可以了，安装成功如下图：
![安装yii成功](http://olixffhc0.bkt.clouddn.com/yii-install4.PNG)

### 学习
[yii中文社区](http://www.yiichina.com/doc/guide/2.0/start-installation#installing-via-composer)