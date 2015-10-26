/**
 * 通过定义的规则找到数组中指定的元素
 * @author wangxin8@letv.com
 * @example
 * var li1 = ['a','b','c','ab']
 * var li2 = hasby(li1,function(v,i){return (v.indexOf('a') !== -1)});
 * li2 === [0,3]
 */
var ns = require('../nameSpace.js');
var isArray = require('./isArray.js');

module.exports = ns.register('pay.hasby', function(){
	return function(o, insp){
		if (!isArray(o)) {
			throw 'the hasBy function needs an array as first parameter';
		}
		var k = [];
		for (var i = 0, len = o.length; i < len; i += 1) {
			if (insp(o[i], i)) {
				k.push(i);
			}
		}
		return k;
	};
});
