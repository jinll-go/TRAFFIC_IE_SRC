import Vue from 'vue'; //此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败

import { current_year, current_month, current_day, pad } from 'common/util';
import { addEvent } from 'common/util';

const state = {
    activated: false,
    selected_year: current_year,
    selected_month: current_month,
    selected_day: current_day,
    plugin: null,
 
    root_path_map: {},
    filename: '',
    // h5的文件管理
    StartTime: '',
    EndTime: '',
    CurrentPage: 1,
    Num: 20,
    file_state: 'STOP',
};

const mutations = {
    ['file/pageIdx_changed'](state, payload) {
        state.CurrentPage = payload;
    },
    ['file/pageNum_changed'](state, payload) {
        state.Num = payload;
    },
    ['file/starttime_val_changed'](state, payload) {
        state.StartTime = payload;
    },
    ['file/endtime_val_changed'](state, payload) {
        state.EndTime = payload;
    },
    ['file/activated'](state, payload) {
        state.activated = payload;
    },
    ['file/plugin_change'](state, payload) {
        state.plugin = document.getElementById('file') || payload;
    },
    ['file/root_path_map_change'](state, payload) {
        state.root_path_map = payload;
    },
    ['file/state_changed'](state, payload) {
        state.file_state = payload;
    },
    ['file/voice_state_changed'](state, payload) {
        state.file_voice_state = payload;
    },
    ['file/speed_changed'](state, payload) {
        state.file_speed = payload;
    },
    ['file/filename'](state, payload) {
        state.filename = payload;
    },
    ['file/selected_year'](state, payload) {
        state.selected_year = payload;
    },
    ['file/selected_month'](state, payload) {
        state.selected_month = payload;
    },
    ['file/selected_day'](state, payload) {
        state.selected_day = payload;
    },
};

const getters = {
    file_activated(state) {
        return state.activated;
    },
    file_plugin(state) {
        return state.plugin;
    },
    root_path_map(state) {
        return state.root_path_map;
    },
    selected_year(state) {
        return state.selected_year;
    },
    selected_month(state) {
        return state.selected_month;
    },
    selected_day(state) {
        return state.selected_day;
    },
    file_state(state) {
        return state.file_state;
    },
    file_speed(state) {
        return state.file_speed;
    },
    file_voice_state(state) {
        return state.file_voice_state;
    },
    file_StartTime(state) {
        return state.StartTime;
    },
    file_EndTime(state) {
        return state.EndTime;
    },
    file(state) {
        return state;
    },
};

const actions = {
    file_starttime_val_changed({ commit, state }, val) {
        commit('file/starttime_val_changed', val);
    },
    file_endtime_val_changed({ commit, state }, val) {
        commit('file/endtime_val_changed', val);
    },
    /*file_plugin_change({ dispatch, commit, state }, { plugin }) {
        commit("file/plugin_change", plugin);

        dispatch("file/init_pluginmsg", {});
        dispatch("init_root_nodes", {});
    },*/

    init_root_nodes({ dispatch, commit, state, getters }, {}) {
        let Activex;
        // msg(["init_root_nodes",state.selected_year,state.selected_month,state.selected_day]);
        if ((Activex = getters.file_plugin)) {
            var path_map = {
                recPath: Activex.GetRegConfig('RecPath'),
                prevCapture: Activex.GetRegConfig('PrevCapture'),
                pbCapture: Activex.GetRegConfig('PbCapture'),
                backupPath: Activex.GetRegConfig('BackupPath'),
                fileCapture: Activex.GetRegConfig('FileCapture'),
                platePics: Activex.GetRegConfig('PlatePics'),
                facePics: Activex.GetRegConfig('FacePics'),
                sdcardsPics: window.location.protocol + '//' + getters.domain + '/snapshot',
            };

            commit('file/root_path_map_change', path_map);
        }
    },
    get_path_map({ dispatch, commit, state, getters }, { path }) {
        let Activex;
        if (!(Activex = state.plugin)) return Promise.resolve(obj);
        return new Promise((resolve) => {
            var date = [
                state.selected_year,
                state.selected_month < 10 ? '0' + state.selected_month : state.selected_month,
                state.selected_day < 10 ? '0' + state.selected_day : state.selected_day,
            ];
            var str = date.join('');
            var getNode = Activex.ShowFolder({
                path: path,
                date: [str],
                filetype: ['avi', 'i8', 'bmp', 'jpeg', 'jpg'],
            });

            resolve({
                Dirs: getNode.dirs,
                Files: getNode.files,
                DateStr: str,
            });
        });
    },
    get_sdcards_pics({ dispatch, commit, state, getters }, { path }) {
        return new Promise(async (resolve, reject) => {
            // let t = new Date();

            /* let ar = [state.selected_year, state.selected_month, state.selected_day, 0, 0, 0];
            let time = LocalTimeToUTC(
                new Date(parseInt(ar[0], 10), parseInt(ar[1], 10) - 1, parseInt(ar[2], 10), parseInt(ar[3], 10), parseInt(ar[4], 10), parseInt(ar[5], 10)),
            );
            let StartTime = time;
            ar = [state.selected_year, state.selected_month, state.selected_day, 23, 59, 59];
            time = LocalTimeToUTC(
                new Date(parseInt(ar[0], 10), parseInt(ar[1], 10) - 1, parseInt(ar[2], 10), parseInt(ar[3], 10), parseInt(ar[4], 10), parseInt(ar[5], 10)),
            );
            let EndTime = time;
            //    let extra_secs = 0;*/

            let result = await dispatch('request', {
                url: 'goform/frmSearchSDCardPics',
                Ch: 1,
                Type: 0,
                Data: {
                    //StartTime: StartTime,
                    //EndTime: EndTime,
                    DeviceLocalDateTimeStart: [state.selected_year, state.selected_month, state.selected_day, 0, 0, 0].map((item) => pad(item)).join(''),
                    DeviceLocalDateTimeStop: [state.selected_year, state.selected_month, state.selected_day, 23, 59, 59].map((item) => pad(item)).join(''),
                },
            });

            resolve(result);
        });
    },
    choosed_filename({ dispatch, commit, state }, { path }) {
        //  msg(path)
        commit('file/filename', path);
    },
    ie_fileplayer_action_trigger({ dispatch, commit, state, getters }, { cmd }) {
        let Activex;

        if ((Activex = state.plugin)) {
            msg(cmd, state.filename);
            switch (cmd) {
                case 'play':
                    Activex.FilePlay({
                        file_name: state.filename,
                    });
                    break;
                case 'pause':
                    Activex.FilePause();
                    break;
                case 'stop':
                    Activex.FileStop();
                    break;
                case 'fast':
                    Activex.FileFast();
                    break;
                case 'slow':
                    Activex.FileSlow();
                    break;
                case 'frame':
                    Activex.FileFrame();
                    break;
                case 'voice':
                    Activex.FileVoice();
                    break;
                case 'capture':
                    Activex.FileCapture();
                    break;
            }
        }
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
