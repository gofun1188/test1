/**
 * @file
 * A JavaScript file for the theme.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document) {
  "use strict";

  window.themeNetivism = {
    settings: {},
    path: window.location.pathname,
    qs: window.location.search,
    hash: window.location.hash,
    viewport: {
      width: $(window).width(),
      height: $(window).height()
    },
    resizeTimer: null,

    isFunction: function(obj) {
      return typeof obj === "function" && obj instanceof Function;
    },

    getViewport: function() {
      themeNetivism.viewport.width = $(window).width();
      themeNetivism.viewport.height = $(window).height();
    },

    libraries: {
      slick: function() {
        if ($.fn.slick && $(".carousel-lib-slick").length) {
          $(".carousel-lib-slick").each(function() {
            var $container = $(this),
                $slick = $container.find(".slick__slider");

            if ($slick.length) {
              if ($container.hasClass("carousel-sync-main")) {
                var $slickMainBlock = $container.closest(".block");

                if ($slickMainBlock.length) {
                  var $nextBlock = $slickMainBlock.next(".block"),
                      nextBlockID = $nextBlock.attr("id");

                  if ($nextBlock.length) {
                    var $slickNavContainer = $nextBlock.find(".carousel-lib-slick.carousel-sync-nav");

                    if ($slickNavContainer.length) {
                      var containerClassesList = $container.attr("class").split(/\s+/),
                          wrapClassesList = containerClassesList.filter(function(elem) {
                            return elem.indexOf("-carousel-main") != -1;
                          });

                      $container.after($slickNavContainer);

                      if (wrapClassesList.length) {
                        var wrapClass = wrapClassesList[0].replace("-carousel-main", "");

                        $slickMainBlock.find(".carousel-container").wrapAll("<div class='"+ wrapClass + " syncing-carousel-container'><div class='inner'></div></div>");
                        $slickMainBlock.attr({
                          "data-merge-id": nextBlockID,
                          "data-merge-type": "syncing-carousel",
                          "data-merge-state": 1,
                        });
                        $nextBlock.remove();
                      }
                    }
                  }
                }
              }
            }
          });
        }
      },
      init: function() {
        for (var key in themeNetivism.libraries) {
          var library = themeNetivism.libraries[key];

          if (themeNetivism.isFunction(library) && key !== "init") {
            library.call();
          }
        }
      }
    },

    cssVariables: {
      update: function(varName) {
        if (typeof varName !== "undefined") {
          if (varName == "--mobile-header-height") {
            if ($(".mobile-header").length) {
              var mobileHeight = $(".mobile-header").outerHeight();
              document.documentElement.style.setProperty(varName, mobileHeight + "px");
              console.log(getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height'));
            }
          }
        }
      }
    },

    rwdWrap: function(container) {
      if (typeof container !== "undefined") {
        if ($(container).length) {
          var beWrap = ["iframe", "object", "video", "embed", "table"];
          var beWrapElem = beWrap.join(", ");
          $(container).find(beWrapElem).each(function() {
            var $this = $(this),
                thisWidth = $this.attr("width"),
                thisHeight = $this.attr("height");

            if ($this.is("table")) {
              if ($this.closest(".rwd-table").length == 0) {
                $this.wrap("<div class='rwd-table'><div class='table-container'></div></div>");
              }

              if($this.closest(".table-container").length) {
                var tableWidth = $this.outerWidth(),
                    tableContainerWidth = $this.closest(".table-container").outerWidth();

                if (tableWidth > tableContainerWidth) {
                  $this.closest(".rwd-table").addClass("is-scrollable");
                  $this.closest(".table-container").on("scroll", function() {
                    var scrollLeft = this.scrollLeft,
                        maxScrollLeft = this.scrollWidth - this.clientWidth;

                    if (maxScrollLeft - scrollLeft < 1) {
                      $this.closest(".rwd-table").addClass("is-scroll-end");
                    }
                    else {
                      $this.closest(".rwd-table").removeClass("is-scroll-end");
                    }
                  });
                }
                else {
                  $this.closest(".rwd-table").removeClass("is-scrollable");
                }
              }
            }
            else {
              if (themeNetivism.viewport.width < 1024) {
                if ($this.closest(".share-item").length == 0 && $this.closest(".captcha").length == 0) {
                  if ($this.closest(".rwd-media").length == 0) {
                    if ($this.closest(".media_embed").length) {
                      $this.closest(".media_embed").wrap("<div class='rwd-media'></div>");
                    }
                    else {
                      $this.wrap("<div class='rwd-media'></div>");
                    }
                  }

                  var $wrap = $this.closest(".rwd-media");

                  if ($this.is("video")) {
                    $wrap.attr("data-ratio", "16:9");
                  }

                  if ($this.is("iframe")) {
                    var src = $this.attr("src"),
                        media = [
                          "www.youtube.com/embed",
                          "player.vimeo.com/video",
                          "www.slideshare.net/slideshow/embed_code",
                          "www.facebook.com/plugins/video.php"
                        ];
                    if (media.some(function(v) { return src.indexOf(v) >= 0; })) {
                      $wrap.attr("data-ratio", "16:9");
                    }
                  }
                }
              }
              else {
                if ($this.closest(".rwd-media").length) {
                  if ($this.closest(".media_embed").length) {
                    $this.closest(".media_embed").unwrap();
                  }
                  else {
                    $this.unwrap();
                  }
                }
              }
            }
          });
        }
      }
    },

    formElemsRebuild: function() {
      if ($(".form-item").length > 0) {
        // console.log("formElemsRebuild !!!!");
        $(".form-item input.form-radio, .form-wrapper input.form-checkbox").each(function() {
          var type = $(this).attr("type");
          var classname = "form-elem form-elem-" + type;
          if ($(this).parent("label").length > 0) {
            //console.log("1");
            $(this).parent("label").addClass(classname);
          }
          else {
            if ($(this).next("label").length > 0) {
              //console.log("2");
              var $wrap = $(this).next("label");
              $wrap.addClass(classname);
              $wrap.html("<span class='form-elem-label'>" + $wrap.html() + "</span>");
              $(this).prependTo($wrap);
            }
          }
        });

        $(".form-item select.form-select").each(function() {
          $(this).wrap("<div class='form-select-item'></div>");
        });
      }
    },

    mdInit: function() {
      if ($(".node-form").length) {
        $(".node-form").addClass("md-container md-inline-form");
      }

      if ($("form[id^='user-']").length) {
        $("form[id^='user-']").addClass("md-container");

        if ($(".crm-container").length) {
          $(".crm-container").addClass("crm-container-md");
        }
      }

      if ($(".webform-client-form").length) {
        $(".webform-client-form").addClass("md-container");
      }
    },

    noteInit: function() {
      if ($(".cavacnote").length > 0) {
        $(".cavacnote").each(function() {
          var $this = $(this);
          var title = $this.attr("popuptitle");
          var text = $this.attr("popuptext");
          var icon = "<i class='arrow fa fa-caret-down'></i>";
          var note = "<div class='note-item'>";

          if (title) {
            note += "<h5 class='note-title'>" + title + "</h5>";
          }

          if (text) {
            text = text.replace(/#BR#/gm,"<br/>");
            note += "<p class='note-text'>" + text + "</p>";
          }

          note += "</div>";

          $this.append(icon).after(note);
        });

        $(".cavacnote").on("click", function(e) {
          var $this = $(this);
          var activeClass = "is-active";
          if ($this.hasClass(activeClass)) {
            $this.removeClass(activeClass);
            $this.next(".note-item").slideUp();
            $this.children(".arrow").removeClass("fa-caret-up").addClass("fa-caret-down");
          }
          else {
            $this.addClass(activeClass);
            $this.next(".note-item").slideDown();
            $this.children(".arrow").removeClass("fa-caret-down").addClass("fa-caret-up");
          }
        });
      }
    },

    searchBoxInit: function() {
      var $searchBlock = $(".block-search");
      var $searchTextField = $(".block-search .form-text");
      if ($searchBlock.length) {
        if ($searchTextField.length) {
          $searchBlock.hover(
            function() {
              $searchTextField.focus();
            }, function() {
              $searchTextField.blur();
            }
          );

          var placeholderText = $searchTextField.is("[title]") ? $searchTextField.attr("title") : "輸入關鍵字";
          $searchTextField.attr("placeholder", "輸入關鍵字");
        }
      }

      var $mobileSearchBtn = $("#mobile-search-toggle");
      if ($mobileSearchBtn.length) {
      }
    },

    overlayInit: function() {
      console.log("overlayInit");
      var $overlay = $(".overlay-container");
      var $overlayClose = $(".overlay-container .overlay-close");
      var $overlayContent = $(".overlay-container .overlay-content");
      var targetID, $target, $targetParent, $targetPrev, $targetNext;
      var backTarget = "parent"; // parent, prev, next
      var backMethod = "append"; // append, prepend, before, after

      if ($(".js-overlay").length > 0) {
        console.log("!!");
        $(".js-overlay").on("click", function(e) {
          console.log("click...");
          var $this = $(this);
          targetID = $this.attr("data-target");
          $target = $("#" + targetID);
          $targetParent = $target.parent();
          $targetPrev = $target.prev();
          $targetNext = $target.next();
          $target.prependTo($overlayContent);
          $overlay.addClass("is-active");
          $this.addClass("is-active");

          var $searchTextField, placeholderText;
          if ($overlay.find("#block-google_cse-google_cse").length) {
            $searchTextField = $("#block-google_cse-google_cse #edit-query");
          }

          if ($overlay.find("#block-search-form").length) {
            $searchTextField = $("#block-search-form #edit-query");
          }

          if ($searchTextField.length) {
            placeholderText = $(".i18n-en").length ? "Search" : "請輸入關鍵字";
            $searchTextField.attr("placeholder", placeholderText);
          }

          if ($overlay.find(".gsc-results-close-btn").length) {
            $(".gsc-results-close-btn").trigger("click");
          }
        });
      }

      $overlayClose.on("click", function(e) {
        var $this = $(this);
        $overlay.removeClass("is-active");
        $(".js-overlay").removeClass("is-active");

        if (backTarget == "parent") {
          if (backMethod == "append") {
            $targetParent.append($target);
          }
        }
      });
    },

    backToTop: function() {
      var $backToTopBtn = $(".back-to-top");
      if ($backToTopBtn.length) {
        var scrollTrigger = 200;

        if ($("#header").length) {
          scrollTrigger = $("#header").outerHeight();
        }
        else {
          if ($(".header").length) {
            scrollTrigger = $(".header").outerHeight();
          }
        }

        $(window).on("scroll", function () {
          var scrollTop = $(window).scrollTop();
          if (scrollTop > scrollTrigger) {
            $backToTopBtn.addClass("is-active");
          }
          else {
            $backToTopBtn.removeClass("is-active");
          }
        });

        $backToTopBtn.on("click", function(e) {
          e.preventDefault();
          $("html, body").animate({
            scrollTop: 0
          }, 500);
        });
      }
    },

    mobileHeader: function() {
      var resizeObserver = new ResizeObserver(function() {
        themeNetivism.cssVariables.update("--mobile-header-height");
      });

      if ($(".mobile-header").length) {
        resizeObserver.observe($(".mobile-header")[0]);
      }
    },

    mobileNav: {
      libraries: {
        mmenu: {
          init: function() {
            if ($.fn.mmenu) {
              let options = {
                  "extensions": [
                    "pagedim-black"
                  ]
                },
                configuration = {
                  offCanvas: {
                    position  : "left",
                    pageSelector: "#page"
                  }
                },
                $mobileNav = $("#mobile-nav");

              if ($mobileNav.length) {
                let mmenu = $mobileNav.mmenu(options, configuration),
                    mmenuAPI = mmenu.data("mmenu"),
                    $mobileNavToggle = $("#mobile-nav-toggle"),
                    $mmenuNavbar = $("#mobile-nav .mm-panels > .mm-panel:first-child > .mm-navbar");

                $mobileNavToggle.on("click", function() {
                  let $this = $(this);

                  if ($this.hasClass("is-active")) {
                    mmenuAPI.close();
                  }
                  else {
                    mmenuAPI.open();
                  }
                });

                mmenuAPI.bind("open:finish", function() {
                  setTimeout(function() {
                    $mobileNavToggle.addClass("is-active");
                  }, 100);
                });

                mmenuAPI.bind("close:finish", function() {
                  $mobileNavToggle.removeClass("is-active");
                });

                if ($mmenuNavbar.length) {
                  $mmenuNavbar.html("<a href='\\' title='回首頁'><i class='zmdi zmdi-home'></i> 首頁</a>");
                }
              }
            }
          }
        },
        stMenu: {
          open: function($elem, $trigger, overlayLayer) {
            if ($elem && $elem.length) {
              let targetID = $elem.attr("id");
              $("html").addClass("st-is-opened st-is-blocked").attr("data-st-active-target", targetID);
              $elem.removeClass("is-closed").addClass("is-opened");

              if ($trigger && $trigger.length) {
                let triggerID = $trigger.attr("id");
                $("html").attr("data-st-active-trigger", triggerID);
              }

              if (overlayLayer) {
                $(".st-overlay").css("z-index", overlayLayer);
              }
            }
          },
          close: function($elem) {
            if ($elem && $elem.length) {
              $("html").removeClass("st-is-opened st-is-blocked").removeAttr("data-st-active-target data-st-active-trigger");
              $elem.removeClass("is-opened").addClass("is-closed");
              $(".st-overlay").css("z-index", "");
            }
          },
          init: function() {
            let clickEvent = "click";

            if (!$(".st-overlay").length) {
              $("body").append("<div class='st-overlay st-close'></div>");
            }

            $("body").on(clickEvent, ".st-btn", function(e) {
              e.stopPropagation();
              e.preventDefault();
              var $stBtn = $(this);
              var target = $stBtn.attr("data-st-target");

              if (target) {
                var targetSelector = "#" + target;

                $(".st-btn").not(this).removeClass("is-active");
                themeNetivism.mobileNav.libraries.stMenu.close($(".st-container").not(targetSelector));

                var $target = $(targetSelector);
                var overlayLayer = $stBtn.data("st-overlay-layer");

                if ($target.hasClass("is-opened")) {
                  themeNetivism.mobileNav.libraries.stMenu.close($target);
                  $stBtn.removeClass("is-active");
                }
                else {
                  themeNetivism.mobileNav.libraries.stMenu.open($target, $stBtn, overlayLayer);
                  $stBtn.addClass("is-active");
                }
              }
            });

            $("body").on(clickEvent, ".st-close", function(e) {
              e.stopPropagation();
              e.preventDefault();

              if ($(".st-container").hasClass("is-opened")) {
                themeNetivism.mobileNav.libraries.stMenu.close($(".st-container"));
              }
              else {
                $("html").removeClass("st-is-opened st-is-blocked");
                $(".st-overlay").css("z-index", "");
              }

              $(".st-btn").removeClass("is-active");
            });

            // Added toggle to expanded menu item
            $("#mobile-nav .menu .expanded").each(function() {
              let $li = $(this);

              if ($li.hasClass("active-trail")) {
                $li.children(".menu").addClass("is-active");
                $li.append("<a href='#' class='expand-toggle is-active'><i class='zmdi zmdi-chevron-up' aria-hidden='true'></i></a>")
              }
              else {
                $li.append("<a href='#' class='expand-toggle'><i class='zmdi zmdi-chevron-down' aria-hidden='true'></i></a>")
              }
            });

            // Add click event to toggle of expanded menu item
            $("#mobile-nav").on(clickEvent, ".expand-toggle", function(e) {
              e.stopPropagation();
              e.preventDefault();

              var $toggle = $(this),
                  $childMenu = $toggle.prev(".menu");

              $("#mobile-nav .menu .expanded > .menu-expand i").removeClass("zmdi-chevron-up").addClass("zmdi-chevron-down");

              if ($childMenu.is(':visible')) {
                $toggle.removeClass("is-active");
                $childMenu.removeClass("is-active").slideUp();
                $toggle.children("i").removeClass("zmdi-chevron-up").addClass("zmdi-chevron-down");
              }
              else {
                $toggle.addClass("is-active");
                $childMenu.addClass("is-active").slideDown();
                $toggle.children("i").removeClass("zmdi-chevron-down").addClass("zmdi-chevron-up");
              }
            });
          }
        }
      },
      init: function() {
        if (themeNetivism.settings.netivism_mobile_nav_mode && themeNetivism.settings.netivism_mobile_nav_mode != "none") {
          let mobileNavMode = themeNetivism.settings.netivism_mobile_nav_mode.replace(/_/g, "-");
          $("body").addClass("mobile-nav-mode--" + mobileNavMode);

          if (themeNetivism.settings.netivism_mobile_nav_mode == "mmenu") {
            themeNetivism.mobileNav.libraries.mmenu.init();
          }

          if (themeNetivism.settings.netivism_mobile_nav_mode.indexOf("overlay") != -1) {
            themeNetivism.mobileNav.libraries.stMenu.init();
          }
        }
      }
    },

    crmStyleSwitch: function(style) {
      var style = typeof style !== undefined ? style : "md",
          $crmContainer = $(".crm-container"),
          styleClass = "crm-container-" + style,
          mdClass = "crm-container-md",
          rcClass = "crm-container-rc";

      if ($crmContainer.length) {
        if (style == "md") {
          $crmContainer.removeClass(rcClass).addClass(mdClass);
        }
        if (style == "rc") {
          $crmContainer.removeClass(mdClass).addClass(rcClass);
        }
      }
    },

    rwdEvent: function(vw) {
      var $body = $("body");
      var $header = $("#header");

      if ($(".node-content").length) {
        themeNetivism.rwdWrap(".node-content");
      }
    },

    windowResize: function() {
      console.log("window resize");
      themeNetivism.getViewport();
      themeNetivism.rwdEvent(themeNetivism.viewport.width);
      console.log(themeNetivism.viewport);
    },

    init: function(drupalContext, drupalSettings) {
      themeNetivism.settings = drupalSettings.theme_netivism_settings;
      themeNetivism.rwdEvent(themeNetivism.viewport.width);
      // themeNetivism.noteInit();
      // themeNetivism.searchBoxInit();
      // themeNetivism.mdInit();
      themeNetivism.libraries.init();
      themeNetivism.formElemsRebuild();
      themeNetivism.mobileHeader();
      themeNetivism.mobileNav.init();
      themeNetivism.backToTop();
      themeNetivism.overlayInit();

      console.log("themeNetivism init");
    }
  };

  // To understand behaviors, see https://drupal.org/node/756722#behaviors
  Drupal.behaviors.ourisland2018 = {
    attach: function (context, settings) {
      // Do your stuff!
      // document ready
      $(document).ready(function() {
        themeNetivism.init(context, settings);
      });

      // window resize
      $(window).resize(function() {
        clearTimeout(themeNetivism.resizeTimer);
        themeNetivism.resizeTimer = setTimeout(themeNetivism.windowResize, 250);
      });
    },
    detach: function (context, settings, trigger) {
      // Undo something.
    }
  };

})(jQuery, Drupal, this, this.document);;
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.moment=t()}(this,function(){"use strict";var H;function f(){return H.apply(null,arguments)}function a(e){return e instanceof Array||"[object Array]"===Object.prototype.toString.call(e)}function F(e){return null!=e&&"[object Object]"===Object.prototype.toString.call(e)}function c(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function L(e){if(Object.getOwnPropertyNames)return 0===Object.getOwnPropertyNames(e).length;for(var t in e)if(c(e,t))return;return 1}function o(e){return void 0===e}function u(e){return"number"==typeof e||"[object Number]"===Object.prototype.toString.call(e)}function V(e){return e instanceof Date||"[object Date]"===Object.prototype.toString.call(e)}function G(e,t){for(var n=[],s=e.length,i=0;i<s;++i)n.push(t(e[i],i));return n}function E(e,t){for(var n in t)c(t,n)&&(e[n]=t[n]);return c(t,"toString")&&(e.toString=t.toString),c(t,"valueOf")&&(e.valueOf=t.valueOf),e}function l(e,t,n,s){return Pt(e,t,n,s,!0).utc()}function m(e){return null==e._pf&&(e._pf={empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidEra:null,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1,parsedDateParts:[],era:null,meridiem:null,rfc2822:!1,weekdayMismatch:!1}),e._pf}function A(e){if(null==e._isValid){var t=m(e),n=j.call(t.parsedDateParts,function(e){return null!=e}),n=!isNaN(e._d.getTime())&&t.overflow<0&&!t.empty&&!t.invalidEra&&!t.invalidMonth&&!t.invalidWeekday&&!t.weekdayMismatch&&!t.nullInput&&!t.invalidFormat&&!t.userInvalidated&&(!t.meridiem||t.meridiem&&n);if(e._strict&&(n=n&&0===t.charsLeftOver&&0===t.unusedTokens.length&&void 0===t.bigHour),null!=Object.isFrozen&&Object.isFrozen(e))return n;e._isValid=n}return e._isValid}function I(e){var t=l(NaN);return null!=e?E(m(t),e):m(t).userInvalidated=!0,t}var j=Array.prototype.some||function(e){for(var t=Object(this),n=t.length>>>0,s=0;s<n;s++)if(s in t&&e.call(this,t[s],s,t))return!0;return!1},Z=f.momentProperties=[],z=!1;function $(e,t){var n,s,i,r=Z.length;if(o(t._isAMomentObject)||(e._isAMomentObject=t._isAMomentObject),o(t._i)||(e._i=t._i),o(t._f)||(e._f=t._f),o(t._l)||(e._l=t._l),o(t._strict)||(e._strict=t._strict),o(t._tzm)||(e._tzm=t._tzm),o(t._isUTC)||(e._isUTC=t._isUTC),o(t._offset)||(e._offset=t._offset),o(t._pf)||(e._pf=m(t)),o(t._locale)||(e._locale=t._locale),0<r)for(n=0;n<r;n++)o(i=t[s=Z[n]])||(e[s]=i);return e}function q(e){$(this,e),this._d=new Date(null!=e._d?e._d.getTime():NaN),this.isValid()||(this._d=new Date(NaN)),!1===z&&(z=!0,f.updateOffset(this),z=!1)}function h(e){return e instanceof q||null!=e&&null!=e._isAMomentObject}function B(e){!1===f.suppressDeprecationWarnings&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+e)}function e(r,a){var o=!0;return E(function(){if(null!=f.deprecationHandler&&f.deprecationHandler(null,r),o){for(var e,t,n=[],s=arguments.length,i=0;i<s;i++){if(e="","object"==typeof arguments[i]){for(t in e+="\n["+i+"] ",arguments[0])c(arguments[0],t)&&(e+=t+": "+arguments[0][t]+", ");e=e.slice(0,-2)}else e=arguments[i];n.push(e)}B(r+"\nArguments: "+Array.prototype.slice.call(n).join("")+"\n"+(new Error).stack),o=!1}return a.apply(this,arguments)},a)}var J={};function Q(e,t){null!=f.deprecationHandler&&f.deprecationHandler(e,t),J[e]||(B(t),J[e]=!0)}function d(e){return"undefined"!=typeof Function&&e instanceof Function||"[object Function]"===Object.prototype.toString.call(e)}function X(e,t){var n,s=E({},e);for(n in t)c(t,n)&&(F(e[n])&&F(t[n])?(s[n]={},E(s[n],e[n]),E(s[n],t[n])):null!=t[n]?s[n]=t[n]:delete s[n]);for(n in e)c(e,n)&&!c(t,n)&&F(e[n])&&(s[n]=E({},s[n]));return s}function K(e){null!=e&&this.set(e)}f.suppressDeprecationWarnings=!1,f.deprecationHandler=null;var ee=Object.keys||function(e){var t,n=[];for(t in e)c(e,t)&&n.push(t);return n};function r(e,t,n){var s=""+Math.abs(e);return(0<=e?n?"+":"":"-")+Math.pow(10,Math.max(0,t-s.length)).toString().substr(1)+s}var te=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,ne=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,se={},ie={};function s(e,t,n,s){var i="string"==typeof s?function(){return this[s]()}:s;e&&(ie[e]=i),t&&(ie[t[0]]=function(){return r(i.apply(this,arguments),t[1],t[2])}),n&&(ie[n]=function(){return this.localeData().ordinal(i.apply(this,arguments),e)})}function re(e,t){return e.isValid()?(t=ae(t,e.localeData()),se[t]=se[t]||function(s){for(var e,i=s.match(te),t=0,r=i.length;t<r;t++)ie[i[t]]?i[t]=ie[i[t]]:i[t]=(e=i[t]).match(/\[[\s\S]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"");return function(e){for(var t="",n=0;n<r;n++)t+=d(i[n])?i[n].call(e,s):i[n];return t}}(t),se[t](e)):e.localeData().invalidDate()}function ae(e,t){var n=5;function s(e){return t.longDateFormat(e)||e}for(ne.lastIndex=0;0<=n&&ne.test(e);)e=e.replace(ne,s),ne.lastIndex=0,--n;return e}var oe={};function t(e,t){var n=e.toLowerCase();oe[n]=oe[n+"s"]=oe[t]=e}function _(e){return"string"==typeof e?oe[e]||oe[e.toLowerCase()]:void 0}function ue(e){var t,n,s={};for(n in e)c(e,n)&&(t=_(n))&&(s[t]=e[n]);return s}var le={};function n(e,t){le[e]=t}function he(e){return e%4==0&&e%100!=0||e%400==0}function y(e){return e<0?Math.ceil(e)||0:Math.floor(e)}function g(e){var e=+e,t=0;return t=0!=e&&isFinite(e)?y(e):t}function de(t,n){return function(e){return null!=e?(fe(this,t,e),f.updateOffset(this,n),this):ce(this,t)}}function ce(e,t){return e.isValid()?e._d["get"+(e._isUTC?"UTC":"")+t]():NaN}function fe(e,t,n){e.isValid()&&!isNaN(n)&&("FullYear"===t&&he(e.year())&&1===e.month()&&29===e.date()?(n=g(n),e._d["set"+(e._isUTC?"UTC":"")+t](n,e.month(),We(n,e.month()))):e._d["set"+(e._isUTC?"UTC":"")+t](n))}var i=/\d/,w=/\d\d/,me=/\d{3}/,_e=/\d{4}/,ye=/[+-]?\d{6}/,p=/\d\d?/,ge=/\d\d\d\d?/,we=/\d\d\d\d\d\d?/,pe=/\d{1,3}/,ke=/\d{1,4}/,ve=/[+-]?\d{1,6}/,Me=/\d+/,De=/[+-]?\d+/,Se=/Z|[+-]\d\d:?\d\d/gi,Ye=/Z|[+-]\d\d(?::?\d\d)?/gi,k=/[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;function v(e,n,s){be[e]=d(n)?n:function(e,t){return e&&s?s:n}}function Oe(e,t){return c(be,e)?be[e](t._strict,t._locale):new RegExp(M(e.replace("\\","").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(e,t,n,s,i){return t||n||s||i})))}function M(e){return e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var be={},xe={};function D(e,n){var t,s,i=n;for("string"==typeof e&&(e=[e]),u(n)&&(i=function(e,t){t[n]=g(e)}),s=e.length,t=0;t<s;t++)xe[e[t]]=i}function Te(e,i){D(e,function(e,t,n,s){n._w=n._w||{},i(e,n._w,n,s)})}var S,Y=0,O=1,b=2,x=3,T=4,N=5,Ne=6,Pe=7,Re=8;function We(e,t){if(isNaN(e)||isNaN(t))return NaN;var n=(t%(n=12)+n)%n;return e+=(t-n)/12,1==n?he(e)?29:28:31-n%7%2}S=Array.prototype.indexOf||function(e){for(var t=0;t<this.length;++t)if(this[t]===e)return t;return-1},s("M",["MM",2],"Mo",function(){return this.month()+1}),s("MMM",0,0,function(e){return this.localeData().monthsShort(this,e)}),s("MMMM",0,0,function(e){return this.localeData().months(this,e)}),t("month","M"),n("month",8),v("M",p),v("MM",p,w),v("MMM",function(e,t){return t.monthsShortRegex(e)}),v("MMMM",function(e,t){return t.monthsRegex(e)}),D(["M","MM"],function(e,t){t[O]=g(e)-1}),D(["MMM","MMMM"],function(e,t,n,s){s=n._locale.monthsParse(e,s,n._strict);null!=s?t[O]=s:m(n).invalidMonth=e});var Ce="January_February_March_April_May_June_July_August_September_October_November_December".split("_"),Ue="Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),He=/D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,Fe=k,Le=k;function Ve(e,t){var n;if(e.isValid()){if("string"==typeof t)if(/^\d+$/.test(t))t=g(t);else if(!u(t=e.localeData().monthsParse(t)))return;n=Math.min(e.date(),We(e.year(),t)),e._d["set"+(e._isUTC?"UTC":"")+"Month"](t,n)}}function Ge(e){return null!=e?(Ve(this,e),f.updateOffset(this,!0),this):ce(this,"Month")}function Ee(){function e(e,t){return t.length-e.length}for(var t,n=[],s=[],i=[],r=0;r<12;r++)t=l([2e3,r]),n.push(this.monthsShort(t,"")),s.push(this.months(t,"")),i.push(this.months(t,"")),i.push(this.monthsShort(t,""));for(n.sort(e),s.sort(e),i.sort(e),r=0;r<12;r++)n[r]=M(n[r]),s[r]=M(s[r]);for(r=0;r<24;r++)i[r]=M(i[r]);this._monthsRegex=new RegExp("^("+i.join("|")+")","i"),this._monthsShortRegex=this._monthsRegex,this._monthsStrictRegex=new RegExp("^("+s.join("|")+")","i"),this._monthsShortStrictRegex=new RegExp("^("+n.join("|")+")","i")}function Ae(e){return he(e)?366:365}s("Y",0,0,function(){var e=this.year();return e<=9999?r(e,4):"+"+e}),s(0,["YY",2],0,function(){return this.year()%100}),s(0,["YYYY",4],0,"year"),s(0,["YYYYY",5],0,"year"),s(0,["YYYYYY",6,!0],0,"year"),t("year","y"),n("year",1),v("Y",De),v("YY",p,w),v("YYYY",ke,_e),v("YYYYY",ve,ye),v("YYYYYY",ve,ye),D(["YYYYY","YYYYYY"],Y),D("YYYY",function(e,t){t[Y]=2===e.length?f.parseTwoDigitYear(e):g(e)}),D("YY",function(e,t){t[Y]=f.parseTwoDigitYear(e)}),D("Y",function(e,t){t[Y]=parseInt(e,10)}),f.parseTwoDigitYear=function(e){return g(e)+(68<g(e)?1900:2e3)};var Ie=de("FullYear",!0);function je(e,t,n,s,i,r,a){var o;return e<100&&0<=e?(o=new Date(e+400,t,n,s,i,r,a),isFinite(o.getFullYear())&&o.setFullYear(e)):o=new Date(e,t,n,s,i,r,a),o}function Ze(e){var t;return e<100&&0<=e?((t=Array.prototype.slice.call(arguments))[0]=e+400,t=new Date(Date.UTC.apply(null,t)),isFinite(t.getUTCFullYear())&&t.setUTCFullYear(e)):t=new Date(Date.UTC.apply(null,arguments)),t}function ze(e,t,n){n=7+t-n;return n-(7+Ze(e,0,n).getUTCDay()-t)%7-1}function $e(e,t,n,s,i){var r,t=1+7*(t-1)+(7+n-s)%7+ze(e,s,i),n=t<=0?Ae(r=e-1)+t:t>Ae(e)?(r=e+1,t-Ae(e)):(r=e,t);return{year:r,dayOfYear:n}}function qe(e,t,n){var s,i,r=ze(e.year(),t,n),r=Math.floor((e.dayOfYear()-r-1)/7)+1;return r<1?s=r+P(i=e.year()-1,t,n):r>P(e.year(),t,n)?(s=r-P(e.year(),t,n),i=e.year()+1):(i=e.year(),s=r),{week:s,year:i}}function P(e,t,n){var s=ze(e,t,n),t=ze(e+1,t,n);return(Ae(e)-s+t)/7}s("w",["ww",2],"wo","week"),s("W",["WW",2],"Wo","isoWeek"),t("week","w"),t("isoWeek","W"),n("week",5),n("isoWeek",5),v("w",p),v("ww",p,w),v("W",p),v("WW",p,w),Te(["w","ww","W","WW"],function(e,t,n,s){t[s.substr(0,1)]=g(e)});function Be(e,t){return e.slice(t,7).concat(e.slice(0,t))}s("d",0,"do","day"),s("dd",0,0,function(e){return this.localeData().weekdaysMin(this,e)}),s("ddd",0,0,function(e){return this.localeData().weekdaysShort(this,e)}),s("dddd",0,0,function(e){return this.localeData().weekdays(this,e)}),s("e",0,0,"weekday"),s("E",0,0,"isoWeekday"),t("day","d"),t("weekday","e"),t("isoWeekday","E"),n("day",11),n("weekday",11),n("isoWeekday",11),v("d",p),v("e",p),v("E",p),v("dd",function(e,t){return t.weekdaysMinRegex(e)}),v("ddd",function(e,t){return t.weekdaysShortRegex(e)}),v("dddd",function(e,t){return t.weekdaysRegex(e)}),Te(["dd","ddd","dddd"],function(e,t,n,s){s=n._locale.weekdaysParse(e,s,n._strict);null!=s?t.d=s:m(n).invalidWeekday=e}),Te(["d","e","E"],function(e,t,n,s){t[s]=g(e)});var Je="Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),Qe="Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),Xe="Su_Mo_Tu_We_Th_Fr_Sa".split("_"),Ke=k,et=k,tt=k;function nt(){function e(e,t){return t.length-e.length}for(var t,n,s,i=[],r=[],a=[],o=[],u=0;u<7;u++)s=l([2e3,1]).day(u),t=M(this.weekdaysMin(s,"")),n=M(this.weekdaysShort(s,"")),s=M(this.weekdays(s,"")),i.push(t),r.push(n),a.push(s),o.push(t),o.push(n),o.push(s);i.sort(e),r.sort(e),a.sort(e),o.sort(e),this._weekdaysRegex=new RegExp("^("+o.join("|")+")","i"),this._weekdaysShortRegex=this._weekdaysRegex,this._weekdaysMinRegex=this._weekdaysRegex,this._weekdaysStrictRegex=new RegExp("^("+a.join("|")+")","i"),this._weekdaysShortStrictRegex=new RegExp("^("+r.join("|")+")","i"),this._weekdaysMinStrictRegex=new RegExp("^("+i.join("|")+")","i")}function st(){return this.hours()%12||12}function it(e,t){s(e,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),t)})}function rt(e,t){return t._meridiemParse}s("H",["HH",2],0,"hour"),s("h",["hh",2],0,st),s("k",["kk",2],0,function(){return this.hours()||24}),s("hmm",0,0,function(){return""+st.apply(this)+r(this.minutes(),2)}),s("hmmss",0,0,function(){return""+st.apply(this)+r(this.minutes(),2)+r(this.seconds(),2)}),s("Hmm",0,0,function(){return""+this.hours()+r(this.minutes(),2)}),s("Hmmss",0,0,function(){return""+this.hours()+r(this.minutes(),2)+r(this.seconds(),2)}),it("a",!0),it("A",!1),t("hour","h"),n("hour",13),v("a",rt),v("A",rt),v("H",p),v("h",p),v("k",p),v("HH",p,w),v("hh",p,w),v("kk",p,w),v("hmm",ge),v("hmmss",we),v("Hmm",ge),v("Hmmss",we),D(["H","HH"],x),D(["k","kk"],function(e,t,n){e=g(e);t[x]=24===e?0:e}),D(["a","A"],function(e,t,n){n._isPm=n._locale.isPM(e),n._meridiem=e}),D(["h","hh"],function(e,t,n){t[x]=g(e),m(n).bigHour=!0}),D("hmm",function(e,t,n){var s=e.length-2;t[x]=g(e.substr(0,s)),t[T]=g(e.substr(s)),m(n).bigHour=!0}),D("hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[x]=g(e.substr(0,s)),t[T]=g(e.substr(s,2)),t[N]=g(e.substr(i)),m(n).bigHour=!0}),D("Hmm",function(e,t,n){var s=e.length-2;t[x]=g(e.substr(0,s)),t[T]=g(e.substr(s))}),D("Hmmss",function(e,t,n){var s=e.length-4,i=e.length-2;t[x]=g(e.substr(0,s)),t[T]=g(e.substr(s,2)),t[N]=g(e.substr(i))});k=de("Hours",!0);var at,ot={calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},invalidDate:"Invalid date",ordinal:"%d",dayOfMonthOrdinalParse:/\d{1,2}/,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",ss:"%d seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",w:"a week",ww:"%d weeks",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},months:Ce,monthsShort:Ue,week:{dow:0,doy:6},weekdays:Je,weekdaysMin:Xe,weekdaysShort:Qe,meridiemParse:/[ap]\.?m?\.?/i},R={},ut={};function lt(e){return e&&e.toLowerCase().replace("_","-")}function ht(e){for(var t,n,s,i,r=0;r<e.length;){for(t=(i=lt(e[r]).split("-")).length,n=(n=lt(e[r+1]))?n.split("-"):null;0<t;){if(s=dt(i.slice(0,t).join("-")))return s;if(n&&n.length>=t&&function(e,t){for(var n=Math.min(e.length,t.length),s=0;s<n;s+=1)if(e[s]!==t[s])return s;return n}(i,n)>=t-1)break;t--}r++}return at}function dt(t){var e;if(void 0===R[t]&&"undefined"!=typeof module&&module&&module.exports&&null!=t.match("^[^/\\\\]*$"))try{e=at._abbr,require("./locale/"+t),ct(e)}catch(e){R[t]=null}return R[t]}function ct(e,t){return e&&((t=o(t)?mt(e):ft(e,t))?at=t:"undefined"!=typeof console&&console.warn&&console.warn("Locale "+e+" not found. Did you forget to load it?")),at._abbr}function ft(e,t){if(null===t)return delete R[e],null;var n,s=ot;if(t.abbr=e,null!=R[e])Q("defineLocaleOverride","use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),s=R[e]._config;else if(null!=t.parentLocale)if(null!=R[t.parentLocale])s=R[t.parentLocale]._config;else{if(null==(n=dt(t.parentLocale)))return ut[t.parentLocale]||(ut[t.parentLocale]=[]),ut[t.parentLocale].push({name:e,config:t}),null;s=n._config}return R[e]=new K(X(s,t)),ut[e]&&ut[e].forEach(function(e){ft(e.name,e.config)}),ct(e),R[e]}function mt(e){var t;if(!(e=e&&e._locale&&e._locale._abbr?e._locale._abbr:e))return at;if(!a(e)){if(t=dt(e))return t;e=[e]}return ht(e)}function _t(e){var t=e._a;return t&&-2===m(e).overflow&&(t=t[O]<0||11<t[O]?O:t[b]<1||t[b]>We(t[Y],t[O])?b:t[x]<0||24<t[x]||24===t[x]&&(0!==t[T]||0!==t[N]||0!==t[Ne])?x:t[T]<0||59<t[T]?T:t[N]<0||59<t[N]?N:t[Ne]<0||999<t[Ne]?Ne:-1,m(e)._overflowDayOfYear&&(t<Y||b<t)&&(t=b),m(e)._overflowWeeks&&-1===t&&(t=Pe),m(e)._overflowWeekday&&-1===t&&(t=Re),m(e).overflow=t),e}var yt=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,gt=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,wt=/Z|[+-]\d\d(?::?\d\d)?/,pt=[["YYYYYY-MM-DD",/[+-]\d{6}-\d\d-\d\d/],["YYYY-MM-DD",/\d{4}-\d\d-\d\d/],["GGGG-[W]WW-E",/\d{4}-W\d\d-\d/],["GGGG-[W]WW",/\d{4}-W\d\d/,!1],["YYYY-DDD",/\d{4}-\d{3}/],["YYYY-MM",/\d{4}-\d\d/,!1],["YYYYYYMMDD",/[+-]\d{10}/],["YYYYMMDD",/\d{8}/],["GGGG[W]WWE",/\d{4}W\d{3}/],["GGGG[W]WW",/\d{4}W\d{2}/,!1],["YYYYDDD",/\d{7}/],["YYYYMM",/\d{6}/,!1],["YYYY",/\d{4}/,!1]],kt=[["HH:mm:ss.SSSS",/\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss,SSSS",/\d\d:\d\d:\d\d,\d+/],["HH:mm:ss",/\d\d:\d\d:\d\d/],["HH:mm",/\d\d:\d\d/],["HHmmss.SSSS",/\d\d\d\d\d\d\.\d+/],["HHmmss,SSSS",/\d\d\d\d\d\d,\d+/],["HHmmss",/\d\d\d\d\d\d/],["HHmm",/\d\d\d\d/],["HH",/\d\d/]],vt=/^\/?Date\((-?\d+)/i,Mt=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,Dt={UT:0,GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function St(e){var t,n,s,i,r,a,o=e._i,u=yt.exec(o)||gt.exec(o),o=pt.length,l=kt.length;if(u){for(m(e).iso=!0,t=0,n=o;t<n;t++)if(pt[t][1].exec(u[1])){i=pt[t][0],s=!1!==pt[t][2];break}if(null==i)e._isValid=!1;else{if(u[3]){for(t=0,n=l;t<n;t++)if(kt[t][1].exec(u[3])){r=(u[2]||" ")+kt[t][0];break}if(null==r)return void(e._isValid=!1)}if(s||null==r){if(u[4]){if(!wt.exec(u[4]))return void(e._isValid=!1);a="Z"}e._f=i+(r||"")+(a||""),Tt(e)}else e._isValid=!1}}else e._isValid=!1}function Yt(e,t,n,s,i,r){e=[function(e){e=parseInt(e,10);{if(e<=49)return 2e3+e;if(e<=999)return 1900+e}return e}(e),Ue.indexOf(t),parseInt(n,10),parseInt(s,10),parseInt(i,10)];return r&&e.push(parseInt(r,10)),e}function Ot(e){var t,n,s,i,r=Mt.exec(e._i.replace(/\([^()]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").replace(/^\s\s*/,"").replace(/\s\s*$/,""));r?(t=Yt(r[4],r[3],r[2],r[5],r[6],r[7]),n=r[1],s=t,i=e,n&&Qe.indexOf(n)!==new Date(s[0],s[1],s[2]).getDay()?(m(i).weekdayMismatch=!0,i._isValid=!1):(e._a=t,e._tzm=(n=r[8],s=r[9],i=r[10],n?Dt[n]:s?0:60*(((n=parseInt(i,10))-(s=n%100))/100)+s),e._d=Ze.apply(null,e._a),e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),m(e).rfc2822=!0)):e._isValid=!1}function bt(e,t,n){return null!=e?e:null!=t?t:n}function xt(e){var t,n,s,i,r,a,o,u,l,h,d,c=[];if(!e._d){for(s=e,i=new Date(f.now()),n=s._useUTC?[i.getUTCFullYear(),i.getUTCMonth(),i.getUTCDate()]:[i.getFullYear(),i.getMonth(),i.getDate()],e._w&&null==e._a[b]&&null==e._a[O]&&(null!=(i=(s=e)._w).GG||null!=i.W||null!=i.E?(u=1,l=4,r=bt(i.GG,s._a[Y],qe(W(),1,4).year),a=bt(i.W,1),((o=bt(i.E,1))<1||7<o)&&(h=!0)):(u=s._locale._week.dow,l=s._locale._week.doy,d=qe(W(),u,l),r=bt(i.gg,s._a[Y],d.year),a=bt(i.w,d.week),null!=i.d?((o=i.d)<0||6<o)&&(h=!0):null!=i.e?(o=i.e+u,(i.e<0||6<i.e)&&(h=!0)):o=u),a<1||a>P(r,u,l)?m(s)._overflowWeeks=!0:null!=h?m(s)._overflowWeekday=!0:(d=$e(r,a,o,u,l),s._a[Y]=d.year,s._dayOfYear=d.dayOfYear)),null!=e._dayOfYear&&(i=bt(e._a[Y],n[Y]),(e._dayOfYear>Ae(i)||0===e._dayOfYear)&&(m(e)._overflowDayOfYear=!0),h=Ze(i,0,e._dayOfYear),e._a[O]=h.getUTCMonth(),e._a[b]=h.getUTCDate()),t=0;t<3&&null==e._a[t];++t)e._a[t]=c[t]=n[t];for(;t<7;t++)e._a[t]=c[t]=null==e._a[t]?2===t?1:0:e._a[t];24===e._a[x]&&0===e._a[T]&&0===e._a[N]&&0===e._a[Ne]&&(e._nextDay=!0,e._a[x]=0),e._d=(e._useUTC?Ze:je).apply(null,c),r=e._useUTC?e._d.getUTCDay():e._d.getDay(),null!=e._tzm&&e._d.setUTCMinutes(e._d.getUTCMinutes()-e._tzm),e._nextDay&&(e._a[x]=24),e._w&&void 0!==e._w.d&&e._w.d!==r&&(m(e).weekdayMismatch=!0)}}function Tt(e){if(e._f===f.ISO_8601)St(e);else if(e._f===f.RFC_2822)Ot(e);else{e._a=[],m(e).empty=!0;for(var t,n,s,i,r,a=""+e._i,o=a.length,u=0,l=ae(e._f,e._locale).match(te)||[],h=l.length,d=0;d<h;d++)n=l[d],(t=(a.match(Oe(n,e))||[])[0])&&(0<(s=a.substr(0,a.indexOf(t))).length&&m(e).unusedInput.push(s),a=a.slice(a.indexOf(t)+t.length),u+=t.length),ie[n]?(t?m(e).empty=!1:m(e).unusedTokens.push(n),s=n,r=e,null!=(i=t)&&c(xe,s)&&xe[s](i,r._a,r,s)):e._strict&&!t&&m(e).unusedTokens.push(n);m(e).charsLeftOver=o-u,0<a.length&&m(e).unusedInput.push(a),e._a[x]<=12&&!0===m(e).bigHour&&0<e._a[x]&&(m(e).bigHour=void 0),m(e).parsedDateParts=e._a.slice(0),m(e).meridiem=e._meridiem,e._a[x]=function(e,t,n){if(null==n)return t;return null!=e.meridiemHour?e.meridiemHour(t,n):null!=e.isPM?((e=e.isPM(n))&&t<12&&(t+=12),t=e||12!==t?t:0):t}(e._locale,e._a[x],e._meridiem),null!==(o=m(e).era)&&(e._a[Y]=e._locale.erasConvertYear(o,e._a[Y])),xt(e),_t(e)}}function Nt(e){var t,n,s,i=e._i,r=e._f;if(e._locale=e._locale||mt(e._l),null===i||void 0===r&&""===i)return I({nullInput:!0});if("string"==typeof i&&(e._i=i=e._locale.preparse(i)),h(i))return new q(_t(i));if(V(i))e._d=i;else if(a(r))!function(e){var t,n,s,i,r,a,o=!1,u=e._f.length;if(0===u)return m(e).invalidFormat=!0,e._d=new Date(NaN);for(i=0;i<u;i++)r=0,a=!1,t=$({},e),null!=e._useUTC&&(t._useUTC=e._useUTC),t._f=e._f[i],Tt(t),A(t)&&(a=!0),r=(r+=m(t).charsLeftOver)+10*m(t).unusedTokens.length,m(t).score=r,o?r<s&&(s=r,n=t):(null==s||r<s||a)&&(s=r,n=t,a&&(o=!0));E(e,n||t)}(e);else if(r)Tt(e);else if(o(r=(i=e)._i))i._d=new Date(f.now());else V(r)?i._d=new Date(r.valueOf()):"string"==typeof r?(n=i,null!==(t=vt.exec(n._i))?n._d=new Date(+t[1]):(St(n),!1===n._isValid&&(delete n._isValid,Ot(n),!1===n._isValid&&(delete n._isValid,n._strict?n._isValid=!1:f.createFromInputFallback(n))))):a(r)?(i._a=G(r.slice(0),function(e){return parseInt(e,10)}),xt(i)):F(r)?(t=i)._d||(s=void 0===(n=ue(t._i)).day?n.date:n.day,t._a=G([n.year,n.month,s,n.hour,n.minute,n.second,n.millisecond],function(e){return e&&parseInt(e,10)}),xt(t)):u(r)?i._d=new Date(r):f.createFromInputFallback(i);return A(e)||(e._d=null),e}function Pt(e,t,n,s,i){var r={};return!0!==t&&!1!==t||(s=t,t=void 0),!0!==n&&!1!==n||(s=n,n=void 0),(F(e)&&L(e)||a(e)&&0===e.length)&&(e=void 0),r._isAMomentObject=!0,r._useUTC=r._isUTC=i,r._l=n,r._i=e,r._f=t,r._strict=s,(i=new q(_t(Nt(i=r))))._nextDay&&(i.add(1,"d"),i._nextDay=void 0),i}function W(e,t,n,s){return Pt(e,t,n,s,!1)}f.createFromInputFallback=e("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",function(e){e._d=new Date(e._i+(e._useUTC?" UTC":""))}),f.ISO_8601=function(){},f.RFC_2822=function(){};ge=e("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=W.apply(null,arguments);return this.isValid()&&e.isValid()?e<this?this:e:I()}),we=e("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",function(){var e=W.apply(null,arguments);return this.isValid()&&e.isValid()?this<e?this:e:I()});function Rt(e,t){var n,s;if(!(t=1===t.length&&a(t[0])?t[0]:t).length)return W();for(n=t[0],s=1;s<t.length;++s)t[s].isValid()&&!t[s][e](n)||(n=t[s]);return n}var Wt=["year","quarter","month","week","day","hour","minute","second","millisecond"];function Ct(e){var e=ue(e),t=e.year||0,n=e.quarter||0,s=e.month||0,i=e.week||e.isoWeek||0,r=e.day||0,a=e.hour||0,o=e.minute||0,u=e.second||0,l=e.millisecond||0;this._isValid=function(e){var t,n,s=!1,i=Wt.length;for(t in e)if(c(e,t)&&(-1===S.call(Wt,t)||null!=e[t]&&isNaN(e[t])))return!1;for(n=0;n<i;++n)if(e[Wt[n]]){if(s)return!1;parseFloat(e[Wt[n]])!==g(e[Wt[n]])&&(s=!0)}return!0}(e),this._milliseconds=+l+1e3*u+6e4*o+1e3*a*60*60,this._days=+r+7*i,this._months=+s+3*n+12*t,this._data={},this._locale=mt(),this._bubble()}function Ut(e){return e instanceof Ct}function Ht(e){return e<0?-1*Math.round(-1*e):Math.round(e)}function Ft(e,n){s(e,0,0,function(){var e=this.utcOffset(),t="+";return e<0&&(e=-e,t="-"),t+r(~~(e/60),2)+n+r(~~e%60,2)})}Ft("Z",":"),Ft("ZZ",""),v("Z",Ye),v("ZZ",Ye),D(["Z","ZZ"],function(e,t,n){n._useUTC=!0,n._tzm=Vt(Ye,e)});var Lt=/([\+\-]|\d\d)/gi;function Vt(e,t){var t=(t||"").match(e);return null===t?null:0===(t=60*(e=((t[t.length-1]||[])+"").match(Lt)||["-",0,0])[1]+g(e[2]))?0:"+"===e[0]?t:-t}function Gt(e,t){var n;return t._isUTC?(t=t.clone(),n=(h(e)||V(e)?e:W(e)).valueOf()-t.valueOf(),t._d.setTime(t._d.valueOf()+n),f.updateOffset(t,!1),t):W(e).local()}function Et(e){return-Math.round(e._d.getTimezoneOffset())}function At(){return!!this.isValid()&&(this._isUTC&&0===this._offset)}f.updateOffset=function(){};var It=/^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,jt=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;function C(e,t){var n,s=e,i=null;return Ut(e)?s={ms:e._milliseconds,d:e._days,M:e._months}:u(e)||!isNaN(+e)?(s={},t?s[t]=+e:s.milliseconds=+e):(i=It.exec(e))?(n="-"===i[1]?-1:1,s={y:0,d:g(i[b])*n,h:g(i[x])*n,m:g(i[T])*n,s:g(i[N])*n,ms:g(Ht(1e3*i[Ne]))*n}):(i=jt.exec(e))?(n="-"===i[1]?-1:1,s={y:Zt(i[2],n),M:Zt(i[3],n),w:Zt(i[4],n),d:Zt(i[5],n),h:Zt(i[6],n),m:Zt(i[7],n),s:Zt(i[8],n)}):null==s?s={}:"object"==typeof s&&("from"in s||"to"in s)&&(t=function(e,t){var n;if(!e.isValid()||!t.isValid())return{milliseconds:0,months:0};t=Gt(t,e),e.isBefore(t)?n=zt(e,t):((n=zt(t,e)).milliseconds=-n.milliseconds,n.months=-n.months);return n}(W(s.from),W(s.to)),(s={}).ms=t.milliseconds,s.M=t.months),i=new Ct(s),Ut(e)&&c(e,"_locale")&&(i._locale=e._locale),Ut(e)&&c(e,"_isValid")&&(i._isValid=e._isValid),i}function Zt(e,t){e=e&&parseFloat(e.replace(",","."));return(isNaN(e)?0:e)*t}function zt(e,t){var n={};return n.months=t.month()-e.month()+12*(t.year()-e.year()),e.clone().add(n.months,"M").isAfter(t)&&--n.months,n.milliseconds=+t-+e.clone().add(n.months,"M"),n}function $t(s,i){return function(e,t){var n;return null===t||isNaN(+t)||(Q(i,"moment()."+i+"(period, number) is deprecated. Please use moment()."+i+"(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),n=e,e=t,t=n),qt(this,C(e,t),s),this}}function qt(e,t,n,s){var i=t._milliseconds,r=Ht(t._days),t=Ht(t._months);e.isValid()&&(s=null==s||s,t&&Ve(e,ce(e,"Month")+t*n),r&&fe(e,"Date",ce(e,"Date")+r*n),i&&e._d.setTime(e._d.valueOf()+i*n),s&&f.updateOffset(e,r||t))}C.fn=Ct.prototype,C.invalid=function(){return C(NaN)};Ce=$t(1,"add"),Je=$t(-1,"subtract");function Bt(e){return"string"==typeof e||e instanceof String}function Jt(e){return h(e)||V(e)||Bt(e)||u(e)||function(t){var e=a(t),n=!1;e&&(n=0===t.filter(function(e){return!u(e)&&Bt(t)}).length);return e&&n}(e)||function(e){var t,n,s=F(e)&&!L(e),i=!1,r=["years","year","y","months","month","M","days","day","d","dates","date","D","hours","hour","h","minutes","minute","m","seconds","second","s","milliseconds","millisecond","ms"],a=r.length;for(t=0;t<a;t+=1)n=r[t],i=i||c(e,n);return s&&i}(e)||null==e}function Qt(e,t){if(e.date()<t.date())return-Qt(t,e);var n=12*(t.year()-e.year())+(t.month()-e.month()),s=e.clone().add(n,"months"),t=t-s<0?(t-s)/(s-e.clone().add(n-1,"months")):(t-s)/(e.clone().add(1+n,"months")-s);return-(n+t)||0}function Xt(e){return void 0===e?this._locale._abbr:(null!=(e=mt(e))&&(this._locale=e),this)}f.defaultFormat="YYYY-MM-DDTHH:mm:ssZ",f.defaultFormatUtc="YYYY-MM-DDTHH:mm:ss[Z]";Xe=e("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(e){return void 0===e?this.localeData():this.locale(e)});function Kt(){return this._locale}var en=126227808e5;function tn(e,t){return(e%t+t)%t}function nn(e,t,n){return e<100&&0<=e?new Date(e+400,t,n)-en:new Date(e,t,n).valueOf()}function sn(e,t,n){return e<100&&0<=e?Date.UTC(e+400,t,n)-en:Date.UTC(e,t,n)}function rn(e,t){return t.erasAbbrRegex(e)}function an(){for(var e=[],t=[],n=[],s=[],i=this.eras(),r=0,a=i.length;r<a;++r)t.push(M(i[r].name)),e.push(M(i[r].abbr)),n.push(M(i[r].narrow)),s.push(M(i[r].name)),s.push(M(i[r].abbr)),s.push(M(i[r].narrow));this._erasRegex=new RegExp("^("+s.join("|")+")","i"),this._erasNameRegex=new RegExp("^("+t.join("|")+")","i"),this._erasAbbrRegex=new RegExp("^("+e.join("|")+")","i"),this._erasNarrowRegex=new RegExp("^("+n.join("|")+")","i")}function on(e,t){s(0,[e,e.length],0,t)}function un(e,t,n,s,i){var r;return null==e?qe(this,s,i).year:(r=P(e,s,i),function(e,t,n,s,i){e=$e(e,t,n,s,i),t=Ze(e.year,0,e.dayOfYear);return this.year(t.getUTCFullYear()),this.month(t.getUTCMonth()),this.date(t.getUTCDate()),this}.call(this,e,t=r<t?r:t,n,s,i))}s("N",0,0,"eraAbbr"),s("NN",0,0,"eraAbbr"),s("NNN",0,0,"eraAbbr"),s("NNNN",0,0,"eraName"),s("NNNNN",0,0,"eraNarrow"),s("y",["y",1],"yo","eraYear"),s("y",["yy",2],0,"eraYear"),s("y",["yyy",3],0,"eraYear"),s("y",["yyyy",4],0,"eraYear"),v("N",rn),v("NN",rn),v("NNN",rn),v("NNNN",function(e,t){return t.erasNameRegex(e)}),v("NNNNN",function(e,t){return t.erasNarrowRegex(e)}),D(["N","NN","NNN","NNNN","NNNNN"],function(e,t,n,s){s=n._locale.erasParse(e,s,n._strict);s?m(n).era=s:m(n).invalidEra=e}),v("y",Me),v("yy",Me),v("yyy",Me),v("yyyy",Me),v("yo",function(e,t){return t._eraYearOrdinalRegex||Me}),D(["y","yy","yyy","yyyy"],Y),D(["yo"],function(e,t,n,s){var i;n._locale._eraYearOrdinalRegex&&(i=e.match(n._locale._eraYearOrdinalRegex)),n._locale.eraYearOrdinalParse?t[Y]=n._locale.eraYearOrdinalParse(e,i):t[Y]=parseInt(e,10)}),s(0,["gg",2],0,function(){return this.weekYear()%100}),s(0,["GG",2],0,function(){return this.isoWeekYear()%100}),on("gggg","weekYear"),on("ggggg","weekYear"),on("GGGG","isoWeekYear"),on("GGGGG","isoWeekYear"),t("weekYear","gg"),t("isoWeekYear","GG"),n("weekYear",1),n("isoWeekYear",1),v("G",De),v("g",De),v("GG",p,w),v("gg",p,w),v("GGGG",ke,_e),v("gggg",ke,_e),v("GGGGG",ve,ye),v("ggggg",ve,ye),Te(["gggg","ggggg","GGGG","GGGGG"],function(e,t,n,s){t[s.substr(0,2)]=g(e)}),Te(["gg","GG"],function(e,t,n,s){t[s]=f.parseTwoDigitYear(e)}),s("Q",0,"Qo","quarter"),t("quarter","Q"),n("quarter",7),v("Q",i),D("Q",function(e,t){t[O]=3*(g(e)-1)}),s("D",["DD",2],"Do","date"),t("date","D"),n("date",9),v("D",p),v("DD",p,w),v("Do",function(e,t){return e?t._dayOfMonthOrdinalParse||t._ordinalParse:t._dayOfMonthOrdinalParseLenient}),D(["D","DD"],b),D("Do",function(e,t){t[b]=g(e.match(p)[0])});ke=de("Date",!0);s("DDD",["DDDD",3],"DDDo","dayOfYear"),t("dayOfYear","DDD"),n("dayOfYear",4),v("DDD",pe),v("DDDD",me),D(["DDD","DDDD"],function(e,t,n){n._dayOfYear=g(e)}),s("m",["mm",2],0,"minute"),t("minute","m"),n("minute",14),v("m",p),v("mm",p,w),D(["m","mm"],T);var ln,_e=de("Minutes",!1),ve=(s("s",["ss",2],0,"second"),t("second","s"),n("second",15),v("s",p),v("ss",p,w),D(["s","ss"],N),de("Seconds",!1));for(s("S",0,0,function(){return~~(this.millisecond()/100)}),s(0,["SS",2],0,function(){return~~(this.millisecond()/10)}),s(0,["SSS",3],0,"millisecond"),s(0,["SSSS",4],0,function(){return 10*this.millisecond()}),s(0,["SSSSS",5],0,function(){return 100*this.millisecond()}),s(0,["SSSSSS",6],0,function(){return 1e3*this.millisecond()}),s(0,["SSSSSSS",7],0,function(){return 1e4*this.millisecond()}),s(0,["SSSSSSSS",8],0,function(){return 1e5*this.millisecond()}),s(0,["SSSSSSSSS",9],0,function(){return 1e6*this.millisecond()}),t("millisecond","ms"),n("millisecond",16),v("S",pe,i),v("SS",pe,w),v("SSS",pe,me),ln="SSSS";ln.length<=9;ln+="S")v(ln,Me);function hn(e,t){t[Ne]=g(1e3*("0."+e))}for(ln="S";ln.length<=9;ln+="S")D(ln,hn);ye=de("Milliseconds",!1),s("z",0,0,"zoneAbbr"),s("zz",0,0,"zoneName");i=q.prototype;function dn(e){return e}i.add=Ce,i.calendar=function(e,t){1===arguments.length&&(arguments[0]?Jt(arguments[0])?(e=arguments[0],t=void 0):function(e){for(var t=F(e)&&!L(e),n=!1,s=["sameDay","nextDay","lastDay","nextWeek","lastWeek","sameElse"],i=0;i<s.length;i+=1)n=n||c(e,s[i]);return t&&n}(arguments[0])&&(t=arguments[0],e=void 0):t=e=void 0);var e=e||W(),n=Gt(e,this).startOf("day"),n=f.calendarFormat(this,n)||"sameElse",t=t&&(d(t[n])?t[n].call(this,e):t[n]);return this.format(t||this.localeData().calendar(n,this,W(e)))},i.clone=function(){return new q(this)},i.diff=function(e,t,n){var s,i,r;if(!this.isValid())return NaN;if(!(s=Gt(e,this)).isValid())return NaN;switch(i=6e4*(s.utcOffset()-this.utcOffset()),t=_(t)){case"year":r=Qt(this,s)/12;break;case"month":r=Qt(this,s);break;case"quarter":r=Qt(this,s)/3;break;case"second":r=(this-s)/1e3;break;case"minute":r=(this-s)/6e4;break;case"hour":r=(this-s)/36e5;break;case"day":r=(this-s-i)/864e5;break;case"week":r=(this-s-i)/6048e5;break;default:r=this-s}return n?r:y(r)},i.endOf=function(e){var t,n;if(void 0===(e=_(e))||"millisecond"===e||!this.isValid())return this;switch(n=this._isUTC?sn:nn,e){case"year":t=n(this.year()+1,0,1)-1;break;case"quarter":t=n(this.year(),this.month()-this.month()%3+3,1)-1;break;case"month":t=n(this.year(),this.month()+1,1)-1;break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday()+7)-1;break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1)+7)-1;break;case"day":case"date":t=n(this.year(),this.month(),this.date()+1)-1;break;case"hour":t=this._d.valueOf(),t+=36e5-tn(t+(this._isUTC?0:6e4*this.utcOffset()),36e5)-1;break;case"minute":t=this._d.valueOf(),t+=6e4-tn(t,6e4)-1;break;case"second":t=this._d.valueOf(),t+=1e3-tn(t,1e3)-1;break}return this._d.setTime(t),f.updateOffset(this,!0),this},i.format=function(e){return e=e||(this.isUtc()?f.defaultFormatUtc:f.defaultFormat),e=re(this,e),this.localeData().postformat(e)},i.from=function(e,t){return this.isValid()&&(h(e)&&e.isValid()||W(e).isValid())?C({to:this,from:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},i.fromNow=function(e){return this.from(W(),e)},i.to=function(e,t){return this.isValid()&&(h(e)&&e.isValid()||W(e).isValid())?C({from:this,to:e}).locale(this.locale()).humanize(!t):this.localeData().invalidDate()},i.toNow=function(e){return this.to(W(),e)},i.get=function(e){return d(this[e=_(e)])?this[e]():this},i.invalidAt=function(){return m(this).overflow},i.isAfter=function(e,t){return e=h(e)?e:W(e),!(!this.isValid()||!e.isValid())&&("millisecond"===(t=_(t)||"millisecond")?this.valueOf()>e.valueOf():e.valueOf()<this.clone().startOf(t).valueOf())},i.isBefore=function(e,t){return e=h(e)?e:W(e),!(!this.isValid()||!e.isValid())&&("millisecond"===(t=_(t)||"millisecond")?this.valueOf()<e.valueOf():this.clone().endOf(t).valueOf()<e.valueOf())},i.isBetween=function(e,t,n,s){return e=h(e)?e:W(e),t=h(t)?t:W(t),!!(this.isValid()&&e.isValid()&&t.isValid())&&(("("===(s=s||"()")[0]?this.isAfter(e,n):!this.isBefore(e,n))&&(")"===s[1]?this.isBefore(t,n):!this.isAfter(t,n)))},i.isSame=function(e,t){var e=h(e)?e:W(e);return!(!this.isValid()||!e.isValid())&&("millisecond"===(t=_(t)||"millisecond")?this.valueOf()===e.valueOf():(e=e.valueOf(),this.clone().startOf(t).valueOf()<=e&&e<=this.clone().endOf(t).valueOf()))},i.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)},i.isSameOrBefore=function(e,t){return this.isSame(e,t)||this.isBefore(e,t)},i.isValid=function(){return A(this)},i.lang=Xe,i.locale=Xt,i.localeData=Kt,i.max=we,i.min=ge,i.parsingFlags=function(){return E({},m(this))},i.set=function(e,t){if("object"==typeof e)for(var n=function(e){var t,n=[];for(t in e)c(e,t)&&n.push({unit:t,priority:le[t]});return n.sort(function(e,t){return e.priority-t.priority}),n}(e=ue(e)),s=n.length,i=0;i<s;i++)this[n[i].unit](e[n[i].unit]);else if(d(this[e=_(e)]))return this[e](t);return this},i.startOf=function(e){var t,n;if(void 0===(e=_(e))||"millisecond"===e||!this.isValid())return this;switch(n=this._isUTC?sn:nn,e){case"year":t=n(this.year(),0,1);break;case"quarter":t=n(this.year(),this.month()-this.month()%3,1);break;case"month":t=n(this.year(),this.month(),1);break;case"week":t=n(this.year(),this.month(),this.date()-this.weekday());break;case"isoWeek":t=n(this.year(),this.month(),this.date()-(this.isoWeekday()-1));break;case"day":case"date":t=n(this.year(),this.month(),this.date());break;case"hour":t=this._d.valueOf(),t-=tn(t+(this._isUTC?0:6e4*this.utcOffset()),36e5);break;case"minute":t=this._d.valueOf(),t-=tn(t,6e4);break;case"second":t=this._d.valueOf(),t-=tn(t,1e3);break}return this._d.setTime(t),f.updateOffset(this,!0),this},i.subtract=Je,i.toArray=function(){var e=this;return[e.year(),e.month(),e.date(),e.hour(),e.minute(),e.second(),e.millisecond()]},i.toObject=function(){var e=this;return{years:e.year(),months:e.month(),date:e.date(),hours:e.hours(),minutes:e.minutes(),seconds:e.seconds(),milliseconds:e.milliseconds()}},i.toDate=function(){return new Date(this.valueOf())},i.toISOString=function(e){if(!this.isValid())return null;var t=(e=!0!==e)?this.clone().utc():this;return t.year()<0||9999<t.year()?re(t,e?"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"):d(Date.prototype.toISOString)?e?this.toDate().toISOString():new Date(this.valueOf()+60*this.utcOffset()*1e3).toISOString().replace("Z",re(t,"Z")):re(t,e?"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]":"YYYY-MM-DD[T]HH:mm:ss.SSSZ")},i.inspect=function(){if(!this.isValid())return"moment.invalid(/* "+this._i+" */)";var e,t="moment",n="";return this.isLocal()||(t=0===this.utcOffset()?"moment.utc":"moment.parseZone",n="Z"),t="["+t+'("]',e=0<=this.year()&&this.year()<=9999?"YYYY":"YYYYYY",this.format(t+e+"-MM-DD[T]HH:mm:ss.SSS"+(n+'[")]'))},"undefined"!=typeof Symbol&&null!=Symbol.for&&(i[Symbol.for("nodejs.util.inspect.custom")]=function(){return"Moment<"+this.format()+">"}),i.toJSON=function(){return this.isValid()?this.toISOString():null},i.toString=function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},i.unix=function(){return Math.floor(this.valueOf()/1e3)},i.valueOf=function(){return this._d.valueOf()-6e4*(this._offset||0)},i.creationData=function(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict}},i.eraName=function(){for(var e,t=this.localeData().eras(),n=0,s=t.length;n<s;++n){if(e=this.clone().startOf("day").valueOf(),t[n].since<=e&&e<=t[n].until)return t[n].name;if(t[n].until<=e&&e<=t[n].since)return t[n].name}return""},i.eraNarrow=function(){for(var e,t=this.localeData().eras(),n=0,s=t.length;n<s;++n){if(e=this.clone().startOf("day").valueOf(),t[n].since<=e&&e<=t[n].until)return t[n].narrow;if(t[n].until<=e&&e<=t[n].since)return t[n].narrow}return""},i.eraAbbr=function(){for(var e,t=this.localeData().eras(),n=0,s=t.length;n<s;++n){if(e=this.clone().startOf("day").valueOf(),t[n].since<=e&&e<=t[n].until)return t[n].abbr;if(t[n].until<=e&&e<=t[n].since)return t[n].abbr}return""},i.eraYear=function(){for(var e,t,n=this.localeData().eras(),s=0,i=n.length;s<i;++s)if(e=n[s].since<=n[s].until?1:-1,t=this.clone().startOf("day").valueOf(),n[s].since<=t&&t<=n[s].until||n[s].until<=t&&t<=n[s].since)return(this.year()-f(n[s].since).year())*e+n[s].offset;return this.year()},i.year=Ie,i.isLeapYear=function(){return he(this.year())},i.weekYear=function(e){return un.call(this,e,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy)},i.isoWeekYear=function(e){return un.call(this,e,this.isoWeek(),this.isoWeekday(),1,4)},i.quarter=i.quarters=function(e){return null==e?Math.ceil((this.month()+1)/3):this.month(3*(e-1)+this.month()%3)},i.month=Ge,i.daysInMonth=function(){return We(this.year(),this.month())},i.week=i.weeks=function(e){var t=this.localeData().week(this);return null==e?t:this.add(7*(e-t),"d")},i.isoWeek=i.isoWeeks=function(e){var t=qe(this,1,4).week;return null==e?t:this.add(7*(e-t),"d")},i.weeksInYear=function(){var e=this.localeData()._week;return P(this.year(),e.dow,e.doy)},i.weeksInWeekYear=function(){var e=this.localeData()._week;return P(this.weekYear(),e.dow,e.doy)},i.isoWeeksInYear=function(){return P(this.year(),1,4)},i.isoWeeksInISOWeekYear=function(){return P(this.isoWeekYear(),1,4)},i.date=ke,i.day=i.days=function(e){if(!this.isValid())return null!=e?this:NaN;var t,n,s=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=e?(t=e,n=this.localeData(),e="string"!=typeof t?t:isNaN(t)?"number"==typeof(t=n.weekdaysParse(t))?t:null:parseInt(t,10),this.add(e-s,"d")):s},i.weekday=function(e){if(!this.isValid())return null!=e?this:NaN;var t=(this.day()+7-this.localeData()._week.dow)%7;return null==e?t:this.add(e-t,"d")},i.isoWeekday=function(e){return this.isValid()?null!=e?(t=e,n=this.localeData(),n="string"==typeof t?n.weekdaysParse(t)%7||7:isNaN(t)?null:t,this.day(this.day()%7?n:n-7)):this.day()||7:null!=e?this:NaN;var t,n},i.dayOfYear=function(e){var t=Math.round((this.clone().startOf("day")-this.clone().startOf("year"))/864e5)+1;return null==e?t:this.add(e-t,"d")},i.hour=i.hours=k,i.minute=i.minutes=_e,i.second=i.seconds=ve,i.millisecond=i.milliseconds=ye,i.utcOffset=function(e,t,n){var s,i=this._offset||0;if(!this.isValid())return null!=e?this:NaN;if(null==e)return this._isUTC?i:Et(this);if("string"==typeof e){if(null===(e=Vt(Ye,e)))return this}else Math.abs(e)<16&&!n&&(e*=60);return!this._isUTC&&t&&(s=Et(this)),this._offset=e,this._isUTC=!0,null!=s&&this.add(s,"m"),i!==e&&(!t||this._changeInProgress?qt(this,C(e-i,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,f.updateOffset(this,!0),this._changeInProgress=null)),this},i.utc=function(e){return this.utcOffset(0,e)},i.local=function(e){return this._isUTC&&(this.utcOffset(0,e),this._isUTC=!1,e&&this.subtract(Et(this),"m")),this},i.parseZone=function(){var e;return null!=this._tzm?this.utcOffset(this._tzm,!1,!0):"string"==typeof this._i&&(null!=(e=Vt(Se,this._i))?this.utcOffset(e):this.utcOffset(0,!0)),this},i.hasAlignedHourOffset=function(e){return!!this.isValid()&&(e=e?W(e).utcOffset():0,(this.utcOffset()-e)%60==0)},i.isDST=function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},i.isLocal=function(){return!!this.isValid()&&!this._isUTC},i.isUtcOffset=function(){return!!this.isValid()&&this._isUTC},i.isUtc=At,i.isUTC=At,i.zoneAbbr=function(){return this._isUTC?"UTC":""},i.zoneName=function(){return this._isUTC?"Coordinated Universal Time":""},i.dates=e("dates accessor is deprecated. Use date instead.",ke),i.months=e("months accessor is deprecated. Use month instead",Ge),i.years=e("years accessor is deprecated. Use year instead",Ie),i.zone=e("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",function(e,t){return null!=e?(this.utcOffset(e="string"!=typeof e?-e:e,t),this):-this.utcOffset()}),i.isDSTShifted=e("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",function(){if(!o(this._isDSTShifted))return this._isDSTShifted;var e,t={};return $(t,this),(t=Nt(t))._a?(e=(t._isUTC?l:W)(t._a),this._isDSTShifted=this.isValid()&&0<function(e,t,n){for(var s=Math.min(e.length,t.length),i=Math.abs(e.length-t.length),r=0,a=0;a<s;a++)(n&&e[a]!==t[a]||!n&&g(e[a])!==g(t[a]))&&r++;return r+i}(t._a,e.toArray())):this._isDSTShifted=!1,this._isDSTShifted});w=K.prototype;function cn(e,t,n,s){var i=mt(),s=l().set(s,t);return i[n](s,e)}function fn(e,t,n){if(u(e)&&(t=e,e=void 0),e=e||"",null!=t)return cn(e,t,n,"month");for(var s=[],i=0;i<12;i++)s[i]=cn(e,i,n,"month");return s}function mn(e,t,n,s){t=("boolean"==typeof e?u(t)&&(n=t,t=void 0):(t=e,e=!1,u(n=t)&&(n=t,t=void 0)),t||"");var i,r=mt(),a=e?r._week.dow:0,o=[];if(null!=n)return cn(t,(n+a)%7,s,"day");for(i=0;i<7;i++)o[i]=cn(t,(i+a)%7,s,"day");return o}w.calendar=function(e,t,n){return d(e=this._calendar[e]||this._calendar.sameElse)?e.call(t,n):e},w.longDateFormat=function(e){var t=this._longDateFormat[e],n=this._longDateFormat[e.toUpperCase()];return t||!n?t:(this._longDateFormat[e]=n.match(te).map(function(e){return"MMMM"===e||"MM"===e||"DD"===e||"dddd"===e?e.slice(1):e}).join(""),this._longDateFormat[e])},w.invalidDate=function(){return this._invalidDate},w.ordinal=function(e){return this._ordinal.replace("%d",e)},w.preparse=dn,w.postformat=dn,w.relativeTime=function(e,t,n,s){var i=this._relativeTime[n];return d(i)?i(e,t,n,s):i.replace(/%d/i,e)},w.pastFuture=function(e,t){return d(e=this._relativeTime[0<e?"future":"past"])?e(t):e.replace(/%s/i,t)},w.set=function(e){var t,n;for(n in e)c(e,n)&&(d(t=e[n])?this[n]=t:this["_"+n]=t);this._config=e,this._dayOfMonthOrdinalParseLenient=new RegExp((this._dayOfMonthOrdinalParse.source||this._ordinalParse.source)+"|"+/\d{1,2}/.source)},w.eras=function(e,t){for(var n,s=this._eras||mt("en")._eras,i=0,r=s.length;i<r;++i){switch(typeof s[i].since){case"string":n=f(s[i].since).startOf("day"),s[i].since=n.valueOf();break}switch(typeof s[i].until){case"undefined":s[i].until=1/0;break;case"string":n=f(s[i].until).startOf("day").valueOf(),s[i].until=n.valueOf();break}}return s},w.erasParse=function(e,t,n){var s,i,r,a,o,u=this.eras();for(e=e.toUpperCase(),s=0,i=u.length;s<i;++s)if(r=u[s].name.toUpperCase(),a=u[s].abbr.toUpperCase(),o=u[s].narrow.toUpperCase(),n)switch(t){case"N":case"NN":case"NNN":if(a===e)return u[s];break;case"NNNN":if(r===e)return u[s];break;case"NNNNN":if(o===e)return u[s];break}else if(0<=[r,a,o].indexOf(e))return u[s]},w.erasConvertYear=function(e,t){var n=e.since<=e.until?1:-1;return void 0===t?f(e.since).year():f(e.since).year()+(t-e.offset)*n},w.erasAbbrRegex=function(e){return c(this,"_erasAbbrRegex")||an.call(this),e?this._erasAbbrRegex:this._erasRegex},w.erasNameRegex=function(e){return c(this,"_erasNameRegex")||an.call(this),e?this._erasNameRegex:this._erasRegex},w.erasNarrowRegex=function(e){return c(this,"_erasNarrowRegex")||an.call(this),e?this._erasNarrowRegex:this._erasRegex},w.months=function(e,t){return e?(a(this._months)?this._months:this._months[(this._months.isFormat||He).test(t)?"format":"standalone"])[e.month()]:a(this._months)?this._months:this._months.standalone},w.monthsShort=function(e,t){return e?(a(this._monthsShort)?this._monthsShort:this._monthsShort[He.test(t)?"format":"standalone"])[e.month()]:a(this._monthsShort)?this._monthsShort:this._monthsShort.standalone},w.monthsParse=function(e,t,n){var s,i;if(this._monthsParseExact)return function(e,t,n){var s,i,r,e=e.toLocaleLowerCase();if(!this._monthsParse)for(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[],s=0;s<12;++s)r=l([2e3,s]),this._shortMonthsParse[s]=this.monthsShort(r,"").toLocaleLowerCase(),this._longMonthsParse[s]=this.months(r,"").toLocaleLowerCase();return n?"MMM"===t?-1!==(i=S.call(this._shortMonthsParse,e))?i:null:-1!==(i=S.call(this._longMonthsParse,e))?i:null:"MMM"===t?-1!==(i=S.call(this._shortMonthsParse,e))||-1!==(i=S.call(this._longMonthsParse,e))?i:null:-1!==(i=S.call(this._longMonthsParse,e))||-1!==(i=S.call(this._shortMonthsParse,e))?i:null}.call(this,e,t,n);for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),s=0;s<12;s++){if(i=l([2e3,s]),n&&!this._longMonthsParse[s]&&(this._longMonthsParse[s]=new RegExp("^"+this.months(i,"").replace(".","")+"$","i"),this._shortMonthsParse[s]=new RegExp("^"+this.monthsShort(i,"").replace(".","")+"$","i")),n||this._monthsParse[s]||(i="^"+this.months(i,"")+"|^"+this.monthsShort(i,""),this._monthsParse[s]=new RegExp(i.replace(".",""),"i")),n&&"MMMM"===t&&this._longMonthsParse[s].test(e))return s;if(n&&"MMM"===t&&this._shortMonthsParse[s].test(e))return s;if(!n&&this._monthsParse[s].test(e))return s}},w.monthsRegex=function(e){return this._monthsParseExact?(c(this,"_monthsRegex")||Ee.call(this),e?this._monthsStrictRegex:this._monthsRegex):(c(this,"_monthsRegex")||(this._monthsRegex=Le),this._monthsStrictRegex&&e?this._monthsStrictRegex:this._monthsRegex)},w.monthsShortRegex=function(e){return this._monthsParseExact?(c(this,"_monthsRegex")||Ee.call(this),e?this._monthsShortStrictRegex:this._monthsShortRegex):(c(this,"_monthsShortRegex")||(this._monthsShortRegex=Fe),this._monthsShortStrictRegex&&e?this._monthsShortStrictRegex:this._monthsShortRegex)},w.week=function(e){return qe(e,this._week.dow,this._week.doy).week},w.firstDayOfYear=function(){return this._week.doy},w.firstDayOfWeek=function(){return this._week.dow},w.weekdays=function(e,t){return t=a(this._weekdays)?this._weekdays:this._weekdays[e&&!0!==e&&this._weekdays.isFormat.test(t)?"format":"standalone"],!0===e?Be(t,this._week.dow):e?t[e.day()]:t},w.weekdaysMin=function(e){return!0===e?Be(this._weekdaysMin,this._week.dow):e?this._weekdaysMin[e.day()]:this._weekdaysMin},w.weekdaysShort=function(e){return!0===e?Be(this._weekdaysShort,this._week.dow):e?this._weekdaysShort[e.day()]:this._weekdaysShort},w.weekdaysParse=function(e,t,n){var s,i;if(this._weekdaysParseExact)return function(e,t,n){var s,i,r,e=e.toLocaleLowerCase();if(!this._weekdaysParse)for(this._weekdaysParse=[],this._shortWeekdaysParse=[],this._minWeekdaysParse=[],s=0;s<7;++s)r=l([2e3,1]).day(s),this._minWeekdaysParse[s]=this.weekdaysMin(r,"").toLocaleLowerCase(),this._shortWeekdaysParse[s]=this.weekdaysShort(r,"").toLocaleLowerCase(),this._weekdaysParse[s]=this.weekdays(r,"").toLocaleLowerCase();return n?"dddd"===t?-1!==(i=S.call(this._weekdaysParse,e))?i:null:"ddd"===t?-1!==(i=S.call(this._shortWeekdaysParse,e))?i:null:-1!==(i=S.call(this._minWeekdaysParse,e))?i:null:"dddd"===t?-1!==(i=S.call(this._weekdaysParse,e))||-1!==(i=S.call(this._shortWeekdaysParse,e))||-1!==(i=S.call(this._minWeekdaysParse,e))?i:null:"ddd"===t?-1!==(i=S.call(this._shortWeekdaysParse,e))||-1!==(i=S.call(this._weekdaysParse,e))||-1!==(i=S.call(this._minWeekdaysParse,e))?i:null:-1!==(i=S.call(this._minWeekdaysParse,e))||-1!==(i=S.call(this._weekdaysParse,e))||-1!==(i=S.call(this._shortWeekdaysParse,e))?i:null}.call(this,e,t,n);for(this._weekdaysParse||(this._weekdaysParse=[],this._minWeekdaysParse=[],this._shortWeekdaysParse=[],this._fullWeekdaysParse=[]),s=0;s<7;s++){if(i=l([2e3,1]).day(s),n&&!this._fullWeekdaysParse[s]&&(this._fullWeekdaysParse[s]=new RegExp("^"+this.weekdays(i,"").replace(".","\\.?")+"$","i"),this._shortWeekdaysParse[s]=new RegExp("^"+this.weekdaysShort(i,"").replace(".","\\.?")+"$","i"),this._minWeekdaysParse[s]=new RegExp("^"+this.weekdaysMin(i,"").replace(".","\\.?")+"$","i")),this._weekdaysParse[s]||(i="^"+this.weekdays(i,"")+"|^"+this.weekdaysShort(i,"")+"|^"+this.weekdaysMin(i,""),this._weekdaysParse[s]=new RegExp(i.replace(".",""),"i")),n&&"dddd"===t&&this._fullWeekdaysParse[s].test(e))return s;if(n&&"ddd"===t&&this._shortWeekdaysParse[s].test(e))return s;if(n&&"dd"===t&&this._minWeekdaysParse[s].test(e))return s;if(!n&&this._weekdaysParse[s].test(e))return s}},w.weekdaysRegex=function(e){return this._weekdaysParseExact?(c(this,"_weekdaysRegex")||nt.call(this),e?this._weekdaysStrictRegex:this._weekdaysRegex):(c(this,"_weekdaysRegex")||(this._weekdaysRegex=Ke),this._weekdaysStrictRegex&&e?this._weekdaysStrictRegex:this._weekdaysRegex)},w.weekdaysShortRegex=function(e){return this._weekdaysParseExact?(c(this,"_weekdaysRegex")||nt.call(this),e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex):(c(this,"_weekdaysShortRegex")||(this._weekdaysShortRegex=et),this._weekdaysShortStrictRegex&&e?this._weekdaysShortStrictRegex:this._weekdaysShortRegex)},w.weekdaysMinRegex=function(e){return this._weekdaysParseExact?(c(this,"_weekdaysRegex")||nt.call(this),e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex):(c(this,"_weekdaysMinRegex")||(this._weekdaysMinRegex=tt),this._weekdaysMinStrictRegex&&e?this._weekdaysMinStrictRegex:this._weekdaysMinRegex)},w.isPM=function(e){return"p"===(e+"").toLowerCase().charAt(0)},w.meridiem=function(e,t,n){return 11<e?n?"pm":"PM":n?"am":"AM"},ct("en",{eras:[{since:"0001-01-01",until:1/0,offset:1,name:"Anno Domini",narrow:"AD",abbr:"AD"},{since:"0000-12-31",until:-1/0,offset:1,name:"Before Christ",narrow:"BC",abbr:"BC"}],dayOfMonthOrdinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(e){var t=e%10;return e+(1===g(e%100/10)?"th":1==t?"st":2==t?"nd":3==t?"rd":"th")}}),f.lang=e("moment.lang is deprecated. Use moment.locale instead.",ct),f.langData=e("moment.langData is deprecated. Use moment.localeData instead.",mt);var _n=Math.abs;function yn(e,t,n,s){t=C(t,n);return e._milliseconds+=s*t._milliseconds,e._days+=s*t._days,e._months+=s*t._months,e._bubble()}function gn(e){return e<0?Math.floor(e):Math.ceil(e)}function wn(e){return 4800*e/146097}function pn(e){return 146097*e/4800}function kn(e){return function(){return this.as(e)}}pe=kn("ms"),me=kn("s"),Ce=kn("m"),we=kn("h"),ge=kn("d"),Je=kn("w"),k=kn("M"),_e=kn("Q"),ve=kn("y");function vn(e){return function(){return this.isValid()?this._data[e]:NaN}}var ye=vn("milliseconds"),ke=vn("seconds"),Ie=vn("minutes"),w=vn("hours"),Mn=vn("days"),Dn=vn("months"),Sn=vn("years");var Yn=Math.round,On={ss:44,s:45,m:45,h:22,d:26,w:null,M:11};function bn(e,t,n,s){var i=C(e).abs(),r=Yn(i.as("s")),a=Yn(i.as("m")),o=Yn(i.as("h")),u=Yn(i.as("d")),l=Yn(i.as("M")),h=Yn(i.as("w")),i=Yn(i.as("y")),r=(r<=n.ss?["s",r]:r<n.s&&["ss",r])||a<=1&&["m"]||a<n.m&&["mm",a]||o<=1&&["h"]||o<n.h&&["hh",o]||u<=1&&["d"]||u<n.d&&["dd",u];return(r=(r=null!=n.w?r||h<=1&&["w"]||h<n.w&&["ww",h]:r)||l<=1&&["M"]||l<n.M&&["MM",l]||i<=1&&["y"]||["yy",i])[2]=t,r[3]=0<+e,r[4]=s,function(e,t,n,s,i){return i.relativeTime(t||1,!!n,e,s)}.apply(null,r)}var xn=Math.abs;function Tn(e){return(0<e)-(e<0)||+e}function Nn(){if(!this.isValid())return this.localeData().invalidDate();var e,t,n,s,i,r,a,o=xn(this._milliseconds)/1e3,u=xn(this._days),l=xn(this._months),h=this.asSeconds();return h?(e=y(o/60),t=y(e/60),o%=60,e%=60,n=y(l/12),l%=12,s=o?o.toFixed(3).replace(/\.?0+$/,""):"",i=Tn(this._months)!==Tn(h)?"-":"",r=Tn(this._days)!==Tn(h)?"-":"",a=Tn(this._milliseconds)!==Tn(h)?"-":"",(h<0?"-":"")+"P"+(n?i+n+"Y":"")+(l?i+l+"M":"")+(u?r+u+"D":"")+(t||e||o?"T":"")+(t?a+t+"H":"")+(e?a+e+"M":"")+(o?a+s+"S":"")):"P0D"}var U=Ct.prototype;return U.isValid=function(){return this._isValid},U.abs=function(){var e=this._data;return this._milliseconds=_n(this._milliseconds),this._days=_n(this._days),this._months=_n(this._months),e.milliseconds=_n(e.milliseconds),e.seconds=_n(e.seconds),e.minutes=_n(e.minutes),e.hours=_n(e.hours),e.months=_n(e.months),e.years=_n(e.years),this},U.add=function(e,t){return yn(this,e,t,1)},U.subtract=function(e,t){return yn(this,e,t,-1)},U.as=function(e){if(!this.isValid())return NaN;var t,n,s=this._milliseconds;if("month"===(e=_(e))||"quarter"===e||"year"===e)switch(t=this._days+s/864e5,n=this._months+wn(t),e){case"month":return n;case"quarter":return n/3;case"year":return n/12}else switch(t=this._days+Math.round(pn(this._months)),e){case"week":return t/7+s/6048e5;case"day":return t+s/864e5;case"hour":return 24*t+s/36e5;case"minute":return 1440*t+s/6e4;case"second":return 86400*t+s/1e3;case"millisecond":return Math.floor(864e5*t)+s;default:throw new Error("Unknown unit "+e)}},U.asMilliseconds=pe,U.asSeconds=me,U.asMinutes=Ce,U.asHours=we,U.asDays=ge,U.asWeeks=Je,U.asMonths=k,U.asQuarters=_e,U.asYears=ve,U.valueOf=function(){return this.isValid()?this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*g(this._months/12):NaN},U._bubble=function(){var e=this._milliseconds,t=this._days,n=this._months,s=this._data;return 0<=e&&0<=t&&0<=n||e<=0&&t<=0&&n<=0||(e+=864e5*gn(pn(n)+t),n=t=0),s.milliseconds=e%1e3,e=y(e/1e3),s.seconds=e%60,e=y(e/60),s.minutes=e%60,e=y(e/60),s.hours=e%24,t+=y(e/24),n+=e=y(wn(t)),t-=gn(pn(e)),e=y(n/12),n%=12,s.days=t,s.months=n,s.years=e,this},U.clone=function(){return C(this)},U.get=function(e){return e=_(e),this.isValid()?this[e+"s"]():NaN},U.milliseconds=ye,U.seconds=ke,U.minutes=Ie,U.hours=w,U.days=Mn,U.weeks=function(){return y(this.days()/7)},U.months=Dn,U.years=Sn,U.humanize=function(e,t){if(!this.isValid())return this.localeData().invalidDate();var n=!1,s=On;return"object"==typeof e&&(t=e,e=!1),"boolean"==typeof e&&(n=e),"object"==typeof t&&(s=Object.assign({},On,t),null!=t.s&&null==t.ss&&(s.ss=t.s-1)),e=this.localeData(),t=bn(this,!n,s,e),n&&(t=e.pastFuture(+this,t)),e.postformat(t)},U.toISOString=Nn,U.toString=Nn,U.toJSON=Nn,U.locale=Xt,U.localeData=Kt,U.toIsoString=e("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",Nn),U.lang=Xe,s("X",0,0,"unix"),s("x",0,0,"valueOf"),v("x",De),v("X",/[+-]?\d+(\.\d{1,3})?/),D("X",function(e,t,n){n._d=new Date(1e3*parseFloat(e))}),D("x",function(e,t,n){n._d=new Date(g(e))}),f.version="2.29.4",H=W,f.fn=i,f.min=function(){return Rt("isBefore",[].slice.call(arguments,0))},f.max=function(){return Rt("isAfter",[].slice.call(arguments,0))},f.now=function(){return Date.now?Date.now():+new Date},f.utc=l,f.unix=function(e){return W(1e3*e)},f.months=function(e,t){return fn(e,t,"months")},f.isDate=V,f.locale=ct,f.invalid=I,f.duration=C,f.isMoment=h,f.weekdays=function(e,t,n){return mn(e,t,n,"weekdays")},f.parseZone=function(){return W.apply(null,arguments).parseZone()},f.localeData=mt,f.isDuration=Ut,f.monthsShort=function(e,t){return fn(e,t,"monthsShort")},f.weekdaysMin=function(e,t,n){return mn(e,t,n,"weekdaysMin")},f.defineLocale=ft,f.updateLocale=function(e,t){var n,s;return null!=t?(s=ot,null!=R[e]&&null!=R[e].parentLocale?R[e].set(X(R[e]._config,t)):(t=X(s=null!=(n=dt(e))?n._config:s,t),null==n&&(t.abbr=e),(s=new K(t)).parentLocale=R[e],R[e]=s),ct(e)):null!=R[e]&&(null!=R[e].parentLocale?(R[e]=R[e].parentLocale,e===ct()&&ct(e)):null!=R[e]&&delete R[e]),R[e]},f.locales=function(){return ee(R)},f.weekdaysShort=function(e,t,n){return mn(e,t,n,"weekdaysShort")},f.normalizeUnits=_,f.relativeTimeRounding=function(e){return void 0===e?Yn:"function"==typeof e&&(Yn=e,!0)},f.relativeTimeThreshold=function(e,t){return void 0!==On[e]&&(void 0===t?On[e]:(On[e]=t,"s"===e&&(On.ss=t-1),!0))},f.calendarFormat=function(e,t){return(e=e.diff(t,"days",!0))<-6?"sameElse":e<-1?"lastWeek":e<0?"lastDay":e<1?"sameDay":e<2?"nextDay":e<7?"nextWeek":"sameElse"},f.prototype=i,f.HTML5_FMT={DATETIME_LOCAL:"YYYY-MM-DDTHH:mm",DATETIME_LOCAL_SECONDS:"YYYY-MM-DDTHH:mm:ss",DATETIME_LOCAL_MS:"YYYY-MM-DDTHH:mm:ss.SSS",DATE:"YYYY-MM-DD",TIME:"HH:mm",TIME_SECONDS:"HH:mm:ss",TIME_MS:"HH:mm:ss.SSS",WEEK:"GGGG-[W]WW",MONTH:"YYYY-MM"},f});

/*!
 * Chart.js v3.8.2
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Chart=e()}(this,(function(){"use strict";const t="undefined"==typeof window?function(t){return t()}:window.requestAnimationFrame;function e(e,i,s){const n=s||(t=>Array.prototype.slice.call(t));let o=!1,a=[];return function(...s){a=n(s),o||(o=!0,t.call(window,(()=>{o=!1,e.apply(i,a)})))}}function i(t,e){let i;return function(...s){return e?(clearTimeout(i),i=setTimeout(t,e,s)):t.apply(this,s),e}}const s=t=>"start"===t?"left":"end"===t?"right":"center",n=(t,e,i)=>"start"===t?e:"end"===t?i:(e+i)/2,o=(t,e,i,s)=>t===(s?"left":"right")?i:"center"===t?(e+i)/2:e;var a=new class{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,i,s){const n=e.listeners[s],o=e.duration;n.forEach((s=>s({chart:t,initial:e.initial,numSteps:o,currentStep:Math.min(i-e.start,o)})))}_refresh(){this._request||(this._running=!0,this._request=t.call(window,(()=>{this._update(),this._request=null,this._running&&this._refresh()})))}_update(t=Date.now()){let e=0;this._charts.forEach(((i,s)=>{if(!i.running||!i.items.length)return;const n=i.items;let o,a=n.length-1,r=!1;for(;a>=0;--a)o=n[a],o._active?(o._total>i.duration&&(i.duration=o._total),o.tick(t),r=!0):(n[a]=n[n.length-1],n.pop());r&&(s.draw(),this._notify(s,i,t,"progress")),n.length||(i.running=!1,this._notify(s,i,t,"complete"),i.initial=!1),e+=n.length})),this._lastDate=t,0===e&&(this._running=!1)}_getAnims(t){const e=this._charts;let i=e.get(t);return i||(i={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,i)),i}listen(t,e,i){this._getAnims(t).listeners[e].push(i)}add(t,e){e&&e.length&&this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce(((t,e)=>Math.max(t,e._duration)),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!!(e&&e.running&&e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const i=e.items;let s=i.length-1;for(;s>=0;--s)i[s].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}};
/*!
 * @kurkle/color v0.2.1
 * https://github.com/kurkle/color#readme
 * (c) 2022 Jukka Kurkela
 * Released under the MIT License
 */function r(t){return t+.5|0}const l=(t,e,i)=>Math.max(Math.min(t,i),e);function h(t){return l(r(2.55*t),0,255)}function c(t){return l(r(255*t),0,255)}function d(t){return l(r(t/2.55)/100,0,1)}function u(t){return l(r(100*t),0,100)}const f={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},g=[..."0123456789ABCDEF"],p=t=>g[15&t],m=t=>g[(240&t)>>4]+g[15&t],b=t=>(240&t)>>4==(15&t);function x(t){var e=(t=>b(t.r)&&b(t.g)&&b(t.b)&&b(t.a))(t)?p:m;return t?"#"+e(t.r)+e(t.g)+e(t.b)+((t,e)=>t<255?e(t):"")(t.a,e):void 0}const _=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function y(t,e,i){const s=e*Math.min(i,1-i),n=(e,n=(e+t/30)%12)=>i-s*Math.max(Math.min(n-3,9-n,1),-1);return[n(0),n(8),n(4)]}function v(t,e,i){const s=(s,n=(s+t/60)%6)=>i-i*e*Math.max(Math.min(n,4-n,1),0);return[s(5),s(3),s(1)]}function w(t,e,i){const s=y(t,1,.5);let n;for(e+i>1&&(n=1/(e+i),e*=n,i*=n),n=0;n<3;n++)s[n]*=1-e-i,s[n]+=e;return s}function M(t){const e=t.r/255,i=t.g/255,s=t.b/255,n=Math.max(e,i,s),o=Math.min(e,i,s),a=(n+o)/2;let r,l,h;return n!==o&&(h=n-o,l=a>.5?h/(2-n-o):h/(n+o),r=function(t,e,i,s,n){return t===n?(e-i)/s+(e<i?6:0):e===n?(i-t)/s+2:(t-e)/s+4}(e,i,s,h,n),r=60*r+.5),[0|r,l||0,a]}function k(t,e,i,s){return(Array.isArray(e)?t(e[0],e[1],e[2]):t(e,i,s)).map(c)}function S(t,e,i){return k(y,t,e,i)}function P(t){return(t%360+360)%360}function D(t){const e=_.exec(t);let i,s=255;if(!e)return;e[5]!==i&&(s=e[6]?h(+e[5]):c(+e[5]));const n=P(+e[2]),o=+e[3]/100,a=+e[4]/100;return i="hwb"===e[1]?function(t,e,i){return k(w,t,e,i)}(n,o,a):"hsv"===e[1]?function(t,e,i){return k(v,t,e,i)}(n,o,a):S(n,o,a),{r:i[0],g:i[1],b:i[2],a:s}}const C={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},O={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};let A;function T(t){A||(A=function(){const t={},e=Object.keys(O),i=Object.keys(C);let s,n,o,a,r;for(s=0;s<e.length;s++){for(a=r=e[s],n=0;n<i.length;n++)o=i[n],r=r.replace(o,C[o]);o=parseInt(O[a],16),t[r]=[o>>16&255,o>>8&255,255&o]}return t}(),A.transparent=[0,0,0,0]);const e=A[t.toLowerCase()];return e&&{r:e[0],g:e[1],b:e[2],a:4===e.length?e[3]:255}}const L=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;const R=t=>t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055,E=t=>t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4);function I(t,e,i){if(t){let s=M(t);s[e]=Math.max(0,Math.min(s[e]+s[e]*i,0===e?360:1)),s=S(s),t.r=s[0],t.g=s[1],t.b=s[2]}}function z(t,e){return t?Object.assign(e||{},t):t}function F(t){var e={r:0,g:0,b:0,a:255};return Array.isArray(t)?t.length>=3&&(e={r:t[0],g:t[1],b:t[2],a:255},t.length>3&&(e.a=c(t[3]))):(e=z(t,{r:0,g:0,b:0,a:1})).a=c(e.a),e}function B(t){return"r"===t.charAt(0)?function(t){const e=L.exec(t);let i,s,n,o=255;if(e){if(e[7]!==i){const t=+e[7];o=e[8]?h(t):l(255*t,0,255)}return i=+e[1],s=+e[3],n=+e[5],i=255&(e[2]?h(i):l(i,0,255)),s=255&(e[4]?h(s):l(s,0,255)),n=255&(e[6]?h(n):l(n,0,255)),{r:i,g:s,b:n,a:o}}}(t):D(t)}class V{constructor(t){if(t instanceof V)return t;const e=typeof t;let i;var s,n,o;"object"===e?i=F(t):"string"===e&&(o=(s=t).length,"#"===s[0]&&(4===o||5===o?n={r:255&17*f[s[1]],g:255&17*f[s[2]],b:255&17*f[s[3]],a:5===o?17*f[s[4]]:255}:7!==o&&9!==o||(n={r:f[s[1]]<<4|f[s[2]],g:f[s[3]]<<4|f[s[4]],b:f[s[5]]<<4|f[s[6]],a:9===o?f[s[7]]<<4|f[s[8]]:255})),i=n||T(t)||B(t)),this._rgb=i,this._valid=!!i}get valid(){return this._valid}get rgb(){var t=z(this._rgb);return t&&(t.a=d(t.a)),t}set rgb(t){this._rgb=F(t)}rgbString(){return this._valid?(t=this._rgb)&&(t.a<255?`rgba(${t.r}, ${t.g}, ${t.b}, ${d(t.a)})`:`rgb(${t.r}, ${t.g}, ${t.b})`):void 0;var t}hexString(){return this._valid?x(this._rgb):void 0}hslString(){return this._valid?function(t){if(!t)return;const e=M(t),i=e[0],s=u(e[1]),n=u(e[2]);return t.a<255?`hsla(${i}, ${s}%, ${n}%, ${d(t.a)})`:`hsl(${i}, ${s}%, ${n}%)`}(this._rgb):void 0}mix(t,e){if(t){const i=this.rgb,s=t.rgb;let n;const o=e===n?.5:e,a=2*o-1,r=i.a-s.a,l=((a*r==-1?a:(a+r)/(1+a*r))+1)/2;n=1-l,i.r=255&l*i.r+n*s.r+.5,i.g=255&l*i.g+n*s.g+.5,i.b=255&l*i.b+n*s.b+.5,i.a=o*i.a+(1-o)*s.a,this.rgb=i}return this}interpolate(t,e){return t&&(this._rgb=function(t,e,i){const s=E(d(t.r)),n=E(d(t.g)),o=E(d(t.b));return{r:c(R(s+i*(E(d(e.r))-s))),g:c(R(n+i*(E(d(e.g))-n))),b:c(R(o+i*(E(d(e.b))-o))),a:t.a+i*(e.a-t.a)}}(this._rgb,t._rgb,e)),this}clone(){return new V(this.rgb)}alpha(t){return this._rgb.a=c(t),this}clearer(t){return this._rgb.a*=1-t,this}greyscale(){const t=this._rgb,e=r(.3*t.r+.59*t.g+.11*t.b);return t.r=t.g=t.b=e,this}opaquer(t){return this._rgb.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return I(this._rgb,2,t),this}darken(t){return I(this._rgb,2,-t),this}saturate(t){return I(this._rgb,1,t),this}desaturate(t){return I(this._rgb,1,-t),this}rotate(t){return function(t,e){var i=M(t);i[0]=P(i[0]+e),i=S(i),t.r=i[0],t.g=i[1],t.b=i[2]}(this._rgb,t),this}}function W(t){return new V(t)}function N(t){if(t&&"object"==typeof t){const e=t.toString();return"[object CanvasPattern]"===e||"[object CanvasGradient]"===e}return!1}function j(t){return N(t)?t:W(t)}function H(t){return N(t)?t:W(t).saturate(.5).darken(.1).hexString()}function $(){}const Y=function(){let t=0;return function(){return t++}}();function U(t){return null==t}function X(t){if(Array.isArray&&Array.isArray(t))return!0;const e=Object.prototype.toString.call(t);return"[object"===e.slice(0,7)&&"Array]"===e.slice(-6)}function q(t){return null!==t&&"[object Object]"===Object.prototype.toString.call(t)}const K=t=>("number"==typeof t||t instanceof Number)&&isFinite(+t);function G(t,e){return K(t)?t:e}function Z(t,e){return void 0===t?e:t}const J=(t,e)=>"string"==typeof t&&t.endsWith("%")?parseFloat(t)/100:t/e,Q=(t,e)=>"string"==typeof t&&t.endsWith("%")?parseFloat(t)/100*e:+t;function tt(t,e,i){if(t&&"function"==typeof t.call)return t.apply(i,e)}function et(t,e,i,s){let n,o,a;if(X(t))if(o=t.length,s)for(n=o-1;n>=0;n--)e.call(i,t[n],n);else for(n=0;n<o;n++)e.call(i,t[n],n);else if(q(t))for(a=Object.keys(t),o=a.length,n=0;n<o;n++)e.call(i,t[a[n]],a[n])}function it(t,e){let i,s,n,o;if(!t||!e||t.length!==e.length)return!1;for(i=0,s=t.length;i<s;++i)if(n=t[i],o=e[i],n.datasetIndex!==o.datasetIndex||n.index!==o.index)return!1;return!0}function st(t){if(X(t))return t.map(st);if(q(t)){const e=Object.create(null),i=Object.keys(t),s=i.length;let n=0;for(;n<s;++n)e[i[n]]=st(t[i[n]]);return e}return t}function nt(t){return-1===["__proto__","prototype","constructor"].indexOf(t)}function ot(t,e,i,s){if(!nt(t))return;const n=e[t],o=i[t];q(n)&&q(o)?at(n,o,s):e[t]=st(o)}function at(t,e,i){const s=X(e)?e:[e],n=s.length;if(!q(t))return t;const o=(i=i||{}).merger||ot;for(let a=0;a<n;++a){if(!q(e=s[a]))continue;const n=Object.keys(e);for(let s=0,a=n.length;s<a;++s)o(n[s],t,e,i)}return t}function rt(t,e){return at(t,e,{merger:lt})}function lt(t,e,i){if(!nt(t))return;const s=e[t],n=i[t];q(s)&&q(n)?rt(s,n):Object.prototype.hasOwnProperty.call(e,t)||(e[t]=st(n))}function ht(t,e){const i=t.indexOf(".",e);return-1===i?t.length:i}function ct(t,e){if(""===e)return t;let i=0,s=ht(e,i);for(;t&&s>i;)t=t[e.slice(i,s)],i=s+1,s=ht(e,i);return t}function dt(t){return t.charAt(0).toUpperCase()+t.slice(1)}const ut=t=>void 0!==t,ft=t=>"function"==typeof t,gt=(t,e)=>{if(t.size!==e.size)return!1;for(const i of t)if(!e.has(i))return!1;return!0};function pt(t){return"mouseup"===t.type||"click"===t.type||"contextmenu"===t.type}const mt=Object.create(null),bt=Object.create(null);function xt(t,e){if(!e)return t;const i=e.split(".");for(let e=0,s=i.length;e<s;++e){const s=i[e];t=t[s]||(t[s]=Object.create(null))}return t}function _t(t,e,i){return"string"==typeof e?at(xt(t,e),i):at(xt(t,""),e)}var yt=new class{constructor(t){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=t=>t.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(t,e)=>H(e.backgroundColor),this.hoverBorderColor=(t,e)=>H(e.borderColor),this.hoverColor=(t,e)=>H(e.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t)}set(t,e){return _t(this,t,e)}get(t){return xt(this,t)}describe(t,e){return _t(bt,t,e)}override(t,e){return _t(mt,t,e)}route(t,e,i,s){const n=xt(this,t),o=xt(this,i),a="_"+e;Object.defineProperties(n,{[a]:{value:n[e],writable:!0},[e]:{enumerable:!0,get(){const t=this[a],e=o[s];return q(t)?Object.assign({},e,t):Z(t,e)},set(t){this[a]=t}}})}}({_scriptable:t=>!t.startsWith("on"),_indexable:t=>"events"!==t,hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}});function vt(t,e,i){i=i||(i=>t[i]<e);let s,n=t.length-1,o=0;for(;n-o>1;)s=o+n>>1,i(s)?o=s:n=s;return{lo:o,hi:n}}const wt=(t,e,i)=>vt(t,i,(s=>t[s][e]<i)),Mt=(t,e,i)=>vt(t,i,(s=>t[s][e]>=i));function kt(t,e,i){let s=0,n=t.length;for(;s<n&&t[s]<e;)s++;for(;n>s&&t[n-1]>i;)n--;return s>0||n<t.length?t.slice(s,n):t}const St=["push","pop","shift","splice","unshift"];function Pt(t,e){t._chartjs?t._chartjs.listeners.push(e):(Object.defineProperty(t,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[e]}}),St.forEach((e=>{const i="_onData"+dt(e),s=t[e];Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value(...e){const n=s.apply(this,e);return t._chartjs.listeners.forEach((t=>{"function"==typeof t[i]&&t[i](...e)})),n}})})))}function Dt(t,e){const i=t._chartjs;if(!i)return;const s=i.listeners,n=s.indexOf(e);-1!==n&&s.splice(n,1),s.length>0||(St.forEach((e=>{delete t[e]})),delete t._chartjs)}function Ct(t){const e=new Set;let i,s;for(i=0,s=t.length;i<s;++i)e.add(t[i]);return e.size===s?t:Array.from(e)}const Ot=Math.PI,At=2*Ot,Tt=At+Ot,Lt=Number.POSITIVE_INFINITY,Rt=Ot/180,Et=Ot/2,It=Ot/4,zt=2*Ot/3,Ft=Math.log10,Bt=Math.sign;function Vt(t){const e=Math.round(t);t=jt(t,e,t/1e3)?e:t;const i=Math.pow(10,Math.floor(Ft(t))),s=t/i;return(s<=1?1:s<=2?2:s<=5?5:10)*i}function Wt(t){const e=[],i=Math.sqrt(t);let s;for(s=1;s<i;s++)t%s==0&&(e.push(s),e.push(t/s));return i===(0|i)&&e.push(i),e.sort(((t,e)=>t-e)).pop(),e}function Nt(t){return!isNaN(parseFloat(t))&&isFinite(t)}function jt(t,e,i){return Math.abs(t-e)<i}function Ht(t,e){const i=Math.round(t);return i-e<=t&&i+e>=t}function $t(t,e,i){let s,n,o;for(s=0,n=t.length;s<n;s++)o=t[s][i],isNaN(o)||(e.min=Math.min(e.min,o),e.max=Math.max(e.max,o))}function Yt(t){return t*(Ot/180)}function Ut(t){return t*(180/Ot)}function Xt(t){if(!K(t))return;let e=1,i=0;for(;Math.round(t*e)/e!==t;)e*=10,i++;return i}function qt(t,e){const i=e.x-t.x,s=e.y-t.y,n=Math.sqrt(i*i+s*s);let o=Math.atan2(s,i);return o<-.5*Ot&&(o+=At),{angle:o,distance:n}}function Kt(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function Gt(t,e){return(t-e+Tt)%At-Ot}function Zt(t){return(t%At+At)%At}function Jt(t,e,i,s){const n=Zt(t),o=Zt(e),a=Zt(i),r=Zt(o-n),l=Zt(a-n),h=Zt(n-o),c=Zt(n-a);return n===o||n===a||s&&o===a||r>l&&h<c}function Qt(t,e,i){return Math.max(e,Math.min(i,t))}function te(t){return Qt(t,-32768,32767)}function ee(t,e,i,s=1e-6){return t>=Math.min(e,i)-s&&t<=Math.max(e,i)+s}function ie(){return"undefined"!=typeof window&&"undefined"!=typeof document}function se(t){let e=t.parentNode;return e&&"[object ShadowRoot]"===e.toString()&&(e=e.host),e}function ne(t,e,i){let s;return"string"==typeof t?(s=parseInt(t,10),-1!==t.indexOf("%")&&(s=s/100*e.parentNode[i])):s=t,s}const oe=t=>window.getComputedStyle(t,null);function ae(t,e){return oe(t).getPropertyValue(e)}const re=["top","right","bottom","left"];function le(t,e,i){const s={};i=i?"-"+i:"";for(let n=0;n<4;n++){const o=re[n];s[o]=parseFloat(t[e+"-"+o+i])||0}return s.width=s.left+s.right,s.height=s.top+s.bottom,s}function he(t,e){if("native"in t)return t;const{canvas:i,currentDevicePixelRatio:s}=e,n=oe(i),o="border-box"===n.boxSizing,a=le(n,"padding"),r=le(n,"border","width"),{x:l,y:h,box:c}=function(t,e){const i=t.touches,s=i&&i.length?i[0]:t,{offsetX:n,offsetY:o}=s;let a,r,l=!1;if(((t,e,i)=>(t>0||e>0)&&(!i||!i.shadowRoot))(n,o,t.target))a=n,r=o;else{const t=e.getBoundingClientRect();a=s.clientX-t.left,r=s.clientY-t.top,l=!0}return{x:a,y:r,box:l}}(t,i),d=a.left+(c&&r.left),u=a.top+(c&&r.top);let{width:f,height:g}=e;return o&&(f-=a.width+r.width,g-=a.height+r.height),{x:Math.round((l-d)/f*i.width/s),y:Math.round((h-u)/g*i.height/s)}}const ce=t=>Math.round(10*t)/10;function de(t,e,i,s){const n=oe(t),o=le(n,"margin"),a=ne(n.maxWidth,t,"clientWidth")||Lt,r=ne(n.maxHeight,t,"clientHeight")||Lt,l=function(t,e,i){let s,n;if(void 0===e||void 0===i){const o=se(t);if(o){const t=o.getBoundingClientRect(),a=oe(o),r=le(a,"border","width"),l=le(a,"padding");e=t.width-l.width-r.width,i=t.height-l.height-r.height,s=ne(a.maxWidth,o,"clientWidth"),n=ne(a.maxHeight,o,"clientHeight")}else e=t.clientWidth,i=t.clientHeight}return{width:e,height:i,maxWidth:s||Lt,maxHeight:n||Lt}}(t,e,i);let{width:h,height:c}=l;if("content-box"===n.boxSizing){const t=le(n,"border","width"),e=le(n,"padding");h-=e.width+t.width,c-=e.height+t.height}return h=Math.max(0,h-o.width),c=Math.max(0,s?Math.floor(h/s):c-o.height),h=ce(Math.min(h,a,l.maxWidth)),c=ce(Math.min(c,r,l.maxHeight)),h&&!c&&(c=ce(h/2)),{width:h,height:c}}function ue(t,e,i){const s=e||1,n=Math.floor(t.height*s),o=Math.floor(t.width*s);t.height=n/s,t.width=o/s;const a=t.canvas;return a.style&&(i||!a.style.height&&!a.style.width)&&(a.style.height=`${t.height}px`,a.style.width=`${t.width}px`),(t.currentDevicePixelRatio!==s||a.height!==n||a.width!==o)&&(t.currentDevicePixelRatio=s,a.height=n,a.width=o,t.ctx.setTransform(s,0,0,s,0,0),!0)}const fe=function(){let t=!1;try{const e={get passive(){return t=!0,!1}};window.addEventListener("test",null,e),window.removeEventListener("test",null,e)}catch(t){}return t}();function ge(t,e){const i=ae(t,e),s=i&&i.match(/^(\d+)(\.\d+)?px$/);return s?+s[1]:void 0}function pe(t){return!t||U(t.size)||U(t.family)?null:(t.style?t.style+" ":"")+(t.weight?t.weight+" ":"")+t.size+"px "+t.family}function me(t,e,i,s,n){let o=e[n];return o||(o=e[n]=t.measureText(n).width,i.push(n)),o>s&&(s=o),s}function be(t,e,i,s){let n=(s=s||{}).data=s.data||{},o=s.garbageCollect=s.garbageCollect||[];s.font!==e&&(n=s.data={},o=s.garbageCollect=[],s.font=e),t.save(),t.font=e;let a=0;const r=i.length;let l,h,c,d,u;for(l=0;l<r;l++)if(d=i[l],null!=d&&!0!==X(d))a=me(t,n,o,a,d);else if(X(d))for(h=0,c=d.length;h<c;h++)u=d[h],null==u||X(u)||(a=me(t,n,o,a,u));t.restore();const f=o.length/2;if(f>i.length){for(l=0;l<f;l++)delete n[o[l]];o.splice(0,f)}return a}function xe(t,e,i){const s=t.currentDevicePixelRatio,n=0!==i?Math.max(i/2,.5):0;return Math.round((e-n)*s)/s+n}function _e(t,e){(e=e||t.getContext("2d")).save(),e.resetTransform(),e.clearRect(0,0,t.width,t.height),e.restore()}function ye(t,e,i,s){ve(t,e,i,s,null)}function ve(t,e,i,s,n){let o,a,r,l,h,c;const d=e.pointStyle,u=e.rotation,f=e.radius;let g=(u||0)*Rt;if(d&&"object"==typeof d&&(o=d.toString(),"[object HTMLImageElement]"===o||"[object HTMLCanvasElement]"===o))return t.save(),t.translate(i,s),t.rotate(g),t.drawImage(d,-d.width/2,-d.height/2,d.width,d.height),void t.restore();if(!(isNaN(f)||f<=0)){switch(t.beginPath(),d){default:n?t.ellipse(i,s,n/2,f,0,0,At):t.arc(i,s,f,0,At),t.closePath();break;case"triangle":t.moveTo(i+Math.sin(g)*f,s-Math.cos(g)*f),g+=zt,t.lineTo(i+Math.sin(g)*f,s-Math.cos(g)*f),g+=zt,t.lineTo(i+Math.sin(g)*f,s-Math.cos(g)*f),t.closePath();break;case"rectRounded":h=.516*f,l=f-h,a=Math.cos(g+It)*l,r=Math.sin(g+It)*l,t.arc(i-a,s-r,h,g-Ot,g-Et),t.arc(i+r,s-a,h,g-Et,g),t.arc(i+a,s+r,h,g,g+Et),t.arc(i-r,s+a,h,g+Et,g+Ot),t.closePath();break;case"rect":if(!u){l=Math.SQRT1_2*f,c=n?n/2:l,t.rect(i-c,s-l,2*c,2*l);break}g+=It;case"rectRot":a=Math.cos(g)*f,r=Math.sin(g)*f,t.moveTo(i-a,s-r),t.lineTo(i+r,s-a),t.lineTo(i+a,s+r),t.lineTo(i-r,s+a),t.closePath();break;case"crossRot":g+=It;case"cross":a=Math.cos(g)*f,r=Math.sin(g)*f,t.moveTo(i-a,s-r),t.lineTo(i+a,s+r),t.moveTo(i+r,s-a),t.lineTo(i-r,s+a);break;case"star":a=Math.cos(g)*f,r=Math.sin(g)*f,t.moveTo(i-a,s-r),t.lineTo(i+a,s+r),t.moveTo(i+r,s-a),t.lineTo(i-r,s+a),g+=It,a=Math.cos(g)*f,r=Math.sin(g)*f,t.moveTo(i-a,s-r),t.lineTo(i+a,s+r),t.moveTo(i+r,s-a),t.lineTo(i-r,s+a);break;case"line":a=n?n/2:Math.cos(g)*f,r=Math.sin(g)*f,t.moveTo(i-a,s-r),t.lineTo(i+a,s+r);break;case"dash":t.moveTo(i,s),t.lineTo(i+Math.cos(g)*f,s+Math.sin(g)*f)}t.fill(),e.borderWidth>0&&t.stroke()}}function we(t,e,i){return i=i||.5,!e||t&&t.x>e.left-i&&t.x<e.right+i&&t.y>e.top-i&&t.y<e.bottom+i}function Me(t,e){t.save(),t.beginPath(),t.rect(e.left,e.top,e.right-e.left,e.bottom-e.top),t.clip()}function ke(t){t.restore()}function Se(t,e,i,s,n){if(!e)return t.lineTo(i.x,i.y);if("middle"===n){const s=(e.x+i.x)/2;t.lineTo(s,e.y),t.lineTo(s,i.y)}else"after"===n!=!!s?t.lineTo(e.x,i.y):t.lineTo(i.x,e.y);t.lineTo(i.x,i.y)}function Pe(t,e,i,s){if(!e)return t.lineTo(i.x,i.y);t.bezierCurveTo(s?e.cp1x:e.cp2x,s?e.cp1y:e.cp2y,s?i.cp2x:i.cp1x,s?i.cp2y:i.cp1y,i.x,i.y)}function De(t,e,i,s,n,o={}){const a=X(e)?e:[e],r=o.strokeWidth>0&&""!==o.strokeColor;let l,h;for(t.save(),t.font=n.string,function(t,e){e.translation&&t.translate(e.translation[0],e.translation[1]);U(e.rotation)||t.rotate(e.rotation);e.color&&(t.fillStyle=e.color);e.textAlign&&(t.textAlign=e.textAlign);e.textBaseline&&(t.textBaseline=e.textBaseline)}(t,o),l=0;l<a.length;++l)h=a[l],r&&(o.strokeColor&&(t.strokeStyle=o.strokeColor),U(o.strokeWidth)||(t.lineWidth=o.strokeWidth),t.strokeText(h,i,s,o.maxWidth)),t.fillText(h,i,s,o.maxWidth),Ce(t,i,s,h,o),s+=n.lineHeight;t.restore()}function Ce(t,e,i,s,n){if(n.strikethrough||n.underline){const o=t.measureText(s),a=e-o.actualBoundingBoxLeft,r=e+o.actualBoundingBoxRight,l=i-o.actualBoundingBoxAscent,h=i+o.actualBoundingBoxDescent,c=n.strikethrough?(l+h)/2:h;t.strokeStyle=t.fillStyle,t.beginPath(),t.lineWidth=n.decorationWidth||2,t.moveTo(a,c),t.lineTo(r,c),t.stroke()}}function Oe(t,e){const{x:i,y:s,w:n,h:o,radius:a}=e;t.arc(i+a.topLeft,s+a.topLeft,a.topLeft,-Et,Ot,!0),t.lineTo(i,s+o-a.bottomLeft),t.arc(i+a.bottomLeft,s+o-a.bottomLeft,a.bottomLeft,Ot,Et,!0),t.lineTo(i+n-a.bottomRight,s+o),t.arc(i+n-a.bottomRight,s+o-a.bottomRight,a.bottomRight,Et,0,!0),t.lineTo(i+n,s+a.topRight),t.arc(i+n-a.topRight,s+a.topRight,a.topRight,0,-Et,!0),t.lineTo(i+a.topLeft,s)}function Ae(t,e=[""],i=t,s,n=(()=>t[0])){ut(s)||(s=Ne("_fallback",t));const o={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:t,_rootScopes:i,_fallback:s,_getTarget:n,override:n=>Ae([n,...t],e,i,s)};return new Proxy(o,{deleteProperty:(e,i)=>(delete e[i],delete e._keys,delete t[0][i],!0),get:(i,s)=>Ie(i,s,(()=>function(t,e,i,s){let n;for(const o of e)if(n=Ne(Re(o,t),i),ut(n))return Ee(t,n)?Ve(i,s,t,n):n}(s,e,t,i))),getOwnPropertyDescriptor:(t,e)=>Reflect.getOwnPropertyDescriptor(t._scopes[0],e),getPrototypeOf:()=>Reflect.getPrototypeOf(t[0]),has:(t,e)=>je(t).includes(e),ownKeys:t=>je(t),set(t,e,i){const s=t._storage||(t._storage=n());return t[e]=s[e]=i,delete t._keys,!0}})}function Te(t,e,i,s){const n={_cacheable:!1,_proxy:t,_context:e,_subProxy:i,_stack:new Set,_descriptors:Le(t,s),setContext:e=>Te(t,e,i,s),override:n=>Te(t.override(n),e,i,s)};return new Proxy(n,{deleteProperty:(e,i)=>(delete e[i],delete t[i],!0),get:(t,e,i)=>Ie(t,e,(()=>function(t,e,i){const{_proxy:s,_context:n,_subProxy:o,_descriptors:a}=t;let r=s[e];ft(r)&&a.isScriptable(e)&&(r=function(t,e,i,s){const{_proxy:n,_context:o,_subProxy:a,_stack:r}=i;if(r.has(t))throw new Error("Recursion detected: "+Array.from(r).join("->")+"->"+t);r.add(t),e=e(o,a||s),r.delete(t),Ee(t,e)&&(e=Ve(n._scopes,n,t,e));return e}(e,r,t,i));X(r)&&r.length&&(r=function(t,e,i,s){const{_proxy:n,_context:o,_subProxy:a,_descriptors:r}=i;if(ut(o.index)&&s(t))e=e[o.index%e.length];else if(q(e[0])){const i=e,s=n._scopes.filter((t=>t!==i));e=[];for(const l of i){const i=Ve(s,n,t,l);e.push(Te(i,o,a&&a[t],r))}}return e}(e,r,t,a.isIndexable));Ee(e,r)&&(r=Te(r,n,o&&o[e],a));return r}(t,e,i))),getOwnPropertyDescriptor:(e,i)=>e._descriptors.allKeys?Reflect.has(t,i)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(t,i),getPrototypeOf:()=>Reflect.getPrototypeOf(t),has:(e,i)=>Reflect.has(t,i),ownKeys:()=>Reflect.ownKeys(t),set:(e,i,s)=>(t[i]=s,delete e[i],!0)})}function Le(t,e={scriptable:!0,indexable:!0}){const{_scriptable:i=e.scriptable,_indexable:s=e.indexable,_allKeys:n=e.allKeys}=t;return{allKeys:n,scriptable:i,indexable:s,isScriptable:ft(i)?i:()=>i,isIndexable:ft(s)?s:()=>s}}const Re=(t,e)=>t?t+dt(e):e,Ee=(t,e)=>q(e)&&"adapters"!==t&&(null===Object.getPrototypeOf(e)||e.constructor===Object);function Ie(t,e,i){if(Object.prototype.hasOwnProperty.call(t,e))return t[e];const s=i();return t[e]=s,s}function ze(t,e,i){return ft(t)?t(e,i):t}const Fe=(t,e)=>!0===t?e:"string"==typeof t?ct(e,t):void 0;function Be(t,e,i,s,n){for(const o of e){const e=Fe(i,o);if(e){t.add(e);const o=ze(e._fallback,i,n);if(ut(o)&&o!==i&&o!==s)return o}else if(!1===e&&ut(s)&&i!==s)return null}return!1}function Ve(t,e,i,s){const n=e._rootScopes,o=ze(e._fallback,i,s),a=[...t,...n],r=new Set;r.add(s);let l=We(r,a,i,o||i,s);return null!==l&&((!ut(o)||o===i||(l=We(r,a,o,l,s),null!==l))&&Ae(Array.from(r),[""],n,o,(()=>function(t,e,i){const s=t._getTarget();e in s||(s[e]={});const n=s[e];if(X(n)&&q(i))return i;return n}(e,i,s))))}function We(t,e,i,s,n){for(;i;)i=Be(t,e,i,s,n);return i}function Ne(t,e){for(const i of e){if(!i)continue;const e=i[t];if(ut(e))return e}}function je(t){let e=t._keys;return e||(e=t._keys=function(t){const e=new Set;for(const i of t)for(const t of Object.keys(i).filter((t=>!t.startsWith("_"))))e.add(t);return Array.from(e)}(t._scopes)),e}function He(t,e,i,s){const{iScale:n}=t,{key:o="r"}=this._parsing,a=new Array(s);let r,l,h,c;for(r=0,l=s;r<l;++r)h=r+i,c=e[h],a[r]={r:n.parse(ct(c,o),h)};return a}const $e=Number.EPSILON||1e-14,Ye=(t,e)=>e<t.length&&!t[e].skip&&t[e],Ue=t=>"x"===t?"y":"x";function Xe(t,e,i,s){const n=t.skip?e:t,o=e,a=i.skip?e:i,r=Kt(o,n),l=Kt(a,o);let h=r/(r+l),c=l/(r+l);h=isNaN(h)?0:h,c=isNaN(c)?0:c;const d=s*h,u=s*c;return{previous:{x:o.x-d*(a.x-n.x),y:o.y-d*(a.y-n.y)},next:{x:o.x+u*(a.x-n.x),y:o.y+u*(a.y-n.y)}}}function qe(t,e="x"){const i=Ue(e),s=t.length,n=Array(s).fill(0),o=Array(s);let a,r,l,h=Ye(t,0);for(a=0;a<s;++a)if(r=l,l=h,h=Ye(t,a+1),l){if(h){const t=h[e]-l[e];n[a]=0!==t?(h[i]-l[i])/t:0}o[a]=r?h?Bt(n[a-1])!==Bt(n[a])?0:(n[a-1]+n[a])/2:n[a-1]:n[a]}!function(t,e,i){const s=t.length;let n,o,a,r,l,h=Ye(t,0);for(let c=0;c<s-1;++c)l=h,h=Ye(t,c+1),l&&h&&(jt(e[c],0,$e)?i[c]=i[c+1]=0:(n=i[c]/e[c],o=i[c+1]/e[c],r=Math.pow(n,2)+Math.pow(o,2),r<=9||(a=3/Math.sqrt(r),i[c]=n*a*e[c],i[c+1]=o*a*e[c])))}(t,n,o),function(t,e,i="x"){const s=Ue(i),n=t.length;let o,a,r,l=Ye(t,0);for(let h=0;h<n;++h){if(a=r,r=l,l=Ye(t,h+1),!r)continue;const n=r[i],c=r[s];a&&(o=(n-a[i])/3,r[`cp1${i}`]=n-o,r[`cp1${s}`]=c-o*e[h]),l&&(o=(l[i]-n)/3,r[`cp2${i}`]=n+o,r[`cp2${s}`]=c+o*e[h])}}(t,o,e)}function Ke(t,e,i){return Math.max(Math.min(t,i),e)}function Ge(t,e,i,s,n){let o,a,r,l;if(e.spanGaps&&(t=t.filter((t=>!t.skip))),"monotone"===e.cubicInterpolationMode)qe(t,n);else{let i=s?t[t.length-1]:t[0];for(o=0,a=t.length;o<a;++o)r=t[o],l=Xe(i,r,t[Math.min(o+1,a-(s?0:1))%a],e.tension),r.cp1x=l.previous.x,r.cp1y=l.previous.y,r.cp2x=l.next.x,r.cp2y=l.next.y,i=r}e.capBezierPoints&&function(t,e){let i,s,n,o,a,r=we(t[0],e);for(i=0,s=t.length;i<s;++i)a=o,o=r,r=i<s-1&&we(t[i+1],e),o&&(n=t[i],a&&(n.cp1x=Ke(n.cp1x,e.left,e.right),n.cp1y=Ke(n.cp1y,e.top,e.bottom)),r&&(n.cp2x=Ke(n.cp2x,e.left,e.right),n.cp2y=Ke(n.cp2y,e.top,e.bottom)))}(t,i)}const Ze=t=>0===t||1===t,Je=(t,e,i)=>-Math.pow(2,10*(t-=1))*Math.sin((t-e)*At/i),Qe=(t,e,i)=>Math.pow(2,-10*t)*Math.sin((t-e)*At/i)+1,ti={linear:t=>t,easeInQuad:t=>t*t,easeOutQuad:t=>-t*(t-2),easeInOutQuad:t=>(t/=.5)<1?.5*t*t:-.5*(--t*(t-2)-1),easeInCubic:t=>t*t*t,easeOutCubic:t=>(t-=1)*t*t+1,easeInOutCubic:t=>(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2),easeInQuart:t=>t*t*t*t,easeOutQuart:t=>-((t-=1)*t*t*t-1),easeInOutQuart:t=>(t/=.5)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2),easeInQuint:t=>t*t*t*t*t,easeOutQuint:t=>(t-=1)*t*t*t*t+1,easeInOutQuint:t=>(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2),easeInSine:t=>1-Math.cos(t*Et),easeOutSine:t=>Math.sin(t*Et),easeInOutSine:t=>-.5*(Math.cos(Ot*t)-1),easeInExpo:t=>0===t?0:Math.pow(2,10*(t-1)),easeOutExpo:t=>1===t?1:1-Math.pow(2,-10*t),easeInOutExpo:t=>Ze(t)?t:t<.5?.5*Math.pow(2,10*(2*t-1)):.5*(2-Math.pow(2,-10*(2*t-1))),easeInCirc:t=>t>=1?t:-(Math.sqrt(1-t*t)-1),easeOutCirc:t=>Math.sqrt(1-(t-=1)*t),easeInOutCirc:t=>(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1),easeInElastic:t=>Ze(t)?t:Je(t,.075,.3),easeOutElastic:t=>Ze(t)?t:Qe(t,.075,.3),easeInOutElastic(t){const e=.1125;return Ze(t)?t:t<.5?.5*Je(2*t,e,.45):.5+.5*Qe(2*t-1,e,.45)},easeInBack(t){const e=1.70158;return t*t*((e+1)*t-e)},easeOutBack(t){const e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack(t){let e=1.70158;return(t/=.5)<1?t*t*((1+(e*=1.525))*t-e)*.5:.5*((t-=2)*t*((1+(e*=1.525))*t+e)+2)},easeInBounce:t=>1-ti.easeOutBounce(1-t),easeOutBounce(t){const e=7.5625,i=2.75;return t<1/i?e*t*t:t<2/i?e*(t-=1.5/i)*t+.75:t<2.5/i?e*(t-=2.25/i)*t+.9375:e*(t-=2.625/i)*t+.984375},easeInOutBounce:t=>t<.5?.5*ti.easeInBounce(2*t):.5*ti.easeOutBounce(2*t-1)+.5};function ei(t,e,i,s){return{x:t.x+i*(e.x-t.x),y:t.y+i*(e.y-t.y)}}function ii(t,e,i,s){return{x:t.x+i*(e.x-t.x),y:"middle"===s?i<.5?t.y:e.y:"after"===s?i<1?t.y:e.y:i>0?e.y:t.y}}function si(t,e,i,s){const n={x:t.cp2x,y:t.cp2y},o={x:e.cp1x,y:e.cp1y},a=ei(t,n,i),r=ei(n,o,i),l=ei(o,e,i),h=ei(a,r,i),c=ei(r,l,i);return ei(h,c,i)}const ni=new Map;function oi(t,e,i){return function(t,e){e=e||{};const i=t+JSON.stringify(e);let s=ni.get(i);return s||(s=new Intl.NumberFormat(t,e),ni.set(i,s)),s}(e,i).format(t)}const ai=new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/),ri=new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);function li(t,e){const i=(""+t).match(ai);if(!i||"normal"===i[1])return 1.2*e;switch(t=+i[2],i[3]){case"px":return t;case"%":t/=100}return e*t}function hi(t,e){const i={},s=q(e),n=s?Object.keys(e):e,o=q(t)?s?i=>Z(t[i],t[e[i]]):e=>t[e]:()=>t;for(const t of n)i[t]=+o(t)||0;return i}function ci(t){return hi(t,{top:"y",right:"x",bottom:"y",left:"x"})}function di(t){return hi(t,["topLeft","topRight","bottomLeft","bottomRight"])}function ui(t){const e=ci(t);return e.width=e.left+e.right,e.height=e.top+e.bottom,e}function fi(t,e){t=t||{},e=e||yt.font;let i=Z(t.size,e.size);"string"==typeof i&&(i=parseInt(i,10));let s=Z(t.style,e.style);s&&!(""+s).match(ri)&&(console.warn('Invalid font style specified: "'+s+'"'),s="");const n={family:Z(t.family,e.family),lineHeight:li(Z(t.lineHeight,e.lineHeight),i),size:i,style:s,weight:Z(t.weight,e.weight),string:""};return n.string=pe(n),n}function gi(t,e,i,s){let n,o,a,r=!0;for(n=0,o=t.length;n<o;++n)if(a=t[n],void 0!==a&&(void 0!==e&&"function"==typeof a&&(a=a(e),r=!1),void 0!==i&&X(a)&&(a=a[i%a.length],r=!1),void 0!==a))return s&&!r&&(s.cacheable=!1),a}function pi(t,e,i){const{min:s,max:n}=t,o=Q(e,(n-s)/2),a=(t,e)=>i&&0===t?0:t+e;return{min:a(s,-Math.abs(o)),max:a(n,o)}}function mi(t,e){return Object.assign(Object.create(t),e)}function bi(t,e,i){return t?function(t,e){return{x:i=>t+t+e-i,setWidth(t){e=t},textAlign:t=>"center"===t?t:"right"===t?"left":"right",xPlus:(t,e)=>t-e,leftForLtr:(t,e)=>t-e}}(e,i):{x:t=>t,setWidth(t){},textAlign:t=>t,xPlus:(t,e)=>t+e,leftForLtr:(t,e)=>t}}function xi(t,e){let i,s;"ltr"!==e&&"rtl"!==e||(i=t.canvas.style,s=[i.getPropertyValue("direction"),i.getPropertyPriority("direction")],i.setProperty("direction",e,"important"),t.prevTextDirection=s)}function _i(t,e){void 0!==e&&(delete t.prevTextDirection,t.canvas.style.setProperty("direction",e[0],e[1]))}function yi(t){return"angle"===t?{between:Jt,compare:Gt,normalize:Zt}:{between:ee,compare:(t,e)=>t-e,normalize:t=>t}}function vi({start:t,end:e,count:i,loop:s,style:n}){return{start:t%i,end:e%i,loop:s&&(e-t+1)%i==0,style:n}}function wi(t,e,i){if(!i)return[t];const{property:s,start:n,end:o}=i,a=e.length,{compare:r,between:l,normalize:h}=yi(s),{start:c,end:d,loop:u,style:f}=function(t,e,i){const{property:s,start:n,end:o}=i,{between:a,normalize:r}=yi(s),l=e.length;let h,c,{start:d,end:u,loop:f}=t;if(f){for(d+=l,u+=l,h=0,c=l;h<c&&a(r(e[d%l][s]),n,o);++h)d--,u--;d%=l,u%=l}return u<d&&(u+=l),{start:d,end:u,loop:f,style:t.style}}(t,e,i),g=[];let p,m,b,x=!1,_=null;const y=()=>x||l(n,b,p)&&0!==r(n,b),v=()=>!x||0===r(o,p)||l(o,b,p);for(let t=c,i=c;t<=d;++t)m=e[t%a],m.skip||(p=h(m[s]),p!==b&&(x=l(p,n,o),null===_&&y()&&(_=0===r(p,n)?t:i),null!==_&&v()&&(g.push(vi({start:_,end:t,loop:u,count:a,style:f})),_=null),i=t,b=p));return null!==_&&g.push(vi({start:_,end:d,loop:u,count:a,style:f})),g}function Mi(t,e){const i=[],s=t.segments;for(let n=0;n<s.length;n++){const o=wi(s[n],t.points,e);o.length&&i.push(...o)}return i}function ki(t,e){const i=t.points,s=t.options.spanGaps,n=i.length;if(!n)return[];const o=!!t._loop,{start:a,end:r}=function(t,e,i,s){let n=0,o=e-1;if(i&&!s)for(;n<e&&!t[n].skip;)n++;for(;n<e&&t[n].skip;)n++;for(n%=e,i&&(o+=n);o>n&&t[o%e].skip;)o--;return o%=e,{start:n,end:o}}(i,n,o,s);if(!0===s)return Si(t,[{start:a,end:r,loop:o}],i,e);return Si(t,function(t,e,i,s){const n=t.length,o=[];let a,r=e,l=t[e];for(a=e+1;a<=i;++a){const i=t[a%n];i.skip||i.stop?l.skip||(s=!1,o.push({start:e%n,end:(a-1)%n,loop:s}),e=r=i.stop?a:null):(r=a,l.skip&&(e=a)),l=i}return null!==r&&o.push({start:e%n,end:r%n,loop:s}),o}(i,a,r<a?r+n:r,!!t._fullLoop&&0===a&&r===n-1),i,e)}function Si(t,e,i,s){return s&&s.setContext&&i?function(t,e,i,s){const n=t._chart.getContext(),o=Pi(t.options),{_datasetIndex:a,options:{spanGaps:r}}=t,l=i.length,h=[];let c=o,d=e[0].start,u=d;function f(t,e,s,n){const o=r?-1:1;if(t!==e){for(t+=l;i[t%l].skip;)t-=o;for(;i[e%l].skip;)e+=o;t%l!=e%l&&(h.push({start:t%l,end:e%l,loop:s,style:n}),c=n,d=e%l)}}for(const t of e){d=r?d:t.start;let e,o=i[d%l];for(u=d+1;u<=t.end;u++){const r=i[u%l];e=Pi(s.setContext(mi(n,{type:"segment",p0:o,p1:r,p0DataIndex:(u-1)%l,p1DataIndex:u%l,datasetIndex:a}))),Di(e,c)&&f(d,u-1,t.loop,c),o=r,c=e}d<u-1&&f(d,u-1,t.loop,c)}return h}(t,e,i,s):e}function Pi(t){return{backgroundColor:t.backgroundColor,borderCapStyle:t.borderCapStyle,borderDash:t.borderDash,borderDashOffset:t.borderDashOffset,borderJoinStyle:t.borderJoinStyle,borderWidth:t.borderWidth,borderColor:t.borderColor}}function Di(t,e){return e&&JSON.stringify(t)!==JSON.stringify(e)}var Ci=Object.freeze({__proto__:null,easingEffects:ti,isPatternOrGradient:N,color:j,getHoverColor:H,noop:$,uid:Y,isNullOrUndef:U,isArray:X,isObject:q,isFinite:K,finiteOrDefault:G,valueOrDefault:Z,toPercentage:J,toDimension:Q,callback:tt,each:et,_elementsEqual:it,clone:st,_merger:ot,merge:at,mergeIf:rt,_mergerIf:lt,_deprecated:function(t,e,i,s){void 0!==e&&console.warn(t+': "'+i+'" is deprecated. Please use "'+s+'" instead')},resolveObjectKey:ct,_capitalize:dt,defined:ut,isFunction:ft,setsEqual:gt,_isClickEvent:pt,toFontString:pe,_measureText:me,_longestText:be,_alignPixel:xe,clearCanvas:_e,drawPoint:ye,drawPointLegend:ve,_isPointInArea:we,clipArea:Me,unclipArea:ke,_steppedLineTo:Se,_bezierCurveTo:Pe,renderText:De,addRoundedRectPath:Oe,_lookup:vt,_lookupByKey:wt,_rlookupByKey:Mt,_filterBetween:kt,listenArrayEvents:Pt,unlistenArrayEvents:Dt,_arrayUnique:Ct,_createResolver:Ae,_attachContext:Te,_descriptors:Le,_parseObjectDataRadialScale:He,splineCurve:Xe,splineCurveMonotone:qe,_updateBezierControlPoints:Ge,_isDomSupported:ie,_getParentNode:se,getStyle:ae,getRelativePosition:he,getMaximumSize:de,retinaScale:ue,supportsEventListenerOptions:fe,readUsedSize:ge,fontString:function(t,e,i){return e+" "+t+"px "+i},requestAnimFrame:t,throttled:e,debounce:i,_toLeftRightCenter:s,_alignStartEnd:n,_textX:o,_pointInLine:ei,_steppedInterpolation:ii,_bezierInterpolation:si,formatNumber:oi,toLineHeight:li,_readValueToProps:hi,toTRBL:ci,toTRBLCorners:di,toPadding:ui,toFont:fi,resolve:gi,_addGrace:pi,createContext:mi,PI:Ot,TAU:At,PITAU:Tt,INFINITY:Lt,RAD_PER_DEG:Rt,HALF_PI:Et,QUARTER_PI:It,TWO_THIRDS_PI:zt,log10:Ft,sign:Bt,niceNum:Vt,_factorize:Wt,isNumber:Nt,almostEquals:jt,almostWhole:Ht,_setMinAndMaxByKey:$t,toRadians:Yt,toDegrees:Ut,_decimalPlaces:Xt,getAngleFromPoint:qt,distanceBetweenPoints:Kt,_angleDiff:Gt,_normalizeAngle:Zt,_angleBetween:Jt,_limitValue:Qt,_int16Range:te,_isBetween:ee,getRtlAdapter:bi,overrideTextDirection:xi,restoreTextDirection:_i,_boundSegment:wi,_boundSegments:Mi,_computeSegments:ki});function Oi(t,e,i,s){const{controller:n,data:o,_sorted:a}=t,r=n._cachedMeta.iScale;if(r&&e===r.axis&&"r"!==e&&a&&o.length){const t=r._reversePixels?Mt:wt;if(!s)return t(o,e,i);if(n._sharedOptions){const s=o[0],n="function"==typeof s.getRange&&s.getRange(e);if(n){const s=t(o,e,i-n),a=t(o,e,i+n);return{lo:s.lo,hi:a.hi}}}}return{lo:0,hi:o.length-1}}function Ai(t,e,i,s,n){const o=t.getSortedVisibleDatasetMetas(),a=i[e];for(let t=0,i=o.length;t<i;++t){const{index:i,data:r}=o[t],{lo:l,hi:h}=Oi(o[t],e,a,n);for(let t=l;t<=h;++t){const e=r[t];e.skip||s(e,i,t)}}}function Ti(t,e,i,s,n){const o=[];if(!n&&!t.isPointInArea(e))return o;return Ai(t,i,e,(function(i,a,r){(n||we(i,t.chartArea,0))&&i.inRange(e.x,e.y,s)&&o.push({element:i,datasetIndex:a,index:r})}),!0),o}function Li(t,e,i,s,n,o){let a=[];const r=function(t){const e=-1!==t.indexOf("x"),i=-1!==t.indexOf("y");return function(t,s){const n=e?Math.abs(t.x-s.x):0,o=i?Math.abs(t.y-s.y):0;return Math.sqrt(Math.pow(n,2)+Math.pow(o,2))}}(i);let l=Number.POSITIVE_INFINITY;return Ai(t,i,e,(function(i,h,c){const d=i.inRange(e.x,e.y,n);if(s&&!d)return;const u=i.getCenterPoint(n);if(!(!!o||t.isPointInArea(u))&&!d)return;const f=r(e,u);f<l?(a=[{element:i,datasetIndex:h,index:c}],l=f):f===l&&a.push({element:i,datasetIndex:h,index:c})})),a}function Ri(t,e,i,s,n,o){return o||t.isPointInArea(e)?"r"!==i||s?Li(t,e,i,s,n,o):function(t,e,i,s){let n=[];return Ai(t,i,e,(function(t,i,o){const{startAngle:a,endAngle:r}=t.getProps(["startAngle","endAngle"],s),{angle:l}=qt(t,{x:e.x,y:e.y});Jt(l,a,r)&&n.push({element:t,datasetIndex:i,index:o})})),n}(t,e,i,n):[]}function Ei(t,e,i,s,n){const o=[],a="x"===i?"inXRange":"inYRange";let r=!1;return Ai(t,i,e,((t,s,l)=>{t[a](e[i],n)&&(o.push({element:t,datasetIndex:s,index:l}),r=r||t.inRange(e.x,e.y,n))})),s&&!r?[]:o}var Ii={evaluateInteractionItems:Ai,modes:{index(t,e,i,s){const n=he(e,t),o=i.axis||"x",a=i.includeInvisible||!1,r=i.intersect?Ti(t,n,o,s,a):Ri(t,n,o,!1,s,a),l=[];return r.length?(t.getSortedVisibleDatasetMetas().forEach((t=>{const e=r[0].index,i=t.data[e];i&&!i.skip&&l.push({element:i,datasetIndex:t.index,index:e})})),l):[]},dataset(t,e,i,s){const n=he(e,t),o=i.axis||"xy",a=i.includeInvisible||!1;let r=i.intersect?Ti(t,n,o,s,a):Ri(t,n,o,!1,s,a);if(r.length>0){const e=r[0].datasetIndex,i=t.getDatasetMeta(e).data;r=[];for(let t=0;t<i.length;++t)r.push({element:i[t],datasetIndex:e,index:t})}return r},point:(t,e,i,s)=>Ti(t,he(e,t),i.axis||"xy",s,i.includeInvisible||!1),nearest(t,e,i,s){const n=he(e,t),o=i.axis||"xy",a=i.includeInvisible||!1;return Ri(t,n,o,i.intersect,s,a)},x:(t,e,i,s)=>Ei(t,he(e,t),"x",i.intersect,s),y:(t,e,i,s)=>Ei(t,he(e,t),"y",i.intersect,s)}};const zi=["left","top","right","bottom"];function Fi(t,e){return t.filter((t=>t.pos===e))}function Bi(t,e){return t.filter((t=>-1===zi.indexOf(t.pos)&&t.box.axis===e))}function Vi(t,e){return t.sort(((t,i)=>{const s=e?i:t,n=e?t:i;return s.weight===n.weight?s.index-n.index:s.weight-n.weight}))}function Wi(t,e){const i=function(t){const e={};for(const i of t){const{stack:t,pos:s,stackWeight:n}=i;if(!t||!zi.includes(s))continue;const o=e[t]||(e[t]={count:0,placed:0,weight:0,size:0});o.count++,o.weight+=n}return e}(t),{vBoxMaxWidth:s,hBoxMaxHeight:n}=e;let o,a,r;for(o=0,a=t.length;o<a;++o){r=t[o];const{fullSize:a}=r.box,l=i[r.stack],h=l&&r.stackWeight/l.weight;r.horizontal?(r.width=h?h*s:a&&e.availableWidth,r.height=n):(r.width=s,r.height=h?h*n:a&&e.availableHeight)}return i}function Ni(t,e,i,s){return Math.max(t[i],e[i])+Math.max(t[s],e[s])}function ji(t,e){t.top=Math.max(t.top,e.top),t.left=Math.max(t.left,e.left),t.bottom=Math.max(t.bottom,e.bottom),t.right=Math.max(t.right,e.right)}function Hi(t,e,i,s){const{pos:n,box:o}=i,a=t.maxPadding;if(!q(n)){i.size&&(t[n]-=i.size);const e=s[i.stack]||{size:0,count:1};e.size=Math.max(e.size,i.horizontal?o.height:o.width),i.size=e.size/e.count,t[n]+=i.size}o.getPadding&&ji(a,o.getPadding());const r=Math.max(0,e.outerWidth-Ni(a,t,"left","right")),l=Math.max(0,e.outerHeight-Ni(a,t,"top","bottom")),h=r!==t.w,c=l!==t.h;return t.w=r,t.h=l,i.horizontal?{same:h,other:c}:{same:c,other:h}}function $i(t,e){const i=e.maxPadding;function s(t){const s={left:0,top:0,right:0,bottom:0};return t.forEach((t=>{s[t]=Math.max(e[t],i[t])})),s}return s(t?["left","right"]:["top","bottom"])}function Yi(t,e,i,s){const n=[];let o,a,r,l,h,c;for(o=0,a=t.length,h=0;o<a;++o){r=t[o],l=r.box,l.update(r.width||e.w,r.height||e.h,$i(r.horizontal,e));const{same:a,other:d}=Hi(e,i,r,s);h|=a&&n.length,c=c||d,l.fullSize||n.push(r)}return h&&Yi(n,e,i,s)||c}function Ui(t,e,i,s,n){t.top=i,t.left=e,t.right=e+s,t.bottom=i+n,t.width=s,t.height=n}function Xi(t,e,i,s){const n=i.padding;let{x:o,y:a}=e;for(const r of t){const t=r.box,l=s[r.stack]||{count:1,placed:0,weight:1},h=r.stackWeight/l.weight||1;if(r.horizontal){const s=e.w*h,o=l.size||t.height;ut(l.start)&&(a=l.start),t.fullSize?Ui(t,n.left,a,i.outerWidth-n.right-n.left,o):Ui(t,e.left+l.placed,a,s,o),l.start=a,l.placed+=s,a=t.bottom}else{const s=e.h*h,a=l.size||t.width;ut(l.start)&&(o=l.start),t.fullSize?Ui(t,o,n.top,a,i.outerHeight-n.bottom-n.top):Ui(t,o,e.top+l.placed,a,s),l.start=o,l.placed+=s,o=t.right}}e.x=o,e.y=a}yt.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}});var qi={addBox(t,e){t.boxes||(t.boxes=[]),e.fullSize=e.fullSize||!1,e.position=e.position||"top",e.weight=e.weight||0,e._layers=e._layers||function(){return[{z:0,draw(t){e.draw(t)}}]},t.boxes.push(e)},removeBox(t,e){const i=t.boxes?t.boxes.indexOf(e):-1;-1!==i&&t.boxes.splice(i,1)},configure(t,e,i){e.fullSize=i.fullSize,e.position=i.position,e.weight=i.weight},update(t,e,i,s){if(!t)return;const n=ui(t.options.layout.padding),o=Math.max(e-n.width,0),a=Math.max(i-n.height,0),r=function(t){const e=function(t){const e=[];let i,s,n,o,a,r;for(i=0,s=(t||[]).length;i<s;++i)n=t[i],({position:o,options:{stack:a,stackWeight:r=1}}=n),e.push({index:i,box:n,pos:o,horizontal:n.isHorizontal(),weight:n.weight,stack:a&&o+a,stackWeight:r});return e}(t),i=Vi(e.filter((t=>t.box.fullSize)),!0),s=Vi(Fi(e,"left"),!0),n=Vi(Fi(e,"right")),o=Vi(Fi(e,"top"),!0),a=Vi(Fi(e,"bottom")),r=Bi(e,"x"),l=Bi(e,"y");return{fullSize:i,leftAndTop:s.concat(o),rightAndBottom:n.concat(l).concat(a).concat(r),chartArea:Fi(e,"chartArea"),vertical:s.concat(n).concat(l),horizontal:o.concat(a).concat(r)}}(t.boxes),l=r.vertical,h=r.horizontal;et(t.boxes,(t=>{"function"==typeof t.beforeLayout&&t.beforeLayout()}));const c=l.reduce(((t,e)=>e.box.options&&!1===e.box.options.display?t:t+1),0)||1,d=Object.freeze({outerWidth:e,outerHeight:i,padding:n,availableWidth:o,availableHeight:a,vBoxMaxWidth:o/2/c,hBoxMaxHeight:a/2}),u=Object.assign({},n);ji(u,ui(s));const f=Object.assign({maxPadding:u,w:o,h:a,x:n.left,y:n.top},n),g=Wi(l.concat(h),d);Yi(r.fullSize,f,d,g),Yi(l,f,d,g),Yi(h,f,d,g)&&Yi(l,f,d,g),function(t){const e=t.maxPadding;function i(i){const s=Math.max(e[i]-t[i],0);return t[i]+=s,s}t.y+=i("top"),t.x+=i("left"),i("right"),i("bottom")}(f),Xi(r.leftAndTop,f,d,g),f.x+=f.w,f.y+=f.h,Xi(r.rightAndBottom,f,d,g),t.chartArea={left:f.left,top:f.top,right:f.left+f.w,bottom:f.top+f.h,height:f.h,width:f.w},et(r.chartArea,(e=>{const i=e.box;Object.assign(i,t.chartArea),i.update(f.w,f.h,{left:0,top:0,right:0,bottom:0})}))}};class Ki{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,i){}removeEventListener(t,e,i){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,i,s){return e=Math.max(0,e||t.width),i=i||t.height,{width:e,height:Math.max(0,s?Math.floor(e/s):i)}}isAttached(t){return!0}updateConfig(t){}}class Gi extends Ki{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const Zi={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},Ji=t=>null===t||""===t;const Qi=!!fe&&{passive:!0};function ts(t,e,i){t.canvas.removeEventListener(e,i,Qi)}function es(t,e){for(const i of t)if(i===e||i.contains(e))return!0}function is(t,e,i){const s=t.canvas,n=new MutationObserver((t=>{let e=!1;for(const i of t)e=e||es(i.addedNodes,s),e=e&&!es(i.removedNodes,s);e&&i()}));return n.observe(document,{childList:!0,subtree:!0}),n}function ss(t,e,i){const s=t.canvas,n=new MutationObserver((t=>{let e=!1;for(const i of t)e=e||es(i.removedNodes,s),e=e&&!es(i.addedNodes,s);e&&i()}));return n.observe(document,{childList:!0,subtree:!0}),n}const ns=new Map;let os=0;function as(){const t=window.devicePixelRatio;t!==os&&(os=t,ns.forEach(((e,i)=>{i.currentDevicePixelRatio!==t&&e()})))}function rs(t,i,s){const n=t.canvas,o=n&&se(n);if(!o)return;const a=e(((t,e)=>{const i=o.clientWidth;s(t,e),i<o.clientWidth&&s()}),window),r=new ResizeObserver((t=>{const e=t[0],i=e.contentRect.width,s=e.contentRect.height;0===i&&0===s||a(i,s)}));return r.observe(o),function(t,e){ns.size||window.addEventListener("resize",as),ns.set(t,e)}(t,a),r}function ls(t,e,i){i&&i.disconnect(),"resize"===e&&function(t){ns.delete(t),ns.size||window.removeEventListener("resize",as)}(t)}function hs(t,i,s){const n=t.canvas,o=e((e=>{null!==t.ctx&&s(function(t,e){const i=Zi[t.type]||t.type,{x:s,y:n}=he(t,e);return{type:i,chart:e,native:t,x:void 0!==s?s:null,y:void 0!==n?n:null}}(e,t))}),t,(t=>{const e=t[0];return[e,e.offsetX,e.offsetY]}));return function(t,e,i){t.addEventListener(e,i,Qi)}(n,i,o),o}class cs extends Ki{acquireContext(t,e){const i=t&&t.getContext&&t.getContext("2d");return i&&i.canvas===t?(function(t,e){const i=t.style,s=t.getAttribute("height"),n=t.getAttribute("width");if(t.$chartjs={initial:{height:s,width:n,style:{display:i.display,height:i.height,width:i.width}}},i.display=i.display||"block",i.boxSizing=i.boxSizing||"border-box",Ji(n)){const e=ge(t,"width");void 0!==e&&(t.width=e)}if(Ji(s))if(""===t.style.height)t.height=t.width/(e||2);else{const e=ge(t,"height");void 0!==e&&(t.height=e)}}(t,e),i):null}releaseContext(t){const e=t.canvas;if(!e.$chartjs)return!1;const i=e.$chartjs.initial;["height","width"].forEach((t=>{const s=i[t];U(s)?e.removeAttribute(t):e.setAttribute(t,s)}));const s=i.style||{};return Object.keys(s).forEach((t=>{e.style[t]=s[t]})),e.width=e.width,delete e.$chartjs,!0}addEventListener(t,e,i){this.removeEventListener(t,e);const s=t.$proxies||(t.$proxies={}),n={attach:is,detach:ss,resize:rs}[e]||hs;s[e]=n(t,e,i)}removeEventListener(t,e){const i=t.$proxies||(t.$proxies={}),s=i[e];if(!s)return;({attach:ls,detach:ls,resize:ls}[e]||ts)(t,e,s),i[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,i,s){return de(t,e,i,s)}isAttached(t){const e=se(t);return!(!e||!e.isConnected)}}function ds(t){return!ie()||"undefined"!=typeof OffscreenCanvas&&t instanceof OffscreenCanvas?Gi:cs}var us=Object.freeze({__proto__:null,_detectPlatform:ds,BasePlatform:Ki,BasicPlatform:Gi,DomPlatform:cs});const fs="transparent",gs={boolean:(t,e,i)=>i>.5?e:t,color(t,e,i){const s=j(t||fs),n=s.valid&&j(e||fs);return n&&n.valid?n.mix(s,i).hexString():e},number:(t,e,i)=>t+(e-t)*i};class ps{constructor(t,e,i,s){const n=e[i];s=gi([t.to,s,n,t.from]);const o=gi([t.from,n,s]);this._active=!0,this._fn=t.fn||gs[t.type||typeof o],this._easing=ti[t.easing]||ti.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=i,this._from=o,this._to=s,this._promises=void 0}active(){return this._active}update(t,e,i){if(this._active){this._notify(!1);const s=this._target[this._prop],n=i-this._start,o=this._duration-n;this._start=i,this._duration=Math.floor(Math.max(o,t.duration)),this._total+=n,this._loop=!!t.loop,this._to=gi([t.to,e,s,t.from]),this._from=gi([t.from,s,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,i=this._duration,s=this._prop,n=this._from,o=this._loop,a=this._to;let r;if(this._active=n!==a&&(o||e<i),!this._active)return this._target[s]=a,void this._notify(!0);e<0?this._target[s]=n:(r=e/i%2,r=o&&r>1?2-r:r,r=this._easing(Math.min(1,Math.max(0,r))),this._target[s]=this._fn(n,a,r))}wait(){const t=this._promises||(this._promises=[]);return new Promise(((e,i)=>{t.push({res:e,rej:i})}))}_notify(t){const e=t?"res":"rej",i=this._promises||[];for(let t=0;t<i.length;t++)i[t][e]()}}yt.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0});const ms=Object.keys(yt.animation);yt.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>"onProgress"!==t&&"onComplete"!==t&&"fn"!==t}),yt.set("animations",{colors:{type:"color",properties:["color","borderColor","backgroundColor"]},numbers:{type:"number",properties:["x","y","borderWidth","radius","tension"]}}),yt.describe("animations",{_fallback:"animation"}),yt.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>0|t}}}});class bs{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!q(t))return;const e=this._properties;Object.getOwnPropertyNames(t).forEach((i=>{const s=t[i];if(!q(s))return;const n={};for(const t of ms)n[t]=s[t];(X(s.properties)&&s.properties||[i]).forEach((t=>{t!==i&&e.has(t)||e.set(t,n)}))}))}_animateOptions(t,e){const i=e.options,s=function(t,e){if(!e)return;let i=t.options;if(!i)return void(t.options=e);i.$shared&&(t.options=i=Object.assign({},i,{$shared:!1,$animations:{}}));return i}(t,i);if(!s)return[];const n=this._createAnimations(s,i);return i.$shared&&function(t,e){const i=[],s=Object.keys(e);for(let e=0;e<s.length;e++){const n=t[s[e]];n&&n.active()&&i.push(n.wait())}return Promise.all(i)}(t.options.$animations,i).then((()=>{t.options=i}),(()=>{})),n}_createAnimations(t,e){const i=this._properties,s=[],n=t.$animations||(t.$animations={}),o=Object.keys(e),a=Date.now();let r;for(r=o.length-1;r>=0;--r){const l=o[r];if("$"===l.charAt(0))continue;if("options"===l){s.push(...this._animateOptions(t,e));continue}const h=e[l];let c=n[l];const d=i.get(l);if(c){if(d&&c.active()){c.update(d,h,a);continue}c.cancel()}d&&d.duration?(n[l]=c=new ps(d,t,l,h),s.push(c)):t[l]=h}return s}update(t,e){if(0===this._properties.size)return void Object.assign(t,e);const i=this._createAnimations(t,e);return i.length?(a.add(this._chart,i),!0):void 0}}function xs(t,e){const i=t&&t.options||{},s=i.reverse,n=void 0===i.min?e:0,o=void 0===i.max?e:0;return{start:s?o:n,end:s?n:o}}function _s(t,e){const i=[],s=t._getSortedDatasetMetas(e);let n,o;for(n=0,o=s.length;n<o;++n)i.push(s[n].index);return i}function ys(t,e,i,s={}){const n=t.keys,o="single"===s.mode;let a,r,l,h;if(null!==e){for(a=0,r=n.length;a<r;++a){if(l=+n[a],l===i){if(s.all)continue;break}h=t.values[l],K(h)&&(o||0===e||Bt(e)===Bt(h))&&(e+=h)}return e}}function vs(t,e){const i=t&&t.options.stacked;return i||void 0===i&&void 0!==e.stack}function ws(t,e,i){const s=t[e]||(t[e]={});return s[i]||(s[i]={})}function Ms(t,e,i,s){for(const n of e.getMatchingVisibleMetas(s).reverse()){const e=t[n.index];if(i&&e>0||!i&&e<0)return n.index}return null}function ks(t,e){const{chart:i,_cachedMeta:s}=t,n=i._stacks||(i._stacks={}),{iScale:o,vScale:a,index:r}=s,l=o.axis,h=a.axis,c=function(t,e,i){return`${t.id}.${e.id}.${i.stack||i.type}`}(o,a,s),d=e.length;let u;for(let t=0;t<d;++t){const i=e[t],{[l]:o,[h]:d}=i;u=(i._stacks||(i._stacks={}))[h]=ws(n,c,o),u[r]=d,u._top=Ms(u,a,!0,s.type),u._bottom=Ms(u,a,!1,s.type)}}function Ss(t,e){const i=t.scales;return Object.keys(i).filter((t=>i[t].axis===e)).shift()}function Ps(t,e){const i=t.controller.index,s=t.vScale&&t.vScale.axis;if(s){e=e||t._parsed;for(const t of e){const e=t._stacks;if(!e||void 0===e[s]||void 0===e[s][i])return;delete e[s][i]}}}const Ds=t=>"reset"===t||"none"===t,Cs=(t,e)=>e?t:Object.assign({},t);class Os{constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=vs(t.vScale,t),this.addElements()}updateIndex(t){this.index!==t&&Ps(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,i=this.getDataset(),s=(t,e,i,s)=>"x"===t?e:"r"===t?s:i,n=e.xAxisID=Z(i.xAxisID,Ss(t,"x")),o=e.yAxisID=Z(i.yAxisID,Ss(t,"y")),a=e.rAxisID=Z(i.rAxisID,Ss(t,"r")),r=e.indexAxis,l=e.iAxisID=s(r,n,o,a),h=e.vAxisID=s(r,o,n,a);e.xScale=this.getScaleForId(n),e.yScale=this.getScaleForId(o),e.rScale=this.getScaleForId(a),e.iScale=this.getScaleForId(l),e.vScale=this.getScaleForId(h)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&Dt(this._data,this),t._stacked&&Ps(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),i=this._data;if(q(e))this._data=function(t){const e=Object.keys(t),i=new Array(e.length);let s,n,o;for(s=0,n=e.length;s<n;++s)o=e[s],i[s]={x:o,y:t[o]};return i}(e);else if(i!==e){if(i){Dt(i,this);const t=this._cachedMeta;Ps(t),t._parsed=[]}e&&Object.isExtensible(e)&&Pt(e,this),this._syncList=[],this._data=e}}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,i=this.getDataset();let s=!1;this._dataCheck();const n=e._stacked;e._stacked=vs(e.vScale,e),e.stack!==i.stack&&(s=!0,Ps(e),e.stack=i.stack),this._resyncElements(t),(s||n!==e._stacked)&&ks(this,e._parsed)}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),i=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(i,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:i,_data:s}=this,{iScale:n,_stacked:o}=i,a=n.axis;let r,l,h,c=0===t&&e===s.length||i._sorted,d=t>0&&i._parsed[t-1];if(!1===this._parsing)i._parsed=s,i._sorted=!0,h=s;else{h=X(s[t])?this.parseArrayData(i,s,t,e):q(s[t])?this.parseObjectData(i,s,t,e):this.parsePrimitiveData(i,s,t,e);const n=()=>null===l[a]||d&&l[a]<d[a];for(r=0;r<e;++r)i._parsed[r+t]=l=h[r],c&&(n()&&(c=!1),d=l);i._sorted=c}o&&ks(this,h)}parsePrimitiveData(t,e,i,s){const{iScale:n,vScale:o}=t,a=n.axis,r=o.axis,l=n.getLabels(),h=n===o,c=new Array(s);let d,u,f;for(d=0,u=s;d<u;++d)f=d+i,c[d]={[a]:h||n.parse(l[f],f),[r]:o.parse(e[f],f)};return c}parseArrayData(t,e,i,s){const{xScale:n,yScale:o}=t,a=new Array(s);let r,l,h,c;for(r=0,l=s;r<l;++r)h=r+i,c=e[h],a[r]={x:n.parse(c[0],h),y:o.parse(c[1],h)};return a}parseObjectData(t,e,i,s){const{xScale:n,yScale:o}=t,{xAxisKey:a="x",yAxisKey:r="y"}=this._parsing,l=new Array(s);let h,c,d,u;for(h=0,c=s;h<c;++h)d=h+i,u=e[d],l[h]={x:n.parse(ct(u,a),d),y:o.parse(ct(u,r),d)};return l}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,i){const s=this.chart,n=this._cachedMeta,o=e[t.axis];return ys({keys:_s(s,!0),values:e._stacks[t.axis]},o,n.index,{mode:i})}updateRangeFromParsed(t,e,i,s){const n=i[e.axis];let o=null===n?NaN:n;const a=s&&i._stacks[e.axis];s&&a&&(s.values=a,o=ys(s,n,this._cachedMeta.index)),t.min=Math.min(t.min,o),t.max=Math.max(t.max,o)}getMinMax(t,e){const i=this._cachedMeta,s=i._parsed,n=i._sorted&&t===i.iScale,o=s.length,a=this._getOtherScale(t),r=((t,e,i)=>t&&!e.hidden&&e._stacked&&{keys:_s(i,!0),values:null})(e,i,this.chart),l={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:h,max:c}=function(t){const{min:e,max:i,minDefined:s,maxDefined:n}=t.getUserBounds();return{min:s?e:Number.NEGATIVE_INFINITY,max:n?i:Number.POSITIVE_INFINITY}}(a);let d,u;function f(){u=s[d];const e=u[a.axis];return!K(u[t.axis])||h>e||c<e}for(d=0;d<o&&(f()||(this.updateRangeFromParsed(l,t,u,r),!n));++d);if(n)for(d=o-1;d>=0;--d)if(!f()){this.updateRangeFromParsed(l,t,u,r);break}return l}getAllParsedValues(t){const e=this._cachedMeta._parsed,i=[];let s,n,o;for(s=0,n=e.length;s<n;++s)o=e[s][t.axis],K(o)&&i.push(o);return i}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,i=e.iScale,s=e.vScale,n=this.getParsed(t);return{label:i?""+i.getLabelForValue(n[i.axis]):"",value:s?""+s.getLabelForValue(n[s.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=function(t){let e,i,s,n;return q(t)?(e=t.top,i=t.right,s=t.bottom,n=t.left):e=i=s=n=t,{top:e,right:i,bottom:s,left:n,disabled:!1===t}}(Z(this.options.clip,function(t,e,i){if(!1===i)return!1;const s=xs(t,i),n=xs(e,i);return{top:n.end,right:s.end,bottom:n.start,left:s.start}}(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,i=this._cachedMeta,s=i.data||[],n=e.chartArea,o=[],a=this._drawStart||0,r=this._drawCount||s.length-a,l=this.options.drawActiveElementsOnTop;let h;for(i.dataset&&i.dataset.draw(t,n,a,r),h=a;h<a+r;++h){const e=s[h];e.hidden||(e.active&&l?o.push(e):e.draw(t,n))}for(h=0;h<o.length;++h)o[h].draw(t,n)}getStyle(t,e){const i=e?"active":"default";return void 0===t&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(i):this.resolveDataElementOptions(t||0,i)}getContext(t,e,i){const s=this.getDataset();let n;if(t>=0&&t<this._cachedMeta.data.length){const e=this._cachedMeta.data[t];n=e.$context||(e.$context=function(t,e,i){return mi(t,{active:!1,dataIndex:e,parsed:void 0,raw:void 0,element:i,index:e,mode:"default",type:"data"})}(this.getContext(),t,e)),n.parsed=this.getParsed(t),n.raw=s.data[t],n.index=n.dataIndex=t}else n=this.$context||(this.$context=function(t,e){return mi(t,{active:!1,dataset:void 0,datasetIndex:e,index:e,mode:"default",type:"dataset"})}(this.chart.getContext(),this.index)),n.dataset=s,n.index=n.datasetIndex=this.index;return n.active=!!e,n.mode=i,n}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",i){const s="active"===e,n=this._cachedDataOpts,o=t+"-"+e,a=n[o],r=this.enableOptionSharing&&ut(i);if(a)return Cs(a,r);const l=this.chart.config,h=l.datasetElementScopeKeys(this._type,t),c=s?[`${t}Hover`,"hover",t,""]:[t,""],d=l.getOptionScopes(this.getDataset(),h),u=Object.keys(yt.elements[t]),f=l.resolveNamedOptions(d,u,(()=>this.getContext(i,s)),c);return f.$shared&&(f.$shared=r,n[o]=Object.freeze(Cs(f,r))),f}_resolveAnimations(t,e,i){const s=this.chart,n=this._cachedDataOpts,o=`animation-${e}`,a=n[o];if(a)return a;let r;if(!1!==s.options.animation){const s=this.chart.config,n=s.datasetAnimationScopeKeys(this._type,e),o=s.getOptionScopes(this.getDataset(),n);r=s.createResolver(o,this.getContext(t,i,e))}const l=new bs(s,r&&r.animations);return r&&r._cacheable&&(n[o]=Object.freeze(l)),l}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||Ds(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const i=this.resolveDataElementOptions(t,e),s=this._sharedOptions,n=this.getSharedOptions(i),o=this.includeOptions(e,n)||n!==s;return this.updateSharedOptions(n,e,i),{sharedOptions:n,includeOptions:o}}updateElement(t,e,i,s){Ds(s)?Object.assign(t,i):this._resolveAnimations(e,s).update(t,i)}updateSharedOptions(t,e,i){t&&!Ds(e)&&this._resolveAnimations(void 0,e).update(t,i)}_setStyle(t,e,i,s){t.active=s;const n=this.getStyle(e,s);this._resolveAnimations(e,i,s).update(t,{options:!s&&this.getSharedOptions(n)||n})}removeHoverStyle(t,e,i){this._setStyle(t,i,"active",!1)}setHoverStyle(t,e,i){this._setStyle(t,i,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,i=this._cachedMeta.data;for(const[t,e,i]of this._syncList)this[t](e,i);this._syncList=[];const s=i.length,n=e.length,o=Math.min(n,s);o&&this.parse(0,o),n>s?this._insertElements(s,n-s,t):n<s&&this._removeElements(n,s-n)}_insertElements(t,e,i=!0){const s=this._cachedMeta,n=s.data,o=t+e;let a;const r=t=>{for(t.length+=e,a=t.length-1;a>=o;a--)t[a]=t[a-e]};for(r(n),a=t;a<o;++a)n[a]=new this.dataElementType;this._parsing&&r(s._parsed),this.parse(t,e),i&&this.updateElements(n,t,e,"reset")}updateElements(t,e,i,s){}_removeElements(t,e){const i=this._cachedMeta;if(this._parsing){const s=i._parsed.splice(t,e);i._stacked&&Ps(i,s)}i.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,i,s]=t;this[e](i,s)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const i=arguments.length-2;i&&this._sync(["_insertElements",t,i])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}Os.defaults={},Os.prototype.datasetElementType=null,Os.prototype.dataElementType=null;class As{constructor(){this.x=void 0,this.y=void 0,this.active=!1,this.options=void 0,this.$animations=void 0}tooltipPosition(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}hasValue(){return Nt(this.x)&&Nt(this.y)}getProps(t,e){const i=this.$animations;if(!e||!i)return this;const s={};return t.forEach((t=>{s[t]=i[t]&&i[t].active()?i[t]._to:this[t]})),s}}As.defaults={},As.defaultRoutes=void 0;const Ts={values:t=>X(t)?t:""+t,numeric(t,e,i){if(0===t)return"0";const s=this.chart.options.locale;let n,o=t;if(i.length>1){const e=Math.max(Math.abs(i[0].value),Math.abs(i[i.length-1].value));(e<1e-4||e>1e15)&&(n="scientific"),o=function(t,e){let i=e.length>3?e[2].value-e[1].value:e[1].value-e[0].value;Math.abs(i)>=1&&t!==Math.floor(t)&&(i=t-Math.floor(t));return i}(t,i)}const a=Ft(Math.abs(o)),r=Math.max(Math.min(-1*Math.floor(a),20),0),l={notation:n,minimumFractionDigits:r,maximumFractionDigits:r};return Object.assign(l,this.options.ticks.format),oi(t,s,l)},logarithmic(t,e,i){if(0===t)return"0";const s=t/Math.pow(10,Math.floor(Ft(t)));return 1===s||2===s||5===s?Ts.numeric.call(this,t,e,i):""}};var Ls={formatters:Ts};function Rs(t,e){const i=t.options.ticks,s=i.maxTicksLimit||function(t){const e=t.options.offset,i=t._tickSize(),s=t._length/i+(e?0:1),n=t._maxLength/i;return Math.floor(Math.min(s,n))}(t),n=i.major.enabled?function(t){const e=[];let i,s;for(i=0,s=t.length;i<s;i++)t[i].major&&e.push(i);return e}(e):[],o=n.length,a=n[0],r=n[o-1],l=[];if(o>s)return function(t,e,i,s){let n,o=0,a=i[0];for(s=Math.ceil(s),n=0;n<t.length;n++)n===a&&(e.push(t[n]),o++,a=i[o*s])}(e,l,n,o/s),l;const h=function(t,e,i){const s=function(t){const e=t.length;let i,s;if(e<2)return!1;for(s=t[0],i=1;i<e;++i)if(t[i]-t[i-1]!==s)return!1;return s}(t),n=e.length/i;if(!s)return Math.max(n,1);const o=Wt(s);for(let t=0,e=o.length-1;t<e;t++){const e=o[t];if(e>n)return e}return Math.max(n,1)}(n,e,s);if(o>0){let t,i;const s=o>1?Math.round((r-a)/(o-1)):null;for(Es(e,l,h,U(s)?0:a-s,a),t=0,i=o-1;t<i;t++)Es(e,l,h,n[t],n[t+1]);return Es(e,l,h,r,U(s)?e.length:r+s),l}return Es(e,l,h),l}function Es(t,e,i,s,n){const o=Z(s,0),a=Math.min(Z(n,t.length),t.length);let r,l,h,c=0;for(i=Math.ceil(i),n&&(r=n-s,i=r/Math.floor(r/i)),h=o;h<0;)c++,h=Math.round(o+c*i);for(l=Math.max(o,0);l<a;l++)l===h&&(e.push(t[l]),c++,h=Math.round(o+c*i))}yt.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",grace:0,grid:{display:!0,lineWidth:1,drawBorder:!0,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1,borderDash:[],borderDashOffset:0,borderWidth:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:Ls.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),yt.route("scale.ticks","color","","color"),yt.route("scale.grid","color","","borderColor"),yt.route("scale.grid","borderColor","","borderColor"),yt.route("scale.title","color","","color"),yt.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&"callback"!==t&&"parser"!==t,_indexable:t=>"borderDash"!==t&&"tickBorderDash"!==t}),yt.describe("scales",{_fallback:"scale"}),yt.describe("scale.ticks",{_scriptable:t=>"backdropPadding"!==t&&"callback"!==t,_indexable:t=>"backdropPadding"!==t});const Is=(t,e,i)=>"top"===e||"left"===e?t[e]+i:t[e]-i;function zs(t,e){const i=[],s=t.length/e,n=t.length;let o=0;for(;o<n;o+=s)i.push(t[Math.floor(o)]);return i}function Fs(t,e,i){const s=t.ticks.length,n=Math.min(e,s-1),o=t._startPixel,a=t._endPixel,r=1e-6;let l,h=t.getPixelForTick(n);if(!(i&&(l=1===s?Math.max(h-o,a-h):0===e?(t.getPixelForTick(1)-h)/2:(h-t.getPixelForTick(n-1))/2,h+=n<e?l:-l,h<o-r||h>a+r)))return h}function Bs(t){return t.drawTicks?t.tickLength:0}function Vs(t,e){if(!t.display)return 0;const i=fi(t.font,e),s=ui(t.padding);return(X(t.text)?t.text.length:1)*i.lineHeight+s.height}function Ws(t,e,i){let n=s(t);return(i&&"right"!==e||!i&&"right"===e)&&(n=(t=>"left"===t?"right":"right"===t?"left":t)(n)),n}class Ns extends As{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:i,_suggestedMax:s}=this;return t=G(t,Number.POSITIVE_INFINITY),e=G(e,Number.NEGATIVE_INFINITY),i=G(i,Number.POSITIVE_INFINITY),s=G(s,Number.NEGATIVE_INFINITY),{min:G(t,i),max:G(e,s),minDefined:K(t),maxDefined:K(e)}}getMinMax(t){let e,{min:i,max:s,minDefined:n,maxDefined:o}=this.getUserBounds();if(n&&o)return{min:i,max:s};const a=this.getMatchingVisibleMetas();for(let r=0,l=a.length;r<l;++r)e=a[r].controller.getMinMax(this,t),n||(i=Math.min(i,e.min)),o||(s=Math.max(s,e.max));return i=o&&i>s?s:i,s=n&&i>s?i:s,{min:G(i,G(s,i)),max:G(s,G(i,s))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){tt(this.options.beforeUpdate,[this])}update(t,e,i){const{beginAtZero:s,grace:n,ticks:o}=this.options,a=o.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=i=Object.assign({left:0,right:0,top:0,bottom:0},i),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+i.left+i.right:this.height+i.top+i.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=pi(this,n,s),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const r=a<this.ticks.length;this._convertTicksToLabels(r?zs(this.ticks,a):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),o.display&&(o.autoSkip||"auto"===o.source)&&(this.ticks=Rs(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),r&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t,e,i=this.options.reverse;this.isHorizontal()?(t=this.left,e=this.right):(t=this.top,e=this.bottom,i=!i),this._startPixel=t,this._endPixel=e,this._reversePixels=i,this._length=e-t,this._alignToPixels=this.options.alignToPixels}afterUpdate(){tt(this.options.afterUpdate,[this])}beforeSetDimensions(){tt(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){tt(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),tt(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){tt(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let i,s,n;for(i=0,s=t.length;i<s;i++)n=t[i],n.label=tt(e.callback,[n.value,i,t],this)}afterTickToLabelConversion(){tt(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){tt(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,i=this.ticks.length,s=e.minRotation||0,n=e.maxRotation;let o,a,r,l=s;if(!this._isVisible()||!e.display||s>=n||i<=1||!this.isHorizontal())return void(this.labelRotation=s);const h=this._getLabelSizes(),c=h.widest.width,d=h.highest.height,u=Qt(this.chart.width-c,0,this.maxWidth);o=t.offset?this.maxWidth/i:u/(i-1),c+6>o&&(o=u/(i-(t.offset?.5:1)),a=this.maxHeight-Bs(t.grid)-e.padding-Vs(t.title,this.chart.options.font),r=Math.sqrt(c*c+d*d),l=Ut(Math.min(Math.asin(Qt((h.highest.height+6)/o,-1,1)),Math.asin(Qt(a/r,-1,1))-Math.asin(Qt(d/r,-1,1)))),l=Math.max(s,Math.min(n,l))),this.labelRotation=l}afterCalculateLabelRotation(){tt(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){tt(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:i,title:s,grid:n}}=this,o=this._isVisible(),a=this.isHorizontal();if(o){const o=Vs(s,e.options.font);if(a?(t.width=this.maxWidth,t.height=Bs(n)+o):(t.height=this.maxHeight,t.width=Bs(n)+o),i.display&&this.ticks.length){const{first:e,last:s,widest:n,highest:o}=this._getLabelSizes(),r=2*i.padding,l=Yt(this.labelRotation),h=Math.cos(l),c=Math.sin(l);if(a){const e=i.mirror?0:c*n.width+h*o.height;t.height=Math.min(this.maxHeight,t.height+e+r)}else{const e=i.mirror?0:h*n.width+c*o.height;t.width=Math.min(this.maxWidth,t.width+e+r)}this._calculatePadding(e,s,c,h)}}this._handleMargins(),a?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,i,s){const{ticks:{align:n,padding:o},position:a}=this.options,r=0!==this.labelRotation,l="top"!==a&&"x"===this.axis;if(this.isHorizontal()){const a=this.getPixelForTick(0)-this.left,h=this.right-this.getPixelForTick(this.ticks.length-1);let c=0,d=0;r?l?(c=s*t.width,d=i*e.height):(c=i*t.height,d=s*e.width):"start"===n?d=e.width:"end"===n?c=t.width:"inner"!==n&&(c=t.width/2,d=e.width/2),this.paddingLeft=Math.max((c-a+o)*this.width/(this.width-a),0),this.paddingRight=Math.max((d-h+o)*this.width/(this.width-h),0)}else{let i=e.height/2,s=t.height/2;"start"===n?(i=0,s=t.height):"end"===n&&(i=e.height,s=0),this.paddingTop=i+o,this.paddingBottom=s+o}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){tt(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return"top"===e||"bottom"===e||"x"===t}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){let e,i;for(this.beforeTickToLabelConversion(),this.generateTickLabels(t),e=0,i=t.length;e<i;e++)U(t[e].label)&&(t.splice(e,1),i--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let i=this.ticks;e<i.length&&(i=zs(i,e)),this._labelSizes=t=this._computeLabelSizes(i,i.length)}return t}_computeLabelSizes(t,e){const{ctx:i,_longestTextCache:s}=this,n=[],o=[];let a,r,l,h,c,d,u,f,g,p,m,b=0,x=0;for(a=0;a<e;++a){if(h=t[a].label,c=this._resolveTickFontOptions(a),i.font=d=c.string,u=s[d]=s[d]||{data:{},gc:[]},f=c.lineHeight,g=p=0,U(h)||X(h)){if(X(h))for(r=0,l=h.length;r<l;++r)m=h[r],U(m)||X(m)||(g=me(i,u.data,u.gc,g,m),p+=f)}else g=me(i,u.data,u.gc,g,h),p=f;n.push(g),o.push(p),b=Math.max(g,b),x=Math.max(p,x)}!function(t,e){et(t,(t=>{const i=t.gc,s=i.length/2;let n;if(s>e){for(n=0;n<s;++n)delete t.data[i[n]];i.splice(0,s)}}))}(s,e);const _=n.indexOf(b),y=o.indexOf(x),v=t=>({width:n[t]||0,height:o[t]||0});return{first:v(0),last:v(e-1),widest:v(_),highest:v(y),widths:n,heights:o}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return te(this._alignToPixels?xe(this.chart,e,0):e)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const i=e[t];return i.$context||(i.$context=function(t,e,i){return mi(t,{tick:i,index:e,type:"tick"})}(this.getContext(),t,i))}return this.$context||(this.$context=mi(this.chart.getContext(),{scale:this,type:"scale"}))}_tickSize(){const t=this.options.ticks,e=Yt(this.labelRotation),i=Math.abs(Math.cos(e)),s=Math.abs(Math.sin(e)),n=this._getLabelSizes(),o=t.autoSkipPadding||0,a=n?n.widest.width+o:0,r=n?n.highest.height+o:0;return this.isHorizontal()?r*i>a*s?a/i:r/s:r*s<a*i?r/i:a/s}_isVisible(){const t=this.options.display;return"auto"!==t?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,i=this.chart,s=this.options,{grid:n,position:o}=s,a=n.offset,r=this.isHorizontal(),l=this.ticks.length+(a?1:0),h=Bs(n),c=[],d=n.setContext(this.getContext()),u=d.drawBorder?d.borderWidth:0,f=u/2,g=function(t){return xe(i,t,u)};let p,m,b,x,_,y,v,w,M,k,S,P;if("top"===o)p=g(this.bottom),y=this.bottom-h,w=p-f,k=g(t.top)+f,P=t.bottom;else if("bottom"===o)p=g(this.top),k=t.top,P=g(t.bottom)-f,y=p+f,w=this.top+h;else if("left"===o)p=g(this.right),_=this.right-h,v=p-f,M=g(t.left)+f,S=t.right;else if("right"===o)p=g(this.left),M=t.left,S=g(t.right)-f,_=p+f,v=this.left+h;else if("x"===e){if("center"===o)p=g((t.top+t.bottom)/2+.5);else if(q(o)){const t=Object.keys(o)[0],e=o[t];p=g(this.chart.scales[t].getPixelForValue(e))}k=t.top,P=t.bottom,y=p+f,w=y+h}else if("y"===e){if("center"===o)p=g((t.left+t.right)/2);else if(q(o)){const t=Object.keys(o)[0],e=o[t];p=g(this.chart.scales[t].getPixelForValue(e))}_=p-f,v=_-h,M=t.left,S=t.right}const D=Z(s.ticks.maxTicksLimit,l),C=Math.max(1,Math.ceil(l/D));for(m=0;m<l;m+=C){const t=n.setContext(this.getContext(m)),e=t.lineWidth,s=t.color,o=n.borderDash||[],l=t.borderDashOffset,h=t.tickWidth,d=t.tickColor,u=t.tickBorderDash||[],f=t.tickBorderDashOffset;b=Fs(this,m,a),void 0!==b&&(x=xe(i,b,e),r?_=v=M=S=x:y=w=k=P=x,c.push({tx1:_,ty1:y,tx2:v,ty2:w,x1:M,y1:k,x2:S,y2:P,width:e,color:s,borderDash:o,borderDashOffset:l,tickWidth:h,tickColor:d,tickBorderDash:u,tickBorderDashOffset:f}))}return this._ticksLength=l,this._borderValue=p,c}_computeLabelItems(t){const e=this.axis,i=this.options,{position:s,ticks:n}=i,o=this.isHorizontal(),a=this.ticks,{align:r,crossAlign:l,padding:h,mirror:c}=n,d=Bs(i.grid),u=d+h,f=c?-h:u,g=-Yt(this.labelRotation),p=[];let m,b,x,_,y,v,w,M,k,S,P,D,C="middle";if("top"===s)v=this.bottom-f,w=this._getXAxisLabelAlignment();else if("bottom"===s)v=this.top+f,w=this._getXAxisLabelAlignment();else if("left"===s){const t=this._getYAxisLabelAlignment(d);w=t.textAlign,y=t.x}else if("right"===s){const t=this._getYAxisLabelAlignment(d);w=t.textAlign,y=t.x}else if("x"===e){if("center"===s)v=(t.top+t.bottom)/2+u;else if(q(s)){const t=Object.keys(s)[0],e=s[t];v=this.chart.scales[t].getPixelForValue(e)+u}w=this._getXAxisLabelAlignment()}else if("y"===e){if("center"===s)y=(t.left+t.right)/2-u;else if(q(s)){const t=Object.keys(s)[0],e=s[t];y=this.chart.scales[t].getPixelForValue(e)}w=this._getYAxisLabelAlignment(d).textAlign}"y"===e&&("start"===r?C="top":"end"===r&&(C="bottom"));const O=this._getLabelSizes();for(m=0,b=a.length;m<b;++m){x=a[m],_=x.label;const t=n.setContext(this.getContext(m));M=this.getPixelForTick(m)+n.labelOffset,k=this._resolveTickFontOptions(m),S=k.lineHeight,P=X(_)?_.length:1;const e=P/2,i=t.color,r=t.textStrokeColor,h=t.textStrokeWidth;let d,u=w;if(o?(y=M,"inner"===w&&(u=m===b-1?this.options.reverse?"left":"right":0===m?this.options.reverse?"right":"left":"center"),D="top"===s?"near"===l||0!==g?-P*S+S/2:"center"===l?-O.highest.height/2-e*S+S:-O.highest.height+S/2:"near"===l||0!==g?S/2:"center"===l?O.highest.height/2-e*S:O.highest.height-P*S,c&&(D*=-1)):(v=M,D=(1-P)*S/2),t.showLabelBackdrop){const e=ui(t.backdropPadding),i=O.heights[m],s=O.widths[m];let n=v+D-e.top,o=y-e.left;switch(C){case"middle":n-=i/2;break;case"bottom":n-=i}switch(w){case"center":o-=s/2;break;case"right":o-=s}d={left:o,top:n,width:s+e.width,height:i+e.height,color:t.backdropColor}}p.push({rotation:g,label:_,font:k,color:i,strokeColor:r,strokeWidth:h,textOffset:D,textAlign:u,textBaseline:C,translation:[y,v],backdrop:d})}return p}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-Yt(this.labelRotation))return"top"===t?"left":"right";let i="center";return"start"===e.align?i="left":"end"===e.align?i="right":"inner"===e.align&&(i="inner"),i}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:i,mirror:s,padding:n}}=this.options,o=t+n,a=this._getLabelSizes().widest.width;let r,l;return"left"===e?s?(l=this.right+n,"near"===i?r="left":"center"===i?(r="center",l+=a/2):(r="right",l+=a)):(l=this.right-o,"near"===i?r="right":"center"===i?(r="center",l-=a/2):(r="left",l=this.left)):"right"===e?s?(l=this.left+n,"near"===i?r="right":"center"===i?(r="center",l-=a/2):(r="left",l-=a)):(l=this.left+o,"near"===i?r="left":"center"===i?(r="center",l+=a/2):(r="right",l=this.right)):r="right",{textAlign:r,x:l}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;return"left"===e||"right"===e?{top:0,left:this.left,bottom:t.height,right:this.right}:"top"===e||"bottom"===e?{top:this.top,left:0,bottom:this.bottom,right:t.width}:void 0}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:i,top:s,width:n,height:o}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(i,s,n,o),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const i=this.ticks.findIndex((e=>e.value===t));if(i>=0){return e.setContext(this.getContext(i)).lineWidth}return 0}drawGrid(t){const e=this.options.grid,i=this.ctx,s=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let n,o;const a=(t,e,s)=>{s.width&&s.color&&(i.save(),i.lineWidth=s.width,i.strokeStyle=s.color,i.setLineDash(s.borderDash||[]),i.lineDashOffset=s.borderDashOffset,i.beginPath(),i.moveTo(t.x,t.y),i.lineTo(e.x,e.y),i.stroke(),i.restore())};if(e.display)for(n=0,o=s.length;n<o;++n){const t=s[n];e.drawOnChartArea&&a({x:t.x1,y:t.y1},{x:t.x2,y:t.y2},t),e.drawTicks&&a({x:t.tx1,y:t.ty1},{x:t.tx2,y:t.ty2},{color:t.tickColor,width:t.tickWidth,borderDash:t.tickBorderDash,borderDashOffset:t.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{grid:i}}=this,s=i.setContext(this.getContext()),n=i.drawBorder?s.borderWidth:0;if(!n)return;const o=i.setContext(this.getContext(0)).lineWidth,a=this._borderValue;let r,l,h,c;this.isHorizontal()?(r=xe(t,this.left,n)-n/2,l=xe(t,this.right,o)+o/2,h=c=a):(h=xe(t,this.top,n)-n/2,c=xe(t,this.bottom,o)+o/2,r=l=a),e.save(),e.lineWidth=s.borderWidth,e.strokeStyle=s.borderColor,e.beginPath(),e.moveTo(r,h),e.lineTo(l,c),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const e=this.ctx,i=this._computeLabelArea();i&&Me(e,i);const s=this._labelItems||(this._labelItems=this._computeLabelItems(t));let n,o;for(n=0,o=s.length;n<o;++n){const t=s[n],i=t.font,o=t.label;t.backdrop&&(e.fillStyle=t.backdrop.color,e.fillRect(t.backdrop.left,t.backdrop.top,t.backdrop.width,t.backdrop.height)),De(e,o,0,t.textOffset,i,t)}i&&ke(e)}drawTitle(){const{ctx:t,options:{position:e,title:i,reverse:s}}=this;if(!i.display)return;const o=fi(i.font),a=ui(i.padding),r=i.align;let l=o.lineHeight/2;"bottom"===e||"center"===e||q(e)?(l+=a.bottom,X(i.text)&&(l+=o.lineHeight*(i.text.length-1))):l+=a.top;const{titleX:h,titleY:c,maxWidth:d,rotation:u}=function(t,e,i,s){const{top:o,left:a,bottom:r,right:l,chart:h}=t,{chartArea:c,scales:d}=h;let u,f,g,p=0;const m=r-o,b=l-a;if(t.isHorizontal()){if(f=n(s,a,l),q(i)){const t=Object.keys(i)[0],s=i[t];g=d[t].getPixelForValue(s)+m-e}else g="center"===i?(c.bottom+c.top)/2+m-e:Is(t,i,e);u=l-a}else{if(q(i)){const t=Object.keys(i)[0],s=i[t];f=d[t].getPixelForValue(s)-b+e}else f="center"===i?(c.left+c.right)/2-b+e:Is(t,i,e);g=n(s,r,o),p="left"===i?-Et:Et}return{titleX:f,titleY:g,maxWidth:u,rotation:p}}(this,l,e,r);De(t,i.text,0,0,o,{color:i.color,maxWidth:d,rotation:u,textAlign:Ws(r,e,s),textBaseline:"middle",translation:[h,c]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,i=Z(t.grid&&t.grid.z,-1);return this._isVisible()&&this.draw===Ns.prototype.draw?[{z:i,draw:t=>{this.drawBackground(),this.drawGrid(t),this.drawTitle()}},{z:i+1,draw:()=>{this.drawBorder()}},{z:e,draw:t=>{this.drawLabels(t)}}]:[{z:e,draw:t=>{this.draw(t)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),i=this.axis+"AxisID",s=[];let n,o;for(n=0,o=e.length;n<o;++n){const o=e[n];o[i]!==this.id||t&&o.type!==t||s.push(o)}return s}_resolveTickFontOptions(t){return fi(this.options.ticks.setContext(this.getContext(t)).font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class js{constructor(t,e,i){this.type=t,this.scope=e,this.override=i,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let i;(function(t){return"id"in t&&"defaults"in t})(e)&&(i=this.register(e));const s=this.items,n=t.id,o=this.scope+"."+n;if(!n)throw new Error("class does not have id: "+t);return n in s||(s[n]=t,function(t,e,i){const s=at(Object.create(null),[i?yt.get(i):{},yt.get(e),t.defaults]);yt.set(e,s),t.defaultRoutes&&function(t,e){Object.keys(e).forEach((i=>{const s=i.split("."),n=s.pop(),o=[t].concat(s).join("."),a=e[i].split("."),r=a.pop(),l=a.join(".");yt.route(o,n,l,r)}))}(e,t.defaultRoutes);t.descriptors&&yt.describe(e,t.descriptors)}(t,o,i),this.override&&yt.override(t.id,t.overrides)),o}get(t){return this.items[t]}unregister(t){const e=this.items,i=t.id,s=this.scope;i in e&&delete e[i],s&&i in yt[s]&&(delete yt[s][i],this.override&&delete mt[i])}}var Hs=new class{constructor(){this.controllers=new js(Os,"datasets",!0),this.elements=new js(As,"elements"),this.plugins=new js(Object,"plugins"),this.scales=new js(Ns,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,i){[...e].forEach((e=>{const s=i||this._getRegistryForType(e);i||s.isForType(e)||s===this.plugins&&e.id?this._exec(t,s,e):et(e,(e=>{const s=i||this._getRegistryForType(e);this._exec(t,s,e)}))}))}_exec(t,e,i){const s=dt(t);tt(i["before"+s],[],i),e[t](i),tt(i["after"+s],[],i)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const i=this._typedRegistries[e];if(i.isForType(t))return i}return this.plugins}_get(t,e,i){const s=e.get(t);if(void 0===s)throw new Error('"'+t+'" is not a registered '+i+".");return s}};class $s{constructor(){this._init=[]}notify(t,e,i,s){"beforeInit"===e&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install"));const n=s?this._descriptors(t).filter(s):this._descriptors(t),o=this._notify(n,t,e,i);return"afterDestroy"===e&&(this._notify(n,t,"stop"),this._notify(this._init,t,"uninstall")),o}_notify(t,e,i,s){s=s||{};for(const n of t){const t=n.plugin;if(!1===tt(t[i],[e,s,n.options],t)&&s.cancelable)return!1}return!0}invalidate(){U(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const i=t&&t.config,s=Z(i.options&&i.options.plugins,{}),n=function(t){const e={},i=[],s=Object.keys(Hs.plugins.items);for(let t=0;t<s.length;t++)i.push(Hs.getPlugin(s[t]));const n=t.plugins||[];for(let t=0;t<n.length;t++){const s=n[t];-1===i.indexOf(s)&&(i.push(s),e[s.id]=!0)}return{plugins:i,localIds:e}}(i);return!1!==s||e?function(t,{plugins:e,localIds:i},s,n){const o=[],a=t.getContext();for(const r of e){const e=r.id,l=Ys(s[e],n);null!==l&&o.push({plugin:r,options:Us(t.config,{plugin:r,local:i[e]},l,a)})}return o}(t,n,s,e):[]}_notifyStateChanges(t){const e=this._oldCache||[],i=this._cache,s=(t,e)=>t.filter((t=>!e.some((e=>t.plugin.id===e.plugin.id))));this._notify(s(e,i),t,"stop"),this._notify(s(i,e),t,"start")}}function Ys(t,e){return e||!1!==t?!0===t?{}:t:null}function Us(t,{plugin:e,local:i},s,n){const o=t.pluginScopeKeys(e),a=t.getOptionScopes(s,o);return i&&e.defaults&&a.push(e.defaults),t.createResolver(a,n,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function Xs(t,e){const i=yt.datasets[t]||{};return((e.datasets||{})[t]||{}).indexAxis||e.indexAxis||i.indexAxis||"x"}function qs(t,e){return"x"===t||"y"===t?t:e.axis||("top"===(i=e.position)||"bottom"===i?"x":"left"===i||"right"===i?"y":void 0)||t.charAt(0).toLowerCase();var i}function Ks(t){const e=t.options||(t.options={});e.plugins=Z(e.plugins,{}),e.scales=function(t,e){const i=mt[t.type]||{scales:{}},s=e.scales||{},n=Xs(t.type,e),o=Object.create(null),a=Object.create(null);return Object.keys(s).forEach((t=>{const e=s[t];if(!q(e))return console.error(`Invalid scale configuration for scale: ${t}`);if(e._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${t}`);const r=qs(t,e),l=function(t,e){return t===e?"_index_":"_value_"}(r,n),h=i.scales||{};o[r]=o[r]||t,a[t]=rt(Object.create(null),[{axis:r},e,h[r],h[l]])})),t.data.datasets.forEach((i=>{const n=i.type||t.type,r=i.indexAxis||Xs(n,e),l=(mt[n]||{}).scales||{};Object.keys(l).forEach((t=>{const e=function(t,e){let i=t;return"_index_"===t?i=e:"_value_"===t&&(i="x"===e?"y":"x"),i}(t,r),n=i[e+"AxisID"]||o[e]||e;a[n]=a[n]||Object.create(null),rt(a[n],[{axis:e},s[n],l[t]])}))})),Object.keys(a).forEach((t=>{const e=a[t];rt(e,[yt.scales[e.type],yt.scale])})),a}(t,e)}function Gs(t){return(t=t||{}).datasets=t.datasets||[],t.labels=t.labels||[],t}const Zs=new Map,Js=new Set;function Qs(t,e){let i=Zs.get(t);return i||(i=e(),Zs.set(t,i),Js.add(i)),i}const tn=(t,e,i)=>{const s=ct(e,i);void 0!==s&&t.add(s)};class en{constructor(t){this._config=function(t){return(t=t||{}).data=Gs(t.data),Ks(t),t}(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=Gs(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),Ks(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return Qs(t,(()=>[[`datasets.${t}`,""]]))}datasetAnimationScopeKeys(t,e){return Qs(`${t}.transition.${e}`,(()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]]))}datasetElementScopeKeys(t,e){return Qs(`${t}-${e}`,(()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]]))}pluginScopeKeys(t){const e=t.id;return Qs(`${this.type}-plugin-${e}`,(()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]]))}_cachedScopes(t,e){const i=this._scopeCache;let s=i.get(t);return s&&!e||(s=new Map,i.set(t,s)),s}getOptionScopes(t,e,i){const{options:s,type:n}=this,o=this._cachedScopes(t,i),a=o.get(e);if(a)return a;const r=new Set;e.forEach((e=>{t&&(r.add(t),e.forEach((e=>tn(r,t,e)))),e.forEach((t=>tn(r,s,t))),e.forEach((t=>tn(r,mt[n]||{},t))),e.forEach((t=>tn(r,yt,t))),e.forEach((t=>tn(r,bt,t)))}));const l=Array.from(r);return 0===l.length&&l.push(Object.create(null)),Js.has(e)&&o.set(e,l),l}chartOptionScopes(){const{options:t,type:e}=this;return[t,mt[e]||{},yt.datasets[e]||{},{type:e},yt,bt]}resolveNamedOptions(t,e,i,s=[""]){const n={$shared:!0},{resolver:o,subPrefixes:a}=sn(this._resolverCache,t,s);let r=o;if(function(t,e){const{isScriptable:i,isIndexable:s}=Le(t);for(const n of e){const e=i(n),o=s(n),a=(o||e)&&t[n];if(e&&(ft(a)||nn(a))||o&&X(a))return!0}return!1}(o,e)){n.$shared=!1;r=Te(o,i=ft(i)?i():i,this.createResolver(t,i,a))}for(const t of e)n[t]=r[t];return n}createResolver(t,e,i=[""],s){const{resolver:n}=sn(this._resolverCache,t,i);return q(e)?Te(n,e,void 0,s):n}}function sn(t,e,i){let s=t.get(e);s||(s=new Map,t.set(e,s));const n=i.join();let o=s.get(n);if(!o){o={resolver:Ae(e,i),subPrefixes:i.filter((t=>!t.toLowerCase().includes("hover")))},s.set(n,o)}return o}const nn=t=>q(t)&&Object.getOwnPropertyNames(t).reduce(((e,i)=>e||ft(t[i])),!1);const on=["top","bottom","left","right","chartArea"];function an(t,e){return"top"===t||"bottom"===t||-1===on.indexOf(t)&&"x"===e}function rn(t,e){return function(i,s){return i[t]===s[t]?i[e]-s[e]:i[t]-s[t]}}function ln(t){const e=t.chart,i=e.options.animation;e.notifyPlugins("afterRender"),tt(i&&i.onComplete,[t],e)}function hn(t){const e=t.chart,i=e.options.animation;tt(i&&i.onProgress,[t],e)}function cn(t){return ie()&&"string"==typeof t?t=document.getElementById(t):t&&t.length&&(t=t[0]),t&&t.canvas&&(t=t.canvas),t}const dn={},un=t=>{const e=cn(t);return Object.values(dn).filter((t=>t.canvas===e)).pop()};function fn(t,e,i){const s=Object.keys(t);for(const n of s){const s=+n;if(s>=e){const o=t[n];delete t[n],(i>0||s>e)&&(t[s+i]=o)}}}class gn{constructor(t,e){const s=this.config=new en(e),n=cn(t),o=un(n);if(o)throw new Error("Canvas is already in use. Chart with ID '"+o.id+"' must be destroyed before the canvas with ID '"+o.canvas.id+"' can be reused.");const r=s.createResolver(s.chartOptionScopes(),this.getContext());this.platform=new(s.platform||ds(n)),this.platform.updateConfig(s);const l=this.platform.acquireContext(n,r.aspectRatio),h=l&&l.canvas,c=h&&h.height,d=h&&h.width;this.id=Y(),this.ctx=l,this.canvas=h,this.width=d,this.height=c,this._options=r,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new $s,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=i((t=>this.update(t)),r.resizeDelay||0),this._dataChanges=[],dn[this.id]=this,l&&h?(a.listen(this,"complete",ln),a.listen(this,"progress",hn),this._initialize(),this.attached&&this.update()):console.error("Failed to create chart: can't acquire context from the given item")}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:i,height:s,_aspectRatio:n}=this;return U(t)?e&&n?n:s?i/s:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():ue(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return _e(this.canvas,this.ctx),this}stop(){return a.stop(this),this}resize(t,e){a.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const i=this.options,s=this.canvas,n=i.maintainAspectRatio&&this.aspectRatio,o=this.platform.getMaximumSize(s,t,e,n),a=i.devicePixelRatio||this.platform.getDevicePixelRatio(),r=this.width?"resize":"attach";this.width=o.width,this.height=o.height,this._aspectRatio=this.aspectRatio,ue(this,a,!0)&&(this.notifyPlugins("resize",{size:o}),tt(i.onResize,[this,o],this),this.attached&&this._doResize(r)&&this.render())}ensureScalesHaveIDs(){et(this.options.scales||{},((t,e)=>{t.id=e}))}buildOrUpdateScales(){const t=this.options,e=t.scales,i=this.scales,s=Object.keys(i).reduce(((t,e)=>(t[e]=!1,t)),{});let n=[];e&&(n=n.concat(Object.keys(e).map((t=>{const i=e[t],s=qs(t,i),n="r"===s,o="x"===s;return{options:i,dposition:n?"chartArea":o?"bottom":"left",dtype:n?"radialLinear":o?"category":"linear"}})))),et(n,(e=>{const n=e.options,o=n.id,a=qs(o,n),r=Z(n.type,e.dtype);void 0!==n.position&&an(n.position,a)===an(e.dposition)||(n.position=e.dposition),s[o]=!0;let l=null;if(o in i&&i[o].type===r)l=i[o];else{l=new(Hs.getScale(r))({id:o,type:r,ctx:this.ctx,chart:this}),i[l.id]=l}l.init(n,t)})),et(s,((t,e)=>{t||delete i[e]})),et(i,(t=>{qi.configure(this,t,t.options),qi.addBox(this,t)}))}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,i=t.length;if(t.sort(((t,e)=>t.index-e.index)),i>e){for(let t=e;t<i;++t)this._destroyDatasetMeta(t);t.splice(e,i-e)}this._sortedMetasets=t.slice(0).sort(rn("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach(((t,i)=>{0===e.filter((e=>e===t._dataset)).length&&this._destroyDatasetMeta(i)}))}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let i,s;for(this._removeUnreferencedMetasets(),i=0,s=e.length;i<s;i++){const s=e[i];let n=this.getDatasetMeta(i);const o=s.type||this.config.type;if(n.type&&n.type!==o&&(this._destroyDatasetMeta(i),n=this.getDatasetMeta(i)),n.type=o,n.indexAxis=s.indexAxis||Xs(o,this.options),n.order=s.order||0,n.index=i,n.label=""+s.label,n.visible=this.isDatasetVisible(i),n.controller)n.controller.updateIndex(i),n.controller.linkScales();else{const e=Hs.getController(o),{datasetElementType:s,dataElementType:a}=yt.datasets[o];Object.assign(e.prototype,{dataElementType:Hs.getElement(a),datasetElementType:s&&Hs.getElement(s)}),n.controller=new e(this,i),t.push(n.controller)}}return this._updateMetasets(),t}_resetElements(){et(this.data.datasets,((t,e)=>{this.getDatasetMeta(e).controller.reset()}),this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const i=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),s=this._animationsDisabled=!i.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),!1===this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0}))return;const n=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let o=0;for(let t=0,e=this.data.datasets.length;t<e;t++){const{controller:e}=this.getDatasetMeta(t),i=!s&&-1===n.indexOf(e);e.buildOrUpdateElements(i),o=Math.max(+e.getMaxOverflow(),o)}o=this._minPadding=i.layout.autoPadding?o:0,this._updateLayout(o),s||et(n,(t=>{t.reset()})),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort(rn("z","_idx"));const{_active:a,_lastEvent:r}=this;r?this._eventHandler(r,!0):a.length&&this._updateHoverStyles(a,a,!0),this.render()}_updateScales(){et(this.scales,(t=>{qi.removeBox(this,t)})),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),i=new Set(t.events);gt(e,i)&&!!this._responsiveListeners===t.responsive||(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:i,start:s,count:n}of e){fn(t,s,"_removeElements"===i?-n:n)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,i=e=>new Set(t.filter((t=>t[0]===e)).map(((t,e)=>e+","+t.splice(1).join(",")))),s=i(0);for(let t=1;t<e;t++)if(!gt(s,i(t)))return;return Array.from(s).map((t=>t.split(","))).map((t=>({method:t[1],start:+t[2],count:+t[3]})))}_updateLayout(t){if(!1===this.notifyPlugins("beforeLayout",{cancelable:!0}))return;qi.update(this,this.width,this.height,t);const e=this.chartArea,i=e.width<=0||e.height<=0;this._layers=[],et(this.boxes,(t=>{i&&"chartArea"===t.position||(t.configure&&t.configure(),this._layers.push(...t._layers()))}),this),this._layers.forEach(((t,e)=>{t._idx=e})),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(!1!==this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})){for(let t=0,e=this.data.datasets.length;t<e;++t)this.getDatasetMeta(t).controller.configure();for(let e=0,i=this.data.datasets.length;e<i;++e)this._updateDataset(e,ft(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const i=this.getDatasetMeta(t),s={meta:i,index:t,mode:e,cancelable:!0};!1!==this.notifyPlugins("beforeDatasetUpdate",s)&&(i.controller._update(e),s.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",s))}render(){!1!==this.notifyPlugins("beforeRender",{cancelable:!0})&&(a.has(this)?this.attached&&!a.running(this)&&a.start(this):(this.draw(),ln({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:t,height:e}=this._resizeBeforeDraw;this._resize(t,e),this._resizeBeforeDraw=null}if(this.clear(),this.width<=0||this.height<=0)return;if(!1===this.notifyPlugins("beforeDraw",{cancelable:!0}))return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,i=[];let s,n;for(s=0,n=e.length;s<n;++s){const n=e[s];t&&!n.visible||i.push(n)}return i}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(!1===this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0}))return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,i=t._clip,s=!i.disabled,n=this.chartArea,o={meta:t,index:t.index,cancelable:!0};!1!==this.notifyPlugins("beforeDatasetDraw",o)&&(s&&Me(e,{left:!1===i.left?0:n.left-i.left,right:!1===i.right?this.width:n.right+i.right,top:!1===i.top?0:n.top-i.top,bottom:!1===i.bottom?this.height:n.bottom+i.bottom}),t.controller.draw(),s&&ke(e),o.cancelable=!1,this.notifyPlugins("afterDatasetDraw",o))}isPointInArea(t){return we(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,i,s){const n=Ii.modes[e];return"function"==typeof n?n(this,t,i,s):[]}getDatasetMeta(t){const e=this.data.datasets[t],i=this._metasets;let s=i.filter((t=>t&&t._dataset===e)).pop();return s||(s={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},i.push(s)),s}getContext(){return this.$context||(this.$context=mi(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const i=this.getDatasetMeta(t);return"boolean"==typeof i.hidden?!i.hidden:!e.hidden}setDatasetVisibility(t,e){this.getDatasetMeta(t).hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,i){const s=i?"show":"hide",n=this.getDatasetMeta(t),o=n.controller._resolveAnimations(void 0,s);ut(e)?(n.data[e].hidden=!i,this.update()):(this.setDatasetVisibility(t,i),o.update(n,{visible:i}),this.update((e=>e.datasetIndex===t?s:void 0)))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),a.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),_e(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),this.notifyPlugins("destroy"),delete dn[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,i=(i,s)=>{e.addEventListener(this,i,s),t[i]=s},s=(t,e,i)=>{t.offsetX=e,t.offsetY=i,this._eventHandler(t)};et(this.options.events,(t=>i(t,s)))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,i=(i,s)=>{e.addEventListener(this,i,s),t[i]=s},s=(i,s)=>{t[i]&&(e.removeEventListener(this,i,s),delete t[i])},n=(t,e)=>{this.canvas&&this.resize(t,e)};let o;const a=()=>{s("attach",a),this.attached=!0,this.resize(),i("resize",n),i("detach",o)};o=()=>{this.attached=!1,s("resize",n),this._stop(),this._resize(0,0),i("attach",a)},e.isAttached(this.canvas)?a():o()}unbindEvents(){et(this._listeners,((t,e)=>{this.platform.removeEventListener(this,e,t)})),this._listeners={},et(this._responsiveListeners,((t,e)=>{this.platform.removeEventListener(this,e,t)})),this._responsiveListeners=void 0}updateHoverStyle(t,e,i){const s=i?"set":"remove";let n,o,a,r;for("dataset"===e&&(n=this.getDatasetMeta(t[0].datasetIndex),n.controller["_"+s+"DatasetHoverStyle"]()),a=0,r=t.length;a<r;++a){o=t[a];const e=o&&this.getDatasetMeta(o.datasetIndex).controller;e&&e[s+"HoverStyle"](o.element,o.datasetIndex,o.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],i=t.map((({datasetIndex:t,index:e})=>{const i=this.getDatasetMeta(t);if(!i)throw new Error("No dataset found at index "+t);return{datasetIndex:t,element:i.data[e],index:e}}));!it(i,e)&&(this._active=i,this._lastEvent=null,this._updateHoverStyles(i,e))}notifyPlugins(t,e,i){return this._plugins.notify(this,t,e,i)}_updateHoverStyles(t,e,i){const s=this.options.hover,n=(t,e)=>t.filter((t=>!e.some((e=>t.datasetIndex===e.datasetIndex&&t.index===e.index)))),o=n(e,t),a=i?t:n(t,e);o.length&&this.updateHoverStyle(o,s.mode,!1),a.length&&s.mode&&this.updateHoverStyle(a,s.mode,!0)}_eventHandler(t,e){const i={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},s=e=>(e.options.events||this.options.events).includes(t.native.type);if(!1===this.notifyPlugins("beforeEvent",i,s))return;const n=this._handleEvent(t,e,i.inChartArea);return i.cancelable=!1,this.notifyPlugins("afterEvent",i,s),(n||i.changed)&&this.render(),this}_handleEvent(t,e,i){const{_active:s=[],options:n}=this,o=e,a=this._getActiveElements(t,s,i,o),r=pt(t),l=function(t,e,i,s){return i&&"mouseout"!==t.type?s?e:t:null}(t,this._lastEvent,i,r);i&&(this._lastEvent=null,tt(n.onHover,[t,a,this],this),r&&tt(n.onClick,[t,a,this],this));const h=!it(a,s);return(h||e)&&(this._active=a,this._updateHoverStyles(a,s,e)),this._lastEvent=l,h}_getActiveElements(t,e,i,s){if("mouseout"===t.type)return[];if(!i)return e;const n=this.options.hover;return this.getElementsAtEventForMode(t,n.mode,n,s)}}const pn=()=>et(gn.instances,(t=>t._plugins.invalidate())),mn=!0;function bn(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}Object.defineProperties(gn,{defaults:{enumerable:mn,value:yt},instances:{enumerable:mn,value:dn},overrides:{enumerable:mn,value:mt},registry:{enumerable:mn,value:Hs},version:{enumerable:mn,value:"3.8.2"},getChart:{enumerable:mn,value:un},register:{enumerable:mn,value:(...t)=>{Hs.add(...t),pn()}},unregister:{enumerable:mn,value:(...t)=>{Hs.remove(...t),pn()}}});class xn{constructor(t){this.options=t||{}}formats(){return bn()}parse(t,e){return bn()}format(t,e){return bn()}add(t,e,i){return bn()}diff(t,e,i){return bn()}startOf(t,e,i){return bn()}endOf(t,e){return bn()}}xn.override=function(t){Object.assign(xn.prototype,t)};var _n={_date:xn};function yn(t){const e=t.iScale,i=function(t,e){if(!t._cache.$bar){const i=t.getMatchingVisibleMetas(e);let s=[];for(let e=0,n=i.length;e<n;e++)s=s.concat(i[e].controller.getAllParsedValues(t));t._cache.$bar=Ct(s.sort(((t,e)=>t-e)))}return t._cache.$bar}(e,t.type);let s,n,o,a,r=e._length;const l=()=>{32767!==o&&-32768!==o&&(ut(a)&&(r=Math.min(r,Math.abs(o-a)||r)),a=o)};for(s=0,n=i.length;s<n;++s)o=e.getPixelForValue(i[s]),l();for(a=void 0,s=0,n=e.ticks.length;s<n;++s)o=e.getPixelForTick(s),l();return r}function vn(t,e,i,s){return X(t)?function(t,e,i,s){const n=i.parse(t[0],s),o=i.parse(t[1],s),a=Math.min(n,o),r=Math.max(n,o);let l=a,h=r;Math.abs(a)>Math.abs(r)&&(l=r,h=a),e[i.axis]=h,e._custom={barStart:l,barEnd:h,start:n,end:o,min:a,max:r}}(t,e,i,s):e[i.axis]=i.parse(t,s),e}function wn(t,e,i,s){const n=t.iScale,o=t.vScale,a=n.getLabels(),r=n===o,l=[];let h,c,d,u;for(h=i,c=i+s;h<c;++h)u=e[h],d={},d[n.axis]=r||n.parse(a[h],h),l.push(vn(u,d,o,h));return l}function Mn(t){return t&&void 0!==t.barStart&&void 0!==t.barEnd}function kn(t,e,i,s){let n=e.borderSkipped;const o={};if(!n)return void(t.borderSkipped=o);const{start:a,end:r,reverse:l,top:h,bottom:c}=function(t){let e,i,s,n,o;return t.horizontal?(e=t.base>t.x,i="left",s="right"):(e=t.base<t.y,i="bottom",s="top"),e?(n="end",o="start"):(n="start",o="end"),{start:i,end:s,reverse:e,top:n,bottom:o}}(t);"middle"===n&&i&&(t.enableBorderRadius=!0,(i._top||0)===s?n=h:(i._bottom||0)===s?n=c:(o[Sn(c,a,r,l)]=!0,n=h)),o[Sn(n,a,r,l)]=!0,t.borderSkipped=o}function Sn(t,e,i,s){var n,o,a;return s?(a=i,t=Pn(t=(n=t)===(o=e)?a:n===a?o:n,i,e)):t=Pn(t,e,i),t}function Pn(t,e,i){return"start"===t?e:"end"===t?i:t}function Dn(t,{inflateAmount:e},i){t.inflateAmount="auto"===e?1===i?.33:0:e}class Cn extends Os{parsePrimitiveData(t,e,i,s){return wn(t,e,i,s)}parseArrayData(t,e,i,s){return wn(t,e,i,s)}parseObjectData(t,e,i,s){const{iScale:n,vScale:o}=t,{xAxisKey:a="x",yAxisKey:r="y"}=this._parsing,l="x"===n.axis?a:r,h="x"===o.axis?a:r,c=[];let d,u,f,g;for(d=i,u=i+s;d<u;++d)g=e[d],f={},f[n.axis]=n.parse(ct(g,l),d),c.push(vn(ct(g,h),f,o,d));return c}updateRangeFromParsed(t,e,i,s){super.updateRangeFromParsed(t,e,i,s);const n=i._custom;n&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,n.min),t.max=Math.max(t.max,n.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:i,vScale:s}=e,n=this.getParsed(t),o=n._custom,a=Mn(o)?"["+o.start+", "+o.end+"]":""+s.getLabelForValue(n[s.axis]);return{label:""+i.getLabelForValue(n[i.axis]),value:a}}initialize(){this.enableOptionSharing=!0,super.initialize();this._cachedMeta.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,i,s){const n="reset"===s,{index:o,_cachedMeta:{vScale:a}}=this,r=a.getBasePixel(),l=a.isHorizontal(),h=this._getRuler(),{sharedOptions:c,includeOptions:d}=this._getSharedOptions(e,s);for(let u=e;u<e+i;u++){const e=this.getParsed(u),i=n||U(e[a.axis])?{base:r,head:r}:this._calculateBarValuePixels(u),f=this._calculateBarIndexPixels(u,h),g=(e._stacks||{})[a.axis],p={horizontal:l,base:i.base,enableBorderRadius:!g||Mn(e._custom)||o===g._top||o===g._bottom,x:l?i.head:f.center,y:l?f.center:i.head,height:l?f.size:Math.abs(i.size),width:l?Math.abs(i.size):f.size};d&&(p.options=c||this.resolveDataElementOptions(u,t[u].active?"active":s));const m=p.options||t[u].options;kn(p,m,g,o),Dn(p,m,h.ratio),this.updateElement(t[u],u,p,s)}}_getStacks(t,e){const{iScale:i}=this._cachedMeta,s=i.getMatchingVisibleMetas(this._type).filter((t=>t.controller.options.grouped)),n=i.options.stacked,o=[],a=t=>{const i=t.controller.getParsed(e),s=i&&i[t.vScale.axis];if(U(s)||isNaN(s))return!0};for(const i of s)if((void 0===e||!a(i))&&((!1===n||-1===o.indexOf(i.stack)||void 0===n&&void 0===i.stack)&&o.push(i.stack),i.index===t))break;return o.length||o.push(void 0),o}_getStackCount(t){return this._getStacks(void 0,t).length}_getStackIndex(t,e,i){const s=this._getStacks(t,i),n=void 0!==e?s.indexOf(e):-1;return-1===n?s.length-1:n}_getRuler(){const t=this.options,e=this._cachedMeta,i=e.iScale,s=[];let n,o;for(n=0,o=e.data.length;n<o;++n)s.push(i.getPixelForValue(this.getParsed(n)[i.axis],n));const a=t.barThickness;return{min:a||yn(e),pixels:s,start:i._startPixel,end:i._endPixel,stackCount:this._getStackCount(),scale:i,grouped:t.grouped,ratio:a?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:i},options:{base:s,minBarLength:n}}=this,o=s||0,a=this.getParsed(t),r=a._custom,l=Mn(r);let h,c,d=a[e.axis],u=0,f=i?this.applyStack(e,a,i):d;f!==d&&(u=f-d,f=d),l&&(d=r.barStart,f=r.barEnd-r.barStart,0!==d&&Bt(d)!==Bt(r.barEnd)&&(u=0),u+=d);const g=U(s)||l?u:s;let p=e.getPixelForValue(g);if(h=this.chart.getDataVisibility(t)?e.getPixelForValue(u+f):p,c=h-p,Math.abs(c)<n){c=function(t,e,i){return 0!==t?Bt(t):(e.isHorizontal()?1:-1)*(e.min>=i?1:-1)}(c,e,o)*n,d===o&&(p-=c/2);const t=e.getPixelForDecimal(0),i=e.getPixelForDecimal(1),s=Math.min(t,i),a=Math.max(t,i);p=Math.max(Math.min(p,a),s),h=p+c}if(p===e.getPixelForValue(o)){const t=Bt(c)*e.getLineWidthForValue(o)/2;p+=t,c-=t}return{size:c,base:p,head:h,center:h+c/2}}_calculateBarIndexPixels(t,e){const i=e.scale,s=this.options,n=s.skipNull,o=Z(s.maxBarThickness,1/0);let a,r;if(e.grouped){const i=n?this._getStackCount(t):e.stackCount,l="flex"===s.barThickness?function(t,e,i,s){const n=e.pixels,o=n[t];let a=t>0?n[t-1]:null,r=t<n.length-1?n[t+1]:null;const l=i.categoryPercentage;null===a&&(a=o-(null===r?e.end-e.start:r-o)),null===r&&(r=o+o-a);const h=o-(o-Math.min(a,r))/2*l;return{chunk:Math.abs(r-a)/2*l/s,ratio:i.barPercentage,start:h}}(t,e,s,i):function(t,e,i,s){const n=i.barThickness;let o,a;return U(n)?(o=e.min*i.categoryPercentage,a=i.barPercentage):(o=n*s,a=1),{chunk:o/s,ratio:a,start:e.pixels[t]-o/2}}(t,e,s,i),h=this._getStackIndex(this.index,this._cachedMeta.stack,n?t:void 0);a=l.start+l.chunk*h+l.chunk/2,r=Math.min(o,l.chunk*l.ratio)}else a=i.getPixelForValue(this.getParsed(t)[i.axis],t),r=Math.min(o,e.min*e.ratio);return{base:a-r/2,head:a+r/2,center:a,size:r}}draw(){const t=this._cachedMeta,e=t.vScale,i=t.data,s=i.length;let n=0;for(;n<s;++n)null!==this.getParsed(n)[e.axis]&&i[n].draw(this._ctx)}}Cn.id="bar",Cn.defaults={datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}},Cn.overrides={scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}};class On extends Os{initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,i,s){const n=super.parsePrimitiveData(t,e,i,s);for(let t=0;t<n.length;t++)n[t]._custom=this.resolveDataElementOptions(t+i).radius;return n}parseArrayData(t,e,i,s){const n=super.parseArrayData(t,e,i,s);for(let t=0;t<n.length;t++){const s=e[i+t];n[t]._custom=Z(s[2],this.resolveDataElementOptions(t+i).radius)}return n}parseObjectData(t,e,i,s){const n=super.parseObjectData(t,e,i,s);for(let t=0;t<n.length;t++){const s=e[i+t];n[t]._custom=Z(s&&s.r&&+s.r,this.resolveDataElementOptions(t+i).radius)}return n}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let i=t.length-1;i>=0;--i)e=Math.max(e,t[i].size(this.resolveDataElementOptions(i))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,{xScale:i,yScale:s}=e,n=this.getParsed(t),o=i.getLabelForValue(n.x),a=s.getLabelForValue(n.y),r=n._custom;return{label:e.label,value:"("+o+", "+a+(r?", "+r:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,i,s){const n="reset"===s,{iScale:o,vScale:a}=this._cachedMeta,{sharedOptions:r,includeOptions:l}=this._getSharedOptions(e,s),h=o.axis,c=a.axis;for(let d=e;d<e+i;d++){const e=t[d],i=!n&&this.getParsed(d),u={},f=u[h]=n?o.getPixelForDecimal(.5):o.getPixelForValue(i[h]),g=u[c]=n?a.getBasePixel():a.getPixelForValue(i[c]);u.skip=isNaN(f)||isNaN(g),l&&(u.options=r||this.resolveDataElementOptions(d,e.active?"active":s),n&&(u.options.radius=0)),this.updateElement(e,d,u,s)}}resolveDataElementOptions(t,e){const i=this.getParsed(t);let s=super.resolveDataElementOptions(t,e);s.$shared&&(s=Object.assign({},s,{$shared:!1}));const n=s.radius;return"active"!==e&&(s.radius=0),s.radius+=Z(i&&i._custom,n),s}}On.id="bubble",On.defaults={datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}},On.overrides={scales:{x:{type:"linear"},y:{type:"linear"}},plugins:{tooltip:{callbacks:{title:()=>""}}}};class An extends Os{constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const i=this.getDataset().data,s=this._cachedMeta;if(!1===this._parsing)s._parsed=i;else{let n,o,a=t=>+i[t];if(q(i[t])){const{key:t="value"}=this._parsing;a=e=>+ct(i[e],t)}for(n=t,o=t+e;n<o;++n)s._parsed[n]=a(n)}}_getRotation(){return Yt(this.options.rotation-90)}_getCircumference(){return Yt(this.options.circumference)}_getRotationExtents(){let t=At,e=-At;for(let i=0;i<this.chart.data.datasets.length;++i)if(this.chart.isDatasetVisible(i)){const s=this.chart.getDatasetMeta(i).controller,n=s._getRotation(),o=s._getCircumference();t=Math.min(t,n),e=Math.max(e,n+o)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:i}=e,s=this._cachedMeta,n=s.data,o=this.getMaxBorderWidth()+this.getMaxOffset(n)+this.options.spacing,a=Math.max((Math.min(i.width,i.height)-o)/2,0),r=Math.min(J(this.options.cutout,a),1),l=this._getRingWeight(this.index),{circumference:h,rotation:c}=this._getRotationExtents(),{ratioX:d,ratioY:u,offsetX:f,offsetY:g}=function(t,e,i){let s=1,n=1,o=0,a=0;if(e<At){const r=t,l=r+e,h=Math.cos(r),c=Math.sin(r),d=Math.cos(l),u=Math.sin(l),f=(t,e,s)=>Jt(t,r,l,!0)?1:Math.max(e,e*i,s,s*i),g=(t,e,s)=>Jt(t,r,l,!0)?-1:Math.min(e,e*i,s,s*i),p=f(0,h,d),m=f(Et,c,u),b=g(Ot,h,d),x=g(Ot+Et,c,u);s=(p-b)/2,n=(m-x)/2,o=-(p+b)/2,a=-(m+x)/2}return{ratioX:s,ratioY:n,offsetX:o,offsetY:a}}(c,h,r),p=(i.width-o)/d,m=(i.height-o)/u,b=Math.max(Math.min(p,m)/2,0),x=Q(this.options.radius,b),_=(x-Math.max(x*r,0))/this._getVisibleDatasetWeightTotal();this.offsetX=f*x,this.offsetY=g*x,s.total=this.calculateTotal(),this.outerRadius=x-_*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-_*l,0),this.updateElements(n,0,n.length,t)}_circumference(t,e){const i=this.options,s=this._cachedMeta,n=this._getCircumference();return e&&i.animation.animateRotate||!this.chart.getDataVisibility(t)||null===s._parsed[t]||s.data[t].hidden?0:this.calculateCircumference(s._parsed[t]*n/At)}updateElements(t,e,i,s){const n="reset"===s,o=this.chart,a=o.chartArea,r=o.options.animation,l=(a.left+a.right)/2,h=(a.top+a.bottom)/2,c=n&&r.animateScale,d=c?0:this.innerRadius,u=c?0:this.outerRadius,{sharedOptions:f,includeOptions:g}=this._getSharedOptions(e,s);let p,m=this._getRotation();for(p=0;p<e;++p)m+=this._circumference(p,n);for(p=e;p<e+i;++p){const e=this._circumference(p,n),i=t[p],o={x:l+this.offsetX,y:h+this.offsetY,startAngle:m,endAngle:m+e,circumference:e,outerRadius:u,innerRadius:d};g&&(o.options=f||this.resolveDataElementOptions(p,i.active?"active":s)),m+=e,this.updateElement(i,p,o,s)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let i,s=0;for(i=0;i<e.length;i++){const n=t._parsed[i];null===n||isNaN(n)||!this.chart.getDataVisibility(i)||e[i].hidden||(s+=Math.abs(n))}return s}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?At*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],n=oi(e._parsed[t],i.options.locale);return{label:s[t]||"",value:n}}getMaxBorderWidth(t){let e=0;const i=this.chart;let s,n,o,a,r;if(!t)for(s=0,n=i.data.datasets.length;s<n;++s)if(i.isDatasetVisible(s)){o=i.getDatasetMeta(s),t=o.data,a=o.controller;break}if(!t)return 0;for(s=0,n=t.length;s<n;++s)r=a.resolveDataElementOptions(s),"inner"!==r.borderAlign&&(e=Math.max(e,r.borderWidth||0,r.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let i=0,s=t.length;i<s;++i){const t=this.resolveDataElementOptions(i);e=Math.max(e,t.offset||0,t.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let i=0;i<t;++i)this.chart.isDatasetVisible(i)&&(e+=this._getRingWeight(i));return e}_getRingWeight(t){return Math.max(Z(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}An.id="doughnut",An.defaults={datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"},An.descriptors={_scriptable:t=>"spacing"!==t,_indexable:t=>"spacing"!==t},An.overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i}}=t.legend.options;return e.labels.map(((e,s)=>{const n=t.getDatasetMeta(0).controller.getStyle(s);return{text:e,fillStyle:n.backgroundColor,strokeStyle:n.borderColor,lineWidth:n.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(s),index:s}}))}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}},tooltip:{callbacks:{title:()=>"",label(t){let e=t.label;const i=": "+t.formattedValue;return X(e)?(e=e.slice(),e[0]+=i):e+=i,e}}}}};class Tn extends Os{initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:i,data:s=[],_dataset:n}=e,o=this.chart._animationsDisabled;let{start:a,count:r}=function(t,e,i){const s=e.length;let n=0,o=s;if(t._sorted){const{iScale:a,_parsed:r}=t,l=a.axis,{min:h,max:c,minDefined:d,maxDefined:u}=a.getUserBounds();d&&(n=Qt(Math.min(wt(r,a.axis,h).lo,i?s:wt(e,l,a.getPixelForValue(h)).lo),0,s-1)),o=u?Qt(Math.max(wt(r,a.axis,c).hi+1,i?0:wt(e,l,a.getPixelForValue(c)).hi+1),n,s)-n:s-n}return{start:n,count:o}}(e,s,o);this._drawStart=a,this._drawCount=r,function(t){const{xScale:e,yScale:i,_scaleRanges:s}=t,n={xmin:e.min,xmax:e.max,ymin:i.min,ymax:i.max};if(!s)return t._scaleRanges=n,!0;const o=s.xmin!==e.min||s.xmax!==e.max||s.ymin!==i.min||s.ymax!==i.max;return Object.assign(s,n),o}(e)&&(a=0,r=s.length),i._chart=this.chart,i._datasetIndex=this.index,i._decimated=!!n._decimated,i.points=s;const l=this.resolveDatasetElementOptions(t);this.options.showLine||(l.borderWidth=0),l.segment=this.options.segment,this.updateElement(i,void 0,{animated:!o,options:l},t),this.updateElements(s,a,r,t)}updateElements(t,e,i,s){const n="reset"===s,{iScale:o,vScale:a,_stacked:r,_dataset:l}=this._cachedMeta,{sharedOptions:h,includeOptions:c}=this._getSharedOptions(e,s),d=o.axis,u=a.axis,{spanGaps:f,segment:g}=this.options,p=Nt(f)?f:Number.POSITIVE_INFINITY,m=this.chart._animationsDisabled||n||"none"===s;let b=e>0&&this.getParsed(e-1);for(let f=e;f<e+i;++f){const e=t[f],i=this.getParsed(f),x=m?e:{},_=U(i[u]),y=x[d]=o.getPixelForValue(i[d],f),v=x[u]=n||_?a.getBasePixel():a.getPixelForValue(r?this.applyStack(a,i,r):i[u],f);x.skip=isNaN(y)||isNaN(v)||_,x.stop=f>0&&Math.abs(i[d]-b[d])>p,g&&(x.parsed=i,x.raw=l.data[f]),c&&(x.options=h||this.resolveDataElementOptions(f,e.active?"active":s)),m||this.updateElement(e,f,x,s),b=i}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,i=e.options&&e.options.borderWidth||0,s=t.data||[];if(!s.length)return i;const n=s[0].size(this.resolveDataElementOptions(0)),o=s[s.length-1].size(this.resolveDataElementOptions(s.length-1));return Math.max(i,n,o)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}}Tn.id="line",Tn.defaults={datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1},Tn.overrides={scales:{_index_:{type:"category"},_value_:{type:"linear"}}};class Ln extends Os{constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],n=oi(e._parsed[t].r,i.options.locale);return{label:s[t]||"",value:n}}parseObjectData(t,e,i,s){return He.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach(((t,i)=>{const s=this.getParsed(i).r;!isNaN(s)&&this.chart.getDataVisibility(i)&&(s<e.min&&(e.min=s),s>e.max&&(e.max=s))})),e}_updateRadius(){const t=this.chart,e=t.chartArea,i=t.options,s=Math.min(e.right-e.left,e.bottom-e.top),n=Math.max(s/2,0),o=(n-Math.max(i.cutoutPercentage?n/100*i.cutoutPercentage:1,0))/t.getVisibleDatasetCount();this.outerRadius=n-o*this.index,this.innerRadius=this.outerRadius-o}updateElements(t,e,i,s){const n="reset"===s,o=this.chart,a=o.options.animation,r=this._cachedMeta.rScale,l=r.xCenter,h=r.yCenter,c=r.getIndexAngle(0)-.5*Ot;let d,u=c;const f=360/this.countVisibleElements();for(d=0;d<e;++d)u+=this._computeAngle(d,s,f);for(d=e;d<e+i;d++){const e=t[d];let i=u,g=u+this._computeAngle(d,s,f),p=o.getDataVisibility(d)?r.getDistanceFromCenterForValue(this.getParsed(d).r):0;u=g,n&&(a.animateScale&&(p=0),a.animateRotate&&(i=g=c));const m={x:l,y:h,innerRadius:0,outerRadius:p,startAngle:i,endAngle:g,options:this.resolveDataElementOptions(d,e.active?"active":s)};this.updateElement(e,d,m,s)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach(((t,i)=>{!isNaN(this.getParsed(i).r)&&this.chart.getDataVisibility(i)&&e++})),e}_computeAngle(t,e,i){return this.chart.getDataVisibility(t)?Yt(this.resolveDataElementOptions(t,e).angle||i):0}}Ln.id="polarArea",Ln.defaults={dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0},Ln.overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i}}=t.legend.options;return e.labels.map(((e,s)=>{const n=t.getDatasetMeta(0).controller.getStyle(s);return{text:e,fillStyle:n.backgroundColor,strokeStyle:n.borderColor,lineWidth:n.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(s),index:s}}))}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}},tooltip:{callbacks:{title:()=>"",label:t=>t.chart.data.labels[t.dataIndex]+": "+t.formattedValue}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}};class Rn extends An{}Rn.id="pie",Rn.defaults={cutout:0,rotation:0,circumference:360,radius:"100%"};class En extends Os{getLabelAndValue(t){const e=this._cachedMeta.vScale,i=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(i[e.axis])}}parseObjectData(t,e,i,s){return He.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta,i=e.dataset,s=e.data||[],n=e.iScale.getLabels();if(i.points=s,"resize"!==t){const e=this.resolveDatasetElementOptions(t);this.options.showLine||(e.borderWidth=0);const o={_loop:!0,_fullLoop:n.length===s.length,options:e};this.updateElement(i,void 0,o,t)}this.updateElements(s,0,s.length,t)}updateElements(t,e,i,s){const n=this._cachedMeta.rScale,o="reset"===s;for(let a=e;a<e+i;a++){const e=t[a],i=this.resolveDataElementOptions(a,e.active?"active":s),r=n.getPointPositionForValue(a,this.getParsed(a).r),l=o?n.xCenter:r.x,h=o?n.yCenter:r.y,c={x:l,y:h,angle:r.angle,skip:isNaN(l)||isNaN(h),options:i};this.updateElement(e,a,c,s)}}}En.id="radar",En.defaults={datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}},En.overrides={aspectRatio:1,scales:{r:{type:"radialLinear"}}};class In extends Tn{}In.id="scatter",In.defaults={showLine:!1,fill:!1},In.overrides={interaction:{mode:"point"},plugins:{tooltip:{callbacks:{title:()=>"",label:t=>"("+t.label+", "+t.formattedValue+")"}}},scales:{x:{type:"linear"},y:{type:"linear"}}};var zn=Object.freeze({__proto__:null,BarController:Cn,BubbleController:On,DoughnutController:An,LineController:Tn,PolarAreaController:Ln,PieController:Rn,RadarController:En,ScatterController:In});function Fn(t,e,i){const{startAngle:s,pixelMargin:n,x:o,y:a,outerRadius:r,innerRadius:l}=e;let h=n/r;t.beginPath(),t.arc(o,a,r,s-h,i+h),l>n?(h=n/l,t.arc(o,a,l,i+h,s-h,!0)):t.arc(o,a,n,i+Et,s-Et),t.closePath(),t.clip()}function Bn(t,e,i,s){const n=hi(t.options.borderRadius,["outerStart","outerEnd","innerStart","innerEnd"]);const o=(i-e)/2,a=Math.min(o,s*e/2),r=t=>{const e=(i-Math.min(o,t))*s/2;return Qt(t,0,Math.min(o,e))};return{outerStart:r(n.outerStart),outerEnd:r(n.outerEnd),innerStart:Qt(n.innerStart,0,a),innerEnd:Qt(n.innerEnd,0,a)}}function Vn(t,e,i,s){return{x:i+t*Math.cos(e),y:s+t*Math.sin(e)}}function Wn(t,e,i,s,n){const{x:o,y:a,startAngle:r,pixelMargin:l,innerRadius:h}=e,c=Math.max(e.outerRadius+s+i-l,0),d=h>0?h+s+i+l:0;let u=0;const f=n-r;if(s){const t=((h>0?h-s:0)+(c>0?c-s:0))/2;u=(f-(0!==t?f*t/(t+s):f))/2}const g=(f-Math.max(.001,f*c-i/Ot)/c)/2,p=r+g+u,m=n-g-u,{outerStart:b,outerEnd:x,innerStart:_,innerEnd:y}=Bn(e,d,c,m-p),v=c-b,w=c-x,M=p+b/v,k=m-x/w,S=d+_,P=d+y,D=p+_/S,C=m-y/P;if(t.beginPath(),t.arc(o,a,c,M,k),x>0){const e=Vn(w,k,o,a);t.arc(e.x,e.y,x,k,m+Et)}const O=Vn(P,m,o,a);if(t.lineTo(O.x,O.y),y>0){const e=Vn(P,C,o,a);t.arc(e.x,e.y,y,m+Et,C+Math.PI)}if(t.arc(o,a,d,m-y/d,p+_/d,!0),_>0){const e=Vn(S,D,o,a);t.arc(e.x,e.y,_,D+Math.PI,p-Et)}const A=Vn(v,p,o,a);if(t.lineTo(A.x,A.y),b>0){const e=Vn(v,M,o,a);t.arc(e.x,e.y,b,p-Et,M)}t.closePath()}function Nn(t,e,i,s,n){const{options:o}=e,{borderWidth:a,borderJoinStyle:r}=o,l="inner"===o.borderAlign;a&&(l?(t.lineWidth=2*a,t.lineJoin=r||"round"):(t.lineWidth=a,t.lineJoin=r||"bevel"),e.fullCircles&&function(t,e,i){const{x:s,y:n,startAngle:o,pixelMargin:a,fullCircles:r}=e,l=Math.max(e.outerRadius-a,0),h=e.innerRadius+a;let c;for(i&&Fn(t,e,o+At),t.beginPath(),t.arc(s,n,h,o+At,o,!0),c=0;c<r;++c)t.stroke();for(t.beginPath(),t.arc(s,n,l,o,o+At),c=0;c<r;++c)t.stroke()}(t,e,l),l&&Fn(t,e,n),Wn(t,e,i,s,n),t.stroke())}class jn extends As{constructor(t){super(),this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,t&&Object.assign(this,t)}inRange(t,e,i){const s=this.getProps(["x","y"],i),{angle:n,distance:o}=qt(s,{x:t,y:e}),{startAngle:a,endAngle:r,innerRadius:l,outerRadius:h,circumference:c}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],i),d=this.options.spacing/2,u=Z(c,r-a)>=At||Jt(n,a,r),f=ee(o,l+d,h+d);return u&&f}getCenterPoint(t){const{x:e,y:i,startAngle:s,endAngle:n,innerRadius:o,outerRadius:a}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius","circumference"],t),{offset:r,spacing:l}=this.options,h=(s+n)/2,c=(o+a+l+r)/2;return{x:e+Math.cos(h)*c,y:i+Math.sin(h)*c}}tooltipPosition(t){return this.getCenterPoint(t)}draw(t){const{options:e,circumference:i}=this,s=(e.offset||0)/2,n=(e.spacing||0)/2;if(this.pixelMargin="inner"===e.borderAlign?.33:0,this.fullCircles=i>At?Math.floor(i/At):0,0===i||this.innerRadius<0||this.outerRadius<0)return;t.save();let o=0;if(s){o=s/2;const e=(this.startAngle+this.endAngle)/2;t.translate(Math.cos(e)*o,Math.sin(e)*o),this.circumference>=Ot&&(o=s)}t.fillStyle=e.backgroundColor,t.strokeStyle=e.borderColor;const a=function(t,e,i,s){const{fullCircles:n,startAngle:o,circumference:a}=e;let r=e.endAngle;if(n){Wn(t,e,i,s,o+At);for(let e=0;e<n;++e)t.fill();isNaN(a)||(r=o+a%At,a%At==0&&(r+=At))}return Wn(t,e,i,s,r),t.fill(),r}(t,this,o,n);Nn(t,this,o,n,a),t.restore()}}function Hn(t,e,i=e){t.lineCap=Z(i.borderCapStyle,e.borderCapStyle),t.setLineDash(Z(i.borderDash,e.borderDash)),t.lineDashOffset=Z(i.borderDashOffset,e.borderDashOffset),t.lineJoin=Z(i.borderJoinStyle,e.borderJoinStyle),t.lineWidth=Z(i.borderWidth,e.borderWidth),t.strokeStyle=Z(i.borderColor,e.borderColor)}function $n(t,e,i){t.lineTo(i.x,i.y)}function Yn(t,e,i={}){const s=t.length,{start:n=0,end:o=s-1}=i,{start:a,end:r}=e,l=Math.max(n,a),h=Math.min(o,r),c=n<a&&o<a||n>r&&o>r;return{count:s,start:l,loop:e.loop,ilen:h<l&&!c?s+h-l:h-l}}function Un(t,e,i,s){const{points:n,options:o}=e,{count:a,start:r,loop:l,ilen:h}=Yn(n,i,s),c=function(t){return t.stepped?Se:t.tension||"monotone"===t.cubicInterpolationMode?Pe:$n}(o);let d,u,f,{move:g=!0,reverse:p}=s||{};for(d=0;d<=h;++d)u=n[(r+(p?h-d:d))%a],u.skip||(g?(t.moveTo(u.x,u.y),g=!1):c(t,f,u,p,o.stepped),f=u);return l&&(u=n[(r+(p?h:0))%a],c(t,f,u,p,o.stepped)),!!l}function Xn(t,e,i,s){const n=e.points,{count:o,start:a,ilen:r}=Yn(n,i,s),{move:l=!0,reverse:h}=s||{};let c,d,u,f,g,p,m=0,b=0;const x=t=>(a+(h?r-t:t))%o,_=()=>{f!==g&&(t.lineTo(m,g),t.lineTo(m,f),t.lineTo(m,p))};for(l&&(d=n[x(0)],t.moveTo(d.x,d.y)),c=0;c<=r;++c){if(d=n[x(c)],d.skip)continue;const e=d.x,i=d.y,s=0|e;s===u?(i<f?f=i:i>g&&(g=i),m=(b*m+e)/++b):(_(),t.lineTo(e,i),u=s,b=0,f=g=i),p=i}_()}function qn(t){const e=t.options,i=e.borderDash&&e.borderDash.length;return!(t._decimated||t._loop||e.tension||"monotone"===e.cubicInterpolationMode||e.stepped||i)?Xn:Un}jn.id="arc",jn.defaults={borderAlign:"center",borderColor:"#fff",borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0},jn.defaultRoutes={backgroundColor:"backgroundColor"};const Kn="function"==typeof Path2D;function Gn(t,e,i,s){Kn&&!e.options.segment?function(t,e,i,s){let n=e._path;n||(n=e._path=new Path2D,e.path(n,i,s)&&n.closePath()),Hn(t,e.options),t.stroke(n)}(t,e,i,s):function(t,e,i,s){const{segments:n,options:o}=e,a=qn(e);for(const r of n)Hn(t,o,r.style),t.beginPath(),a(t,e,r,{start:i,end:i+s-1})&&t.closePath(),t.stroke()}(t,e,i,s)}class Zn extends As{constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const i=this.options;if((i.tension||"monotone"===i.cubicInterpolationMode)&&!i.stepped&&!this._pointsUpdated){const s=i.spanGaps?this._loop:this._fullLoop;Ge(this._points,i,t,s,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=ki(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,i=t.length;return i&&e[t[i-1].end]}interpolate(t,e){const i=this.options,s=t[e],n=this.points,o=Mi(this,{property:e,start:s,end:s});if(!o.length)return;const a=[],r=function(t){return t.stepped?ii:t.tension||"monotone"===t.cubicInterpolationMode?si:ei}(i);let l,h;for(l=0,h=o.length;l<h;++l){const{start:h,end:c}=o[l],d=n[h],u=n[c];if(d===u){a.push(d);continue}const f=r(d,u,Math.abs((s-d[e])/(u[e]-d[e])),i.stepped);f[e]=t[e],a.push(f)}return 1===a.length?a[0]:a}pathSegment(t,e,i){return qn(this)(t,this,e,i)}path(t,e,i){const s=this.segments,n=qn(this);let o=this._loop;e=e||0,i=i||this.points.length-e;for(const a of s)o&=n(t,this,a,{start:e,end:e+i-1});return!!o}draw(t,e,i,s){const n=this.options||{};(this.points||[]).length&&n.borderWidth&&(t.save(),Gn(t,this,i,s),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}function Jn(t,e,i,s){const n=t.options,{[i]:o}=t.getProps([i],s);return Math.abs(e-o)<n.radius+n.hitRadius}Zn.id="line",Zn.defaults={borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0},Zn.defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"},Zn.descriptors={_scriptable:!0,_indexable:t=>"borderDash"!==t&&"fill"!==t};class Qn extends As{constructor(t){super(),this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,t&&Object.assign(this,t)}inRange(t,e,i){const s=this.options,{x:n,y:o}=this.getProps(["x","y"],i);return Math.pow(t-n,2)+Math.pow(e-o,2)<Math.pow(s.hitRadius+s.radius,2)}inXRange(t,e){return Jn(this,t,"x",e)}inYRange(t,e){return Jn(this,t,"y",e)}getCenterPoint(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}size(t){let e=(t=t||this.options||{}).radius||0;e=Math.max(e,e&&t.hoverRadius||0);return 2*(e+(e&&t.borderWidth||0))}draw(t,e){const i=this.options;this.skip||i.radius<.1||!we(this,e,this.size(i)/2)||(t.strokeStyle=i.borderColor,t.lineWidth=i.borderWidth,t.fillStyle=i.backgroundColor,ye(t,i,this.x,this.y))}getRange(){const t=this.options||{};return t.radius+t.hitRadius}}function to(t,e){const{x:i,y:s,base:n,width:o,height:a}=t.getProps(["x","y","base","width","height"],e);let r,l,h,c,d;return t.horizontal?(d=a/2,r=Math.min(i,n),l=Math.max(i,n),h=s-d,c=s+d):(d=o/2,r=i-d,l=i+d,h=Math.min(s,n),c=Math.max(s,n)),{left:r,top:h,right:l,bottom:c}}function eo(t,e,i,s){return t?0:Qt(e,i,s)}function io(t){const e=to(t),i=e.right-e.left,s=e.bottom-e.top,n=function(t,e,i){const s=t.options.borderWidth,n=t.borderSkipped,o=ci(s);return{t:eo(n.top,o.top,0,i),r:eo(n.right,o.right,0,e),b:eo(n.bottom,o.bottom,0,i),l:eo(n.left,o.left,0,e)}}(t,i/2,s/2),o=function(t,e,i){const{enableBorderRadius:s}=t.getProps(["enableBorderRadius"]),n=t.options.borderRadius,o=di(n),a=Math.min(e,i),r=t.borderSkipped,l=s||q(n);return{topLeft:eo(!l||r.top||r.left,o.topLeft,0,a),topRight:eo(!l||r.top||r.right,o.topRight,0,a),bottomLeft:eo(!l||r.bottom||r.left,o.bottomLeft,0,a),bottomRight:eo(!l||r.bottom||r.right,o.bottomRight,0,a)}}(t,i/2,s/2);return{outer:{x:e.left,y:e.top,w:i,h:s,radius:o},inner:{x:e.left+n.l,y:e.top+n.t,w:i-n.l-n.r,h:s-n.t-n.b,radius:{topLeft:Math.max(0,o.topLeft-Math.max(n.t,n.l)),topRight:Math.max(0,o.topRight-Math.max(n.t,n.r)),bottomLeft:Math.max(0,o.bottomLeft-Math.max(n.b,n.l)),bottomRight:Math.max(0,o.bottomRight-Math.max(n.b,n.r))}}}}function so(t,e,i,s){const n=null===e,o=null===i,a=t&&!(n&&o)&&to(t,s);return a&&(n||ee(e,a.left,a.right))&&(o||ee(i,a.top,a.bottom))}function no(t,e){t.rect(e.x,e.y,e.w,e.h)}function oo(t,e,i={}){const s=t.x!==i.x?-e:0,n=t.y!==i.y?-e:0,o=(t.x+t.w!==i.x+i.w?e:0)-s,a=(t.y+t.h!==i.y+i.h?e:0)-n;return{x:t.x+s,y:t.y+n,w:t.w+o,h:t.h+a,radius:t.radius}}Qn.id="point",Qn.defaults={borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0},Qn.defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};class ao extends As{constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:i,backgroundColor:s}}=this,{inner:n,outer:o}=io(this),a=(r=o.radius).topLeft||r.topRight||r.bottomLeft||r.bottomRight?Oe:no;var r;t.save(),o.w===n.w&&o.h===n.h||(t.beginPath(),a(t,oo(o,e,n)),t.clip(),a(t,oo(n,-e,o)),t.fillStyle=i,t.fill("evenodd")),t.beginPath(),a(t,oo(n,e)),t.fillStyle=s,t.fill(),t.restore()}inRange(t,e,i){return so(this,t,e,i)}inXRange(t,e){return so(this,t,null,e)}inYRange(t,e){return so(this,null,t,e)}getCenterPoint(t){const{x:e,y:i,base:s,horizontal:n}=this.getProps(["x","y","base","horizontal"],t);return{x:n?(e+s)/2:e,y:n?i:(i+s)/2}}getRange(t){return"x"===t?this.width/2:this.height/2}}ao.id="bar",ao.defaults={borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0},ao.defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};var ro=Object.freeze({__proto__:null,ArcElement:jn,LineElement:Zn,PointElement:Qn,BarElement:ao});function lo(t){if(t._decimated){const e=t._data;delete t._decimated,delete t._data,Object.defineProperty(t,"data",{value:e})}}function ho(t){t.data.datasets.forEach((t=>{lo(t)}))}var co={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(t,e,i)=>{if(!i.enabled)return void ho(t);const s=t.width;t.data.datasets.forEach(((e,n)=>{const{_data:o,indexAxis:a}=e,r=t.getDatasetMeta(n),l=o||e.data;if("y"===gi([a,t.options.indexAxis]))return;if(!r.controller.supportsDecimation)return;const h=t.scales[r.xAxisID];if("linear"!==h.type&&"time"!==h.type)return;if(t.options.parsing)return;let{start:c,count:d}=function(t,e){const i=e.length;let s,n=0;const{iScale:o}=t,{min:a,max:r,minDefined:l,maxDefined:h}=o.getUserBounds();return l&&(n=Qt(wt(e,o.axis,a).lo,0,i-1)),s=h?Qt(wt(e,o.axis,r).hi+1,n,i)-n:i-n,{start:n,count:s}}(r,l);if(d<=(i.threshold||4*s))return void lo(e);let u;switch(U(o)&&(e._data=l,delete e.data,Object.defineProperty(e,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(t){this._data=t}})),i.algorithm){case"lttb":u=function(t,e,i,s,n){const o=n.samples||s;if(o>=i)return t.slice(e,e+i);const a=[],r=(i-2)/(o-2);let l=0;const h=e+i-1;let c,d,u,f,g,p=e;for(a[l++]=t[p],c=0;c<o-2;c++){let s,n=0,o=0;const h=Math.floor((c+1)*r)+1+e,m=Math.min(Math.floor((c+2)*r)+1,i)+e,b=m-h;for(s=h;s<m;s++)n+=t[s].x,o+=t[s].y;n/=b,o/=b;const x=Math.floor(c*r)+1+e,_=Math.min(Math.floor((c+1)*r)+1,i)+e,{x:y,y:v}=t[p];for(u=f=-1,s=x;s<_;s++)f=.5*Math.abs((y-n)*(t[s].y-v)-(y-t[s].x)*(o-v)),f>u&&(u=f,d=t[s],g=s);a[l++]=d,p=g}return a[l++]=t[h],a}(l,c,d,s,i);break;case"min-max":u=function(t,e,i,s){let n,o,a,r,l,h,c,d,u,f,g=0,p=0;const m=[],b=e+i-1,x=t[e].x,_=t[b].x-x;for(n=e;n<e+i;++n){o=t[n],a=(o.x-x)/_*s,r=o.y;const e=0|a;if(e===l)r<u?(u=r,h=n):r>f&&(f=r,c=n),g=(p*g+o.x)/++p;else{const i=n-1;if(!U(h)&&!U(c)){const e=Math.min(h,c),s=Math.max(h,c);e!==d&&e!==i&&m.push({...t[e],x:g}),s!==d&&s!==i&&m.push({...t[s],x:g})}n>0&&i!==d&&m.push(t[i]),m.push(o),l=e,p=0,u=f=r,h=c=d=n}}return m}(l,c,d,s);break;default:throw new Error(`Unsupported decimation algorithm '${i.algorithm}'`)}e._decimated=u}))},destroy(t){ho(t)}};function uo(t,e,i,s){if(s)return;let n=e[t],o=i[t];return"angle"===t&&(n=Zt(n),o=Zt(o)),{property:t,start:n,end:o}}function fo(t,e,i){for(;e>t;e--){const t=i[e];if(!isNaN(t.x)&&!isNaN(t.y))break}return e}function go(t,e,i,s){return t&&e?s(t[i],e[i]):t?t[i]:e?e[i]:0}function po(t,e){let i=[],s=!1;return X(t)?(s=!0,i=t):i=function(t,e){const{x:i=null,y:s=null}=t||{},n=e.points,o=[];return e.segments.forEach((({start:t,end:e})=>{e=fo(t,e,n);const a=n[t],r=n[e];null!==s?(o.push({x:a.x,y:s}),o.push({x:r.x,y:s})):null!==i&&(o.push({x:i,y:a.y}),o.push({x:i,y:r.y}))})),o}(t,e),i.length?new Zn({points:i,options:{tension:0},_loop:s,_fullLoop:s}):null}function mo(t){return t&&!1!==t.fill}function bo(t,e,i){let s=t[e].fill;const n=[e];let o;if(!i)return s;for(;!1!==s&&-1===n.indexOf(s);){if(!K(s))return s;if(o=t[s],!o)return!1;if(o.visible)return s;n.push(s),s=o.fill}return!1}function xo(t,e,i){const s=function(t){const e=t.options,i=e.fill;let s=Z(i&&i.target,i);void 0===s&&(s=!!e.backgroundColor);if(!1===s||null===s)return!1;if(!0===s)return"origin";return s}(t);if(q(s))return!isNaN(s.value)&&s;let n=parseFloat(s);return K(n)&&Math.floor(n)===n?function(t,e,i,s){"-"!==t&&"+"!==t||(i=e+i);if(i===e||i<0||i>=s)return!1;return i}(s[0],e,n,i):["origin","start","end","stack","shape"].indexOf(s)>=0&&s}function _o(t,e,i){const s=[];for(let n=0;n<i.length;n++){const o=i[n],{first:a,last:r,point:l}=yo(o,e,"x");if(!(!l||a&&r))if(a)s.unshift(l);else if(t.push(l),!r)break}t.push(...s)}function yo(t,e,i){const s=t.interpolate(e,i);if(!s)return{};const n=s[i],o=t.segments,a=t.points;let r=!1,l=!1;for(let t=0;t<o.length;t++){const e=o[t],s=a[e.start][i],h=a[e.end][i];if(ee(n,s,h)){r=n===s,l=n===h;break}}return{first:r,last:l,point:s}}class vo{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,i){const{x:s,y:n,radius:o}=this;return e=e||{start:0,end:At},t.arc(s,n,o,e.end,e.start,!0),!i.bounds}interpolate(t){const{x:e,y:i,radius:s}=this,n=t.angle;return{x:e+Math.cos(n)*s,y:i+Math.sin(n)*s,angle:n}}}function wo(t){const{chart:e,fill:i,line:s}=t;if(K(i))return function(t,e){const i=t.getDatasetMeta(e);return i&&t.isDatasetVisible(e)?i.dataset:null}(e,i);if("stack"===i)return function(t){const{scale:e,index:i,line:s}=t,n=[],o=s.segments,a=s.points,r=function(t,e){const i=[],s=t.getMatchingVisibleMetas("line");for(let t=0;t<s.length;t++){const n=s[t];if(n.index===e)break;n.hidden||i.unshift(n.dataset)}return i}(e,i);r.push(po({x:null,y:e.bottom},s));for(let t=0;t<o.length;t++){const e=o[t];for(let t=e.start;t<=e.end;t++)_o(n,a[t],r)}return new Zn({points:n,options:{}})}(t);if("shape"===i)return!0;const n=function(t){if((t.scale||{}).getPointPositionForValue)return function(t){const{scale:e,fill:i}=t,s=e.options,n=e.getLabels().length,o=s.reverse?e.max:e.min,a=function(t,e,i){let s;return s="start"===t?i:"end"===t?e.options.reverse?e.min:e.max:q(t)?t.value:e.getBaseValue(),s}(i,e,o),r=[];if(s.grid.circular){const t=e.getPointPositionForValue(0,o);return new vo({x:t.x,y:t.y,radius:e.getDistanceFromCenterForValue(a)})}for(let t=0;t<n;++t)r.push(e.getPointPositionForValue(t,a));return r}(t);return function(t){const{scale:e={},fill:i}=t,s=function(t,e){let i=null;return"start"===t?i=e.bottom:"end"===t?i=e.top:q(t)?i=e.getPixelForValue(t.value):e.getBasePixel&&(i=e.getBasePixel()),i}(i,e);if(K(s)){const t=e.isHorizontal();return{x:t?s:null,y:t?null:s}}return null}(t)}(t);return n instanceof vo?n:po(n,s)}function Mo(t,e,i){const s=wo(e),{line:n,scale:o,axis:a}=e,r=n.options,l=r.fill,h=r.backgroundColor,{above:c=h,below:d=h}=l||{};s&&n.points.length&&(Me(t,i),function(t,e){const{line:i,target:s,above:n,below:o,area:a,scale:r}=e,l=i._loop?"angle":e.axis;t.save(),"x"===l&&o!==n&&(ko(t,s,a.top),So(t,{line:i,target:s,color:n,scale:r,property:l}),t.restore(),t.save(),ko(t,s,a.bottom));So(t,{line:i,target:s,color:o,scale:r,property:l}),t.restore()}(t,{line:n,target:s,above:c,below:d,area:i,scale:o,axis:a}),ke(t))}function ko(t,e,i){const{segments:s,points:n}=e;let o=!0,a=!1;t.beginPath();for(const r of s){const{start:s,end:l}=r,h=n[s],c=n[fo(s,l,n)];o?(t.moveTo(h.x,h.y),o=!1):(t.lineTo(h.x,i),t.lineTo(h.x,h.y)),a=!!e.pathSegment(t,r,{move:a}),a?t.closePath():t.lineTo(c.x,i)}t.lineTo(e.first().x,i),t.closePath(),t.clip()}function So(t,e){const{line:i,target:s,property:n,color:o,scale:a}=e,r=function(t,e,i){const s=t.segments,n=t.points,o=e.points,a=[];for(const t of s){let{start:s,end:r}=t;r=fo(s,r,n);const l=uo(i,n[s],n[r],t.loop);if(!e.segments){a.push({source:t,target:l,start:n[s],end:n[r]});continue}const h=Mi(e,l);for(const e of h){const s=uo(i,o[e.start],o[e.end],e.loop),r=wi(t,n,s);for(const t of r)a.push({source:t,target:e,start:{[i]:go(l,s,"start",Math.max)},end:{[i]:go(l,s,"end",Math.min)}})}}return a}(i,s,n);for(const{source:e,target:l,start:h,end:c}of r){const{style:{backgroundColor:r=o}={}}=e,d=!0!==s;t.save(),t.fillStyle=r,Po(t,a,d&&uo(n,h,c)),t.beginPath();const u=!!i.pathSegment(t,e);let f;if(d){u?t.closePath():Do(t,s,c,n);const e=!!s.pathSegment(t,l,{move:u,reverse:!0});f=u&&e,f||Do(t,s,h,n)}t.closePath(),t.fill(f?"evenodd":"nonzero"),t.restore()}}function Po(t,e,i){const{top:s,bottom:n}=e.chart.chartArea,{property:o,start:a,end:r}=i||{};"x"===o&&(t.beginPath(),t.rect(a,s,r-a,n-s),t.clip())}function Do(t,e,i,s){const n=e.interpolate(i,s);n&&t.lineTo(n.x,n.y)}var Co={id:"filler",afterDatasetsUpdate(t,e,i){const s=(t.data.datasets||[]).length,n=[];let o,a,r,l;for(a=0;a<s;++a)o=t.getDatasetMeta(a),r=o.dataset,l=null,r&&r.options&&r instanceof Zn&&(l={visible:t.isDatasetVisible(a),index:a,fill:xo(r,a,s),chart:t,axis:o.controller.options.indexAxis,scale:o.vScale,line:r}),o.$filler=l,n.push(l);for(a=0;a<s;++a)l=n[a],l&&!1!==l.fill&&(l.fill=bo(n,a,i.propagate))},beforeDraw(t,e,i){const s="beforeDraw"===i.drawTime,n=t.getSortedVisibleDatasetMetas(),o=t.chartArea;for(let e=n.length-1;e>=0;--e){const i=n[e].$filler;i&&(i.line.updateControlPoints(o,i.axis),s&&i.fill&&Mo(t.ctx,i,o))}},beforeDatasetsDraw(t,e,i){if("beforeDatasetsDraw"!==i.drawTime)return;const s=t.getSortedVisibleDatasetMetas();for(let e=s.length-1;e>=0;--e){const i=s[e].$filler;mo(i)&&Mo(t.ctx,i,t.chartArea)}},beforeDatasetDraw(t,e,i){const s=e.meta.$filler;mo(s)&&"beforeDatasetDraw"===i.drawTime&&Mo(t.ctx,s,t.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const Oo=(t,e)=>{let{boxHeight:i=e,boxWidth:s=e}=t;return t.usePointStyle&&(i=Math.min(i,e),s=t.pointStyleWidth||Math.min(s,e)),{boxWidth:s,boxHeight:i,itemHeight:Math.max(e,i)}};class Ao extends As{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,i){this.maxWidth=t,this.maxHeight=e,this._margins=i,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=tt(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter((e=>t.filter(e,this.chart.data)))),t.sort&&(e=e.sort(((e,i)=>t.sort(e,i,this.chart.data)))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display)return void(this.width=this.height=0);const i=t.labels,s=fi(i.font),n=s.size,o=this._computeTitleHeight(),{boxWidth:a,itemHeight:r}=Oo(i,n);let l,h;e.font=s.string,this.isHorizontal()?(l=this.maxWidth,h=this._fitRows(o,n,a,r)+10):(h=this.maxHeight,l=this._fitCols(o,n,a,r)+10),this.width=Math.min(l,t.maxWidth||this.maxWidth),this.height=Math.min(h,t.maxHeight||this.maxHeight)}_fitRows(t,e,i,s){const{ctx:n,maxWidth:o,options:{labels:{padding:a}}}=this,r=this.legendHitBoxes=[],l=this.lineWidths=[0],h=s+a;let c=t;n.textAlign="left",n.textBaseline="middle";let d=-1,u=-h;return this.legendItems.forEach(((t,f)=>{const g=i+e/2+n.measureText(t.text).width;(0===f||l[l.length-1]+g+2*a>o)&&(c+=h,l[l.length-(f>0?0:1)]=0,u+=h,d++),r[f]={left:0,top:u,row:d,width:g,height:s},l[l.length-1]+=g+a})),c}_fitCols(t,e,i,s){const{ctx:n,maxHeight:o,options:{labels:{padding:a}}}=this,r=this.legendHitBoxes=[],l=this.columnSizes=[],h=o-t;let c=a,d=0,u=0,f=0,g=0;return this.legendItems.forEach(((t,o)=>{const p=i+e/2+n.measureText(t.text).width;o>0&&u+s+2*a>h&&(c+=d+a,l.push({width:d,height:u}),f+=d+a,g++,d=u=0),r[o]={left:f,top:u,col:g,width:p,height:s},d=Math.max(d,p),u+=s+a})),c+=d,l.push({width:d,height:u}),c}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:i,labels:{padding:s},rtl:o}}=this,a=bi(o,this.left,this.width);if(this.isHorizontal()){let o=0,r=n(i,this.left+s,this.right-this.lineWidths[o]);for(const l of e)o!==l.row&&(o=l.row,r=n(i,this.left+s,this.right-this.lineWidths[o])),l.top+=this.top+t+s,l.left=a.leftForLtr(a.x(r),l.width),r+=l.width+s}else{let o=0,r=n(i,this.top+t+s,this.bottom-this.columnSizes[o].height);for(const l of e)l.col!==o&&(o=l.col,r=n(i,this.top+t+s,this.bottom-this.columnSizes[o].height)),l.top=r,l.left+=this.left+s,l.left=a.leftForLtr(a.x(l.left),l.width),r+=l.height+s}}isHorizontal(){return"top"===this.options.position||"bottom"===this.options.position}draw(){if(this.options.display){const t=this.ctx;Me(t,this),this._draw(),ke(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:i,ctx:s}=this,{align:a,labels:r}=t,l=yt.color,h=bi(t.rtl,this.left,this.width),c=fi(r.font),{color:d,padding:u}=r,f=c.size,g=f/2;let p;this.drawTitle(),s.textAlign=h.textAlign("left"),s.textBaseline="middle",s.lineWidth=.5,s.font=c.string;const{boxWidth:m,boxHeight:b,itemHeight:x}=Oo(r,f),_=this.isHorizontal(),y=this._computeTitleHeight();p=_?{x:n(a,this.left+u,this.right-i[0]),y:this.top+u+y,line:0}:{x:this.left+u,y:n(a,this.top+y+u,this.bottom-e[0].height),line:0},xi(this.ctx,t.textDirection);const v=x+u;this.legendItems.forEach(((w,M)=>{s.strokeStyle=w.fontColor||d,s.fillStyle=w.fontColor||d;const k=s.measureText(w.text).width,S=h.textAlign(w.textAlign||(w.textAlign=r.textAlign)),P=m+g+k;let D=p.x,C=p.y;h.setWidth(this.width),_?M>0&&D+P+u>this.right&&(C=p.y+=v,p.line++,D=p.x=n(a,this.left+u,this.right-i[p.line])):M>0&&C+v>this.bottom&&(D=p.x=D+e[p.line].width+u,p.line++,C=p.y=n(a,this.top+y+u,this.bottom-e[p.line].height));!function(t,e,i){if(isNaN(m)||m<=0||isNaN(b)||b<0)return;s.save();const n=Z(i.lineWidth,1);if(s.fillStyle=Z(i.fillStyle,l),s.lineCap=Z(i.lineCap,"butt"),s.lineDashOffset=Z(i.lineDashOffset,0),s.lineJoin=Z(i.lineJoin,"miter"),s.lineWidth=n,s.strokeStyle=Z(i.strokeStyle,l),s.setLineDash(Z(i.lineDash,[])),r.usePointStyle){const o={radius:b*Math.SQRT2/2,pointStyle:i.pointStyle,rotation:i.rotation,borderWidth:n},a=h.xPlus(t,m/2);ve(s,o,a,e+g,m)}else{const o=e+Math.max((f-b)/2,0),a=h.leftForLtr(t,m),r=di(i.borderRadius);s.beginPath(),Object.values(r).some((t=>0!==t))?Oe(s,{x:a,y:o,w:m,h:b,radius:r}):s.rect(a,o,m,b),s.fill(),0!==n&&s.stroke()}s.restore()}(h.x(D),C,w),D=o(S,D+m+g,_?D+P:this.right,t.rtl),function(t,e,i){De(s,i.text,t,e+x/2,c,{strikethrough:i.hidden,textAlign:h.textAlign(i.textAlign)})}(h.x(D),C,w),_?p.x+=P+u:p.y+=v})),_i(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,i=fi(e.font),o=ui(e.padding);if(!e.display)return;const a=bi(t.rtl,this.left,this.width),r=this.ctx,l=e.position,h=i.size/2,c=o.top+h;let d,u=this.left,f=this.width;if(this.isHorizontal())f=Math.max(...this.lineWidths),d=this.top+c,u=n(t.align,u,this.right-f);else{const e=this.columnSizes.reduce(((t,e)=>Math.max(t,e.height)),0);d=c+n(t.align,this.top,this.bottom-e-t.labels.padding-this._computeTitleHeight())}const g=n(l,u,u+f);r.textAlign=a.textAlign(s(l)),r.textBaseline="middle",r.strokeStyle=e.color,r.fillStyle=e.color,r.font=i.string,De(r,e.text,g,d,i)}_computeTitleHeight(){const t=this.options.title,e=fi(t.font),i=ui(t.padding);return t.display?e.lineHeight+i.height:0}_getLegendItemAt(t,e){let i,s,n;if(ee(t,this.left,this.right)&&ee(e,this.top,this.bottom))for(n=this.legendHitBoxes,i=0;i<n.length;++i)if(s=n[i],ee(t,s.left,s.left+s.width)&&ee(e,s.top,s.top+s.height))return this.legendItems[i];return null}handleEvent(t){const e=this.options;if(!function(t,e){if(("mousemove"===t||"mouseout"===t)&&(e.onHover||e.onLeave))return!0;if(e.onClick&&("click"===t||"mouseup"===t))return!0;return!1}(t.type,e))return;const i=this._getLegendItemAt(t.x,t.y);if("mousemove"===t.type||"mouseout"===t.type){const o=this._hoveredItem,a=(n=i,null!==(s=o)&&null!==n&&s.datasetIndex===n.datasetIndex&&s.index===n.index);o&&!a&&tt(e.onLeave,[t,o,this],this),this._hoveredItem=i,i&&!a&&tt(e.onHover,[t,i,this],this)}else i&&tt(e.onClick,[t,i,this],this);var s,n}}var To={id:"legend",_element:Ao,start(t,e,i){const s=t.legend=new Ao({ctx:t.ctx,options:i,chart:t});qi.configure(t,s,i),qi.addBox(t,s)},stop(t){qi.removeBox(t,t.legend),delete t.legend},beforeUpdate(t,e,i){const s=t.legend;qi.configure(t,s,i),s.options=i},afterUpdate(t){const e=t.legend;e.buildLabels(),e.adjustHitBoxes()},afterEvent(t,e){e.replay||t.legend.handleEvent(e.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(t,e,i){const s=e.datasetIndex,n=i.chart;n.isDatasetVisible(s)?(n.hide(s),e.hidden=!0):(n.show(s),e.hidden=!1)},onHover:null,onLeave:null,labels:{color:t=>t.chart.options.color,boxWidth:40,padding:10,generateLabels(t){const e=t.data.datasets,{labels:{usePointStyle:i,pointStyle:s,textAlign:n,color:o}}=t.legend.options;return t._getSortedDatasetMetas().map((t=>{const a=t.controller.getStyle(i?0:void 0),r=ui(a.borderWidth);return{text:e[t.index].label,fillStyle:a.backgroundColor,fontColor:o,hidden:!t.visible,lineCap:a.borderCapStyle,lineDash:a.borderDash,lineDashOffset:a.borderDashOffset,lineJoin:a.borderJoinStyle,lineWidth:(r.width+r.height)/4,strokeStyle:a.borderColor,pointStyle:s||a.pointStyle,rotation:a.rotation,textAlign:n||a.textAlign,borderRadius:0,datasetIndex:t.index}}),this)}},title:{color:t=>t.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:t=>!t.startsWith("on"),labels:{_scriptable:t=>!["generateLabels","filter","sort"].includes(t)}}};class Lo extends As{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const i=this.options;if(this.left=0,this.top=0,!i.display)return void(this.width=this.height=this.right=this.bottom=0);this.width=this.right=t,this.height=this.bottom=e;const s=X(i.text)?i.text.length:1;this._padding=ui(i.padding);const n=s*fi(i.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=n:this.width=n}isHorizontal(){const t=this.options.position;return"top"===t||"bottom"===t}_drawArgs(t){const{top:e,left:i,bottom:s,right:o,options:a}=this,r=a.align;let l,h,c,d=0;return this.isHorizontal()?(h=n(r,i,o),c=e+t,l=o-i):("left"===a.position?(h=i+t,c=n(r,s,e),d=-.5*Ot):(h=o-t,c=n(r,e,s),d=.5*Ot),l=s-e),{titleX:h,titleY:c,maxWidth:l,rotation:d}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const i=fi(e.font),n=i.lineHeight/2+this._padding.top,{titleX:o,titleY:a,maxWidth:r,rotation:l}=this._drawArgs(n);De(t,e.text,0,0,i,{color:e.color,maxWidth:r,rotation:l,textAlign:s(e.align),textBaseline:"middle",translation:[o,a]})}}var Ro={id:"title",_element:Lo,start(t,e,i){!function(t,e){const i=new Lo({ctx:t.ctx,options:e,chart:t});qi.configure(t,i,e),qi.addBox(t,i),t.titleBlock=i}(t,i)},stop(t){const e=t.titleBlock;qi.removeBox(t,e),delete t.titleBlock},beforeUpdate(t,e,i){const s=t.titleBlock;qi.configure(t,s,i),s.options=i},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Eo=new WeakMap;var Io={id:"subtitle",start(t,e,i){const s=new Lo({ctx:t.ctx,options:i,chart:t});qi.configure(t,s,i),qi.addBox(t,s),Eo.set(t,s)},stop(t){qi.removeBox(t,Eo.get(t)),Eo.delete(t)},beforeUpdate(t,e,i){const s=Eo.get(t);qi.configure(t,s,i),s.options=i},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const zo={average(t){if(!t.length)return!1;let e,i,s=0,n=0,o=0;for(e=0,i=t.length;e<i;++e){const i=t[e].element;if(i&&i.hasValue()){const t=i.tooltipPosition();s+=t.x,n+=t.y,++o}}return{x:s/o,y:n/o}},nearest(t,e){if(!t.length)return!1;let i,s,n,o=e.x,a=e.y,r=Number.POSITIVE_INFINITY;for(i=0,s=t.length;i<s;++i){const s=t[i].element;if(s&&s.hasValue()){const t=Kt(e,s.getCenterPoint());t<r&&(r=t,n=s)}}if(n){const t=n.tooltipPosition();o=t.x,a=t.y}return{x:o,y:a}}};function Fo(t,e){return e&&(X(e)?Array.prototype.push.apply(t,e):t.push(e)),t}function Bo(t){return("string"==typeof t||t instanceof String)&&t.indexOf("\n")>-1?t.split("\n"):t}function Vo(t,e){const{element:i,datasetIndex:s,index:n}=e,o=t.getDatasetMeta(s).controller,{label:a,value:r}=o.getLabelAndValue(n);return{chart:t,label:a,parsed:o.getParsed(n),raw:t.data.datasets[s].data[n],formattedValue:r,dataset:o.getDataset(),dataIndex:n,datasetIndex:s,element:i}}function Wo(t,e){const i=t.chart.ctx,{body:s,footer:n,title:o}=t,{boxWidth:a,boxHeight:r}=e,l=fi(e.bodyFont),h=fi(e.titleFont),c=fi(e.footerFont),d=o.length,u=n.length,f=s.length,g=ui(e.padding);let p=g.height,m=0,b=s.reduce(((t,e)=>t+e.before.length+e.lines.length+e.after.length),0);if(b+=t.beforeBody.length+t.afterBody.length,d&&(p+=d*h.lineHeight+(d-1)*e.titleSpacing+e.titleMarginBottom),b){p+=f*(e.displayColors?Math.max(r,l.lineHeight):l.lineHeight)+(b-f)*l.lineHeight+(b-1)*e.bodySpacing}u&&(p+=e.footerMarginTop+u*c.lineHeight+(u-1)*e.footerSpacing);let x=0;const _=function(t){m=Math.max(m,i.measureText(t).width+x)};return i.save(),i.font=h.string,et(t.title,_),i.font=l.string,et(t.beforeBody.concat(t.afterBody),_),x=e.displayColors?a+2+e.boxPadding:0,et(s,(t=>{et(t.before,_),et(t.lines,_),et(t.after,_)})),x=0,i.font=c.string,et(t.footer,_),i.restore(),m+=g.width,{width:m,height:p}}function No(t,e,i,s){const{x:n,width:o}=i,{width:a,chartArea:{left:r,right:l}}=t;let h="center";return"center"===s?h=n<=(r+l)/2?"left":"right":n<=o/2?h="left":n>=a-o/2&&(h="right"),function(t,e,i,s){const{x:n,width:o}=s,a=i.caretSize+i.caretPadding;return"left"===t&&n+o+a>e.width||"right"===t&&n-o-a<0||void 0}(h,t,e,i)&&(h="center"),h}function jo(t,e,i){const s=i.yAlign||e.yAlign||function(t,e){const{y:i,height:s}=e;return i<s/2?"top":i>t.height-s/2?"bottom":"center"}(t,i);return{xAlign:i.xAlign||e.xAlign||No(t,e,i,s),yAlign:s}}function Ho(t,e,i,s){const{caretSize:n,caretPadding:o,cornerRadius:a}=t,{xAlign:r,yAlign:l}=i,h=n+o,{topLeft:c,topRight:d,bottomLeft:u,bottomRight:f}=di(a);let g=function(t,e){let{x:i,width:s}=t;return"right"===e?i-=s:"center"===e&&(i-=s/2),i}(e,r);const p=function(t,e,i){let{y:s,height:n}=t;return"top"===e?s+=i:s-="bottom"===e?n+i:n/2,s}(e,l,h);return"center"===l?"left"===r?g+=h:"right"===r&&(g-=h):"left"===r?g-=Math.max(c,u)+n:"right"===r&&(g+=Math.max(d,f)+n),{x:Qt(g,0,s.width-e.width),y:Qt(p,0,s.height-e.height)}}function $o(t,e,i){const s=ui(i.padding);return"center"===e?t.x+t.width/2:"right"===e?t.x+t.width-s.right:t.x+s.left}function Yo(t){return Fo([],Bo(t))}function Uo(t,e){const i=e&&e.dataset&&e.dataset.tooltip&&e.dataset.tooltip.callbacks;return i?t.override(i):t}class Xo extends As{constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart||t._chart,this._chart=this.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,i=this.options.setContext(this.getContext()),s=i.enabled&&e.options.animation&&i.animations,n=new bs(this.chart,s);return s._cacheable&&(this._cachedAnimations=Object.freeze(n)),n}getContext(){return this.$context||(this.$context=(t=this.chart.getContext(),e=this,i=this._tooltipItems,mi(t,{tooltip:e,tooltipItems:i,type:"tooltip"})));var t,e,i}getTitle(t,e){const{callbacks:i}=e,s=i.beforeTitle.apply(this,[t]),n=i.title.apply(this,[t]),o=i.afterTitle.apply(this,[t]);let a=[];return a=Fo(a,Bo(s)),a=Fo(a,Bo(n)),a=Fo(a,Bo(o)),a}getBeforeBody(t,e){return Yo(e.callbacks.beforeBody.apply(this,[t]))}getBody(t,e){const{callbacks:i}=e,s=[];return et(t,(t=>{const e={before:[],lines:[],after:[]},n=Uo(i,t);Fo(e.before,Bo(n.beforeLabel.call(this,t))),Fo(e.lines,n.label.call(this,t)),Fo(e.after,Bo(n.afterLabel.call(this,t))),s.push(e)})),s}getAfterBody(t,e){return Yo(e.callbacks.afterBody.apply(this,[t]))}getFooter(t,e){const{callbacks:i}=e,s=i.beforeFooter.apply(this,[t]),n=i.footer.apply(this,[t]),o=i.afterFooter.apply(this,[t]);let a=[];return a=Fo(a,Bo(s)),a=Fo(a,Bo(n)),a=Fo(a,Bo(o)),a}_createItems(t){const e=this._active,i=this.chart.data,s=[],n=[],o=[];let a,r,l=[];for(a=0,r=e.length;a<r;++a)l.push(Vo(this.chart,e[a]));return t.filter&&(l=l.filter(((e,s,n)=>t.filter(e,s,n,i)))),t.itemSort&&(l=l.sort(((e,s)=>t.itemSort(e,s,i)))),et(l,(e=>{const i=Uo(t.callbacks,e);s.push(i.labelColor.call(this,e)),n.push(i.labelPointStyle.call(this,e)),o.push(i.labelTextColor.call(this,e))})),this.labelColors=s,this.labelPointStyles=n,this.labelTextColors=o,this.dataPoints=l,l}update(t,e){const i=this.options.setContext(this.getContext()),s=this._active;let n,o=[];if(s.length){const t=zo[i.position].call(this,s,this._eventPosition);o=this._createItems(i),this.title=this.getTitle(o,i),this.beforeBody=this.getBeforeBody(o,i),this.body=this.getBody(o,i),this.afterBody=this.getAfterBody(o,i),this.footer=this.getFooter(o,i);const e=this._size=Wo(this,i),a=Object.assign({},t,e),r=jo(this.chart,i,a),l=Ho(i,a,r,this.chart);this.xAlign=r.xAlign,this.yAlign=r.yAlign,n={opacity:1,x:l.x,y:l.y,width:e.width,height:e.height,caretX:t.x,caretY:t.y}}else 0!==this.opacity&&(n={opacity:0});this._tooltipItems=o,this.$context=void 0,n&&this._resolveAnimations().update(this,n),t&&i.external&&i.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,i,s){const n=this.getCaretPosition(t,i,s);e.lineTo(n.x1,n.y1),e.lineTo(n.x2,n.y2),e.lineTo(n.x3,n.y3)}getCaretPosition(t,e,i){const{xAlign:s,yAlign:n}=this,{caretSize:o,cornerRadius:a}=i,{topLeft:r,topRight:l,bottomLeft:h,bottomRight:c}=di(a),{x:d,y:u}=t,{width:f,height:g}=e;let p,m,b,x,_,y;return"center"===n?(_=u+g/2,"left"===s?(p=d,m=p-o,x=_+o,y=_-o):(p=d+f,m=p+o,x=_-o,y=_+o),b=p):(m="left"===s?d+Math.max(r,h)+o:"right"===s?d+f-Math.max(l,c)-o:this.caretX,"top"===n?(x=u,_=x-o,p=m-o,b=m+o):(x=u+g,_=x+o,p=m+o,b=m-o),y=x),{x1:p,x2:m,x3:b,y1:x,y2:_,y3:y}}drawTitle(t,e,i){const s=this.title,n=s.length;let o,a,r;if(n){const l=bi(i.rtl,this.x,this.width);for(t.x=$o(this,i.titleAlign,i),e.textAlign=l.textAlign(i.titleAlign),e.textBaseline="middle",o=fi(i.titleFont),a=i.titleSpacing,e.fillStyle=i.titleColor,e.font=o.string,r=0;r<n;++r)e.fillText(s[r],l.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+a,r+1===n&&(t.y+=i.titleMarginBottom-a)}}_drawColorBox(t,e,i,s,n){const o=this.labelColors[i],a=this.labelPointStyles[i],{boxHeight:r,boxWidth:l,boxPadding:h}=n,c=fi(n.bodyFont),d=$o(this,"left",n),u=s.x(d),f=r<c.lineHeight?(c.lineHeight-r)/2:0,g=e.y+f;if(n.usePointStyle){const e={radius:Math.min(l,r)/2,pointStyle:a.pointStyle,rotation:a.rotation,borderWidth:1},i=s.leftForLtr(u,l)+l/2,h=g+r/2;t.strokeStyle=n.multiKeyBackground,t.fillStyle=n.multiKeyBackground,ye(t,e,i,h),t.strokeStyle=o.borderColor,t.fillStyle=o.backgroundColor,ye(t,e,i,h)}else{t.lineWidth=q(o.borderWidth)?Math.max(...Object.values(o.borderWidth)):o.borderWidth||1,t.strokeStyle=o.borderColor,t.setLineDash(o.borderDash||[]),t.lineDashOffset=o.borderDashOffset||0;const e=s.leftForLtr(u,l-h),i=s.leftForLtr(s.xPlus(u,1),l-h-2),a=di(o.borderRadius);Object.values(a).some((t=>0!==t))?(t.beginPath(),t.fillStyle=n.multiKeyBackground,Oe(t,{x:e,y:g,w:l,h:r,radius:a}),t.fill(),t.stroke(),t.fillStyle=o.backgroundColor,t.beginPath(),Oe(t,{x:i,y:g+1,w:l-2,h:r-2,radius:a}),t.fill()):(t.fillStyle=n.multiKeyBackground,t.fillRect(e,g,l,r),t.strokeRect(e,g,l,r),t.fillStyle=o.backgroundColor,t.fillRect(i,g+1,l-2,r-2))}t.fillStyle=this.labelTextColors[i]}drawBody(t,e,i){const{body:s}=this,{bodySpacing:n,bodyAlign:o,displayColors:a,boxHeight:r,boxWidth:l,boxPadding:h}=i,c=fi(i.bodyFont);let d=c.lineHeight,u=0;const f=bi(i.rtl,this.x,this.width),g=function(i){e.fillText(i,f.x(t.x+u),t.y+d/2),t.y+=d+n},p=f.textAlign(o);let m,b,x,_,y,v,w;for(e.textAlign=o,e.textBaseline="middle",e.font=c.string,t.x=$o(this,p,i),e.fillStyle=i.bodyColor,et(this.beforeBody,g),u=a&&"right"!==p?"center"===o?l/2+h:l+2+h:0,_=0,v=s.length;_<v;++_){for(m=s[_],b=this.labelTextColors[_],e.fillStyle=b,et(m.before,g),x=m.lines,a&&x.length&&(this._drawColorBox(e,t,_,f,i),d=Math.max(c.lineHeight,r)),y=0,w=x.length;y<w;++y)g(x[y]),d=c.lineHeight;et(m.after,g)}u=0,d=c.lineHeight,et(this.afterBody,g),t.y-=n}drawFooter(t,e,i){const s=this.footer,n=s.length;let o,a;if(n){const r=bi(i.rtl,this.x,this.width);for(t.x=$o(this,i.footerAlign,i),t.y+=i.footerMarginTop,e.textAlign=r.textAlign(i.footerAlign),e.textBaseline="middle",o=fi(i.footerFont),e.fillStyle=i.footerColor,e.font=o.string,a=0;a<n;++a)e.fillText(s[a],r.x(t.x),t.y+o.lineHeight/2),t.y+=o.lineHeight+i.footerSpacing}}drawBackground(t,e,i,s){const{xAlign:n,yAlign:o}=this,{x:a,y:r}=t,{width:l,height:h}=i,{topLeft:c,topRight:d,bottomLeft:u,bottomRight:f}=di(s.cornerRadius);e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,e.lineWidth=s.borderWidth,e.beginPath(),e.moveTo(a+c,r),"top"===o&&this.drawCaret(t,e,i,s),e.lineTo(a+l-d,r),e.quadraticCurveTo(a+l,r,a+l,r+d),"center"===o&&"right"===n&&this.drawCaret(t,e,i,s),e.lineTo(a+l,r+h-f),e.quadraticCurveTo(a+l,r+h,a+l-f,r+h),"bottom"===o&&this.drawCaret(t,e,i,s),e.lineTo(a+u,r+h),e.quadraticCurveTo(a,r+h,a,r+h-u),"center"===o&&"left"===n&&this.drawCaret(t,e,i,s),e.lineTo(a,r+c),e.quadraticCurveTo(a,r,a+c,r),e.closePath(),e.fill(),s.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,i=this.$animations,s=i&&i.x,n=i&&i.y;if(s||n){const i=zo[t.position].call(this,this._active,this._eventPosition);if(!i)return;const o=this._size=Wo(this,t),a=Object.assign({},i,this._size),r=jo(e,t,a),l=Ho(t,a,r,e);s._to===l.x&&n._to===l.y||(this.xAlign=r.xAlign,this.yAlign=r.yAlign,this.width=o.width,this.height=o.height,this.caretX=i.x,this.caretY=i.y,this._resolveAnimations().update(this,l))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let i=this.opacity;if(!i)return;this._updateAnimationTarget(e);const s={width:this.width,height:this.height},n={x:this.x,y:this.y};i=Math.abs(i)<.001?0:i;const o=ui(e.padding),a=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&a&&(t.save(),t.globalAlpha=i,this.drawBackground(n,t,s,e),xi(t,e.textDirection),n.y+=o.top,this.drawTitle(n,t,e),this.drawBody(n,t,e),this.drawFooter(n,t,e),_i(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const i=this._active,s=t.map((({datasetIndex:t,index:e})=>{const i=this.chart.getDatasetMeta(t);if(!i)throw new Error("Cannot find a dataset at index "+t);return{datasetIndex:t,element:i.data[e],index:e}})),n=!it(i,s),o=this._positionChanged(s,e);(n||o)&&(this._active=s,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,i=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const s=this.options,n=this._active||[],o=this._getActiveElements(t,n,e,i),a=this._positionChanged(o,t),r=e||!it(o,n)||a;return r&&(this._active=o,(s.enabled||s.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),r}_getActiveElements(t,e,i,s){const n=this.options;if("mouseout"===t.type)return[];if(!s)return e;const o=this.chart.getElementsAtEventForMode(t,n.mode,n,i);return n.reverse&&o.reverse(),o}_positionChanged(t,e){const{caretX:i,caretY:s,options:n}=this,o=zo[n.position].call(this,t,e);return!1!==o&&(i!==o.x||s!==o.y)}}Xo.positioners=zo;var qo={id:"tooltip",_element:Xo,positioners:zo,afterInit(t,e,i){i&&(t.tooltip=new Xo({chart:t,options:i}))},beforeUpdate(t,e,i){t.tooltip&&t.tooltip.initialize(i)},reset(t,e,i){t.tooltip&&t.tooltip.initialize(i)},afterDraw(t){const e=t.tooltip;if(e&&e._willRender()){const i={tooltip:e};if(!1===t.notifyPlugins("beforeTooltipDraw",i))return;e.draw(t.ctx),t.notifyPlugins("afterTooltipDraw",i)}},afterEvent(t,e){if(t.tooltip){const i=e.replay;t.tooltip.handleEvent(e.event,i,e.inChartArea)&&(e.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(t,e)=>e.bodyFont.size,boxWidth:(t,e)=>e.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:{beforeTitle:$,title(t){if(t.length>0){const e=t[0],i=e.chart.data.labels,s=i?i.length:0;if(this&&this.options&&"dataset"===this.options.mode)return e.dataset.label||"";if(e.label)return e.label;if(s>0&&e.dataIndex<s)return i[e.dataIndex]}return""},afterTitle:$,beforeBody:$,beforeLabel:$,label(t){if(this&&this.options&&"dataset"===this.options.mode)return t.label+": "+t.formattedValue||t.formattedValue;let e=t.dataset.label||"";e&&(e+=": ");const i=t.formattedValue;return U(i)||(e+=i),e},labelColor(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:$,afterBody:$,beforeFooter:$,footer:$,afterFooter:$}},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:t=>"filter"!==t&&"itemSort"!==t&&"external"!==t,_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},Ko=Object.freeze({__proto__:null,Decimation:co,Filler:Co,Legend:To,SubTitle:Io,Title:Ro,Tooltip:qo});function Go(t,e,i,s){const n=t.indexOf(e);if(-1===n)return((t,e,i,s)=>("string"==typeof e?(i=t.push(e)-1,s.unshift({index:i,label:e})):isNaN(e)&&(i=null),i))(t,e,i,s);return n!==t.lastIndexOf(e)?i:n}class Zo extends Ns{constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const t=this.getLabels();for(const{index:i,label:s}of e)t[i]===s&&t.splice(i,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(U(t))return null;const i=this.getLabels();return((t,e)=>null===t?null:Qt(Math.round(t),0,e))(e=isFinite(e)&&i[e]===t?e:Go(i,t,Z(e,t),this._addedLabels),i.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:i,max:s}=this.getMinMax(!0);"ticks"===this.options.bounds&&(t||(i=0),e||(s=this.getLabels().length-1)),this.min=i,this.max=s}buildTicks(){const t=this.min,e=this.max,i=this.options.offset,s=[];let n=this.getLabels();n=0===t&&e===n.length-1?n:n.slice(t,e+1),this._valueRange=Math.max(n.length-(i?0:1),1),this._startValue=this.min-(i?.5:0);for(let i=t;i<=e;i++)s.push({value:i});return s}getLabelForValue(t){const e=this.getLabels();return t>=0&&t<e.length?e[t]:t}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return"number"!=typeof t&&(t=this.parse(t)),null===t?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}}function Jo(t,e,{horizontal:i,minRotation:s}){const n=Yt(s),o=(i?Math.sin(n):Math.cos(n))||.001,a=.75*e*(""+t).length;return Math.min(e/o,a)}Zo.id="category",Zo.defaults={ticks:{callback:Zo.prototype.getLabelForValue}};class Qo extends Ns{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return U(t)||("number"==typeof t||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:i}=this.getUserBounds();let{min:s,max:n}=this;const o=t=>s=e?s:t,a=t=>n=i?n:t;if(t){const t=Bt(s),e=Bt(n);t<0&&e<0?a(0):t>0&&e>0&&o(0)}if(s===n){let e=1;(n>=Number.MAX_SAFE_INTEGER||s<=Number.MIN_SAFE_INTEGER)&&(e=Math.abs(.05*n)),a(n+e),t||o(s-e)}this.min=s,this.max=n}getTickLimit(){const t=this.options.ticks;let e,{maxTicksLimit:i,stepSize:s}=t;return s?(e=Math.ceil(this.max/s)-Math.floor(this.min/s)+1,e>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${e} ticks. Limiting to 1000.`),e=1e3)):(e=this.computeTickLimit(),i=i||11),i&&(e=Math.min(i,e)),e}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let i=this.getTickLimit();i=Math.max(2,i);const s=function(t,e){const i=[],{bounds:s,step:n,min:o,max:a,precision:r,count:l,maxTicks:h,maxDigits:c,includeBounds:d}=t,u=n||1,f=h-1,{min:g,max:p}=e,m=!U(o),b=!U(a),x=!U(l),_=(p-g)/(c+1);let y,v,w,M,k=Vt((p-g)/f/u)*u;if(k<1e-14&&!m&&!b)return[{value:g},{value:p}];M=Math.ceil(p/k)-Math.floor(g/k),M>f&&(k=Vt(M*k/f/u)*u),U(r)||(y=Math.pow(10,r),k=Math.ceil(k*y)/y),"ticks"===s?(v=Math.floor(g/k)*k,w=Math.ceil(p/k)*k):(v=g,w=p),m&&b&&n&&Ht((a-o)/n,k/1e3)?(M=Math.round(Math.min((a-o)/k,h)),k=(a-o)/M,v=o,w=a):x?(v=m?o:v,w=b?a:w,M=l-1,k=(w-v)/M):(M=(w-v)/k,M=jt(M,Math.round(M),k/1e3)?Math.round(M):Math.ceil(M));const S=Math.max(Xt(k),Xt(v));y=Math.pow(10,U(r)?S:r),v=Math.round(v*y)/y,w=Math.round(w*y)/y;let P=0;for(m&&(d&&v!==o?(i.push({value:o}),v<o&&P++,jt(Math.round((v+P*k)*y)/y,o,Jo(o,_,t))&&P++):v<o&&P++);P<M;++P)i.push({value:Math.round((v+P*k)*y)/y});return b&&d&&w!==a?i.length&&jt(i[i.length-1].value,a,Jo(a,_,t))?i[i.length-1].value=a:i.push({value:a}):b&&w!==a||i.push({value:w}),i}({maxTicks:i,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:!1!==e.includeBounds},this._range||this);return"ticks"===t.bounds&&$t(s,this,"value"),t.reverse?(s.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),s}configure(){const t=this.ticks;let e=this.min,i=this.max;if(super.configure(),this.options.offset&&t.length){const s=(i-e)/Math.max(t.length-1,1)/2;e-=s,i+=s}this._startValue=e,this._endValue=i,this._valueRange=i-e}getLabelForValue(t){return oi(t,this.chart.options.locale,this.options.ticks.format)}}class ta extends Qo{determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=K(t)?t:0,this.max=K(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,i=Yt(this.options.ticks.minRotation),s=(t?Math.sin(i):Math.cos(i))||.001,n=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,n.lineHeight/s))}getPixelForValue(t){return null===t?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}function ea(t){return 1===t/Math.pow(10,Math.floor(Ft(t)))}ta.id="linear",ta.defaults={ticks:{callback:Ls.formatters.numeric}};class ia extends Ns{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const i=Qo.prototype.parse.apply(this,[t,e]);if(0!==i)return K(i)&&i>0?i:null;this._zero=!0}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=K(t)?Math.max(0,t):null,this.max=K(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let i=this.min,s=this.max;const n=e=>i=t?i:e,o=t=>s=e?s:t,a=(t,e)=>Math.pow(10,Math.floor(Ft(t))+e);i===s&&(i<=0?(n(1),o(10)):(n(a(i,-1)),o(a(s,1)))),i<=0&&n(a(s,-1)),s<=0&&o(a(i,1)),this._zero&&this.min!==this._suggestedMin&&i===a(this.min,0)&&n(a(i,-1)),this.min=i,this.max=s}buildTicks(){const t=this.options,e=function(t,e){const i=Math.floor(Ft(e.max)),s=Math.ceil(e.max/Math.pow(10,i)),n=[];let o=G(t.min,Math.pow(10,Math.floor(Ft(e.min)))),a=Math.floor(Ft(o)),r=Math.floor(o/Math.pow(10,a)),l=a<0?Math.pow(10,Math.abs(a)):1;do{n.push({value:o,major:ea(o)}),++r,10===r&&(r=1,++a,l=a>=0?1:l),o=Math.round(r*Math.pow(10,a)*l)/l}while(a<i||a===i&&r<s);const h=G(t.max,o);return n.push({value:h,major:ea(o)}),n}({min:this._userMin,max:this._userMax},this);return"ticks"===t.bounds&&$t(e,this,"value"),t.reverse?(e.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),e}getLabelForValue(t){return void 0===t?"0":oi(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=Ft(t),this._valueRange=Ft(this.max)-Ft(t)}getPixelForValue(t){return void 0!==t&&0!==t||(t=this.min),null===t||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(Ft(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}function sa(t){const e=t.ticks;if(e.display&&t.display){const t=ui(e.backdropPadding);return Z(e.font&&e.font.size,yt.font.size)+t.height}return 0}function na(t,e,i,s,n){return t===s||t===n?{start:e-i/2,end:e+i/2}:t<s||t>n?{start:e-i,end:e}:{start:e,end:e+i}}function oa(t){const e={l:t.left+t._padding.left,r:t.right-t._padding.right,t:t.top+t._padding.top,b:t.bottom-t._padding.bottom},i=Object.assign({},e),s=[],n=[],o=t._pointLabels.length,a=t.options.pointLabels,r=a.centerPointLabels?Ot/o:0;for(let d=0;d<o;d++){const o=a.setContext(t.getPointLabelContext(d));n[d]=o.padding;const u=t.getPointPosition(d,t.drawingArea+n[d],r),f=fi(o.font),g=(l=t.ctx,h=f,c=X(c=t._pointLabels[d])?c:[c],{w:be(l,h.string,c),h:c.length*h.lineHeight});s[d]=g;const p=Zt(t.getIndexAngle(d)+r),m=Math.round(Ut(p));aa(i,e,p,na(m,u.x,g.w,0,180),na(m,u.y,g.h,90,270))}var l,h,c;t.setCenterPoint(e.l-i.l,i.r-e.r,e.t-i.t,i.b-e.b),t._pointLabelItems=function(t,e,i){const s=[],n=t._pointLabels.length,o=t.options,a=sa(o)/2,r=t.drawingArea,l=o.pointLabels.centerPointLabels?Ot/n:0;for(let o=0;o<n;o++){const n=t.getPointPosition(o,r+a+i[o],l),h=Math.round(Ut(Zt(n.angle+Et))),c=e[o],d=ha(n.y,c.h,h),u=ra(h),f=la(n.x,c.w,u);s.push({x:n.x,y:d,textAlign:u,left:f,top:d,right:f+c.w,bottom:d+c.h})}return s}(t,s,n)}function aa(t,e,i,s,n){const o=Math.abs(Math.sin(i)),a=Math.abs(Math.cos(i));let r=0,l=0;s.start<e.l?(r=(e.l-s.start)/o,t.l=Math.min(t.l,e.l-r)):s.end>e.r&&(r=(s.end-e.r)/o,t.r=Math.max(t.r,e.r+r)),n.start<e.t?(l=(e.t-n.start)/a,t.t=Math.min(t.t,e.t-l)):n.end>e.b&&(l=(n.end-e.b)/a,t.b=Math.max(t.b,e.b+l))}function ra(t){return 0===t||180===t?"center":t<180?"left":"right"}function la(t,e,i){return"right"===i?t-=e:"center"===i&&(t-=e/2),t}function ha(t,e,i){return 90===i||270===i?t-=e/2:(i>270||i<90)&&(t-=e),t}function ca(t,e,i,s){const{ctx:n}=t;if(i)n.arc(t.xCenter,t.yCenter,e,0,At);else{let i=t.getPointPosition(0,e);n.moveTo(i.x,i.y);for(let o=1;o<s;o++)i=t.getPointPosition(o,e),n.lineTo(i.x,i.y)}}ia.id="logarithmic",ia.defaults={ticks:{callback:Ls.formatters.logarithmic,major:{enabled:!0}}};class da extends Qo{constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=ui(sa(this.options)/2),e=this.width=this.maxWidth-t.width,i=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+i/2+t.top),this.drawingArea=Math.floor(Math.min(e,i)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=K(t)&&!isNaN(t)?t:0,this.max=K(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/sa(this.options))}generateTickLabels(t){Qo.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map(((t,e)=>{const i=tt(this.options.pointLabels.callback,[t,e],this);return i||0===i?i:""})).filter(((t,e)=>this.chart.getDataVisibility(e)))}fit(){const t=this.options;t.display&&t.pointLabels.display?oa(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,i,s){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((i-s)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,i,s))}getIndexAngle(t){return Zt(t*(At/(this._pointLabels.length||1))+Yt(this.options.startAngle||0))}getDistanceFromCenterForValue(t){if(U(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(U(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const i=e[t];return function(t,e,i){return mi(t,{label:i,index:e,type:"pointLabel"})}(this.getContext(),t,i)}}getPointPosition(t,e,i=0){const s=this.getIndexAngle(t)-Et+i;return{x:Math.cos(s)*e+this.xCenter,y:Math.sin(s)*e+this.yCenter,angle:s}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:i,right:s,bottom:n}=this._pointLabelItems[t];return{left:e,top:i,right:s,bottom:n}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const i=this.ctx;i.save(),i.beginPath(),ca(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),i.closePath(),i.fillStyle=t,i.fill(),i.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:i,grid:s}=e,n=this._pointLabels.length;let o,a,r;if(e.pointLabels.display&&function(t,e){const{ctx:i,options:{pointLabels:s}}=t;for(let n=e-1;n>=0;n--){const e=s.setContext(t.getPointLabelContext(n)),o=fi(e.font),{x:a,y:r,textAlign:l,left:h,top:c,right:d,bottom:u}=t._pointLabelItems[n],{backdropColor:f}=e;if(!U(f)){const t=di(e.borderRadius),s=ui(e.backdropPadding);i.fillStyle=f;const n=h-s.left,o=c-s.top,a=d-h+s.width,r=u-c+s.height;Object.values(t).some((t=>0!==t))?(i.beginPath(),Oe(i,{x:n,y:o,w:a,h:r,radius:t}),i.fill()):i.fillRect(n,o,a,r)}De(i,t._pointLabels[n],a,r+o.lineHeight/2,o,{color:e.color,textAlign:l,textBaseline:"middle"})}}(this,n),s.display&&this.ticks.forEach(((t,e)=>{if(0!==e){a=this.getDistanceFromCenterForValue(t.value);!function(t,e,i,s){const n=t.ctx,o=e.circular,{color:a,lineWidth:r}=e;!o&&!s||!a||!r||i<0||(n.save(),n.strokeStyle=a,n.lineWidth=r,n.setLineDash(e.borderDash),n.lineDashOffset=e.borderDashOffset,n.beginPath(),ca(t,i,o,s),n.closePath(),n.stroke(),n.restore())}(this,s.setContext(this.getContext(e-1)),a,n)}})),i.display){for(t.save(),o=n-1;o>=0;o--){const s=i.setContext(this.getPointLabelContext(o)),{color:n,lineWidth:l}=s;l&&n&&(t.lineWidth=l,t.strokeStyle=n,t.setLineDash(s.borderDash),t.lineDashOffset=s.borderDashOffset,a=this.getDistanceFromCenterForValue(e.ticks.reverse?this.min:this.max),r=this.getPointPosition(o,a),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(r.x,r.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,i=e.ticks;if(!i.display)return;const s=this.getIndexAngle(0);let n,o;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(s),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach(((s,a)=>{if(0===a&&!e.reverse)return;const r=i.setContext(this.getContext(a)),l=fi(r.font);if(n=this.getDistanceFromCenterForValue(this.ticks[a].value),r.showLabelBackdrop){t.font=l.string,o=t.measureText(s.label).width,t.fillStyle=r.backdropColor;const e=ui(r.backdropPadding);t.fillRect(-o/2-e.left,-n-l.size/2-e.top,o+e.width,l.size+e.height)}De(t,s.label,0,-n,l,{color:r.color})})),t.restore()}drawTitle(){}}da.id="radialLinear",da.defaults={display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:Ls.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback:t=>t,padding:5,centerPointLabels:!1}},da.defaultRoutes={"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"},da.descriptors={angleLines:{_fallback:"grid"}};const ua={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},fa=Object.keys(ua);function ga(t,e){return t-e}function pa(t,e){if(U(e))return null;const i=t._adapter,{parser:s,round:n,isoWeekday:o}=t._parseOpts;let a=e;return"function"==typeof s&&(a=s(a)),K(a)||(a="string"==typeof s?i.parse(a,s):i.parse(a)),null===a?null:(n&&(a="week"!==n||!Nt(o)&&!0!==o?i.startOf(a,n):i.startOf(a,"isoWeek",o)),+a)}function ma(t,e,i,s){const n=fa.length;for(let o=fa.indexOf(t);o<n-1;++o){const t=ua[fa[o]],n=t.steps?t.steps:Number.MAX_SAFE_INTEGER;if(t.common&&Math.ceil((i-e)/(n*t.size))<=s)return fa[o]}return fa[n-1]}function ba(t,e,i){if(i){if(i.length){const{lo:s,hi:n}=vt(i,e);t[i[s]>=e?i[s]:i[n]]=!0}}else t[e]=!0}function xa(t,e,i){const s=[],n={},o=e.length;let a,r;for(a=0;a<o;++a)r=e[a],n[r]=a,s.push({value:r,major:!1});return 0!==o&&i?function(t,e,i,s){const n=t._adapter,o=+n.startOf(e[0].value,s),a=e[e.length-1].value;let r,l;for(r=o;r<=a;r=+n.add(r,1,s))l=i[r],l>=0&&(e[l].major=!0);return e}(t,s,n,i):s}class _a extends Ns{constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e){const i=t.time||(t.time={}),s=this._adapter=new _n._date(t.adapters.date);rt(i.displayFormats,s.formats()),this._parseOpts={parser:i.parser,round:i.round,isoWeekday:i.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return void 0===t?null:pa(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,i=t.time.unit||"day";let{min:s,max:n,minDefined:o,maxDefined:a}=this.getUserBounds();function r(t){o||isNaN(t.min)||(s=Math.min(s,t.min)),a||isNaN(t.max)||(n=Math.max(n,t.max))}o&&a||(r(this._getLabelBounds()),"ticks"===t.bounds&&"labels"===t.ticks.source||r(this.getMinMax(!1))),s=K(s)&&!isNaN(s)?s:+e.startOf(Date.now(),i),n=K(n)&&!isNaN(n)?n:+e.endOf(Date.now(),i)+1,this.min=Math.min(s,n-1),this.max=Math.max(s+1,n)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],i=t[t.length-1]),{min:e,max:i}}buildTicks(){const t=this.options,e=t.time,i=t.ticks,s="labels"===i.source?this.getLabelTimestamps():this._generate();"ticks"===t.bounds&&s.length&&(this.min=this._userMin||s[0],this.max=this._userMax||s[s.length-1]);const n=this.min,o=kt(s,n,this.max);return this._unit=e.unit||(i.autoSkip?ma(e.minUnit,this.min,this.max,this._getLabelCapacity(n)):function(t,e,i,s,n){for(let o=fa.length-1;o>=fa.indexOf(i);o--){const i=fa[o];if(ua[i].common&&t._adapter.diff(n,s,i)>=e-1)return i}return fa[i?fa.indexOf(i):0]}(this,o.length,e.minUnit,this.min,this.max)),this._majorUnit=i.major.enabled&&"year"!==this._unit?function(t){for(let e=fa.indexOf(t)+1,i=fa.length;e<i;++e)if(ua[fa[e]].common)return fa[e]}(this._unit):void 0,this.initOffsets(s),t.reverse&&o.reverse(),xa(this,o,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map((t=>+t.value)))}initOffsets(t){let e,i,s=0,n=0;this.options.offset&&t.length&&(e=this.getDecimalForValue(t[0]),s=1===t.length?1-e:(this.getDecimalForValue(t[1])-e)/2,i=this.getDecimalForValue(t[t.length-1]),n=1===t.length?i:(i-this.getDecimalForValue(t[t.length-2]))/2);const o=t.length<3?.5:.25;s=Qt(s,0,o),n=Qt(n,0,o),this._offsets={start:s,end:n,factor:1/(s+1+n)}}_generate(){const t=this._adapter,e=this.min,i=this.max,s=this.options,n=s.time,o=n.unit||ma(n.minUnit,e,i,this._getLabelCapacity(e)),a=Z(n.stepSize,1),r="week"===o&&n.isoWeekday,l=Nt(r)||!0===r,h={};let c,d,u=e;if(l&&(u=+t.startOf(u,"isoWeek",r)),u=+t.startOf(u,l?"day":o),t.diff(i,e,o)>1e5*a)throw new Error(e+" and "+i+" are too far apart with stepSize of "+a+" "+o);const f="data"===s.ticks.source&&this.getDataTimestamps();for(c=u,d=0;c<i;c=+t.add(c,a,o),d++)ba(h,c,f);return c!==i&&"ticks"!==s.bounds&&1!==d||ba(h,c,f),Object.keys(h).sort(((t,e)=>t-e)).map((t=>+t))}getLabelForValue(t){const e=this._adapter,i=this.options.time;return i.tooltipFormat?e.format(t,i.tooltipFormat):e.format(t,i.displayFormats.datetime)}_tickFormatFunction(t,e,i,s){const n=this.options,o=n.time.displayFormats,a=this._unit,r=this._majorUnit,l=a&&o[a],h=r&&o[r],c=i[e],d=r&&h&&c&&c.major,u=this._adapter.format(t,s||(d?h:l)),f=n.ticks.callback;return f?tt(f,[u,e,i],this):u}generateTickLabels(t){let e,i,s;for(e=0,i=t.length;e<i;++e)s=t[e],s.label=this._tickFormatFunction(s.value,e,t)}getDecimalForValue(t){return null===t?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,i=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+i)*e.factor)}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+i*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,i=this.ctx.measureText(t).width,s=Yt(this.isHorizontal()?e.maxRotation:e.minRotation),n=Math.cos(s),o=Math.sin(s),a=this._resolveTickFontOptions(0).size;return{w:i*n+a*o,h:i*o+a*n}}_getLabelCapacity(t){const e=this.options.time,i=e.displayFormats,s=i[e.unit]||i.millisecond,n=this._tickFormatFunction(t,0,xa(this,[t],this._majorUnit),s),o=this._getLabelSize(n),a=Math.floor(this.isHorizontal()?this.width/o.w:this.height/o.h)-1;return a>0?a:1}getDataTimestamps(){let t,e,i=this._cache.data||[];if(i.length)return i;const s=this.getMatchingVisibleMetas();if(this._normalized&&s.length)return this._cache.data=s[0].controller.getAllParsedValues(this);for(t=0,e=s.length;t<e;++t)i=i.concat(s[t].controller.getAllParsedValues(this));return this._cache.data=this.normalize(i)}getLabelTimestamps(){const t=this._cache.labels||[];let e,i;if(t.length)return t;const s=this.getLabels();for(e=0,i=s.length;e<i;++e)t.push(pa(this,s[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return Ct(t.sort(ga))}}function ya(t,e,i){let s,n,o,a,r=0,l=t.length-1;i?(e>=t[r].pos&&e<=t[l].pos&&({lo:r,hi:l}=wt(t,"pos",e)),({pos:s,time:o}=t[r]),({pos:n,time:a}=t[l])):(e>=t[r].time&&e<=t[l].time&&({lo:r,hi:l}=wt(t,"time",e)),({time:s,pos:o}=t[r]),({time:n,pos:a}=t[l]));const h=n-s;return h?o+(a-o)*(e-s)/h:o}_a.id="time",_a.defaults={bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",major:{enabled:!1}}};class va extends _a{constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=ya(e,this.min),this._tableRange=ya(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:i}=this,s=[],n=[];let o,a,r,l,h;for(o=0,a=t.length;o<a;++o)l=t[o],l>=e&&l<=i&&s.push(l);if(s.length<2)return[{time:e,pos:0},{time:i,pos:1}];for(o=0,a=s.length;o<a;++o)h=s[o+1],r=s[o-1],l=s[o],Math.round((h+r)/2)!==l&&n.push({time:l,pos:o/(a-1)});return n}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),i=this.getLabelTimestamps();return t=e.length&&i.length?this.normalize(e.concat(i)):e.length?e:i,t=this._cache.all=t,t}getDecimalForValue(t){return(ya(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return ya(this._table,i*this._tableRange+this._minPos,!0)}}va.id="timeseries",va.defaults=_a.defaults;var wa=Object.freeze({__proto__:null,CategoryScale:Zo,LinearScale:ta,LogarithmicScale:ia,RadialLinearScale:da,TimeScale:_a,TimeSeriesScale:va});return gn.register(zn,wa,ro,Ko),gn.helpers={...Ci},gn._adapters=_n,gn.Animation=ps,gn.Animations=bs,gn.animator=a,gn.controllers=Hs.controllers.items,gn.DatasetController=Os,gn.Element=As,gn.elements=ro,gn.Interaction=Ii,gn.layouts=qi,gn.platforms=us,gn.Scale=Ns,gn.Ticks=Ls,Object.assign(gn,zn,wa,ro,Ko,us),gn.Chart=gn,"undefined"!=typeof window&&(window.Chart=gn),gn}));
;
////////////////////////////////
// Author: Bora DAN — http://codecanyon.net/user/bqra
// 14 December 2018
// E-mail: bora_dan@hotmail.com
// Twitter: http://twitter.com/bqra
// Dribbble: http://dribbble.com/bqra
// Website: http://pikselmatik.com
// Version: 1.7
////////////////////////////////
(function($) {
    $.fn.jalendar = function(options) {
        var settings = $.extend({
            customDay: new Date(),
            color: "#3aa4d1",
            color2: "",
            lang: "EN",
            type: "",
            customUrl: "#",
            dateType: "dd-mm-yyyy",
            dayWithZero: true,
            monthWithZero: true,
            sundayStart: false,
            dayColor: null,
            titleColor: null,
            weekColor: null,
            todayColor: null,
            selectingBeforeToday: false,
            selectingAfterToday: false,
            done: null,
            move: null // MODIFIED: Rebuild
        }, options);
        // Languages            
        var dayNames = {};
        var monthNames = {};
        var lEvent = {};
        var lClose = {}; 

        dayNames.EN = new Array("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");
        dayNames.TR = new Array("Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Pzr");
        dayNames.ES = new Array("Lun", "Mar", "Mié", "Jue", "Vie", "Såb", "Dom");
        dayNames.DE = new Array("Mon", "Die", "Mit", "Don", "Fre", "Sam", "Son");
        dayNames.FR = new Array("Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim");
        dayNames.IT = new Array("Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dim");
        dayNames.FIL = new Array("Lun", "Mar", "Miy", "Huw", "Biy", "Sab", "Lin");
        dayNames.RU = new Array("Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс");
        dayNames.NL = new Array("Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo");
        dayNames.ZH = new Array("星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天");
        dayNames.HI = new Array("रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार");
        dayNames.PT = new Array("Se", "Te", "Qu", "Qu", "Se", "Sa", "Do");
        dayNames.PL = new Array("po", "wt", "sr", "cz", "pi", "so", "ni");

        monthNames.EN = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        monthNames.TR = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
        monthNames.ES = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        monthNames.DE = new Array("Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
        monthNames.FR = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aoút", "Septembre", "Octobre", "Novembre", "Décembre");
        monthNames.IT = new Array("Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Guigno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre");
        monthNames.FIL = new Array("Enero", "Pebrero", "Marso", "Abril", "Mayo", "Hunyo", "Hulyo", "Agosto", "Setyembre", "Oktubre", "Nobyembre", "Disyembre");
        monthNames.RU = new Array("Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь");
        monthNames.NL = new Array("januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december");
        monthNames.ZH = new Array("一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月");
        monthNames.HI = new Array("जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर");
        monthNames.PT = new Array("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro");
        monthNames.PL = new Array("styczen", "luty", "marzec", "kwiecien", "maj", "czerwiec", "lipiec", "sierpien", "wrzesien", "pazdziernik", "listopad", "grudzien");

        lEvent.EN = "Event(s)";
        lEvent.TR = "Etkinlik";
        lEvent.ES = "Evento(s)";
        lEvent.DE = "Tätigkeit";
        lEvent.FR = "Activité(s)";
        lEvent.IT = "Attività";
        lEvent.FIL = "Aktibidad";
        lEvent.RU = "Деятельность";
        lEvent.NL = "Activiteit(en)";
        lEvent.ZH = "事件";
        lEvent.HI = "परिणाम";
        lEvent.PT = "Eventos";
        lEvent.PL = "Działalność";
        
        lClose.EN = "Close";
        lClose.TR = "Kapat";
        lClose.ES = "Cerrar";
        lClose.DE = "Schließen";
        lClose.FR = "Fermer";
        lClose.IT = "Chiudere";
        lClose.FIL = "Isara";
        lClose.RU = "Закрывать";
        lClose.NL = "Sluiten";
        lClose.ZH = "關閉";
        lClose.HI = "बंद करे";
        lClose.PT = "Fechar";
        lClose.PL = "Zamknąć";

        var bt = new Date(),
        btDate = bt.getDate(),
        btMonth = bt.getMonth(),
        btYear = bt.getFullYear();

        var $this = $(this);
        var div = function(e, classN) {
            return $(document.createElement(e)).addClass(classN);
        };
        // HTML Tree
        var color2 = settings.color2 === "" ? settings.color : settings.color2;
        $this.append($('<input type="hidden" class="data1" /><input type="hidden" class="data2" />'), div("div", "jalendar-container").append(div("div", "jalendar-pages").append(div("div", "header").append(div("a", "prv-m").append(div("i", "fa fa-angle-left")), div("h1"), div("a", "nxt-m").append(div("i", "fa fa-angle-right")), div("div", "day-names")), div("div", "days"), div("div", "add-event").append(div("div", "events").append(div("h3", "").html("<span></span> " + lEvent[settings.lang]), div("div", "events-list")), div("div", "close-button").text(lClose[settings.lang]))).attr("style", "background-color:" + settings.color + "; background: -webkit-gradient(linear, left top, left bottom, from(" + settings.color + "), to(" + color2 + ")); background: -webkit-linear-gradient(top, " + settings.color + ", " + color2 + "); background : -moz-linear-gradient(top, " + settings.color + ", " + color2 + "); background: -ms-linear-gradient(top, " + settings.color + ", " + color2 + "); background: -o-linear-gradient(top, " + settings.color + ", " + color2 + ");")));
        if (settings.type == "range") {
            $this.find(".jalendar-pages").addClass("range").append(div("input", "first-range-data").attr({
                type: "hidden"
            }), div("input", "last-range-data").attr({
                type: "hidden"
            }));
        }
        // Adding day boxes
        for (var i = 0; i < 42; i++) {
            $this.find(".days").append(div("div", "day"));
        }
        // Adding day names fields
        var sunday = 0;
        if ( settings.sundayStart == true ) {
            $this.find(".day-names").append(div("h2").text(dayNames[settings.lang][6])); 
            sunday = 1;
        }
        for (var i = sunday; i < 7; i++) {
            $this.find(".day-names").append(div("h2").text(dayNames[settings.lang][i-sunday]));
        }
        var d = new Date(settings.customDay);
        var year = d.getFullYear();
        var date = d.getDate();
        var month = d.getMonth();
        var isLeapYear = function(year1) {
            var f = new Date();
            f.setYear(year1);
            f.setMonth(1);
            f.setDate(29);
            return f.getDate() == 29;
        };
        var feb;
        var febCalc = function(feb) {
            if (isLeapYear(year) === true) {
                feb = 29;
            } else {
                feb = 28;
            }
            return feb;
        };
        var monthDays = new Array(31, febCalc(feb), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        var firstRangeIndex = null, lastRangeIndex = null, firstRangeMonthIndex = null, lastRangeMonthIndex = null, firstRangeYearIndex = null, lastRangeYearIndex = null;
        function calcMonth() {
            monthDays[1] = febCalc(feb);
            var weekStart = new Date();
            weekStart.setFullYear(year, month, 0);
            var startDay = weekStart.getDay() + sunday;
            $this.find(".header h1").html(monthNames[settings.lang][month] + " " + year + '<div class="total-bar"></div>');
            $this.find(".day").html("&nbsp;").removeAttr("data-date").removeClass("this-month have-event disable-selecting");
            for (var i = 0; i < 42 - (startDay + monthDays[month]); i++) {
                $this.find(".day").eq(startDay + monthDays[month] + i ).html("<span>" + (i + 1) + "</span>");
            }
            for (var i = 0; i < startDay; i++) {
                var december = monthDays[month - 1] == undefined ? monthDays[11] : monthDays[month - 1];
                $this.find(".day").eq(i).html("<span>" + (december - startDay + (i + 1)) + "</span>");
            }
            for (var i = 1; i <= monthDays[month]; i++) {
                startDay++;
                var dateTypeUse;
                var monthWZero = (month + 1);

                if (settings.dayWithZero === true)
                    i = i < 10 ? '0' + i : i;

                if (settings.monthWithZero === true)
                    monthWZero = month < 9 ? '0' + (month + 1) : (month + 1);

                if (settings.dateType == "dd-mm-yyyy") {
                    dateTypeUse = i + "-" + monthWZero + "-" + year;
                } else if (settings.dateType == "mm-dd-yyyy") {
                    dateTypeUse = monthWZero + "-" + i + "-" + year;
                } else if (settings.dateType == "yyyy-mm-dd") {
                    dateTypeUse = year + "-" + monthWZero + "-" + i;
                } else if (settings.dateType == "yyyy-dd-mm") {
                    dateTypeUse = year + "-" + i + "-" + monthWZero;
                }
                if (settings.type == "linker") {
                    $this.find(".day").eq(startDay - 1).addClass("this-month").attr("data-date", dateTypeUse).html('<span><a href="' + settings.customUrl + dateTypeUse + '">' + i + "</a></span>");
                } else {
                    $this.find(".day").eq(startDay - 1).addClass("this-month").attr("data-date", dateTypeUse).html("<span>" + i + "</span>");
                }

                var btShowingDates = (Math.round(new Date(year + '/' + (month+1) + '/' + i + ' 00:00:00').getTime()/1000));
                var btToday = (Math.round(new Date(btYear + '/' + (btMonth+1) + '/' + btDate + ' 00:00:00').getTime()/1000));

                if ( settings.selectingBeforeToday == true ) {
                    if ( btShowingDates > btToday ) {
                        $this.find(".day").eq(startDay - 1).addClass("disable-selecting");
                    }
                }

                if ( settings.selectingAfterToday == true ) {
                    if ( btShowingDates < btToday ) {
                        $this.find(".day").eq(startDay - 1).addClass("disable-selecting");
                    }
                }

                $this.find(".days").attr("data-month", monthWZero).attr("data-year", year);
            }
            if (month == d.getMonth() && year == d.getFullYear() ) {
                $this.find(".day.this-month").removeClass("today").eq(date - 1).addClass("today");
            } else {
                $this.find(".day.this-month").removeClass("today").attr("style", "");
            }
            // added event
            $this.find(".added-event").each(function(i) {
                $(this).attr("data-id", i);
                $this.find('.this-month[data-date="' + $(this).attr("data-date") + '"]').addClass("have-event " + $(this).data('type')).append(
                    div("div", "event-single").attr("data-id", i).append(
                        div("a", "").attr('href', $(this).attr('data-link')).attr('target', 'blank').addClass($(this).data('type')).text($(this).attr("data-title"))
                    )
                );
            });

            calcTotalDayAgain();
            if (settings.dayColor !== null ) {
                $this.find(".day span, .day span a").css({
                    color: settings.dayColor
                });
            }
            if (settings.titleColor !== null ) {
                $this.find(".header h1, .header .prv-m, .header .nxt-m, .event-single p, h3, .close-button").css({
                    color: settings.titleColor
                });
            }
            if (settings.weekColor !== null ) {
                $this.find("h2").css({
                    color: settings.weekColor
                });
            }
            if (settings.todayColor !== null ) {
                $this.find(".day.this-month.today span, .day.this-month.today span a").css({
                    color: settings.todayColor
                });
            }
            if (settings.color == "#fff" || settings.color == "#ffffff" || settings.color == "white") {
                $this.find(".header h1, .header .prv-m, .header .nxt-m, .day.today span, h2, .event-single p, h3, .close-button").css({
                    "text-shadow": "none"
                });
            }

            // MODIFIED: Rebuild
            if (settings.move !== null) {
                settings.move.call(this, year, month + 1);
            }
        }
        calcMonth();
        var arrows = new Array($this.find(".prv-m"), $this.find(".nxt-m"));
        var $close = $this.find(".jalendar .close-button");
        // Calculate total event again
        function calcTotalDayAgain() {
            var eventCount = $this.find(".this-month .event-single").length;
            if (eventCount == 0) {
                $this.find(".total-bar").hide(0);
            }
            $this.find(".total-bar").text(eventCount);
            $this.find(".events h3 span").text($(".jalendar .day.selected .event-single").length);
        }
        function prevAddEvent() {
            $this.find(".day").removeClass("selected").removeAttr("style");
            $this.find(".add-event").removeClass("selected").height(0);
        }
        function isFirstIndexNull() {
            $this.find(".day").removeClass("first-range range last-range");
            if (firstRangeIndex !== null ) {
                if ($this.find('[data-date="' + rangeFirstRange.val() + '"]').length == 0) {
                        
                    if (firstRangeMonthIndex < Number($this.find(".days").attr("data-month")) && firstRangeYearIndex >= Number($this.find(".days").attr("data-year")) || firstRangeYearIndex < Number($this.find(".days").attr("data-year")) ) {
                        firstRangeIndex = 0;
                    } else if (firstRangeMonthIndex > Number($this.find(".days").attr("data-month")) && firstRangeYearIndex <= Number($this.find(".days").attr("data-year")) || firstRangeYearIndex > Number($this.find(".days").attr("data-year"))) {
                        firstRangeIndex = 42;
                    }
                    if (lastRangeIndex !== null ) {
                        if (firstRangeYearIndex == lastRangeYearIndex && firstRangeMonthIndex == lastRangeMonthIndex) {
                            return false;
                        }
                        var nowYear = parseInt($this.find(".days").attr("data-year"), 10), nowMonth = parseInt($this.find(".days").attr("data-month"), 10);
                        if (firstRangeYearIndex < nowYear && lastRangeYearIndex > nowYear || lastRangeMonthIndex > nowMonth && lastRangeYearIndex >= nowYear && firstRangeYearIndex < nowYear || firstRangeMonthIndex < nowMonth && firstRangeYearIndex == nowYear && lastRangeMonthIndex > nowMonth && lastRangeYearIndex == nowYear || firstRangeMonthIndex < nowMonth && lastRangeYearIndex > nowYear && firstRangeYearIndex == nowYear || firstRangeMonthIndex < nowMonth && firstRangeYearIndex == nowYear && lastRangeMonthIndex > nowMonth && lastRangeYearIndex >= nowYear) {
                            $this.find(".day").addClass("range");
                        }
                    }
                } else {
                    firstRangeIndex = $this.find('[data-date="' + rangeFirstRange.val() + '"]').index();
                }
            }
        }
        function selectedDays() {
            $this.find('.day[data-date="' + rangeFirstRange.val() + '"]').addClass("first-range");
            $this.find('.day[data-date="' + rangeLastRange.val() + '"]').addClass("last-range");
            $this.find('.day[data-date="' + rangeFirstRange.val() + '"]').nextUntil('.day[data-date="' + rangeLastRange.val() + '"]').addClass("range");
            if ($this.find('.day[data-date="' + rangeLastRange.val() + '"]').length > 0) {
                if ($this.find(".day.first-range").length > 0) {
                    $this.find(".day.first-range").nextUntil(".day.last-range").addClass("range");
                } else {
                    $this.find(".day:eq(" + firstRangeIndex + ")").nextUntil(".day.last-range").addClass("range");
                    if (firstRangeIndex == 0)
                        $this.find(".day:eq(0)").addClass('range');
                }
            }
        }
        var rangeFirstRange = $this.find("input.first-range-data"), rangeLastRange = $this.find("input.last-range-data");
        // next month click action
        arrows[1].on("click", function() {
            if (month >= 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
            calcMonth();
            prevAddEvent();
            if (settings.type == "range") {
                isFirstIndexNull();
                selectedDays();
            }
        });
        // prev month click action
        arrows[0].on("click", function() {
            dayClick = $this.find(".this-month");
            if (month === 0) {
                month = 11;
                year--;
            } else {
                month--;
            }
            calcMonth();
            prevAddEvent();
            if (settings.type == "range") {
                isFirstIndexNull();
                selectedDays();
            }
        });
        $this.on("click", ".close-button", function(event) {
            event.preventDefault();
            $this.find(".add-event").removeClass("selected").height(0);
            $this.find(".this-month.selected").removeClass("selected");
        });
        $this.on("click", ".this-month:not(.disable-selecting)", function() {
            if (settings.type == "selector") {
                $(this).parent().find(".selected").removeClass("selected");
                $(this).addClass("selected");
                $this.find("input.data1").val($this.find('.this-month.selected').attr('data-date'));
                if ($this.parent().is(".jalendar-input")) {
                    $this.parent().find("input").removeClass("selected");
                    $this.parent(".jalendar-input").find("input").val($(this).data("date"));
                }
                if (settings.done !== null ) {
                    settings.done.call(this);
                }
                return false;
            }
            if (settings.type == "range") {
                var firstRange = $(this).parent().find(".first-range"), lastRange = $(this).parent().find(".last-range");
                function firstDateSelecting(that) {
                    that.parent().find(".day").removeClass("first-range").removeClass("range").removeClass("last-range");
                    that.addClass("first-range");
                    rangeFirstRange.val(that.attr("data-date"));
                    firstRangeIndex = $this.find('[data-date="' + $this.find(".first-range").attr("data-date") + '"]').index();
                    firstRangeMonthIndex = Number($this.find(".days").attr("data-month"));
                    firstRangeYearIndex = Number($this.find(".days").attr("data-year"));
                    lastRangeIndex = null;
                    rangeLastRange.val("");
                }
                function lastDateSelecting(that) {
                    that.addClass("last-range");
                    rangeLastRange.val(that.attr("data-date"));
                    lastRangeIndex = $this.find(".last-range").index();
                    lastRangeMonthIndex = Number($this.find(".days").attr("data-month"));
                    lastRangeYearIndex = Number($this.find(".days").attr("data-year"));
                }
                if (firstRangeIndex !== null ) {
                    if (lastRangeIndex !== null ) {
                        firstDateSelecting($(this));
                    } else {
                        if (firstRangeIndex > $(this).index()) {
                            firstDateSelecting($(this));
                            return false;
                        }
                        lastDateSelecting($(this));
                        $this.find("input.data1").val(rangeFirstRange.val());
                        $this.find("input.data2").val(rangeLastRange.val());
                        if ($this.parent().is(".jalendar-input")) {
                            $this.parent().find("input").removeClass("selected");
                            $this.parent(".jalendar-input").find("input").val($this.find("input.data1").val() + ", " + $this.find("input.data2").val());
                        }
                        if (settings.done !== null ) {
                            settings.done.call(this);
                        }
                    }
                } else {
                    firstDateSelecting($(this));
                }
                $this.on({
                    mouseenter: function() {

                        if (firstRangeIndex === null) {
                            return false;
                        }
                        if (rangeLastRange.val() === "") {
                            $this.find(".day").removeClass("range last-range");
                            if ($(this).index() > firstRangeIndex) {
                                if ($(this).hasClass("this-month")) {
                                    $(this).addClass("last-range");
                                    $(this).parent().find(".day:eq(" + firstRangeIndex + ")").nextUntil(".this-month.last-range").addClass("range");
                                    if (firstRangeIndex == 0)
                                        $(this).parent().find(".day:eq(0)").addClass('range');
                                }
                            }
                        }
                    },
                    mouseleave: function() {
                        if (rangeLastRange.val() === "") {
                            $(this).parent().find(".day").removeClass("last-range").removeClass("range");
                        }
                    }
                }, ".range .day.this-month");
                return false;
            }
            var eventSingle = $(this).find(".event-single");
            $this.find(".events .event-single").remove();
            prevAddEvent();
            if (settings.type === "") {
                $this.find("input.data1").val($(this).data("date"));
                $(this).addClass("selected");
                $this.find(".add-event").find(".events-list").html(eventSingle.clone());
                if ($this.parent().is(".jalendar-input")) {
                    $this.parent(".jalendar-input").find("input").val($(this).data("date"));
                }
                if ($this.find(".events .event-single").length >= 0) {
                    $this.find(".events h3 span").html($this.find(".events .event-single").size());
                }
                $this.find(".add-event").addClass("selected").height($this.find(".add-event .events").height() + 59);
            }
        });
        if ($this.parent().is(".jalendar-input")) {
            $this.parent(".jalendar-input").find('input[type="text"], .jalendar').on("click", function(event) {
                event.stopPropagation();
                $(this).addClass("selected");
            });
        }
        $("html").on("click", function() {
            $(".jalendar-input input").removeClass("selected");
        });
    };
})(jQuery);;
(function ($, Drupal, window, document) {
  'use strict'

  window.themeCustom = {
    resizeTimer: null,

    headerMobile: function () {
      // Donate button
      let wrapper = $('#mobile-nav-toggle-wrapper')
      if (wrapper.length > 0) {
        if ($('body.section-en').length > 0) {
          wrapper.prepend('<a href="/en/civicrm/contribute/transact?reset=1&id=18" class="btn-donate">Donate</a>')
        } else {
          wrapper.prepend('<a href="/donate" class="btn-donate">立即捐款</a>')
        }
      }

      // Menu open background
      $('#mobile-nav-toggle').on('click', function () {
        let header = $('.mobile-header')
        if (header.hasClass('is-active')) {
          header.removeClass('is-active')
        } else {
          header.addClass('is-active')
        }
      })
    },

    index: function () {
      // Fact animation
      let list = $('.view-index-facts .views-field-body tr')
      if (list.length > 0) {
        let fact_animation = function (entries, observer) {
          entries.forEach(function (element) {
            let target = $(element.target)
            if (element.isIntersecting && !target.hasClass('show')) {
              target.addClass('show')
            } else if (!element.isIntersecting && target.hasClass('show')) {
              target.removeClass('show')
            }
          })
        }
        let observer = new IntersectionObserver(fact_animation, {
          threshold: 0.75
        })
        $.each(list, function (key, item) {
          observer.observe(item)
        })
      }

      // Donation click
      let donations = $('.view-index-donation .views-field-body .field-content > ul > li')
      donations.first().addClass('active')
      donations.find('> a').on('click', function (e) {
        e.preventDefault()

        $.each(donations, function (key, item) {
          let target = $(item)
          if (target.hasClass('active')) {
            target.removeClass('active')
          }
        })

        $(this).parent('li').addClass('active')
      })
    },

    faq: function () {
      // Item switch
      $.each($('.faq-list'), function (group_serial, group) {
        let list = $(group).find('> .view-inner > .view-content .views-field-title')
        $.each(list, function (key, item) {
          $(item).on('click', function () {
            let row = $(this).parents('.views-row').first()
            if (row.hasClass('active')) {
              row.removeClass('active')
            } else {
              row.addClass('active')
            }
          })
        })
      })
    },

    planStorySwitch: function (tab, id) {
      $('.plan-story-type .views-row a.active').removeClass('active')
      $(tab).addClass('active')
      $('.plan-story-content-view').hide()
      $('#' + id).show()
      return false
    },

    plan: function () {
      // Album
      $('.view-plan-node-album > .view-inner > .view-content .views-row a').magnificPopup({
        type: 'image',
        gallery: {
          enabled: true,
        },
      })
      $('.view-album > .view-inner > .view-content .views-row a').magnificPopup({
        type: 'image',
        titleSrc: 'title',
        gallery: {
          enabled: true,
        },
      })

      // Video
      $('.view-plan-node-video > .view-inner > .view-content .views-row a').magnificPopup({
        type: 'iframe',
        iframe: {
          markup: '<div class="mfp-iframe-scaler">' +
            '<div class="mfp-close"></div>' +
            '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
            '</div>',
          patterns: {
            youtube: {
              index: 'youtube.com/',
              id: 'v=',
              src: '//www.youtube.com/embed/%id%?autoplay=1',
            },
          },
          srcAction: 'iframe_src',
        },
      })
      $('.view-video > .view-inner > .view-content .views-row a').magnificPopup({
        type: 'iframe',
        iframe: {
          markup: '<div class="mfp-iframe-scaler">' +
            '<div class="mfp-close"></div>' +
            '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
            '</div>',
          patterns: {
            youtube: {
              index: 'youtube.com/',
              id: 'v=',
              src: '//www.youtube.com/embed/%id%?autoplay=1',
            },
          },
          srcAction: 'iframe_src',
        },
      })
    },

    chart: function () {
      $.each($('.chart-table'), function (index, item) {
        // Init
        let table = $(item)
        table.after('<div class="chart-table-converted"><canvas id="chart-table-' + index + '" width="400" height="400"></canvas></div>')

        // Parse
        let label = []
        let data = []
        $.each(table.find('tr'), function (row_index, row) {
          let row_data = $(row).find('td')
          label.push(row_data.eq(0).text())
          data.push(parseInt(row_data.eq(1).text(), 10))
        })

        // Chart
        new Chart($('#chart-table-' + index), {
          type: 'doughnut',
          data: {
            labels: label,
            datasets: [{
              data: data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                '#4dc9f6',
                '#f67019',
                '#f53794',
                '#537bc4',
                '#acc236',
                '#166a8f',
                '#00a950',
                '#58595b',
                '#8549ba',
              ],
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return context.label + ' ' + context.raw + '%'
                  }
                }
              }
            }
          }
        })

        // Hide table
        table.hide()
      })
    },

    arrange: function () {
      let reserve = $('#arrange-reserve')
      if (reserve.length >= 1) {
        let reserve_calendar = reserve.find('.jalendar')
        let reserve_select = reserve.find('.reserve-select')
        let reserve_container = $(reserve.find('.reserve-list').first())
        let reserve_submit = reserve.find('.reserve-submit')

        // Exclude date
        let reserve_exclude = []
        try {
          reserve_exclude = JSON.parse($('#arrange-exclude').text())
        } catch (e) {}

        // List
        let reserve_list = []
        try {
          $.each(localStorage.getItem('arrange-list').split(','), function (index, item) {
            try {
              let session = item.split('-')
              if (moment(session[0], 'YYYYMMDD').isSameOrBefore(moment())) {
                return
              }
              if (session[1] < 1 || session[1] > 3) {
                return
              }
              reserve_list.push(item)
            } catch (e) {}
          })
        } catch (e) {}
        reserve_list.push = function (item) {
          Array.prototype.push.call(reserve_list, item)
          try {
            if (reserve_list.length > 0) {
              localStorage.setItem('arrange-list', reserve_list.join(','))
            } else {
              localStorage.removeItem('arrange-list')
            }
          } catch (e) {}

          reserve_display()
          reserve_session(reserve_calendar.find('input.data1').val())
          reserve_modify()
        }
        reserve_list.splice = function (item, count) {
          Array.prototype.splice.call(reserve_list, item, count)
          try {
            if (reserve_list.length > 0) {
              localStorage.setItem('arrange-list', reserve_list.join(','))
            } else {
              localStorage.removeItem('arrange-list')
            }
          } catch (e) {}

          reserve_display()
          reserve_session(reserve_calendar.find('input.data1').val())
          reserve_modify()
        }

        // Reserved
        function reserve_display () {
          reserve_list.sort()

          if (reserve_list.length <= 0) {
            reserve_container.hide()
            reserve_submit.hide()
            return
          }

          let list = '<h4>已選取時段</h4><ul>'
          let action = '/civicrm/event/register?reset=1&id=12'
          $.each(reserve_list, function (index, item) {
            let session = item.split('-')
            let date = moment(session[0], 'YYYYMMDD')
            let time = ''
            switch (session[1]) {
              case '1':
                time = '10:00 - 12:00'
                break

              case '2':
                time = '13:00 - 15:00'
                break

              case '3':
                time = '15:00 - 17:00'
                break
            }

            list += '<li><button class="reserved" data-date="' + date.format('YYYY-MM-DD') + '" data-session="' + session[1] + '"><span class="date">' + date.format('YYYY/M/D') + '</span><span class="time">' + time + '</span></button></li>'
            action += '&picked[]=' + item
          })
          list += '</ul>'

          reserve_container.html(list)
          reserve_container.show()
          reserve_container.find('button').on('click', function () {
            let session = $(this)
            let date = moment(session.attr('data-date'))
            let number = session.attr('data-session')
            let key = date.format('YYYYMMDD') + '-' + number

            let index = reserve_list.indexOf(key)
            if (index !== -1) {
              reserve_list.splice(index, 1)
            }
          })

          reserve_submit.find('a').attr('href', action)
          reserve_submit.show()
        }

        // Select list
        async function reserve_session (selected) {
          if (!selected) {
            return
          }

          let date = moment(selected)
          let list = ['', '', '']

          reserve_select.html('<h4>' + date.format('M/DD') + ' 可預約時段</h4><p>可預約時段載入中...</p>')
          reserve_select.show()

          // Get current
          let promise = []
          for (let session = 1; session <= 3; session++) {
            promise.push(fetch('/json/volunteer-count/' + date.format('YYYY-MM-DD') + '/' + session)
              .then(function (current) {
                return current.json()
              })
              .then(function (current) {
                let available = 30
                if (current.items[0]) {
                  if (current.items[0].aggregate.reserve_people_sum) {
                    available -= parseInt(current.items[0].aggregate.reserve_people_sum, 10)
                  }
                }

                let classes = reserve_list.indexOf(date.format('YYYYMMDD') + '-' + session) !== -1 ? 'reserved' : ''
                if (available <= 0) {
                  classes += ' disabled'
                }

                let time
                switch (session) {
                  case 1:
                    time = '10:00 - 12:00'
                    break

                  case 2:
                    time = '13:00 - 15:00'
                    break

                  case 3:
                    time = '15:00 - 17:00'
                    break
                }

                list[session - 1] = '<li>' +
                  '<button class="' + classes + '" data-date="' + date.format('YYYY-MM-DD') + '" data-session="' + session + '" data-available="' + available + '">' +
                  '<span class="time">' + time + '</span>' +
                  '<span class="count">剩餘人數 ' + available + ' 人</span>' +
                  '</button>' +
                  '</li>'
              }))
          }

          Promise.all(promise).then(function () {
            reserve_select.html('<h4>' + date.format('M/DD') + ' 可預約時段</h4><ul>' + list.join('') + '</ul>')
            reserve_select.find('button').on('click', function () {
              let session = $(this)
              let date = moment(session.attr('data-date'))
              let number = session.attr('data-session')
              let key = date.format('YYYYMMDD') + '-' + number

              if (session.hasClass('reserved')) {
                let index = reserve_list.indexOf(key)
                if (index !== -1) {
                  reserve_list.splice(index, 1)
                }
                session.removeClass('reserved')
              } else {
                if (reserve_list.length >= 6) {
                  alert('最多可預約 6 個場次')
                  return
                }
                if (parseInt(session.data('available'), 10) <= 0) {
                  return
                }
                if (reserve_list.indexOf(key) === -1) {
                  reserve_list.push(key)
                }
                session.addClass('reserved')
              }
            })
          })
        }

        // Modify calendar
        function reserve_modify () {
          $.each(reserve_calendar.find('.day.this-month'), function (index, item) {
            let day = $(item)
            if (day.hasClass('disable-selecting')) {
              return
            }
            if (day.hasClass('today')) {
              day.addClass('disable-selecting')
              return
            }

            // Custom exclude
            let date = moment(day.attr('data-date'))
            if (date.day() === 0) {
              day.addClass('disable-selecting')
              return
            }
            if (reserve_exclude.indexOf(date.format('YYYY-MM-DD')) !== -1) {
              day.addClass('disable-selecting')
              return
            }

            // Reserved
            let count = 0
            if (reserve_list.indexOf(date.format('YYYYMMDD') + '-1') !== -1) {
              count++
            }
            if (reserve_list.indexOf(date.format('YYYYMMDD') + '-2') !== -1) {
              count++
            }
            if (reserve_list.indexOf(date.format('YYYYMMDD') + '-3') !== -1) {
              count++
            }
            day.find('span.count').remove()
            if (count > 0) {
              day.addClass('has-reserve')
              day.find('span').append('<span class="count">' + count + '</span>')
            } else {
              day.removeClass('has-reserve')
            }
          })
        }

        // Calendar
        reserve_calendar.jalendar({
          type: 'selector',
          customDay: moment().format('YYYY-MM-DD'),
          selectingBeforeToday: false,
          selectingAfterToday: true,
          dayWithZero: true,
          monthWithZero: true,
          lang: 'EN',
          sundayStart: true,
          dateType: 'yyyy-mm-dd',
          color: 'transparent',
          color2: 'transparent',
          dayColor: '#363636',
          titleColor: '#363636',
          weekColor: '#363636',
          todayColor: '#363636',
          done: function () {
            reserve_session(reserve_calendar.find('input.data1').val())
          },
          move: function (year, month) {
            reserve_modify(year, month)
          }
        })
        reserve_display()
        reserve_modify()
      }
    },

    rwdEvent: function (vw) {
    },

    windowResize: function () {
      themeCustom.rwdEvent(window.themeNetivism.viewport.width)
    },

    init: function () {
      themeCustom.rwdEvent(window.themeNetivism.viewport.width)
    }
  }

  Drupal.behaviors.themeCustom = {
    attach: function (context, settings) {
      $(document).ready(function () {
        themeCustom.init()
        themeCustom.headerMobile()
        themeCustom.index()
        themeCustom.faq()
        themeCustom.plan()
        themeCustom.chart()
        themeCustom.arrange()
      })

      $(window).resize(function () {
        clearTimeout(themeCustom.resizeTimer)
        themeCustom.resizeTimer = setTimeout(themeCustom.windowResize, 250)
      })
    },
    detach: function (context, settings, trigger) {
      // Undo something.
    }
  }
})(jQuery, Drupal, this, this.document);
