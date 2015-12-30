/**
 * Created by bamzc on 2015/12/16.
 * 文件的输出处理，包括rjs、js、css,sass文件
 */
 'use strict';
var PATH = require('path');
var fs = require('fs');
var mkdir = require('./mkdir.js');

module.exports = function(basePath,config,minText,type){
 	var printOut;
 	//如果有banner，替换banner
	if (config[type].options && config[type].options.banner) {
        printOut = config[type].options.banner.replace(/<%time%>/gi, new Date()) + minText;
    } else {
        printOut = minText;
    }

    var outputpath = PATH.normalize((config[type].options && config[type].options.dest) || './' + type + '/');
    var fileName = PATH.basename(basePath).replace(/\.bsp/, '');
    if (config[type].options.type === 'normal') {
        mkdir.sync(outputpath);
        fs.writeFileSync(outputpath + fileName, printOut);
    } else if (config[type].options.type === 'deep') {
        var p = PATH.relative(outputpath, basePath).replace(/(\.+[\/\\])*/gi, '');
        var route = PATH.dirname(outputpath + p) + PATH.sep;
        mkdir.sync(route);
        fs.writeFileSync(route + fileName, printOut);
    }
 }