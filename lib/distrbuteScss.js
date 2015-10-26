/**
 * Created by wangxin on 15/10/3.
 */

'use strict';
var fs = require('fs');
var PATH = require('path');

var trace = require('./trace.js');

module.exports = function (opt) {

    var input = opt.inputPath || '';

    if (/^.+\/$/.test(input)) {
        var inputPath = input;
    } else {
        var inputPath = input + '/';
    }

    //fileNameCache:排重的缓存数组
    var that = {}, fileNameCache = {};

    var fileManipulation = function (fileName, baseDir) {
        if (fileNameCache[fileName] && opt.output.type === 'normal') {
            trace.warn('holy shit , duplicate file name : \n' + fileNameCache[fileName] + '\n' + baseDir);
        }
        fileNameCache[fileName] = baseDir;
        that[PATH.dirname(baseDir) + '/' + PATH.basename(fileName, '.scss') + '.bsp.scss'] = baseDir;
    };

    function walk(fileDir) {
        var files = fs.readdirSync(fileDir);
        files.forEach(function (fileName) {
            var baseDir = fileDir + fileName, lstat = fs.lstatSync(baseDir);
            if (lstat.isDirectory()) {
                if (fileName === 'scss') {
                    var files = fs.readdirSync(baseDir);
                    files.forEach(function (fileName) {
                        //对scss文件的处理
                        if (/^.+\.scss$/.test(fileName)) {
                            fileManipulation(fileName, baseDir + '/' + fileName);
                        }
                    });
                } else {
                    walk(baseDir + '/');
                }
            } else if (lstat.isFile()) {
                //对scss文件的处理
                if (/^.\.scss$/.test(fileName)) {
                    fileManipulation(fileName, baseDir);
                }
            }
        });
    };

    walk(inputPath);

    return that;
};