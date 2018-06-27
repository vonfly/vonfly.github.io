---
title: 一些PHP方法
date: 2017-02-28 19:43:20
tags: [面试]
categories: PHP
---
主要用于自己学习(●'◡'●)

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

#### 写出匹配URL的正则表达式.
/^http:\/\/www\.([\w]+)\.([\w]+)$/

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