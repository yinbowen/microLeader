define(function(require, exports, module) {

	var Model = require("../Model/chat.model.js");

	var chatPanel = {
		groupInfoObj: {}, //用于存放所有群组的名称、ID、成员、消息等
		chatType: "", //聊天类型：群聊或私聊
		chatId: "", //groupId or uid
		memberSwiper: null, //群成员列表滑动控件

		bindEvent: function() {
			var self = this;

			//聊天面板群名称点击事件（展开和收起群成员列表）
			$("#right_chat_container").on('click', '#chat_panel .member_name', function(event) {
				event.preventDefault();
				$("#group_member_list").slideToggle(400, function() {

					if ($("#chat_panel .member_name").attr("is_member_rended") === "false") {
						var panel_id = $("#chat_panel").attr('panel_id');
						var members = chatPanel.groupInfoObj[panel_id].members;
						if (members && members.length > 0) {
							chatPanel.renderMember(members);
						} else {
							//获取群成员列表
							Model.getGroupMember.url = "http://im.uat.qa.nt.ctripcorp.com/api/group/users";
							Model.getGroupMember.para = {
								gid: $("#chat_panel").attr("panel_id")
							};
							Model.getGroupMember.execute(self.initGroupMember, self.initGroupMember);
						};
					}
				});
			});
			$(document).on('click', function(event) {
				if ($("#group_member_list").css('display') === "none") {
					return;
				} else {
					if (!$(event.target).is('.panel_head .member_name') && !$(event.target).parents().is('#group_member_list')) {
						$("#group_member_list").slideUp(400);
					}
				}
			});

			//聊天窗口关闭按钮
			$("#right_chat_container").on('click', '#chat_panel .right_close_btn', function(event) {
				$("#chat_panel").css('display', 'none');
			});

			//消息发送按钮
			$("#right_chat_container").on('click', '#msg_send_btn', function(event) {
				event.preventDefault();
				var msgContent = $("#chat_textarea").val().replace(/\n/g, '<br/>');
				var selfInfo = $("#user_info").data('selfInfo');
				chatPanel.showNewMsg(msgContent, selfInfo); //将新消息添加到聊天框
				chatPanel.pushMsgToServer(msgContent, selfInfo); //向服务器推送消息
			});
		},

		//开始轮询拉取新消息
		startPullMsg: function(uid) {
			var newMsgTimer = setInterval(function() {
				Model.getNewMsg.url = "http://im.uat.qa.nt.ctripcorp.com/api/group/latest";
				Model.getNewMsg.para = {
					uid: uid
				};
				Model.getNewMsg.execute(chatPanel.newMsgHandle, chatPanel.newMsgHandle);
			}, 3000);
		},

		//收到新消息后的回调
		newMsgHandle: function(data) {

			//bowen:测试数据
			var data = {
				code: "10000", //表示有新消息，“20000”表示没有新消息
				message: [{
					userID: "3452352", //发件人的id
					userNick: "飞翔的鸟儿", //用户昵称
					userImgURL: "../Images/userImg.jpg",
					msgDestination: "2015111001", //群消息为群ID，私聊为收件人的用户ID
					msgContent: "Hello，你好，周杰伦~",
					msgTime: "1447299073084",
				}, {
					userID: "34523523",
					userNick: "听风就是雨",
					userImgURL: "../Images/userImg.jpg",
					msgDestination: "2015111003",
					msgContent: "此刻我在美丽的希腊，希望大家玩的开心！！！",
					msgTime: "1447299273234",
				}]
			};

			if (data.code === "10000") {
				var msgs = data.message;
				for (var i = 0; i < msgs.length; i++) {
					var dialogContainMsg = $('.dialog_list li[group_id="' + msgs[i].msgDestination + '"]'); //包含该消息的会话列表

					msgs[i].msgType = "other"; //用来区分是收到的消息还是自己发的消息

					//将新收到的消息存入groupInfoObj对象
					chatPanel.addMsgToObj(msgs[i].msgDestination, msgs[i]);

					//重置会话列表中的最新消息
					dialogContainMsg.find('.last_msg').text(msgs[i].msgContent);

					var nowNum = parseInt($('.dialog_list li[group_id="' + msgs[i].msgDestination + '"]').find('.newMsgNum').text());
					if (msgs[i].msgDestination === $("#chat_panel").attr("panel_id")) {
						var msgHtmlStr = '<div class="chat_content_wrap other" send_uid="' + msgs[i].userID + '"><img src="' + msgs[i].userImgURL + '"><p class="chat_nick">' + msgs[i].userNick + '</p><p class="chat_content">' + msgs[i].msgContent + '</p></div>';
						var scrollTop = $("#chat_panel .panel_body").scrollTop(),
							scrollHeight = $("#chat_panel .panel_body")[0].scrollHeight,
							eleOffsetHeight = $("#chat_panel .panel_body").outerHeight();

						$("#chat_panel .panel_body").append(msgHtmlStr);

						//如果滚动条已经处于底部则收到新消息后继续让他滚到底部
						if (scrollTop + eleOffsetHeight === scrollHeight) {
							$("#chat_panel .panel_body").scrollTop(scrollHeight); //让滚动条始终滚到最底部
						}

						if ($("#chat_panel").css("display") === "none") {
							dialogContainMsg.find('.newMsgNum').text(nowNum + 1);
							dialogContainMsg.find('.newMsgNum').show();
						}
					} else {
						dialogContainMsg.find('.newMsgNum').text(nowNum + 1);
						dialogContainMsg.find('.newMsgNum').show();
					}
				};
			} else {
				return;
			}
		},

		//将发送的消息先展示在聊天框中（如果发送失败要添加失败提示）
		showNewMsg: function(msgContent, selfInfo) {
			var msgHTML = '<div class="chat_content_wrap self" send_uid="' + selfInfo.uid + '">\
								<img src="' + selfInfo.imgUrl + '">\
								<p class="chat_nick">' + selfInfo.user_nickname + '</p>\
								<p class="chat_content">' + msgContent + '</p>\
								</div>';
			$("#chat_panel .panel_body").append(msgHTML);
			$("#chat_panel .panel_body").scrollTop($("#chat_panel .panel_body")[0].scrollHeight);
			$("#chat_textarea").val("");

		},

		//将新消息发送给服务器
		pushMsgToServer: function(msgContent, selfInfo) {
			if ($("#chat_panel").attr('chat_type') === "group") {
				Model.sendNewMsg.url = "http://im.uat.qa.nt.ctripcorp.com/api/group/send2group";
			} else {
				Model.sendNewMsg.url = "http://im.uat.qa.nt.ctripcorp.com/api/group/send2user";
			}

			Model.sendNewMsg.para = {
				from: selfInfo.uid,
				to: $("#chat_panel").attr('panel_id'),
				msg: msgContent
			};

			var msgObj = {
				msgContent: msgContent,
				msgDestination: $("#chat_panel").attr('panel_id'),
				msgTime: "",
				userID: selfInfo.uid,
				userImgURL: selfInfo.imgUrl,
				userNick: selfInfo.user_nickname
			};
			Model.sendNewMsg.execute(chatPanel.sendMsgOk, chatPanel.sendMsgError, msgObj);
		},

		//发送新消息成功回调
		sendMsgOk: function(data, msgObj) {

			//bowen:测试数据
			data = {
				code: "10000", //表示发送成功
				msgID: "", //消息ID
				serverReceiveTime: "" //服务器接收到的时间
			};

			if (data.code === "10000") {
				msgObj.isSendSucc = "true"; //发送成功标志
				msgObj.msgType = "self";
				chatPanel.addMsgToObj(msgObj.msgDestination, msgObj);
			};



		},

		sendMsgError: function(data, msgObj) {
			msgObj.isSendSucc = "false"; //发送失败标志
			msgObj.msgType = "self";
			chatPanel.addMsgToObj(msgObj.msgDestination, msgObj);
		},

		//初始化群成员列表
		initGroupMember: function(data) {
			console.log(data);

			//bowen:测试数据
			var data = [{
				userId: 12341242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "苏东坡"
			}, {
				userId: 123451242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "周杰伦"
			}, {
				userId: 156241242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "我是毛主席的后人"
			}, {
				userId: 1562456782,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "稻花开"
			}, {
				userId: 156241215,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "谷粒多燕麦牛奶"
			}, {
				userId: 156241242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "大奎奎"
			}, {
				userId: 12341242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "苏东坡"
			}, {
				userId: 123451242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "周杰伦"
			}, {
				userId: 156241242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "我是毛主席的后人"
			}, {
				userId: 1562456782,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "稻花开"
			}, {
				userId: 156241215,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "谷粒多燕麦牛奶"
			}, {
				userId: 156241242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "大奎奎"
			}, {
				userId: 12341242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "苏东坡"
			}, {
				userId: 123451242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "周杰伦"
			}, {
				userId: 156241242,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "我是毛主席的后人"
			}, {
				userId: 1562456782,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "稻花开"
			}, {
				userId: 156241215,
				userImgURL: "../Images/userImg.jpg",
				userNickname: "谷粒多燕麦牛奶"
			}];

			var panel_id = $("#chat_panel").attr('panel_id');
			chatPanel.groupInfoObj[panel_id].members = data;
			chatPanel.renderMember(data);



		},
		renderMember: function(data) {
			var htmlStr = '<li class="add_member">添加成员</li><li class="delete_member">删除成员</li>';
			for (var i = 0; i < data.length; i++) {
				htmlStr += ('<li class="group_member" user_id="' + data[i].userId + '"><a href="javascript:void(0);" class="avator"><img src="' + data[i].userImgURL + '"></a><p class="member_nick">' + data[i].userNickname + '</p></li>');
			};
			$("#group_member_list ul").html(htmlStr);
			chatPanel.refreshMemberSwiper(); //刷新滑动控件
			$("#chat_panel .member_name").attr("is_member_rended", 'true');
		},
		refreshMemberSwiper: function() {
			if (chatPanel.memberSwiper) {
				chatPanel.memberSwiper.destroy();
				chatPanel.memberSwiper = null;
			}
			chatPanel.memberSwiper = new Swiper('#group_member_list', {
				scrollbar: '#group_member_list .swiper-scrollbar',
				direction: 'vertical',
				slidesPerView: 'auto',
				mousewheelControl: true,
				freeMode: true
			});
		},
		addMsgToObj: function(msgDestination, msg) {
			if (chatPanel.groupInfoObj[msgDestination].message) {
				chatPanel.groupInfoObj[msgDestination].message.push(msg);
			} else {
				chatPanel.groupInfoObj[msgDestination].message = [];
				chatPanel.groupInfoObj[msgDestination].message.push(msg);
			};
		}
	}

	module.exports = chatPanel;
});