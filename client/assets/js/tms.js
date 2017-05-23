/**
 * [description] 通用方法
 * @authors  sky cai
 * @version 1.0.0
 */
var tms = tms || {};
(function($) {
    //初始化,单选与复选框
/*    $('input').iCheck({
        checkboxClass: 'icheckbox_minimal',
        radioClass: 'iradio_minimal',
        increaseArea: '20%' // optional
    });*/

    // 日期时间相关
    {
        this._FORMAT_DATE = "{yyyy}-{MM}-{dd}";
        this._FORMAT_DATETIME = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}";

        // 格式化日期时间
        this._formatDateTime = function(str, format) {
            if (!str || str == "") return "";
            str = str.replace("-", "/");
            str = str.replace("T", " ");
            var obj = new Date(str);
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            var year = obj.getFullYear();
            var month = obj.getMonth() + 1;
            var date = obj.getDate();
            var hour = obj.getHours();
            var minute = obj.getMinutes();
            var second = obj.getSeconds();

            // yyyy
            var yyyy = year;

            // yy
            var yy = parseInt(year - parseInt(year / 100) * 100);
            if (yy < 10) yy = "0" + yy;

            // MMM
            var MMM = (month >= 1 && month <= 12) ? months[month - 1] : "error";

            // MM
            var MM = month;
            if (MM < 10) MM = "0" + MM;

            // M
            var M = month;

            // dd
            var dd = date;
            if (dd < 10) dd = "0" + dd;

            // d
            var d = date;

            // HH
            var HH = hour;
            if (HH < 10) HH = "0" + HH;

            // H
            var H = hour;

            // mm
            var mm = minute;
            if (mm < 10) mm = "0" + mm;

            // m
            var m = minute;

            // ss
            var ss = second;
            if (ss < 10) ss = "0" + ss;

            // s
            var s = second;

            format = format.replace(/{yyyy}/g, yyyy);
            format = format.replace(/{MMM}/g, MMM);
            format = format.replace(/{MM}/g, MM);
            format = format.replace(/{dd}/g, dd);
            format = format.replace(/{HH}/g, HH);
            format = format.replace(/{mm}/g, mm);
            format = format.replace(/{ss}/g, ss);

            return format;
        };
        // 格式化日期
        this.formatDate = function(str) {
            return this._formatDateTime(str, this._FORMAT_DATE);
        };
        // 格式化日期时间
        this.formatDateTime = function(str) {
            return this._formatDateTime(str, this._FORMAT_DATETIME);
        };

        // 比较日期
        // 返回1：date1比date2大
        // 返回2：date1跟date2相同
        // 返回3：date2比date1大
        // 返回-1：参数不正确
        this.compareDate = function(date1, date2) {
            if (!date1 || !date2) return -1;

            var dateparts1 = ("" + date1).split("-");
            var dateparts2 = ("" + date2).split("-");
            if (dateparts1.length != dateparts2.length) return -1;

            for (var i = 0; i < dateparts1.length; i++) {
                var a = parseInt(dateparts1[i]);
                var b = parseInt(dateparts2[i]);
                if (a > b)
                    return 1;
                else if (a < b)
                    return 3;
            }
            return 2;
        }
    }

    //全局日期中文化
/*    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        //daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysShort:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
    };*/


    //判断是否支持Local\sessionStroage
    this.supportStroage = function() {
        var flag = true;
        try {
            if (window.localStorage) {
                window.localStorage["test"] = "test";
            } else {
                flag = false;
            }
        } catch (e) { //对于无痕模式下会出现异常
            flag = false;
        }
        return flag;
    };

    //setLocalStorage
    this.setLocalStorage = function(key, value, isJson) {
        if (!this.supportStroage()) {
            alert("当前浏览器不支持localStorage");
            return;
        }
        if (window.localStorage) {
            if (isJson) {
                value = JSON.stringify(value);
            }
            try {
                window.localStorage[key] = value;
            } catch (e) {
                alert("当前浏览器不支持localStorage");
            }

        } else {
            alert("当前浏览器不支持localStorage");
        }
    };

    //getLocalStorage
    this.getLocalStorage = function(key, isJson) {
        if (!this.supportStroage()) {
            alert("当前浏览器不支持localStorage");
            return;
        }
        if (window.localStorage) {
            var value = window.localStorage[key] || "";
            if (isJson && value) {
                value = JSON.parse(value);
            }
            return value;
        } else {
            alert("当前浏览器不支持localStorage");
        }
    };

    /**
     * [getToken description]
     * @param  {[object]} request [key:method,url,type,time]
     * @param  {[string]} secret  [随机数] from 后端接口
     * @return {[string]}         [description]
     */
    this.getToken = function(request, secret){
        var message = "",
            _method = request.method || "get",
            _url = request.url || "",
            _type = request.type || "",
            _time = request.time || "";
        message = _method +_url + _type + _time;
        return this.createToken(message, secret);
    }
    /**
     * [createToken description]
     * @param  {[string]} message [加密字符串method+url+json+time]
     * @param  {[string]} secret  [随机数]
     * @return {[string]}         [description]
     */
    this.createToken = function(message, secret){
        var hash = CryptoJS.HmacSHA256(message, secret);
        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        return hashInBase64;
    }

    this.getErrMsg = function(error) {
        var msg = "";
        var status = Number(error.status);
        switch(status) {
            // 登录
            case 21:
                msg = '用户名或密码不正确！';
                break;
            case 31:
                msg = '用户授权失败！';
                break;
            case 51:
            case 31:
                msg = '登录超时，3秒跳转登录页重新登录！';
                // 3秒后跳转首页
                setTimeout(function() {
                    window.location.href = '/';
                }, 3000);
                break;
            // 基础配置 - 版本;
            case 111:
            case 112:
                msg = '版本名称已存在，请重新输入！';
                break;
            case 122:
            case 128:
            case 171:
            case 132:
            case 141:
            case 181:
            case 182:
            case 156:

                msg = '必填项不可为空！';
                break;
            case 157:
                msg = '新增的任务条件重复！';
                break;
            case 162:
                msg = '所选日期小于系统设置的起始日期！';
                break;
            // 基础配置 - 职能组
            case 121:
                msg = '职能组名称已存在，请重新输入！';
                break;
            case 163:
                msg = '请先设置周期规则！';
                break;
            // 基础配置 - 任务设置
            case 174:
            case 183:
                msg = '必填项不可为空！';
                break;
            case 184:
            case 172:
            case 174:
                msg = '任务编号已存在，请重新输入！';
                break;

            // 角色已经存在
            case 47:
                msg = '角色名称已存在，请重新输入！';
                break;
                
            // 处理结果
            case 205:
                msg = '密码错误！';
                break;
            case 401:
                msg = '权限错误！';
                break;
            // 不是公开信息，统一处理
            // 包含：版本状态
            default:
                msg = '接口响应异常：'+ error.errMsg;
                console.log('status: '+ error.status +'<br>errMsg: '+ error.errMsg);
                break;
        };
        return msg;
    }

}).call(tms, jQuery);

//弹出框
(function($) {
    /**
     * [alert description]
     * @param  {[Object]} params {title,message,cls,}
     * @return {[type]}        [description]
     */
    this.alert = function(params, func) {
        var d = {
            title: '提示',
            message: "",
            cls: "alert-p"
        };
        if (typeof params == 'string') {
            params = {
                message: params
            };
        }else {
            params.cls = d.cls +" "+params.cls;
        }
        $.extend(d, params);
        var html_arr = [
            '<div class="modal fade" id="modal_dialog_alert" tabindex="-1" role="dialog" style="z-index: 99999999;">',
            '<div class="modal-dialog modal-sm modal-center" style="min-width: 400px;">',
            '<div class="modal-content">',
            '<div class="modal-header" style="border-bottom: none;">',
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title" id="gridSystemModalLabel" style="color: #fff;font-size:18px;"><span></span>'+d.title+'</h4>',
            '</div>',
            '<div class="modal-body">',
            ' <p class="'+d.cls+'" style="text-align: center">'+d.message+'</p>',
            ' </div>',
            ' <div class="modal-footer" style="text-align: center;border-top: none;">',
            '<a href="javascript:void(0)" class="btn btn-cancel" data-dismiss="modal">确定</a>',
            ' </div>',
            ' </div>',
            ' </div>',
            '</div>'
        ];
        if (document.getElementById("modal_dialog_alert")) {
            var element = document.getElementById("modal_dialog_alert");
            element.parentNode.removeChild(element);
        }
        $("body").append(html_arr.join(""));

        setTimeout(function() {
            $("#modal_dialog_alert").modal('show');
            $('#modal_dialog_alert').on('hidden.bs.modal', function () {
                if(func) {
                    func();
                }
            });
        },300);

    };

    /**
     * [confirm description]
     * @param  {[type]} params {title,message,cls,}
     * @return {[type]}        [description]
     */
    this.confirm = function(params, func) {
        var d = {
            title: "提示",
            message: "",
            cls: "alert-p"
        };
        if (typeof params == 'string') {
            params = {
                message: params
            };
        }else {
            params.cls = d.cls +" "+params.cls;
        }
        $.extend(d, params);

        var html_arr = [
            '<div class="modal fade" id="modal_dialog_confirm" tabindex="-1" role="dialog" style="z-index: 99999999;">',
            '<div class="modal-dialog modal-sm modal-center" style="min-width: 450px;" >',
            '<div class="modal-content">',
            '<div class="modal-header" style="border-bottom: none;">',
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title" id="gridSystemModalLabel" style="color: #fff;font-size:18px;"><span></span>'+d.title+'</h4>',
            '</div>',
            '<div class="modal-body">',
            ' <p class="'+d.cls+'" style="text-align: center">',
            '<span style="top: 0;">'+d.message+'</span>',
            '</p>',
            ' </div>',
            ' <div class="modal-footer" style="text-align: center;border-top: none;">',
            ' <a href="javascript:void(0)" class="btn btn-confirm">确认</a>',
            ' <a href="javascript:void(0)" class="btn btn-cancel" data-dismiss="modal">取消</a>',
            ' </div>',
            ' </div>',
            ' </div>',
            '</div>'
        ];
        if (document.getElementById("modal_dialog_confirm")) {
            var element = document.getElementById("modal_dialog_confirm");
            element.parentNode.removeChild(element);
        }
        $("body").append(html_arr.join(""));

        setTimeout(function() {
            $("#modal_dialog_confirm").modal('show');
            if(func){
                $("#modal_dialog_confirm .btn-confirm").unbind('click').bind('click' , function(){
                    func();
                    $("#modal_dialog_confirm").modal('hide');
                });
            }
        },300);

    };

    /**
     * [confirm description]
     * @param  {[type]} params {title,message,cls,}
     * @return {[type]}        [description]
     */
    this.costPopup = function(params, func) {
        var d = {
            title: "提示",
            message: "",
            cls: "alert-p"
        };
        if (typeof params == 'string') {
            params = {
                message: params
            };
        }else {
            params.cls = d.cls +" "+params.cls;
        }
        $.extend(d, params);

        var html_arr = [
            '<div class="modal fade" id="modal_dialog_costPopup" tabindex="-1" role="dialog" >',
            '<div class="modal-dialog modal-sm modal-center" style="min-width: 450px;" >',
            '<div class="modal-content">',
            '<div class="modal-header" style="border-bottom: none;">',
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title" id="gridSystemModalLabel" style="color: #fff;"><span></span>'+d.title+'</h4>',
            '</div>',
            '<div class="modal-body">',
            ' <div class="'+d.cls+'">',
            ' <div>'+d.message+'</div>',
            '</div>',
            ' </div>',
            ' <div class="modal-footer" style="text-align: center;border-top: none;">',
            ' <a href="javascript:void(0)" class="ui-btn btn-confirm">确认</a>',
            ' <a href="javascript:void(0)" class="ui-btn btn-cancel" data-dismiss="modal">取消</a>',
            ' </div>',
            ' </div>',
            ' </div>',
            '</div>'
        ];
        if (document.getElementById("modal_dialog_costPopup")) {
            var element = document.getElementById("modal_dialog_costPopup");
            element.parentNode.removeChild(element);
        }
        $("body").append(html_arr.join(""));

        setTimeout(function() {
            $("#modal_dialog_costPopup").modal('show');
            if(func){
                $("#modal_dialog_costPopup .btn-confirm").unbind('click').bind('click' , function(){
                    func(function() {
                        $("#modal_dialog_costPopup").modal('hide');
                    });
                    
                });
            }
        },300);
    };

}).call(tms, jQuery);

/**
 * 字符串 模板解析
 */
(function( $, undefined ) {
    /**
     * 解析模版tpl。当data未传入时返回编译结果函数；当某个template需要多次解析时，建议保存编译结果函数，然后调用此函数来得到结果。
     *
     * @method $.parseTpl
     * @grammar $.parseTpl(str, data)  ⇒ string
     * @grammar $.parseTpl(str)  ⇒ Function
     * @param {String} str 模板
     * @param {Object} data 数据
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'template string'};
     * console.log($.parseTpl(str, data)); // => <p>template string</p>
     */
    $.parseTpl = function( str, data ) {
        var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                    .replace( /'/g, '\\\'' )
                    .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                        return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                    } )
                    .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                        return '\');' + code.replace( /\\'/, '\'' )
                                .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                    } )
                    .replace( /\r/g, '\\r' )
                    .replace( /\n/g, '\\n' )
                    .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

			/* jsbint evil:true */
            func = new Function( 'obj', tmpl );

        return data ? func( data ) : func;
    };
})( jQuery );