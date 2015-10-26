/**
 * Created by wangxin8 on 2015/10/8.
 */
'use strict';

var fs = require('fs');
var PATH = require('path');

var iconv = require('iconv-lite');
var UglifyJS = require('uglify-js');

var mkdir = require('./mkdir.js');
var trace = require('./trace.js');

function outputHandleScss(code, basePath, charset, config) {

    var content = iconv.decode(code, charset);
    if (config.outputScss && config.outputScss.banner) {
        var printOut = config.outputScss.banner.replace(/<%time%>/gi, new Date()) + content;
    } else {
        var printOut = content;
    }

    //获取到文件内容后就删除过度文件
    fs.unlinkSync(basePath);

    //开始文件输出
    //处理path路径的操作系统兼容性
    var path = PATH.normalize((config.outputScss && config.outputScss.path) || './scss/');
    var outputPath = /^.+[\/\\]$/.test(path) ? path : path + PATH.sep;

    var fileName = PATH.basename(basePath, '.bsp.scss') + '.css';
    if (config.output.type === 'normal') {
        mkdir.sync(path);
        fs.writeFileSync(outputPath + fileName, printOut);
    } else if (config.output.type === 'deep') {
        var p = PATH.relative(outputPath, basePath).replace(/(\.+[\/\\])*/gi, '');
        var route = PATH.dirname(outputPath + p) + PATH.sep;
        mkdir.sync(route);
        fs.writeFileSync(route + fileName, printOut);
    }
}
module.exports = outputHandleScss;