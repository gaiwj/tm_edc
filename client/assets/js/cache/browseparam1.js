/**
 * Created by robert.wu on 2017/4/21.
 */

// common.browseparam1.js
{
    // 浏览参数类
    {
        // 浏览参数类
        function BrowseParam1() {
            this.isnull = true;
            // 当前公司ID
            this.CurrentCompanyId = "";
            // 当前公司名称
            this.CurrentCompanyName = "";
            // 当前项目ID
            this.CurrentProjectId = "";
            // 当前项目名称
            this.CurrentProjectName = "";
            // 当前草案ID
            this.CurrentDraftId = "";
            // 当前草案名称
            this.CurrentDraftName = "";
            // 当前草案生效日期
            this.DraftEffectDate = "";
            // 当前环境ID
            this.CurrentEnvironmentId = "";
            // 当前环境名称
            this.CurrentEnvironmentName = "";
            // 当前研究中心ID
            this.CurrentHospitalId = "";
            // 当前研究中心名称
            this.CurrentHospitalName = "";
            // 签名方式
            this.SignatureType = 0;
        }
        // 从Json数据加载到当前对象
        BrowseParam1.prototype.fromjson = function (jsonstr) {
            if (!jsonstr) return this;

            var jsonobj = JSON.parse(jsonstr);
            if (!jsonobj) return this;

            this.CurrentCompanyId = jsonobj["f"];
            this.CurrentCompanyName = jsonobj["g"];
            this.CurrentProjectId = jsonobj["h"];
            this.CurrentProjectName = jsonobj["i"];
            this.CurrentDraftId = jsonobj["j"];
            this.CurrentDraftName = jsonobj["k"];
            this.DraftEffectDate = jsonobj["l"];
            this.CurrentEnvironmentId = jsonobj["m"];
            this.CurrentEnvironmentName = jsonobj["n"];
            this.CurrentHospitalId = jsonobj["o"];
            this.CurrentHospitalName = jsonobj["p"];
            this.SignatureType = jsonobj["q"];
            return this;
        }
        // 将当前对象生成Json数据
        BrowseParam1.prototype.tojson = function () {
            var obj = {
                f: this.CurrentCompanyId,
                g: this.CurrentCompanyName,
                h: this.CurrentProjectId,
                i: this.CurrentProjectName,
                j: this.CurrentDraftId,
                k: this.CurrentDraftName,
                l: this.DraftEffectDate,
                m: this.CurrentEnvironmentId,
                n: this.CurrentEnvironmentName,
                o: this.CurrentHospitalId,
                p: this.CurrentHospitalName,
                q: this.SignatureType
            };
            var jsonstr = JSON.stringify(obj);
            return jsonstr;
        }
        // 设置用户缓存
        BrowseParam1.prototype.set = function () {
            RCookie.add("browseparam1", this.tojson(), 60);
            return this;
        }
        // 置空
        BrowseParam1.prototype.setnull = function () {
            this.CurrentCompanyId = "";
            this.CurrentCompanyName = "";
            this.CurrentProjectId = "";
            this.CurrentProjectName = "";
            this.CurrentDraftId = "";
            this.CurrentDraftName = "";
            this.DraftEffectDate = "";
            this.CurrentEnvironmentId = "";
            this.CurrentEnvironmentName = "";
            this.CurrentHospitalId = "";
            this.CurrentHospitalName = "";
            this.SignatureType = 0;
            return this;
        }
    }

    // 浏览参数服务
    {
        // 浏览参数服务
        var BrowseParamService1 = {
            bp1: new BrowseParam1(),

            // 获取浏览参数
            get: function () {
                if (this.bp1.isnull) {
                    var jsonstr = RCookie.get("browseparam1");
                    this.bp1.fromjson(jsonstr);
                    this.bp1.isnull = false;
                }
                return this.bp1;
            },
            // 清除浏览参数
            clear: function () {
                this.bp1.setnull().set();
                return this;
            }
        }
    }
}