---
title: 常用的一些命令
date: 2016-02-16 20:20:58
tags: [命令使用, hexo]
categories: 命令
---
平时写博客会用到的一些命令
<!-- more -->

### hexo命令

init 新建一个网站。如果没有设置 folder ，Hexo 默认在目前的文件夹建立网站。
``` bash
$ hexo init [folder]
```

new 新建一篇文章。如果没有设置 layout 的话，默认使用 _config.yml 中的 default_layout 参数代替。如果标题包含空格的话，请使用引号括起来。
``` bash
$ hexo new [layout] <title>
```


generate 生成网站(即生成静态文件)
``` bash
$ hexo generate
```
参数说明

| 选项        | 描述   |
| --------   | -----:  |
| -d, --deploy     | 文件生成后立即部署网站 |
| -w, --watch        |   监视文件变动   |


server 启动服务器。默认情况下，访问网址为： http://localhost:4000/。
``` bash
$ hexo server
```
参数说明

| 选项        | 描述   |
| --------   | -----:  |
| -p, --port     | 重设端口 |
| -s, --static        |   只使用静态文件   |
| -l, --log        |   启动日志记录，使用覆盖记录格式   |



deploy 部署网站。
``` bash
$ hexo deploy
```
参数说明

| 选项        | 描述   |
| --------   | -----:  |
| -g, --generate     | 部署之前预先生成静态文件 |


clean 清除缓存文件 (db.json) 和已生成的静态文件 (public)。
``` bash
$ hexo clean
```


version 显示 Hexo 版本。
``` bash
$ hexo version
```

安装 Hexo Algolia 扩展（用于页面搜索）
``` bash
$ npm install hexo-algolia@0.2.0
```

来更新 Index（相当于把博客下的文章更新到algolia数据库）
``` bash
$ hexo algolia
```
