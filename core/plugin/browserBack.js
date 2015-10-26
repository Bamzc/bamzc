/**
 * 浏览器返回后原页面刷新
 * @author wangxin8@letv.com
 * @example:
 * var browserBackHandle = require('../core/plugin/browserBack.js');
 * 页面将要跳转前:$(window).triggerHandler('browserBackHandle');
 * 进入页面时:browserBackHandle();
 */
var ns = require('../base/nameSpace.js');
var $ = require('../base/jquery-1.7.1.js');
var parseURL = require('../base/str/parseURL.js');
var queryToJson = require('../base/json/queryToJson.js');

module.exports = ns.register('pay.browserBack', function () {

    var state = 'browserBackHandle=1';
    var urlInfo = parseURL(window.location.href);
    $(window).unbind('browserBackHandle');

    //记录跳转状态
    $(window).bind('browserBackHandle', function () {
        if (history && history.replaceState) {
            var key = urlInfo.query ? '&' : '?';
            history.replaceState({}, '', urlInfo.url + key + state);
        } else {
            window.name = state;
        }
    });

    //检测状态，并刷新页面
    return function () {
        if (history && history.replaceState) {
            var data = queryToJson(urlInfo.query.replace('?', ''), true);
            if (data && data.browserBackHandle == 1) {
                history.replaceState({}, '', urlInfo.url.replace(new RegExp('[?&]' + state), ''));
                window.location.reload();
            }
        } else {
            if (window.name) {
                var data = queryToJson(window.name, true);
                if (data && data.browserBackHandle == 1) {
                    window.name = void 0;
                    window.location.reload();
                }
            }
        }
    };
});
