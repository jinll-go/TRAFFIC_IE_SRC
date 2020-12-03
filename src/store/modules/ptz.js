const state = {
    cruise_path: 1, //共享的巡航路径
    //cruise_list: [],
    track_id: 1, //共享的轨迹id
    cur_ch: 1, // PTZ 通道（普通ipc，网络球机PTZ  鱼眼PTZ通道  测温红外通道）

    fisheye: {
        ability: {
            Viewmode: [],
            PTZNum: {},
            OptionalDevChanStreams: [],
        },
        curmode: {
            InstallMode: -1,
            ViewMode: {
                FisheyeView: 0,
                FullView: 0,
                PtzView: 3,
            },
            FullViewMode: -1,
        },
    },
};

const mutations = {
    /* ['PTZ/cruise_path_changed'](state, payload) {
        state.cruise_path = payload;
    },
    ['PTZ/cruise_list_changed'](state, payload) {
        state.cruise_list = payload;
    },
    ['PTZ/track_id_changed'](state, payload) {
        state.track_id = payload;
    },
    ['PTZ/cur_ch_changed'](state, payload) {
        state.cur_ch = payload;
    },*/
    ['PTZ/property_changed'](state, { cruise_path, track_id, cur_ch, fisheye }) {
        if (cruise_path) {
            state.cruise_path = cruise_path;
        }
        if (track_id) {
            state.track_id = track_id;
        }
        if (cur_ch) {
            state.cur_ch = cur_ch;
        }
        if (fisheye) {
            state.fisheye = fisheye;
        }
    },
};

const getters = {
    ptz(state) {
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
