/************************************************************************************
★Robert编写，必属精品★
名称     ：RResize
当前版本 ：0.6.6
最后更新 ：2017.3.17
插件官网 ：http://www.rplugin.com/
本次更新 ：1.取消了contentCon相关的处理，取消了docwidth、docheight成员变量
           2.content对象的获取由“id为content”变成“class为content”
           3.取消了对RCommon插件的依赖
************************************************************************************/

var RResize = {

    // DOM对象
    content: $(),
    //contentCon: $(),

    // 浏览器窗口宽高
    scrwidth: 0,
    scrheight: 0,

    // contentCon宽高
    //docwidth: 0,
    //docheight: 0,

    // 屏幕宽度模式
    // -1: 未初始化
    //  0: W < 300
    //  1: 300 <= W < 450
    //  2: 450 <= W < 600
    //  3: 600 <= W < 800
    //  4: 800 <= W < 960
    //  5: 960 <= W < 1024
    //  6: 1024 <= W < 1200
    //  7: 1200 <= W < 1600
    //  8: 1600 <= W
    widthMode: -1,

    // 屏幕高度模式
    // -1: 未初始化
    //  0: H < 768
    //  1: 768 <= H < 900
    //  2: 900 <= H < 1200
    //  3: 1200 <= H
    heightMode: -1,

    // 事件
    _onResize: null,
    _onResized: null,
    _onWidthModeChanged: null,
    _onHeightModeChanged: null,


    // 获取DOM对象
    getDoms: function () {
        var pthis = this;
        if (pthis.content.length <= 0) pthis.content = $(".content");
        //if (pthis.contentCon.length <= 0) pthis.contentCon = $("#contentCon");
        return pthis;
    },

    // 更新信息
    getSize: function () {
        var pthis = this;

        pthis.getDoms();

        if (window.innerWidth)
            pthis.scrwidth = window.innerWidth;
        else if ((document.body) && (document.body.clientWidth))
            pthis.scrwidth = document.body.clientWidth;

        if (window.innerHeight)
            pthis.scrheight = window.innerHeight;
        else if ((document.body) && (document.body.clientHeight))
            pthis.scrheight = document.body.clientHeight;

        if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
            pthis.scrheight = document.documentElement.clientHeight;
            pthis.scrwidth = document.documentElement.clientWidth;
        }

        //pthis.docwidth = pthis.contentCon.width();
        //pthis.docheight = pthis.contentCon.height();

        // 更新屏幕宽度模式和高度模式
        var newWidthMode = 0;
        if (pthis.scrwidth < 300) newWidthMode = 0;
        else if (pthis.scrwidth < 450) newWidthMode = 1;
        else if (pthis.scrwidth < 600) newWidthMode = 2;
        else if (pthis.scrwidth < 800) newWidthMode = 3;
        else if (pthis.scrwidth < 960) newWidthMode = 4;
        else if (pthis.scrwidth < 1024) newWidthMode = 5;
        else if (pthis.scrwidth < 1200) newWidthMode = 6;
        else if (pthis.scrwidth < 1600) newWidthMode = 7;
        else newWidthMode = 8;

        var newHeightMode = 0;
        if (pthis.scrheight < 768) newHeightMode = 0;
        else if (pthis.scrheight < 900) newHeightMode = 1;
        else if (pthis.scrheight < 1200) newHeightMode = 2;
        else newHeightMode = 3;

        if (newWidthMode != pthis.widthMode) {
            $(document.body).removeClass("widthMode_" + pthis.widthMode).addClass("widthMode_" + newWidthMode);
            pthis.widthMode = newWidthMode;
            if (pthis._onWidthModeChanged) pthis._onWidthModeChanged(pthis.widthMode);
        }
        if (newHeightMode != pthis.heightMode) {
            $(document.body).removeClass("heightMode_" + pthis.heightMode).addClass("heightMode_" + newHeightMode);
            pthis.heightMode = newHeightMode;
            if (pthis._onHeightModeChanged) pthis._onHeightModeChanged(pthis.heightMode);
        }

        return pthis;
    },

    // 进行调整窗口大小后相应的操作
    resizeContent: function () {
        var pthis = this;

        //pthis.getSize();

        pthis.getDoms();

        // 触发事件
        if (pthis._onResize != null) pthis._onResize(pthis.scrwidth, pthis.scrheight);

        // 调整content高度
        pthis.content.each(function () {
            var jdom = $(this);
            var countHeight = 0;
            jdom.siblings().each(function () {
                if (this.id == "content") return;

                if (pthis.style(this, "display") == "none") return;

                var position = pthis.style(this, "position");
                if (position == "absolute" || position == "fixed") return;

                if (!this.tagName || this.tagName == "STYLE" || this.tagName == "SCRIPT") return;

                var temp = $(this).outerHeight();
                countHeight += temp;
            });
            jdom.height(jdom.parent().height() - countHeight - 0.5);
        });

        // 递归iframe中的resizeContent
        for (var i = 0; i < window.frames.length; i++) {
            try {
                var frame = window.frames[i];
                if (frame && frame.window && frame.window.RResize)
                    frame.window.RResize.resizeContent();
            }
            catch (e) { }
        }

        // 触发事件
        if (pthis._onResized != null) pthis._onResized(pthis.scrwidth, pthis.scrheight);

        return pthis;
    },

    // 调整窗口大小事件，在窗口大小改变后，调整content和递归resizeContent之前触发
    onResize: function (fn) {
        var pthis = this;
        if (typeof (fn) == "undefined") {
            if (pthis._onResize != null)
                pthis._onResize();
        }
        else {
            pthis._onResize = fn;
        }
        return pthis;
    },

    // 调整窗口大小事件，在窗口大小改变后，调整content和递归resizeContent之后触发
    onResized: function (fn) {
        var pthis = this;
        if (typeof (fn) == "undefined") {
            if (pthis._onResized != null)
                pthis._onResized();
        }
        else {
            pthis._onResized = fn;
        }
        return pthis;
    },

    // 屏幕宽度模式改变事件，在屏幕宽度模式改变后触发，调用时传入新的宽度模式
    onWidthModeChanged: function (fn) {
        var pthis = this;
        if (typeof (fn) == "undefined") {
            if (pthis._onWidthModeChanged != null)
                pthis._onWidthModeChanged(pthis.widthMode);
        }
        else {
            pthis._onWidthModeChanged = fn;
        }
        return pthis;
    },

    // 屏幕高度模式改变事件，在屏幕高度模式改变后触发，调用时传入新的高度模式
    onHeightModeChanged: function (fn) {
        var pthis = this;
        if (typeof (fn) == "undefined") {
            if (pthis._onHeightModeChanged != null)
                pthis._onHeightModeChanged(pthis.heightMode);
        }
        else {
            pthis._onHeightModeChanged = fn;
        }
        return pthis;
    },

    // 获取css
    style: function (dom, styleName) {
        var value;
        if (styleName == "float") {
            document.defaultView ? styleName = 'float' : styleName = 'styleFloat';
        }
        value = dom.style[styleName] || dom.style[styleName.camelize()];
        if (!value) {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                var _css = document.defaultView.getComputedStyle(dom, null);
                value = _css ? _css.getPropertyValue(styleName) : null;
            } else {
                if (dom.currentStyle) {
                    value = dom.currentStyle[styleName.camelize()];
                }
            }
        }
        if (value == "auto" && this.arrayContain(["width", "height"], styleName) && dom.style.display != "none") {
            value = dom["offset" + this.capFirst(styleName)] + "px";
        }
        if (styleName == "opacity") {
            try {
                value = dom.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                value = value / 100;
            } catch (e) {
                try {
                    value = dom.filters('alpha').opacity;
                } catch (err) { }
            }
        }
        return value == "auto" ? null : value;
    }
}

$(function () {
    RResize.getSize().resizeContent();

    if (window == top.window) {
        $(window).resize(function () {
            RResize.getSize().resizeContent();
        });
    }
});