/**
 * @author wangxin8@letv.com
 * 判断是否是数组类型 isArray([1,2,3]) === true;
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.isArray', function(){
	return function(o){
		return Object.prototype.toString.call(o) === '[object Array]';
	};
});
