/**
 * @fileoverview 数据模型层，根据请求返回数据
 * @author bwyin@ctrip.com
 */
define(function(require, exports, module){
	var Model = {
		url: "http://im.uat.qa.nt.ctripcorp.com"
	};
	var $ = require("../Plugins/jquery.sea.js");

	//获取携程用户的个人信息，头像昵称标签等
	Model.getPersonalInfo = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback) {
			$.ajax({
				type: "POST",
				url: this.url,
				data: this.para,
				dataType: "json",
				//processData: false,
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	};

	//获取用户添加的群列表
	Model.getGroupList = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback){
			$.ajax({
				url: this.url,
				//data: this.para,
				dataType: "json",
				// timeout: 10000,
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {
				},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	};

	//获取群成员信息
	Model.getGroupMember = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback) {
			$.ajax({
				url: this.url,
				//data: this.para,
				dataType: "json",
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	};

	//获取新消息
	Model.getNewMsg = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback) {
			$.ajax({
				url: this.url,
				//data: this.para,
				dataType: "json",
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	},

	//发送新消息
	Model.sendNewMsg = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback) {
			$.ajax({
				url: this.url,
				method: "POST",
				//data: this.para,
				dataType: "json",
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	},

	//删除群成员
	Model.deleteGroupMember = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback) {
			$.ajax({
				url: this.url,
				type: "POST",
				data: JSON.stringify(this.para),
				dataType: "json",
				contentType: "application/json",
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	}

	//添加群成员
	Model.addGroupMember = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback) {
			$.ajax({
				url: this.url,
				type: "POST",
				data: JSON.stringify(this.para),
				dataType: "json",
				contentType: "application/json",
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	}

	//获取历史会话记录
	Model.getHistoryMsgs = {
		url: "",
		data: null,
		para: {},
		execute: function(succCallback, failCallback) {
			$.ajax({
				url: this.url,
				//data: this.para,
				dataType: "json",
				beforeSend: function() {
					//showLoading();
				},
				success: function(data) {
					succCallback(data);
				},
				complete: function(jqXHR, textStatus) {},
				error: function(error) {
					failCallback(error);
				}
			})
		}
	}

	module.exports = Model;
});