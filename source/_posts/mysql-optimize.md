---
title: mysql-SQL语句技巧和优化
date: 2017-03-13 09:16:46
tags: mysql
categories: mysql 
---

SQL语句技巧和优化
<!-- more -->

## mysql SQL语句技巧和优化
mysql5.5及之后版本默认存储引擎是innodb


### 巧用RAND()提取随机行
rand()是获取一个0-1之间的随机数
``` mysql
select * from st_vonfly order by rand();
```
随机抽取3条数据样本
``` mysql
select * from st_vonfly order by rand() limit 3;
```

### 优化group by语句
有的sql语句在执行的时候，本身默认会有排序效果
但是有的时候我们的业务不需要排序效果，就可以进行强制限制，进而“节省默认排序”的资源。

如果查询包含group by但用户想要避免排序结果的损耗，则可以使用order by null来禁止排序：

### 优化嵌套查询
表1如图：
CREATE TABLE `tp_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  `parents_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8
表2如图：
CREATE TABLE `tp_parents` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_name` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8

下面是采用嵌套查询的效果（可以使用更有效的连接查询(JOIN)替代）

mysql> desc select * from tp_parents where id in(select parents_id from tp_user)
\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: tp_parents
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 3
        Extra: Using where
*************************** 2. row ***************************
           id: 2
  select_type: DEPENDENT SUBQUERY
        table: tp_user
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using where
2 rows in set (0.06 sec)



#### 数据库优化
优化表的类型
通过拆分提高表的访问效率
使用中间表提高统计查询速度

#### MYSQL服务器优化
##### 四种字符集问题(统一设置为utf8)
``` mysql
mysql> \s
```
如何设置？
vim /etc/my.cnf
[client]
#password=your_password
port=3306
socket=/tmp/mysql.sock
default-character-set=utf8	//控制的是客户端字符集和连接字符集


[mysqld]
.......
myisam_sort_buffer_size=8M
character-set-server=utf8	//控制服务器字符集和数据库字符集
collation-server=utf8_general_ci	//校验字符集，主要针对的排序

查看中文字符集以及对应的校验字符集
``` mysql
mysql> show character set;
```
如图所示：


##### bin log日志问题

##### slow log慢查询日志问题
可以查看是否开启慢查询日志
``` mysql
mysql> show variables like "%slow%";
```
设置的慢查询时间
``` mysql
mysql> show variables like "%long%";
```
开启慢查询日志和设置慢查询时间：
vim /etc/my.cnf
[mysqld]
.......
log_slow_queries=slow.log
long_query_time=5

##### socket问题
mysql socket无法登录
1.有时登录mysql时提示不能用socket登录，此时可以换成tcp方式去登录，但是只有测试时可以这样用，必须要在php去用之前把这个事情解决了

``` base
# mysql -uroot -p123456 --protocol tcp -hlocalhost
```

这样就可以登录，就不用mysql.socket来登录。
把mysql重新启动就会自动生成socket文件

##### root密码丢失
root密码丢失破解步骤
1.service mysqld stop	//把mysql关闭
2.mysqld_safe --skip-grant-tables --user=mysql &	//跳过授权表mysql.user和mysql.db来重启mysql
3.mysql -uroot;	//登录进mysql
4.
``` mysql
mysql> update mysql.user set password=password("123456") where user="root" and host="localhost";
```



### SQL语句的优化步骤
一、通过慢查询日志查看效率低的sql语句
二、通过explain或者desc解析sql语句(查看是否需要做索引)
``` mysql
explain select * from table where id = 8\G
desc select * from table where id = 8\G
```

每一列的简单解释
id:1
select_type:SIMPLE	//表示select的类型，常见的取值有SIMPLE(简单表，即不使用表连接或者子查询)、PRIMARY(主查询，即外层的查询)、UNION(UNION中的第二个或者后面的查询语句)、SUBQUERY(子查询中的第一个SELECT)等
table:stu	//输出结果集的表
type:range	//表示表的连接类型，性能由好到查：system(表仅一行)、const(只一行匹配)、eq_ref(对于前面的每一行使用主键和唯一)、ref(同eq_ref，但没有使用主键和唯一索引)、ref_or_null(同前面，对null查询)、index_merge(索引合并优化)、unique_subquery(主键子查询)、index_subquery(非主键子查询)、range(表单中的范围查询)、index(都通过查询索引来得到数据)、all(通过全表扫描得到的数据)
possible_keys:name,ind_stu_name	//表查询时可能使用的索引
key:name	//表示实际使用的索引
key_len:50	//索引字段的长度
ref:NULL
rows:8	//扫描行的数量
Extra:Using where;Using index	//执行情况的说明和描述

总结：where 和 order by后边的条件字段都可以适当设置索引、分组字段也可以添加索引，避免产生临时表


#### 对表的优化和检测
##### 检查一个或多个表是否有错误
语法如下：
``` mysql
mysql> CHECK TABLE tb1_name[,tb1_name]...[option]... 	option={QUICK|FAST|MEDIUM|EXTENDED|CHANGED}
```
例子（检查a1表是否有错误）：
``` mysql
mysql> check table a1;
```

##### 对损坏或错误的表进行修复
语法如下：
``` mysql
mysql> repair TABLE tb1_name[,tb1_name]...[option]...
```
例子（修复a1表）：
``` mysql
mysql> repair table a1;
```

##### 定期优化表（找访问较少的时间进行优化，防止影响业务）
如果已经删除了表的一大部分，或者如果已经对含有可变长度行的表进行了很多的改动，则需要做定期优化。这个命令(optimize)可以将表中的空间碎片进行合并，但是此命令只对myisam、BDB和innobd表起作用。

语法：
``` mysql
mysql> OPTIMIZE [LOCAL|NO_WRITE_TO_BINLOG] TABLE tb1_name [,tb1_name]
```
例子(对a1表进行优化)：
``` mysql
mysql> optimize table a1;
```

##### 字段类型选择
原则：当一个列可以选择多种数据类型时，应该优先考虑数字类型，其次是日期或者二进制类型，最后是字符类型。对于相同级别的数据类型，应该优先选择占用空间小的数据类型。

###### 信息最好存储为整型的(mysql运行速度快，运算速度快)
时间信息可以存储为整型的(时间戳)，用int类型
select from_unixstamp(时间戳)  from 表名

set集合类型 多选：set(‘篮球’,’足球’,’棒球’,’乒乓球’);
enum枚举类型 单选： enum(‘男’,’女’,’保密’);
推荐使用set和enum类型，内部会通过整型信息参数具体计算、运行。

ip地址也可以变为整型信息进行存储(mysql内部有算法，把ip变为数字)：
mysql： inet_aton(ip)   inet_ntoa(数字)
php:      ip2long(ip)       long2ip(数字)

###### 尽量少的占据存储空间

tinyint : 0~255				1字节
smallint : 0~ 65535			2字节
mediumint : 0~1千6百多万	3字节
int : 0~40多亿				4字节

###### 数据的整合最好固定长度
char    :0~255个字符
varchar : 0~65535 字节 看表编码，如果是utf8存2万多汉字 gbk存3万多汉字

char(长度)
固定长度，运行速度快
长度：255字符限制
varchar(长度)
长度不固定，内容比较少要进行部位操作，该类型要保留1-2个字节保存当前数据的长度
长度：65535字节限制
     存储汉字，例如字符集utf8的(每个汉字占据3个字节)，最多可以存储65535/3-2字节
     		   例如字符集gbk的(每个汉字占据2个字节)，最多可以存储65535/2-2字节

如存储手机号码：char(11) ，可以选取固定长度的 