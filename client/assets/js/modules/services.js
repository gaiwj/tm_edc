/**
 * @return {[type]} 接口 tms.services.oper
 */
var tms = tms || {};
(function($) {
    //接口命名空间
    var me = this;
    me.services = me.services || {};
    var ajax_host = "/";

    // user
    {
        // 登录
        this.services.userLogin = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.user.userLogin);
        };
        // 获取公司
        this.services.getCompanies = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.user.getCompanies);
        };
        // 登陆公司
        this.services.loginCompany = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.user.loginCompany);
        };
        // 获取用户
        this.services.getUser = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.user.getUser);
        };
        this.services.getProject = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.user.getProject);
        };
        // 获取签名
        this.services.getSignature = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.user.getSignature);
        };
        this.services.getSite = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.user.getSite);
        };
        this.services.getProjectsSite = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.user.getProjectsSite);
        };
        this.services.getAllProjects = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.user.getAllProjects);
        };
        // 获取项目
        this.services.getProjects = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.user.getProjects);
        };
    }

    // system
    {
        this.services.getSystemSetting = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.system.getSystemSetting);
        };
        this.services.setSystem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.system.setSystem);
        };
    }

    // crf
    {
        this.services.getEnvironment = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.getEnvironment);
        };
        this.services.getWorkflow = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.getWorkflow);
        };
        this.services.getUKDate = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.getUKDate);
        };
        this.services.createOrUpdateUKDate = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.createOrUpdateUKDate);
        };
        this.services.createOrUpdateEnvironment = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.createOrUpdateEnvironment);
        };
        this.services.deleteEnvironment = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.crf.deleteEnvironment);
        };
        this.services.updateWorkflow = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.updateWorkflow);
        };
        this.services.getCRFVersion = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.getCRFVersion);
        };
        this.services.updateVersionName = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.updateVersionName);
        };
        this.services.deleteCRFVersion = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.crf.deleteCRFVersion);
        };
        this.services.addProcCRFVersion = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.addProcCRFVersion);
        };
        this.services.getCRFDeploy = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.getCRFDeploy);
        };
        this.services.updateEffectiveDate = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.updateEffectiveDate);
        };
        this.services.createOrUpdateCRFDeploy = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.crf.createOrUpdateCRFDeploy);
        };

    }

    // ecrf
    {
        this.services.getTrialProtocol = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getTrialProtocol);
        };

        this.services.getHint = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getHint);
        };
        this.services.createOrUpdateHint = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdateHint);
        };
        this.services.deleteHint = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deleteHint);
        };
        this.services.getItemGroupItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getItemGroupItems);
        };
        this.services.createOrUpdateItemGroupItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdateItemGroupItems);
        };
        this.services.deleteItemGroupItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deleteItemGroupItems);
        };
        this.services.createOrUpdateTrialProtocol = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdateTrialProtocol);
        };
        this.services.getTrialProtocolItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getTrialProtocolItems);
        };
        this.services.createOrUpdateTrialProtocolItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdateTrialProtocolItems);
        };
        this.services.getEventItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getEventItems);
        };
        this.services.createOrUpdateEventItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdateEventItems);
        };
        this.services.getFormPDF = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getFormPDF);
        };
        this.services.createOrUpdateFormItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdateFormItems);
        };
        this.services.getFormItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getFormItems);
        };
        this.services.deleteFormItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deleteFormItems);
        };
        this.services.deleteTrialProtocolItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deleteTrialProtocolItems);
        };
        this.services.createOrUpdateFormPDF = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdateFormPDF);
        };
        this.services.getPDFDefine = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getPDFDefine);
        };
        this.services.deleteFormPDF = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deleteFormPDF);
        };
        this.services.deleteEventItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deleteEventItems);
        };
        this.services.getPreview = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.getPreview);
        };
        this.services.createOrUpdatePDFDefine = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdatePDFDefine);
        };
        this.services.deletePDFDefine = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deletePDFDefine);
        };
        this.services.createOrUpdatePreview = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.ecrf.createOrUpdatePreview);
        };
        this.services.deletePreview = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.ecrf.deletePreview);
        };
    }

    // option
    {
        // 获取枚举
        this.services.getSysTypes = function (params) {
            var path = ajax_host + me.urls.option.getSysTypes;
            ajaxSend.post(params, path);
        };
    }

    // crfLib
    {
        // 获取Item
        this.services.getItems = function (params) {
            var path = ajax_host + me.urls.crfLib.getItems;
            ajaxSend.post(params, path);
        };

        // 表单定义查询
        this.services.getForm = function (params) {
            var path = ajax_host + me.urls.crfLib.getForm;
            ajaxSend.post(params, path);
        };


        // 获取ItemCDASH
        this.services.getCDASHAnnotation = function (params) {
            var path = ajax_host + me.urls.crfLib.getCDASHAnnotation;
            ajaxSend.post(params, path);
        };
        // 新增CDASH
        this.services.createOrUpdateCDASHAnnotation = function (params) {
            var path = ajax_host + me.urls.crfLib.createOrUpdateCDASHAnnotation;
            ajaxSend.post(params, path);
        };

        // 表单定义删除
        this.services.deleteForm = function (params) {
            var path = ajax_host + me.urls.crfLib.deleteForm;
            ajaxSend.get(params, path);
        };

        // CDASH注释删除
        this.services.deleteCDASHAnnotation = function (params) {
            var path = ajax_host + me.urls.crfLib.deleteCDASHAnnotation;
            ajaxSend.get(params, path);
        };
        // item删除
        this.services.deleteItems = function (params) {
            var path = ajax_host + me.urls.crfLib.deleteItems;
            ajaxSend.get(params, path);
        };
        // item删除
        this.services.getItemGroup = function (params) {
            var path = ajax_host + me.urls.crfLib.getItemGroup;
            ajaxSend.post(params, path);
        };
        // 删除itemGroup
        this.services.deleteItemGroup = function (params) {
            var path = ajax_host + me.urls.crfLib.deleteItemGroup;
            ajaxSend.get(params, path);
        };

        // 研究事件定义查询
        this.services.getEvent = function (params) {
            var path = ajax_host + me.urls.crfLib.getEvent;
            ajaxSend.post(params,path);
        };

        // 研究事件定义删除
        this.services.deleteEvent = function (params) {
            var path = ajax_host + me.urls.crfLib.deleteEvent;
            ajaxSend.get(params,path);
        };
    }

    //niDictionary
    {
        // 更新字典
        this.services.createOrUpdateDictionary1 = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.niDictionary.createOrUpdateDictionary1);
        };
        // 更新字典
        this.services.createOrUpdateDictionary2 = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.niDictionary.createOrUpdateDictionary2);
        };
    }

    // lab
    {
        // 获取字典
        this.services.getDiction = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getDiction);
        };
        // 获取字典项
        this.services.getDictionItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getDictionItems);
        };
        // 删除字典
        this.services.deleteDiction = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteDiction);
        };
        // 更新字典项
        this.services.createOrUpdateDictionaryItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateDictionaryItems);
        };
        // 删除字典项
        this.services.deleteDictionaryItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteDictionaryItems);
        };
        this.services.getUnit = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getUnit);
        };
        this.services.createOrUpdateUnit = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateUnit);
        };
        this.services.deleteUnit = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteUnit);
        };
        this.services.getUnitGroup = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getUnitGroup);
        };
        this.services.getUnitGroupItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getUnitGroupItems);
        };
        this.services.createOrUpdateUnitGroup = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateUnitGroup);
        };
        this.services.deleteUnitGroup = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteUnitGroup);
        };
        this.services.createOrUpdateUnitGroupItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateUnitGroupItems);
        };
        this.services.deleteUnitGroupItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteUnitGroupItems);
        };
        // 检验项查询
        this.services.getLabItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getLabItems);
        };
        // 检验项创建或更新
        this.services.createOrUpdateLabItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateLabItems);
        };
        // 检验项删除
        this.services.deleteLabItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteLabItems);
        };
        // 范围类型查询
        this.services.getRangeType = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getRangeType);
        };
        // 范围类型创建或更新
        this.services.createOrUpdateRangeType = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateRangeType);
        };
        // 范围类型删除
        this.services.deleteRangeType = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteRangeType);
        };
        // 范围类型_表达式查询
        this.services.getRangeTypeItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getRangeTypeItems);
        };
        // 全部变量查询
        this.services.getVariable = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getVariable);
        };
        // 范围类型_表达式创建或更新
        this.services.createOrUpdateRangeTypeItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateRangeTypeItems);
        };
        // 范围类型_表达式删除
        this.services.deleteRangeTypeItems = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteRangeTypeItems);
        };
        // 新增全局变量或更新
        this.services.createOrUpdateVariable = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.createOrUpdateVariable);
        };
        // 全局变量删除
        this.services.deleteVariable = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.lab.deleteVariable);
        };
        // 字典关联查询（全局或者编码）
        this.services.getDictionItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.lab.getDictionItems);
        };
    }

    // niForm
    {
        this.services.createOrUpdateItems1 = function (params) {
            var path = ajax_host + me.urls.niForm.createOrUpdateItems1;
            ajaxSend.post(params, path);

        };
        // 表单定义创建或更新(CRF Lib)
        this.services.createOrUpdateForm1 = function (params) {
            var path = ajax_host + me.urls.niForm.createOrUpdateForm1;
            ajaxSend.post(params, path);
        };
        this.services.createOrUpdateForm2 = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.niForm.createOrUpdateForm2);
        };
        // 新增itemGroup
        this.services.createOrUpdateItemGroup1 = function (params) {
            var path = ajax_host + me.urls.niForm.createOrUpdateItemGroup1;
            ajaxSend.post(params, path);
        };
        //更新Item定义
        this.services.createOrUpdateItems2 = function (params) {
            var path = ajax_host + me.urls.niForm.createOrUpdateItems2;
            ajaxSend.post(params, path);
        };
        // 编辑itemGroup定义
        this.services.createOrUpdateItemGroup2 = function (params) {
            var path = ajax_host + me.urls.niForm.createOrUpdateItemGroup2;
            ajaxSend.post(params, path);
        };

    }

    // queryClass
    {
        // 获取质疑分类
        this.services.getQueryClass = function (params) {
            var path = ajax_host + me.urls.queryClass.getQueryClass;
            ajaxSend.post(params, path);
        };
        // 新建质疑分类
        this.services.createOrUpdateQueryClass = function (params) {
            var path = ajax_host + me.urls.queryClass.createOrUpdateQueryClass;
            ajaxSend.post(params, path);
        };

        // 删除质疑分类deleteQueryClass
        this.services.deleteQueryClass = function (params) {
            var path = ajax_host + me.urls.queryClass.deleteQueryClass;
            ajaxSend.get(params, path);
        };
    }

    // role
    {
        // 获取角色
        this.services.getRole = function (params) {
            var path = ajax_host + me.urls.role.getRole;
            ajaxSend.post(params, path);
        };
        // 新增角色
        this.services.createOrUpdateRole = function (params) {
            var path = ajax_host + me.urls.role.createOrUpdateRole;
            ajaxSend.post(params, path);
        };
        // 删除角色
        this.services.deleteRole = function (params) {
            var path = ajax_host + me.urls.role.deleteRole;
            ajaxSend.get(params, path);
        };
        // 获取角色权限
        this.services.getMenu = function (params) {
            var path = ajax_host + me.urls.role.getMenu;
            ajaxSend.get(params, path);
        };
        // 新增角色权限
        this.services.createOrUpdateAccessMenu = function (params) {
            var path = ajax_host + me.urls.role.createOrUpdateAccessMenu;
            ajaxSend.post(params, path);
        };
        // 数据范围下拉框
        this.services.getRole = function (params) {
            var path = ajax_host + me.urls.role.getRole;
            ajaxSend.post(params,path);
        };
        // 用户角色信息
        this.services.getUserRole = function (params) {
            var path = ajax_host + me.urls.role.getUserRole;
            ajaxSend.post(params,path);
        };
        // 用户项目角色信息
        this.services.getUserStudyRole = function (params) {
            var path = ajax_host + me.urls.role.getUserStudyRole;
            ajaxSend.post(params,path);
        };
        // 保存用户项目角色信息
        this.services.createOrUpdateUserStudyRole = function (params) {
            var path = ajax_host + me.urls.role.createOrUpdateUserStudyRole;
            ajaxSend.post(params,path);
        };

        // 保存用户项目角色信息
        this.services.createOrUpdateUserRole = function (params) {
            var path = ajax_host + me.urls.role.createOrUpdateUserRole;
            ajaxSend.post(params,path);
        };
    }

    //roleConfig
    this.services.getPower = function (params) {
        var path = ajax_host + me.urls.roleConfig.getPower;
        ajaxSend.get(params, path);
    };
    this.services.getItem = function (params) {
        var path = ajax_host + me.urls.roleConfig.getItem;
        ajaxSend.get(params, path);
    };
    this.services.createOrUpdateAccessItem = function (params) {
        var path = ajax_host + me.urls.roleConfig.createOrUpdateAccessItem;
        ajaxSend.post(params, path);
    };
    this.services.getEvents = function (params) {
        var path = ajax_host + me.urls.roleConfig.getEvents;
        ajaxSend.get(params, path);
    };
    this.services.createOrUpdateAccessEvent = function (params) {
        var path = ajax_host + me.urls.roleConfig.createOrUpdateAccessEvent;
        ajaxSend.post(params, path);
    };
    this.services.getForms = function (params) {
        var path = ajax_host + me.urls.roleConfig.getForms;
        ajaxSend.get(params, path);
    };
    this.services.createOrUpdateAccessForm = function (params) {
        var path = ajax_host + me.urls.roleConfig.createOrUpdateAccessForm;
        ajaxSend.post(params, path);
    };
    this.services.getItemGroups = function (params) {
        var path = ajax_host + me.urls.roleConfig.getItemGroups;
        ajaxSend.get(params, path);
    };
    this.services.createOrUpdateAccessItemGroup = function (params) {
        var path = ajax_host + me.urls.roleConfig.createOrUpdateAccessItemGroup;
        ajaxSend.post(params, path);
    };
    // roleQuery
    {
        // 获取项目角色质疑分类
        this.services.getQueryClass2 = function (params) {
            var path = ajax_host + me.urls.roleQuery.getQueryClass;
            ajaxSend.get(params, path);
        };

        //配置质疑
        this.services.createOrUpdateRoleQueryAction = function (params) {
            var path = ajax_host + me.urls.roleQuery.createOrUpdateRoleQueryAction;
            ajaxSend.post(params,path);
        };
    }

    // niEvent
    {
        // 研究事件定义创建或更新(CRF Lib)
        this.services.createOrUpdateEvent1 = function (params) {
            var path = ajax_host + me.urls.niEvent.createOrUpdateEvent1;
            ajaxSend.post(params, path);
        };
    }

    // dropDown
    {
        // 角色表查询
        this.services.getDropDownDataRange = function (params) {
            var path = ajax_host + me.urls.dropDown.getDropDownDataRange;
            ajaxSend.post(params, path);
        };

        // 系列文件查询
        this.services.getDropDownOID = function (params) {
            var path = ajax_host + me.urls.dropDown.getDropDownOID;
            ajaxSend.post(params, path);
        };
        // 版本
        this.services.getDropDownCRFVersion = function (params) {
            var path = ajax_host + me.urls.dropDown.getDropDownCRFVersion;
            ajaxSend.post(params, path);
        };

        // ODM元数据文件
        this.services.getDropDownRefOID = function (params) {
            var path = ajax_host + me.urls.dropDown.getDropDownRefOID;
            ajaxSend.post(params, path);
        };
        // 研究中心下拉框
        this.services.getDropDownHospital = function (params) {
            var path = ajax_host + me.urls.dropDown.getDropDownHospital;
            ajaxSend.post(params, path);
        };
        // 受试者下拉框
        this.services.getDropDownSubject = function (params) {
            var path = ajax_host + me.urls.dropDown.getDropDownSubject;
            ajaxSend.post(params, path);
        };
        // 适用点检验项下的默认单位
        this.services.getDropDownGroupUnit = function (params) {
            var path = ajax_host + me.urls.dropDown.getDropDownGroupUnit;
            ajaxSend.post(params, path);
        };

        this.services.getDropDownQueryClass = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.dropDown.getDropDownQueryClass);
        };
        this.services.getDropDownEvent = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.dropDown.getDropDownEvent);
        };
        this.services.getDropDownForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.dropDown.getDropDownForm);
        };
        this.services.getDropDownItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.dropDown.getDropDownItems);
        };
        this.services.getDropDownItemGroup = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.dropDown.getDropDownItemGroup);
        };
    }

    // export
    {
        // ODM导出查询
        this.services.getExport = function (params) {
            var path = ajax_host + me.urls.export.getExport;
            ajaxSend.post(params, path);
        };
        // ODM导出配置创建或更新
        this.services.createOrUpdateExport = function (params) {
            var path = ajax_host + me.urls.export.createOrUpdateExport;
            ajaxSend.post(params, path);
        };
        // ODM导出表删除
        this.services.deleteExport = function (params) {
            var path = ajax_host + me.urls.export.deleteExport;
            ajaxSend.get(params, path);
        };
    }

    // odmLog
    {
        // ODM日志查询
        this.services.getODMLog = function (params) {
            var path = ajax_host + me.urls.odmLog.getODMLog;
            ajaxSend.post(params,path);
        };
    }

    // reportMetadata
    {
        // 保存运行导出
        this.services.exportODMLogTask = function (params) {
            var path = ajax_host + me.urls.reportMetadata.exportODMLogTask;
            ajaxSend.post(params,path);
        };
    }

    // subject
    {
        // 数据迁移里的受试者表
        this.services.getTransferPatientList = function (params) {
            var path = ajax_host + me.urls.subject.getTransferPatientList;
            ajaxSend.post(params,path);
        };

        // 获取受试者(数据迁移计划)
        this.services.getMigrateSubjectList = function (params) {
            var path = ajax_host + me.urls.subject.getMigrateSubjectList;
            ajaxSend.post(params,path);
        };

        // 获取受试者
        this.services.getPatientList = function (params) {
            var path = ajax_host + me.urls.subject.getPatientList;
            ajaxSend.post(params,path);
        };
    }

    // signatureDeclare
    {
        // 角色签名申明
        this.services.getSignatureDeclare = function (params) {
            var path = ajax_host + me.urls.signatureDeclare.getSignatureDeclare;
            ajaxSend.post(params,path);
        };
        // 保存角色签名申明
        this.services.createOrUpdateSignatureDeclare = function (params) {
            var path = ajax_host + me.urls.signatureDeclare.createOrUpdateSignatureDeclare;
            ajaxSend.post(params,path);
        };
        // 删除角色签名申明
        this.services.deleteSignatureDeclare = function (params) {
            var path = ajax_host + me.urls.signatureDeclare.deleteSignatureDeclare;
            ajaxSend.get(params,path);
        };

    }


    // dataMigrate
    {
        // DataMigrate表查询
        this.services.getDataMigrate = function (params) {
            var path = ajax_host + me.urls.dataMigrate.getDataMigrate;
            ajaxSend.post(params,path);
        };

        // 创建迁移计划
        this.services.createDataMigrate = function (params) {
            var path = ajax_host + me.urls.dataMigrate.createDataMigrate;
            ajaxSend.post(params,path);
        };

        // 删除计划
        this.services.deleteDataMigrate = function (params) {
            var path = ajax_host + me.urls.dataMigrate.deleteDataMigrate;
            ajaxSend.get(params,path);
        };

        // 数据迁移子集查询
        this.services.getDataMigrateDetail = function (params) {
            var path = ajax_host + me.urls.dataMigrate.getDataMigrateDetail;
            ajaxSend.post(params,path);
        };

        this.services.excuteMigratePlan = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.dataMigrate.excuteMigratePlan);
        };
    }

    // calculate
    {
        // 自动计算_自动计算（草案）查询
        this.services.getDerivation = function (params) {
            var path = ajax_host + me.urls.calculate.getDerivation;
            ajaxSend.post(params,path);
        };

        // 自动计算_自动计算（草案）创建或更新
        this.services.createOrUpdateDerivation = function (params) {
            var path = ajax_host + me.urls.calculate.createOrUpdateDerivation;
            ajaxSend.post(params,path);
        };

        // 自动计算_自动计算（草案）删除
        this.services.deleteDerivation = function (params) {
            var path = ajax_host + me.urls.calculate.deleteDerivation;
            ajaxSend.get(params,path);
        };

        // 自动计算_计算换算表查询
        this.services.getDerivationConvert = function (params) {
            var path = ajax_host + me.urls.calculate.getDerivationConvert;
            ajaxSend.post(params,path);
        };

        // 自动计算_计算公式查询
        this.services.getDerivationApplyItems = function (params) {
            var path = ajax_host + me.urls.calculate.getDerivationApplyItems;
            ajaxSend.post(params,path);
        };

        // 自动计算_计算换算表创建或更新
        this.services.createOrUpdateDerivationConvert = function (params) {
            var path = ajax_host + me.urls.calculate.createOrUpdateDerivationConvert;
            ajaxSend.post(params,path);
        };

        // 自动计算_计算换算表删除
        this.services.deleteDerivationConvert = function (params) {
            var path = ajax_host + me.urls.calculate.deleteDerivationConvert;
            ajaxSend.get(params,path);
        };

        // 自动计算_适用Item删除
        this.services.deleteDerivationApplyItems = function (params) {
            var path = ajax_host + me.urls.calculate.deleteDerivationApplyItems;
            ajaxSend.get(params,path);
        };

        // 自动计算_适用Item创建或更新
        this.services.createOrUpdateDerivationApplyItems = function (params) {
            var path = ajax_host + me.urls.calculate.createOrUpdateDerivationApplyItems;
            ajaxSend.post(params,path);
        };
        this.services.getDerivationCondition = function (params) {
            var path = ajax_host + me.urls.calculate.getDerivationCondition;
            ajaxSend.post(params,path);
        };
        this.services.createOrUpdateDerivationCondition = function (params) {
            var path = ajax_host + me.urls.calculate.createOrUpdateDerivationCondition;
            ajaxSend.post(params,path);
        };
        this.services.deleteDerivationCondition = function (params) {
            var path = ajax_host + me.urls.calculate.deleteDerivationCondition;
            ajaxSend.get(params,path);
        };
    }

    // globalInspection
    {
        this.services.getLab = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.globalInspection.getLab);
        };
        this.services.createOrUpdateLab = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.globalInspection.createOrUpdateLab);
        };
        this.services.deleteLab = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.globalInspection.deleteLab);
        };
        this.services.createOrUpdateLabAssigned = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.globalInspection.createOrUpdateLabAssigned);
        };
        this.services.getLabRange = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.globalInspection.getLabRange);
        };
        this.services.getLabRangeConditionItemsByLabId = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.globalInspection.getLabRangeConditionItemsByLabId);
        };
        this.services.createOrUpdateLabRange = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.globalInspection.createOrUpdateLabRange);
        };
        this.services.deleteLabRange = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.globalInspection.deleteLabRange);
        };
    }

    // draft
    {
        //  获取草案概况
        this.services.getDraftSummary = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftSummary);
        };

        // 获取受试者表信息
        this.services.getSubjectForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getSubjectForm);
        };
        
        // 设置受试者表
        this.services.setSubjectForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.setSubjectForm);
        };

        // 草案下_删除导入的数据字典
        this.services.deleteDraftDictionary = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.deleteDraftDictionary);
        };

        // 草案下_获取需要选择的数据字典
        this.services.getReferenceDictionary = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getReferenceDictionary);
        };

        // 草案下_引用数据字典
        this.services.draftCopyDictionary = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.draftCopyDictionary);
        };

        // 草案下_数据字典项跨度移动
        this.services.skipMoveDraftDictionary = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.skipMoveDraftDictionary);
        };

        // 草案下_数据字典项上下移动
        this.services.moveDraftDictionary = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.moveDraftDictionary);
        };
        //item定义
        this.services.getDraftItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftItems);
        };
        //item定义导入的列表
        this.services.getDraftReferenceItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftReferenceItems);
        };
        //item定义导入保存
        this.services.draftCopyItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.draftCopyItems);
        };
        //item定义删除
        this.services.deleteDraftItems = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.deleteDraftItems);
        };
        //itemGroup表
        this.services.getDraftItemGroup = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftItemGroup);
        };
        //itemGroup需导入的列表
        this.services.getDraftReferenceItemGroup = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftReferenceItemGroup);
        };
        //itemGroup导入保存
        this.services.draftCopyItemGroup = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.draftCopyItemGroup);
        };
        //itemGroupItem移动
        this.services.moveDraftItemGroupItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.moveDraftItemGroupItem);
        };
        //itemGroupItem跳跃移动
        this.services.skipMoveDraftItemGroupItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.skipMoveDraftItemGroupItem);
        };
        //itemGroupItem跳跃移动
        this.services.deleteDraftItemGroup = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.deleteDraftItemGroup);
        };
        //获取研究事件OID
        this.services.getDraftEvent = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftEvent);
        };
        this.services.getDraftForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftForm);
        };
        this.services.moveDraftFormItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.moveDraftFormItem);
        };
        this.services.skipMoveDraftFormItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.skipMoveDraftFormItem);
        };
        this.services.deleteDraftForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.deleteDraftForm);
        };
        this.services.moveDraftTrialProtocolItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.moveDraftTrialProtocolItem);
        };
        this.services.moveDraftEventItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.moveDraftEventItem);
        };
        this.services.skipMoveDraftEventItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.skipMoveDraftEventItem);
        };
        this.services.skipMoveDraftTrialProtocolItem = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.skipMoveDraftTrialProtocolItem);
        };
        this.services.getDraftReferenceForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.getDraftReferenceForm);
        };
        this.services.draftCopyForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.draft.draftCopyForm);
        };
    }

    //testProcedure
    {
        this.services.getEventId = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.testProcedure.getEventId);
        };
    }

    // collection
    {
        // 字段状态操作
        this.services.updateStatus = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.updateStatus);
        };
        // EDC获取签名申明
        this.services.getSignature = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.getSignature);
        };
        // 请求PIN码
        this.services.getPin = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.collection.getPin);
        };
        // 验证
        this.services.checkSignature = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.checkSignature);
        };    
        // 获取受试者表单
        this.services.getSubjectEventForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.getSubjectEventForm);
        };
        // 获取受试者事件
        this.services.getSubjectEvent = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.getSubjectEvent);
        };
        // 采集端添加表单
        this.services.addForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.addForm);
        };
        // 采集端删除表单
        this.services.deleteForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.deleteForm);
        };
        // 采集端恢复表单
        this.services.recoveryForm = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.recoveryForm);
        };
        // 采集端添加事件
        this.services.addEvent = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.addEvent);
        };
        // 采集端删除事件
        this.services.deleteEvent = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.deleteEvent);
        };
        // 采集端恢复事件
        this.services.recoveryEvent = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.collection.recoveryEvent);
        };
    }

    // query
    {
        this.services.getQuery = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.query.getQuery);
        };
    }
    //editcheck
    {
        this.services.getEditCheck = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheck.getEditCheck);
        };
        this.services.createOrUpdateEditCheck = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheck.createOrUpdateEditCheck);
        };
        this.services.deleteEditCheck = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.editCheck.deleteEditCheck);
        };
    }
    //editCheckConfig
    {
        this.services.createOrUpdateEditCheckCondition = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheckConfig.createOrUpdateEditCheckCondition);
        };
        this.services.getEditCheckCondition = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheckConfig.getEditCheckCondition);
        };
        this.services.getEditCheckAction = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheckConfig.getEditCheckAction);
        };
        this.services.createOrUpdateEditCheckAction = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheckConfig.createOrUpdateEditCheckAction);
        };
        this.services.deleteEditCheckAction = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.editCheckConfig.deleteEditCheckAction);
        };
        this.services.deleteEditCheckCondition = function (params) {
            ajaxSend.get(params, ajax_host + me.urls.editCheckConfig.deleteEditCheckCondition);
        };
        this.services.skipMoveEditCheckCondition = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheckConfig.skipMoveEditCheckCondition);
        };
        this.services.moveEditCheckCondition = function (params) {
            ajaxSend.post(params, ajax_host + me.urls.editCheckConfig.moveEditCheckCondition);
        };
    }

}).call(tms, jQuery);