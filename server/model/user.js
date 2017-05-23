/**
 * Created by sky.cai on 2017/4/19.
 */
var express = require('express');
var router = express.Router();
var template = require('art-template');
var config = require('../config');
var redis = require("./redis");
/* POST login . */
router.post('/UserLogin', function(req, res, next) {
    config.request({
        req: req,
        callback: function (result) {
            var uc = {},
                bp1 = {};
            if(result.Body) {
                uc.SessionKey = result.Body["SessionKey"];
                uc.UserId = result.Body["UserId"];
                uc.UserName = result.Body["UserName"];
                uc.Name = result.Body["Name"];
                bp1.CurrentCompanyId = result.Body["CompanyId"];
                bp1.SignatureType = result.Body["SignatureType"];
            }
            req.session.browseparam1 = bp1;
            res.cookie('usercache',JSON.stringify(uc) , {
                 path:'/', maxAge:3600*1000
             });
            res.json(result);
        }
    });
});

module.exports = router;

