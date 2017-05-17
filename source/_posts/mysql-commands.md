---
title: mysql简单操作
date: 2017-03-08 12:53:03
tags: mysql
categories: mysql 
---

常用的一些mysql操作（mysql高性能优化、mysql深入浅出）
<!-- more -->

#### mysql具体语法帮助
``` mysql
mysql> ? contents 	//查看所有帮助大纲，然后通过帮助大纲再用?继续往下查询具体语法
mysql> ? index 	 //查看索引具体操作帮助信息
mysql> ? view 	//查看视图具体操作帮助信息
mysql> ? create view 	//创建视图具体操作帮助信息

mysql> ? reg%	//如果记不住全称，可以使用%来代替
```

#### 结果进行行列颠倒（\G）
``` mysql
mysql> show plugins;
mysql> show plugins\G
```

#### mysql表复制（包括复制表结构和表数据）
``` mysql
mysql> create table vf_a2 like vf_a1;	//先复制表结构
mysql> insert into vf_a2 select * from vf_a1;	//复制表数据。说明：表vf_a1和表vf_a2字段完全一样的前提下用*，否则要复制某些字段要具体写字段
```

#### 表名修改
``` mysql
//把表名为t2修改为t1
mysql> rename table t2 to t1;
```

#### 索引的创建、删除、查看
##### 方法一： create index（创建索引）、drop index（删除索引）
``` mysql
mysql> create index in_name on vf_a1(name);	//为表vf_a1的name字段创建普通索引

mysql> create unique index un_name on vf_a1(name);	//为表vf_a1的name字段创建唯一索引

mysql> drop index in_name on vf_a1;	//删除表vf_a1名称为in_name的索引

```

##### 方法二（常用以及全面的方法，可以创建普通索引、唯一(unique)索引和主键(primary key)索引）：
``` mysql
mysql> alter table vf_a1 add index in_name(name);	//为表vf_a1的name字段创建普通索引

mysql> alter table vf_a1 add unique in_name(name);	//为表vf_a1的name字段创建唯一索引

mysql> alter table vf_a1 drop index in_name;	//删除表vf_a1名称为in_name的索引


//删除主键索引（先删除主键字段的自增，然后再删除主键索引）
mysql> id int unsigned not null auto_increment	//原来字段
mysql> alter table vf_a1 modify id int unsigned not null;	//修改字段（不写auto_increment就是把auto_increment(自增)删除了）
mysql> alter table vf_a1 drop primary key;	//再删除主键索引


//增加主键索引(先添加主键索引，再修改主键字段为自增)
mysql> alter table vf_a1 add primary key(id);
mysql> id int unsigned not null;	//原来字段
mysql> alter table vf_a1 modify id int unsigned not null auto_increment;	//修改主键字段为自增
```

##### 查看索引
``` mysql
mysql> show index from vf_a1;	//查看表vf_a1下的索引
```

#### mysql视图（中间表，把满足条件的记录生成一张中间表，就可以直接对这张表进行增删改查，提高性能）
##### 创建视图
``` mysql
mysql> create view v_a1 as select * from a1 where id>8;
```

##### 查看视图（即查看表）
``` mysql
mysql> show tables;
```

##### 删除视图
``` mysql
mysql> drop view v_a1;	//删除名称为v_a1的视图
```

#### mysql存储

需求：向表a1（有主键id和name两个字段）插入一百条数据，字段name的值依次为user1、user2、user3.....user100

先修改定界符，因为mysql存储很多语句都是以分号结束的
``` mysql
mysql> \d //	//把语句定界符分号修改为//
```
再创建存储
``` mysql
mysql> create procedure p1()
	-> begin
	-> set @i=1;
	-> while @i<=100 do
	-> insert into a1(name) values(concat("user", @i));
	-> set @i=@i+1;
	-> end while;
	-> end//
```
最后执行刚刚创建的存储p1
``` mysql
mysql> call p1;

mysql> select * from a1;	//查看数据是否创建成功
```

##### 查看mysql存储
``` mysql
mysql> show procedure status;	//查看存储状态

mysql> show create procedure p1;	//查看存储p1的具体信息
```

##### mysql事务处理(innodb表引擎才支持)
``` mysql
//关闭自动提交功能
mysql> set autocommit=0;
```

``` mysql
//从表a1中删除了一条记录
mysql> delete from a1 where id=11;
```

``` mysql
//此时做一个p1还原点
mysql> savepoint p1;
```

``` mysql
//再次从表a1中删除了一条记录
mysql> delete from a1 where id=12;
```

``` mysql
//再次做一个p2还原点
mysql> savepoint p2;
```

``` mysql
//此时恢复到p1还原点，当然后面的p2这些还原点自动会失效
mysql> rollback to p1;
```

``` mysql
//如果退回到最原始的还原点
mysql> rollback;
```

##### 清空表(清空内容以及auto_increment恢复成1开始)
``` mysql
mysql> truncate table tablename;
```

##### mysql变量使用（需要查些资料多学习下,如mysql手册）
1、需求：查询排名
create table vo_students(
	id int unsigned not null auto_increment,
	name varchar(30) not null default '' comment '名字',
	score smallint not null default 0 comment '分数',
	primary key (id)
)engine myisam default charset utf8;
insert into vo_students(name, score) values ('zhang', 100),('li', 89),('sun', 57),('zhao', 100),('zhou', 89),('qian', 92);

具体方法：
set @pres:=0,@currs:=0,@rank:=0;
select name,(@currs:=score) as score, @rank:=if(@currs<>@pres,@rank:=@rank+1,@rank) as rank,@pres:=score as prev from vo_students order by score desc;






mysql内置函数-------------------------------------------------------------------

字符串函数：

CONCAT(string2 [,....]) 	//连接字符串
``` mysql
select concat("hello ", "world");
```

LCASE(sting2) 	//转换成小写
UCASE(sting2) 	//转换成大写

LENGTH(string2) 	//string2的长度
``` mysql
select length("vonfly");
```

LTRIM(string2) 	//去除左边空格
RTRIM(string2) 	//去除右边空格

REPEAT(string2,count) 	//重复count次
``` mysql
select repeat("vonfly", 6);
```

REPLACE(string2, search_str, replace_str) 	//在string2中用replace_str替换search_str
``` mysql
select replace("vonfly is my web", "my", "your");
```

SUBSTR(string2, position [,length]) 	//从string2的position开始，取length个字符
``` mysql
select substr("vonfly is my web", 1, 5);
```

SPACE(count) //生成count个空格

日期函数
CURDATE() 	//返回当前日期
CURTIME() 	//返回当前时间
NOW() 		//返回当前的日期时间
UNLX_TIMESTAMP(date) 	//返回当前date的UNIX时间戳
FROM_UNIXTIME() 	//返回UNLX时间戳的日期值
YEAR(date) 	//返回日期date的年份
DATEDIFF(expr1,expr2) 	//返回起始时间expr1和结束时间expr2的天数




