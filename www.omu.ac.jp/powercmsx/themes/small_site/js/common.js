

(function (d, w, $) {
  "use strict";

  var _ua = window.navigator.userAgent.toLowerCase();
  let _ms = false;
  var _w_lg = 1200;
  // ---------------------------------------------
  // IE11の場合bodyにクラスを付与
  // ---------------------------------------------
  if (_ua.indexOf("trident") > -1) {
    document.body.classList.add("ie11");
    _ms = true;
  } else if (_ua.indexOf("edge") > -1) {
    _ms = true;
  }
  // ---------------------------------------------
  // viewportの切り替え
  // ---------------------------------------------
  $("#viewport").remove();
  if (_ua.indexOf("iphone") > 0 || _ua.indexOf("ipod") > 0 || (_ua.indexOf("android") > 0 && _ua.indexOf("mobile") > 0)) {
    // console.log( 'mobile' );
    if (w.innerWidth <= 320) {
      // iPhoneSE時は「375」固定
      $("head").prepend('<meta name="viewport" id="viewport" content="width=375">');
    } else if (w.innerWidth < 768) {
      $("head").prepend('<meta name="viewport" id="viewport" content="width=device-width,initial-scale=1">');
    } else {
      $("head").prepend('<meta name="viewport" id="viewport" content="width=1100">');
    }
  } else {
    $("head").prepend('<meta name="viewport" id="viewport" content="width=1100">');
  }

  // Cookie-OptIn
  var funcCookieOptIn = (function () {
    if (typeof ga_optin_show === "undefined" || !ga_optin_show) {
      console.log("[opt-in] function false");
      $("#optin-box").hide();
      return false;
    }
    console.log("[opt-in] function true");
    // var ga_disable_key = "ga-disable-UA-XXXXXXXXX";
    // var cookie_save_path = "/";
    // var optin_val = localStorage.getItem("ga_cookie_opt_in");
    var optin_val = $.cookie("ga_cookie_opt_in");
    var ga_save_expires = 365 * 10; // day
    console.log("[opt-in] ga_disable_key=" + ga_disable_key);
    console.log("[opt-in] path=" + cookie_save_path);

    if (optin_val === "yes") {
      // 同意
      console.log("[opt-in] 同意");
      window[ga_disable_key] = false;
      $("#optin-box").hide();
    } else if (optin_val === "no") {
      // 非同意
      console.log("[opt-in] 非同意");
      window[ga_disable_key] = true;
      $("#optin-box").hide();
    } else {
      // 初回確認
      console.log("[opt-in] 初回確認");
      window[ga_disable_key] = true;
      $("#optin-box").show();
      // 同意する
      $("#ga-opt-in-true").on("click", function () {
        // localStorage.setItem("ga_cookie_opt_in", "yes");
        $.cookie("ga_cookie_opt_in", "yes", { expires: ga_save_expires, path: cookie_save_path, secure: true });
        location.reload();
      });
      // 同意しない
      $("#ga-opt-in-false").on("click", function () {
        // localStorage.setItem("ga_cookie_opt_in", "no");
        $.cookie("ga_cookie_opt_in", "no", { expires: ga_save_expires, path: cookie_save_path, secure: true });
        location.reload();
      });
    }
    console.log("[opt-in] ga_disable_key:" + window[ga_disable_key] + " - " + (window[ga_disable_key] ? "[GA無効]" : "[GA有効]"));
  })();

  var _hash = location.hash;

  $(function () {
    // ---------------------------------------------
    // matchHeight
    // ---------------------------------------------
    $(".mh").matchHeight();
    // ---------------------------------------------
    // Magnificpopup
    // ---------------------------------------------
    //$( '.mfp-image' ).magnificPopup( {
    //	type: 'image'
    //} );
    //$( '.mfp-inline' ).magnificPopup( {
    //	type: 'inline'
    //} );
    // ---------------------------------------------
    //responsive Imagemap link
    // ---------------------------------------------
    $("img[usemap]").rwdImageMaps();
    //move2hash
    var _m2h = new move2hash();
    _m2h.init();
    $(w).on("load", function () {
      _m2h.start();
    });
    // ---------------------------------------------
    // ページ内ナビのレスポンシブ対応
    // ---------------------------------------------
    $(".pageanchor")
      .each(function (i, elm) {
        
			var _seltext = "選択してください";
			if($('body').hasClass('lang_en')){
				_seltext = "Please select";
			}else if($('body').hasClass('lang_zh-cn')){
				_seltext = "请选择";
			}else if($('body').hasClass('lang_zh-tw')){
				_seltext = "請選擇";
			}
			var _select = $( '<div class="selecton"><select><option value="" selected>' + _seltext + '</option></select></div>' );
      $(this).find(".nav-item")
          .each(function (i, elm) {
            let _anchor = $(this).find(".nav-link").data("anchor");
            let _type = "scroll";
            if (!_anchor) {
              _anchor = $(this).find(".nav-link").attr("href");
              _type = "link";
              if( _anchor === 'javascript:void(0);'){
                _anchor = $( this ).find( '.nav-link' ).attr('rel');
                _type = "scroll";
              }
              if ($(this).find(".nav-link").attr("target") === "_blank") {
                _type = "blank";
              }
            }
            var _option = $("<option/>").text($(this).find(".nav-link").text()).val(_anchor).data("type", _type);
            _select.find("select").append(_option);
          });
        $(this).append(_select);
      })
      .on("change", "select", function () {
        var _v = $(this).val();
        if (_v.length < 1) return false;

        var _tar = $(this).find("option:selected");
        if (_tar.data("type") === "scroll") {
          _m2h.move(_v);
        } else if (_tar.data("type") === "link") {
          location.href = _v;
        } else if (_tar.data("type") === "blank") {
          window.open(_v);
        }
      });
    // ---------------------------------------------
    // タブのレスポンシブ対応
    // ---------------------------------------------
    $(".tabnav")
      .each(function (i, elm) {
        var _select = $('<div class="selecton"><select/></div>');
        $(this)
          .find(".nav-item")
          .each(function (i, elm) {
            var _a = $(this).find(".nav-link");
            var _option = $("<option/>").text(_a.text()).val(i);
            if (_a.attr("href") === _hash) {
              _a.click();
              _option.attr("selected", true);
            }
            _select.find("select").append(_option);
          });
        $(this).find(".inner").append(_select);
      })
      .on("change", "select", function () {
        // console.log($(this).val());
        $(this).closest(".tabnav").find(".nav-tabs").find(".nav-link").eq($(this).val()).tab("show");
      });
    // ---------------------------------------------
    // アコーディオンの開閉イベント補完
    // ---------------------------------------------
    $(".panel").find(".panel-heading").find("a").append('<span class="icon"/>');
    $(".panel-collapse").on("show.bs.collapse hidden.bs.collapse", function (e) {
      // console.log(e);
      // var _id = e.target.id;
      if (e.type === "show") {
        $(this).closest(".panel").addClass("collapse_show");
      } else {
        $(this).closest(".panel").removeClass("collapse_show");
        $(this).find(".panel-collapse").collapse("hide");
      }
    });
    $(".panel-title").each(function () {
      var _a = $(this).find("a");
      if (_a.attr("href") === _hash) {
        _a.click();
        if ($(this).parents(".panel").length > 0) {
          $(this).parents(".panel").find(".panel-title > a").click();
        }
      }
    });

    // ----------------------------------------------
    // ヘッダーの高さ分だけコンテンツを下げる ＋　SPグローバルメニュー内の高さ変更
    // ----------------------------------------------
    var g_head_height = 0;
    var g_menu_height = 0;
    var g_list_btm_height = 0;
    var g_sns_height = 0;
    var total_height = 0;

    var funcHeadScrollControl = function () {
      var height = 0;
      var vh100 = window.innerHeight; // SP対応

      if (w.innerWidth < 1200) {
        //height = $(".g-nav__search_sp").height();
        //console.log("[g-nav__search_sp]" + height);
        if ($("body").hasClass("nav-side")) {
          height = $(".g-nav__head").height();
          console.log("[nav-side]" + height);
        } else {
          height = $(".g-nav__head").height();
          console.log("[nav-top]" + height);
        }

        g_head_height = $(".g-nav__head").outerHeight() || 0;                        // GM
        g_menu_height = $(".g-nav__menu-list").outerHeight() || 0;                   // お問い合わせ
        g_list_btm_height = $(".navbar-collapse .g-nav__list_2").outerHeight() || 0; // 公式リンク
        g_sns_height = $(".g-nav__sns").outerHeight() || 0;                          // SNS
        total_height = g_head_height + g_menu_height + g_list_btm_height + g_sns_height;
        $(".g-nav__menu-link").css('height', 'calc(' + vh100 + 'px - ' + total_height + 'px)');

      } else {
        if ($("body").hasClass("nav-side")) {
          height = 0;
          console.log("[nav-side]" + height);
        } else {
          height = $(".g-nav").height();
          console.log("[nav-top]" + height);
        }

        total_height = 76 + 86;
        $(".g-nav__menu-link").css('height', 'calc(100vh - ' + total_height+ 'px)');
      }
      $("body").css("padding-top", height);
    };
    $(function () {
      funcHeadScrollControl();
      $(".navbar-toggler").on("click",function() {
        setTimeout(function(){
          funcHeadScrollControl();
        },100);
      });
    });
    $(window).on("resize", function () {
      funcHeadScrollControl();
    });

    // ----------------------------------------------
    // Windows resize Event
    // ----------------------------------------------
    let _resizeTimer = false;
    let _size = w.innerWidth;
    $(w).on("resize", function () {
      if (_resizeTimer) {
        clearTimeout(_resizeTimer);
      }
      _resizeTimer = setTimeout(function () {
        if (_size !== w.innerWidth) {
          _size = w.innerWidth;
          $(d).trigger("hoge::resized", [_size]);
        }
      }, 60);
    });
    // ----------------------------------------------
    // スクロールイベント
    // ----------------------------------------------
    //$( d ).on( 'hoge::scroll', function() {
    //	var _top = document.body.getBoundingClientRect().top;
    //	if( _top < -200 ) {
    //		$( '.pagetop' ).fadeIn();
    //	} else {
    //		$( '.pagetop' ).fadeOut();
    //	}
    //} );

    let _scrollTimer = false;
    $(w).on("scroll", function () {
      if (_scrollTimer) {
        clearTimeout(_scrollTimer);
      }
      _scrollTimer = setTimeout(function () {
        $(d).trigger("hoge::scroll");
      }, 60);
    });
  });

  // ----------------------------------------------
  // アコ－ディオン
  // ----------------------------------------------
  $(function () {
    $(".acc__ttl").on("click", function () {
      if ($(this).hasClass("open")) {
        $(this).next(".acc__box").slideToggle(100, "linear");
        $(this).removeClass("open");
      } else {
        $(this).next(".acc__box").slideToggle(100, "linear");
        $(this).addClass("open");
      }

      //クリックされていない箇所は閉じる
      $(".acc__ttl").not($(this)).next(".acc__box").slideUp(100, "linear");
      $(".acc__ttl").not($(this)).removeClass("open");
    });
  });

  // ----------------------------------------------
  // タブ切り替え
  // ----------------------------------------------
  /*$(function () {
		$('#js_tabBtn .select_btn').on('click', function(){
	    if($(this).not('active')){
	      $(this).addClass('active').siblings('a').removeClass('active');
	      var index = $('#js_tabBtn .select_btn').index(this);
	      $('.js_content').eq(index).addClass('active').siblings('div').removeClass('active');
	      $.cookie('activecookie',$(this).attr("href"), { expires: 30 });
	      console.log($(this).attr("href"));
				return false;
	    }
	  });*/

  // クッキー周りの設定
  /*
		var CookieName = $.cookie('activecookie');
	  if (CookieName != null) {
	    $('#js_tabBtn .select_btn').removeClass('active');
	    $("a[href="+'CookieName'+"]").addClass('active');
	    $(CookieName).addClass('active').siblings('div').removeClass('active');
	  }

	});*/

  // ----------------------------------------------
  // ページ内リンク
  // ----------------------------------------------

  var move2hash = function () {};
  //pagetop
  move2hash.prototype.init = function () {
    var _this = this;
    $('a[href^="#"], area[href^="#"]')
      .filter(".scroll")
      .each(function () {
        var $this = $(this);
        var _href = $this.attr("href");
        $this
          .attr({
            href: "javascript:void(0);",
            rel: _href,
          })
          .on("click", function (e) {
            e.preventDefault();
            var _target;
            if ($this.parent().hasClass("pagetop")) {
              // _target = 0;
              _target = $("body");
            } else {
              _target = $($this.attr("rel"));
            }
            _this.move(_target);
            return false;
          });
      });

    $(w).on("hashchange", function (e) {
      e.preventDefault();
      var _hash = location.hash;
      if ($(_hash).length > 0) {
        _this.move(_hash);
      }
      return false;
    });
  };
  move2hash.prototype.start = function () {
    var _url = d.URL;
    var _url_split = _url.split("#");
    var _hash = _url_split[1];
    if (_hash) {
      var _start = this.get_target("#" + _hash);
      this.move("#" + _hash);
    }
  };
  move2hash.prototype.get_target = function (_elmId) {
    let _result = 0;
    if ($(_elmId).length) {
      _result = $(_elmId).offset().top;
    } else {
      _result = 0;
    }
    _result = _result - 100 > -1 ? (_result -= 100) : 0;
    return Math.floor(_result);
  };
  move2hash.prototype.move = function (_elmId) {
    // var _current = $( d ).scrollTop();
    // var _speed = 5000 / 1000; // 秒速 5000px
    // var _duration = Math.floor( Math.abs( _pos - _current ) / _speed );
    var _pos = this.get_target(_elmId);
    var _gap = parseInt($("body").css("padding-top"));
    // if($('.pbox_fixed').length){
    // 	var _fix = $('.pbox_fix').outerHeight();
    // 	_gap += $('.pbox_fixed').outerHeight();
    // }else if($('.pbox_fix').length){
    // 	var _fix = $('.pbox_fix').outerHeight();
    // 	_gap += $('.pbox_fix').outerHeight() * 2 + 50;
    // }
    $(_elmId).velocity("scroll", {
      duration: 1000,
      offset: _gap * -1,
    });
  };
})(document, window, jQuery);