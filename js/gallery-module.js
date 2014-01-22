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

    var currentRecordInfo = null,
        filter = $("#ui-gallery-main-nav-cat a"),
        uiGrid = $(".ui-gallery-grid"),
        closeBtn = $(".gallery-preview-close"),
        nextBtn = $("#gallery-preview-next"),
        backBtn = $("#gallery-preview-prev"),
        uiNav = $(".gallery-ui-record"),
        page = $("#gallery-ui-preview"),
        uiMain = $("#ui-gallery-main"),
        overlay = $("#overlay"),
        imgView = $("#gallery-ui-img"),
        menu = $("#ui-gallery-main-nav-menu"),
        navDisabled = false,
        position = null,
        menuIsOpen = false,
        imageBank = [],
        imgIndex = null,
        settings = {
            transition : "scale"
        },

        showUI = function () {
            overlay.show();
            uiMain.show();
            menu.show();
            resizeImages();
            overlay.delay(300).fadeOut(function () {
                navDisabled = false;
                if (settings.transition === "block") {
                    uiNav.addClass("intro-show");
                    //setTimeout(function () {$.scrollTo(0,position, {duration: 600}); }, 1000);
                }
            });
        },

        hideUI = function () {
            menu.hide();
            uiMain.css({"display" : "none"});
            window.scrollTo(0, 0);
            imgView.ready(function () {
                page.fadeIn();
            });
        },

        scaleUI = function () {
            uiGrid.addClass("scale");
            setTimeout(hideUI, 600);
        },

        showPreview = function (e) {
            e.preventDefault();
            var cssValue = e.pageX + "px " + e.pageY + "px";

            currentRecordInfo = this;
            //position = this.offsetTop;
            
            imgIndex = $(this).data("position");
            
            imgView.attr("src" , "images/" + imageBank[imgIndex]);

            $(currentRecordInfo).find(".start").removeClass("start-move-right");
            $(currentRecordInfo).find(".hover").removeClass("hover-move-right");
            $(currentRecordInfo).find(".cap-1, .cap-2, .cap-3").removeClass("cap-up");

            uiGrid.css({"-webkit-transform-origin" : cssValue, "-moz-transform-origin" : cssValue, "-o-transform-origin" : cssValue, "-ms-transform-origin" : cssValue, "transform-origin" : cssValue});

            if(menuIsOpen){
                hideMenu();
            }

            $(currentRecordInfo).addClass("fade");

            if (settings.transition === "scale") {
                setTimeout(scaleUI, 600);
            } else {
                navDisabled = true;
                $.scrollTo(0, 0, {duration: 600, onAfter : function () {uiNav.removeClass("intro-show"); }});
                setTimeout(hideUI, 1200);
            }
        },

        hidePreview = function (e) {
            e.preventDefault();
            $("body, #ui-main").addClass("no-scroll");
            uiGrid.removeClass("scale");
            $(currentRecordInfo).removeClass("fade");
            page.fadeOut("fast", showUI);
        },

        showRecordInfo = function () {
            if (navDisabled) {
                return 0;
            }

            $(this).find(".start").addClass("start-move-right");
            $(this).find(".hover").addClass("hover-move-right");
            $(this).find(".cap-1, .cap-2, .cap-3").addClass("cap-up");
        },

        hideRecordInfo = function () {
            if (navDisabled) {
                return 0;
            }

            $(this).find(".start").removeClass("start-move-right");
            $(this).find(".hover").removeClass("hover-move-right");
            $(this).find(".cap-1, .cap-2, .cap-3").removeClass("cap-up");
        },

        resizeImages = function () {
            var currentWidth = uiNav.width(), currentHeight = uiNav.height(), images = $(".start img, .hover img");

            if (currentWidth >= 800 || currentHeight >= 600) {
                images.css({"width" : "1000px", "height" : "auto"});
            } else if (currentWidth >= 640 || currentHeight >= 480) {
                images.css({"width" : "800px", "height" : "auto"});
            } else {
                images.css({"width" : "640px", "height" : "auto"});
            }
        },

        showMenu = function () {
            menu.find("img").attr("src" , "images/menuClose.jpg");
            $("#ui-gallery-main-nav").addClass("ui-gallery-main-nav-open");
            menuIsOpen = true;
        },

        hideMenu = function () {
            menu.find("img").attr("src" , "images/menu.jpg");
            $("#ui-gallery-main-nav").removeClass("ui-gallery-main-nav-open");
            menuIsOpen = false;
        },

        delegateMenu = function (e) {
            e.preventDefault();
            if (!menuIsOpen) {
                showMenu();
            } else {
                hideMenu();
            }
        },
        
        loadImageBank = function () {
            for (var i = 0, len = uiNav.length; i < len; i++) {
                imageBank[i] = $(uiNav[i]).find("a").attr("href");
                $(uiNav[i]).attr('data-position', i);
            }
        },

        updatePreview = function (direction) {
            var transition = function () {
                imgView.hide();
                imgView.css({"marginLeft" : "0" , "marginRight" : "0", "opacity" : "1"});
                imgView.attr("src" , "images/" + imageBank[imgIndex]);
            };

            if (direction == "left") {
                imgView.animate({"marginLeft" : "-100%" , "opacity" : "0"}, transition);
            } else {
                imgView.animate({"marginRight" : "-100%", "opacity" : "0"}, transition);
            }           
            
            imgView.ready(function(){
                imgView.fadeIn();
            });
        },
        
        nextPreview = function (e) {
            e.preventDefault();
            if (imgIndex < imageBank.length - 1) {
                imgIndex++;
            } else {
                imgIndex = 0;
            }
            
            updatePreview("right");
        },
        
        backPreview = function (e) {
            e.preventDefault();
            if (imgIndex > 0) {
                imgIndex--;
            } else {
                imgIndex = imageBank.length - 1;
            }
            
            updatePreview("left");
        },

        filterItems = function (e) {
            e.preventDefault();
            var filter = $(this).data("filter");

            if (filter === "all") {
                alert("Show all");
            } else {
                alert("Show filter items");
            }
        },

        bindUI = function () {
            uiNav.hover(showRecordInfo, hideRecordInfo);
            uiNav.click(showPreview);
            closeBtn.click(hidePreview);
            nextBtn.click(nextPreview);
            backBtn.click(backPreview);
            menu.click(delegateMenu);
            filter.click(filterItems);
            $(window).resize(resizeImages);
        },

        init = function (s) {
            s = s || "scale";

            window.scrollTo(0, 0);

            if (s.hasOwnProperty("transition") && s.transition === "block") {
                settings.transition = s.transition;
            }

            uiNav.addClass("intro-show");
            resizeImages();
            loadImageBank();
            bindUI();
        };

    return {init : init};

}(jQuery, window));