/**
 * 全角字转半角字
 * @author wangxin8@letv.com
 * @example dbcToSbc('ＳＡＡＳＤＦＳＡＤＦ') === 'SAASDFSADF';
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.dbcToSbc', function ($) {
    return function (str) {
        return str.replace(/[\uff01-\uff5e]/g, function (a) {
            return String.fromCharCode(a.charCodeAt(0) - 65248);
        }).replace(/\u3000/g, " ");
    };
});
