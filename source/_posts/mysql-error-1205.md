---
title: ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
date: 2016-09-01 19:43:18
tags: [mysql]
categories: mysql
---
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

mysql被锁住了

产生这个问题的原因是因为在mysql中产生了事务A，执行了修改的语句，比如： update t1 set aget=18 where id=1;此时事务并未进行提交，事务B开始运行，也同样需要修改id为1的用户的年龄： update t1 set aget=20 where id=1; 那么此时事务B会等待事务A结束释放写锁才能执行成功，否则则会等待一段时间，产生报错：

ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

<!-- more -->

## 下面开始模拟锁表的场景

### 1、打开一个终端，连接上mysql，关闭事务自动提交，执行一个update语句

![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error1.png)

查看连接的id：
![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error2.png)

### 2、打开另外一个终端，用mysql连接上去，更新一步骤中的update的那条数据
然后等待一会，会报ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error3.png)

### 3、再打开一个终端连接上去，查看锁的状态

在mysql5.5之后，information_schema数据库加了三个关于锁的表

innodb_trx ## 当前运行的所有事务

innodb_locks ## 当前出现的锁

innodb_lock_waits ## 锁等待的对应关系

![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error4.png)

这个表对于排查因为事务未提交引起的锁问题可以说是举足轻重。当我们有事务长时间未提交导致锁住数据库，其他程序拿不到锁的时候，因为对这张表进行排查。

通过这个表我们可以查出连接的线程ID，可根据时间判断怀疑一下
![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error5.png)

比如我们获取一条记录的线程id， 即可拿着该线程id去information_schma.processlist中获取他的具体情况

我们可以通过如下的方法找出连接的服务器，进而判断进程：
![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error6.png)

此处host可以出现端口，然后再用lsof –p $port 来查看是哪个程序，基本上就可以确认了，是哪个程序搞的鬼，接下来看下记录锁信息的表 innodb_locks
![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error7.png)

此时如果我们要想恢复，可以手动杀掉id9的连接，如果是死锁的情况下。
![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error8.png)

在第一个终端查看：
![mysql-error](http://olixffhc0.bkt.clouddn.com/mysql-error9.png)

[参考](https://www.cnblogs.com/topicjie/p/7323248.html)