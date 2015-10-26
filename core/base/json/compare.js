/**
 * 比较两个对象是否一样，返回boolean
 * @author wangxin8@letv.com
 * @example
 * var j1 = {'a':1,'b':2,'c':3};
 * var j2 = {'a':1,'b':2,'c':3};
 * compare(j1,j2) === TRUE;
 */
var ns = require('../nameSpace.js');
var include = require('./include.js');

module.exports = ns.register('pay.compare',function(){
	return function(json1,json2){
		if(include(json1,json2) && include(json2,json1)){
			return true;
		}else{
			return false;
		}
	};
});
