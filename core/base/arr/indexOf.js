/**
 * 返回在数组中的索引
 * @author wangxin8@letv.com
 * @example var a = 2, b=[3,2,1]; alert(indexOf(a,b));// 1
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.indexOf', function(){
	return function(ele, o){
		if (o.indexOf) {
			return o.indexOf(ele);
		}
		for (var i = 0, len = o.length; i < len; i++) {
			if (o[i] === ele) {
				return i;
			}
		}
		return -1;
	};
});
