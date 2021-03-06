
(function($) {
	/*
	 * relevance
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 親子の関連チェック
	 */
	// 親子の関連チェック
	$.relevance = function(options) {

		function CheckRelevance (options) {
			var parent = options.parent, // 親のセレクタ
				children = options.children, // 子のセレクタ
				clazz = options.clazz; // クラス名

			// 親が選択された場合は、子をすべて選択する。
			this.checkChildren = function () {
				if (clazz) {
					if (parent.hasClass(clazz)) {
						children.addClass(clazz);
					}
					else {
						children.removeClass(clazz);
					}
				} else {
					if (parent.is(':checked')) {
						children.attr('checked', 'checked');
					}
					else {
						children.removeAttr('checked');
					}
				}
			};

			// 子がすべて選択された場合は、親を選択する。
			this.checkParent = function () {
				if (clazz) {
					var isAllSelect = _.all(children, function (date) {
						return $(date).hasClass(clazz);
					});

					if (isAllSelect) {
						parent.addClass(clazz);
					}
					else {
						parent.removeClass(clazz);
					}
				} else {
					var isAllSelect = _.all(children, function (date) {
						return $(date).is(':checked');
					});

					if (isAllSelect) {
						parent.attr('checked', 'checked');
					}
					else {
						parent.removeAttr('checked');
					}
				}
			};
		}
		return new CheckRelevance(options);
	};
})(jQuery);


(function($) {
	/*
	 * checkRelevance
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 「すべてにチェック」をクリックした際に、親子関連チェックを行う
	 */
	$.fn.checkRelevance = function(options) {
		// デフォルト値
		var defaults = {
			clazz : null,
			parentCallback: null,
			childCallback: null
		};

		// 引数に値が存在する場合、デフォルト値を上書きする
		var settings = $.extend(defaults, options);

		$(this).each(function() {
			var that = $(this),
				childclass = that.data('childclass'),
				children = $(childclass),
				checkRelevance = $.relevance({parent: that, children: children, clazz: settings.clazz});
			that.click(function(e) {
				e.stopPropagation();
				var self = $(this);
				if (settings.clazz) {
					e.preventDefault();
					if(self.hasClass(settings.clazz)) {
						self.removeClass(settings.clazz);
					} else {
						self.addClass(settings.clazz);
					}
				}
				
				checkRelevance.checkChildren();

				if (settings.parentCallback) {
					settings.parentCallback({parent: that, children: children, self: $(this)});
				}
			});
			children.each(function() {
				$(this).click(function(e) {
					e.stopPropagation();
					var self = $(this);
					if (settings.clazz) {
						e.preventDefault();
						if(self.hasClass(settings.clazz)) {
							self.removeClass(settings.clazz);
						} else {
							self.addClass(settings.clazz);
						}
					}
					
					checkRelevance.checkParent();

					if (settings.childCallback) {
						settings.childCallback({parent: that, children: children, self: $(this)});
					}
				});
			});
			checkRelevance.checkParent();
		});
	};
})(jQuery);

/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
(function($){
/*
 * mLightBox
 *
 * Copyright (c) 2010 hisasann at teamLab
 *
 * Require Library:
 * 　jquery.js 1.3.2
 *
 * Options:
 * 　mLightBoxId - LightBoxとして表示させたい要素ID
 * 　duration - LightBoxの表示速度
 * 　easing - LightBoxのeasingタイプ
 * 　zIndex - LightBoxのz-index値
 * 　callback - コールバック関数を指定してください、型はfunctionです
 * 　
 * Description:
 * 　マイナビバイト用の簡易的なLightBox機能を提供します
 * 　
 * Browser:
 *  Windows - IE6.0, IE7.0, IE8.0, Firefox3.5, Safari3.1, Opera9.6
 *  Mac - Firefox3.5, Safari5, Opera9.6
 *
 */

var options = {
		mLightBoxId: null,
		duration: null,
		easing: null,
		zIndex: null,
		callback: function(){},
		resizebeforeback: function(){},
		closecallback: function(){},
		inBoxOpacity: 1,
		inBoxEffect: function(){this.show();}
	},

	// default z-index
	DEFAULT_ZINDEX = 1000,

	// default duration
	DEFAULT_DURATION = 100,

	// default easing type
	DEFAULT_EASING = "swing",

	// overlay element id
	overlayId = "jquery-mLightBox-overlay"

	;

$.mLightBox = function(opts){
	$.extend(options, opts);
	$.ui.mLightBox(this, options);
}

$.ui = $.ui || {};

$.ui.mLightBox = function(container, options){
	_hideSelectBox();

	var winDimension = ___getPageSize();

	// overlay
	var overlay = $("<div>")
		.attr("id", overlayId)
		.css({
			position: "absolute", top: "0px", left: "0px",
			backgroundColor: "#000000", opacity: "0",
			width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px",
			zIndex: options.zIndex || DEFAULT_ZINDEX
		})
		.click(function(){
			close(options.closecallback);
		})
		.appendTo("body")
		.animate({opacity: 0.4}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING
		});

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize(overlay, mLightBox);
}

$.mLightBox.changeLayer = function(opts){
	$(options.mLightBoxId).hide();
	$.extend(options, opts);

	// mLightBox
	var mLightBox = $(options.mLightBoxId);

	animation(mLightBox, __elemOffset(mLightBox));

	__winResize($(overlayId), mLightBox);
}

$.mLightBox.close = function(fn) {
	close(fn);
}

function close(fn){
	// overlay
	$("#" + overlayId)
		.animate({
			opacity: 0
		}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				_showSelectBox();
				$(this).remove();
		}
	});

	// mLightBox
	$(options.mLightBoxId)
		.animate({ opacity: 0 }, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				$(this).hide();
				(fn || function(){}).apply(this, arguments);
		}
	});
}

function __winResize(overlay, mLightBox) {
	$(window).resize(function(){
		options.resizebeforeback();

		// overlay
		var winDimension = ___getPageSize();
		overlay.css({width: winDimension.pageWidth + "px", height: winDimension.pageHeight + "px"});

		// mLightBox
		var offset = __elemOffset(mLightBox);
		mLightBox.css({top: offset.top, left: offset.left});
	});
}

// LigithBox animate!!
function animation(element, offset) {
	element
		.css({
			opacity: options.inBoxOpacity,
			left: offset.left + "px", top: offset.top,
			zIndex: (options.zIndex || DEFAULT_ZINDEX) + 1 });
	options.inBoxEffect.apply(element, arguments);
	element
		.animate({ opacity: 1}, {
			duration: options.duration || DEFAULT_DURATION,
			easing: options.easing || DEFAULT_EASING,
			complete: function(){
				options.callback.apply(this, arguments);
				$(this).find("input:first").focus();
			}
		});
}

/**
 * getPageSize() by hisasann.com
 *
 */
function ___getPageSize() {
	// スクロール領域を含むwidth
	var pageWidth  = 0;
	if ($.browser.safari) {
		pageWidth = document.body.scrollWidth;
	} else {
		pageWidth = document.documentElement.scrollWidth;
	}

	// スクロール領域を含むheight
	var pageHeight = 0;
	if ($.browser.safari) {
		pageHeight = document.body.scrollHeight;
	} else {
		pageHeight = document.documentElement.scrollHeight;
	}

	// 画面に表示されている領域のwidth
	var windowWidth = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;

	// 画面に表示されている領域のheight
	var windowHeight = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;

	return {
		pageWidth: pageWidth, pageHeight: pageHeight,
		winWidth: windowWidth, winHeight: windowHeight
	};
}

function __elemOffset(element) {

	var top = Math.floor($(window).scrollTop() + ($(window).height() - $(element).height()) / 2);
	if ($(window).height() < $(element).height()) {
		top = Math.floor($(window).scrollTop());
	}
	var left = Math.floor($(window).scrollLeft() + ($(window).width() - $(element).width()) / 2);
	if ($(window).width() < $(element).width()) {
		left = Math.floor($(window).scrollLeft());
	}
	
	return {
		top: top,
		left: left
	};
}

// ie6 require
var display = [];
function _hideSelectBox() {
	if($.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			display[index] = $(this).css("visibility");
			$(this).css("visibility", "hidden");
		});
	}
}

function _showSelectBox() {
	if($.browser.msie && $.browser.version == 6){
		$("select").each(function(index, elem){
			$(this).css("visibility", display[index]);
		});
	}
}

})(jQuery);

(function($) {
/*
 * makeUri
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメインを除去し、getパラメータを分割します。
 */
$.makeUri = function(href, addParam){
	var url =  $.rejectDomain(href);

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);		// #より前の部分のURLを抽出

	idx = url.indexOf("?");
	var uri = (idx < 0) ? url : url.substr(0, idx);	// ?より前の部分のURLを抽出

	// すでにgetパラメータがあるならそのまま配列に突っ込む
	var param = (idx < 0) ? [] : url.substr(idx + 1).split("&");

	// 追加したいgetパラメータをpushする
	if (addParam) {
		for (var i=0,len=addParam.length; i<len; ++i) {
			param.push(addParam[i]);
		}
	}

	return { uri: uri, param: param }
};

})(jQuery);


(function($) {
/*
 * rejectDomain
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLからドメイン部分を除去します。
 */
$.rejectDomain = function(url){
	if(!url) return null;

	var idx;

	idx = url.indexOf("/");
	if(idx == 0) return url;

	var baseurl = [location.protocol, "//", location.host].join('');
	idx = url.indexOf(baseurl);

	if(idx != 0) return "";

	return url.substr(baseurl.length);
};

})(jQuery);

(function($) {
/*
 * rejectFragmentId
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * URLから#以降、?以降を除去します。
 */
$.rejectFragmentId = function(url){
	if(!url) return null;

	var idx;
	idx = url.indexOf("#");
	url = (idx < 0) ? url : url.substr(0, idx);

	idx = url.indexOf("?");

	return (idx < 0) ? url : url.substr(0, idx);
};

})(jQuery);

(function($) {
/*
 * uriParamJoin
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * paramがある場合は?を、paramが複数ある場合は&で繋ぐ
 */
$.uriParamJoin = function(url, param){
	var addParam = $.compact(param);

	return addParam.length > 0 ? [url, addParam.join("&")].join("?") : url;
};

})(jQuery);


(function($){
/*
 * compact
 *
 * Copyright (c) 2012 hisasann at teamLab
 *
 * Description:
 * 配列からnull、undefine、""を除去します。（もっとDeepな感じのほうが便利かな？）
 */

$.compact = function(object) {
	if (object.constructor != Array) { return }

	var ret = new Array();
	for (var i=0,len=object.length; i<len; ++i) {
		if (object[i] !== null && object[i] !== undefined && object[i] !== "") {
			ret.push(object[i]);
		}
	}

	return ret;
}

})(jQuery);



/*
 * mypageMenu
 *
 * Copyright (c) 2012 iseyoshitaka at teamLab
 *
 * Description:
 * マイページメニューを表示します。
 *
 * Sample:
 * 	$('.shoeMenu').mypageMenu();
 *
 */
(function($){

    $.fn.mypageMenu = function(options, callbackfunc) {

    	var menuPanel = null;
    	
        var settings = $.extend({
	            url: null
	        }, options);

        var init = function(obj) {

			var page = $.mobile.activePage || $('body');
			//var topPos = obj.offset().top + obj.height();
			var topPos = 40;

        	menuPanel = $('<div class="mypageMenu"></div>')
							.css('top', topPos + 'px')
							.css('right', '0px')
							.css('width', '98%')
        					.css('position', 'absolute')
        					.css('-webkit-box-shadow', '-2px 2px 2px #aaaaaa')
        					.css('box-shadow', '-2px 2px 2px #aaaaaa')
        					.css('border-bottom', '2px solid #b4b4b4')
        					.css('background', '#ffffff')
        					.css('z-index', '9999')
        					.hide()
        					.appendTo('body');

			replaceHtml(settings.url, function(obj2) {
	    		// コールバック
	    		if (_.isFunction(callbackfunc)) {
	    			callbackfunc(obj2);
	    		}
			});

			// マイページ表示時に背景画面クリック時に閉じる。
			var page = $.mobile.activePage || $('body').find('.page');
			page.bind('vclick', function(e) {
				if ( menuPanel.is(':visible')) {
					e.preventDefault();
					menuPanel.slideUp(100);
					e.stopPropagation();
				}
			});

			// 共通パネル開閉ボタン
			obj.bind('vclick', function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (menuPanel.is(':visible')) {
					menuPanel.slideUp(100);
				} else {
					menuPanel.slideDown(100);
				}
			});

        };
    	
		var replaceHtml = function (url, callback) {

//			// Ajax通信を行う
//			$.ajax({
//				type: 'GET',
//				url : url,
//				cache : false,
//				dataType : 'html',
//				success: function(data){
//					menuPanel.empty().html(data);
//		        	$.mobile.hidePageLoadingMsg();
//				},
//				error: function(XHR, textStatus, errorThrown) {
//				},
//		        complete: function (XHR, textStatus) {
//
//		    		// コールバック
//		    		if (_.isFunction(callback)) {
//		    			callback(menuPanel);
//		    		}
//		    		
//		        }
//			});

			var data = $([
				'<aside class="boxNews" data-clipcount="${totalClipCnt}">',
					'<h3>履歴</h3>',
					'<ul class="listTop04">',
						'<li class="clearfix">',
							'<div class="text">',
								'<p class="name">XXXXXX</p>',
								'<dl class="txtCaption">',
									'<dt>【会場エリア】</dt>',
									'<dd>XXXXXXXXXXXXXXXXXXXXXXX</dd>',
									'<dt>【会場タイプ】</dt>',
									'<dd>XXXXXXXXXXXXXXXXXXXXXXX</dd>',
									'<dt>【ゲスト人数】</dt>',
									'<dd>XXXXXXXXXXXXXXXXXXXXXXX</dd>',
								'</dl>',
							'</div>',
						'</li>',
					'</ul>',
				'</aside>'
				].join(''));
				menuPanel.empty().html(data);

		}

		this.changePage = function(url, callbackfunc2) {
			replaceHtml(url, function(obj2) {
	    		// コールバック
	    		if (_.isFunction(callbackfunc2)) {
	    			callbackfunc2(obj2);
	    		}
			});
		};
		
		this.each(function() {
			init($(this))
		});
		
		return this;
	};

})(jQuery);


(function($) {
	/*
	 * mynavislider
	 * Copyright (c) 2013 iseyoshitaka
	 *
	 * Description:
	 *  画像スライダー
	 *
	 * Sample:
	 * var slider1 = $('.js-mynavislider').mynavislider({
	 * 	'parentKey': 'ul',
	 * 	'childKey': 'li',
	 * 	'carousel': true,
	 * 	'backBtnKey': '.back',
	 * 	'nextBtnKey': '.next',
	 * 	'slideCallBack': function(data) {
	 * 		slider1.find('.pageNo').text(data.pageNo + '/' + data.maxPageNo);
	 * 	}
	 * });
	 * slider1.find('.changePage').click(function(e) {
	 * 	e.preventDefault();
	 * 	slider1.changePage($(this).data('pageno'), $.fn.mynavislider.ANIMATE_TYPE.SLIDE);
	 * });
	 * 
	 */
	$.fn.mynavislider = function(options) {

		var screen = null // 処理対象エリア
			,	ul = null // 親要素
			,	li = null // 子要素
			,	back = null // 前ページボタン
			,	next = null // 次ページボタン
			,	pos = 0 // 子要素のインデックス
			,	pageNo = 1 // 現在のページ番号
			,	maxPageNo = 1 // 最大のページ番号
			,	liwidth = 0 // 子要素１つの横幅
			,	nowLoading = false // 処理中かどうか
			,	dragw = 0 // スワイプした横幅
			,	childKey = null
			,	shift = null
			,	margin = 0
			,	dispCount = 0
			,	shiftw = 0
			,	animateType = null
			,	slideSpeed = null
			,	carousel = null
			,	slideCallBackFunc = null
			,	resizeCallBackFunc = null
			,	isAutoSlide = null
			,	autoSlideInterval = null
			,	hoverPause = null
			,	isMouseDrag = null
			,	reboundw = null
			,	moment = false
			,	isFullScreen = false
			,	heightMaxScreen = false
			,	diffMoveMode = false; // 通常はページ番号の差分で移動距離を算出しますが、このモードがtrueの場合は間の子要素の数で移動距離を算出します。

		var params = $.extend({}, $.fn.mynavislider.defaults, options);

		// jQueryオブジェクトキャッシュ、初期設定を行う
		var init = function(obj) {
			screen = $(obj);
			ul = screen.find(params.parentKey);
			li = ul.find(params.childKey);
			back = $(params.backBtnKey);
			next = $(params.nextBtnKey);
			dispCount = params.dispCount || params.shift;
			childKey = params.childKey;
			animateType = params.animateType;
			isAutoSlide = params.autoSlide;
			autoSlideInterval = params.autoSlideInterval;
			hoverPause = params.hoverPause;
			isMouseDrag = params.isMouseDrag;
			reboundw = params.reboundw;
			moment = params.moment;
			slideSpeed = params.slideSpeed;
			shift = params.shift;
			margin = params.margin;
			carousel = params.carousel;
			isFullScreen = params.isFullScreen;
			heightMaxScreen = params.heightMaxScreen;
			slideCallBackFunc = params.slideCallBack;
			resizeCallBackFunc = params.resizeCallBack;

			ul.find(childKey).each(function(i) {
				$(this).attr('pageno', (i+1));
			});

			if (heightMaxScreen) {
				// 画像縦幅を端末サイズに合わせる為オリジナル画像サイズが必要になる。画像を事前にロードしておく。
				var photos = ul.find(childKey).find('img');
				var photoLength = photos.length;
				photos.each(function() {
					var photo = $(this),
						imagePath = photo.attr('src') || '';
					var img = $('<img>');
					img
						.load(function() {
							photo.attr('owidth', img[0].width);
							photo.attr('oheight', img[0].height);
							if (photoLength !== 1) {
								photoLength--;
								return;
							}
							photos.unbind('load');
							// 画像のロードが完了したらスタート
							exec();
						});
					img.attr('src', imagePath);
				});
			} else {
				exec();
			}

			function exec() {
				if (isFullScreen) {
					// スライド幅＝画面横幅いっぱい
					fullScreen();
				} else if (params.shiftw) {
					// スライド幅＝指定した幅固定
					liwidth = Math.ceil(params.shiftw/shift);
					shiftw = params.shiftw;
				} else {
					// スライド幅＝子要素横幅✕１ページに表示する子要素の数
					liwidth = li.width();
					shiftw = liwidth * shift;
				}
				maxPageNo = Math.ceil(li.size()/shift);

				// １ページの場合はスライド不要の為、カルーセルは強制OFFとする。
				if (maxPageNo <= 1) {
					carousel = false;
					isMouseDrag = false;
				}

				if (carousel) {
					// カルーセルの初期設定を行う
					initCarousel();
					pos = li.size()/2;
				} else {
					// ページングボタンの表示制御
					showArrows();
					pos = shift;
				}

				// ulタグの横幅を調整する
				ul.css('width', shiftw * li.size() / shift)
					.css('position', 'relative');

				li.css('float', 'left');

				// 各種イベントの設定
				bindEvent();
				
				// スライダーを設定したよっていうマークを付ける。
				screen.addClass('slider-set-end');
			};
		};

		// 後処理
		var after = function() {
			if (carousel) {
				doCarousel();
			}

			nowLoading = false;
			dragw = 0;
			
			// コールバック
			slideCallBack();
		};

		// 各種イベントの設定
		var bindEvent = function() {

			// スワイプでのページングを可能にする
			if (isMouseDrag) {
				bindMouseDragEvent();
			}

			// ボタンクリックでのページングを可能にする
			bindPagingEvent();

			// 自動でのページングを可能にする
			if (isAutoSlide) {
				autoSlide.init();
			}

		}

		// 指定したページに移動する
		var slide = function(move, animateType) {

			if (!animateType) {
				animateType = ANIMATE_TYPE.NO;
			}

			// 子要素が１つの場合は処理しない
			if (maxPageNo <= 1) {
				after();
				return;
			}

			// カルーセルでない場合は、次ページが存在しないと処理しない
			if (!carousel) {
				if ((move < 0 && pageNo === 1) || (0 < move && pageNo === maxPageNo)) {
					after();
					return;
				}
			}

			nowLoading = true;

			// 現在のオフセット位置と移動後のオフセット位置を設定
			var from = 0;
			if (carousel) {
				from = -1 * (pos/shift) * shiftw - dragw;
			} else {
				from = -1 * (pos-shift)/shift * shiftw - dragw;
			}
			var to = from - (shiftw * move) + dragw;

			// 移動後の子要素のインデックスを設定
			pos = pos + (shift * move);

			// ページ番号を設定
			if (diffMoveMode) {
				if (carousel) {
					pageNo = parseInt($(li[pos]).attr('pageno'));
				} else {
					pageNo = parseInt($(li[(pos-shift)]).attr('pageno'));
				}
			} else {
				pageNo = pageNo + move;
				if (pageNo < 1) {
					pageNo = pageNo + maxPageNo;
				} else if (maxPageNo < pageNo) {
					pageNo = pageNo - maxPageNo;
				}
			}

			// ページングボタンの表示制御
			if (!carousel) {
				showArrows();
			}

			if (animateType === ANIMATE_TYPE.NO) {
				// アニメーションを利用せずに画像を切り替える。
				if (1 < maxPageNo && carousel) {
					ul.css('left', '-' + (pos * liwidth) + 'px');
				} else {
					ul.css('left', '-' + ((pos - shift) * liwidth) + 'px');
				}
				after();
			} else if (animateType === ANIMATE_TYPE.SLIDE) {
				// スライドで画像を切り替える。（Androidで負荷が大きいため、jQueryのアニメーションは利用しない)
				(function() {
					var self = this;

					var elem = ul[0];
					var begin = +new Date();
					var duration = slideSpeed;
					var easing = function(time, duration) {
						return -(time /= duration) * (time - 2);
					};
					var timer = setInterval(function() {
						var time = new Date() - begin;
						var _pos, _now;
						if (time > duration) {
							clearInterval(timer);
							_now = to;
							elem.style.left = _now + 'px';

							after();
							return;
						}
						else {
							_pos = easing(time, duration);
							_now = _pos * (to - from) + from;
						}
						elem.style.left = _now + 'px';
					}, 10);
				})();
			} else if (animateType === ANIMATE_TYPE.FADE) {
				// フェードで画像を切り替える。
				ul.animate({'opacity': 0 }, 300, function() {
					if (1 < maxPageNo && carousel) {
						ul.css('left', '-' + (pos * liwidth) + 'px').animate({'opacity': 1}, 300);
					} else {
						ul.css('left', '-' + ((pos - shift) * liwidth) + 'px').animate({'opacity': 1}, 300);
					}
					after();
				});
			}

		};

		// 次へ、前へボタンの表示・非表示を切り替える
		var showArrows = function() {
			// 1ページしかない場合
			if (maxPageNo <= 1) {
				next.hide();
				back.hide();
			// 左端
			} else if (pageNo === 1) {
				next.show();
				back.hide();
			// 右端
			} else if (pageNo === maxPageNo) {
				back.show();
				next.hide();
			} else {
				back.show();
				next.show();
			}
		};

		// カルーセル用に両端に番兵を作成する
		var initCarousel = function() {

			// 最終ページに空きが出来る場合は空のLIダグを追加する。例）｜○○○｜○○○｜○○○｜○  ｜
			var addSize = li.size()%shift;
			if (addSize !== 0) {
				for (var i=0, len=shift-addSize;i<len;i++) {
					ul.append(ul.find(childKey).filter(':first').clone(true).empty().css('width', liwidth).css('height', li.height()));
				}
				// liを再キャッシュ
				li = ul.find(childKey);
			}

			ul
				.append(li.clone(true).addClass('cloned'))
				.css('left', '-' + (liwidth*(li.size())) + 'px');

			// liを再キャッシュ
			li = ul.find(childKey);
		};

		// カルーセル
		var doCarousel = function() {
			// 左端
			if (pos <= 0) {
				pos = (li.size()/2);
				ul.css('left', '-' + (liwidth*pos) + 'px');
			// 右端
			} else if ((li.size()-shift - (dispCount - shift)) <= pos) {
				var range = pos - (li.size()-shift - (dispCount - shift));
				pos = (li.size()/2)-shift - (dispCount - shift) + range;
				ul.css('left', '-' + (liwidth*pos) + 'px');
			}
		};

		// ボタンクリックでのページングを可能にする
		var bindPagingEvent = function() {
			// 左方向へスライドする
			back.click(function(e) {
				e.preventDefault();
				backPage();
			});

			// 右方向へスライドする
			next.click(function(e) {
				e.preventDefault();
				nextPage();
			});
		};

		// スワイプでのページングを可能にする
		var bindMouseDragEvent = function() {
			var isTouch = ('ontouchstart' in window);
			// 慣性を利用するかどうか
			var momentObject = (moment) ? new MomentObject(ul[0]) : null;
			ul.bind({
				// タッチの開始、マウスボタンを押したとき
				'touchstart mousedown': function(e) {
					if (nowLoading) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					nowLoading = true;

					// 自動スライドのタイマーをリセットする。
					if (autoSlide.on) {
						autoSlide.restart();
					}

					// 開始位置を覚えておく
					this.pageX= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);
					this.pageY= ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY);
					this.left = parseInt($(this).css('left'));
					if(isNaN(this.left)) {
						this.left = $(this).position().left;
					}
					this.top = parseInt($(this).css('top'));
					if(isNaN(this.top)) {
						this.top = $(this).position().top;
					}
					this.startLeft = this.left;
					
					this.touched = true;

					// 慣性を利用してスワイプする。
					if (moment) {
						momentObject._position = momentObject.positionize();
						momentObject.dragStart(event);
					}

				},
				// タッチしながら移動、マウスのドラッグ
				'touchmove mousemove': function(e) {

					if (!this.touched) {
						return;
					}

					var x = (this.pageX - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX));
					var y = (this.pageY - ((isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY));

					if (Math.abs(x) < 5 || 200 < Math.abs(y)) {
						// スワイプさせない
						return;
					} else {
						// スワイプさせる
						event.preventDefault();
						event.stopPropagation();
					}
					
					if (!carousel) {
						// １ページ目は右にスワイプさせない。
						if (0 < (this.left - x)) {
							return;
						}
						// 最後のページは左にスワイプさせない
						if ((this.left - x) <= -1 * ((maxPageNo-1) * shiftw)) {
							return;
						}
					}

					// 移動先の位置を取得する
					this.left = this.left - x;

					// 慣性を利用する場合は、移動速度を計算する
					if (moment) {
						momentObject.dragMove(event);
					}

					// 画像を移動させる
					$(this).css({left:this.left});

					// 位置 X,Y 座標を覚えておく
					this.pageX = ((isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX);

				},
				// タッチの終了、マウスのドラッグの終了
				'touchend mouseup touchcancel': function(e) {
					if (!this.touched) {
						return;
					}
					this.touched = false;

					var self = this;
					
					// 残りの移動処理
					var restMove = function (movew) {

						// スワイプ中（touchmove mousemove）で移動したページ量
						var movePage = Math.floor(Math.abs(movew)/shiftw);
						if (movePage != 0) {
							if (movew < 0) {
								movePage = movePage * -1;
							}
							// ページ番号
							pageNo = pageNo + movePage;
							if (pageNo < 1) {
								pageNo = pageNo + maxPageNo;
							} else if (maxPageNo < pageNo) {
								pageNo = pageNo - maxPageNo;
							}
							pos = pos + (shift * movePage);
							if (carousel) {
								// 左端
								if (pos <= 0) {
									pos = (li.size()/2);
									ul.css('left', '-' + (liwidth*pos) + 'px');
									pageNo = 1;
									slide(0, ANIMATE_TYPE.NO);
									return;
								// 右端
								} else if ((li.size()-shift - (dispCount - shift)) <= pos) {
									var range = pos - (li.size()-shift - (dispCount - shift));
									pos = (li.size()/2)-shift - (dispCount - shift) + range;
									ul.css('left', '-' + (liwidth*pos) + 'px');
									pageNo = maxPageNo;
									slide(0, ANIMATE_TYPE.NO);
									return;
								}
							}
						}

						var restw = Math.abs(movew) % shiftw;
						if (movew < 0) {
							// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
							if ((restw < reboundw) || (!carousel && ((pageNo <= 1 && movew < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
								var from = self.startLeft - movew;
								var to = self.startLeft - (shiftw * movePage);
								rebound(from, to);
							} else {
								var p = pageNo - 1;
								if (!carousel && p <= 1) {
									p = 1;
								}
								// 前ページ
								dragw = movew - (shiftw * movePage);
								// 移動するページ量
								var move = p - pageNo;
								slide(move, ANIMATE_TYPE.SLIDE);
							}
						} else if (0 < movew) {
							// 一定幅以上スワイプしていない場合は、跳ね返り処理を行う。
							if ((restw < reboundw) || (!carousel && ((pageNo <= 1 && movew < 0) || (maxPageNo <= pageNo && 0 < dragw)))) {
								var from = self.startLeft - movew;
								var to = self.startLeft - (shiftw * movePage);
								rebound(from, to);
							} else {
								var p = pageNo + 1;
								if (!carousel && maxPageNo <= p) {
									p = maxPageNo;
								}
								// 次ページ
								dragw = movew - (shiftw * movePage);
								// 移動するページ量
								var move = p - pageNo;
								slide(move, ANIMATE_TYPE.SLIDE);
							}
						} else {
							// 何もしない
							nowLoading = false;
						}
					}

					// リバウンド処理
					var rebound = function(from, to) {
						var elem = ul[0];
						var begin = +new Date();
						var duration = slideSpeed;
						var easing = function(time, duration) {
							return -(time /= duration) * (time - 2);
						};
						var timer = setInterval(function() {
							var time = new Date() - begin;
							var _pos, _now;
							if (time > duration) {
								clearInterval(timer);
								_now = to;
								elem.style.left = _now + 'px';

								slide(0, ANIMATE_TYPE.NO);
							}
							else {
								_pos = easing(time, duration);
								_now = _pos * (to - from) + from;
							}
							elem.style.left = _now + 'px';
						}, 10);
					}

					if (moment) {
						momentObject.onstop = function (obj) {
					    	// 慣性で動いた分を加算する
							var movew = self.startLeft - self.left + obj.momentw;
							restMove(movew);
					    }
						momentObject.dragEnd(event);
					} else {
						var movew = self.startLeft - self.left;
						restMove(movew);
					}
				    
				}
			});
		};

		// 自動スライド
		var autoSlide = this.autoSlide = new (function() {
			var timer = null;
			this.on = false;
			this.init = function() {
				start();
				if (hoverPause) {
					$(ul).hover(function() {
						stopTimer();
					}, function() {
						startTimer();
					});
				}
			};
			this.restart = function() {
				stopTimer();
				startTimer();
			};
			var start = this.start = function() {
				autoSlide.on = true;
				startTimer();
			};
			function startTimer() {
				if (!autoSlide.on) {
					return;
				}
				timer = setTimeout(function() {
					clearInterval(timer);
					slide(1, animateType);
					startTimer();
				} , autoSlideInterval);
			}
			var stop = this.stop = function() {
				stopTimer();
				autoSlide.on = false;
			};
			function stopTimer() {
				if (!autoSlide.on) {
					return;
				}
				clearInterval(timer);
				timer = null;
			}
		})();

		// 子要素をフルスクリーンで表示します。
		var fullScreen = function() {
			// スライダーの表示幅を調整します。
			var changeDisplay = function() {
				
				// 子要素の横幅を端末のwidthに設定
				ul.find(childKey).width(Math.ceil($(window).width() /dispCount) - Math.ceil(margin/dispCount));
				
				if (heightMaxScreen) {
					ul.find(childKey).height($(window).height());
					ul.find(childKey).each(function() {
						var li = $(this),
							img = li.find('img');

						var x = Math.floor(img.attr('oheight') * $(window).width() / img.attr('owidth'));
						var margin = Math.floor(($(window).height() - x) / 2);
						if (0 <= margin) {
							img.height('').width('100%');
						} else {
							img.height('100%').width('');
						}
						
					});
				}
				
				liwidth = ul.find(childKey).width();
				shiftw = (liwidth + margin) * shift;
				ul.css('width', shiftw * li.size() / shift);

				pos = li.size()/2;
				ul.css('left', '-' + (liwidth*(li.size())) + 'px');
			};
			var resizeCallBack = function() {
				if (resizeCallBackFunc) {
					var data = {};
					data.pageNo = pageNo;
					data.maxPageNo = maxPageNo;
					if (carousel) {
						data.obj = $(li[pos]);
					} else {
						data.obj = $(li[(pos-shift)]);
					}
					resizeCallBackFunc(data);
				}
			};
			// 画面が回転された場合
			$(this).on('orientationchange',function(){
				changeDisplay();

				// リサイズ時は、コールバックは呼ばない。
				var workPageNo = pageNo;
				var workSlideCallBackFunc = slideCallBackFunc;
				slideCallBackFunc = null;
				pageNo = 1;
				changePage(workPageNo);
				slideCallBackFunc = workSlideCallBackFunc;

				resizeCallBack();
			});
			// 画面がリサイズされた場合
			$(this).resize(function() {
				changeDisplay();

				// リサイズ時は、コールバックは呼ばない。
				var workPageNo = pageNo;
				var workSlideCallBackFunc = slideCallBackFunc;
				slideCallBackFunc = null;
				pageNo = 1;
				changePage(workPageNo);
				slideCallBackFunc = workSlideCallBackFunc;

				resizeCallBack();
			});
			changeDisplay();
		};

		// コールバック
		var slideCallBack = function() {
			if (slideCallBackFunc) {
				var data = {};
				data.pageNo = pageNo;
				data.maxPageNo = maxPageNo;
				if (carousel) {
					data.obj = $(li[pos]);
				} else {
					data.obj = $(li[(pos-shift)]);
				}
				slideCallBackFunc(data);
			}
		};
		

		// 慣性を利用してスライドする
		var MomentObject = function (element) {
			this.element = element;
			this._position = this.positionize();
			this.reset();
		}
		MomentObject.prototype = {
			constructor: MomentObject,
			damping : 15,
			_isDragging: false,
			__position : Vector2.zero,
			_velocity : Vector2.zero,
			_prevTime : 0,
			_prevPosition: Vector2.zero,
			_prevVelocity: Vector2.zero,
			_loopTimer: null,

			positionize: function () {
				var rect = this.element.getBoundingClientRect();
				var x = rect.left;
				var y = rect.top;
				return new Vector2(x, y);
			},

			positionizeByEvent: function (e) {
				var isTouch = ('ontouchstart' in window);
				var x = (isTouch && event.changedTouches) ? event.changedTouches[0].pageX : e.pageX;
				var y = (isTouch && event.changedTouches) ? event.changedTouches[0].pageY : e.pageY;
				return new Vector2(x, y);
			},
			dragStart: function (evt) {
				this.reset();
				this._prevTime	 = Date.now();
				this._prevPosition = this.positionizeByEvent(evt);
				this._isDragging   = true;
			},
			dragMove: function (evt) {
				if (!this._isDragging) {
					return;
				}

				var now = Date.now();
				var deltaTime = now - this._prevTime;
				var eventPos = this.positionizeByEvent(evt);
				var deltaPosition = Vector2.sub(eventPos, this._prevPosition);
				var velocity = Vector2.divisionScalar(deltaPosition, (deltaTime || (deltaTime = 1)));
				var deltaVelocity = Vector2.sub(velocity, this._prevVelocity);

				this._velocity.add(deltaVelocity);
				this._position = Vector2.add(this._position, deltaPosition);

				this._prevTime = now;
				this._prevPosition = eventPos;
				this._prevVelocity = velocity;
			},
			dragEnd: function (evt) {
				this._isDragging = false;
				this.dragRelease();
			},
			dragRelease: function () {
				var _this = this;
				var zero = Vector2.zero;
				var past = Date.now();
				
				var startLeft = _this._position.x;
				
				(function loop() {
					_this.dampingVelocity();
					var now   = Date.now();
					var delta = now - past;
					_this._position = Vector2.add(_this._position, Vector2.multiplyScalar(_this._velocity, delta));
					
					// 画像を移動させる
					$(_this.element).css({left:_this._position.x});

					var isFirst = false;
					if (0 <= _this._position.x) {
						isFirst = true;
					}
					var isLast = false;
					if (_this._position.x <= (-1 * (maxPageNo * (carousel ? 2 : 1) * shiftw) + shiftw)) {
						isLast = true;
					}
					// 先頭に到達、最後に到達、慣性での動作が停止 の何れかの場合
					if (isFirst || isLast || _this._velocity.equal(zero)) {
						_this.reset();

						// 慣性の移動量
						var obj = {
								momentw : startLeft - _this._position.x
						};
						
						_this.stop(obj);
						return;
					}

					past = now;
					_this._loopTimer = setTimeout(loop, 16);
				}());
			},
			dampingVelocity: function () {
				var damping = Vector2.divisionScalar(this._velocity, this.damping);
				this._velocity.sub(damping);
				if (this._velocity.lessThen(0.05)) {
					this._velocity = Vector2.zero;
				}
			},
			reset: function () {
				clearTimeout(this._loopTimer);
				this._velocity = Vector2.zero;
				this._prevVelocity = Vector2.zero;
				this._prevPosition = Vector2.zero;
			},
			
			stop: function (obj) {
				this.onstop && this.onstop(obj);
			}
		};

		// Vector2
		function Vector2(x, y) {
			this.x = x;
			this.y = y;
		}
		Object.defineProperties(Vector2, {
			'zero': {
				enumerable: true,
				set: function (val) {},
				get: function () { return new Vector2(0, 0); }
			}
		});
		Vector2.prototype = {
			constructor: Vector2,

			add: function (vec) {
				this.x += vec.x;
				this.y += vec.y;
				return this;
			},
			sub: function (vec) {
				this.x -= vec.x;
				this.y -= vec.y;
				return this;
			},
			multiplyScalar: function (val) {
				this.x *= val;
				this.y *= val;
				return this;
			},
			divisionScalar: function (val) {
				this.x /= val;
				this.y /= val;
				return this;
			},
			length: function () {
				return Math.sqrt((this.x * this.x) + (this.y * this.y));
			},
			lessThen: function (val) {
				return (this.length() <= val);
			},
			equal: function (vec) {
				return (this.x === vec.x && this.y === vec.y);
			},
			copy: function () {
				return new Vector2(this.x, this.y);
			}
		};
		Vector2.add = function (vec1, vec2) {
			var x = vec1.x + vec2.x;
			var y = vec1.y + vec2.y;
			return new Vector2(x, y);
		};
		Vector2.sub = function (vec1, vec2) {
			var x = vec1.x - vec2.x;
			var y = vec1.y - vec2.y;
			return new Vector2(x, y);
		};
		Vector2.multiplyScalar = function (vec, val) {
			var x = vec.x * val;
			var y = vec.y * val;
			return new Vector2(x, y);
		};
		Vector2.divisionScalar = function (vec, val) {
			var x = vec.x / val;
			var y = vec.y / val;
			return new Vector2(x, y);
		};

		/* Public  */

		// 前ページを表示します。
		var backPage = this.backPage = function(callback) {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(-1, animateType);
			if (callback) {
				callback();
			}
		}

		// 次ページを表示します。
		var nextPage = this.nextPage = function(callback) {
			if (nowLoading) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			slide(1, animateType);
			if (callback) {
				callback();
			}
		}

		// 指定したページを表示します。
		var changePage = this.changePage = function(page, animateType) {
			var page = parseInt(page) || 1;
			if (maxPageNo < page) {
				return;
			}
			// 自動スライドのタイマーをリセットする。
			if (autoSlide.on) {
				autoSlide.restart();
			}
			// 移動するページ量
			var move = 0;
			if (diffMoveMode) {
				if (page !== pageNo) {
					var moveR = (ul.find(params.childKey+'[pageno="'+pageNo+'"]:eq(0)').nextUntil(ul.find(params.childKey+'[pageno="'+page+'"]:eq(0)')).length+1);
					var moveL = -1 * (ul.find(params.childKey+'[pageno="'+page+'"]:eq(0)').nextUntil(ul.find(params.childKey+'[pageno="'+pageNo+'"]:eq(0)')).length+1);
					if (Math.abs(moveR) < Math.abs(moveL)) {
						move = moveR;
					} else {
						move = moveL;
					}
				}
			} else {
				move = page - pageNo;
			}
			slide(move, animateType);
		}

		// 最大ページなどの情報をリフレッシュする。（スライドコールバックで次ページ要素をAjax取得してLIに追加した場合などはこれを利用してページ情報を最新化する）
		// 引数：現在ページ、最大ページ、現在ページの左に追加した要素数
		var refresh = this.refresh = function (page, max, leftAddCnt) {
			// 子要素をリキャッシュ
			li = ul.find(params.childKey);
			if (li.size() === 1) {
				// スライド幅＝子要素横幅✕１ページに表示する子要素の数
				liwidth = li.width();
				shiftw = liwidth * shift;
			}
			// 親要素のwidthを再計算
			ul.width(ul.width()+(li.size() * liwidth) + 'px');
			if (carousel) {
				diffMoveMode = true;
				if (max) {
					maxPageNo = parseInt(max);
				} else{
					maxPageNo = Math.ceil(li.size()/2/shift);
				}
				if (leftAddCnt) {
					pos = pos + leftAddCnt;
					ul.css('left', '-' + (pos * liwidth) + 'px');
				}
				if (page) {
					// コールバックは一次的に呼ばない。
					var workSlideCallBackFunc = slideCallBackFunc;
					slideCallBackFunc = null;
					changePage(page);
					slideCallBackFunc = workSlideCallBackFunc;
				}
			} else {
				if (max) {
					maxPageNo = parseInt(max);
				} else{
					maxPageNo = Math.ceil(li.size()/shift);
				}
				showArrows();
			}
		};

		// ボタンクリックやスワイプ時の処理を一次的に停止/開始する。
		var suspend = this.suspend = function(suspendFlg) {
			if (!suspendFlg) {
				nowLoading = false;
			} else {
				nowLoading = true;
			}
		}

		// 処理開始
		$(this).each(function() {
			init(this);
		});

		return this;
	};

	// アニメーションの種類
	var ANIMATE_TYPE = $.fn.mynavislider.ANIMATE_TYPE = {
		NO: 0,
		SLIDE: 1,
		FADE: 2
	};

	// デフォルト値
	$.fn.mynavislider.defaults = {
			'parentKey': 'ul' // 親要素
		,	'childKey': 'li' // 子要素
		,	'shift': 5 // １ページでスライドさせる子要素の数
		,	'dispCount': null // １ページに表示する子要素の数(shiftで指定した値と異なる場合にのみ指定する。例：１ページ５要素表示するがスライドは１要素づつ移動する場合など)
		,	'shiftw': null // １ページでにスライドさせる幅(子要素にmarginなどの余白が指定されている場合に、自動で幅が算出できないためこれを指定する。)
		,	'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類（なし、スライド、フェード）
		,	'slideSpeed': 300 // スライド速度
		,	'carousel': false // １ページ目または、最終ページに到達した場合に、ローテートさせるかどうか
		,	'backBtnKey': '#gallery-back' // 次ページボタンのセレクタ
		,	'nextBtnKey': '#gallery-next' // 前ページボタンのセレクタ
		,	'autoSlide': false // 自動でスライドさせるどうか
		,	'autoSlideInterval':  5000 // 自動でスライドさせる間隔(ミリ秒)
		,	'hoverPause':  false // 子要素上にマウスオーバーすると自動スライドを一時停止する。
		,	'isMouseDrag': false // スワイプでのページングを可能にするかどうか
		,	'reboundw': 50 // スワイプ時に跳ね返りを行う幅
		,	'moment': false // スワイプ時に慣性を利用するかどうか
		,	'isFullScreen': false // 画面横幅いっぱいに画像を表示するかどうか
		,	'margin': 0 // 子要素間のマージン(isFullScreenで画面横幅いっぱいに表示した場合で子要素間にマージンが設定されている場合に利用する)
		,	'heightMaxScreen': false // 画像縦幅が画面縦幅よりも大きい場合は画面縦幅いっぱいに表示する（拡大写真パネルにて利用。isFullScreen がtrueの場合のみ有効）
		,	'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はこれを利用してカスタマイズする)
		,	'resizeCallBack': null // 画面リサイズ（または回転）後に処理を行うコールバック
	};

})(jQuery);

/*
 * slideMenu
 *
 * Copyright (c) 2012 iseyoshitaka at teamLab
 *
 * Description:
 * スライドメニューを表示します。
 *
 * Sample:
 * 	$.slideMenu({target: '.showCommonMenuPanel', dispTarget: '.commonMenuPanel', width: '95%'});
 *
 */
(function($){

	$.slideMenu = function(options) {

		var slideDiv = null,
			menu = null,
			nowLoading = false;

		var settings = $.extend({
				speed: 100,
				easing: 'easeInOutCirc',
				direction: 'left',
				target: null,
				dispTarget: null,
				width: '80%'
			}, options);

		// 初期化
		_init();

		function _init() {

			var page = $.mobile.activePage || $('body');

			if($('body').find('#pageslide').length === 0 ) {
				slideDiv = $('<div />').attr('id', 'pageslide')
										  .css('display', 'none')
										  .css('width', settings.width)
										  .css('top', 0)
										  .css('z-index', 9999)
										  .css('position', 'absolute')
										  .css('background-color', '#ffffff')
										  .appendTo('body');
				menu = $('body').find(settings.dispTarget).css('height', '100%').show();
				slideDiv.empty().append(menu);
			}

			page.bind('vclick', function(e) {
				if ( slideDiv.is(':visible')) {
					e.preventDefault();
					e.stopPropagation();
					close();
				}
			});

			// 画面が回転された場合
			$(window).bind('orientationchange',function(){
				var slideWidth = slideDiv.outerWidth(true);

				if (!slideDiv.is(':visible')) {
					return;
				}

				var page = $.mobile.activePage || $('body');
				page.css('margin-left', '-' + slideWidth + 'px');
			});

		}

		// アイコンクリック時
		$(document).delegate(settings.target, 'vclick', function(e) {
			e.preventDefault();
			e.stopPropagation();

			if ( slideDiv.is(':visible')) {
				close();
			} else {
				open();
			}
		});

		// スライドを開く
		var open = function() {
			var bodyAnimateIn = {},
				slideAnimateIn = {},
				slideWidth = slideDiv.outerWidth(true);


			if( slideDiv.is(':visible') || nowLoading ) {
				return;
			}
			nowLoading = true;

			// アドレスバーを初期非表示にする
			window.scrollTo(0,0);

			switch( settings.direction ) {
				case 'left':
					slideDiv
					  .css('height', $(document).height())
					  .css({ left: 'auto', right: '-' + slideWidth + 'px' });
					bodyAnimateIn['margin-left'] = '-=' + slideWidth;
					slideAnimateIn['right'] = '+=' + slideWidth;
					break;
				default:
					slideDiv.css({ left: '-' + slideWidth + 'px', right: 'auto' });
					bodyAnimateIn['margin-left'] = '+=' + slideWidth;
					slideAnimateIn['left'] = '+=' + slideWidth;
					break;
			}

			var page = $.mobile.activePage || $('body');

			page
				.css('position', 'static')
				.animate(bodyAnimateIn, settings.speed, settings.easing, function() {
					page.css('position', 'fixed');
				});
			slideDiv.css('height', menu.height());
			slideDiv.show()
				.animate(slideAnimateIn, settings.speed, settings.easing, function() {
					nowLoading = false;
				});
		};

		// スライドを閉じる
		var close = function() {
			var bodyAnimateIn = {},
				slideAnimateIn = {},
				slideWidth = slideDiv.outerWidth(true);

			if( slideDiv.is(':hidden') || nowLoading ) {
				return;
			}
			nowLoading = true;

			switch(settings.direction) {
				case 'left':
					bodyAnimateIn['margin-left'] = '+=' + slideWidth;
					slideAnimateIn['right'] = '-=' + slideWidth;
					break;
				default:
					bodyAnimateIn['margin-left'] = '-=' + slideWidth;
					slideAnimateIn['left'] = '-=' + slideWidth;
					break;
			}

			var page = $.mobile.activePage || $('body');
			
			slideDiv.animate(slideAnimateIn, settings.speed, settings.easing);
			page
				.css('position', 'static')
				.animate(bodyAnimateIn, settings.speed, settings.easing, function() {
					slideDiv.hide();
					nowLoading = false;
				});

		}

	};

})(jQuery);

(function($){
	/*
	 * validate
	 *
	 * Copyright (c) 2012 iseyoshitaka at teamLab
	 *
	 * Description:
	 * 入力をチェックする
	 * 
	 * var validate = [
	 *     {type: 'date', value: [$('.SSR002_15_applyStartDate').val()], args: ['適用期間(開始)']},
	 *     {type: 'date', value: [$('.SSR002_15_applyEndDate').val()], args: ['適用期間(終了)']}
	 * ];
	 * var errors = $.validate(validate);
	 * if (0 < errors.length) {
	 *     alert(errors.join('\n'));
	 *     return false;
	 * }
	 *
	 */
	$.validate = function(targets) {
		var messages = [];
		for (var i=0, len=targets.length; i<len; i++) {
			var target = targets[i];

			// 日付チェック
			if (target.type === 'date' && 0 < target.value.length && target.value[0] && target.value[0] !== '' && !checkDate(target.value[0])) {
				messages.push({text: '{0}は日付でなければいけません。', args: target.args});
			}

			// 未来日チェック
			if (target.type === 'dateGeNow' && 0 < target.value.length && target.value[0] !== '' && checkDate(target.value[0])) {
				var now = new Date();
				var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				if (new Date(target.value[0]).getTime() < today.getTime()) {
					messages.push({text: '{0}は現在日付の以降の日付を入力してください。', args: target.args});
				}
			}

			// 日付範囲チェック
			if (target.type === 'dateRange' && 1 < target.value.length && checkDate(target.value[0]) && checkDate(target.value[1])) {
				if (new Date(target.value[1]).getTime() < new Date(target.value[0]).getTime()) {
					messages.push({text: '{0}は日付の範囲が正しくありません。', args: target.args});
				}
			}

			// 数値範囲チェック
			if (target.type === 'numRange' && 1 < target.value.length && !isNaN(target.value[0]) && !isNaN(target.value[1])) {
				if (Number(target.value[1]) < Number(target.value[0])) {
					messages.push({text: '{0}は数字の範囲が正しくありません。', args: target.args});
				}
			}
			
		}
		return formatMessage(messages);
	};
	
	function checkDate(target) {

		if (!target) {
			return false;
		}

		var ret = false;
	
		// 入力日付のフォーマットチェック yyyy/mm/dd
		var result = target.match(/^([0-9]{4})\/([0-9]{1,2})\/([0-9]{1,2})$/);
	
		if(result){
				// 日付としての妥当性チェック
				var yy = parseInt(result[1],10);
				var mm = parseInt(result[2],10);
				var dd = parseInt(result[3],10);
				
				// 月はゼロ基数なので、1引く
				// ここでは、2009-15-24 など、あり得ない数値を入れても、
				// Date的にはエラーにならず、繰り上がった数値として処理される。
				// そこで、入力値が正しいかどうかを、入力値とDateの結果とを比較し、
				// 繰り上がった＝Invalid な値として処理する。
				var d = new Date(yy,(mm - 1),dd);
				
				if((d.getFullYear() == yy) &&
						(d.getMonth() == (mm - 1)) &&
						(d.getDate() == dd)){
					// 正常な入力
					ret = true;
				}else{
					// 範囲外
				}
		}else{
			// マッチしない
		}
		return ret;
	}
	
	// メッセージを生成する。
	function formatMessage(datas) {
		var messages = [];
		for (var i=0, len=datas.length; i<len; i++) {
			var data = datas[i],
				text = data.text,
				args = data.args;
			var format = function (text, args) {
				for (var i=0, len=args.length; i<len; i++) {
					var reg = new RegExp('\\{' + (i) + '\\}', 'g');
					text = text.replace(reg, args[i]);
				}
				return text;
			};
			messages.push(format(text, args));
		}
		return messages;
	}
	
})(jQuery);


(function($){
	/*
	 * zoomPhotoPanel
	 *
	 * Copyright (c) 2014 iseyoshitaka at teamLab
	 *
	 * Description:
	 * マイナビウエディング拡大写真パネルを生成する
	 *
	 * Sample:
	 * $('.js-zoomPhotoPanel').zoomPhotoPanel({}, function() {});
	 */

	$.fn.zoomPhotoPanel = function(options) {

		var params = $.extend({}, $.fn.zoomPhotoPanel.defaults, options);

		var panel = null,
			screen = null,
			targetClass = null,
			animateType = null,
			originalSize = null,
			imageUrl = null,
			slideSpeed = null,
			easing = null,
			carousel = null,
			autoSlide = null,
			autoSlideInterval = null,
			hoverPause = null,
			slideCallBack = null,
			openCallBack = null,
			isFullScreen = null,
			showClip = false,
			sendGa = false,
			defaultScrollTop = 0;

		var className = "zoomPhotoPanel";
		
		// 初期設定
		var init = function(obj) {

			var panel = null,
				screen = $(obj),
				targetClass = params.targetClass,
				animateType = params.animateType,
				originalSize = params.originalSize,
				imageUrl = params.imageUrl,
				slideSpeed = params.slideSpeed,
				easing = params.easing,
				carousel = params.carousel,
				autoSlide = params.autoSlide;
				autoSlideInterval = params.autoSlideInterval,
				hoverPause = params.hoverPause,
				slideCallBack = params.slideCallBack,
				openCallBack = params.openCallBack,
				isFullScreen = params.isFullScreen,
				showClip = params.showClip,
				sendGa = params.sendGa,
				galabel = params.galabel;

			var mynavigallery = $('.' + className);
			
			var index = 1;
			if (mynavigallery) {
				index = mynavigallery.length + 1;
			}

			var slider = null;
				
			var make = function (index) {

				var photos = [];

				/* ギャラリーに設定する画像データ配列を生成する */
				screen.find(targetClass).each(function(i) {

					var target = $(this),
						image = target.find('img'),
						imageId = target.data('imageid') || '',
						weddingId = target.data('weddingid') || '',
						imagePath = image.attr('osrc') || image.attr('src') || '',
						caption = image.attr('alt') || '',
						title = target.data('title') || '';

					var originalPath = imagePath;
					if (0 <= imagePath.indexOf('_')) {
						originalPath = imagePath.split("_")[0] + '.jpg';
					}

					var data = {
						imageId : imageId,
						imagePath : imagePath,
						originalPath : originalPath,
						caption : caption,
						weddingId : weddingId,
						title : title
					};

					// テンプレートに渡すため配列に格納
					photos.push(data);

				});

				var maxPageNo = photos.length;

				/* デザインテンプレート */
				var template = '';
				if (isFullScreen) {
					template = [
									'<div class="photo_enlargeArea portfolio display-none" >',
										'<div class="js-photoSlider" style="overflow:hidden;margin 0 auto;">',
											'<div class="parentKey photo_enlarge_imageArea">',
											'<% _.each(photos, function(data, i) { %> ',
												'<div class="childKey" style="text-align: center;">',
														'<img src="<%=data.originalPath%>" alt="<%=data.caption%>" data-imageurl="<%=data.imagePath%>" data-imageid="<%=data.imageId%>" data-weddingid="<%=data.weddingId%>" data-title="<%=data.title%>" >',
												'</div>',
											'<% }); %>',
											'</div>',
										'</div>',
										'<div class="photo_enlarge_partsArea">',
											'<div class="transitionArea transitionList">',
												'<p class="item prev js-backBtn"><a href="#" class="trigger"></a></p>',
												'<p class="item next js-nextBtn"><a href="#" class="trigger"></a></p>',
											'</div>',
											'<div class="closeArea">',
												'<p class="closeBtn"><a href="#" class="layerclose"><img src="' + imageUrl + '/btn_delete.png" alt="削除" width="20" height="20"></a></p>',
											'</div>',
											'<div class="commentArea" style="position: absolute;">',
												'<p class="comment"><span></span><a href="#" class="btnClip display-none">この画像を<br>クリップする</a></p>',
												'<p class="count" style="bottom: 10px;position: absolute;width: 100%;"></p>',
											'</div>',
										'</div>',
									'</div>'].join('');
				} else {
					template = [
									'<div class="window display-none">',
										'<p class="layerclose" style="position:absolute;top:-5px;right:-2px;z-index:9999;"><a href="#"><img src="' + imageUrl + '/btn_delete.png" alt="閉じる" width="20" height="20"></a></p>',
										'<div class="detailTtl">',
											'<div class="photoSlide js-photoSlider" >',
												'<div class="photoSlideViewId" style="overflow:hidden;margin 0 auto;">',
													'<div class="parentKey use-gpu" style="padding-left: 10px; position: relative;">',
														'<% _.each(photos, function(data, i) { %> ',
															'<div class="childKey imagePath<%=(i+1)%>" style="float: left; margin: 0;">',
																'<p class="photo">',
																	'<img src="<%=data.imagePath%>" alt="<%=data.caption%>" width="289px" class="image imagePath" />',
																'</p>',
															'</div>',
														'<% }); %>',
													'</div>',
												'</div>',
												'<p class="btnSlideBack js-backBtn"><a href="#"><img src="' + imageUrl + '/btn_slide_back.png' + '" width="20" alt="back"></a></p>',
												'<p class="btnSlideNext js-nextBtn"><a href="#"><img src="' + imageUrl + '/btn_slide_next.png' + '" width="20" alt="next"></a></p>',
												'<ul class="slideControl">',
													'<% _.each(photos, function(data, i) { %> ',
														'<li class="active pageNo<%=(i+1)%>"><span>・</span></li>',
													'<% }); %>',
												'</ul>',
											'</div>',
										'</div>',
									'</div>'].join('');
				}


				// 拡大写真パネルを生成する
				panel = $(_.template(template, {maxPageNo: maxPageNo, photos: photos}));

				panel.attr('id', 'zoomPhotoPanel'+ index); 
				panel.addClass(className);
				
				$('body').append(panel);
			}

			// イベントバンドル
			var bundle = function(index) {

				var sliderAnimateType = '';
				if (animateType === ANIMATE_TYPE.NO) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.NO;
				} else if (animateType === ANIMATE_TYPE.FADE) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.FADE;
				} else if (animateType === ANIMATE_TYPE.SLIDE) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.SLIDE;
				} else if (animateType === ANIMATE_TYPE.ORIGINAL) {
					sliderAnimateType = $.fn.mynavislider.ANIMATE_TYPE.FADE;
				}

				if (isFullScreen) {

					if (showClip) {
						panel.find('.btnClip').bind('click', function(event) {
							event.preventDefault();
							event.stopPropagation();
							// クリップ画像
							$.mynaviClipImage($(this).data('imageid'), galabel);
						}).show();
					}

					// 画像上下に余白を追加する。
					var appendMarginTop = function() {
						// オリジナル画像に変換する。
						slider.find('.childKey img').each(function() {
							var photo = $(this);
							var x = Math.floor(photo[0].height * $(window).width() / photo[0].width);
							var margin = Math.floor(($(window).height() - x) / 2);
							if (0 < margin) {
								photo.closest('.childKey').css('margin-top', margin + 'px');
							} else {
								photo.closest('.childKey').css('margin-top', '0px');
							}
						});
					}

					// 画像スライダーを設定する
					slider = panel.find('.js-photoSlider').mynavislider({
						'parentKey': '.parentKey'
						, 'childKey': '.childKey'
						, 'shift': 1
						,'isMouseDrag': true
						,'isFullScreen': true
						,'heightMaxScreen': true
						, 'backBtnKey': panel.find('.js-backBtn')
						, 'nextBtnKey': panel.find('.js-nextBtn')
						, 'animateType': sliderAnimateType
						, 'slideSpeed': slideSpeed
						, 'easing': easing
						, 'carousel': carousel
						, 'moment': true
						, 'autoSlide': autoSlide
						, 'autoSlideInterval': autoSlideInterval
						, 'hoverPause': hoverPause
						, 'slideCallBack': function(data) {

							// 画像上下に余白を追加する。
							appendMarginTop();

							// コメントエリアの表示更新
							var targetImage = data.obj.find('img');
							panel.find('.commentArea .comment>span').text(targetImage.attr('alt') || '');
							panel.find('.commentArea .count').text(data.pageNo + '／' + data.maxPageNo + '');
							panel.find('.btnClip')
								.data('imageid', targetImage.data('imageid'));

							// GA送信処理
							if(sendGa){
								var displayLi = $('#zoomPhotoPanel'+ index).find('.childKey');
								if (1 < displayLi.length) {
									displayLi = displayLi.filter('.childKey:eq(' + (data.pageNo) + ')' );
								}
								var displayImage = displayLi.find('img'),
									imageUrl = displayImage.data('imageurl') || '',
									weddingId = displayImage.data('weddingid'),
									label = displayImage.data('title');

								$.mynaviClickableImage(weddingId, imageUrl, label);
							}

							if (slideCallBack) {
								slideCallBack(data);
							}
						}, 'resizeCallBack': function (data) {

							// 画像上下に余白を追加する。
							appendMarginTop();

							panel.css('height', $(window).height() + 'px').css('width', $(window).width() + 'px');
							$('#jquery-mLightBox-overlay').css('height', $(document).height() + 'px').css('width', $(window).width() + 'px');

						}
					});
					
				} else {
					// 画像スライダーを設定する
					slider = panel.find('.js-photoSlider').mynavislider({
						'parentKey': '.parentKey'
						, 'childKey': '.childKey'
						, 'shift': 1
						, 'shiftw': 290
						, 'backBtnKey': panel.find('.js-backBtn')
						, 'nextBtnKey': panel.find('.js-nextBtn')
						, 'animateType': sliderAnimateType
						, 'slideSpeed': slideSpeed
						, 'easing': easing
						, 'carousel': carousel
						, 'autoSlide': autoSlide
						, 'autoSlideInterval': autoSlideInterval
						, 'hoverPause': hoverPause
						, 'slideCallBack': function(data) {

							slider.find('.slideControl li').removeClass('active');
							slider.find('.slideControl .pageNo'+data.pageNo).addClass('active');

							var photo = data.obj.find('img.imagePath');

							var replacePhotoArea = function() {

								if (animateType === ANIMATE_TYPE.ORIGINAL) {
									// 表示する画像の幅を算出する。
									var height = Math.ceil(280 * img.height / img.width);
									photo.css('max-height', height);
									panel.find('.photoSlideViewId').css('height', height + 20);
									
								}

								if (slideCallBack) {
									slideCallBack(data);
								}
							};

							var img = new Image();
							img.src = photo.attr('src');
							if (0 < img.width) {
								replacePhotoArea();
							} else {
								img.load = function() {
									replacePhotoArea();
								};
							}

							}
					});
				}

				// 対象画像クリック時に拡大写真パネルを表示する
				screen.find(targetClass).each(function(i) {
					var target = $(this),
						pageNo = i+1;

					target.unbind('click');
					target.bind('click', function(e) {
						e.preventDefault();
						showPage(pageNo);
					});
				});

				panel.find('.layerclose').click(function(e) {
					e.preventDefault();
					$.mLightBox.close();
				});
			};

			// 画面スクロールを有効にする
			var onScroll = function() {
				$(window).off('.noScroll');
			};

			// 画面スクロールを無効にする
			var offScroll = function() {
				$(window).on('touchmove.noScroll', function(e) {
				    e.preventDefault();
				});
			};

			// 指定したページを表示します。
			var showPage = obj.showPage = function(pageNo) {
				var pageNo = pageNo || 1;

				// 初期表示時のスクロール位置を保持しておく。
				defaultScrollTop = $(window).scrollTop();
				
				slider.changePage(pageNo);

				var options = {'mLightBoxId': '#zoomPhotoPanel' + index, duration: 300,
					callback: function() {
						var page = $('.page');

						// フッタを一旦消す
						page.find('.footerNavBar').hide();

						if (openCallBack) {
							openCallBack();
						}
					},
					closecallback: function() {
					}
				};
				
				if (isFullScreen) {
					options.opacity = 1;
					options.addScroll = false;
				}
				$.mLightBox(options);
				
			};

			make(index);
			
			bundle(index);

		};

		// 処理開始
		$(this).each(function() {
			init(this);
		});

		return this;
	};

	// アニメーションの種類
	var ANIMATE_TYPE = $.fn.zoomPhotoPanel.ANIMATE_TYPE = {
		NO: 0,
		SLIDE: 1,
		FADE: 2,
		ORIGINAL: 3
	};

	// デフォルト値
	$.fn.zoomPhotoPanel.defaults = {
		'targetClass': '.js-zoomPhoto' // 拡大する画像要素
		, 'animateType': ANIMATE_TYPE.SLIDE // アニメーションの種類
		, 'imageUrl': '/sp/img' // 画像パス
		, 'slideSpeed': 300 // スライド速度
		, 'easing': 'easeInOutCirc' // スライドアニメーションの種類
		, 'carousel': false // ローテートさせるかどうか
		, 'autoSlide': false // 自動スライドさせるどうか
		, 'autoSlideInterval':  5000 // 自動スライドさせる間隔(ミリ秒)
		, 'hoverPause':  false // 子要素にマウスオーバーすると自動スライドを一時停止する。
		, 'slideCallBack': null // スライド後に処理を行うコールバック(本プラグインで想定していない処理はここでカスタマイズする)
		, 'openCallBack': null // 拡大表示後のコールバック
		,'isFullScreen': false // フルスクリーンで表示する
		, 'showClip': false // 画像クリップ機能を表示する
		, 'sendGa': false // 画像クリップ機能を表示する
		, 'galabel': '' // 画像クリップ時のGAイベントラベル値
	};

})(jQuery);

