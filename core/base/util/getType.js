/*
 * author wangxin8@letv.com
 * 获取对象类型 getType(function(){}) === 'function';
 */

var ns = require('../nameSpace.js');

module.exports = ns.register('pay.getType', function () {
    var _t;
    return function (o) {
        return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
    };
});
