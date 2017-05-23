/**
 * Created by asus on 2017/3/1.
 */
var tms = tms || {};

(function($) {
    var me = this;
    window.tmTools = me.util = me.util || {};
    /**
     * util.format('yyyy-mm-dd hh-ii-ss', +new Date());
     * @type {[type]}
     * 传入时间戳或时间字符串，获取时间格式含有各种方式，根据yy、mm、dd、hh、ii、ss来替换匹配
     */
    this.util.format = format;
    /**
     * util.time.getDay(+new Date());
     * @type {[type]}
     * 获取星期值
     */
    var _menuObj=null;
    this.util.getDay = getDay;
    this.util.htmlEncode = htmlEncode;
    this.util.htmlDecode = htmlDecode;
    this.util.json2str = json2str;
    this.util.removeFromArray = removeFromArray;
    this.util.getUrlParam = getUrlParam;
    this.util.menuList=menuList;
    this.util.menuObj=menuObj;
    // By snowden.xu
    this.util.formatDate = formatDate;

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    function format(format, timestamp) {

        timestamp = new Date(timestamp);

        var year = timestamp.getFullYear(); //获取完整的年份(4位,1970)
        var month = timestamp.getMonth() + 1 < 10 ? '0' + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1; //获取月份(0-11,0代表1月,用的时候记得加上1)
        var date = timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate(); //获取日(1-31)

        var hour = timestamp.getHours() < 10 ? '0' + timestamp.getHours() : timestamp.getHours(); //获取小时数(0-23)
        var minite = timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes(); //获取分钟数(0-59)
        var second = timestamp.getSeconds() < 10 ? '0' + timestamp.getSeconds() : timestamp.getSeconds(); //获取秒数(0-59)

        return format.replace(/y+/ig, year).replace(/m+/ig, month).replace(/d+/ig, date).replace(/h+/ig, hour).replace(/i+/ig, minite).replace(/s+/ig, second);
    }

    function getDay(timestamp) {
        var Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        return Day[timestamp.getDay()];
    }

    function htmlEncode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    }

    function htmlDecode(str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    }

    function json2str(json) {
        var arr = [];
        for (var key in json) {
            arr.push(key + '=' + json[key]);
        }
        return arr.join('&');
    }

    function removeFromArray(item, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                break;
            }
        }
        return array;
    }

    function menuObj() {
        return _menuObj
    }

    function menuList(obj,data,event,func) {
        var datas=data;
        var _obj=_menuObj=obj;
        _obj.html("<ul></ul>");
        if(!event){
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var _li=$('<li></li>');
                _li.data('index',i);
                var _name='<span class="menu-item-name">'+item.Name+'</span>';
                _li.html(_name);
                _obj.find('ul').append(_li);
            }
            _obj.find('ul>li').each(function () {
                var $li = $(this);

                $li.off('click').on('click',function () {
                    _obj.find('li').removeClass('on');
                    $(this).addClass('on');
                    var index = $li.data('index'),
                        row = datas[index];
                    func.apply(this,[row]);
                });
            });
            return false;
        }
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var _li=$('<li></li>');
            _li.data('index',i);
            var _name='<span class="menu-item-name">'+item.Name+'</span>';
            var _btn='<span class="menu-item-btn">'+func()+'</span>';
            _li.html(_name+_btn);
            _obj.find('ul').append(_li);
        }
        var events=window[event];
        for (var key in events) {
            _obj.find('ul>li').each(function () {
                var $li = $(this),
                    $btn = $li.find('.menu-item-btn'),
                    index = key.indexOf(' '),
                    name = key.substring(0, index),
                    el = key.substring(index + 1),
                    func = events[key];

                $btn.find(el).off(name).on(name, function (e) {
                    var index = $li.data('index'),
                        row = datas[index],
                        value="";
                    func.apply(this, [e, value, row, index]);
                });
            });
        }
    }

    // By snowden.xu
    // 格式化字符串日期
    function formatDate(date){
        return (date.substring(0,4) + '.' + date.substring(4,6) + '.' + date.substring(6,8));
    }

}).call(tms, jQuery);

(function ($) {
    $.prototype.getSeletedOption = function () {
        var $this = this;
        if ($this.length <= 0) return $();

        var first = null;
        var target = null;
        $this.find("option").each(function (i) {
            if (i == 0) first = this;
            if (this.selected == true) {
                target = this;
                return false;
            }
        });
        if (target == null) {
            return first ? $(first) : $();
        }
        else {
            return $(target);
        }
    };

    $.prototype.getValue = function () {
        var $this = this;
        if ($this.length <= 0) return "";

        // 单选框组
        if ($this.hasClass("radioBox")) {
            return $this.find("input:radio:checked").val();
        }

        // 下拉选择框
        if ($this.get(0).tagName == "SELECT") {
            var first = null;
            var target = null;
            $this.find("option").each(function (i) {
                if (i == 0) first = this;
                if (this.selected == true) {
                   target = this;
                   return false;
                }
            });
            if (target == null) {
                return first ? $(first).attr("value") : "";
            }
            else {
                return $(target).attr("value");
            }
        }

        return $this.val();
    };

    $.prototype.getText = function () {
        var $this = this;
        if ($this.length <= 0) return "";

        // 单选框组
        if ($this.hasClass("radioBox")) {
            return $this.find("input:radio:checked").html();
        }

        // 下拉选择框
        if ($this.get(0).tagName == "SELECT") {
            var first = null;
            var target = null;
            $this.find("option").each(function (i) {
                if (i == 0) first = this;
                if (this.selected == true) {
                    target = this;
                    return false;
                }
            });
            if (target == null) {
                return first ? $(first).html() : "";
            }
            else {
                return $(target).html();
            }
        }

        return $this.val();
    };

    $.prototype.setValue = function (value) {
        var $this = this;
        if ($this.length <= 0) return;

        // 单选框组
        if ($this.hasClass("radioBox")) {
            $this.find("input:radio").each(function () {
                if ($(this).attr("value") == value) {
                    this.checked = true;
                    return false;
                }
            });
            return;
        }

        // 下拉选择框
        if ($this.get(0).tagName == "SELECT") {
            $this.val(value).trigger("change");
            return;
        }

        $this.val(value);
    };

    $.prototype.clearValue = function () {
        var $this = this;

        // 单选框组
        if ($this.hasClass("radioBox")) {
            $this.find("input:radio:first").attr("checked", "checked");
        }

        // 下拉选择框
        if ($this.get(0).tagName == "SELECT") {
            var firstoption = $this.find("option:first");
            if (firstoption.length > 0) firstoption.get(0).selected = true;
            //.attr("selected", "selected");
            $this.trigger("change");
        }

        $this.val("");
    };
})(jQuery);


