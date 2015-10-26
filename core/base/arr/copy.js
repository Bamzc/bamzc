/**
 * 复制一个数组
 * author wangxin8@letv.com
 * @example
 * var li1 = [1,2,3]
 * var li2 = copy(li1);
 * li2 === [1,2,3];
 * li2 !== li1;
 */
var ns = require('../nameSpace.js');
var isArray = require('./isArray.js');

module.exports = ns.register('pay.copy', function($){
	return function(o){
		if (!isArray(o)) {
			throw 'the copy function needs an array as first parameter';
		}
		return o.slice(0);
	};
});
