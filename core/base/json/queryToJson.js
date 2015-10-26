/*
 * author wangxin8@letv.com
 * queryToJson('a=1&b=2&c=3') === {'a':1,'b':2,'c':3};
 */
var ns = require('../nameSpace.js');
var isArray = require('../arr/isArray.js');

module.exports = ns.register('pay.queryToJson', function () {

    var _fData = function (data, isDecode) {
        data = data == null ? '' : data;
        data = data.toString();
        if (isDecode) {
            return decodeURIComponent(data);
        } else {
            return data;
        }
    };

    return function (QS, isDecode) {

        var _Qlist = QS.split("&");
        var _json = {};

        for (var i = 0, len = _Qlist.length; i < len; i++) {
            if (_Qlist[i]) {
                var _hsh = _Qlist[i].split("=");
                var _key = _hsh[0];
                var _value = _hsh[1];

                // 如果只有key没有value, 那么将全部丢入一个$nullName数组中
                if (_hsh.length < 2) {
                    _value = _key;
                    _key = '$nullName';
                }
                // 如果缓存堆栈中没有这个数据
                if (!_json[_key]) {
                    _json[_key] = _fData(_value, isDecode);
                }
                // 如果堆栈中已经存在这个数据，则转换成数组存储
                else {
                    if (isArray(_json[_key]) != true) {
                        _json[_key] = [_json[_key]];
                    }
                    _json[_key].push(_fData(_value, isDecode));
                }
            }
        }
        return _json;
    };
});
