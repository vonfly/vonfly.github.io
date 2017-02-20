---
title: git-commands
date: 2016-06-18 20:08:16
tags: [命令使用, git]
categories: 命令
---

---
常用的一些git命令以及平时项目遇到的一些问题解决方法
<!-- more -->

### git一些命令

在当前目录新建一个Git代码库
``` bash
$ git init
```

新建一个目录，将其初始化为Git代码库

``` bash
$ git init [project-name]
```

下载一个项目和它的整个代码历史

``` bash
$ git clone [url]
```

#### 增加/删除文件

添加指定文件到暂存区
``` bash
$ git add [file1] [file2] ...
```

添加指定目录到暂存区，包括子目录
``` bash
$ git add [dir]
```

将所有修改过的工作文件提交暂存区
``` bash
$ add .
```

添加每个变化前，都会要求确认，
对于同一个文件的多处变化，可以实现分次提交
``` bash
$ git add -p
```

删除暂存区文件
``` bash
$ git rm file.name
```

(工作区和暂存区都存在的情况下)删除工作区文件，同时删除暂存区文件
``` bash
$ git rm -f file.name
```
(工作区和暂存区都存在的情况下)不删除工作区文件，删除暂存区文件
``` bash
$ git rm --cached file.name
```
改名文件，并且将这个改名放入暂存区
``` bash
$ git mv [file-original] [file-renamed]
```


#### 代码提交

提交暂存区到仓库区（提交说明要用英文引号）
``` bash
$ git commit -m [提交说明]
```

提交暂存区到仓库区
``` bash
$ git commit [file1] [file2] ... -m [提交说明]
```


#### 分支

列出所有本地分支
``` bash
$ git branch
```

列出所有远程分支
``` bash
$ git branch -r
```

列出所有本地分支和远程分支
``` bash
$ git branch -a
```

新建一个分支，但依然停留在当前分支
``` bash
$ git branch [branch-name]
```

新建一个分支，并切换到该分支
``` bash
$ git checkout -b [branch]
```

新建一个分支，指向指定commit
``` bash
$ git branch [branch] [commit]
```

新建一个分支，与指定的远程分支建立追踪关系
``` bash
$ git branch --track [branch] [remote-branch]
```

切换到指定分支，并更新工作区
``` bash
$ git checkout [branch-name]
```

切换到上一个分支
``` bash
$ git checkout -
```

建立追踪关系，在现有分支与指定的远程分支之间
``` bash
$ git branch --set-upstream [branch] [remote-branch]
```

合并指定分支到当前分支
``` bash
$ git merge [branch]
```

选择一个commit，合并进当前分支
``` bash
$ git cherry-pick [commit]
```

删除分支
``` bash
$ git branch -d [branch-name]
```

删除远程分支
``` bash
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```


#### 查看信息

显示有变更的文件
``` bash
$ git status
```

显示当前分支的版本历史
``` bash
$ git log
```

显示之后版本历史
``` bash
$ git reflog
```

显示commit历史，以及每次commit发生变更的文件
``` bash
$ git log --stat
```

搜索提交历史，根据关键词
``` bash
$ git log -S [keyword]
```

显示某个文件的版本历史，包括文件改名
``` bash
$ git log --follow [file]
$ git whatchanged [file]
```

显示指定文件相关的每一次diff
``` bash
$ git log -p [file]
```

显示过去5次提交
``` bash
$ git log -5 --pretty --oneline
```

显示指定文件是什么人在什么时间修改过
``` bash
$ git blame [file]
```

显示暂存区和工作区的差异
``` bash
$ git diff
```

显示暂存区和上一个commit的差异
``` bash
$ git diff --cached [file]
```

显示工作区与当前分支最新commit之间的差异
``` bash
$ git diff HEAD
```

显示两次提交之间的差异
``` bash
$ git diff [first-branch]...[second-branch]
```


#### 远程同步

下载远程仓库的所有变动
``` bash
$ git fetch [remote]
```

显示所有远程仓库
``` bash
$ git remote -v
```

显示某个远程仓库的信息
``` bash
$ git remote show [remote]
```

增加一个新的远程仓库，并命名
``` bash
$ git remote add [shortname] [url]
```

取回远程仓库的变化，并与本地分支合并
``` bash
$ git pull [remote] [branch]
```

上传本地指定分支到远程仓库
``` bash
$ git push [remote] [branch]
```

推送所有分支到远程仓库
``` bash
$ git push [remote] --all
```

#### 撤销

恢复暂存区的指定文件到工作区
``` bash
$ git checkout [file]
```

恢复某个commit的指定文件到暂存区和工作区
``` bash
$ git checkout [commit] [file]
```

恢复暂存区的所有文件到工作区
``` bash
$ git checkout .
```

##### 整个版本的撤销

重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
``` bash
$ git reset [file]
```

重置暂存区与工作区，与上一次commit保持一致
``` bash
$ git reset --hard [commit]
```


#### 显示当前的Git配置

``` bash
$ git config --list
```

编辑Git配置文件
``` bash
$ git config -e [--global]
```

设置提交代码时的用户信息
``` bash
$ git config [--global] user.name "your username"
$ git config [--global] user.email "your e-mail"
```

### 扩展

#### 多人协作解决冲突
推荐方法1：
``` bash
$ git fetch
$ git diff master origin/master
$ git merge orgin/master
```
方法2：
``` bash
$ git pull
```


参考：
[阮一峰-常用 Git 命令清单](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)