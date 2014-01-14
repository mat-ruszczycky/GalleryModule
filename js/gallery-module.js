/*!
 * GalleryModule.js v1.0.0
 * http://www.matrsomething.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * 2014, MatRsomething.com // inspired by http://explore.speedousa.com/experience/artofthecap/
 */

var GalleryModule = (function ($, window) {

    'use strict';

    var Gallery = {

        currentRecordInfo : null,
        uiGrid : $(".ui-gallery-grid"),
        closeBtn : $(".gallery-preview-close"),
        nextBtn : $("#gallery-preview-next"),
        backBtn : $("#gallery-preview-prev"),
        uiNav : $(".gallery-ui-record"),
        page : $("#gallery-ui-preview"),
        uiMain : $("#ui-gallery-main"),
        overlay : $("#overlay"),
        imgView : $("#gallery-ui-img"),
        menu : $("#ui-gallery-main-nav-menu"),
        navDisabled : false,
        position : null,
        menuIsOpen : false,
        imageBank : [],
        imgIndex : null,
        settings : {
            transition : "scale"
        },

        showUI : function () {
            Gallery.overlay.show();
            Gallery.uiMain.show();
            Gallery.resizeImages();
            Gallery.menu.show();
            Gallery.overlay.delay(300).fadeOut(function () {
                Gallery.navDisabled = false;
                if (Gallery.settings.transition === "block") {
                    Gallery.uiNav.addClass("intro-show");
                    //setTimeout(function () {$.scrollTo(0,Gallery.position, {duration: 600}); }, 1000);
                }
            });
        },

        hideUI : function () {
            Gallery.menu.hide();
            Gallery.uiMain.css({"display" : "none"});
            window.scrollTo(0, 0);
            Gallery.imgView.ready(function () {
                Gallery.page.fadeIn();
            });
        },

        scaleUI : function () {
            Gallery.uiGrid.addClass("scale");
            setTimeout(Gallery.hideUI, 600);
        },

        showPreview : function (e) {
            e.preventDefault();
            var cssValue = e.pageX + "px " + e.pageY + "px";

            Gallery.currentRecordInfo = this;
            //Gallery.position = this.offsetTop;
            
            Gallery.imgIndex = $(this).data("position");
            
            Gallery.imgView.attr("src" , "images/" + Gallery.imageBank[Gallery.imgIndex]);

            $(Gallery.currentRecordInfo).find(".start").removeClass("start-move-right");
            $(Gallery.currentRecordInfo).find(".hover").removeClass("hover-move-right");
            $(Gallery.currentRecordInfo).find(".cap-1, .cap-2, .cap-3").removeClass("cap-up");

            Gallery.uiGrid.css({"-webkit-transform-origin" : cssValue, "-moz-transform-origin" : cssValue, "-o-transform-origin" : cssValue, "-ms-transform-origin" : cssValue, "transform-origin" : cssValue});

            if(Gallery.menuIsOpen){
                Gallery.hideMenu();
            }

            $(Gallery.currentRecordInfo).addClass("fade");

            if (Gallery.settings.transition === "scale") {
                setTimeout(Gallery.scaleUI, 600);
            } else {
                Gallery.navDisabled = true;
                $.scrollTo(0, 0, {duration: 600, onAfter : function () {Gallery.uiNav.removeClass("intro-show"); }});
                setTimeout(Gallery.hideUI, 1200);
            }
        },

        hidePreview : function (e) {
            e.preventDefault();
            $("body, #ui-main").addClass("no-scroll");
            Gallery.uiGrid.removeClass("scale");
            $(Gallery.currentRecordInfo).removeClass("fade");
            Gallery.page.fadeOut("fast", Gallery.showUI);
        },

        showRecordInfo : function () {
            if (Gallery.navDisabled) {
                return 0;
            }

            $(this).find(".start").addClass("start-move-right");
            $(this).find(".hover").addClass("hover-move-right");
            $(this).find(".cap-1, .cap-2, .cap-3").addClass("cap-up");
        },

        hideRecordInfo : function () {
            if (Gallery.navDisabled) {
                return 0;
            }

            $(this).find(".start").removeClass("start-move-right");
            $(this).find(".hover").removeClass("hover-move-right");
            $(this).find(".cap-1, .cap-2, .cap-3").removeClass("cap-up");
        },

        resizeImages : function () {
            var currentWidth = Gallery.uiNav.width(), currentHeight = Gallery.uiNav.height(), images = $(".start img, .hover img");

            if (currentWidth >= 800 || currentHeight >= 600) {
                images.css({"width" : "1000px", "height" : "auto"});
            } else if (currentWidth >= 640 || currentHeight >= 480) {
                images.css({"width" : "800px", "height" : "auto"});
            } else {
                images.css({"width" : "640px", "height" : "auto"});
            }
        },

        showMenu : function () {
            Gallery.menu.find("img").attr("src" , "images/menuClose.jpg");
            $("#ui-gallery-main-nav").addClass("ui-gallery-main-nav-open");
            Gallery.menuIsOpen = true;
        },

        hideMenu : function () {
            Gallery.menu.find("img").attr("src" , "images/menu.jpg");
            $("#ui-gallery-main-nav").removeClass("ui-gallery-main-nav-open");
            Gallery.menuIsOpen = false;
        },

        delegateMenu : function (e) {
            e.preventDefault();
            if (!Gallery.menuIsOpen) {
                Gallery.showMenu();
            } else {
                Gallery.hideMenu();
            }
        },
        
        loadImageBank : function () {
            for (var i = 0, len = Gallery.uiNav.length; i < len; i++) {
                Gallery.imageBank[i] = $(Gallery.uiNav[i]).find("a").attr("href");
                $(Gallery.uiNav[i]).attr('data-position', i);
            }
        },
        
        nextPreview : function () {
            if (Gallery.imgIndex < Gallery.imageBank.length - 1) {
                Gallery.imgIndex++;
            } else {
                Gallery.imgIndex = 0;
            }
            
            Gallery.imgView.fadeOut(function(){
                Gallery.imgView.attr("src" , "images/" + Gallery.imageBank[Gallery.imgIndex]);
            });
            
            Gallery.imgView.ready(function(){
                Gallery.imgView.fadeIn();
            });
            
        },
        
        backPreview : function () {
            if (Gallery.imgIndex > 0) {
                Gallery.imgIndex--;
            } else {
                Gallery.imgIndex = Gallery.imageBank.length - 1;
            }
            
            Gallery.imgView.fadeOut(function(){
                Gallery.imgView.attr("src" , "images/" + Gallery.imageBank[Gallery.imgIndex]);
            });
            
            Gallery.imgView.ready(function(){
                Gallery.imgView.fadeIn();
            });
        },

        bindUI : function () {
            Gallery.uiNav.hover(Gallery.showRecordInfo, Gallery.hideRecordInfo);
            Gallery.uiNav.click(Gallery.showPreview);
            Gallery.closeBtn.click(Gallery.hidePreview);
            Gallery.nextBtn.click(Gallery.nextPreview);
            Gallery.backBtn.click(Gallery.backPreview);
            Gallery.menu.click(Gallery.delegateMenu);
            $(window).resize(Gallery.resizeImages);
        },

        init : function (s) {
            s = s || "scale";

            window.scrollTo(0, 0);

            if (s.hasOwnProperty("transition") && s.transition === "block") {
                Gallery.settings.transition = s.transition;
            }

            Gallery.uiNav.addClass("intro-show");
            Gallery.resizeImages();
            Gallery.loadImageBank();
            Gallery.bindUI();
        }
    };

    return {init : Gallery.init};

}(jQuery, window));