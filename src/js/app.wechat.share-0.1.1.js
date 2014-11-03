
(function () {
	if (document.addEventListener) {
		document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	} else if (document.attachEvent) {
		document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
		document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	}

	function onBridgeReady() {
		window.shareData = {
			"imgUrl": 'http://' + window.location.hostname + '/doggie/images/' + 'share.jpg',
			//可以是页面的头像，也可以是自己定义的一张图片不变，每个页面可以有这个JS
//			"timeLineLink": window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/index.html",
			"sendFriendLink": window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/index.html",
//			"weiboLink": window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/index.html",
//			//发送朋友圈
//			"tTitle": "参与玛姆香槟F1竞猜，尽享礼遇！",
//			"tContent": "即刻加入我们的竞猜吧！玛姆香槟预祝每位 人生玩家 获得玩家好礼",
			//发送给朋友
			"fTitle": "Delta德雅-Temp2O智能数显技术",
			"fContent": "德雅预祝每位游戏闯关获得玩家好礼"
		};
        var title = "Delta德雅-Temp2O智能数显技术";
        var content = "德雅预祝每位游戏闯关获得玩家好礼";
		// 发送给好友;
		WeixinJSBridge.on('menu:share:appmessage', function (argv) {
			WeixinJSBridge.invoke('sendAppMessage', {
				"img_url" : window.shareData.imgUrl,
				"img_width" : "640",
				"img_height" : "640",
				"link" : window.shareData.sendFriendLink,
				"desc" : window.shareData.fContent,
				"title" : window.shareData.fTitle
			}, function (res) {});
		});
		// 分享到朋友圈;
		WeixinJSBridge.on('menu:share:timeline', function (argv) {
			WeixinJSBridge.invoke('shareTimeline', {
				"img_url" : window.shareData.imgUrl,
				"img_width" : "640",
				"img_height" : "640",
				"link" : window.shareData.sendFriendLink,
				"desc" : window.shareData.fContent,
				"title" : window.shareData.fTitle
			}, function (res) {});
		});

		var nettype_map = {
			"network_type:fail" : "fail",
			"network_type:edge" : "2g",
			"network_type:wwan" : "3g",
			"network_type:wifi" : "wifi"
		};

	};
})();

function isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	};

function addWxContact(wxid) {      
	if (typeof WeixinJSBridge == 'undefined') return false;          
		WeixinJSBridge.invoke('addContact', {              
		webtype: '1',              
		username: 'gh_e5430c6431e7'          
	},  function(d) {             
		 // 返回d.err_msg取值，d还有一个属性是err_desc
            // add_contact:cancel 用户取消
            // add_contact:fail　关注失败
            // add_contact:ok 关注成功
            // add_contact:added 已经关注
            WeixinJSBridge.log(d.err_msg);
            cb && cb(d.err_msg);
			});
};
