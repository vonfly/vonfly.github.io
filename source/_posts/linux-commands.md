---
title: 一些常用的linux-commands
date: 2016-09-06 23:00:08
tags: [linux]
categories: 命令
---

常用的一些Linux命令
<!-- more -->
## 目录操作
### 查看目录下的文件
``` linux
ls
ls -l	//显示文件的详细信息(包括权限信息)
ls -al	//显示文件的详细信息(包括隐藏文件)
```

### 目录切换
``` linux
cd 目录名字
```

### 创建目录
``` linux
mkdir newdir1	//创建单个新目录
mkdir -p newdir1/newdir2/newdir3	//递归创建多级目录
```

### 移动目录
``` linux
mv dir1 dir2	//dir1目录移动到dir2的目录下
mv dir1 newdir 	//dir1移动到当前目录下，并改名字为newdir
```

### 复制（复制目录一般要加-R参数）
``` linux
cp -R dir1 newdir	//dir1复制到当前目录，并改名字为 newdir
cp file dir1	//file文件复制到dir1下
```

### 删除
``` linux
rm file		//删除file文件
rm -rf dir	//递归强制删除目录
```

### 查看当前操作目录位置
``` linux
pwd
```

## 文件操作
### 文件内容查看
``` linux
cat filename	//一次性把全部内容输出到终端
more filename	//通过敲回车方式逐行查看文件内容，q键结束查看
less filename	//"上下左右"键方式查看文件各部分内容，q键结束查看
head -n filename    //查看文件的前n行内容
tail -n filename    //查看文件的最后n行内容
wc filename         //查看文件内容行数
```

### 创建文件
``` linux
touch filename 	//在当前目录创建filename文件
```

### 给文件追加内容
``` linux
echo 内容 > 文件	//把内容以覆盖写方式添加到文件中
echo 内容 >> 文件	//把内容以追加方式添加到文件中
//例：echo vonfly > test 
```
说明：如果文件不存在会自动创建

### 文件主人、组别设置
``` linux
chown 主人 filename
chown 主人.组别名称 filename
```

##组和用户的操作
### 组的操作
对应配置文件：/etc/group
``` linux
groupadd 组名	//创建组（例：groupadd php）创建php这个组
groupmod -n 新组名 原组名	//修改组（例：groupmod -n php python）把php这个组修改成python
```

### 用户的操作
对应配置文件：/etc/passwd
``` linux
useradd -g 组编号 用户名	//创建用户，顺便分组
usermod -l 新用户名 原用户名	//修改用户名
userdel -r 用户名	//删除用户信息同时删除用户家目录
```
设置用户密码
``` linux
passwd 用户名	//例：passwd vonfly	(给vonfly设置新密码)
```

## 权限操作
### 字母相对方式设置权限
``` linux
chmod u+/-rwx,g+/-rwx,o+/-rwx filename	//主人，同组用户，其他组用户增加或减少权限，可以设置一个或多个权限
chmod +w,-x filename	//统一给每一个组别设置统一权限（相当于给主人，同组用户，其他组用户增加了读的权限，减少了执行的权限）
```

### 数字绝对方式设置权限（会直接覆盖之前的权限）
``` linux
chmod 621 filename	//表示给主人设置成读写权限，同组用户设置写权限，其他组用户设置执行权限
chmod -R 777 dirname	//-R参数表示递归方式设置目录权限
```
说明：
读：4，写：2，执行：1
0表示没有权限
1表示执行权限
2表示写权限
3表示写、执行权限
4表示读权限
5表示读、执行权限
6表示读、写权限
7表示读、写、执行权限

文件的读写执行具体表示：
读：表示是否可以查看文件内容
写：表示是否可以修改该文件
执行：一般表示执行shell脚本程序文件

目录的读写执行具体表示：
读：表示是否可以查看该目录下的文件信息
写：表示是否可以给该目录创建、删除文件
执行：表示用户是否可以通过cd进入该目录

## find文件查找指令
参数说明

| 选项        | 描述   |
| --------   | -----:  |
| -name     | 根据文件名字查找文件 |
| -size        |   根据文件大小查找文件   |
| -maxdepth        |   限制最深层次查找文件   |
| -mindepth        |   限制最浅层次查找文件   |
| -perm        |   把符合某个权限的文件给查找出来   |
| -user        |   根据主人查找文件   |
| -group        |   根据组别查找文件   |

例子：

``` linux
find /home -name vonfly		//在home目录下查找vonfly文件
find /home -name "v*"		//在home目录下模糊查找带v字符开始的文件

find /home -size 100c	//在home目录下找大小为100字节的文件
find /home -size 100	//在home目录下找大小为100*512字节的文件
find /home -size +10k	//在home目录下找大小大于10的文件
find /home -size -10k	//在home目录下找大小小于10的文件

find /home -maxdepth 3 -name vonfly		//在home目录下限制最深为3个目录层次，进行vonfly文件查找

```

## 其它操作
### 查看指令可以使用的参数
``` linux
man 指令名称	//例：man useradd
```

### 用户切换
``` linux
su -	//切换到root超级管理员
su vonfly	//切换到vonfly普通用户
exit	//退回到原用户
```
说明：一般su和exit是配对使用的，否则用户切换会叠加

### 查看当前用户是谁
``` linux
whoami	//显示当前正在操作系统的用户
who am i 	//显示登录系统的用户
```

### 查看指令对应的可执行(二进制)文件位置
``` linux
which 指令名称	(如：which pwd)
```

### 查看系统活跃的进程
``` linux
ps -A
ps -aux
```

### 将文本指定的信息匹配出来
``` linux
grep 关键字 文件的路径	//例：grep php ./test.txt 表示在当前文件test.txt中找php关键字
```

### 通过进程名称来查询程序(如mysql)是否有启用（管道使用）
``` linux
ps aux | grep mysql
pstree -p | grep mysql	//方法2
```

### 通过端口查看程序是否有启用（管道使用）
``` linux
netstat -anpl | grep 3306	//查看mysql（默认监听3306端口）
netstat -anpl | grep 9000	//查看php（默认监听9000端口）
netstat -tunpl | grep :3306	//方法2
```

### 查看系统分区情况
``` linux
df -lh
df -h
```

### 查看目录或者文件的大小
``` linux
du -h filename
```

### 关闭指定进程号的进程
``` linux
kill -9 pid		//强制关闭
kill -15 pid	//正常关闭
```

### 查看内存使用
``` linux
free -m
```

### 查看CPU使用
``` linux
top
```

### 关机
``` linux
shutdown -h now
```

### 可以切换终端
``` linux
alt+f(1-6),共有6个终端
```

### 实时跟踪一个命令的执行结果(如跟踪ls -lh命令)
``` linux
可以切换终端来查看具体效果
watch -n1 ls -lh
```

### 加压方式
``` linux
.tar.gz------------------> tar zxvf 压缩包名.tar.gz
.tar.bz2-----------------> tar jxvf 压缩包名.tar.bz2
```