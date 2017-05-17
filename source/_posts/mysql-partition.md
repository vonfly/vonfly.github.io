---
title: mysql-分区技术
date: 2017-03-16 09:20:40
tags:
---

mysql-分区技术
<!-- more -->

## MYSQL分区技术
MYSQL的分区技术与水平分表有点类似，但是它是在逻辑层进行的水平分表，对于应用程序而言它还是一张表。
MYSQL5.1有5种分区类型：
RANGE分区：基于属于一个给定连续区间的列值，把多行分配给分区
LIST分区：类似于RANGE分区，区别在于LIST分区是基于列值分配一个离散集合中的某个值来进行选择
HASH分区：。。。
KEY分区：。。。

例子1：假定你创建了一个如下的表，该表保存有20家音像店的职员记录，这20家音像店的编号从1到20.如果你想将其分成4个小分区，那么你可以采用RANGE分区，创建的数据库表如下：
``` mysql
mysql> CREATE TABLE employees(
	id INT NOT NULL,
	fname VARCHAR(30),
	iname VARCHAR(30),
	hired DATE NOT NULL DEFAULT '1970-01-01',
	separated DATE NOT NULL DEFAULT '9999-12-31',
	job_code INT NOT NULL,
	store_id INT NOT NULL
)engine=myisam default charset=utf8
PARTITION BY RANGE(store_id)(
	PARTITION p0 VALUES LESS THAN(6),
	PARTITION p1 VALUES LESS THAN(11),
	PARTITION p2 VALUES LESS THAN(16),
	PARTITION p3 VALUES LESS THAN(21)
);
```

例子2：假定你创建了一个如下的表，该表保存有20家音像店的职员记录，这20家音像店的编号从1到20。如果你想把不同时期离职的员工进行分别存储，那么你可以将日期字段separated(即离职时间)作为一个key，创建的数据库表如下：
``` mysql
mysql> CREATE TABLE employees1(
	id INT NOT NULL,
	fname VARCHAR(30),
	iname VARCHAR(30),
	hired DATE NOT NULL DEFAULT '1970-01-01',
	separated DATE NOT NULL DEFAULT '9999-12-31',
	job_code INT NOT NULL,
	store_id INT NOT NULL
)
PARTITION BY RANGE(YEAR(separated))(
	PARTITION p0 VALUES LESS THAN(1991),
	PARTITION p1 VALUES LESS THAN(1996),
	PARTITION p2 VALUES LESS THAN(2001),
	PARTITION p3 VALUES LESS THAN MAXVALUE
);
```
说明：YEAR()是mysql的一个日期函数，将日期类型的字段转换为整数类型，从而就可以作为RANGE分区的key。

### 条件(range、list)分区算法管理
增加分区：
	alter table 表名 add partition(
		partition 分区名  values less than[in] (常量[列表]),
		partition 分区名  values less than[in] (常量[列表]),
		....
	)
减少分区：
	alter table 表名 drop  partition 分区名称;
	减少分区，会丢失对应分区的数据。

例如：
``` mysql
mysql> alter table employees1 add partition(
	partition p4 values less than (2008),
	partition p4 values less than (2009)
);
```

### innodb表数据结构
对于innodb表的数据结构，首先要解决两个概念性的问题：共享表空间以及独占表空间。
共享表空间以及独占表空间都是针对数据的存储方式而言的。
共享表空间：某一个数据库的所有的表数据、索引文件全部放在一个文件中，默认这个共享表空间的文件路径在data目录下，默认的文件名为：ibdata1，初始化大小为10M。
独立表空间：每一个表都将会生成以独立的文件方式来进行存储，每一个表都有一个。frm表描述文件，还有一个.ibd文件。其中这个文件包括了单独一个表的数据内容以及索引内容，默认情况下他的存储位置也是在表的位置之中

#### 查看innodb表空间设置
``` mysql
//为on表示是独立表空间，off表示共享表空间
mysql> show variables like 'innodb_file_per_table';
```

#### 如何修改innodb表为独立表空间
配置mysql的配置文件my.cnf
...
innodb_data_home_dir="C:\mysql\data\"	//默认存在的，只需把前面井号去掉即可
innodb_log_group_home_dir="C:\mysql\data\"	//默认存在的，只需把前面井号去掉即可
innodb_data_file_path=ibdata1:10M:autoextend	//默认存在的，只需把前面井号去掉即可
innodb_file_per_table=1

参数说明：
这些设置表示配置一个可扩展大小的尺寸为10MB的单独文件，名为ibdata1,没有给出文件的位置，所以默认的是在mysql的数据目录内。
innodb_data_home_dir	//代表为数据库文件所存放的目录
innodb_log_group_home_dir	//为日志存放目录
innodb_file_per_table	//是否使用共享以及独立表空间来
以上的几个参数必须在一起加入


#### 把共享表空间的表转移到独立表空间
步骤：
1、使用mysqldump导出所有数据库表数据
2、停止mysql服务，修改参数（修改为独立表空间），并删除原先innodb共享表相关文件
3、重启mysql服务
4、重新导入数据

说明：
1、只有把innodb设置成独立表空间后，才能创建成功innodb表引擎的表分区
2、mysql5.6之后版本默认配置是独立表空间
