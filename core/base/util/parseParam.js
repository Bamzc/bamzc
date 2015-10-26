/**
 * 类似jQuery.extend(做基础方法，避免引入jQuery)
 * @author wangxin8@letv.com
 * @example
 * var cfg = {
 * 	name: '123',
 *  value: 'aaa'
 * };
 * cfg2 = parseParam(cfg, {name: '456'});
 * //cfg2 == {name:'456',value:'aaa'}
 * //cfg == {name:'123',value:'aaa'}
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.parseParam', function(){
	return function(oSource, oParams, isown){
		var key, obj = {};
		oParams = oParams || {};
		for (key in oSource) {
			obj[key] = oSource[key];
			if (oParams[key] != null) {
				if (isown) {// 仅复制自己
					if (oSource.hasOwnProperty[key]) {
						obj[key] = oParams[key];
					}
				}
				else {
					obj[key] = oParams[key];
				}
			}
		}
		return obj;
	};
});
