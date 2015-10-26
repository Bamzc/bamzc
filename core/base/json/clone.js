/**
 * JSON克隆
 * @author wangxin8@letv.com
 * @example clone({a:2,b:4}) = {a:2,b:4};
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.clone', function () {
    return function (json) {
        var buf;
        if (json instanceof Array) {
            buf = [];
            var i = json.length;
            while (i--) {
                buf[i] = arguments.callee(json[i]);
            }
            return buf;
        } else if (json instanceof Object) {
            buf = {};
            for (var k in json) {
                buf[k] = arguments.callee(json[k]);
            }
            return buf;
        } else {
            return json;
        }
    }
});
