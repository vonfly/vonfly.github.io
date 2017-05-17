---
title: mongodb数据库一些简单操作
date: 2017-05-02 23:13:18
tags: [nosql]
category: 数据库
---

mongodb一些基本操作
<!-- more -->

## 进入(登录)客户端操作
``` base
# /usr/local/mongodb/bin/mongo
```
### 控制台(客户端)中的基本操作命令
切换数据库：use test;
显式创建数据库：db.createCollection("a1");
查看当前操作的数据库：db;
查看用户列表：db.system.users.find();
查看所有用户：show users;
查看所有数据库：show dbs;
查看所有集合：show collections;
删除当前数据库：db.dropDatabase();
删除集合：db.user.drop();	//删除user集合
想知道mongodb支持哪些命令：help;
想知道当前数据库支持哪些方法：db.help();
想知道当前集合支持哪些方法：db.user.help();	//查看user集合支持的方法
终端清屏：cls



### 集合的增删改查操作
查询user集合的记录
db.user.find();	//查询全部记录
db.user.find({name:"vonfly"});	//查询name为vonfly的记录
db.user.findOne({name:"vonfly"});	//查询name为vonfly的第一条记录

向user集合插入一条记录
db.user.insert({name:"vonfly"});

修改记录(把name为vonfly的修改name为test)
db.user.update({name:"vonfly"}, {$set: {name:"test"} });

删除记录
db.user.remove({name:"vonfly"});	//删除name为vonfly的记录
db.user.remove();	//删除全部记录

### 增删改查的高级应用
#### Capped Collectioin(固定集合)
属性及用法
属性1：对固定集合进行插入速度极快
属性2：按照插入顺序的查询输出速度极快
属性3：能够在插入最新数据时，淘汰最早的数据

用法1：储存日志信息
用法2：缓存一些少量的文档

##### 固定集合的创建（需要显式创建）
//创建一个集合为vn_user的固定集合，大小为10000字节。还可以限定文档个数，加上max:100属性
db.createCollection("vn_user", {capped:true, size:10000});
注意：指定文档上限，必须指定大小。文档限制是在容量没满时进行淘汰，要是满了，就根据容量限制来进行淘汰

普通集合转换成固定集合
db.runCommand({converTocapped:"test", size:10000});	//把test普通集合转换成固定集合，大小为10000字节

自然排序
固定集合文档按照插入顺序储存的，默认情况下查询就是按照插入顺序返回的，可以使用$natural调整返回顺序
db.my_collection.find().sort({"$natural": 1});	//1表示默认顺序，-1则相反

判断是否为固定集合
db.test.isCapped();	//判断test集合是否为固定集合
db.test.stats();	//或者用此命令，对应"capped":1就是固定集合


#### GridFS大文件管理（使用mongofiles二进制程序）
GridFS是一种在mongodb中存储大二进制文件的机制。GridFS使用两个表来存储数据：其中files是包含数据对象；chunks是包含其他一些相关信息的二进制块。
使用的原因：
1、储存巨大的文件，比如视频、高清图片等
2、利用GridFS可以简化需求。
3、GridFS可以避免用户上传内容的文件系统出现问题
4、GridFS故障恢复和扩展很容易
5、GridFS不产生磁盘碎片

查看mongofiles支持对应的参数

``` base
# # /usr/local/mongodb/bin/mongofiles -h
```

上传文件

``` base
# /usr/local/mongodb/bin/mongofiles put test.tar.gz
```
进入客户端，查看集合，会发现多了两个集合，fs.chunks和fs.files

下载文件

``` base
# /usr/local/mongodb/bin/mongofiles get test.tar.gz
```

### 性能优化
查看查询语句的执行计划(类似查看mysql语句执行所用的时间和影响的行数，目的就是要对语句进行优化，看需不需要建立索引)，使用以下语句进行查看

db.user.find({name:"user1"}).explain();

#### 建立索引（普通索引）
//在user集合的name上建立索引
db.user.ensureIndex({name:1});	//值1表示升序建立，-1表示降序建立索引

注意：当系统已经有大量数据时，创建索引会非常耗时，需要在后台执行，所以要指定参数background:true
db.user.ensureIndex({name:1}, {background:true});

##### 创建唯一索引
db.user.ensureIndex({name:1}, {unique:true});

##### 简单查看索引
db.user.getIndexKeys();

##### 查看索引详细信息
db.user.getIndexes();

##### 删除索引
//删除user集合中的所有索引
db.user.dropIndexes();

//删除user集合中的name索引
db.user.dropIndex({name:1});

### 优化器profile(慢查询日志功能)
mongodb database profiler 是一种慢查询日志功能，可以作为我们优化数据库的依据。

#### 开启profile功能
级别的值为：0表示不开启，1表示慢命令(默认为>100ms)，2表示记录所有命令

方法1：启动mongodb时加上--profile=1

方法2：在客户端调用db.setProfilingLevel(级别)命令来实时配置

说明：
1、profile信息是保存在system.profile中。我们可以通过db.getProfilingLevel()命令来获取当前的Profile级别
2、profile在级别为1时会记录慢命令，默认的慢查询时间为100ms，修改默认时间有两种方法：一种是启动mongodb时加上--profile=1和--slowms=10；  第二种方式是用命令db.setProfilingLevel(1)，表示如果查询耗时超过10毫秒，就会被记录下来
3、数据库profiler把数据写入 system.profile 集合中，该集合是一个 capped collection 。可以用普通的MongoDB查询语句查询 system.profile 集合得到profiler的输出。

### 优化总结
1、创建索引，在查询条件的字段上，或者排序条件的字段上创建索引，可以提高执行效率，如db.user.ensureIndex({name:1});
2、限定返回结果条数，使用limit()限定返回结果集的大小，可以减少database server的资源消耗，可以减少网络传输数据量。如db.user.find().limit(10);
3、查询使用到的字段，不要查询所有字段。如db.user.find({}, {name:1,age:1}).sort({age:-1}).limit(10);
4、采用cappedcollection(固定集合)，capped Collections比普通Collections的读写效率高
5、采用profiling(慢查询日志功能)，profiling功能肯定是会影响效率的，但是不太严重，原因是它使用的是system.profile来记录，system.profile是一个capped collection(固定集合)，这种collection在操作上有一些限制和特点，但是效率高




## mongodb主从集群
mongodb支持在多个机器中通过异步复制达到故障转移和实现冗余。多机器中同一时刻只有一台是用于写操作。正是由于这个情况，为mongodb提供了数据一致性的保障。担当primary(主服务器)角色的机器能把读操作分发给slave(从服务器)。

### replica sets复制（副本集）
mongodb在1.6版本开发了replica set，主要增加了故障自动切换和自动修复成员节点，各个db之间数据完全一致，最为显著的区别在于，副本集没有固定的主节点，它是整个集群选举出的一个主节点，当其不工作时变更其他节点。（简单来说就是当主服务器挂了，那么剩余从服务器会自动选举一个出来做主服务器）

### 部署replica sets（测试）
1、启动两个实例（模拟两个mongodb服务器）
2、创建数据文件存储路径

``` base
# mkdir -p /usr/local/mongodb/data/data1/
# mkdir -p /usr/local/mongodb/data/data2/
```

3、创建日志文件路径

``` base
# mkdir -p /usr/local/mongodb/log/dblogs1
# mkdir -p /usr/local/mongodb/log/dblogs2
```

4、创建key目录

``` base
# mkdir -p /usr/local/mongodb/key/
# cd /usr/local/mongodb/key/
# touch key1
# touch key2
# echo "123456" > key1
# echo "123456" > key2
# chmod 600 *
```

5、启动一个实例

``` base
# /usr/local/mongodb/bin/mongod --replSet rs1 --keyFile=/usr/local/mongodb/key/key1 --port 200001 --dbpath=/usr/local/mongodb/data/data1/ --logpath=/usr/local/mongodb/log/dblogs1 --fork
```

再启动一个实例

``` base
# /usr/local/mongodb/bin/mongod --replSet rs1 --keyFile=/usr/local/mongodb/key/key2 --port 200002 --dbpath=/usr/local/mongodb/data/data2/ --logpath=/usr/local/mongodb/log/dblogs2 --fork
```

6、配置及初始化replica set（登录一台机器进行配置）

``` base
# /usr/local/mongodb/bin/mongo --port 200001
```

进入后，直接配置（直接输入）即可
config_rs1={
	_id:"rs1",
	members:[
		{_id:0, host:"localhost:200001", priority:1},
		{_id:1, host:"localhost:200002", priority:2}
	]
}

最后初始化配置
rs.initiate(config_rs1);

这样就配置好了，端口号为200002的就相当于主服务器(因为优先级priority比较大)，端口号200001就是从服务器，主服务器可以就行增删改查数据，从服务器就只能查询数据

登录从服务器客户端输入命令，这样才有读的权限
rs.slaveOk();

扩展：
查看副本集状态命令：rs.status();

## 参考
[mongodb中文社区](http://docs.mongoing.com/manual-zh/tutorial/insert-documents.html)
[菜鸟教程](http://www.runoob.com/mongodb/mongodb-capped-collections.html)