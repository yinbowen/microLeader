define(function(require, exports, module) {
	var uid = "M151851790";  //登录领队的ID
	var gtype = "1001"; //群组类型
	var View = require("mods/View/chat.view.js");
	View.initPersonalInfo(uid);
	View.initDialogList(uid, gtype);
	View.bindEvent();
	View.pullNewMsg(uid);
});