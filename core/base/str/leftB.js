/**
 * 从左到右取字符串，中文算两个字符.
 * @author wangxin8@letv.com
 * @example leftB( '世界真和谐'， 6 ) === '世界真';
 */
var ns = require('../nameSpace.js');
var bLength = require('./bLength.js');

module.exports = ns.register('pay.leftB', function ($) {
    return function (str, lens) {
        var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
        str = str.slice(0, s.slice(0, lens).replace(/\*\*/g, ' ').replace(/\*/g, '').length);
        if (bLength(str) > lens && lens > 0) {
            str = str.slice(0, str.length - 1);
        }
        return str;
    };
});
