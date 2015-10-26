/**
 * 是否在数组中
 * @author wangxin8@letv.com
 * @example var a = 2,b=[3,2,1] alert(inArray(a,b));// true
 */
var ns = require('../nameSpace.js');
var indexOf = require('./indexOf.js');

module.exports = ns.register('pay.inArray', function () {
    return function (ele, o) {
        return indexOf(ele, o) > -1;
    };
});
