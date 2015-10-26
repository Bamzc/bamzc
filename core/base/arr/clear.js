/*
 * @author wangxin8@letv.com
 * 获取对象类型 clear([undefined,'',null,1]) === [1];
 */
var ns = require('../nameSpace.js');
var findout = require('./findout.js');
var isArray = require('./isArray.js');

module.exports = ns.register('pay.clear', function () {
    return function (o) {
        if (!isArray(o)) {
            throw 'the clear function needs an array as first parameter';
        }
        var result = [];
        for (var i = 0, len = o.length; i < len; i += 1) {
            if (!(findout([void 0, null, ''], o[i]).length)) {
                result.push(o[i]);
            }
        }
        return result;
    };
});
