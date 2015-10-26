/*
 * author wangxin8@letv.com
 * 申请letv.bossPlatform的命名空间
 */

(function (window, undefined) {

    if (window.letv === undefined) {
        window.letv = {};
    }else{
        window.letv = new Object(letv);
    }

    letv.bossPlatform = {

        version: '20150818',

        register: function (ns, maker) {
            var NSList = ns.split('.'), step = this, k = null;
            while (k = NSList.shift()) {
                if (NSList.length) {
                    if (step[k] === void 0) {
                        step[k] = {};
                    }
                    step = step[k];
                } else {
                    if (step[k] === void 0) {
                        step[k] = maker(this);
                        return step[k];
                    }
                }
            }
        }
    };

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = letv.bossPlatform;
    }

})(window);
