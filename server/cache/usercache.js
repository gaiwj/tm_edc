/**
 * Created by robert.wu on 2017/4/20.
 */

// 用户缓存类
{
    // 用户缓存类
    function UserCache() {
        this.isnull = true;
        // SessionKey
        this.SessionKey = "";
        // 用户ID
        this.UserId = "";
        // 用户名
        this.UserName = "";
        // 姓名
        this.Name = "";
    }
    // 从Json数据加载到当前对象
    UserCache.prototype.fromjson = function (jsonstr) {
        if (!jsonstr) return this;

        var jsonobj = JSON.parse(jsonstr);
        if (!jsonobj) return this;

        this.SessionKey = jsonobj["b"];
        this.UserId = jsonobj["c"];
        this.UserName = jsonobj["d"];
        this.Name = jsonobj["e"];
        return this;
    }
    // 将当前对象生成Json数据
    UserCache.prototype.tojson = function () {
        var obj = {
            b: this.SessionKey,
            c: this.UserId,
            d: this.UserName,
            e: this.Name
        };
        var jsonstr = JSON.stringify(obj);
        return jsonstr;
    }
    // 设置用户缓存
    // UserCache.prototype.set = function () {
    //     RCookie.add("usercache", this.tojson(), 60);
    //     return this;
    // }
    // 置空
    UserCache.prototype.setnull = function () {
        this.SessionKey = "";
        this.UserId = "";
        this.UserName = "";
        this.Name = "";
        return this;
    }
}

// 用户缓存服务
{
    // 用户缓存服务
    var UserCacheService = {
        uc: new UserCache(),

        // 获取用户缓存
        get: function (req, getnew) {
            if (getnew || this.uc.isnull) {
                //var jsonstr = RCookie.get("usercache");
                var jsonstr = req.cookies.usercache ? unescape(req.cookies.usercache) : "";
                this.uc.fromjson(jsonstr);
                this.uc.isnull = false;
            }
            return this.uc;
        },
        // 更新缓存到cookie
        update: function (res) {
            res.cookie("usercache", escape(this.uc.tojson()), {

            });
        },
        // 清除用户缓存
        clear: function (res) {
            this.uc.setnull();//.set();
            this.update(res);
            return this;
        }
    }
}

module.exports = UserCacheService;