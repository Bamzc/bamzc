/*
 * 配置URL路径
 * @author wangxin8@letv.com
 * @example
 * console.log(URL('http://abc.com/a/b/c.php?a=1&b=2#a=1').setParam('a', 'abc').setHash('a', 67889).setHash('a1', 444444).valueOf())
 */
var ns = require('../nameSpace.js');
var parseParam = require("./parseParam.js");
var parseURL = require('../str/parseURL.js');
var queryToJson = require('../json/queryToJson.js');
var jsonToQuery = require('../json/jsonToQuery.js');

module.exports = ns.register('pay.URL', function(){
	return function(sURL,args){
		var opts = parseParam({
			'isEncodeQuery'	 : false,
			'isEncodeHash'	 : false
		},args||{});
		var that = {};
		var url_json = parseURL(sURL);


		var query_json = queryToJson(url_json.query);

		var hash_json = queryToJson(url_json.hash);



		that.setParam = function(sKey, sValue){
			query_json[sKey] = sValue;
			return this;
		};
		that.getParam = function(sKey){
			return query_json[sKey];
		};
		that.setParams = function(oJson){
			for (var key in oJson) {
				that.setParam(key, oJson[key]);
			}
			return this;
		};
		that.setHash = function(sKey, sValue){
			hash_json[sKey] = sValue;
			return this;
		};
		that.getHash = function(sKey){
			return hash_json[sKey];
		};
		that.valueOf = that.toString = function(){
			var url = [];
			var query = jsonToQuery(query_json, opts.isEncodeQuery);
			var hash = jsonToQuery(hash_json, opts.isEncodeQuery);
			if (url_json.scheme != '') {
				url.push(url_json.scheme + ':');
				url.push(url_json.slash);
			}
			if (url_json.host != '') {
				url.push(url_json.host);
				if(url_json.port != ''){
					url.push(':');
					url.push(url_json.port);
				}
			}
			url.push('/');
			url.push(url_json.path);
			if (query != '') {
				url.push('?' + query);
			}
			if (hash != '') {
				url.push('#' + hash);
			}
			return url.join('');
		};

		return that;
	};
});
