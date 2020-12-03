const state = {
    plugin: null,
    activated: 0,
    TemperatureIndex: '',
    comparedata: null,
    capturedata: null,
    isShowDialog: false,
    detail: {},
    mode: '', //temperaturerecords export
    isExport: false,
    ExportPath: '',
    ExportMsg: '',
    Facedb_to_model: false,
    DialogFaceDB: {},
    DialogFaceComparison: {},
    isBatchImporting: false,
    isNeedEnableFace: false,
    need_get_model: false,
    isNeedModify: false,
    isShowExposure: false,
    FaceIndex: '',
    DialogSingleFace: {},
    refresh_group_list: false, //是否刷新添加人脸/测温组列表
    initTempquery: false, //用作判断 是否是人脸库管理的详情进入到人脸库查询的
    DetectTempAreaMappingInfo: null, //红外映射区域 TempUnit 温度单位
    refreshQueryList: false //是否刷新人脸/测温 数据查询列表
};
const mutations = {

    ['temp_face/fresh_QueryList'](state, payload) {
        state.refreshQueryList = payload;
        msg("store刷新列表", state.refreshQueryList)
    },
    ['temperature/activated'](state, payload) {
        state.activated = payload;
    },
    ['temperature/plugin_change'](state, payload) {
        state.plugin = payload;
    },
    ['temperature/plugin_face_changed'](state, payload) {
        state.comparedata = payload;
    },
    ['temperature/plugin_capture_changed'](state, payload) {
        state.capturedata = payload;
    },
    ['temperature/isShowDialog'](state, payload) {
        state.isShowDialog = payload;
    },
    ['temperature/DialogMode'](state, payload) {
        state.mode = payload;
    },
    ['temperature/DetailItem'](state, payload) {
        state.detail = payload;
    },
    ['temperature/isExport'](state, payload) {
        state.isExport = payload;
    },
    ['temperature/ExportPath'](state, payload) {
        state.ExportPath = payload;
    },
    ['temperature/ExportMsg'](state, payload) {
        state.ExportMsg = payload;
    },
    ['temperature/DialogFaceDB'](state, payload) {
        // state.DialogFaceDB = payload;
        $.extend(true, state.DialogFaceDB, payload);
    },
    ['temperature/FaceIndex'](state, payload) {
        state.FaceIndex = payload;
    },
    ['temperature/DialogSingleFace'](state, payload) {
        state.DialogSingleFace = payload;
    },
    ['temperature/isNeedModify'](state, payload) {
        state.isNeedModify = payload;
    },
    ['temperature/need_get_model'](state, payload) {
        state.need_get_model = payload;
    },
    ['temperature/Facedb_to_model'](state, payload) {
        state.Facedb_to_model = payload;
    },
    ['temperature/isBatchImporting'](state, payload) {
        state.isBatchImporting = payload;
    },
    ['temperature/isNeedEnableFace'](state, payload) {
        // msg(['isNeedEnableFace change', payload]);
        state.isNeedEnableFace = payload;
    },
    ['temperature/DialogFaceComparison'](state, payload) {
        state.DialogFaceComparison = payload;
        // msg(['DialogFaceComparison_yuan', payload])
    },
    ['temperature/isShowExposure'](state, payload) {
        state.isShowExposure = payload;
    },
    ['temperature/initTempquery_change'](state, payload) {
        state.initTempquery = payload;
    },
    /**
     * temperature state 属性改变
     * @param {*} state
     * @param {*} payload
     */
    ['temperature/property_changed'](state, payload) {
        let keys = Object.keys(state);
        let inks = Object.keys(payload);
        inks.forEach((k) => {
            if (keys.includes(k)) {
                state[k] = payload[k];
            }
        });
    },
    ['temp_face/refreshAddGroupList'](state, payload) {
        state.refresh_group_list = payload;
        msg('store状态', state.refresh_group_list);
    },
};
const getters = {
    temperature(state) {
        return state;
    },
};
const actions = {
    ie_init_temperature_stream({
        dispatch,
        commit,
        state,
        getters
    }) {},
    flash_init_temperature_stream({
        dispatch,
        commit,
        state,
        getters
    }) {},
    h5_init_temperature_stream({
        dispatch,
        commit,
        state,
        getters
    }, {
        stream
    }) {
        if (!state.plugin) return;




        if (stream == 'open') {
            state.plugin.forEach((val, idx) => {
                val.smartconfig = {
                    rule: idx == 0, //红外通道 不显示人脸检测区域
                    result: true,
                    enbale_faceonly: false,
                    draw_extrainfo: true,
                };
                if (idx == 0) {
                    val.set_tempmaparea(state.DetectTempAreaMappingInfo);
                }
                val.play({
                    url: get_ws_url(getters.ip),
                    protocols: ['video-stream'],
                    cmd: {
                        Type: 0,
                        // Ch: 0,
                        // Dev: idx,
                        Ch: idx,
                        Dev: 0,
                        Data: {
                            StreamId: 0,
                            Video: true,
                            Audio: false,
                            Smart: true,
                        },
                    },
                });
            });

           
        } else if (stream == 'close') {
            state.plugin.forEach((val, idx) => {
                val.stop();
            });

        }
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
