define(function(require, exports, module) {
	var $ = require("jquery.sea.js");
	/*
		@Name：公共组件
		@Author: Await[http://leotheme.cn]
		@Mail: yltfy2008@gmail.com
		@Update：2013/03/05 16:06
	*/
	var Util = typeof $ === "function" ? {} : {};
	Util.config = {
		JSfile: "" //设置JS文件夹路径
	};
	$("head").find("script").each(function() {
		var src = $(this).attr("src");
		if (typeof src != "undefined") {
			if (src.indexOf("XY_Base") != -1) {
				src = src.substring(0, src.lastIndexOf("/") + 1);
				Util.config.JSfile = src;
			};
		}
	});
	Util.getName = function(a) {
		return document.getElementsByName(a);
	};
	Util.getID = function(id) {
		return document.getElementById(id);
	};
	Util.getTag = function(ele, oParent) {
		return (oParent || document).getElementsByTagName(ele);
	};
	Util.ct = function(txt) {
		return document.createTextNode(txt);
	};
	Util.ce = function(name) {
		return document.createElement(name);
	};
	// 阻止事件冒泡
	Util.stopBubble = function(e) {
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		}
		// 阻止浏览器默认行为
	Util.stopDefault = function(e) {
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
		}
		// 清除文本选择
	Util.clSelect = function() {
		try {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		} catch (_) {};
	};
	//获取当前样式
	Util.getStyle = function(element) {
		return element.currentStyle || document.defaultView.getComputedStyle(element, null);
	};
	//清除IFrame
	Util.clearIframe = function() {
		if (Util.Browser.isIE) {
			CollectGarbage();
			setTimeout("CollectGarbage()", 1);
		}
	};

	//判断ID是否存在
	Util.exid = function(id) {
		return document.getElementById(id) ? true : false;
	};



	/*
		判断 a , b 两元素是否有包含关系
		a		要查询的对像
		b		当前点击的对像
		2012年08月04日 17:05
	*/
	Util.contains = function(a, b) {
		if (a.compareDocumentPosition) {
			return a === b || !!(a.compareDocumentPosition(b) & 16);
		};
		if (a.contains && b.nodeType === 1) {
			return a.contains(b) && a !== b;
		};
		while ((b = b.parentNode)) {
			if (b === a) return true;
			return false;
		};
	};
	/*
		绑定事件
		obj	 对像
		type  事件名称
		fn    回调函数
		2011年10月27日 17:02

	*/
	Util.bind = function(obj, type, fn) {
		if (obj.attachEvent) {
			obj['e' + type + fn] = fn;
			obj[type + fn] = function() {
				obj['e' + type + fn](window.event);
			}
			obj.attachEvent('on' + type, obj[type + fn]);
		} else {
			obj.addEventListener(type, fn, false);
		};
	}

	/*
		移除事件
		obj	 对像
		type   事件名称
		fn     回调函数
		2011年10月27日 17:05
	*/
	Util.unbind = function(obj, type, fn) {
			if (obj.detachEvent) {
				try {
					obj.detachEvent('on' + type, obj[type + fn]);
					obj[type + fn] = null;
				} catch (_) {};
			} else {
				obj.removeEventListener(type, fn, false);
			};
		}
		/*
			判断浏览器及版本
			2011年5月20日 17:01
		*/
	Util.Browser = function() {
		var a = navigator.userAgent.toLowerCase();
		var b = {};
		b.isStrict = document.compatMode == "CSS1Compat";
		b.isFirefox = a.indexOf("firefox") > -1;
		b.isOpera = a.indexOf("opera") > -1;
		b.isSafari = (/webkit|khtml/).test(a);
		b.isSafari3 = b.isSafari && a.indexOf("webkit/5") != -1;
		b.isIE = !b.isOpera && a.indexOf("msie") > -1;
		b.isIE6 = !b.isOpera && a.indexOf("msie 6") > -1;
		b.isIE7 = !b.isOpera && a.indexOf("msie 7") > -1;
		b.isIE8 = !b.isOpera && a.indexOf("msie 8") > -1;
		b.isGecko = !b.isSafari && a.indexOf("gecko") > -1;
		b.isMozilla = document.all != undefined && document.getElementById != undefined && !window.opera != undefined;
		return b
	}();

	/*
		获取页面大小相关信息
		2011年5月25日 17:01
	*/
	Util.pageSize = function() {
		var a = Util.Browser.isStrict ? document.documentElement : document.body;
		var b = ["clientWidth", "clientHeight", "scrollWidth", "scrollHeight"];
		var c = {};
		for (var d in b) c[b[d]] = a[b[d]];
		c.scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
		c.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		return c
	};

	/*
		获取DOM位置信息
		obj		对像
		parent	父级节点
		2011年5月20日17:01
	*/
	Util.getPosition = function(obj) {
		if (typeof(obj) === "string") obj = Util.getID(obj);
		var c = 0;
		var d = 0;
		var w = obj.offsetWidth;
		var h = obj.offsetHeight;
		do {
			d += obj.offsetTop || 0;
			c += obj.offsetLeft || 0;
			obj = obj.offsetParent
		}
		while (obj) return {
			x: c,
			y: d,
			width: w,
			height: h
		}
	};

	/*
		计算安全范围
		obj	对像
		2011年5月20日 17:01
	*/
	Util.safeRange = function(obj) {
		if (typeof(obj) === "string") {
			b = Util.getID(obj);
		} else {
			b = obj;
		}
		if (b == null) return;
		var c, d, e, f, g, h, j, k;
		j = b.offsetWidth;
		k = b.offsetHeight;
		p = Util.pageSize();
		c = 0;
		e = p.clientWidth - j;
		g = e / 2;
		d = 0;
		f = p.clientHeight - k;
		var hc = p.clientHeight * 0.382 - k / 2;
		h = (k < p.clientHeight / 2) ? hc : f / 2;
		if (g < 0) g = 0;
		if (h < 0) h = 0;
		return {
			width: j,
			height: k,
			minX: c,
			minY: d,
			maxX: e,
			maxY: f,
			centerX: g,
			centerY: h
		};
	};

	/*
		设定对像位置
		obj		对像
		position	位置
		follow	对像
		fixed:
		callback
		2012年3月5日 9:27:43
	*/
	Util.setPosition = function(obj, o) {
		var a, b = Util.pageSize(),
			c = Util.safeRange(obj),
			d = o.position,
			t = o.fixed === true ? 0 : b.scrollTop;
		if (typeof(obj) === "string") {
			a = Util.getID(obj);
		} else {
			a = obj;
		}
		if (a == null) return;
		if (o.follow != undefined && o.follow != "") {
			s = Util.safeRange(o.follow);
			r = Util.getPosition(o.follow);
			var left = !d.right ? parseInt(d.left) : b.clientWidth - s.width - parseInt(d.right);
			var top = !d.bottom ? parseInt(d.top) : b.clientHeight - s.height - parseInt(d.bottom);
			left1 = r.x + parseInt(d.left); //inside
			left2 = r.x + parseInt(d.left) + s.width; //outside
			right1 = r.x + s.width - c.width - parseInt(d.right); //inside
			right2 = r.x - c.width - parseInt(d.right); //outside
			top1 = r.y + parseInt(d.top); //inside
			top2 = r.y + parseInt(d.top) + s.height; //outside
			bottom1 = r.y + s.height - c.height - parseInt(d.bottom); //inside
			bottom2 = r.y - c.height - parseInt(d.bottom); //outside
			left = !d.right ? (d.lin ? left1 : left2) : (d.rin ? right1 : right2);
			top = !d.bottom ? (d.tin ? top1 : top2) : (d.bin ? bottom1 : bottom2);
			a.style.left = left + "px";
			a.style.top = top + "px";
		} else {
			if (typeof d == "undefined") return;
			if (!d.left && !d.right) {
				a.style.left = c.centerX + "px";
			} else {
				if (!d.right) {
					a.style.left = parseInt(d.left) + "px";
				} else {
					a.style.right = parseInt(d.right) + "px";
				};
			};
			if (!d.top && !d.bottom) {
				a.style.top = c.centerY + t + "px";
			} else {
				if (!d.bottom) {
					a.style.top = parseInt(d.top) + t + "px";
				} else {
					a.style.top = b.clientHeight - a.offsetHeight - parseInt(d.bottom) + "px";
				};
			};
		};
		if (o.callback != "" && $.isFunction(o.callback)) o.callback(this);
	};

	/*
	设定对像位置
	obj		对像
	position	位置
	referID	对像
	2012年3月5日 9:27:43
	*/
	Util.setXY = function(obj, position, referID, fixed) {
		if (!Util.getID(obj)) return;
		var p = Util.pageSize(),
			o = Util.safeRange(obj),
			D = Util.getID(obj);
		if (referID) {
			s = Util.safeRange(referID);
			rp = Util.getPosition(referID);
		}
		var _this = position,
			st = fixed === true ? 0 : p.scrollTop;
		if (referID != undefined && referID != "") {
			var left = !_this.right ? parseInt(_this.left) : p.clientWidth - s.width - parseInt(_this.right);
			var top = !_this.bottom ? parseInt(_this.top) : p.clientHeight - s.height - parseInt(_this.bottom);
			left1 = rp.x + parseInt(_this.left); //inside
			left2 = rp.x + parseInt(_this.left) + s.width; //outside
			right1 = rp.x + s.width - o.width - parseInt(_this.right); //inside
			right2 = rp.x - o.width - parseInt(_this.right); //outside
			top1 = rp.y + parseInt(_this.top); //inside
			top2 = rp.y + parseInt(_this.top) + s.height; //outside
			bottom1 = rp.y + s.height - o.height - parseInt(_this.bottom); //inside
			bottom2 = rp.y - o.height - parseInt(_this.bottom); //outside
			left = !_this.right ? (_this.lin ? left1 : left2) : (_this.rin ? right1 : right2);
			top = !_this.bottom ? (_this.tin ? top1 : top2) : (_this.bin ? bottom1 : bottom2);
			D.style.left = left + "px";
			D.style.top = top + "px";
		} else {
			if (!_this.left && !_this.right) {
				D.style.left = o.centerX + "px";
			} else {
				if (!_this.right) {
					D.style.left = parseInt(_this.left) + "px";
				} else {
					D.style.right = parseInt(_this.right) + "px";
				};
			};
			if (!_this.top && !_this.bottom) {
				D.style.top = o.centerY + st + "px";
			} else {
				if (!_this.bottom) {
					D.style.top = parseInt(_this.top) + st + "px";
				} else {
					D.style.top = p.clientHeight - D.offsetHeight - parseInt(_this.bottom) + "px";
				};
			};
		};
	};

	/*
		iframe自适应高度
		obj	对像
		2011年10月28日 17:01
	*/
	Util.setIframHeight = function(obj) {
		var fun = function(obj) {
			var o = document.getElementById(obj);
			try {
				var a = o.contentWindow.document.body.scrollHeight;
				var b = o.contentWindow.document.documentElement.scrollHeight;
				var h = Math.max(a, b);
				o.height = h;
			} catch (ex) {}
		}
		window.setInterval(fun, 200);
	};

	/*
		将"Date"转化为指定格式的String
		fmt	日期时间
			"yyyy-MM-dd hh:mm:ss.S"		==> 2006-07-02 08:09:04.423
			"yyyy-MM-dd E HH:mm:ss"	==> 2009-03-10 二 20:09:04
			"yyyy-MM-dd EE hh:mm:ss"	==> 2009-03-10 周二 08:09:04
			"yyyy-MM-dd EEE hh:mm:ss"	==> 2009-03-10 星期二 08:09:04
			"yyyy-M-d h:m:s.S"			==> 2006-7-2 8:9:4.18
	*/
	Date.prototype.formatNew = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1,
			//月份
			"d+": this.getDate(),
			//日
			"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
			//小时
			"H+": this.getHours(),
			//小时
			"m+": this.getMinutes(),
			//分
			"s+": this.getSeconds(),
			//秒
			"q+": Math.floor((this.getMonth() + 3) / 3),
			//季度
			"S": this.getMilliseconds() //毫秒
		};
		var week = {
			"0": "\u65e5",
			"1": "\u4e00",
			"2": "\u4e8c",
			"3": "\u4e09",
			"4": "\u56db",
			"5": "\u4e94",
			"6": "\u516d"
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		};
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
		};
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				if (typeof fmt != "undefined") {
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				}
			};
		};
		return fmt;
	};
	//数组原型扩展
	Array.prototype.min = function() {
		return Math.min.apply({}, this);
	};
	Array.prototype.max = function() {
		return Math.max.apply({}, this);
	};
	Array.prototype.inArray = function(str) {
		var k = this.length;
		while (k--) {
			if (this[k] == str) return true;
		};
		return false;
	};
	Array.prototype.removeRepeat = function() {
		var t, b = [],
			_i = this.length;
		for (var i = 0; i < _i - 1; i++) {
			for (var j = i + 1; j < _i; j++) {
				if (this[j] === this[i]) {
					this.splice(j, 1);
					if (this[i] !== t) t = this[i], b.push(this[i]);
					i--, _i--;
				};
			};
		};
		return b;
	};
	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == val) return i;
		};
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		};
	};
	String.prototype.len = function() {
		return this.replace(/[^\x00-\xff]/g, "**").length;
	};
	String.prototype.trim = function(site) {
		switch (site) {
			case "left":
				return this.replace(/(^\s*)/g, "");
			case "right":
				return this.replace(/(\s*$)/g, "");
			case "all":
				return this.replace(/\s/g, "");
			default:
				return this.replace(/(^\s*)|(\s*$)/g, "");
		}
	};
	String.prototype.sub = function(n) {
		var r = /[^\x00-\xff]/g;
		if (this.replace(r, "mm").length <= n) return this;
		// n = n - 3;
		var m = Math.floor(n / 2);
		for (var i = m; i < this.length; i++) {
			if (this.substr(0, i).replace(r, "mm").length >= n) {
				return this.substr(0, i) + "...";
			}
		}
		return this;
	};

	/*
		写入CSS样式
		str	css内容
		2011年5月20日 16:57:30
	*/
	Util.addStyle = function(str) {
		var b = window.style;
		if (!b) {
			b = window.style = document.createElement('style');
			b.setAttribute('type', 'text/css');
			document.getElementsByTagName('head')[0].appendChild(b);
		};
		b.styleSheet && (b.styleSheet.cssText += str) || b.appendChild(document.createTextNode(str));
	};

	/*
		载入CSS文件
		path		路径
		name		文件名称
		2011年5月20日 16:57:00
	*/
	Util.loadCSS = function(path, name) {
		if (!path) return;
		var b = Util.getTag('link');
		for (var c in b) {
			if (b[c].href == path) return
		}
		var link = document.createElement("link");
		link.id = name;
		link.rel = "stylesheet";
		link.media = "screen";
		link.type = "text/css";
		link.href = path;
		Util.getTag("HEAD").item(0).appendChild(link);
	};
	Util.loadCSS(Util.config.JSfile + "../../Styles/Plugins/XY_Dialog.css", "XY_Dialog");

	/*
		载入JS文件
		url		文件路径||object
		callback	加载成功后执行函数
		async 		异步执行
		cache		是否缓存
		chartset	文件编码
		success	回调函数
		2012年08月30日 12:40:52
	*/
	Util.loadJS = function(url, callback, ecall) {
		var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
			script, options, o,
			scriptsArray = [];
		if (typeof url === "object") {
			options = url;
			url = undefined;
		}
		o = options || {};
		url = url || o.url;
		var path = url.split(",");
		callback = callback || o.success;
		for (var i = 0; i < path.length; i++) {
			str = path[i].slice(path[i].lastIndexOf('/') + 1);
			name = str.substring(0, str.indexOf("."));
			script = document.createElement("script");
			script.async = o.async || false;
			script.type = "text/javascript";
			//script.id = name;
			if (o.charset) script.charset = o.charset;
			if (o.cache === false) {
				path[i] = path[i] + (/\?/.test(path[i]) ? "&" : "?") + "time=" + (new Date()).getTime();
			}
			script.src = (path[i].indexOf("/") == '-1' ? true : false) === true ? Util.config.JSfile + path[i] : path[i];
			//head.appendChild(script);
		};
		if ('function' == typeof callback) {
			document.addEventListener ? script.addEventListener("load", function() {
				callback();
				script.onload = null;
				script.parentNode.removeChild(script);
			}, false) : script.onreadystatechange = function() {
				if (/loaded|complete/.test(script.readyState)) {
					callback();
					script.onreadystatechange = null;
				}
			}
		}
		if (ecall) {
			script.onerror = function() {
				script = null;
				if ('function' == typeof ecall) ecall();
			};
		}
	};

	/*
		获取随机字符
		length		长度
		upper		是否允许大写字母
		lower		是否允许小写字母
		number	是否允许数字
		2011年9月30日 16:40:52
	*/
	Util.random = function(length, upper, lower, number) {
		if (!upper && !lower && !number) {
			upper = lower = number = true;
		}
		var a = [
			["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
			["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
			["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
		];
		//临时数组
		var b = [];
		//临时字串
		var c = "";
		b = upper ? b.concat(a[0]) : b;
		b = lower ? b.concat(a[1]) : b;
		b = number ? b.concat(a[2]) : b;
		for (var i = 0; i < length; i++) {
			c += b[Math.round(Math.random() * (b.length - 1))];
		}
		return c;
	};

	/*
		获取URL参数
		key	参数名称
		url	URL链接，默认为当前URL
		2011年9月30日 16:21:22
	*/
	Util.getUrlKey = function(key, url) {
		var url = url ? url : location.href;
		var v = '';
		var o = url.indexOf(key + "=");
		if (o != -1) {
			o += key.length + 1;
			e = url.indexOf("&", o);
			if (e == -1) {
				e = url.length;
			}
			//v = decodeURIComponent(url.substring(o, e));
			v = url.substring(o, e);
		}
		return v;
	};


	/*
		固定定位
		obj	对象名称
		2013年03月11日 12:49:25
	*/
	Util.fixed = function(obj) {
		var o = Util.getID(obj);
		if (!Util.Browser.isIE6) {
			o.style.position = "fixed";
		} else {
			var p = Util.pageSize();
			o.style.position = "absolute";
			o.style.top = Util.getStyle(Util.getID(obj))["top"] != "auto" ? parseInt(Util.getStyle(Util.getID(obj))["top"]) + "px" : p.clientHeight - o.offsetHeight - parseInt(Util.getStyle(Util.getID(obj))["bottom"]) + "px";
			Util.addStyle(".ui_fixed{position:absolute; width:100%; height:1px; z-index: 891201; left:expression(documentElement.scrollLeft+documentElement.clientWidth-this.offsetWidth);top:expression(documentElement.scrollTop)}.body-fixed{background-attachment:fixed;background-image:url(about:blank);}");
			var fixed = $(".ui_dialog_fixed");
			if (fixed.length == 0) {
				var wrap = Util.ce("div");
				wrap.className = 'ui_fixed';
				wrap.appendChild(o);
				document.body.appendChild(wrap);
				$("html").addClass("body-fixed");
			} else {
				$(fixed).append(o)
			};
		};
	};


	/*
		返回信息类型
		ok		成功
		error		出错
		tips		警告
		2011年5月20日 16:57:05
	*/
	Util.callBack = {
		ok: function(text) {
			return "<div class='ui_box_callback clearfix'><span class='ui_box_callback_ok'></span><span class='ui_box_callback_text'>" + text + "</span></div>";
		},
		error: function(text) {
			return "<div class='ui_box_callback clearfix'><span class='ui_box_callback_error'></span><span class='ui_box_callback_text'>" + text + "</span></div>";
		},
		tips: function(text) {
			return "<div class='ui_box_callback clearfix'><span class='ui_box_callback_tips'></span><span class='ui_box_callback_text'>" + text + "</span></div>";
		}
	};

	/*
		Cookie操作
		2012年2月14日 15:10:20
	*/
	Util.cookie = {
		get: function(a) {
			var b = "";
			var c = a + "=";
			var d = document.cookie;
			if (d.length > 0) {
				g = d.indexOf(c);
				if (g != -1) {
					g += c.length;
					f = d.indexOf(";", g);
					if (f == -1) f = d.length;
					b = unescape(d.substring(g, f));
				};
			};
			return b;
		},
		set: function(a, b, t, d, e) {
			var c = "";
			var h = t || 24 * 30;
			if (h != null) {
				c = new Date((new Date()).getTime() + h * 3600000);
				c = "; expires=" + c.toGMTString();
			};
			document.cookie = a + "=" + escape(b) + c + (d ? "; path=" + d : "; path=/") + (e ? ";domain=" + e : "")
		},
		del: function(a) {
			document.cookie = a + "=;path=/;" + "expires=" + (new Date(0)).toGMTString();
		}
	};


	/*
 	@Name:弹出层
	@Author: Await[http://leotheme.cn]
	@Mail: yltfy2008@gmail.com
	@Update：2013/03/05 16:15
 */
	;
	(function($) {
		Util.Dialog = function(o) {
			defaults = $.extend({
				type: "dialog",
				//弹窗类型
				theme: "defaults",
				//主题
				title: "标题",
				//窗口标题文字;
				className: "",
				//样式
				boxID: Util.random(10),
				//弹出层ID;
				referID: "",
				//相对于这个ID的位置进行定位
				content: "text:内容",
				//内容(可选内容为){ text | img | grally | swf | url | iframe};
				width: "",
				//窗口宽度;
				height: "",
				//窗口高度;
				minHeight: "",
				//窗口最小高度;
				time: "",
				//自动关闭等待时间;(单位秒);
				drag: true,
				//是否启用拖动( 默认为启用);
				lock: true,
				//是否限制拖动范围；
				fixed: false,
				//是否开启固定定位;
				showbg: false,
				//是否显示遮罩层( 默认为false);
				showborder: false,
				//是否显示透明边框
				showtitle: true,
				//是否显示弹出层标题( 默认为显示);
				position: "",
				//设定弹出层位置,默认居中;
				arrow: "left",
				//箭头方向
				tips: "",
				//提示层设置（val => 箭头偏移量 | style => 提示层风格 | auto => 提示层位置自适应）
				yesBtn: null,
				noBtn: null,
				minBtn: false,
				maxBtn: false,
				cfns: "",
				//弹出窗关闭后执行的函数;
				ofns: "", //弹出窗打开后执行的函数;
				customBtn: null, //自定义按钮envision;
				beforeClose: "", //envision
				hidden: false
			}, o);
			Util.Dialog.init(defaults);
		};
		$.extend(Util.Dialog, {
			data: {
				box: null,
				winarr: [],
				contentType: "",
				zindex: 870618
			},
			init: function(o) {
				if (Util.getID(o.boxID)) {
					$("#" + o.boxID).parent(".ui_dialog_wrap").show();
					return;
				}
				Util.Dialog.create(o);
				Util.Dialog.loadContent(o);
				Util.Dialog.min(o);
				Util.Dialog.max(o);
				Util.Dialog.restore(o);
				if (o.customBtn) Util.Dialog.customBtn(o); //envision
				if (o.yesBtn) Util.Dialog.yesBtn(o);
				if (o.noBtn) Util.Dialog.noBtn(o);
				if (o.fixed) {
					Util.fixed(o.boxID);
					Util.fixed(o.boxID + "_move_temp");
				}
				if (typeof o.time === "number") {
					setTimeout(function() {
						Util.Dialog.close(o.boxID, o.cfns, o);
					}, o.time);
				};
				if (!Util.Browser.isIE) {
					$(window).resize(function() {
						Util.setPosition(o.boxID, o.position, o.referID, o.fixed);
					});
				};
				$(".ui_btn_close", Util.Dialog.box).on("click", function() {
					if (o.beforeClose != "" && $.isFunction(o.beforeClose)) { //envision
						if (!o.beforeClose(this)) return;
					};
					Util.Dialog.close(o.boxID, o.cfns, o);
					return false;
				});

				var winarr = Util.Dialog.data.winarr;
				Util.Dialog.box.off().on("mousedown", function() {
					this.style.zIndex = Util.Dialog.data.zindex += 1;
					for (var i = 0; i < winarr.length; i++) {
						if (winarr[i][0] == o.boxID) winarr[i][1] = this.style.zIndex;
					};
				});
				document.onkeydown = function(e) {
					e = e || window.event;
					if (e.keyCode == 27) {
						var zindex = [];
						for (var i = 0; i < winarr.length; i++) {
							zindex.push(winarr[i][1]);
						};
						for (var j = 0; j < zindex.length; j++) {
							if (winarr[j][1] == zindex.max()) {
								Util.Dialog.close(winarr[j][0], o.cfns, o);
								zindex.remove(zindex.max());
								if (!o.hidden) {
									winarr.remove(winarr[j]);
								}
							};
						};
						//console.log(winarr)
					};
				};
				$("#XYTipsWindowBg").bind("dblclick", function(e) {
					e = e || window.event;
					var ele = e.srcElement ? e.srcElement : e.target;
					if (!Util.contains(Util.getID(o.boxID), ele)) Util.Dialog.close(o.boxID, o.cfns, o);
				});
			},
			create: function(o) {
				var boxDom = "<div class=\"ui_dialog_wrap\"><div id=\"" + o.boxID + "\" class=\"ui_dialog\">";
				boxDom += "<table class=\"ui_table_wrap\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>";
				boxDom += "<tr><td class=\"ui_border ui_td_00\"></td><td class=\"ui_border ui_td_01\"></td><td class=\"ui_border ui_td_02\"></td></tr>";
				boxDom += "<tr><td class=\"ui_border ui_td_10\"></td><td class=\"ui_td_11\"><table class=\"ui_dialog_main\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>";
				boxDom += "<tr><td><div class=\"ui_title_wrap\"><div class=\"ui_title\"><div class=\"ui_title_text\"><span class=\"ui_title_icon\"></span>" + o.title + "</div><div class=\"ui_btn_wrap\"><span class=\"ui_btn_close\">\u5173\u95ED</span><span class=\"ui_btn_restore\">\u8FD8\u539F</span><span class=\"ui_btn_max\">\u6700\u5927\u5316</span><span class=\"ui_btn_min\">\u6700\u5C0F\u5316</span></div></div></div></td></tr>";
				boxDom += "<tr><td><div class=\"ui_content\" id=\"" + o.boxID + "_content\"></div></td></tr>";
				boxDom += "<tr><td><div class=\"ui_button_wrap\"><div class=\"ui_resize\"></div></div></td></tr></tbody></table>";
				boxDom += "</td><td class=\"ui_border ui_td_12\"></td></tr>";
				boxDom += "<tr><td class=\"ui_border ui_td_20\"></td><td class=\"ui_border ui_td_21\"></td><td class=\"ui_border ui_td_22\"></td></tr></tbody></table>";
				boxDom += "<iframe src=\"about:blank\" class=\"ui_iframe\" style=\"position:absolute;left:0;top:0; filter:alpha(opacity=0);opacity:0; scrolling=no;border:none;z-index:10714;\"></iframe>";
				boxDom += "</div><div class=\"ui_move_temp\" id=\"" + o.boxID + "_move_temp\"></div><div class=\"ui_overlay\" style='left:0px;width:100%;height:100%;min-height:" + $(document).height() + "px;'><iframe src=\"about:blank\" style=\"position:absolute;width:100%;height:" + $(document).height() + "px;filter:alpha(opacity=50);opacity:0.5;scrolling=no;border:none;z-index:870611;\"></iframe></div></div>"; //envision
				$(boxDom).appendTo("body");
				Util.Dialog.box = $("#" + o.boxID);
				Util.Dialog.box.css("zIndex", Util.Dialog.data.zindex += 1).addClass("ui_dialog_restore " + o.className).parent().addClass("ui_dialog_theme_" + o.theme);
				if (o.type == "tips") o.showtitle = false;
				if (o.showtitle != true) {
					$(".ui_title_wrap", Util.Dialog.box).remove();
				};
				if (o.minBtn) {
					Util.Dialog.box.find(".ui_btn_min").css("visibility", "visible");
				}
				if (o.maxBtn) {
					Util.Dialog.box.find(".ui_btn_max").css("visibility", "visible");
				}
				if (o.showbg) {
					Util.Dialog.box.parent().find(".ui_overlay").css("visibility", "visible");
				};
				if (!o.showborder) {
					Util.Dialog.box.find(".ui_border").css({
						width: "0px",
						height: "0px",
						fontSize: "0",
						lineHeight: "0",
						visibility: "hidden",
						overflow: "hidden"
					});
					Util.Dialog.box.find(".ui_resize").css({
						right: "5px",
						bottom: "5px"
					});
					if (o.type == "dialog") Util.Dialog.box.find(".ui_dialog_main").addClass("ui_box_shadow");
				};
				Util.Dialog.setPosition(o);
			},
			loadContent: function(o) {
				var $contentID = $(".ui_content", Util.Dialog.box),
					winarr = Util.Dialog.data.winarr;
				var tipsDom = "<em class=\"ui_arrow arrow-" + o.arrow + "\" style=\"z-index:1;\"></em><span class=\"ui_arrow arrow-" + o.arrow + "-in\" style=\"z-index:2;\"></span><i class=\"ui_tips_close\">x</i>";
				Util.Dialog.data.contentType = $contentType = o.content.substring(0, o.content.indexOf(":"));
				$content = o.type == "tips" ? "<div class='ui_tips_content'><i class=\"ui_tips_content_ico\"></i>" + o.content.substring(o.content.indexOf(":") + 1, o.content.length) + "</div>" + tipsDom : o.content.substring(o.content.indexOf(":") + 1, o.content.length);
				Util.Dialog.data.contentTypeID = $content;
				$.ajaxSetup({
					global: false
				});
				var _width = o.width,
					_height = o.height,
					_minHeight = o.minHeight;
				$contentID.css({
					width: _width,
					height: _height,
					'min-height': _minHeight
				});
				var dragBox;
				if (o.drag) dragBox = true;
				var drag = function() {
					winarr.push([o.boxID, Util.getID(o.boxID).style.zIndex, $contentID.width(), $contentID.height()]);
					if (!dragBox) return;
					var safe = Util.safeRange(o.boxID);
					var tempBox = safe.width > 400 || safe.height > 300 ? ".ui_move_temp" : "";
					
					Util.drag({
						obj: o.boxID,
						handle: ".ui_title_text",
						lock: o.lock,
						fixed: o.fixed,
						temp: tempBox
					});
					
				};
				switch ($contentType) {
					case "text":
						$contentID.html($content);
						Util.Dialog.setPosition(o);
						drag();
						if (o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
						break;
					case "id":
						$("#" + $content).children().appendTo($contentID);
						Util.Dialog.setPosition(o);
						drag();
						if (o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
						break;
					case "img":
						$.ajax({
							beforeSend: function() {
								$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />");
								Util.Dialog.setPosition(o);
							},
							error: function() {
								$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
								Util.Dialog.setPosition(o);
							},
							success: function(html) {
								Util.loadJS("XY_Img.js", function() {
									Util.Img.ready($content, function() {
										$contentID.addClass("ui_hark_imgBug").removeClass("ui_loading").html("<img src=" + $content + " alt='' />");
										Util.Dialog.setPosition(o);
										drag();
									});
								});
								if (o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
							}
						});
						break;
					case "swf":
						$.ajax({
							beforeSend: function() {
								$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />");
								Util.Dialog.setPosition(o);
							},
							error: function() {
								$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
								Util.Dialog.setPosition(o);
							},
							success: function(html) {
								Util.loadJS("XY_Swf.js", function() {
									$contentID.removeClass("ui_loading").html("<div id='" + o.boxID + "swf'><h1>Alternative content</h1><p><a href=\"http://www.adobe.com/go/getflashplayer\"><img src=\"http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\" alt=\"Get Adobe Flash player\" /></a></p></div><script type=\"text/javascript\">swfobject.embedSWF('" + $content + "', '" + o.boxID + "swf', '" + o.width + "', '" + o.height + "', '9.0.0', 'expressInstall.swf');</script>");
									$("#" + o.boxID + "swf").css({
										position: "absolute",
										left: "0",
										top: "0",
										textAlign: "center"
									});
									Util.Dialog.setPosition(o);
									drag();
								});
								if (o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
							}
						});
						break;
					case "url":
						var contentDate = $content.split("?");
						$.ajax({
							beforeSend: function() {
								$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />");
								Util.Dialog.setPosition(o);
							},
							type: contentDate[0],
							url: contentDate[1],
							data: contentDate[2],
							error: function() {
								$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
								Util.Dialog.setPosition(o);
							},
							success: function(html) {
								$contentID.removeClass("ui_loading").html(html);
								Util.Dialog.setPosition(o);
								drag();
								if (o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
							}
						});
						break;
					case "iframe":
						$contentID.css({
							overflowY: "hidden"
						});
						$.ajax({
							beforeSend: function() {
								$contentID.addClass("ui_loading").html("<img src='" + Util.config.JSfile + "loading.gif' class='ui_box_loading' alt='\u52A0\u8F7D\u4E2D...' />")
								Util.Dialog.setPosition(o);
							},
							error: function() {
								$contentID.removeClass("ui_loading").html("<p class='ui_box_error'><span class='ui_box_callback_error'></span>\u52A0\u8F7D\u6570\u636E\u51FA\u9519！</p>");
								Util.Dialog.setPosition(o);
							},
							success: function(html) {
								$contentID.removeClass("ui_loading").html("<iframe src=\"" + $content + "\" style=\"width:100%;height:100%;\" id=\"" + o.boxID + "frame\" scrolling=\"auto\" frameborder=\"0\"></iframe>");
								$("#" + o.boxID + "frame").bind("load", function() {
									var frame = document.getElementById(o.boxID + "frame");
									if (o.width == "" || o.height == "") {
										try {
											frame = frame.contentWindow.document, width = Math.max(frame.body.scrollWidth, frame.documentElement.scrollWidth), height = Math.max(frame.body.scrollHeight, frame.documentElement.scrollHeight);
											Util.Dialog.box.find(".ui_content").css({
												width: width + "px",
												height: height + "px"
											});
										} catch (_) {};
									} else {
										Util.Dialog.box.find(".ui_content").css({
											width: _width + "px",
											height: _height + "px"
										});
									};
									Util.Dialog.setPosition(o);
									drag();
									if (o.ofns != "" && $.isFunction(o.ofns)) o.ofns(this);
								});
							}
						});
				};
			},
			setPosition: function(o) {
				Util.setPosition(o.boxID, {
					follow: o.referID,
					position: o.position,
					fixed: o.fixed
				});
				var safe = Util.safeRange(o.boxID);
				$(".ui_iframe", Util.Dialog.box).css({
					width: safe.width + "px",
					height: safe.height + "px"
				});
				if (o.type == "tips") {
					var t = o.tips,
						mode = o.arrow == "left" || o.arrow == "right" ? "top" : "left";
					var val = t.val || "10";
					var style = t.style || "default";
					var radius = t.radius || "0";
					var auto = t.auto || true;
					Util.Dialog.box.find(".ui_button_wrap").hide().end().find(".ui_dialog_main").css({
						border: "none",
						background: "none"
					}).find(".ui_content").addClass("ui_tips_style_" + style).css({
						borderRadius: radius + "px",
						textAlign: "left"
					}).find(".ui_arrow").css(mode, val + "px").end().find(".ui_tips_close").click(function() {
						Util.Dialog.close(o.boxID, o.cfns, o);
					});
					var ob = Util.getPosition(o.boxID),
						//rp = Util.getPosition(o.referID),
						s = Util.safeRange(o.referID),
						st = document.body.scrollTop || document.documentElement.scrollTop;
					switch (o.arrow) {
						case "left":
							Util.Dialog.box.css({
								left: ob.x + 8 + "px",
								top: ob.y + "px"
							});
							if (auto = true && p.clientWidth - ob.x < Util.Dialog.box.outerWidth()) {
								Util.Dialog.box.css({
									left: rp.x - Util.Dialog.box.outerWidth() - 8
								}).find("em.ui_arrow").removeClass("arrow-left").addClass("arrow-right").end()
								find("span.ui_arrow").removeClass("arrow-left-in").addClass("arrow-right-in");
							};
							break;
						case "right":
							Util.Dialog.box.css({
								left: ob.x - 10 + "px",
								top: ob.y + "px"
							});
							if (auto = true && ob.x < 0) {
								Util.Dialog.box.css({
									left: rp.x + s.width + 8
								}).find("em.ui_arrow").removeClass("arrow-right").addClass("arrow-left").end()
								find("span.ui_arrow").removeClass("arrow-right-in").addClass("arrow-left-in");
							};
							break;
						case "bottom":
							Util.Dialog.box.css({
								left: ob.x + "px",
								top: ob.y - 8 + "px"
							});
							if (auto = true && ob.y < 0) {
								Util.Dialog.box.css({
									top: rp.y + s.height + 8
								}).find("em.ui_arrow").removeClass("arrow-bottom").addClass("arrow-top").end().find("span.ui_arrow").removeClass("arrow-bottom-in").addClass("arrow-top-in");
							};
							break;
						case "top":
							Util.Dialog.box.css({
								left: ob.x + "px",
								top: ob.y + 8 + "px"
							});
							if (auto = true && p.clientHeight - ob.y + st < Util.Dialog.box.outerHeight()) {
								Util.Dialog.box.css({
									top: rp.y - Util.Dialog.box.outerHeight() - 8
								}).find("em.ui_arrow").removeClass("arrow-top").addClass("arrow-bottom").end().find("span.ui_arrow").removeClass("arrow-top-in").addClass("arrow-bottom-in");
							};
							break;
					};
				};
			},
			yesBtn: function(o) {
				var fn = o.yesBtn[1] ||
					function() {},
					text = o.yesBtn[0] || "\u786E\u5B9A";
				var yesBtnDom = "<button class=\"ui_box_btn ui_box_btn_yes\">" + text + "</button>";
				Util.Dialog.box.find(".ui_button_wrap").append(yesBtnDom);
				if (fn != "" && $.isFunction(fn)) {
					Util.Dialog.box.find(".ui_box_btn_yes").click(function() {
						var f = fn();
						if (f != false) Util.Dialog.close(o.boxID, o.cfns, o); // 如果回调函数返回false则不关闭对话框
					});
				};
			},
			noBtn: function(o) {
				var fn = o.noBtn[1] ||
					function() {},
					text = o.noBtn[0] || "\u53D6\u6D88";
				var noBtnDom = "<button class=\"ui_box_btn ui_box_btn_no\">" + text + "</button>";
				Util.Dialog.box.find(".ui_button_wrap").append(noBtnDom);
				if (fn != "" && $.isFunction(fn)) {
					Util.Dialog.box.find(".ui_box_btn_no").click(function() {
						var f = fn();
						if (f != false) Util.Dialog.close(o.boxID, o.cfns, o); // 如果回调函数返回false则不关闭对话框
					});
				};
			},
			customBtn: function(o) { //envision
				var fn = o.customBtn[1] || function() {},
					text = o.customBtn[0] || "";
				var customBtnDom = "<button class=\"ui_box_btn ui_box_btn_custom\">" + text + "</button>";
				Util.Dialog.box.find(".ui_button_wrap").append(customBtnDom);
				if (fn != "" && $.isFunction(fn)) {
					Util.Dialog.box.find(".ui_box_btn_custom").click(function() {
						var f = fn();
						if (f != false) Util.Dialog.close(o.boxID, o.cfns, o); // 如果回调函数返回false则不关闭对话框
					});
				};
			},
			hide: function(o) { //envision
				var _this = $("#" + o.boxID);
				_this.parent('.ui_dialog_wrap').hide();
				return false;
			},
			show: function(o) { //envision
				var _this = $("#" + o.boxID);
				_this.parent('.ui_dialog_wrap').show();
				return false;
			},
			min: function(o) {
				var _this = $("#" + o.boxID);
				$(".ui_btn_min", _this).on("click", function() {
					_this.find(".ui_content").css({
						width: "0",
						height: "0",
						display: "none",
						visibility: "hidden"
					}).end().find(".ui_button_wrap").hide();
					var safe = Util.safeRange(o.boxID);
					$(".ui_iframe", _this).css({
						width: safe.width + "px",
						height: safe.height + "px"
					});
					_this.addClass("ui_dialog_min").removeClass("ui_dialog_restore ui_dialog_max");
					if (o.drag) Util.config.drag = true;
					return false;
				});
			},
			max: function(o) {
				var _this = $("#" + o.boxID);
				$(".ui_btn_max", _this).on("click", function() {
					var p = Util.pageSize();
					w = p.clientWidth - (o.showborder ? 10 : 2);
					h = p.clientHeight - (o.showtitle ? 34 : 2) - (o.button ? 36 : 0);
					_this.find(".ui_content").css({
						width: w + "px",
						height: h + "px"
					});
					Util.Dialog.setPosition(o);
					_this.addClass("ui_dialog_max").removeClass("ui_dialog_restore ui_dialog_min");
					if (o.drag) {
						Util.config.drag = false;
						_this.find(".ui_title_text").css("cursor", "default");
					}
					return false;
				});
			},
			restore: function(o) {
				var _this = $("#" + o.boxID);
				var winarr = Util.Dialog.data.winarr;
				$(".ui_btn_restore", _this).on("click", function() {
					for (var i = 0; i < winarr.length; i++) {
						if (o.boxID == winarr[i][0]) {
							_this.find(".ui_content").css({
								width: winarr[i][2] + "px",
								height: winarr[i][3] + "px",
								display: "block",
								visibility: "visible"
							}).end().find(".ui_button_wrap").show();
							Util.Dialog.setPosition(o);
							_this.addClass("ui_dialog_restore").removeClass("ui_dialog_min ui_dialog_max");
						};
					};
					if (o.drag) {
						Util.config.drag = true;
						_this.find(".ui_title_text").css("cursor", "move");
					};
					return false;
				});
			},
			close: function(obj, cfns, o) {
				if (typeof obj === "string") {
					box = $("#" + obj);
				} else {
					alert("\u8BF7\u6307\u5B9A\u5F39\u51FA\u7A97\u53E3\u7684ID！");
					return;
				};
				if (box.length != 0) {
					if (Util.Dialog.data.contentType == "id") {
						box.find(".ui_content").children().appendTo($("#" + Util.Dialog.data.contentTypeID));
					};
					if (typeof data_pick_id != 'undefined' && obj == data_pick_id) box.parent().hide(); //envision
					else if (obj == 'popup_yaxis_set_id') box.parent().hide(); //envision
					else {
						if (o && o.hidden) {
							box.parent().hide();
						} else {
							box.parent().find("iframe").remove();
							Util.clearIframe();
							box.parent().remove();
						}
					}
					if (!o || !o.hidden) {
						$("#XYTipsWindowBg").animate({
							opacity: "0"
						}, 100, function() {
							$(this).remove();
						});
						for (var i = 0; i < Util.Dialog.data.winarr.length; i++) {
							if (obj == Util.Dialog.data.winarr[i][0]) Util.Dialog.data.winarr.remove(Util.Dialog.data.winarr[i]);
						};
					}

					if (cfns != "" && $.isFunction(cfns)) {
						cfns(this);
					};
				};
			}
		});
		Util.drag = function(o) {
			var defaults = {
				obj: "",
				handle: "",
				lock: true,
				lockX: false,
				lockY: false,
				fixed: false,
				parent: "",
				temp: "",
				dstar: function() {},
				dmove: function() {},
				dstop: function() {}
			};
			var o = $.extend(defaults, o);
			var _x, _y, _d, otemp,
				mx = my = 0,
				_this = $("#" + o.obj);
			Util.config.drag = true;
			_d = o.handle != "" ? $(o.handle, _this) : _this;
			_d.css("cursor", "move");
			_d.mousedown(function(ev) {
				if (!Util.config.drag) return;
				safe = Util.safeRange(o.obj);
				tempBox = _this.parent().find(o.temp);
				s = Util.pageSize();
				otemp = o.temp != "" ? tempBox : _this;
				star(ev);
				if (o.obj.setCapture) {
					o.obj.setCapture();
				} else if (window.captureEvents) {
					window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
				};
				$(document).bind("mousemove", function(ev) {
					move(ev);
				});
				$(document).bind("mouseup", function(ev) {
					stop(ev);
				});
			});
			if (o.fixed) o.parent = "";
			if (o.parent != "") $("#" + o.parent).css("position", "relative");
			var star = function(ev) {
					ev = ev || window.event;
					ev.preventDefault();
					p = Util.getPosition(o.obj);
					ny = o.fixed ? Util.Browser.isIE6 ? s.scrollTop : 0 : 0;
					mx = ev.clientX - p.x;
					my = ev.clientY - p.y + ny;
					if (o.temp != "") {
						otemp.css({
							left: p.x + "px",
							top: p.y + ny + "px",
							width: safe.width + "px",
							height: safe.height + "px",
							display: "block"
						});
					};
					if (o.dstar != "" && $.isFunction(o.dstar)) o.dstar(this);
					_this.addClass("ui_drag_start").removeClass("ui_drag_move ui_drag_stop");
				},
				move = function(ev) {
					var parent;
					ev = ev || window.event;
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
					Util.clSelect();
					_x = ev.clientX - mx;
					_y = ev.clientY - my;
					if (o.parent != "") {
						parent = Util.getPosition(o.parent);
						op = Util.getPosition(o.obj);
						_x = ev.clientX - mx - parent.x;
						_y = ev.clientY - my - parent.y;
					};
					maxX = o.parent != "" ? parent.width - op.width : safe.maxX;
					maxY = o.parent != "" ? parent.height - op.height : safe.maxY;
					if (o.lockX) _y = p.y;
					if (o.lockY) _x = p.x;
					if (o.lock) {
						if (_x <= 0) _x = safe.minX;
						if (_x >= maxX) _x = maxX;
						if (o.fixed) {
							if (_y <= 0) _y = safe.minY;
							if (_y >= maxY) _y = maxY;
						} else {
							if (_y > maxY + s.scrollTop) _y = maxY + s.scrollTop;
							if (_y < s.scrollTop) _y = s.scrollTop;
						};
					};
					otemp.css({
						left: _x + "px",
						top: _y + "px"
					});
					_this.addClass("ui_drag_move").removeClass("ui_drag_start ui_drag_stop");
					if (o.dmove != "" && $.isFunction(o.dmove)) o.dmove(this);
				},
				stop = function(ev) {
					if (o.temp != "" && Util.config.drag) {
						otemp.css("display", "none");
						_this.css({
							left: _x + "px",
							top: _y + "px"
						});
					};
					_this.addClass("ui_drag_stop").removeClass("ui_drag_start ui_drag_move");
					$(document).unbind("mousemove");
					if (o.obj.releaseCapture) {
						o.obj.releaseCapture();
					} else if (window.captureEvents) {
						window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					}
					if (o.dstop != "" && $.isFunction(o.dstop)) o.dstop(this);
				};
		};
	})($)
	module.exports = Util;
});