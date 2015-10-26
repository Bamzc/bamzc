/*
 * @author wangxin8@letv.com
 * 获取对象类型 findout([1,2,3],2) === [2];
 */
var ns = require('../nameSpace.js');
var isArray = require('./isArray.js');

module.exports = ns.register('pay.findout', function () {
    return function (o, value) {
        if (!isArray(o)) {
            throw 'the findout function needs an array as first parameter';
        }
        var k = [];
        for (var i = 0, len = o.length; i < len; i += 1) {
            if (o[i] === value) {
                k.push(i);
            }
        }
        return k;
    };
});
