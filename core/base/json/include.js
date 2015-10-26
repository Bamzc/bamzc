/**
 * 判断json(N)是json(N+1)的一部分
 * @author wangxin8@letv.com
 * @example
 * var j2 = {'a':1,'b':2,'c':3};
 * var j1 = {'a':1}
 * include(j2,j1) === TRUE;
 */
var ns = require('../nameSpace.js');

module.exports = ns.register('pay.include', function () {
    return function (json2, json1) {
        for (var k in json1) {
            if (typeof json1[k] === 'object') {
                if (json1[k] instanceof Array) {
                    if (json2[k] instanceof Array) {
                        if (json1[k].length === json2[k].length) {
                            for (var i = 0, len = json1[k].length; i < len; i += 1) {
                                if (!arguments.callee(json1[k][i], json2[k][i])) {
                                    return false;
                                }
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    if (typeof json2[k] === 'object') {
                        if (!arguments.callee(json1[k], json2[k])) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            } else if (typeof json1[k] === 'number' || typeof json1[k] === 'string') {
                if (json1[k] !== json2[k]) {
                    return false;
                }
            } else if (json1[k] !== void 0 && json1[k] !== null) {
                if (json2[k] !== void 0 && json2[k] !== null) {
                    if (!json1[k].toString || !json2[k].toString) {
                        throw 'json1[k] or json2[k] do not have toString method';
                    }
                    if (json1[k].toString() !== json2[k].toString()) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    };
});
