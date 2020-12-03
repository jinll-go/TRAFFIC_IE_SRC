const state = {
    plugin: null,
    capture_plugin: null,
    face_activated: false,
    comparison_activated: false,
    Facedb_to_model: false,
    need_get_model: false,
    isShowDialog: false,
    FaceIndex: 'faceview',
    DialogMode: '',
    DialogFaceDB: {},
    DialogFaceComparison: {},
    DialogSingleFace: {},
    isNeedModify: false,
    isBatchImporting: false,
    section_type: 'SECTION_SEVEN',
    isNeedEnableFace: false,
    isExport: false,
    ExportPath: '',
    ExportMsg: '',
    isShowExposure: false,
    isShowFTP: false,
    face_format: {
        split: '_',
        format_list: ['name', 'describe', 'wiegandId'],
    },
    isEigenValue: false, //特征值失败页面 修改完数据后是否刷新列表
    Eigenvalue_mounted: false,
    //人脸比对 结果
    face_compare_result: null,
    refreshFaceDataList: false, //刷新人脸数据组列表
    refresh_query_list: false, // 人脸库查询导入刷新列表
};

const mutations = {

    ['face/fresh_facedatalist'](state, payload) {
        state.refreshFaceDataList = payload;
    },
    ['face/refreshQueryList'](state, payload) {
        state.refresh_query_list = payload;
    },
    ['face/activated'](state, payload) {
        state.face_activated = payload;
    },
    ['face/plugin_change'](state, payload) {
        state.plugin = payload;
    },
    ['face/capture_plugin_change'](state, payload) {
        state.capture_plugin = payload;
    },
    ['comparison/activated'](state, payload) {
        state.comparison_activated = payload;
    },
    ['face/Facedb_to_model'](state, payload) {
        state.Facedb_to_model = payload;
    },
    ['face/isShowDialog'](state, payload) {
        state.isShowDialog = payload;
    },
    ['face/FaceIndex'](state, payload) {
        state.FaceIndex = payload;
    },
    ['face/DialogMode'](state, payload) {
        state.DialogMode = payload;
    },
    ['face/DialogFaceDB'](state, payload) {
        $.extend(true, state.DialogFaceDB, payload);
    },
    ['face/DialogFaceComparison'](state, payload) {
        state.DialogFaceComparison = payload;
    },
    ['face/need_get_model'](state, payload) {
        state.need_get_model = payload;
    },
    ['face/DialogSingleFace'](state, payload) {
        msg('face/DialogSingleFace', state.DialogSingleFace, payload);
        state.DialogSingleFace = payload;
    },
    ['face/isNeedModify'](state, payload) {
        state.isNeedModify = payload;
    },
    ['face/isBatchImporting'](state, payload) {
        state.isBatchImporting = payload;
    },
    ['face/isNeedEnableFace'](state, payload) {
        msg(['isNeedEnableFace change', payload]);
        state.isNeedEnableFace = payload;
    },
    ['face/isExport'](state, payload) {
        msg(['isExport change', payload]);
        state.isExport = payload;
    },
    ['face/ExportPath'](state, payload) {
        state.ExportPath = payload;
    },
    ['face/ExportMsg'](state, payload) {
        state.ExportMsg = payload;
    },
    ['face/isShowExposure'](state, payload) {
        state.isShowExposure = payload;
        // msg(['isShowExposure',state.isShowExposure])
    },
    ['face/isShowFTP'](state, payload) {
        state.isShowFTP = payload;
        // msg(['isShowFTP',state.isShowExposure])
    },
    ['face/Format'](state, payload) {
        state.face_format.format_list = [];
        $.extend(true, state.face_format, payload);
    },
    ['face/isEigenValue'](state, payload) {
        state.isEigenValue = payload;
    },
    ['face/Eigenvalue_mounted'](state, payload) {
        state.Eigenvalue_mounted = payload;
    },
    ['face/cmpface_result_changed'](state, payload) {
        state.face_compare_result = payload;
    },
};

const getters = {
    face_activated(state) {
        return state.face_activated;
    },
    Face(state) {
        return state;
    },
};

const actions = {};

export default {
    state,
    getters,
    mutations,
    actions,
};
