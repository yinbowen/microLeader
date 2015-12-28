define(function(require, exports, module){
	var Model = require("../Model/chat.model.js");
	var chatPanel = require("../Controller/chatPanel.controller.js");
	var dialogList = {
		groupListSwiper: null,

		//会话窗口模块的时间绑定
		bindEvent: function() {
			var self = this;
			//鼠标点击某个会话列表
			$("#group_list").on('click', '.cur_dialog', function(event) {
				console.log(event.target);
				self.initChatPanel(event);
				self.showHideChatPanel();
			});
		},

		//聊天窗口的显示和隐藏
		showHideChatPanel: function() {
			$("#chat_panel").css('display', 'flex');
		},

		//Ajax获取群列表
		getGroupList: function(uid, gtype) { 
			var self = this;
			Model.getGroupList.url = "http://im.uat.qa.nt.ctripcorp.com/api/group/groups_gtype";
			Model.getGroupList.para = {
				uid: "23423",
				gtype: "1001"
			};
			Model.getGroupList.execute(self.initChatList, self.initChatList);
		},

		//获取群列表成功回调：用返回的数据初始化会话列表框
		initChatList: function(jsonData) {
			console.log(jsonData);
			var self = this;

			//bowen:测试数据
			var jsonData = {
				error: 0,
				groups: [{
					gid: "2015111001",
					gtype: "1001",
					name: "巴沙11月20日出行群",
					imgUrl: "../Images/userImg.jpg",
					latestMsg: {
						content: "明天再上人民广场集合~",
						timeStamp: "11:41"
					}
				}, {
					gid: "2015111002",
					gtype: "1001",
					name: "马来西亚11月23日出行群",
					imgUrl: "../Images/userImg.jpg",
					latestMsg: {
						content: "大家好，我是此次行程的领队~",
						timeStamp: "09:41"
					}
				}, {
					gid: "2015111003",
					gtype: "1001",
					name: "泰国11月29日出行群",
					imgUrl: "../Images/userImg.jpg",
					latestMsg: {
						content: "大家注意人身安全。。。",
						timeStamp: "09:41"
					}
				}, {
					gid: "2015111004",
					gtype: "1001",
					name: "韩国12月03日出行群",
					imgUrl: "../Images/userImg.jpg",
					latestMsg: {
						content: "你好，思密达！！",
						timeStamp: "17:23"
					}
				}, {
					gid: "2015111005",
					gtype: "1001",
					name: "美国12月30日出行群",
					imgUrl: "../Images/userImg.jpg",
					latestMsg: {
						content: "终于见到奥巴马真人了，哈哈",
						timeStamp: "11:41"
					}
				}, {
					gid: "2015111006",
					gtype: "1001",
					name: "希腊12月15日出行群",
					imgUrl: "../Images/userImg.jpg",
					latestMsg: {
						content: "爱琴海好美啊~",
						timeStamp: "12:38"
					}
				}, {
					gid: "2015111007",
					gtype: "1001",
					name: "土耳其11月22日出行群",
					imgUrl: "../Images/userImg.jpg",
					latestMsg: {
						content: "大家吃好喝好玩好。",
						timeStamp: "19:33"
					}
				}]
			}

			var groups = jsonData.groups;
			for (var i = 0; i < groups.length; i++) {
				$("#group_list .dialog_list").append('<li group_id="' + groups[i].gid + '" class="cur_dialog swiper-slide">\
													<a href="javascript:void(0);" class ="avator"><img src="' + groups[i].imgUrl + '"></a>\
													<p class="member_name">' + groups[i].name + '</p><p class="last_msg">' + groups[i].latestMsg.content + '</p>\
													<div class="newMsgNum">0</div></li>');
				$("#group_list .dialog_list li:last-child").data("groupInfo", groups[i]);
				chatPanel.groupInfoObj[groups[i].gid] = groups[i];
			};

			dialogList.groupListSwiper = null;
			dialogList.groupListSwiper = new Swiper('#group_list .swiper-container', {
				scrollbar: '#group_list .swiper-scrollbar',
				direction: 'vertical',
				slidesPerView: 'auto',
				mousewheelControl: true,
				freeMode: true
			});

		},

		//初始化聊天窗口：窗口名称，ID，聊天类型等
		initChatPanel: function(event) {
			var curClickLi = $(event.target).is('li.cur_dialog') ? $(event.target) : $(event.target).parents("li.cur_dialog");
			var curPanelInfo = curClickLi.data("groupInfo"); //当前窗口的相关信息
			var member_name = curPanelInfo.name;
			var old_panel_id = $("#chat_panel").attr('panel_id');

			if(member_name !== $("#chat_panel .member_name").text()) {
				$("#chat_panel .member_name").attr("is_member_rended", 'false');
			}

			$("#chat_panel .member_name").html(member_name);
			
			if (curClickLi.attr("group_id")) {
				$("#chat_panel").attr({
					chat_type: "group", //群聊
					panel_id: curClickLi.attr("group_id") //聊天窗口的ID，群聊时为群的ID，私聊时为用户ID
				});
			};
			if (curClickLi.attr("user_id")) {
				$("#chat_panel").attr({
					chat_type: "private", //私聊
					panel_id: curClickLi.attr("user_id")
				});
			};

			//未读消息提示框清零以及隐藏
			curClickLi.find('.newMsgNum').html("0").hide();

			//聊天框内的消息初始化，数据源是保存在chatPanel.groupInfoObj对象中的消息数据
			if(typeof old_panel_id === "undefined" || (curClickLi.attr("group_id") !== old_panel_id && curClickLi.attr("user_id") !== old_panel_id)) {
				//alert("需要初始化！");
				var panelId = $("#chat_panel").attr("panel_id");
				var msgArr = chatPanel.groupInfoObj[panelId].message;
				if (msgArr && msgArr.length > 0) {
					var chatContentHtml = "";
					for (var i = 0; i < msgArr.length; i++) {
						chatContentHtml += '<div class="chat_content_wrap other" send_uid="' + msgArr[i].userID + '"><img src="' + msgArr[i].userImgURL + '"><p class="chat_nick">' + msgArr[i].userNick + '</p><p class="chat_content">' + msgArr[i].msgContent + '</p></div>';
					};
					$("#chat_panel .panel_body").empty();
					$("#chat_panel .panel_body").append(chatContentHtml);
					$("#chat_panel .panel_body").scrollTop($("#chat_panel .panel_body")[0].scrollHeight);
				} else {
					$("#chat_panel .panel_body").empty();
				};
			}
		}
	}
	module.exports = dialogList;
});