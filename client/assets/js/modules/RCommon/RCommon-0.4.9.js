/************************************************************************************
★Robert编写，必属精品★
名称     ：RCommon
当前版本 ：0.4.9
最后更新 ：2017.3.1
插件官网 ：http://www.rplugin.com/
本次更新 ：1.添加了RDebug对象，提供了一些用于调试的常用方法
           2.修复了String扩展的encodeQuot方法没有全局替换的BUG
           3.Array扩展添加了indexOf和indexOfFn方法
           4.Array扩展的get支持传入负数，获取倒数的下标的元素
************************************************************************************/

// 扩展String
{
    // 将字符串转换成整数并返回（当转换失败时返回defaultNum）
    String.prototype.parseInt = function (defaultValue) {
        var number = parseInt(this);
        if (isNaN(number)) number = defaultValue;
        return number;
    }

    // 将字符串转换成浮点数并返回（当转换失败时返回defaultNum）
    String.prototype.parseFloat = function (defaultValue) {
        var number = parseFloat(this);
        if (isNaN(number)) number = defaultValue;
        return number;
    }

    // 清除两边的空格  
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };

    // 替换所有匹配
    String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
        if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
            return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
        } else {
            return this.replace(reallyDo, replaceWith);
        }
    };

    // 将字符串的首字母大写，第二个字母小写，以符合标准
    String.prototype.capFirst = function () {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    // 将字符串转换成驼峰写法（去掉'-'，并把'-'后面的第一个字母改成大写）
    // 例：输入"background-image"，返回"backgroundImage"
    String.prototype.camelize = function () {
        return this.replace(/\-(\w)/ig, function (B, A) {
            return A.toUpperCase();
        });
    }

    // 进行HTML编码
    // 例：传入"<test>\n"，返回"&lt;test&gt;<br/>"
    String.prototype.encodeHtml = function () {
        if (this == "") return "";
        var temp = this;

        temp = temp.replace(/&/g, "&amp;");

        temp = temp.replace(/ /g, "&nbsp;");

        temp = temp.replace(/</g, "&lt;");
        temp = temp.replace(/>/g, "&gt;");

        temp = temp.replace(/\"/g, "&quot;");
        temp = temp.replace(/\'/g, "&#39;");

        temp = temp.replace(/￠/g, "&cent;");
        temp = temp.replace(/£/g, "&pound;");
        temp = temp.replace(/¥/g, "&yen;");
        temp = temp.replace(/€/g, "&euro;");

        temp = temp.replace(/§/g, "&sect;");

        temp = temp.replace(/©/g, "&copy;");
        temp = temp.replace(/®/g, "&reg;");
        temp = temp.replace(/™/g, "&trade;");

        temp = temp.replace(/×/g, "&times;");
        temp = temp.replace(/÷/g, "&divide;");

        temp = temp.replace(/\n/g, "<br/>");

        return temp;
    }

    // 进行HTML解码
    // 例：传入"&lt;test&gt;<br/>"，返回"<test>\n"
    String.prototype.decodeHtml = function () {
        if (this == "") return "";
        var temp = this;

        temp = temp.replace(/&nbsp;/g, " ");

        temp = temp.replace(/&lt;/g, "<");
        temp = temp.replace(/&gt;/g, ">");

        temp = temp.replace(/&quot;/g, "\"");
        temp = temp.replace(/&#39;/g, "\'");

        temp = temp.replace(/&cent;/g, "￠");
        temp = temp.replace(/&pound;/g, "£");
        temp = temp.replace(/&yen;/g, "¥");
        temp = temp.replace(/&euro;/g, "€");

        temp = temp.replace(/&sect;/g, "§");

        temp = temp.replace(/&copy;/g, "©");
        temp = temp.replace(/&reg;/g, "®");
        temp = temp.replace(/&trade;/g, "™");

        temp = temp.replace(/&times;/g, "×");
        temp = temp.replace(/&divide;/g, "÷");

        temp = temp.replace(/<br \/>/g, "\n");
        temp = temp.replace(/<br\/>/g, "\n");
        temp = temp.replace(/<br>/g, "\n");

        temp = temp.replace(/&amp;/g, "&");

        return temp;
    }

    // 将字符串中的双引号编码成字符实体"&amp;quot;"
    String.prototype.encodeQuot = function () {
        return this.replaceAll("\"", "&quot;");
    }

    // escape
    String.prototype.escape = function () {
        return escape(this);
    }

    // unescape
    String.prototype.unescape = function () {
        return unescape(this);
    }
}

// 扩展Number
{
    // 保留到小数点后roundDigit位
    // roundDigit（可选）：保留到小数点后多少位，默认两位
    // fivein（可选）：是否进行四舍五入，默认进行
    Number.prototype.round = function (roundDigit, fivein) {
        if (this < 0) return -this.round(-this, roundDigit, fivein);
        if (typeof (roundDigit) == "undefined") return this.round(this, 2, fivein);
        return parseInt((this * Math.pow(10, roundDigit) + ((fivein == false) ? 0 : 0.5))) / Math.pow(10, roundDigit);
    }

    // 判断该数字是否为小数
    Number.prototype.isDecimal = function () {
        var intthis = parseInt(this);
        return (this - intthis != 0);
    }
}

// 扩展Array
{
    // 查找指定obj在数组中第一次出现的下标
    Array.prototype.indexOf = function (obj) {
        var index = -1;
        for (var i = 0; i < this.length; i++) {
            if (this[i] === obj) { index = i; break; }
        }
        return index;
    };

    // 查找符合fn过滤条件的第一个元素的下标
    Array.prototype.indexOfFn = function (fn) {
        if (!fn) return -1;
        var index = -1;
        for (var i = 0; i < this.length; i++) {
            if (fn(this[i]) == true) { index = i; break; }
        }
        return index;
    }

    // 获取第index个元素，若不存在则返回defaultValue
    Array.prototype.get = function (index, defaultValue) {
        if (index < 0) index += this.length;
        if (index < 0 || index >= this.length) return defaultValue;
        return this[index];
    }

    // 对数组的每一个元素执行fn函数，调用时传入下标和元素，若fn返回false则停止遍历
    Array.prototype.each = function (fn, dobj) {
        if (!fn) return this;
        var iscompile = document.getElementById("compile") != null;
        if (iscompile) {
            fn.call(dobj, 0, dobj);
        }
        else {
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                if (fn.call(item, i, item) == false) break;
            }
        }
        return this;
    }

    // 对数组的第一个元素执行fn函数，调用时传入第一个元素
    Array.prototype.each1 = function (fn, defaultValue, dobj) {
        if (!fn) return defaultValue;
        var iscompile = document.getElementById("compile") != null;
        if (iscompile) {
            fn.call(dobj, dobj);
            return defaultValue;
        }
        else {
            if (this.length <= 0) {
                return defaultValue;
            }
            else {
                var item = this[0];
                return fn.call(item, item);
            }
        }
    }

    // 删除第index个元素
    Array.prototype.remove = function (index) {
        if (index < 0 || index >= this.length) return this;
        this.splice(index, 1);
        return this;
    }

    // 从当前数组复制出新的数组
    Array.prototype.copy = function () {
        var newarr = new Array();
        for (var i = 0; i < this.length; i++)
            newarr[i] = this[i];
        return newarr;
    }

    // 获取第一个元素
    Array.prototype.first = function (defaultValue) {
        return this.get(0, defaultValue);
    }

    // 获取最后一个元素
    Array.prototype.last = function (defaultValue) {
        return this.get(this.length - 1, defaultValue);
    }

    // 获取数组中是否包含指定obj
    Array.prototype.contain = function (obj) {
        return (this.indexOf(obj) >= 0);
    }

    // 根据自定义条件筛选出符合的元素的数组
    Array.prototype.select = function (fn) {
        var res = [];
        if (!fn) return res;
        for (var i = 0; i < this.length; i++) {
            if (fn(this[i]) == true) res.push(this[i]);
        }
        return res;
    }

    // 根据自定义条件筛选出符合的第一个元素
    Array.prototype.select1 = function (fn, defaultValue) {
        var res = defaultValue;
        if (!fn) return res;
        for (var i = 0; i < this.length; i++) {
            if (fn(this[i]) == true) { res = this[i]; break; }
        }
        return res;
    }

    // 插入一个元素到指定位置
    Array.prototype.insert = function (item, index) {
        if (typeof index == "undefined") index = this.length - 1;
        this.splice(index, 0, item);
        return this;
    };
}

// 扩展jQuery
{
    $.RCommon = function () { return RCommon; }
    $.RUrl = function () { return RUrl; }
    $.RCookie = function () { return RCookie; }
    $.RShare = function () { return RShare; }

    // 获取指定name的属性的值，若不存在则返回空字符串
    $.prototype.attrstr = function (name) {
        var value = this.attr(name);
        if (typeof value == "undefined") return "";
        return "" + value;
    }

    // 获取当前元素的同辈元素的高度和
    $.prototype.getSiblingsHeight = function () {
        var jdom = this;
        var countHeight = 0;
        jdom.siblings().each(function () {
            if (this.id != "content" && RCommon.style(this, "display") != "none" && RCommon.style(this, "position") != "absolute" && this.tagName && this.tagName != "STYLE" && this.tagName != "SCRIPT") {
                var temp = $(this).outerHeight();
                countHeight += temp;
            }
        });
        return countHeight;
    }

    // 获取当前元素的子级元素的高度和
    $.prototype.getChildrenHeight = function () {
        var jdom = this;
        var countHeight = 0;
        jdom.children().each(function () {
            if (this.id != "content" && RCommon.style(this, "display") != "none" && RCommon.style(this, "position") != "absolute" && this.tagName && this.tagName != "STYLE" && this.tagName != "SCRIPT") {
                var temp = $(this).outerHeight();
                countHeight += temp;
            }
        });
        return countHeight;
    }
}

// RCommon
{
    var RCommon = {

        // 在指定window中查找指定name的window，若找不到则返回null，若name为空则直接返回顶层window
        // 传入window,name
        // 传入name
        getWindowByName: function (a, b) {
            if (typeof (b) == "undefined") return getWindowByName(top.window, a);
            if (a && a.frames) {
                if (b == "") return top.window;
                if (a.name == b) return a;
                for (var i = 0; i < a.frames.length; i++) {
                    var res = getWindowByName(a.frames[i].window, b);
                    if (res != null) return res;
                }
                return null;
            }
            else {
                alert("传入的不是window对象");
                return null;
            }
        },

        // 生成4个16位（0~f）随机码
        random16_4: function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        },

        // 生成一个随机的GUID
        guid: function () {
            var S4 = this.random16_4;
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        // 获取dom元素（原生js对象）的指定styleName样式的最顶层值
        // styleName请使用标准css写法
        // 例：请使用"background-color"，不要使用"backgroundColor"
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
        },

        // 获取分页数（共有recordCount条记录，每页显示pageSize条记录，计算一共有几页）
        getPage: function (recordCount, pageSize) {
            if (isNaN(recordCount)) return 0;
            if (isNaN(pageSize)) return 0;
            var res = parseInt(recordCount / pageSize);
            var res2 = parseInt(recordCount % pageSize);
            if (res2 > 0) res++;
            return res;
        },

        // 复制对象
        clone: function (obj) {
            var o;
            switch (typeof obj) {
                case 'undefined': break;
                case 'string': o = obj + ''; break;
                case 'number': o = obj - 0; break;
                case 'boolean': o = obj; break;
                case 'object':
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var k in obj) {
                                o[k] = clone(obj[k]);
                            }
                        }
                    }
                    break;
                default:
                    o = obj; break;
            }
            return o;
        }
    };
}

// RUrl
{
    var RUrl = {

        // 获取指定name的url参数
        queryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return "";
        },

        // 修改指定name的url参数为value，若不存在则会添加
        changeParam: function (url, name, value) {
            var str = "";
            if (url.indexOf('?') != -1)
                str = url.substr(url.indexOf('?') + 1);
            else
                return url + "?" + name + "=" + value;
            var returnurl = "";
            var setparam = "";
            var arr;
            var modify = "0";
            if (str.indexOf('&') != -1) {
                arr = str.split('&');
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].split('=')[0] == name) {
                        setparam = value;
                        modify = "1";
                    }
                    else {
                        setparam = arr[i].split('=')[1];
                    }
                    returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
                }
                returnurl = returnurl.substr(0, returnurl.length - 1);
                if (modify == "0" && returnurl == str)
                    returnurl = returnurl + "&" + name + "=" + value;
            }
            else {
                if (str.indexOf('=') != -1) {
                    arr = str.split('=');
                    if (arr[0] == name) {
                        setparam = value;
                        modify = "1";
                    }
                    else {
                        setparam = arr[1];
                    }
                    returnurl = arr[0] + "=" + setparam;
                    if (modify == "0" && returnurl == str)
                        returnurl = returnurl + "&" + name + "=" + value;
                }
                else
                    returnurl = name + "=" + value;
            }
            return url.substr(0, url.indexOf('?')) + "?" + returnurl;
        }

    };
}

// RCookie
{
    var RCookie = {

        // 添加指定name的cookie，值为value，有效时间为minutes（分钟），默认60分钟
        add: function (name, value, minutes, toRootPath) {
            if (!name) return;
            name = "" + name;
            if (typeof value == "undefined") return;
            value = "" + value;
            if (value == "") return;
            if (window.location.hostname == "localhost") name = window.location.host + "_" + name;
            if (typeof (minutes) == "undefined") minutes = 60 * 24;

            var d = new Date();
            d.setTime(d.getTime() + (minutes * 60 * 1000));

            var newcookie = "";
            newcookie += name + "=" + escape(value) + ";";
            newcookie += "expires=" + d.toUTCString() + ";";
            if (toRootPath != false) newcookie += "path=/";

            document.cookie = newcookie;
            return this;
        },

        // 删除指定name的cookie
        remove: function (name) {
            this.add(name, 0, -1);
            return this;
        },

        // 获取指定name的cookie的值，获取不到时返回空字符串
        get: function (name) {
            if (!name) return;
            name = "" + name;
            if (window.location.hostname == "localhost") name = window.location.host + "_" + name;
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return "";
        },

        // 删除当前域所有的cookie
        clear: function () {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                if (!cookie) continue;
                var arr = cookie.split("=");
                var cookiename = arr.length > 0 ? arr[0] : cookie;
                document.cookie = cookiename + '=0;expires=' + new Date(0).toUTCString();
            }
        }
    };
}

// RShare
{
    var RShare = {

        // 若传入value，则设置指定name的data的值为value
        // 若不传入value，则返回指定name的data的值
        data: function (name, value) {
            if (!window.top['_RShare']) window.top['_RShare'] = {};
            var cache = window.top['_RShare'];
            if (typeof (value) == "undefined") {
                return cache[name];
            }
            else {
                cache[name] = value;
                return this;
            }
        },

        // 删除指定name的data
        remove: function (name) {
            var cache = window.top['_CACHE'];
            if (cache && cache[name]) delete cache[name];
            return this;
        }

    };
}

// RDebug
{
    var RDebug = {
        _t1: new Date().getTime(),
        _t2: new Date().getTime(),
        // 记录时间
        lt: function () {
            this._t1 = this._t2;
            this._t2 = new Date().getTime();
        },
        // 获取耗时
        t: function () {
            return this._t2 - this._t1;
        },
        // 获取耗时的提示文字
        ts: function () {
            var res1 = this._t2 - this._t1;
            var res2 = res1 / 1000;
            var res3 = parseInt((res2 * 100) / 60) / 100;
            return "耗时为" + res1 + "毫秒\n即" + res2 + "秒\n约" + res3 + "分钟";
        },
        // 弹框提示耗时
        tsa: function () {
            alert(this.ts());
            return this;
        }
    }
}