/**
 * @fileoverview 聊天页面业务逻辑层，处理数据模型层返回的数据，供视图层调用
 * @author bwyin@ctrip.com
 */

define(function(require, exports, module) {

	var Model = require("../Model/chat.model.js");
	var _ = require("../Plugins/underscore.sea.js");

	var chatPanel = {
		groupInfoObj: {}, //用于存放所有群组的名称、ID、成员、消息等
		chatType: "", //聊天类型：群聊或私聊
		chatId: "", //groupId or uid


		//获取群成员信息
		getGroupMembers: function(panelId, leaderUid, renderDomCallback) {
			Model.getGroupMember.url = Model.url + "/api/group/users/" + panelId;
			Model.getGroupMember.para = {
				gid: panelId
			};
			Model.getGroupMember.execute(function(data) {

				//将领队放到最前面
				for (var i = 0; i < data.length; i++) {
					if(data[i].uid.toUpperCase() === leaderUid) {
						var leaderObj = data.splice(i, 1);
						data.unshift(leaderObj[0]);
					}
				};

				chatPanel.groupInfoObj[panelId].members = data;
				renderDomCallback(data);
			}, function(error) {	
				chatPanel.groupInfoObj[panelId].members = data;
				renderDomCallback(data);
			});
		},

		//开始轮询拉取新消息
		startPullMsg: function(uid, renderDomCallback) {
			var newMsgTimer = setInterval(function() {
				Model.getNewMsg.url = Model.url + "/api/group/latest" + "/126630987600756740";
				Model.getNewMsg.para = {
					uid: uid
				};
				Model.getNewMsg.execute(function(data){
					//bowen:测试数据
					var data = {
						code: "10000", //表示有新消息，“20000”表示没有新消息
						message: [{
							userID: "3452352", //发件人的id
							userNick: "飞翔的鸟儿", //用户昵称
							userImgURL: "../Images/userImg.jpg",
							msgDestination: "134434265495502852", //群消息为群ID，私聊为收件人的用户ID
							msgContent: "Hello，你好，周杰伦~",
							msgTime: "1447299073084",
						}, {
							userID: "34523523",
							userNick: "听风就是雨",
							userImgURL: "../Images/userImg.jpg",
							msgDestination: "134434265495502852",
							msgContent: "此刻我在美丽的希腊，希望大家玩的开心！！！",
							msgTime: "1447299273234",
						}]
					};
					renderDomCallback(data);
				}, function(error){

					renderDomCallback(data);
				});
			}, 3000);
		},

		//将新消息发送给服务器
		pushMsgToServer: function(msgContent, selfInfo, panelId, chatType, renderDomCallback) {
			if (chatType === "group") {
				Model.sendNewMsg.url =Model.url + "/api/group/send2group/" + selfInfo.uid + "/" + panelId;
			} else {
				Model.sendNewMsg.url = Model.url + "/api/group/send2user/" + selfInfo.uid + "/" + panelId;
			}

			Model.sendNewMsg.para = {
				from: selfInfo.uid,
				to: panelId,
				msg: msgContent
			};

			var msgObj = {
				msgContent: msgContent,
				msgDestination: panelId,
				msgTime: "",
				userID: selfInfo.uid,
				userImgURL: selfInfo.imgUrl,
				userNick: selfInfo.user_nickname
			};
			Model.sendNewMsg.execute(function(data) {
				if (data.code === "10000") {
					msgObj.isSendSucc = "true"; //发送成功标志
					msgObj.msgType = "self";
					chatPanel.addMsgToObj(msgObj.msgDestination, msgObj);
					renderDomCallback(data, msgObj);
				};
			}, function(error) {

				//bowen:测试数据
				data = {
					code: "10000", //表示发送成功
					msgID: "", //消息ID
					serverReceiveTime: "" //服务器接收到的时间
				};

				msgObj.isSendSucc = "false"; //发送失败标志
				msgObj.msgType = "self";
				chatPanel.addMsgToObj(msgObj.msgDestination, msgObj);
				renderDomCallback(data, msgObj);
			});
		},

		addMsgToObj: function(msgDestination, msg) {
			if (chatPanel.groupInfoObj[msgDestination].message) {
				chatPanel.groupInfoObj[msgDestination].message.push(msg);
			} else {
				chatPanel.groupInfoObj[msgDestination].message = [];
				chatPanel.groupInfoObj[msgDestination].message.push(msg);
			};
		},

		deleteGroupMember: function(gid, memberUid, renderDomCallback) {
			Model.deleteGroupMember.url = Model.url + "/api/group/kick/" + gid;
			Model.deleteGroupMember.para = {
				kicker: "ImWebAdmin",
				members: [memberUid]
			};
			Model.deleteGroupMember.execute(function(data) {
				renderDomCallback(data);
			}, function(error) {
				renderDomCallback(data);
			});
		},

		addGroupMember: function(gid, ajaxPara, renderDomCallback) {
			Model.addGroupMember.url = Model.url + "/api/group/invite/" + gid;
			Model.addGroupMember.para = ajaxPara;
			Model.addGroupMember.execute(function(data) {
				renderDomCallback(data);
			}, function(error) {
				renderDomCallback(error);
			});
		},

		//获取历史对话记录
		getHistoryMsgs: function(groupId, aftOrBefore, lastMsgId, renderDomCallback) {
			Model.getHistoryMsgs.url = Model.url + "/api/group/history/" + groupId + "/" + aftOrBefore + "/" + lastMsgId;
			Model.getHistoryMsgs.execute(function(data){
				renderDomCallback(data);
			}, function(error){
				renderDomCallback(error);
			});
		}
	};

	var dialogList = {

		getPersonalInfo: function(uid, renderDomCallback) {
			var self = this;

			//获取个人信息
			Model.getPersonalInfo.url = "http://m.ctrip.com/restapi/soa2/10397/GetUserInfoByUid.json";
			Model.getPersonalInfo.para = {
				uid: uid
			};
			Model.getPersonalInfo.execute(function(data) {
				renderDomCallback(data);
			}, function(error) {
				renderDomCallback(data);
			});
		},

		//Ajax获取群列表
		getGroupList: function(uid, gtype, renderDomCallback) {
			var self = this;
			Model.getGroupList.url = Model.url + "/api/group/groups_gtype" + "/" + uid.toLowerCase() + "/" + gtype;
			Model.getGroupList.execute(function(data) {
				if(data.error !== 1001){
					renderDomCallback(data);
				}
			}, function(error) {
				renderDomCallback(data);
			});
		},
	};

	exports.chatPanel = chatPanel;
	exports.dialogList = dialogList;
});