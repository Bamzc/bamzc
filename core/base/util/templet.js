/**
 * 模板引擎
 * @author wangxin8@letv.com
 * @example
 * templet('#{city}欢迎你',{'city':'北京'}) === '北京欢迎你';
 * templet('#{city||default:天津}欢迎你',{'city':'北京'}) === '北京欢迎你';
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.templet', function($){
	return function(template, data){
		return template.replace(/#\{(.+?)\}/ig, function(){
			var key = arguments[1].replace(/\s/ig, '');
			var ret = arguments[0];
			var list = key.split('||');
			for (var i = 0, len = list.length; i < len; i += 1) {
				if (/^default:.*$/.test(list[i])) {
					ret = list[i].replace(/^default:/, '');
					break;
				}
				else
					if (data[list[i]] !== undefined) {
						ret = data[list[i]];
						break;
					}
			}
			return ret;
		});
	};
});
