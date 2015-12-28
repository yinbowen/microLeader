/**
 * @fileoverview 聊天页面视图层，根据业务逻辑层返回的数据来修改页面的显示
 * @author bwyin@ctrip.com
 */
define(function(require, exports, module) {
	var dialogList = require("../Controller/chat.controller.js").dialogList;
	var chatPanel = require("../Controller/chat.controller.js").chatPanel;
	var $ = require("../Plugins/jquery.sea.js");
	var Swiper = require("../Plugins/swiper.sea.js");
	var Util = require("../Plugins/XYDialog.sea.js");
	var _ = require("../Plugins/underscore.sea.js");

	//console.log($.ajax('http://apollo.envisioncn.com/scadaweb/get_tree?_t=1449196633731&type=nostatistics&appName=ApolloOS&'));
	
	var View = {
		dialogListSwiper : null,
		memberSwiper: null, //群成员列表滑动控件
		searchSwiper: null,
		bindEvent: function() {
			var self = this;

			//鼠标点击某个会话列表
			$("#group_list").on('click', '.cur_dialog', function(event) {
				$(this).addClass('active').siblings('li').removeClass('active');
				self.initChatPanel(event);
				self.showHideChatPanel();
			});

			//聊天窗口关闭按钮
			$("#right_chat_container").on('click', '#chat_panel .right_close_btn', function(event) {
				$("#chat_panel").css('display', 'none');
				$("#group_list li.cur_dialog.active").removeClass('active');
				$("#group_member_list ul").empty();
			});

			//历史记录按钮
			$("#right_chat_container").on('click', '#chat_panel .history_btn', function(event) {
				Util.Dialog({
					type: "dialog",
					boxID: "cur_history_msgs",
					title: "历史消息记录",
					content: "text:",
					showbg: true,
					drag: true,
					width: 700,
					height: 500,
					ofns: function() {
						var groupId = 126630987600756740,
							aftOrBefore = "aft",
							lastMsgId = "0";
						chatPanel.getHistoryMsgs(groupId, aftOrBefore, lastMsgId, function(data){
							console.log(data);
						});
					},
					yesBtn: ["上一页", function(){
						return false;
					}],
					noBtn: ["下一页", function(){
						return false;
					}]
				});
			});

			//聊天面板群名称点击事件（展开和收起群成员列表）
			$("#right_chat_container").on('click', '#chat_panel .member_name', function(event) {
				event.preventDefault();
				$("#group_member_list").slideToggle(400, function() {

					if ($("#chat_panel .member_name").attr("is_member_rended") === "false") {
						var panel_id = $("#chat_panel").attr('panel_id');
						var members = chatPanel.groupInfoObj[panel_id].members;
						if (members && members.length > 0) {
							self.renderMember(members);
						} else {
							var panelId = $("#chat_panel").attr("panel_id");
							var leaderUid = $("#user_info").data('selfInfo').uid.toUpperCase(); //领队uid
							chatPanel.getGroupMembers(panelId, leaderUid, function(data) {
								self.renderMember(data);
							});			
						};
					}
					if ($(this).is(':hidden')) {
						$("#right_chat_container li.group_member .delete_btn").removeClass('active');
						if($("#chat_panel .member_name").attr("is_member_rended") === "false") {
							$("#group_member_list ul").empty();
						}
					}
				});
			});
			$(document).on('click', function(event) {
				if(!$(event.target).is('#group_list .group_search') && !$(event.target).is('#group_list .search_result_panel') 
					&& !$(event.target).parents().is('#group_list .search_result_panel')) {
					$(".search_result_panel").slideUp(400);
				}
				if ($("#group_member_list").css('display') === "none") {
					return;
				} else {
					if (!$(event.target).is('.panel_head .member_name') && !$(event.target).parents().is('#group_member_list') 
						&& !$(event.target).is('div.ui_dialog_wrap') && !$(event.target).parents().is('div.ui_dialog_wrap')) {
						$("#group_member_list").slideUp(400, function() {
							if ($("#chat_panel .member_name").attr("is_member_rended") === "false") {
								$("#group_member_list ul").empty();
							}
						});
						$("#right_chat_container li.group_member .delete_btn").removeClass('active');
					}
				}
			});

			//搜索框获得焦点和失去焦点事件
			$("#left_groups_container").on('focusin', '.group_search', function(event) {
				event.preventDefault();
				$(".search_result_panel").slideDown(400);
				$(".search_result_panel ul").empty();
				var searchTxt = $.trim($("#left_groups_container .group_search").val());
				if(searchTxt !== "") {
					self.searchGroup();
				}
			});

			//搜索框的keydown事件
			$("#left_groups_container").on('keydown', '.group_search', function(event) {
				//event.preventDefault();
				if (event.keyCode === 13) {
					self.searchGroup();
				};
			});

			//搜索结果项鼠标点击事件
			$("#left_groups_container").on('click', '.search_result_panel li', function(event) {
				var panelId = $(this).attr('panel_id');
				 var clickedDialog = $('.dialog_list li[group_id="' + panelId + '"]');
				 clickedDialog.trigger('click');
			});

			//消息发送按钮
			$("#right_chat_container").on('click', '#msg_send_btn', function(event) {
				event.preventDefault();
				var msgContent = $("#chat_textarea").val().replace(/\n/g, '<br/>');
				var selfInfo = $("#user_info").data('selfInfo');
				var panelId = $("#chat_panel").attr('panel_id');
				var chatType = $("#chat_panel").attr('chat_type');
				if (msgContent !== "") {
					self.showNewMsg(msgContent, selfInfo); //将新消息添加到聊天框
					chatPanel.pushMsgToServer(msgContent, selfInfo, panelId, chatType, function(data, msgObj) {
						$('.dialog_list li[group_id="' + msgObj.msgDestination + '"]').find('.last_msg .msg_content').text(msgObj.msgContent.replace(/<br\/>/g, ''));
					}); //向服务器推送消息
				};
			});

			//消息输入框回车,回车+Enter换行事件
			$("#right_chat_container").on('keydown', '#chat_textarea', function(event) {
				if (event.keyCode === 13 && !event.ctrlKey) {
					event.preventDefault();
					$("#msg_send_btn").trigger('click');
				} else if(event.keyCode === 13 && event.ctrlKey) {
					$(this).val($(this).val() + "\n");
				};

			});

			//添加群成员按钮
			$("#right_chat_container").on('click', '.add_member', function(event) {
				event.preventDefault();
				$("#right_chat_container li.group_member .delete_btn").removeClass('active');
				Util.Dialog({
					type: "dialog",
					boxID: "add_member_dialog",
					title: "添加群成员",
					content: "url:get?addMember.html",
					showbg: true,
					drag: true,
					width: 550,
					height: 350,
					yesBtn: ["确定", function(){
						console.log("添加群成员");
						var groupId = $("#chat_panel").attr('panel_id');
						var ajaxPara = {
							invitor: "ImWebAdmin",
							members: []
						};
						$("#add_member_dialog_content .waiting_add_list table tbody tr").each(function(index, el) {
							var member = {
								uid: $(el).attr('uid'),
								orderid: $(el).attr('order_id')
							};
							ajaxPara.members.push(member);
						});
						console.log(ajaxPara);
						chatPanel.addGroupMember(groupId, ajaxPara, function(data) {
							console.log(data);
						});

					}],
					noBtn: ["取消", function(){

					}]
				});
				return false;
			});

			//删除群成员按钮
			$("#right_chat_container").on('click', '.delete_member', function(event) {	
				$("#right_chat_container li.group_member .delete_btn").addClass('active');
			});
			$("#right_chat_container").on('click', '.delete_btn', function(event) {	
				Util.Dialog({
					type: "dialog",
					boxID: "delete_member_dialog",
					title: "",
					content: "text:<p class='confirm_delete_txt'>请确认是否将此用户踢出群聊？</p>",
					showbg: true,
					drag: true,
					width: 350,
					height: 80,
					yesBtn: ["确定", function(){
						var groupId = $("#chat_panel").attr('panel_id');
						//var kicker = $("#user_info").data('selfInfo').uid;
						var kickedMemberId = $(event.target).parent().attr('user_id');
						chatPanel.deleteGroupMember(groupId,  kickedMemberId, function(data) {
							//alert("删除成功");
								$(event.target).parent().hide(400, function() {
									
								});
								var members = chatPanel.groupInfoObj[groupId].members;
								for (var i = 0; i < members.length; i++) {
									if(members[i].uid.toUpperCase() === kickedMemberId.toUpperCase()) {
										members.splice(i, 1);
									}
								};
						});
					}],
					noBtn: ["取消", function(){

					}]
				});
			});

			//添加成员弹框内添加按钮鼠标点击事件
			$("body").on('click', '#add_member_dialog .add_member_btn', function() {
				var uid = $("#add_member_uid").val();
				var order_id = $("#add_member_orderid").val();
				if(uid !== "" && order_id !== "") {
					if ($(".waiting_add_list table tbody tr[uid='"+uid+"']").length > 0) {
						Util.Dialog({
							type: "dialog",
							boxID: "do_not_add_same_person",
							title: "",
							content: "text:<p class='confirm_delete_txt'>请勿重复添加！</p>",
							showbg: true,
							drag: true,
							width: 350,
							height: 80,
							yesBtn: ["确定", function() {

							}]
						});
					} else{
						var trStr = "<tr uid='" + uid + "' order_id='" + order_id + "'><td title='" + uid + "'>" + uid + "</td><td title='" + order_id + "'>" + order_id + "</td><td><button class='delete_member_btn'>删除</button></td></tr>";
						$(".waiting_add_list table tbody").append(trStr);
						$("#add_member_uid").val("");
						$("#add_member_orderid").val("");
					};
				} else {
					Util.Dialog({
						type: "dialog",
						boxID: "add_member_illegal_input",
						title: "非法输入",
						content: "text:<p class='confirm_delete_txt'>请同时输入UID和订单号！</p>",
						showbg: true,
						drag: true,
						width: 350,
						height: 80,
						yesBtn: ["确定", function() {

						}]
					});
				}
			});
			
			//添加成员弹框内删除按钮鼠标点击事件
			$("body").on('click', '#add_member_dialog .delete_member_btn', function(event) {
				$(event.target).parent().parent().animate({
						opacity: "0"
					},
					300,
					'linear',
					function() {
						$(event.target).parent().parent().remove();
					});
			});
		},

		//聊天窗口的显示和隐藏
		showHideChatPanel: function() {
			$("#chat_panel").css('display', 'flex');
		},

		renderMember: function(data) {
			var htmlStr = '<li class="add_member">添加成员</li><li class="delete_member">删除成员</li>';
			for (var i = 0; i < data.length; i++) {
				if(data[i].uid.toUpperCase() === $("#user_info").data('selfInfo').uid.toUpperCase()) { //领队自己
					htmlStr += ('<li class="group_member team_leader" user_id="' + data[i].uid + '"><a href="javascript:void(0);" class="avator"><img src="../Images/userImg.jpg"></a><p class="member_nick" title="' + data[i].uid + '">' + data[i].uid + '</p></li>');
				} else {
					htmlStr += ('<li class="group_member" user_id="' + data[i].uid + '"><a href="javascript:void(0);" class="avator"><img src="../Images/userImg.jpg"></a><p class="member_nick" title="' + data[i].uid + '">' + data[i].uid + '</p><div class="delete_btn">-</div></li>');
				}
			};
			$("#group_member_list ul").html(htmlStr);
			//$(".group_member.team_leader").prependTo('#group_member_list ul');
			View.initSwiper(View.memberSwiper, '#group_member_list', '#group_member_list .swiper-scrollbar'); //初始化滑动控件
			$("#chat_panel .member_name").attr("is_member_rended", 'true');
		},

		initSwiper: function(sweperObj, container, scrollSelector) {
			if (sweperObj) {
				sweperObj.destroy();
				sweperObj = null;
			}
			sweperObj = new Swiper(container, {
				scrollbar: scrollSelector,
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

			if (member_name !== $("#chat_panel .member_name").text()) {
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
			curClickLi.find('.newMsgNum').attr('new_msg_num', '0').html("0").hide();

			//聊天框内的消息初始化，数据源是保存在chatPanel.groupInfoObj对象中的消息数据
			if (typeof old_panel_id === "undefined" || (curClickLi.attr("group_id") !== old_panel_id && curClickLi.attr("user_id") !== old_panel_id)) {
				//alert("需要初始化！");
				var panelId = $("#chat_panel").attr("panel_id");
				var msgArr = chatPanel.groupInfoObj[panelId].message;
				if (msgArr && msgArr.length > 0) {
					var chatContentHtml = "";
					for (var i = 0; i < msgArr.length; i++) {
						chatContentHtml += '<div class="chat_content_wrap ' + msgArr[i].msgType + '" send_uid="' + msgArr[i].userID + '"><img src="' + msgArr[i].userImgURL + '"><p class="chat_nick">' + msgArr[i].userNick + '</p><p class="chat_content">' + msgArr[i].msgContent + '</p></div>';
					};
					$("#chat_panel .panel_body").empty();
					$("#chat_panel .panel_body").append(chatContentHtml);
					$("#chat_panel .panel_body").scrollTop($("#chat_panel .panel_body")[0].scrollHeight);
				} else {
					$("#chat_panel .panel_body").empty();
				};
			}
		},

		//初始化个人信息，头像、昵称、标签等
		initPersonalInfo: function(uid) {
			dialogList.getPersonalInfo(uid, function(data) {
				$("#user_info img").attr('src', data.HeadPhotoSize100);
				$("#user_info .user_nickname").text(data.NickName);
				$("#user_info").data('selfInfo', data);
			});
		},

		//初始化会话列表
		initDialogList: function(uid, gtype) {
			dialogList.getGroupList(uid, gtype, function(data) {
				var groups = data.groups;
				for (var i = 0; i < groups.length; i++) {
					$("#group_list .dialog_list").append('<li group_id="' + groups[i].gid + '" class="cur_dialog swiper-slide">\
													<a href="javascript:void(0);" class ="avator"><img src="../Images/userImg.jpg"></a>\
													<p class="member_name">' + groups[i].name + '</p><p class="last_msg"><span class="msg_content"></span><span class="msg_time">11/20 15:12</span></p>\
													<div class="newMsgNum" new_msg_num="0">0</div></li>');
					$("#group_list .dialog_list li:last-child").data("groupInfo", groups[i]);
					chatPanel.groupInfoObj[groups[i].gid] = groups[i];
				};

				View.initSwiper(View.dialogListSwiper, '.list.swiper-container', '.list.swiper-container>.swiper-scrollbar');
			})
		},

		//将发送的消息先展示在聊天框中（如果发送失败要添加失败提示）
		showNewMsg: function(msgContent, selfInfo) {
			if (msgContent !== "") {
				var msgHTML = '<div class="chat_content_wrap self" send_uid="' + selfInfo.uid + '">\
								<img src="' + selfInfo.HeadPhotoSize100 + '">\
								<p class="chat_nick">' + selfInfo.NickName + '</p>\
								<p class="chat_content">' + msgContent + '</p>\
								</div>';
				$("#chat_panel .panel_body").append(msgHTML);
				$("#chat_panel .panel_body").scrollTop($("#chat_panel .panel_body")[0].scrollHeight);
				$("#chat_textarea").val("");
			}
		},

		//轮询拉取新消息
		pullNewMsg: function(uid) {
			chatPanel.startPullMsg(uid, function(data) {
				if (data.code === "10000") {
					var msgs = data.message;
					for (var i = 0; i < msgs.length; i++) {
						var dialogContainMsg = $('.dialog_list li[group_id="' + msgs[i].msgDestination + '"]'); //包含该消息的会话列表

						msgs[i].msgType = "other"; //用来区分是收到的消息还是自己发的消息

						//将新收到的消息存入groupInfoObj对象
						chatPanel.addMsgToObj(msgs[i].msgDestination, msgs[i]);

						//重置会话列表中的最新消息
						dialogContainMsg.find('.last_msg .msg_content').text(msgs[i].msgContent);
 
						var nowNum = parseInt(dialogContainMsg.find('.newMsgNum').attr('new_msg_num')) + 1;
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
								dialogContainMsg.find('.newMsgNum').attr("new_msg_num", parseInt(dialogContainMsg.find('.newMsgNum').attr('new_msg_num')) + 1);
								dialogContainMsg.find('.newMsgNum').text(nowNum > 99 ? "..." : nowNum);
								dialogContainMsg.find('.newMsgNum').show();
							}
						} else {
							dialogContainMsg.find('.newMsgNum').attr("new_msg_num", parseInt(dialogContainMsg.find('.newMsgNum').attr('new_msg_num')) + 1);
							dialogContainMsg.find('.newMsgNum').text(nowNum > 99 ? "..." : nowNum);
							dialogContainMsg.find('.newMsgNum').show();
						}
					};
				} else {
					return;
				}
			});
		},

		//搜素聊天对话框
		searchGroup: function() {
			var searchTxt = $.trim($("#left_groups_container .group_search").val());
			if (searchTxt !== "") {
				var resultHtml = ""; //搜索结果的HTML字符串
				$(".search_result_panel ul").empty();
				for (obj in chatPanel.groupInfoObj) {
					var curObj = chatPanel.groupInfoObj[obj];
					if (curObj.name.indexOf(searchTxt) >= 0) {
						resultHtml += '<li class="search_result swiper-slide" panel_id="' + curObj.gid + '">' + curObj.name + '</li>'
					}
				}
				if (resultHtml === "") {
					$(".search_result_panel ul").append('<li class="no_result">暂无结果！</li>');
					$(".search_result_panel ul").addClass('no_result');
				} else {
					$(".search_result_panel ul").append(resultHtml);
					$(".search_result_panel ul").removeClass('no_result');
					//View.initSwiper(View.searchSwiper, ".search_result_panel.swiper-container", ".search_result_panel.swiper-container .swiper-scrollbar");
				};
			};
		}
	};

	module.exports = View;

});