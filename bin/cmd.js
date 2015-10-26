#!/usr/bin/env node

'use strict';
var fs = require('fs');
var PATH = require('path');
var browserifyPlus = require('../index');
var trace = require('../lib/trace');

function forEach(handle) {
    var arr = this, len = arr.length;
    for (var i = 0; i < len; i++) {
        if (handle(arr[i], i) === false) break;
    }
}

function getFilePath(filePath, file, that) {
    forEach.call(fs.readdirSync(filePath), function (fileName) {
        var baseDir = filePath + fileName;
        try {
            var lstat = fs.lstatSync(baseDir);
        } catch (e) {
            trace.error('file parsing error, replace the execution path.');
            process.exit(1);
            return false;
        }
        if (lstat.isDirectory()) {
            if (PATH.basename(baseDir).replace(/\..+$/, '') == '')return;
            getFilePath(baseDir + PATH.sep, file, that);
        } else if (lstat.isFile() && fileName === file) {
            that.path = baseDir;
            return false;
        }
    });
    return that;
}

function relativePath(basePath, outPath) {
    var symbol = PATH.sep, dirArr = outPath.split(symbol), $p;
    switch (dirArr[0]) {
        case '.':
            $p = PATH.join(basePath, outPath);
            break;
        case '' :
            $p = outPath;
            break;
        case '..':
            var baseArr = basePath.split(symbol);
            forEach.call(dirArr, function (dir, i) {
                if (dir === '..') {
                    baseArr.pop();
                } else {
                    $p = PATH.join(baseArr.join(symbol), dirArr.slice(i).join(symbol));
                    return false;
                }
            });
            break;
        default :
            $p = PATH.join(basePath, outPath);
    }
    return $p;
}

var args = process.argv[2] ? process.argv[2].replace(/^\-/, '') : '';

if (/(v|version)/i.test(args)) {
    return trace.log(require('../package.json').version);
}

if (args && !/.+\.bsp\.js$/.test(args)) {
    return trace.warn('configuration file named *.bsp.js');
}

var fileMap = args ? {path: relativePath(process.cwd(), args)} : getFilePath(process.cwd() + PATH.sep, 'config.bsp.js', {});


if (fileMap && fileMap.path) {
    try {
        var config = require(fileMap.path), dirName = PATH.dirname(fileMap.path);
    } catch (e) {
        trace.error('configuration file parsing error');
        process.exit(1);
    }

    config.inputPath = relativePath(dirName, config.inputPath);
    config.output.path = relativePath(dirName, config.output.path);
    config.libraryPath = relativePath(dirName, config.libraryPath);

    browserifyPlus(config);
} else {
    return trace.error('no configuration file, please edit it');
}
