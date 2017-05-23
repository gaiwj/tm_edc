/**
 * Created by robert.wu on 2017/4/21.
 */

// 浏览参数类
{
    // 浏览参数类
    function BrowseParam2() {
        this.isnull = true;
        this.PatientId = "";
        this.PatientCode = "";
        this.IntId = "";
        this.EventName = "";
        this.SubjectEventId = "";
        this.FormId = "";
        this.FormName = "";
        this.SubjectFormId = "";
        this.VersionId = "";
    }
    // 从Json数据加载到当前对象
    BrowseParam2.prototype.fromjson = function (jsonstr) {
        if (!jsonstr) return this;

        var jsonobj = JSON.parse(jsonstr);
        if (!jsonobj) return this;

        this.PatientId = jsonobj["a"];
        this.PatientCode = jsonobj["b"];
        this.IntId = jsonobj["c"];
        this.EventName = jsonobj["d"];
        this.SubjectEventId = jsonobj["e"];
        this.FormId = jsonobj["f"];
        this.FormName = jsonobj["g"];
        this.SubjectFormId = jsonobj["h"];
        this.VersionId = jsonobj["i"];
        return this;
    }
    // 将当前对象生成Json数据
    BrowseParam2.prototype.tojson = function () {
        var obj = {
            a: this.PatientId,
            b: this.PatientCode,
            c: this.IntId,
            d: this.EventName,
            e: this.SubjectEventId,
            f: this.FormId,
            g: this.FormName,
            h: this.SubjectFormId,
            i: this.VersionId
        };
        var jsonstr = JSON.stringify(obj);
        return jsonstr;
    }
    // 设置用户缓存
    BrowseParam2.prototype.set = function () {
        RCookie.add("browseparam2", this.tojson(), 60);
        return this;
    }
    // 置空
    BrowseParam2.prototype.setnull = function () {
        this.PatientId = "";
        this.PatientCode = "";
        this.IntId = "";
        this.EventName = "";
        this.SubjectEventId = "";
        this.FormId = "";
        this.FormName = "";
        this.SubjectFormId = "";
        this.VersionId = "";
        return this;
    }
}

// 浏览参数服务
{
    // 浏览参数服务
    var BrowseParamService2 = {
        bp2: new BrowseParam2(),

        // 获取浏览参数
        get: function (req, getnew) {
            if (getnew || this.bp2.isnull) {
                //var jsonstr = RCookie.get("browseparam2");
                var jsonstr = req.cookies.browseparam2 ? unescape(req.cookies.browseparam2) : "";
                this.bp2.fromjson(jsonstr);
                this.bp2.isnull = false;
            }
            return this.bp2;
        },
        // 更新缓存到cookie
        update: function (res) {
            res.cookie("usercache", escape(this.bp2.tojson()), {

            });
        },
        // 清除浏览参数
        clear: function () {
            this.bp2.setnull();//.set();
            this.update(res);
            return this;
        }
    }
}

module.exports = BrowseParamService2;