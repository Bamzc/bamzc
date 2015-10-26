/**
 * Created by wangxin on 15/10/3.
 */

'use strict';
var browserifyPlus = require('./lib/main.js');

function extendDeep(parent) {
    var i,
        toStr = Object.prototype.toString,
        astr = "[object Array]",
        child = arguments[1] || {};
    for (i in parent) {
        if (parent.hasOwnProperty(i)) {
            if (typeof parent[i] === "object") {
                child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                extendDeep(parent[i],child[i]);
            } else {
                child[i] = parent[i];
            }
        }
    }
    return child;
};

module.exports = function () {

    var config = extendDeep(arguments[0],{
        //需要编译的文件夹
        inputPath: '',
        output: {
            //输出文件路径
            path: '',
            //输出方式: normal、deep
            type: '',
            //是否压缩
            compress: true
        },
        //引用的库文件路径
        libraryPath: './core/'
    });

    browserifyPlus(config);
};