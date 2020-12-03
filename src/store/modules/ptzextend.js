const state = {
    SetScanIndex: 1,

    guardpos: {
        Type: 0,
        Index: 0,
        IdleTime: 0,
    },

    IrLightCtrl: {
        Mode: 0,
        Lighting: 0,
    },

    privacymask: [0],
    privacymask_idx: 1,
};

const mutations = {
    ['PTZExtend/setscan_index_changed'](state, payload) {
        state.SetScanIndex = payload;
    },
    ['PTZExtend/guardpos_changed'](state, payload) {
        $.extend(true, state.guardpos, payload);
    },
    ['PTZExtend/irlightctrl_changed'](state, payload) {
        $.extend(true, state.IrLightCtrl, payload);
    },
    ['PTZExtend/privacymask_changed'](state, payload) {
        state.privacymask = payload;
    },
    ['PTZExtend/privacymask_index_changed'](state, payload) {
        state.privacymask_idx = payload;
    },
};

const getters = {
    ptzextend(state) {
        return state;
    },
};

const actions = {
    ['PTZExtend/SetScan']({ dispatch, commit, state, getters }, { Index, Type }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        return dispatch('request', {
            url: 'goform/frmPTZExtend_SetScan',
            Type,
            Ch: getters.preview.ch,
            Data: {
                Index,
            },
        });
    },
    ['PTZExtend/IdleOperation']({ dispatch, commit, state, getters }, { Type, Data }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        return dispatch('request', {
            url: 'goform/frmPTZExtend_IdleOperation',
            Type,
            Ch: getters.preview.ch,
            Data,
        });
    },
    ['PTZExtend/IrLightCtrl']({ dispatch, commit, state, getters }, { Type, Mode, Lighting }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        //msg(["红外补光",getters.factory_info.IsofDome == 'y_ex'])
        if (getters.factory_info.IsofDome == 'y_ex') {
            return dispatch('request', {
                url: 'goform/frmPTZDomeIrLed',
                Type,
                Ch: getters.preview.ch,
                Data: {
                    Mode,
                    Lighting,
                },
            });
        } else {
            return dispatch('request', {
                url: 'goform/frmPTZExtend_IrlightCtrl',
                Type,
                Ch: getters.preview.ch,
                Data: {
                    Mode,
                    Lighting,
                },
            });
        }
    },
    ['PTZExtend/SetCover']({ dispatch, commit, state, getters }, { Type, Enable, Index, Data }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        msg(['PTZExtend/SetCover', getters, getters.factory_info, getters.factory_info.IsofDome]);
        if (getters.factory_info.IsofDome == 'y_ex') {
            return dispatch('request', {
                url: 'goform/frmPTZDomePrivacyMask',
                Type,
                Ch: getters.preview.ch,
                Data: Data || {},
            });
        } else {
            return dispatch('request', {
                url: 'goform/frmPTZExtend_SetCover',
                Type,
                Ch: getters.preview.ch,
                Data: {
                    Enable,
                    Index,
                },
            });
        }
    },
    ['PTZExtend/3DPosition']({ dispatch, commit, state, getters }, Data) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        if (getters.factory_info.IsofDome == 'y_ex') {
            let tmpObj = Data;
            Data.StartX = parseInt((tmpObj.StartX / 65535) * 10000);
            Data.StartY = parseInt((tmpObj.StartY / 65535) * 10000);
            Data.StopX = parseInt((tmpObj.StopX / 65535) * 10000);
            Data.StopY = parseInt((tmpObj.StopY / 65535) * 10000);
            // msg(["3D定位",getters.factory_info.IsofDome == 'y_ex',Data])
            return dispatch('request', {
                url: 'goform/frmPTZDome3DPosition',
                Type: 1,
                Ch: getters.preview.ch,
                Data,
            });
        } else {
            return dispatch('request', {
                url: 'goform/frmPTZExtend_3DPosition',
                Type: 1,
                Ch: getters.preview.ch,
                Data,
            });
        }
    },
    ['PTZExtend/Wiper']({ dispatch, commit, state, getters }, { Enable }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        //msg(["雨刷",getters.factory_info.IsofDome == 'y_ex'])
        if (getters.factory_info.IsofDome == 'y_ex') {
            return dispatch('request', {
                url: 'goform/frmPTZDomeWiper',
                Type: 1,
                Ch: getters.preview.ch,
                Data: {
                    Enable,
                },
            });
        } else {
            return dispatch('request', {
                url: 'goform/frmPTZExtend_Wiper',
                Type: 1,
                Ch: getters.preview.ch,
                Data: {
                    Enable,
                },
            });
        }
    },
    ['PTZExtend/SprayPos']({ dispatch, commit, state, getters }, { Code }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        return dispatch('request', {
            url: 'goform/frmPTZExtend_SprayPos',
            Type: 1,
            Ch: getters.preview.ch,
            Data: {
                Code,
            },
        });
    },
    ['PTZExtend/SprayMode']({ dispatch, commit, state, getters }, { Code }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
        return dispatch('request', {
            url: 'goform/frmPTZExtend_SprayMode',
            Type: 1,
            Ch: getters.preview.ch,
            Data: {
                Code,
            },
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
