/*
 * 解析URL
 * @author wangxin8@letv.com
 * @example console.log(parseURL('http://t.sina.com.cn/profile?test=test'));
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.parseURL', function () {
    return function (url) {
        var parse_url = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
        var results = parse_url.exec(url);
        var that = {};
        for (var i = 0, len = names.length; i < len; i += 1) {
            that[names[i]] = results[i] || '';
        }
        return that;
    }
});
