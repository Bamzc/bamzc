#!/usr/bin/env node

'use strict';
var fs = require('fs');
var PATH = require('path');
var bamzc = require('../index');
var trace = require('../lib/trace');
var util = require("../lib/util");
var help = require("../lib/help");
/**
 * 获取bamzcfile.js 文件路径
 * return object : {path : .../bamzcfile.js}
 */
function getFilePath(filePath, file, that){
    /**
     *1.fs.readdirSync()
     *  方法将返回一个包含“指定目录下所有文件名称”的数组对象
     *2.fs.lstatSync()
     *  方法返回一个stat数组对象
     *3.isDirectory()
     *  是否是文件夹，true为文件夹
     ***/
    util.forEach.call(fs.readdirSync(filePath), function(fileName,i){
        var baseDir = filePath + fileName;
        try {
            var lstat = fs.lstatSync(baseDir);
        } catch (e) {
            trace.error('Skip a file parsing error.');
            return;
        }
        if (lstat.isDirectory()){
            if(PATH.basename(baseDir).replace(/\..+$/, '') == '') return;
            getFilePath(baseDir + PATH.sep, file ,that)
        } else if (lstat.isFile() && fileName === file) {//fileName --> bamzcfile.js
            that.path = baseDir;
            return false;
        }
    });
    return that;
}
function getOtherInfo(){
    if(/(h|help)/i.test(args)){
        help.content();
    }
    process.exit(0);
}
var args = process.argv[2] ? process.argv[2].replace(/^\-/, '') : '';

//获取包程序版本号
if(/(v|version)/i.test(args)){
    return trace.log(require('../package.json').version);
}
/**
 * fileMap -->> object: {path:.../config.bsp.js}
 * PATH.sep -->> '/'
 * PATH.dirname -->> path.dirname('/foo/bar/a.js') -->> return /foo/bar
 * process.cwd() -->> 当前目录路径
 */
var fileMap = args ? getOtherInfo() : getFilePath(process.cwd() + PATH.sep, 'bamzcfile.js',{}); 

if (fileMap && fileMap.path) {
    try {
        var config = require(fileMap.path), dirName = PATH.dirname(fileMap.path);
    } catch (e) {
        trace.error('bamzcfile file parsing error');
        process.exit(1);
    }
    bamzc(util.analyticPath(config,dirName));
}else{
    return trace.error('no bamzcfile file , please edit it')
}