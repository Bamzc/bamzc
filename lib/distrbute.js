/**
 * Created by bamzc on 15/12/11.
 * return object: {js:{path:path,......},rjs:{},css:{},image:{}}
 * 目的就是排除重复命名的文件
 */

'use strict';
var fs = require('fs');
var PATH = require('path');

var trace = require('./trace.js');

module.exports = function (opt) {

    //fileNameCache:排重的缓存数组
    var that = {}, fileNameCache = {};

    /*
     * 对象赋值操作
     * 出现重复的文件名，给出提示
     */
    var fileManipulation = function (fileName, baseDir, type) {
        var r = type == 'rjs' ? 'js' : type;
        if (!that[type]) that[type] = {};
        if (!fileNameCache[r]) fileNameCache[r] = {};
        if (fileNameCache[r][fileName] && opt[type] && opt[type].options.type === 'normal') {
            //trace.warn('holy shit , duplicate file name : \n' + fileNameCache[r][fileName] + '\n' + baseDir);
        }
        fileNameCache[r][fileName] = baseDir;
        that[type][PATH.resolve(baseDir)] = baseDir;
    };
    /*
     * 将当前路径下所有文件,
     * 要处理的文件,交给fileManipulation方法
     */
    function walk(fileDir,files){
        files.forEach(function(fileName){
            var baseDir = fileDir + fileName, lstat = fs.lstatSync(baseDir);
            if(lstat.isDirectory()){
                if(fileName === "rjs"){
                    var rjsFiles = fs.readdirSync(baseDir);
                    rjsFiles.forEach(function(rjsFileName){
                        if(/^.+\.js$/.test(rjsFileName)) opt.rjs && fileManipulation(rjsFileName,baseDir+'/'+rjsFileName,"rjs");
                    });
                }else{
                    readdirFiles(baseDir + '/');
                }
            }else if(lstat.isFile()){
                if (/^.+_rjs\.js$/.test(fileName)) {
                    opt.rjs && fileManipulation(fileName,baseDir,"rjs")
                } else if (/^.+\.js$/.test(fileName)) {
                    opt.js && !(/^.+_rjs\.js$/.test(fileName)) && fileManipulation(fileName,baseDir,"js")
                } else if (/^.+\.css$/.test(fileName)) {
                    opt.css && fileManipulation(fileName,baseDir,"css")
                } else if (/^.+\.scss$/.test(fileName)) {
                    opt.css && fileManipulation(fileName,baseDir,"sass")
                } else if (opt.image && opt.image.patterns.indexOf(PATH.extname(fileName)) != -1) {
                    fileManipulation(fileName, baseDir, 'image');
                }
            }
        });
    }
    /*
     * 遍历当前路径下所有文件
     */
    function readdirFiles(fileDir) {
        var files = fs.readdirSync(fileDir);
        walk(fileDir,files)
    };
    readdirFiles(opt.inputPath+'/');
    return that;
};