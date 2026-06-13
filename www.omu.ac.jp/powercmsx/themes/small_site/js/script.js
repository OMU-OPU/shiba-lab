

$(function () {});

if (location.hostname !== "localhost") {
  console.log = function () {};
}
var fixedBoxPos = 0;
let varMediaQuery = window.matchMedia("(max-width:768px)");
let varMediaQueryTab = window.matchMedia("(max-width:1024px)");
let varMediaQueryPC = window.matchMedia("(max-width:1200px)");
let funcEventUtil = {
  spFlag: varMediaQuery.matches,
  spFlagPre: varMediaQuery.matches,
  tabResizeProcFlag: false,
  tabFlag: varMediaQueryTab.matches,
  tabFlagPre: varMediaQueryTab.matches,
  pcResizeProcFlag: true,
  pcFlag: varMediaQueryPC.matches,
  pcFlagPre: varMediaQueryPC.matches,
  kind: varMediaQuery.matches,
  // [Add] [#xxx-open]でアコーディオンオープン
  funcOpenHashAccordion: function () {
    console.log("[funcEventUtil.funcOpenHashAccordion]");
    if (location.hash.match(/-open$/)) {
      var link_id = location.hash.substr(0, location.hash.length - 5);
      console.log(link_id);
      if ($("[href='" + link_id + "'][data-toggle=pill]")) {
        $("[href='" + link_id + "']")
          .closest(".nav-pills")
          .attr("id", location.hash.substr(1));
      }
      $("[href='" + link_id + "']").click();
    }
  },
  // PC時アコーディオンオープン
  funcOpenPCAccordion: function () {
    console.log("[funcEventUtil.funcOpenPCAccordion]");
    if (this.spFlag) {
      $(".pcollapse_sp .pcollapse__body").removeClass("show");
      $(".pcollapse_sp .pcollapse__toggle").attr({
        "aria-expanded": "false",
      });
    } else {
      $(".pcollapse_sp .pcollapse__body").addClass("show");
      $(".pcollapse_sp .pcollapse__toggle").attr({
        "aria-expanded": "true",
      });
    }
  },
  // [Add] [target="_blank"]時[rel="noopener noreferrer"]付与
  funcAddAnchorBlankRel: function () {
    console.log("[funcEventUtil.funcAddAnchorBlankRel]");
    var aTags = [].slice.call(document.getElementsByTagName("a"));
    var ua = window.navigator.userAgent.toLowerCase();
    var isIE = ~ua.indexOf("msie") || ~ua.indexOf("trident");
    if (!isIE) {
      aTags.forEach(function (el) {
        if (el.target === "_blank") {
          var rels = el.rel.split(" ");
          if (!~rels.indexOf("noopener")) {
            rels.push("noopener");
            el.setAttribute("rel", rels.join(" ").trim());
          }
          if (!~rels.indexOf("noreferrer")) {
            rels.push("noreferrer");
            el.setAttribute("rel", rels.join(" ").trim());
          }
        }
      });
    }
  },
  // [Acc] 背景色を変更
  funcAccBgColor: function () {
    console.log("[funcEventUtil.funcAccBgColor]");
    let accClassPrefix = "acc-bg_";
    let accCookiePrefix = "funcAccBgColor";
    $(".acc__list_bg .acc__item").on("click", function () {
      let accHtmlClass = "";
      let accElemClass = "";
      if ($(this).hasClass("acc__item_std")) {
        accHtmlClass = "acc-bg_std";
        accElemClass = "acc__item_std";
      } else if ($(this).hasClass("acc__item_blk")) {
        accHtmlClass = "acc-bg_blk";
        accElemClass = "acc__item_blk";
      }
      $(this).parent().children().removeClass("active");
      $(this).addClass("active");
      $("html")
        .removeClass(function (index, className) {
          reg = new RegExp("\\b" + accClassPrefix + "\\S+", "g");
          return (className.match(reg) || []).join(" ");
        })
        .addClass(accHtmlClass);
      $.cookie(accCookiePrefix + "HtmlClass", accHtmlClass, {
        path: "/",
      });
      $.cookie(accCookiePrefix + "ElemClass", accElemClass, {
        path: "/",
      });
      if (varMediaQuery.matches) {
        $(".navbar-toggler").click();
      }
    });
    if ($.cookie(accCookiePrefix + "HtmlClass") === undefined) {
    } else {
      console.log($.cookie(accCookiePrefix + "HtmlClass"));
      console.log($.cookie(accCookiePrefix + "ElemClass"));
      $("html").addClass($.cookie(accCookiePrefix + "HtmlClass"));
      $("." + $.cookie(accCookiePrefix + "ElemClass"))
        .parent()
        .children()
        .removeClass("active");
      $("." + $.cookie(accCookiePrefix + "ElemClass")).addClass("active");
    }
  },
  // [Acc] 文字サイズを変更
  funcAccFontSize: function () {
    console.log("[funcEventUtil.funcAccFontSize]");
    let accClassPrefix = "acc-fz_";
    let accCookiePrefix = "funcAccFontSize";
    $(".acc__list_fz .acc__item").on("click", function () {
      let accHtmlClass = "";
      let accElemClass = "";
      if ($(this).hasClass("acc__item_s")) {
        accHtmlClass = "acc-fz_s"; // 50%
        accElemClass = "acc__item_s";
      } else if ($(this).hasClass("acc__item_m")) {
        accHtmlClass = "acc-fz_m"; // 62.5%
        accElemClass = "acc__item_m";
      } else if ($(this).hasClass("acc__item_l")) {
        accHtmlClass = "acc-fz_l"; // 75%
        accElemClass = "acc__item_l";
      }
      $(this).parent().children().removeClass("active");
      $(this).addClass("active");
      $("html")
        .removeClass(function (index, className) {
          reg = new RegExp("\\b" + accClassPrefix + "\\S+", "g");
          return (className.match(reg) || []).join(" ");
        })
        .addClass(accHtmlClass);
      $.cookie(accCookiePrefix + "HtmlClass", accHtmlClass, {
        path: "/",
      });
      $.cookie(accCookiePrefix + "ElemClass", accElemClass, {
        path: "/",
      });
      if (varMediaQuery.matches) {
        $(".navbar-toggler").click();
      }
    });
    if ($.cookie(accCookiePrefix + "HtmlClass") === undefined) {
    } else {
      console.log($.cookie(accCookiePrefix + "HtmlClass"));
      console.log($.cookie(accCookiePrefix + "ElemClass"));
      $("html").addClass($.cookie(accCookiePrefix + "HtmlClass"));
      $("." + $.cookie(accCookiePrefix + "ElemClass"))
        .parent()
        .children()
        .removeClass("active");
      $("." + $.cookie(accCookiePrefix + "ElemClass")).addClass("active");
    }
  },
  // [Acc] 画像をテキストに変更
  funcAccAlt2Txt: function () {
    console.log("[funcEventUtil.funcAccAlt2Txt]");
    let accClassPrefix = "acc-alt_";
    let accCookiePrefix = "funcAccAlt2Txt";
    $(".acc__list_alt .acc__item").on("click", function () {
      console.log("acc__list_alt");
      let accHtmlClass = "";
      let accElemClass = "";
      if ($(this).hasClass("acc__item_txt")) {
        accHtmlClass = "acc-alt_txt";
        accElemClass = "acc__item_txt";
      } else if ($(this).hasClass("acc__item_alt")) {
        accHtmlClass = "acc-alt_alt";
        accElemClass = "acc__item_alt";
      }
      $(this).parent().children().removeClass("active");
      $(this).addClass("active");
      $("html")
        .removeClass(function (index, className) {
          reg = new RegExp("\\b" + accClassPrefix + "\\S+", "g");
          return (className.match(reg) || []).join(" ");
        })
        .addClass(accHtmlClass);
      $.cookie(accCookiePrefix + "HtmlClass", accHtmlClass, {
        path: "/",
      });
      $.cookie(accCookiePrefix + "ElemClass", accElemClass, {
        path: "/",
      });
      funcEventUtil.funcAccAlt2TxtProc();
      if (varMediaQuery.matches) {
        $(".navbar-toggler_close").click();
      }
    });
    if ($.cookie(accCookiePrefix + "HtmlClass") === undefined) {
    } else {
      console.log($.cookie(accCookiePrefix + "HtmlClass"));
      console.log($.cookie(accCookiePrefix + "ElemClass"));
      $("html").addClass($.cookie(accCookiePrefix + "HtmlClass"));
      $("." + $.cookie(accCookiePrefix + "ElemClass"))
        .parent()
        .children()
        .removeClass("active");
      $("." + $.cookie(accCookiePrefix + "ElemClass")).addClass("active");
      if ($.cookie(accCookiePrefix + "HtmlClass") === "acc-alt_txt") {
        funcEventUtil.funcAccAlt2TxtProc();
      }
    }
  },
  funcAccAlt2TxtProc: function () {
    $("img").each(function () {
      if ($(this).hasClass("alt")) {
        // txt -> img[alt]
        $(this).removeClass("alt").removeClass("d-none");
        $(this).next().remove();
        $(".sns.sns_type_icon").removeClass("alt2txt");
      } else {
        // img[alt] -> txt
        $(this).addClass("alt").addClass("d-none");
        $(this).after($("<span>").text($(this).attr("alt")));
        $(".sns.sns_type_icon").addClass("alt2txt");
      }
    });
  },
  // [mfp] magnificPopup設定
  funcMagnificPopup: function () {
    $(".mfp-inline").magnificPopup({
      type: "inline",
    });
    $(".mfp-image").magnificPopup({
      type: "image",
    });
    $("[class*=mfp-list]").each(function () {
      $(this).magnificPopup({
        delegate: "a",
        type: "image",
        gallery: {
          enabled: true,
        },
        mainClass: 'mfp-fade',
        removalDelay: 160        
      });
    });
    $(".mfp-youtube").magnificPopup({
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false,
    });
    $(".mfp-youtube-pc").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false,
    });
    $(".mfp-close-btn").on("click", function () {
      $(".mfp-close").click();
    });
  },
  // リサイズ処理
  funcResize: function () {
    this.spFlag = varMediaQuery.matches;
    this.tabFlag = varMediaQueryTab.matches;
    this.pcFlag = varMediaQueryPC.matches;
    if (funcEventUtil.pcResizeProcFlag) {
      this.kind = this.tabFlag && this.pcFlag ? "TAB" : this.pcFlag ? "PC" : "LG";
    } else if (funcEventUtil.tabResizeProcFlag) {
      this.kind = this.spFlag && this.tabFlag ? "SP" : this.tabFlag ? "TAB" : "PC";
    } else {
      this.kind = this.spFlag ? "SP" : "PC";
    }
    console.log("[funcEventUtil.funcResize] " + this.kind);
    if (this.spFlag != this.spFlagPre) {
      this.spFlagPre = this.spFlag;
      if (this.spFlag) {
        console.log("[funcEventUtil.funcResize][PC->SP]");
      } else {
        console.log("[funcEventUtil.funcResize][SP->PC]");
      }
      // 初期表示処理
      funcEventUtil.funcInitDrow(true);
    }
    if (funcEventUtil.tabResizeProcFlag && this.tabFlag != this.tabFlagPre) {
      this.tabFlagPre = this.tabFlag;
      if (this.tabFlag) {
        console.log("[funcEventUtil.funcResize][PC->TAB]");
      } else {
        console.log("[funcEventUtil.funcResize][TAB->PC]");
      }
      // 初期表示処理
      funcEventUtil.funcInitDrow(true);
    }
    if (funcEventUtil.pcResizeProcFlag && this.pcFlag != this.pcFlagPre) {
      this.pcFlagPre = this.pcFlag;
      if (this.pcFlag) {
        console.log("[funcEventUtil.funcResize][LG->PC]");
      } else {
        console.log("[funcEventUtil.funcResize][PC->LG]");
      }
      // 初期表示処理
      funcEventUtil.funcInitDrow(true);
    }
  },
  // スクロール処理(再設定)
  // ch) https://qiita.com/zaru/items/878b892e4debf03785e3
  funcScrollSet: function () {
    console.log("[funcEventUtil.funcScroll]");
    funcEventUtil.funcScrollProc();
    // ---- [common.js]を改修 ----
    // console.log("[funcEventUtil.funcScroll]");
    // setTimeout(function () {
    //   Object.keys($._data($(document).get(0), "events")).forEach(function (k) {
    //     console.log("events:" + k);
    //     if (k == "hoge::scroll") {
    //       $(document).off(k);
    //       console.log("events-delete:" + k);
    //       funcEventUtil.funcScrollProc();
    //     }
    //   });
    // }, 50);
  },
  funcScrollProc: function () {
    console.log("[funcEventUtil.funcScrollProc]");
    console.log("events-seting:hoge::scroll");
    $(document).on("hoge::scroll", function () {
      funcEventUtil.funcScrollProcMain();
    });
  },
  funcScrollProcMain: function () {
    var _top = document.body.getBoundingClientRect().top;
    if (_top < -200) {
      $(".pagetop").addClass("pagetop_show");
    } else {
      $(".pagetop").removeClass("pagetop_show");
    }
  },
  // 初期化処理
  funcInitDrow: function (resizeFlag) {
    console.log("[funcEventUtil.funcInitDrow] resizeFlag=" + resizeFlag);
    if ($(".pbox_fix").length) {
      if (!$(".pbox_fixed").length) {
        var _gap = parseInt($("body").css("padding-top"));
        fixedBoxPos = $(".pbox_fix").offset().top - _gap;
      }
    }
    this.funcOpenPCAccordion();
    if (resizeFlag) {
      // リサイズ時の初期化処理
      if (varMediaQuery.matches) {
        console.log("[funcEventUtil.funcInitDrow][SP]");
      } else if (varMediaQueryTab.matches) {
        console.log("[funcEventUtil.funcInitDrow][TAB]");
        if ($(".js_toggle_open").length) {
          $(".navbar-toggler_close").click();
        }
      } else {
        console.log("[funcEventUtil.funcInitDrow][PC]");
        // $("body").removeClass("active");
        // if ($(".js").length) {
        //   $(".navbar-toggler").click();
        // }
        if ($(".js_toggle_open").length) {
          $(".navbar-toggler_close").click();
        }
      }
    } else {
      // 初期表示処理
      if (varMediaQuery.matches) {
        console.log("[funcEventUtil.funcInitDrow][SP-Init]");
      } else {
        console.log("[funcEventUtil.funcInitDrow][PC-Init]");
      }
      // 共通処理
      if (true) {
        // BootstrapToggleJudge[Open/Close]
        $(".navbar-toggler_close").on("click", function () {
          console.log($(this).attr("data-toggle") + ":" + $(this).attr("data-target"));
          if ($("html").hasClass("js_toggle_open")) {
            $("html").removeClass("js_toggle_open");
            $(".navbar-toggler-text").text("Menu");
          } else {
            $("html").addClass("js_toggle_open");
            // $(".navbar-toggler-text").text("Close");
          }
        });
        // SlickSlider
        if (typeof $.fn.slick === "function") {
          console.log("--> Library [$.fn.slick]");
          funcSlider.funcSliderAll();
        }
        // objectFitImages
        if (typeof objectFitImages === "function") {
          console.log("--> Library [objectFitImages]");
          objectFitImages(".ofi");
        }
        // Stickyfill
        if (typeof Stickyfill === "object") {
          console.log("--> Library [Stickyfill]");
          Stickyfill.add($(".sticky"));
        }
        // Emergence.js
        if (typeof emergence === "object") {
          console.log("--> Library [Emergence.js]");
          funcEmergence.funcInit();
        }
        // ScrollHint
        var _hinttxt = "スクロールできます";
        if ($("body").hasClass("lang_en")) {
          _hinttxt = "scrollable";
        } else if ($("body").hasClass("lang_zh-cn")) {
          _hinttxt = "可卷动";
        } else if ($("body").hasClass("lang_zh-tw")) {
          _hinttxt = "可捲動";
        }
        new ScrollHint(".table-responsive", {
          i18n: {
            scrollable: _hinttxt,
          },
        });
        new ScrollHint(".js-responsive", {
          i18n: {
            scrollable: _hinttxt,
          },
        });
        // magnificPopup設定
        this.funcMagnificPopup();
        // スクロールイベント再設定
        this.funcScrollSet();
        // 横スクロール対策 for FixedMenu
        if ($(".gnav").css("position") == "fixed") {
          console.log("[横スクロール対策 for FixedMenu]");
          $(window).on("scroll", function () {
            var _left = document.body.getBoundingClientRect().left;
            if (_left === 0) {
              $(".gnav").removeAttr("style");
            } else {
              $(".gnav").css("transform", "translateX(" + _left + "px)");
            }
            //console.log(_left);
          });
        }
        // [ResizeProc]
        $(document).on("hoge::resized", function () {
          if (typeof funcEventUtil.funcResize === "function") {
            funcEventUtil.funcResize();
          }
        });
        // funcAccBgColor
        if (typeof funcEventUtil.funcAccBgColor === "function") {
          funcEventUtil.funcAccBgColor();
        }
        // funcAccFontSize
        if (typeof funcEventUtil.funcAccFontSize === "function") {
          funcEventUtil.funcAccFontSize();
        }
        // funcAccAlt2Txt
        if (typeof funcEventUtil.funcAccAlt2Txt === "function") {
          funcEventUtil.funcAccAlt2Txt();
        }
        // funcAddAnchorBlankRel
        if (typeof funcEventUtil.funcAddAnchorBlankRel === "function") {
          funcEventUtil.funcAddAnchorBlankRel();
        }
        // funcOpenHashAccordion
        if (typeof funcEventUtil.funcOpenHashAccordion === "function") {
          funcEventUtil.funcOpenHashAccordion();
        }
        // PictSelect
        if ($(".sys-img_type_thumbnail").length) {
          $(".sys-img__link").attr("href", "javascript:void(0);");
          $(".sys-img__link").on("click", function () {
            $(this).closest(".sys-img").find(".sys-img__main .sys-img__pict").attr("src", $(this).find(".sys-img__pict").attr("src"));
          });
        }
        //$(d).trigger("hoge::resized");
        // [MENU] MenuActive by ScrollPosition
        // -> 指定クラス名[data-change-header="**"]を超えるとgnav_active付与
        if ($("body[data-change-header]").length) {
          let _realtime = false;
          let _targetVal = $("body[data-change-header]").data("change-header");
          let _targetClass = "." + _targetVal;
          console.log("--> [ScrollJudge][data-change-header=" + _targetVal + "]");
          $(document).on(_realtime ? "scroll" : "hoge::scroll", function () {
            var _top = document.body.getBoundingClientRect().top * -1;
            let _menu_btm = _targetVal.toString().match(/^\w+$/) ? _targetVal : $(_targetClass).offset().top + $(_targetClass).height();
            //console.log("[_top > _menu_btm] " + _top + ">" + _menu_btm);
            if (_top > _menu_btm) {
              $(".gnav").addClass("gnav_active");
              //console.log("[ScrollJudge][addClass]");
            } else {
              $(".gnav").removeClass("gnav_active");
              //console.log("[ScrollJudge][removeClass]");
            }
          });
          if (!_realtime) {
            $(document).trigger("hoge::scroll");
          }
        }
      }
    }
  },
};
let funcEmergence = {
  spFlag: varMediaQuery.matches,
  funcInit: function () {
    console.log("[funcEmergence." + arguments.callee.name + "]");
    this.funcSetting();
    emergence.init({
      reset: false,
      elemCushion: 0.25,
    });
  },
  funcSetting: function () {
    console.log("[funcEmergence." + arguments.callee.name + "]");
    this.funcSet1(".em_fade", "fade", 0, 0);
    this.funcSet1(".em_fadeup", "fadeup", 0, 0);
    this.funcSet1(".em_fadedown", "fadedown", 0, 0);
    this.funcSet1(".em_fadeleft", "fadeleft", 0, 0);
    this.funcSet1(".em_faderight", "faderight", 0, 0);
    this.funcSet1(".em_zoomin", "zoomin", 0, 0);
    this.funcSet1(".em_zoomout", "zoomout", 0, 0);
    this.funcSet1(".em_maker", "maker", 0, 0);
    // ---- Additional Setting
    //  this.funcSet1(".mv__title", "fade", 0, 0);
    //  this.funcSet1(".start-box");
    //  this.funcSet2(".start-box:nth-child(even) .start-box__text", "faderight", 0, 500);
    //  this.funcSet2(".start-box:nth-child(odd) .start-box__text", "fadeleft", 0, 500);
  },
  funcSet1: function (className, emType, duration, delay) {
    $(className).attr("data-emergence", "hidden").addClass("em");
    if (emType) {
      $(className).addClass("em_" + emType);
    }
    if (duration) {
      $(className).addClass("em_duration_" + duration);
    }
    if (delay) {
      $(className).addClass("em_delay_" + delay);
    }
  },
  funcSet2: function (className, emType, duration, delay) {
    $(className)
      .addClass("em")
      .addClass("em_" + emType);
    if (duration) {
      $(className).addClass("em_duration_" + duration);
    }
    if (delay) {
      $(className).addClass("em_delay_" + delay);
    }
  },
};

let funcSlider = {
  // https://kenwheeler.github.io/slick/
  // https://tr.you84815.space/slick/
  // https://www.nxworld.net/tips/jquery-plugin-slick-slide-counter.html
  funcSliderAll: function () {
    console.log("[funcSlider." + arguments.callee.name + "]");
    if (typeof $.fn.slick === "function") {
      for (let funcName in this) {
        if (funcName === arguments.callee.name) {
          continue;
        }
        if (typeof eval("funcSlider." + funcName) === "function") {
          //console.log("-" + this.name + "." + funcName + "]");
          eval("funcSlider." + funcName)();
        }
      }
    }
  },

  funcSliderProgram: function () {
    console.log("[funcSlider." + arguments.callee.name + "]");
    $(".home-mv__slide.slick-initialized").slick("unslick");
    $(".home-mv__slide").slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      dots: true,
      speed: 2000,
      autoplaySpeed: 5000,
      autoplay: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      //adaptiveHeight:true
    });
  },
  funcSliderWorkListener: function () {
    console.log("[funcSlider." + arguments.callee.name + "]");
    varMediaQuery.addListener(function (e) {
      // funcSlider.funcSliderProgram();
      // if (e.matches) {
      //   // SP-unslick
      //   $("#slider_links.slick-slider").slick("unslick");
      // } else {
      //   // PC-slick
      //   funcSlider.funcSliderWork();
      // }
    });
  },
};

let funcLoad = {
  funcLoadingHide: function () {
    if ($(".home-loading").length) {
      $(".home-loading").fadeOut(2000);
    }
  },
  funcLoadingEnd: function () {
    $(".home-contents").addClass("home_loaded");
    funcSlider.funcSliderProgram();
  },
};

// スクロール中判定
// $(w).on("scroll", function () {
//   if (typeof funcScrolling === "function") {
//     funcScrolling();
//   }
// });
let _timerScrolling = false;
let funcScrolling = function () {
  document.body.classList.add("scrolling");
  if (_timerScrolling) {
    clearTimeout(_timerScrolling);
  }
  _timerScrolling = setTimeout(function () {
    document.body.classList.remove("scrolling");
  }, 300);
};

let funcDebug = {
  _TopPathName: "/",
  funcDebug: function () {
    console.log("[funcDebug." + arguments.callee.name + "]");
    // this.funcCheckBodyClassName();
    // this.funcCheckHeadTagHierarchy();
  },
  funcCheckBodyClassName: function () {
    console.log("[funcDebug." + arguments.callee.name + "] ---- start");
    let _bodyClsName = $("body").attr("class");
    var _pathName = location.pathname;
    console.log("[TopPathName] " + funcDebug._TopPathName);
    console.log("[PathName] " + _pathName);
    _bodyClsName.split(/ /).forEach(function (_bodyClassName) {
      console.log("[BodyClassName] " + _bodyClassName);
      if (_pathName.indexOf(_bodyClassName) <= -1) {
        if (_pathName === funcDebug._TopPathName && _bodyClassName === "home") {
        } else if (_bodyClassName === "detail") {
        } else if (_bodyClassName === "ie11") {
        } else {
          if (location.pathname.match(/\/_/)) {
            // url[_xxx]は無視
            console.log("-> [PASS] class check");
          } else {
            console.log("-> [NG] " + _bodyClassName);
            $("body").before(_bodyClassName);
            // alert("body.classの指定が不正確です。");
            scrollTo(0, 0);
          }
        }
      }
    });
    console.log("[funcDebug." + arguments.callee.name + "] ---- end");
  },
  funcCheckHeadTagHierarchy: function () {
    console.log("[funcDebug." + arguments.callee.name + "] ---- start");
    var _tagHierarchy = "(body)";
    var _tagNgFlag = false;
    var _tagLvSearch = 0;
    var _tags = $("body").html().match(/<h\d/g);
    var _tagCntH1 = 0;
    console.log(_tags);
    if (_tags === null) {
      _tagNgFlag = true;
      console.log("-> [NG] not found h1");
    } else {
      for (var i = 0; i < _tags.length; i++) {
        var _tagLvNow = parseInt(_tags[i].substr(-1));
        if (_tagLvNow == 1) {
          if (++_tagCntH1 > 1) {
            _tagNgFlag = true;
            console.log("-> [NG] h1 duplication");
          }
        }
        console.log("[_tagLvSearch:h" + _tagLvSearch + "][_tagLvNow:h" + _tagLvNow + "] [" + _tagLvNow + ">=" + _tagLvSearch + "+2]");
        if (_tagLvNow >= _tagLvSearch + 2) {
          _tagNgFlag = true;
          console.log("-> [NG] h" + _tagLvNow);
        }
        _tagLvSearch = _tagLvNow;
        _tagHierarchy += " > h" + _tagLvSearch + (_tagNgFlag ? "*" : "");
      }
    }
    console.log(_tagHierarchy);
    if (_tagNgFlag) {
      if (location.pathname.match(/\/_/)) {
        // url[_xxx]は無視
        console.log("-> [PASS] h1 duplication check");
        _tagNgFlag = false;
      } else {
        $("body").before(_tagHierarchy);
        // alert("h要素の順番が不正確です。");
        scrollTo(0, 0);
      }
    }
    console.log("[funcDebug." + arguments.callee.name + "] ---- end");
  },
  funcShowHeadTagHierarchy: function () {
    console.log("[funcDebug." + arguments.callee.name + "] ---- start");
    $("h2,h3,h4,h5,h6").each(function () {
      var _elem = $(this).prop("tagName");
      var _tag = $("<span>").css({ color: "#000", background: "#ff0", position: "absolute", zIndex: 10, top: "-20px", left: 0, fontSize: "14px", fontWeight: "bold" }).text(_elem);
      if ($(this).css("overflow") === "hidden") {
        _tag.css({ top: 0, left: 0 });
      }
      if ($(this).closest(".tus-vertical").length) {
        _tag.css({ top: 0, left: "-20px" });
      }
      if ($(this).css("position") === "static") {
        $(this).css({ position: "relative" });
      }
      $(this).append(_tag);
    });
    console.log("[funcDebug." + arguments.callee.name + "] ---- end");
  },
};

(function (d, w, $) {
  ("use strict");
  //ローディング5秒で強制終了
  // setTimeout(function () {
  //   $.when(
  //     funcLoad.funcLoadingHide()
  //   ).done(function(){
  //     funcLoad.funcLoadingEnd()
  //   });
  // },5000);

  // let _bodyClsName = $("body").attr("class");
  // console.log("[body." + _bodyClsName + "]");

  // [CHK] funcDebug
  if (location.hostname.match(/^localhost|^127\.0\.0\.1|\.waveltd\.work$/)) {
    funcDebug.funcDebug();
    if (location.search === "?debug=1") {
      console.log("[Debug] on");
      $.cookie("DebugShowHeadTag", true, { path: "/" });
    } else if (location.search === "?debug=0") {
      $.removeCookie("DebugShowHeadTag", { path: "/" });
      console.log("[Debug] off");
    }
    if (location.pathname === "/sample/") {
    } else if ($.cookie("DebugShowHeadTag") === undefined) {
    } else {
      funcDebug.funcShowHeadTagHierarchy();
    }
  }

  // $("[data-bgimage]").each(function () {
  //   $(this).css("background-image", $(this).attr("data-bgimage"));
  // });
  $("[data-bgimage]").each(function () {
    var bgimage = $(this).attr("data-bgimage");
    if (varMediaQuery.matches) {
      bgimage = bgimage.replace(/-pc.jpg$/, "-sp.jpg");
      $("[data-bgimage]").css("background-image", "url(" + bgimage + ")");
    } else {
      $("[data-bgimage]").css("background-image", "url(" + bgimage + ")");
    }
  });

  // 読込終了判定
  $("html").addClass("js_domload");
  $(w).on("load", function () {
    $("html").addClass("js_imgload");
    if ($("body").hasClass("sample")) {
      $("[id^='frm-']").each(function () {
        console.log($(this).attr("id"));
      });
    }

    var funcClendarSelected = function () {
      var d = new Date();
      var d_y = d.getFullYear();
      var d_m = d.getMonth() + 1;
      var yyyymm = "" + d_y + ("0" + d_m.toString()).substr(-2, 2);
      $(".home-calendar__select-option").each(function () {
        var option_ym = $(this).val();
        console.log(option_ym + ":" + yyyymm);
        if (option_ym == yyyymm) {
          $(this).closest("select").find("option").removeAttr("selected");
          $(this).prop("selected", true);
          console.log($(this).val());
        }
      });
    };

    funcClendarSelected();

    funcClendarControl();

    //ローディング処理
    // $.when(
    //   funcLoad.funcLoadingHide()
    // ).done(function(){
    //   funcLoad.funcLoadingEnd();
    // });

    //if ($("body").hasClass("ie11")) {
    //  // IE11ではload-eventが重複実行されない為
    //  // UrlHashの位置補正
    //  console.log("[ie11:UrlHash]");
    //  let _hash = d.URL.split("#")[1];
    //  if (_hash) {
    //    let _gap = parseInt($('body').css('padding-top'));
    //    $("#" + _hash).velocity('scroll', {
    //      duration: 1000,
    //      offset: _gap * -1
    //    });
    //  }
    //}
  });

  //funcScrollSetに入れると遅れて違和感があるのでこちらに
  $(w).on("scroll", function () {
    var _top = document.body.getBoundingClientRect().top;
    // var _pos_title = $('h1').offset().top + $('h1').outerHeight() - 20;
    if (_top < fixedBoxPos * -1) {
      $(".pbox_fix").addClass("pbox_fixed");
    } else {
      $(".pbox_fix").removeClass("pbox_fixed");
    }
  });

  // [InitProc]
  //$("body").attr("data-change-header", "42");
  if (typeof funcEventUtil.funcInitDrow === "function") {
    funcEventUtil.funcInitDrow(false);
  }

  // if (_bodyClsName.split(/ /).indexOf("home") > -1) {
  // }

  $("a").on("click", function () {
    var _href = $(this).attr("href");
    if (_href) {
      if (_href.match(/-open$/)) {
        var _hash = _href.substring(_href.indexOf("#"), _href.length);
        var link_id = _hash.substr(0, _hash.length - 5);
        console.log(link_id);
        if ($("[href='" + link_id + "'][data-toggle=pill]")) {
          $("[href='" + link_id + "']")
            .closest(".nav-pills")
            .attr("id", location.hash.substr(1));
        }
        $("[href='" + link_id + "']").click();

        var _gap = parseInt($("body").css("padding-top"));
        var target = $(link_id).closest(".ptab");
        target.velocity("scroll", {
          duration: 1000,
          offset: _gap * -1,
        });
      }
    }
  });

  $(".home-calendar__select").change(function () {
    funcClendarControl();
  });

  var funcClendarControl = function () {
    var target = "[data-ym=" + $(".home-calendar__select").val() + "]";
    $.when(
      $(".calendar__box").each(function () {
        $(this).hide();
      })
    ).done(function () {
      $(target).fadeIn();
    });
  };

  //ナビのメニュー切り替え
  $(".g-nav__link_btn").on("click", function () {
    var _target = $(this).attr("href");
    if (!_target) {
      _target = $(this).data("href");
    }
    if ($(this).hasClass("g-nav__link_btn_btm")) {
      $(".g-nav__block").addClass("g-nav__block_btm-up");
    } else {
      $(".g-nav__block").removeClass("g-nav__block_btm-up");
    }

    setTimeout(function () {
      if ($(".g-nav__sp-toggler").attr("aria-expanded") === "true") {
        if ($("#g-nav__box_01").hasClass("g-nav__box_active")) {
          $("html").addClass("js_toggle_open_sp");
          $("html").addClass("js_toggle_open");
        } else {
          $("html").addClass("js_toggle_open");
          $("html").removeClass("js_toggle_open_sp");
          $(".navbar-toggler-text").text("Menu");
        }
      } else {
        $("html").removeClass("js_toggle_open_sp");
        $("html").removeClass("js_toggle_open");
        $(".navbar-toggler-text").text("Menu");
      }
    }, 200);

    if ($("html").hasClass("js_toggle_open")) {
      if ($(_target).hasClass("g-nav__box_active")) {
        $(".g-nav__box").removeClass("g-nav__box_active");
        setTimeout(function () {
          $("html").removeClass("js_toggle_open");
        }, 200);
        return true;
      } else {
        $(".g-nav__link_btn").removeClass("g-nav__link_active");
        $(this).addClass("g-nav__link_active");
        $(".g-nav__box").removeClass("g-nav__box_active");
        $(_target).addClass("g-nav__box_active");

        if ($(this).hasClass("g-nav__sp-toggler")) {
          $(".g-nav__box_target").addClass("g-nav__box_active");
        }
        return false;
      }
    } else {
      // if($(_target).hasClass('g-nav__sp-toggler')){
      //   $(".navbar-toggler-text").text("Menu");
      // }
      setTimeout(function () {
        $("html").addClass("js_toggle_open");
      }, 200);
    }
    $(".g-nav__link_btn").removeClass("g-nav__link_active");
    $(this).addClass("g-nav__link_active");
    $(".g-nav__box").removeClass("g-nav__box_active");
    $(_target).addClass("g-nav__box_active");

    if ($(this).hasClass("g-nav__sp-toggler")) {
      $(".g-nav__box_target").addClass("g-nav__box_active");
    }
    return true;
  });

  $(".pcollapse__toggle").on("click", function () {
    var _target = $(this).parents(".pcollapse__box").find(".pcollapse__body");
    $(_target).collapse("toggle");

    if ($(this).attr("aria-expanded") === "true") {
      $(this).attr("aria-expanded", false);
    } else {
      $(this).attr("aria-expanded", true);
    }
  });

  $(".cookie__link").on("click", function () {
    $(".cookie").fadeOut();
    return false;
  });

  $(".ft__sns-toggle").on("click", function (e) {
    if ($(".ft__sns-blk").hasClass("ft__sns-blk_active")) {
      $(".ft__sns-blk").removeClass("ft__sns-blk_active");
    } else {
      $(this).next(".ft__sns-blk").addClass("ft__sns-blk_active");
    }
    return false;
  });

  $(d).on("click", function (event) {
    if (!$(event.target).closest(".ft__sns-blk").length) {
      $(".ft__sns-blk").removeClass("ft__sns-blk_active");
    }
  });

  $(".gnav-main .gnav-main__item1").hover(
    function () {
      $(this).find(".gnav-main__link1").addClass("active");
    },
    function () {
      $(this).find(".gnav-main__link1").removeClass("active");
    }
  );

  $(".ptab-select").change(function () {
    var _tab_target = $(this).val();
    $(_tab_target).trigger("click");
  });
  //$(window).on("resize", function () {
  //  funcSlider.funcSliderProgram();
  //});

  // $( '.ft__sns-dep' ).hover(
  //   function() {
  //     $(this).find('.ft__sns-blk').addClass('ft__sns-blk_active');
  //   },
  //   function() {
  //     $(this).find('.ft__sns-blk').removeClass('ft__sns-blk_active');
  //   }
  // );
})(document, window, jQuery);