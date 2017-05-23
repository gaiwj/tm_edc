/**
 * @return {[type]} 接口url:tms.activeUrl.oper
 */
var tms = tms || {};
(function(factory) {
    if (typeof module !== 'undefined') {
        module.exports = factory();
    } else {
        tms.urls = factory();
        //window.urls = factory();
    }
}(function() {
    var urls = {
        api_host:"http://ecollect-4.0-service.mobilemd.cn:91/api/",
        user:{
            userLogin:"User/UserLogin",
            getCompanies: "User/GetCompanies",
            loginCompany: "User/LoginCompany",
            getUser:"User/GetUser",
            getProjects:"User/GetProjects",
            getProject: "User/GetProject",
            getSignature:"User/GetSignature",
            getSite: "User/GetSite",
            getProjectsSite: "User/GetProjectsSite",
            getAllProjects: "User/GetAllProjects"
        },
        system:{
            getSystemSetting: "System/GetSystemSetting",
            setSystem: "System/SetSystem"
        },
        crf:{
            getEnvironment: "CRF/GetEnvironment",
            getWorkflow: "CRF/GetWorkflow",
            getUKDate: "CRF/GetUKDate",
            createOrUpdateUKDate: "CRF/CreateOrUpdateUKDate",
            createOrUpdateEnvironment: "CRF/CreateOrUpdateEnvironment",
            deleteEnvironment: "CRF/DeleteEnvironment",
            updateWorkflow: "CRF/UpdateWorkflow",
            getCRFVersion: "CRF/GetCRFVersion",
            updateVersionName: "CRF/UpdateVersionName",
            deleteCRFVersion: "CRF/DeleteCRFVersion",
            addProcCRFVersion: "CRF/AddProcCRFVersion",
            getCRFDeploy: "CRF/GetCRFDeploy",
            updateEffectiveDate: "CRF/UpdateEffectiveDate",
            createOrUpdateCRFDeploy: "CRF/CreateOrUpdateCRFDeploy"
        },
        ecrf:{
            getTrialProtocol: "eCRF/GetTrialProtocol",
            getHint:"eCRF/GetHint",
            createOrUpdateHint:"eCRF/CreateOrUpdateHint",
            deleteHint:"eCRF/DeleteHint",
            getItemGroupItems:"eCRF/GetItemGroupItems",
            createOrUpdateItemGroupItems:"eCRF/CreateOrUpdateItemGroupItems",
            deleteItemGroupItems:"eCRF/DeleteItemGroupItems",
            createOrUpdateTrialProtocol:"eCRF/CreateOrUpdateTrialProtocol",
            getTrialProtocolItems:"eCRF/GetTrialProtocolItems",
            createOrUpdateTrialProtocolItems:"eCRF/CreateOrUpdateTrialProtocolItems",
            getEventItems:"eCRF/GetEventItems",
            createOrUpdateEventItems:"eCRF/CreateOrUpdateEventItems",
            getFormPDF: "eCRF/GetFormPDF",
            createOrUpdateFormItems:"eCRF/CreateOrUpdateFormItems",
            getFormItems:"eCRF/GetFormItems",
            deleteFormItems:"eCRF/DeleteFormItems",
            deleteTrialProtocolItems:"eCRF/DeleteTrialProtocolItems",
            createOrUpdateFormPDF: "eCRF/CreateOrUpdateFormPDF",
            getPDFDefine: "eCRF/GetPDFDefine",
            deleteFormPDF: "eCRF/DeleteFormPDF",
            deleteEventItems:"eCRF/DeleteEventItems",
            getPreview: "eCRF/GetPreview",
            createOrUpdatePDFDefine: "eCRF/CreateOrUpdatePDFDefine",
            deletePDFDefine: "eCRF/DeletePDFDefine",
            createOrUpdatePreview: "eCRF/CreateOrUpdatePreview",
            deletePreview: "eCRF/DeletePreview"
        },
        crfLib:{
            getItems:"CRFLib/GetItems",
            getForm:"CRFLib/GetForm",
            getCDASHAnnotation:"CRFLib/GetCDASHAnnotation",
            createOrUpdateCDASHAnnotation:"CRFLib/CreateOrUpdateCDASHAnnotation",
            deleteForm:"CRFLib/DeleteForm",
            deleteCDASHAnnotation:"CRFLib/DeleteCDASHAnnotation",
            getEvent:"CRFLib/GetEvent",
            deleteEvent:"CRFLib/DeleteEvent",
            deleteItems:"CRFLib/DeleteItems",
            getItemGroup:"CRFLib/GetItemGroup",
            deleteItemGroup:"/CRFLib/DeleteItemGroup"
        },
        option:{
            getSysTypes:"Option/GetSysTypes"
        },
        lab:{
            getDictionItems: "Lab/GetDictionaryItems",
            deleteDiction: "Lab/DeleteDictionary",
            getDiction:"Lab/GetDictionary",
            deleteDictionaryItems: "Lab/DeleteDictionaryItems",
            createOrUpdateDictionaryItems: "Lab/CreateOrUpdateDictionaryItems",
            getUnit: "Lab/GetUnit",
            createOrUpdateUnit: "Lab/CreateOrUpdateUnit",
            deleteUnit: "Lab/DeleteUnit",
            getUnitGroup: "Lab/GetUnitGroup",
            getUnitGroupItems: "Lab/GetUnitGroupItems",
            createOrUpdateUnitGroup: "Lab/CreateOrUpdateUnitGroup",
            deleteUnitGroup: "Lab/DeleteUnitGroup",
            createOrUpdateUnitGroupItems: "Lab/CreateOrUpdateUnitGroupItems",
            deleteUnitGroupItems: "Lab/DeleteUnitGroupItems",
            getLabItems:"Lab/GetLabItems",
            createOrUpdateLabItems:"Lab/CreateOrUpdateLabItems",
            deleteLabItems:"Lab/DeleteLabItems",
            getRangeType:"Lab/GetRangeType",
            createOrUpdateRangeType:"Lab/CreateOrUpdateRangeType",
            deleteRangeType:"Lab/DeleteRangeType",
            getRangeTypeItems:"Lab/GetRangeTypeItems",
            getVariable:"Lab/GetVariable",
            createOrUpdateRangeTypeItems:"Lab/CreateOrUpdateRangeTypeItems",
            deleteRangeTypeItems:"Lab/DeleteRangeTypeItems",
            createOrUpdateVariable:"Lab/CreateOrUpdateVariable",
            deleteVariable:"Lab/DeleteVariable"
        },
        niDictionary: {
            createOrUpdateDictionary1: "NiDictionary/CreateOrUpdateDictionary1",
            createOrUpdateDictionary2:"NiDictionary/CreateOrUpdateDictionary2"
        },
        niForm:{
            createOrUpdateForm1:"NiForm/CreateOrUpdateForm1",
            createOrUpdateForm2: "NiForm/CreateOrUpdateForm2",
            createOrUpdateItems1:"NiItems/CreateOrUpdateItems1",
            createOrUpdateItemGroup1:"NiItemGroup/CreateOrUpdateItemGroup1",
            createOrUpdateItems2:"NiItems/CreateOrUpdateItems2",
            createOrUpdateItemGroup2:"NiItemGroup/CreateOrUpdateItemGroup2"
        },
        niEvent:{
            createOrUpdateEvent1:"NiEvent/CreateOrUpdateEvent1"
        },
        queryClass:{
            getQueryClass:"QueryClass/GetQueryClass",
            createOrUpdateQueryClass:"QueryClass/CreateOrUpdateQueryClass",
            deleteQueryClass:"QueryClass/DeleteQueryClass"
        },
        role:{
            getRole:"Role/GetRole",
            getMenu:"Role/GetMenu",
            createOrUpdateAccessMenu:"Role/CreateOrUpdateAccessMenu",
            createOrUpdateRole:"Role/createOrUpdateRole",
            deleteRole:"Role/DeleteRole",
            getUserRole:"Role/GetUserRole",
            getUserStudyRole:"Role/GetUserStudyRole",
            createOrUpdateUserStudyRole:"Role/CreateOrUpdateUserStudyRole",
            createOrUpdateUserRole:"Role/CreateOrUpdateUserRole"
        },
        roleConfig:{
            getPower:"RoleConfig/GetPower",
            getItem:"RoleConfig/GetItem",
            createOrUpdateAccessItem:"RoleConfig/CreateOrUpdateAccessItem",
            getEvents:"RoleConfig/GetEvent",
            createOrUpdateAccessEvent:"RoleConfig/CreateOrUpdateAccessEvent",
            getForms:"RoleConfig/GetForm",
            createOrUpdateAccessForm:"RoleConfig/CreateOrUpdateAccessForm",
            getItemGroups:"RoleConfig/GetItemGroup",
            createOrUpdateAccessItemGroup:"RoleConfig/CreateOrUpdateAccessItemGroup"
        },
        roleQuery:{
            getQueryClass:"RoleQuery/GetQueryClass",
            createOrUpdateRoleQueryAction:"RoleQuery/CreateOrUpdateRoleQueryAction"
        },
        dropDown:{
            getDropDownDataRange:"DropDown/GetDropDownDataRange",
            getDropDownOID:"DropDown/GetDropDownOID",
            getDropDownCRFVersion:"DropDown/GetDropDownCRFVersion",
            getDropDownRefOID:"DropDown/GetDropDownRefOID",
            getDropDownHospital:"DropDown/GetDropDownHospital",
            getDropDownSubject:"DropDown/GetDropDownSubject",
            getDropDownGroupUnit:"DropDown/GetDropDownGroupUnit",
            getDropDownQueryClass: "DropDown/GetDropDownQueryClass",
            getDropDownEvent:"DropDown/GetDropDownEvent",
            getDropDownForm:"DropDown/GetDropDownForm",
            getDropDownItems:"DropDown/GetDropDownItems",
            getDropDownItemGroup:"DropDown/GetDropDownItemGroup"
        },
        export:{
            getExport:"Export/GetExport",
            createOrUpdateExport:"Export/CreateOrUpdateExport",
            deleteExport:"Export/DeleteExport"
        },
        odmLog:{
            getODMLog:"ODMLog/GetODMLog"
        },
        reportMetadata:{
            exportODMLogTask:"ReportMetadata/ExportODMLogTask"
        },
        subject:{
            getTransferPatientList:"Subject/GetTransferPatientList",
            getMigrateSubjectList:"Subject/GetMigrateSubjectList",
            getRecentPatients:"Subject/GetRecentPatients",
            getPatientList:"Subject/GetPatientList"
        },
        signatureDeclare:{
            getSignatureDeclare:"SignatureDeclare/GetSignatureDeclare",
            createOrUpdateSignatureDeclare:"SignatureDeclare/CreateOrUpdateSignatureDeclare",
            deleteSignatureDeclare:"SignatureDeclare/DeleteSignatureDeclare"
        },
        dataMigrate:{
            getDataMigrate:"DataMigrate/GetDataMigrate",
            createDataMigrate:"DataMigrate/CreateDataMigrate",
            deleteDataMigrate:"DataMigrate/DeleteDataMigrate",
            getDataMigrateDetail:"DataMigrate/GetDataMigrateDetail",
            checkHttpStatus:"DataMigrate/CheckHttpStatus",
            excuteMigratePlan:"DataMigrate/ExcuteMigratePlan"
        },
        calculate:{
            getDerivation:"Calculate/GetDerivation",
            createOrUpdateDerivation:"Calculate/CreateOrUpdateDerivation",
            deleteDerivation:"Calculate/DeleteDerivation",
            getDerivationConvert:"Calculate/GetDerivationConvert",
            getDerivationApplyItems:"Calculate/GetDerivationApplyItems",
            createOrUpdateDerivationConvert:"Calculate/CreateOrUpdateDerivationConvert",
            deleteDerivationConvert:"Calculate/DeleteDerivationConvert",
            deleteDerivationApplyItems:"Calculate/DeleteDerivationApplyItems",
            createOrUpdateDerivationApplyItems:"Calculate/CreateOrUpdateDerivationApplyItems",
            getDerivationCondition:"Calculate/GetDerivationCondition",
            createOrUpdateDerivationCondition:"Calculate/CreateOrUpdateDerivationCondition",
            deleteDerivationCondition:"Calculate/DeleteDerivationCondition"
        },
        globalInspection: {
            getLab: "GlobalInspection/GetLab",
            createOrUpdateLab: "GlobalInspection/CreateOrUpdateLab",
            deleteLab: "GlobalInspection/DeleteLab",
            createOrUpdateLabAssigned: "GlobalInspection/CreateOrUpdateLabAssigned",
            getLabRange: "GlobalInspection/GetLabRange",
            getLabRangeConditionItemsByLabId: "GlobalInspection/GetLabRangeConditionItemsByLabId",
            createOrUpdateLabRange: "GlobalInspection/CreateOrUpdateLabRange",
            deleteLabRange: "GlobalInspection/DeleteLabRange",
        },
        draft:{
            getDraftSummary:"Draft/GetDraftSummary",
            getSubjectForm:"Draft/GetSubjectForm",
            setSubjectForm:"Draft/SetSubjectForm",
            deleteDraftDictionary:"Draft/DeleteDraftDictionary",
            getReferenceDictionary:"Draft/GetReferenceDictionary",
            draftCopyDictionary:"Draft/DraftCopyDictionary",
            getDraftItems:"Draft/GetDraftItems",
            getDraftReferenceItems:"Draft/GetDraftReferenceItems",
            draftCopyItems:"Draft/DraftCopyItems",
            deleteDraftItems:"Draft/DeleteDraftItems",
            getDraftItemGroup:"Draft/GetDraftItemGroup",
            getDraftReferenceItemGroup:"Draft/GetDraftReferenceItemGroup",
            draftCopyItemGroup:"Draft/DraftCopyItemGroup",
            skipMoveDraftDictionary:"Draft/SkipMoveDraftDictionary",
            moveDraftDictionary:"Draft/MoveDraftDictionary",
            getDraftEvent: "Draft/GetDraftEvent",
            getDraftForm: "Draft/GetDraftForm",
            moveDraftItemGroupItem:"Draft/MoveDraftItemGroupItem",
            skipMoveDraftItemGroupItem:"Draft/SkipMoveDraftItemGroupItem",
            deleteDraftItemGroup:"Draft/DeleteDraftItemGroup",
            moveDraftFormItem:"Draft/MoveDraftFormItem",
            skipMoveDraftFormItem:"Draft/SkipMoveDraftFormItem",
            deleteDraftForm: "Draft/DeleteDraftForm",
            moveDraftTrialProtocolItem:"Draft/MoveDraftTrialProtocolItem",
            moveDraftEventItem:"Draft/MoveDraftEventItem",
            skipMoveDraftEventItem:"Draft/SkipMoveDraftEventItem",
            skipMoveDraftTrialProtocolItem:"Draft/SkipMoveDraftTrialProtocolItem",
            getDraftReferenceForm: "Draft/GetDraftReferenceForm",
            draftCopyForm: "Draft/DraftCopyForm"
        },
        collection:{
            updateStatus:"Collection/UpdateStatus",
            getSignature:"Collection/GetSignature",
            getPin:"Collection/GetPin",
            checkSignature:"Collection/CheckSignature",
            getSubjectEventForm:"Collection/GetSubjectEventForm",
            getSubjectEvent:"Collection/GetSubjectEvent",
            addForm:"Collection/AddForm",
            deleteForm:"Collection/DeleteForm",
            recoveryForm:"Collection/RecoveryForm",
            addEvent:"Collection/AddEvent",
            deleteEvent:"Collection/DeleteEvent",
            recoveryEvent:"Collection/RecoveryEvent"
        },
        query:{
            getQuery: "Query/GetQuery",
        },
        testProcedure:{
            getEventId:"TestProcedure/GetEventId",
            
        },
        editCheck:{
            getEditCheck:"EditCheck/GetEditCheck",
            createOrUpdateEditCheck:"EditCheck/CreateOrUpdateEditCheck",
            deleteEditCheck:"EditCheck/DeleteEditCheck"
        },
        editCheckConfig:{
            createOrUpdateEditCheckCondition:"EditCheckConfig/CreateOrUpdateEditCheckCondition",
            getEditCheckCondition:"EditCheckConfig/GetEditCheckCondition",
            getEditCheckAction:"EditCheckConfig/GetEditCheckAction",
            createOrUpdateEditCheckAction:"EditCheckConfig/CreateOrUpdateEditCheckAction",
            deleteEditCheckAction:"EditCheckConfig/DeleteEditCheckAction",
            deleteEditCheckCondition:"EditCheckConfig/DeleteEditCheckCondition",
            skipMoveEditCheckCondition:"EditCheckConfig/SkipMoveEditCheckCondition",
            moveEditCheckCondition:"EditCheckConfig/MoveEditCheckCondition"
        }
    };
	return urls;
}));
