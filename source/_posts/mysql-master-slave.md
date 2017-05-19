---
title: mysql-主从复制
date: 2017-03-20 09:27:11
tags: mysql
categories: mysql 
---

mysql主从复制和慢查询日志说明
<!-- more -->

#### MySQL主从复制
##### MySQL grant用户授权（先登录主服务器数据库进行用户授权）
在主服务器设置授权用户（授权所有权限关于所有数据库中所有表，给user这个用户从主机为192.168.10.2登录，密码为123456）
``` mysql
//方法1：
mysql> grant all on *.* to user@192.168.10.2 identified by '123456';
//方法2：
mysql> grant replication slave on *.* to user@192.168.10.2 identified by '123456';

//查看用户授权表（即mysql数据库中的user表）
mysql> select user,host,password from mysql.user;
```

##### 修改主数据库服务器的配置文件my.cnf，开启big-log日志，并设置server-id的值
log-bin=mysql-bin
server-id=1

##### 备份主服务器的数据库
``` mysql
//清除bin-log日志
mysql> reset master;
//备份数据库
mysql> /usr/local/mysql/bin/mysqldump -uroot -p123456 test -l -F > /tmp/test.sql
```

##### 同步从服务器上的数据
``` bash
//先从主服务器复制一份test.sql到从服务器(192.168.10.2)下的tmp目录
[root@localhost]# scp /tmp/test.sql 192.168.10.2:/tmp/

```

``` mysql
//登录从服务器数据库
mysql> /usr/local/mysql/bin/mysql -uroot -p123456 test
//清空所有的big-log日志
mysql> reset master;
//进行导入同步数据
mysql> /usr/local/mysql/bin/mysql -uroot -p123456 test < /tmp/test.sql
```

##### 配置从服务器的配置文件my.cnf
log-bin=mysql-bin
server-id=2
master-host=192.168.10.1
master-user=user
master-password=123456
master-port=3306

##### 重启从服务器mysql(先关闭mysql，再重启mysql)
``` linux
//关闭方法1
pkill mysqld

//关闭方法2
ps -aux | grep mysql	//先查看进程pid
kill -15 pid	//正常关闭

//重启mysql
/usr/local/mysql/bin/mysqld_safe --user=mysql &
```

##### 查看从服务器是否已经同步了（查看相应的主从复制进程列表）
方法1：
``` mysql
mysql> show slave status\G
```
如下图所示：
Slave_IO_Running:Yes	//此进程负责读取主服务器上的big-log日志，并且写入到从服务器上的big-log日志
Slave_SQL_Running:Yes	//此进程负责读取并且执行big-log日志
表示已经同步了（注意：以上两个都为Yes则表示成功，否则失败，错误原因可以从"last_error"字段的值中看到）

方法2：
``` mysql
mysql> show processlist\G
```
如下图所示：
state:waiting for master to send event	//表示连接主数据库为成功，而且成功获取big-log
state:has read all ready log;waiting for the slave i/o thread to update it	//表示成功执行big-log日志，正在等待着再次连接主数据库并更新获取big-log日志
表示已经同步了

##### 扩展
从数据库常用命令：
``` mysql
mysql> start slave;	//启动复制进程
mysql> stop slave;	//停止复制进程
mysql> show slave status;	//查看数据库状态
mysql> change master to		//动态改变服务器的配置
mysql> show processlist		//查看数据库运行进程
```

从数据库无法同步：
Show slave status显示slave_sql_running为No,seconds_behind_master为null
原因：
1、程序可能在slave上进行了写操作
2、也可能是slave机器(从服务器)重启后，事务回滚造成的

解决方法1：
``` mysql
mysql> slave stop;
mysql> set GLOBAL SQL_SLAVE_SKIP_COUNTER=1;
mysql> slave start;
```
解决方法2：
停止从服务器复制进程
``` mysql
mysql> slave stop;
```

查看主服务器当前的bin-log日志名和偏移量
``` mysql
mysql> show master status;	//下一步需要用到日志名称和偏移量
```
如图所示

最后到slave(从)服务器上执行手动同步
``` mysql
mysql> change master to
master_host="192.168.10.1",
master_user="user",
master_password="123456",
master_port=3306,
master_log_file="mysql-bin.000003",		//对应上一步的日志名称
master_log_pos=98;						//对应上一步的偏移量

//启动slave(复制进程)
mysql> slave start;
//最后再查看数据库状态
mysql> show slave status\G
```



#### MYSQL bin-log日志
##### 开启MYSQL bin-log日志

vim /etc/my.cnf
[mysqld]
....
log-bin=mysql-bin

##### bin-log日志相关mysql指令

可以查看是否开启bin-log日志
``` mysql
mysql> show variables like "%bin%";
```

生成一个最新的bin-log日志
``` mysql
mysql> flush logs;
```

查看big-log日志
``` mysql
mysql> show binary logs;
```

查看最后一个big-log日志
``` mysql
mysql> show master status;
```

清空所有的big-log日志
``` mysql
mysql> reset master;
```

使用mysqlbiglog来查看big-log日志（打开mysql-bin.000002日志）
``` bash
[root@localhost]# /usr/local/mysql/bin/mysqlbinlog --no-defaults mysql-bin.000002
```
如果不加参数--no-defaults会报错，报错内容是说字符集有问题

##### mysql备份和bin-log日志结合使用
例子：

1、对test数据库进行备份数据，备份完成的同时生成一个新的log-bin日志文件：
``` bash
[root@localhost]# /usr/local/mysql/bin/mysqldump -uroot -p123456 test -l -F > /tmp/test.sql
```
参数说明：-l为读锁(备份期间所有人都不能进行写的操作，但是可以进行读的操作)、-F(即相当于执行了flush logs指令),可以重新生成新的日志文件，其中包括log-bin日志

2、在备份完成后又添加了一些数据
``` mysql
mysql> insert into t1 values(3);
mysql> insert into t1 values(4);
mysql> insert into t1 values(5);
```

3、此时突然数据库损坏或者人为删除
模拟人为删除表
``` mysql
mysql> drop table t1;
```

如何恢复数据？
步骤一，先用已经备份的t1.sql来恢复数据
``` bash
[root@localhost]# /usr/local/mysql/bin/mysql -uroot -p123456 test -f < /tmp/test.sql
参数-f(可选参数)表示当遇到错误时，可以skip过去，继续执行下面的语句
```
但是自从上次备份后添加或者修改的数据会丢失，怎么办？只能用big-log来恢复

先查看最后生成的big-log日志
``` bash
[root@localhost]# /usr/local/mysql/bin/mysqlbinlog --no-defaults mysql-bin.000005 | more
```
截图如下：

找到对应的sql语句对应的end_log_post id
开始用big-log来恢复备份后添加或者修改的数据
``` bash
[root@localhost]# /usr/local/mysql/bin/mysqlbinlog --no-defaults --stop-position='666' mysql-bin.000005 | /usr/local/mysql/bin/mysql -uroot -p123456 test
```

mysqlbinlog可选参数说明：
--start-position='20'
--stop-position='111'
--start-date='2017-01-18 00:00:00'
--stop-date='2017-01-18 23:59:59'