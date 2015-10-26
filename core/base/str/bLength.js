/**
 * 获取字节长度(中文算2)
 * @author wangxin8@letv.com
 * @example bLength('乐视letv') === 8;
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.bLength', function () {
    return function (str) {
        if (!str) {
            return 0;
        }
        var aMatch = str.match(/[^\x00-\xff]/g);
        return (str.length + (!aMatch ? 0 : aMatch.length));
    };
});
