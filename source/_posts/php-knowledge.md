---
title: 收集、总结的一些PHP理论知识（对于面试有帮助）
date: 2017-02-28 19:43:19
tags: [面试, 理论知识]
categories: PHP
---
本页面主要用于编写一些理论知识，从网上找的或者自己总结的都会有。主要用于自己学习。如发现本网站载有侵犯您著作权的侵权信息，可联系我删除(●'◡'●)

<!-- more -->

#### 用最少的代码写一个求3值最大值的函数

``` php
function($a,$b,$c){
	return $a > $b ? ($a > $c ? $a : $c) : ($b > $c ? $b : $c);
}
```

#### 用PHP打印出前一天的时间，打印格式是2007年5月10日22:21:21
``` php
echo date('Y-m-d H:i:s', strtotime('-1 day'));
```

#### 输出正在浏览当前页面用户的IP地址
``` php
echo $_SERVER["REMOTE_ADDR"];
```

#### 查询（query）的字符串URL中第一个问号 ? 之后的内容（比如http://localhost/text.php?id=1&bi=2，查询出 id=1&bi=2 ）
``` php
echo $_SERVER["QUERY_STRING"];
```

#### 当前运行脚本所在的文档根目录
``` php
echo $_SERVER["DOCUMENT_ROOT"];
```

#### 写一个函数，能够遍历一个文件夹下的所有文件和子文件夹
``` php
function my_scandir($dir)
{
	$files=array();
	if(is_dir($dir))
	{
		if($handle=opendir($dir))
		{
			while(($file=readdir($handle))!==false)
			{
				if($file!="." && $file!="..")
				{
					if(is_dir($dir."/".$file))
					{
						$files[$file]=my_scandir($dir."/".$file);
					}
					else
					{
						$files[]=$dir."/".$file;
					}
				}
			}
			closedir($handle);
			return $files;
		}
	}
}
var_dump(my_scandir("F:ali"));
```
#### 请用正则表达式（Regular Expression）验证电子邮件的格式是否正确。
``` php
$email = '1185236@163.com';
if( !preg_match('/^[\w.]+@([\w.]+)\.[a-z]{2,6}$/i', $email) )
{
	echo "电子邮件格式不正确！";
}
else
{
	echo "电子邮件格式正确！";
}
```

#### 用PHP写出显示客户端IP与服务器IP的代码
``` php
echo $_SERVER["REMOTE_ADDR"];		//客户端IP
echo gethostbyname("www.baidu.com");	//服务器IP
```

#### 如何修改SESSION的生存时间
方法1：将php.ini中的session.gc_maxlifetime设置为9999重启apache

方法2：在当前项目中修改
``` php
$expire = 3600 * 3;
ini_set('session.gc_maxlifetime', $expire);
ini_set('session.cookie_lifetime', $expire);
```

#### 有一个网页地址, 比如百度主页: http://www.baidu.com/,如何得到它的内容?
方法1：
``` php
$readcontents = fopen("http://www.baidu.com/", "rb");
$contents = stream_get_contents($readcontents);
fclose($readcontents);
echo $contents;
```
方法2：
``` php
$readcontents = file_get_contents("http://www.baidu.com/");
echo $readcontents;
```

#### 请说明php中传值与传引用的区别。什么时候传值什么时候传引用?
按值传递：函数范围内对值的任何改变在函数外部都会被忽略

按引用传递：函数范围内对值的任何改变在函数外部也能反映出这些修改

优缺点：按值传递时，php必须复制值。特别是对于大型的字符串和对象来说，这将会是一个代价很大的操作。

按引用传递则不需要复制值，对于性能提高很有好处。

#### 写一个函数，尽可能高效的，从一个标准 url 里取出文件的扩展名
例如: http://www.sina.com.cn/abc/de/fg.php?id=1 需要取出 php 或 .php
方法1：
``` php
function getExt($url){
	$arr = parse_url($url);
	$file = basename($arr['path']);
	$ext = explode(".", $file);
	return $ext[1];
}
echo getExt('http://www.sina.com.cn/abc/de/fg.php?id=1');
```
方法2：
``` php
function getExt($url) {
	$url = basename($url);
	$pos1 = strpos($url, ".");
	$pos2 = strpos($url, "?");
	$length = $pos2 - $pos1 - 1;
	if(strstr($url, "?")){
		return substr($url, $pos1 + 1, $length);
	} else {
		return substr($url, $pos1);
	}
}
echo getExt('http://www.sina.com.cn/abc/de/fg.php?id=1');
```

#### 使用五种以上方式获取一个文件的扩展名
要求：dir/upload.image.jpg，找出 .jpg 或者 jpg ，
必须使用PHP自带的处理函数进行处理，方法不能明显重复，可以封装成函数，比如 get_ext1($file_name), get_ext2($file_name)

``` php
$file_name = 'dir/upload.image.jpg';
function get_ext1($file_name){
	return strrchr($file_name, '.');
}
echo get_ext1($file_name);
```

``` php
$file_name = 'dir/upload.image.jpg';
function get_ext2($file_name){
	return substr( $file_name, strrpos($file_name, '.') );
}
echo get_ext2($file_name);
```

``` php
$file_name = 'dir/upload/image.jpg';
function get_ext3($file_name){
	$stack = explode('.', $file_name);
	$fruit = array_pop($stack);
	return $fruit;
}
echo get_ext3($file_name);
```

``` php
$file_name = 'dir/upload/image.jpg';
function get_ext4($file_name){
	$p = pathinfo($file_name);
	return $p['extension'];
}
echo get_ext4($file_name);
```

``` php
$file_name = 'dir/upload/image.jpg';
function get_ext5($file_name){

return strrev(substr(strrev($file_name), 0, strpos(strrev($file_name), '.')));

}
echo get_ext5($file_name);
```

#### 输出以下值
``` php
$str1 = null;
$str2 = false;
echo $str1==$str2 ? '相等' : '不相等';
//输出相等

$str3 = '';
$str4 = 0;
echo $str3==$str4 ? '相等' : '不相等';
//输出相等

$str5 = 0;
$str6 = '0';
echo $str5===$str6 ? '相等' : '不相等';
//输出不相等
```

#### MySQL数据库中的字段类型varchar和char的主要区别是什么?那种字段的查找效率要高，为什么?
varchar是变长，节省存储空间，char是固定长度。查找效率要char型快，因为varchar是非定长，必须先查找长度，然后进行数据的提取，比char定长类型多了一个步骤，所以效率低一些

#### 写出三种以上MySQL数据库存储引擎的名称（提示：不区分大小写）
MyISAM、InnoDB、BDB（Berkeley DB）、Merge、Memory（Heap）、Example、Federated、Archive、CSV、Blackhole、MaxDB 等等十几个引擎

#### 求两个日期的差数，例如2007-2-5 ~ 2007-3-6 的日期差数
``` php
function get_days($date1, $date2)
{
	$time1 = strtotime($date1);
	$time2 = strtotime($date2);
	return abs($time2-$time1)/86400;
}
echo get_days('2007-2-5', '2007-2-6');
```

#### 请写一个函数，实现以下功能：
字符串"open_door" 转换成 "OpenDoor"、"make_by_id" 转换成 "MakeById"
方法一：
``` php
function str_explode($str){
	$str_arr=explode("_",$str);
	$str_implode=implode(" ", $str_arr);
	$str_implode=implode("", explode(" ",ucwords($str_implode)));
	return $str_implode;
}
echo str_explode('open_door');
```

方法二：
``` php
$str = 'open_door';
$expStr = explode("_", $str);
for($i = 0; $i < count($expStr); $i++)
{
	echo ucwords($expStr[$i]);
}
```

方法三：
``` php
echo str_replace(' ', '', ucwords( str_replace('_', ' ', 'open_door') ) );
```

#### echo count("abc"); 输出什么?
答案：1
说明：count — 计算数组中的单元数目或对象中的属性个数
int count ( mixed$var [, int $mode ] ), 如果 var 不是数组类型或者实现了 Countable 接口的对象，将返回1，有一个例外，如果 var 是 NULL 则结果是 0。

对于对象，如果安装了 SPL，可以通过实现 Countable 接口来调用 count()。该接口只有一个方法 count()，此方法返回 count() 函数的返回值。

#### 有一个一维数组，里面存储整形数据，请写一个函数，将他们按从大到小的顺序排列。要求执行效率高。并说明如何改善执行效率。（该函数必须自己实现，不能使用php函数）
``` php
function BubbleSort(&$arr)
{
	$cnt = count($arr);
	$flag = 1;
	for($i = 0; $i < $cnt; $i++)
	{
		if($flag == 0)
		{
			return;
		}
		$flag = 0;
		for($j = 0;$j < $cnt-$i-1; $j++)
		{
			if($arr[$j] > $arr[$j+1])
			{
				$tmp = $arr[$j];
				$arr[$j] = $arr[$j+1];
				$arr[$j+1] = $tmp;
				$flag = 1;
			}
		}
	}
}
$test=array(1,3,6,8,2,7);
BubbleSort($test);
var_dump($test);
```

#### 请举例说明在你的开发过程中用什么方法来加快页面的加载速度
答：要用到服务器资源时才打开，及时关闭服务器资源，数据库添加索引，页面可生成静态，图片等大文件单独服务器。使用代码优化工具

#### HTTP协议中GET、POST和HEAD的区别?
HEAD： 只请求页面的首部。

GET： 请求指定的页面信息，并返回实体主体。

POST： 请求服务器接受所指定的文档作为对所标识的URI的新的从属实体。

（1）HTTP 定义了与服务器交互的不同方法，最基本的方法是 GET 和 POST。事实上 GET 适用于多数请求，而保留 POST 仅用于更新站点。

（2）在FORM提交的时候，如果不指定Method，则默认为GET请 求，Form中提交的数据将会附加在url之后，以?分开与url分开。字母数字字符原样发送，但空格转换为“+“号，其它符号转换为%XX,其中XX为 该符号以16进制表示的ASCII（或ISO Latin-1）值。GET请求请提交的数据放置在HTTP请求协议头中，而POST提交的数据则放在实体数据中；

GET方式提交的数据最多只能有1024字节，而POST则没有此限制。

（3）GET 这个是浏览器用语向服务器请求最常用的方法。POST这个方法也是用来传送数据的，但是与GET不同的是，使用POST的时候，数据不是附在URI后面传递的，而是要做为独立的行来传递，此时还必须要发送一个Content_length标题，以标明数据长度，随后一个空白行，然后就是实际传送的数据。网页的表单通常是用POST来传送的。

#### Cookie和session的区别，禁止了cookie后session能正常使用吗?session的缺点是什么?session在服务器端是存在哪里的?是共有的还是私有的?
答：
COOKIE保存在客户端，用户通过手段可以进行修改，不安全，单个cookie允许的最大值是3k。

而SESSION保存在服务器端，相对比较安全，大小没有限制。

Session依赖于cookie进行传递。

禁用了cookie之后session不能正常使用。

Session的缺点：保存在服务器端，每次读取都从服务器进行读取，对服务器有资源消耗。

Session保存在服务器端的文件或数据库中，默认保存在文件中，文件路径由php配置文件的session.save_path指定。

Session文件是公有的。

#### 写几个魔术方法并说明作用?
__call()当调用不存在的方法时会自动调用的方法

__autoload()在实例化一个尚未被定义的类是会自动调用次方法来加载类文件

__set()当给未定义的变量赋值时会自动调用的方法

__get()当获取未定义变量的值时会自动调用的方法

__construct()构造方法，实例化类时自动调用的方法

__destroy()销毁对象时自动调用的方法

__unset()当对一个未定义变量调用unset()时自动调用的方法

__isset()当对一个未定义变量调用isset()方法时自动调用的方法

__clone()克隆一个对象

__tostring()当输出一个对象时自动调用的方法

#### 数组中下标最好是什么类型的，为什么?
数组的下标最好是数字类型的，数字类型的处理速度快

#### ++i和i++哪一个效率高，为什么?
++i效率比i++的效率更高，因为++i少了一个返回i的过程。

#### echo()、print()、print_r()的区别?
echo 是php语法，可以输出多个变量，不能输出数组。

Print()是php中的函数，只能输出简单的变量。

Print_r()是php中的函数，可以输出变量也可以输出数组。

#### 框架中什么是单一入口和多入口，单一入口的优缺点?
1、多入口就是通过访问不同的文件来完成用户请求。
单一入口只web程序所有的请求都指向一个脚本文件的。
2、单一入口更容易控制权限，方便对http请求可以进行安全性检查。
缺点：URL看起来不那么美观，特别是对搜索引擎来说不友好。

#### 提示类型200、404、502是什么意思。
200是请求成功，404是文件未找到，502是服务器内部错误。

#### 你对Memcach的理解，优点有哪些?
Memcache是一种缓存技术，在一定的时间内将动态网页经过解析之后保存到文件，下次访问时动态网页就直接调用这个文件，而不必在重新访问数据库。使用memcache做缓存的好处是：提高网站的访问速度，减轻高并发时服务器的压力。

Memcache的优点：稳定、配置简单、多机分布式存储、速度快。

#### 对关系型数据库而言，索引是相当重要的概念，请回答有关索引几个问题:

a) 索引的目的是什么?

b) 索引对数据库系统的负面影响是什么?

c) 为数据表建立索引的原则有哪些?

d) 什么情况下不宜建立索引?

答：
索引的目的：

1、快速访问数据表中的特定信息，提高检索速度

2、创建唯一性索引，保证数据库表中每一行数据的唯一性

3、加速表和表之间的连接

4、使用分组和排序子句进行数据检索时，可以显著减少查询中分组和排序的时间

负面影响：创建索引和维护索引需要耗费时间，这个时间随着数据量的增加而增加；索引需要占用物理空间，不光是表需要占用数据空间，每个索引也需要占用物理空间；当对表进行增、删、改的时候索引也要动态维护，这样就降低了数据的维护速度。

建立索引的原则：

1、在最频繁使用的、用以缩小查询范围的字段上建立索引

2、在平频繁使用的、需要排序的字段上建立索引

什么情况下不宜建立索引：

1、对于查询中很少涉及的列或者重复值比较多的列，不宜建立索引

2、对于一些特殊的数据类型，不宜建立索引，比如文本字段(text)等。

#### web应用中,数据库的读取频率远高于写入频率, 如何优化MySQL而应对此种情景 ?
使用memcache缓存技术，将动态数据缓存到文件，访问动态页面时直接调用缓存文件，而不必重新访问数据库，这样就减少了查询数据库的次数。

如果网站的访问量很大，可以把数据库读写服务器分开，使用多态服务器去处理数据库查询，使用较少的服务器去处理数据库的写入和修改。

#### include与require的区别?
Php在遇到include时就重新解释一次，如果一个页面中出现10次include，php就重新解释10次，而php遇到require时只解释一次，即使页面中出现多次require，php也直解释一次。

使用require包含文件时，被包含的文件当成了当前文件的一个组成部分，如果被包含的文件中有语法错误或者文件不存在，程序就提示错误信息，并结束执行。

使用include包含文件时，相当于指定了文件的路径，被包含的文件中有语法错误或者文件不存在时，页面只是给出警告信息，不响应程序本身的执行。

#### PHP字符串中单引号与双引号的区别?
单引号不能解释变量，而双引号可以解释变量。
单引号不能转义字符，在双引号中可以转义字符。

#### php中,模板引擎的目的是什么? 你用过哪些模板引擎?
使用模板引擎的目的是使程序的逻辑代码和html界面代码分离开，是程序的结构更清晰。
使用过的模板引擎：Smarty、ThinkPHP的ThinkTemplate

#### 指出以下代码片段中的SQL注入漏洞以及解决方法(magic_quotes_gpc = off)
``` php
mysql_query("select id,title from content where catid='{$_GET[catid]}' and title like '%$_GET[keywords]%'", $link);
```
注入漏洞主要存在用户提交的数据上，这里的注入漏洞主要是$_GET[catid]和$_GET[keyword]

解决注入漏洞：
``` php
$_GET[catid]=intval($_GET[catid]);

$sql="select id,title from content where catid='{$_GET[catid]}' and title like '%$_GET[keywords]%";

$sql=addslashes($sql);

mysql_query($sql);
```

#### MyISAM 和 InnoDB 的基本区别?
MYISAM不支持外键和事务处理，采用表锁机制，查询速度稍快，数据存储文件有3个，InnoDB支持外键和事务处理，采用行锁机制，查询速度比MYISAM稍慢，数据存储文件只有一个。

#### 写出匹配URL的正则表达式.
/^http:\/\/www\.([\w]+)\.([\w]+)$/

#### 写一个函数实现字符串翻转
方法一：strrev('abcdef');
方法二：
``` php
function str($a){
	$len = strlen($a);
	$b = "";
	for($i = $len-1; $i >= 0; $i--)
	{
		$b .= $a[$i];
	}
	return $b;
}
echo str('abcdef');
```

#### 不断在文件hello.txt头部写入一行“Hello World”字符串，要求代码完整
``` php
$fp=fopen('hello.txt', 'r');

$str='hello!'."\n";

$str.=fread($fp, filesize('./hello.txt'));

fclose($fp);

$fp1=fopen('hello.txt', 'w');

fwrite($fp1, $str);
```