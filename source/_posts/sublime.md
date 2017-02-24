---
title: Sublime使用技巧
date: 2017-02-17 20:33:48
tags: [软件使用技巧,右键快捷方式添加]
categories: 其它
---

sublime使用技巧，平时用的时候觉得不错的功能就会把它分享给大家(●'◡'●)
<!-- more -->

## sublime右键快捷方式添加
window下，开始->运行->regedit
到 HKEY_CLASSES_ROOT\*\shell目录下
新建sublime(随便你起什么名字)
再到新建好的sublime目录下新建command(固定名字)

最后的目录结构【HKEY_CLASSES_ROOT\*\shell\sublime\command】

第一个双引号是你的软件安装目录
"E:\Sublime Text 3  Build 3103 x64 Portable Cracked (2016.02.11)\sublime_text.exe" -p --remote-tab-silent "%1"

window如何查看软件安装目录，如下图说明：
![window如何查看软件安装目录](http://olixffhc0.bkt.clouddn.com/sublime2.jpg)

选中上一步建好的文件command，然后双击右边的默认，把上边的内容复制进去即可。如下图说明
![sublime1](http://olixffhc0.bkt.clouddn.com/sublime1.jpg)

随便找个文件sublime能够识别的文件，鼠标右击就可以看到刚刚添加的快捷键了，可以直接打开

## Sublime text 2/3 中 Package Control 的安装与使用方法
从菜单 View - Show Console 或者 ctrl + ~ 快捷键，调出 console。
将以下 Python 代码粘贴进去并 enter 执行，不出意外即完成安装。
以下提供 ST3 和 ST2 的安装代码：

Sublime Text 3：
``` python
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

Sublime Text 2：
``` python
import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
```

常用的一些插件：
AdvancedNewFile		快速创建新文件
Better Completion	全能代码提示(需要自己配置一下插件，需要提示的库)
CodeFormatter		代码格式化
ConverToUTF8	支持 GBK, BIG5, EUC-KR, EUC-JP, Shift_JIS 等编码的插件
DocBlockr		代码块注释
Emmet
File Header	自动更新保存时间，文件模板
Side Bar
Monokai Extended	主题配置
SideBarEnhancements	增强型侧边栏