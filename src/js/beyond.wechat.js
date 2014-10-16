/*global $, jQuery, window: true, Beyond*/
// Beyond.Common.namespace("Beyond").WeChat = {};
Beyond.namespace("WeChat");
Beyond.WeChat = {
    isWeiXin: function () {
        "use strict";
        var ua = window.navigator.userAgent.toLowerCase(),
            matches = ua.match(/MicroMessenger/i);
        return (matches !== null && matches.length >= 0 && matches[0] === 'micromessenger');
    }
};