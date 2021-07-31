#!/bin/bash
port="22"
password="hadoop_super_1"

ip="root@120.27.244.31"
fileDir="/data/webapps/ucap-user-ui"

function check_result(){
  if [ "$1" != "0" ]
  then
    echo "打包出错了，请检查！";
    exit 2;
  fi
}

# 判断package.json文件有无改变 ----> 判断文件是否存在
if [ -f "package.md5" ] ; then
  #判断package.json文件有无改变，如果改变了需要执行npm install重新安装
  md5_new=`md5sum package.json`
  old=`cat package.md5`
  # echo `md5sum -c --status package.md5`
  # echo $?
  if [ "$old" != "$md5_new" ];
    then
      echo "package.json文件有更新，开始执行npm install"
      echo "输出新的package.md5文件替换老版本: "
      md5sum package.json > package.md5
      echo "重新执行npm install"
      # npm install
  fi
else
  echo "创建package.md5"
  md5sum package.json > package.md5
fi

echo '打包中......'
npm run build;
check_result $?;

ssh -p 22 $ip -P hadoop_super_1 << eeooff

# 判断文件夹是否存在 -d
if [[ ! -d "$fileDir" ]]; then
  echo "文件夹不存在, 创建目录$fileDir"
  mkdir -p $fileDir
fi

echo "清空$fileDir文件夹所有文件"
rm -rf $fileDir/*

exit
eeooff

echo "输入密码后，将拷贝本地dist/* 到 远端服务器$fileDir"
scp -P 22 -r ./dist/* $ip:$fileDir/
echo "拷贝-发布完成！！！"
exit 0
