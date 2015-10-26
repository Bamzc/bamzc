/**
 * 去掉数组内重复元素
 * @author wangxin8@letv.com
 * @example
 * var li1 = ['a','b','c','a']
 * var li2 = unique(li1);
 * li2 === ['a','b','c']
 */
var ns = require('../nameSpace.js');
var isArray = require('./isArray.js');
var indexOf = require('./indexOf.js');

module.exports = ns.register('pay.hasby', function($) {
	return function(o) {
		if (!isArray(o)) {
			throw 'the unique function needs an array as first parameter';
		}
		var result = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (indexOf(o[i], result) === -1) {
				result.push(o[i]);
			}
		}
		return result;
	};
});
