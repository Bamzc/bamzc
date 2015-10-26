/*
 * author wangxin
 * 不同颜色表示不同的提示文案
 */
'use strict';
var colors = require('colors');

module.exports = {
    log: function (msg) {
        //grey
        console.log(msg.grey);
    },
    ok: function (msg) {
        //green
        console.log(msg.green);
    },
    warn: function (msg) {
        //yellow
        console.log(msg.yellow);
    },
    error: function (msg) {
        //red
        console.log(msg.red);
    }
};

