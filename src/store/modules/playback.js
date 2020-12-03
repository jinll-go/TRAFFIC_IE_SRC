import { EventDisposer } from 'common/util';
const state = {
    current_tab_index: 1, //0 --backup 1--playback

    activated: false,
    playback_activated: false,
    backup_activated: false,
    plugin: null,
    backup_plugin: null,
    channel_checked: 0,

    ch_list: [],
    download_progress: 0,
    //h5
    timerange: {
        StartTime: 0,
        StopTime: 0,
    },

    drawer: null,
    player_StartTime: 0,
};

const mutations = {
    ['playback/timerange'](state, payload) {
        state.timerange = payload;
    },
    ['playback/player_StartTime'](state, payload) {
        state.player_StartTime = payload;
    },
    ['playback/drawer'](state, payload) {
        state.drawer = payload;
    },
    ['pbslider/activated'](state, payload) {
        state.activated = payload;
    },
    ['playback/activated'](state, payload) {
        state.playback_activated = payload;
    },
    ['backup/activated'](state, payload) {
        state.backup_activated = payload;
    },
    ['backup/plugin_change'](state, payload) {
        state.backup_plugin = payload;
    },
    ['playback/plugin_change'](state, payload) {
        state.plugin = payload;
    },
    ['playback/choose_channel'](state, payload) {
        state.channel_checked = payload;
    },

    ['playback/download_progress_changed'](state, payload) {
        state.download_progress = payload;
    },
    ['pbslider/tab_index_changed'](state, payload) {
        state.current_tab_index = payload;
    },
    ['playback/add_channel'](state, payload) {
        let tmp = state.ch_list.filter((item) => {
            return item.dev == payload.dev && item.ch == payload.ch;
        });

        if (tmp.length == 0) {
            state.ch_list.push(payload);
            state.ch_list.sort((a, b) => {
                if (a.dev != b.dev) {
                    return a.dev - b.dev;
                } else {
                    return a.ch - b.ch;
                }
            });
        }
    },
    ['playback/remove_channel'](state, payload) {
        state.ch_list = state.ch_list.filter((item) => {
            return item.dev != payload.dev && item.ch != payload.ch;
        });
    },
    ['playback/clear_channel'](state, payload) {
        state.ch_list = [];
    },
};

const getters = {
    pbslider_activated(state) {
        return state.activated;
    },
    playback_activated(state) {
        return state.playback_activated;
    },
    backup_activated(state) {
        return state.backup_activated;
    },
    playback_plugin(state) {
        return state.plugin;
    },
    backup_plugin(state) {
        return state.backup_plugin;
    },

    channel_checked() {
        return state.channel_checked;
    },
    download_progress() {
        return state.download_progress;
    },
    pbslider_tab_idx() {
        return state.current_tab_index;
    },
    pb_ch_list() {
        return state.ch_list;
    },
    pb() {
        return state;
    },
};
let _currentUTCTime = [];
let _codecChanged = [];
const actions = {
    leftmenu_click_channel({ dispatch, commit, getters, state }, { status, ch, dev }) {
        commit('playback/choose_channel', getters.pb_ch_list.length ? true : false);

        if (status) {
            if (getters.pb_ch_list.length < 1) {
                commit('playback/add_channel', { dev, ch });
            }
        } else {
            commit('playback/remove_channel', { dev, ch });
            let Activex = getters.playback_plugin;
            if (Activex) {
                if (getters.plugin_type == 'ie') {
                    Activex.PlayBackUnInit({ dev, ch });
                } else if (getters.plugin_type == 'flash') {
                    Activex.PbUnInit(0);
                } else if (getters.plugin_type == 'h5') {
                    state.drawer.records = [];
                }
            }
        }
    },

    ie_draw_records({ dispatch, commit, state, getters }, { DeviceLocalDateTimeStart, SearchResults }) {
        let Activex = getters.playback_plugin;
        if (!Activex) return false;
        //do search records

        let stream_type = 0; //ipc 主码流录像

        SearchResults.forEach(function(el) {
            el.Records = el.Records.map((item) => {
                let extra_secs = item[3] * 60;
                let pc_ipc_extra_secs = item[4] /*- new Date().getTimezoneOffset()*/ * 60;
                return [item[0], item[1], item[2], extra_secs, pc_ipc_extra_secs];
            });

            Activex.PlayBackInit({
                TransProto: 0,
                streamType: stream_type,
                port: getters.rtsp_port,
                ip: getters.ip,
                usrname: getters.tokenA,
                pwd: getters.tokenB,
                dev: el.Dev || 1,
                ch: el.ChannelNo,
                date: DeviceLocalDateTimeStart.substr(0, 8),
                data: el.Records,
                //utc_begintime: result.Data.UtcBegintime,
            });
        });
    },
    flash_draw_records({ dispatch, commit, state, getters }, { DeviceLocalDateTimeStart, SearchResults }) {
        let Activex = getters.playback_plugin;
        if (!Activex) return false;
        //do search records

        let tmp = SearchResults.map((item) => {
            return {
                ChannelNo: item.ChannelNo - 1,
                Records: item.Records.concat(),
            };
        });

        Activex.PbInit(JSON.stringify(tmp), 'rtmp://' + getters.ip + ':' + getters.rtmp_port + '/file', DeviceLocalDateTimeStart.substr(0, 8));
    },
    h5_draw_records({ dispatch, commit, state, getters }, { DeviceLocalDateTimeStart, SearchResults }) {
        let Activex = getters.playback_plugin;
        if (!Activex) return false;
        //do search records
        let stream_type = 0; //ipc 主码流录像

        SearchResults.forEach(function(el) {
            el.Records = el.Records.map((item) => {
                let extra_secs = item[3] * 60;
                let pc_ipc_extra_secs = item[4] * 60;
                return [item[0], item[1], item[2], extra_secs, pc_ipc_extra_secs];
            });

            getters.pb.drawer.records = el.Records;
        });
    },
    ie_playbackplayer_action_trigger({ dispatch, commit, state, getters }, { cmd }) {
        let Activex = getters.playback_plugin;
        if (!getters.is_tyconew) {
            if (state.ch_list.length == 0) {
                alert(getters.current_language.i18n_check_channel_first);
                return;
            }
        }
        if (Activex) {
            switch (cmd) {
                case 'play':
                    Activex.PlayBackStart();
                    break;
                case 'pause':
                    Activex.PlayBackPause();
                    break;
                case 'stop':
                    Activex.PlayBackStop();
                    break;
                case 'fast':
                    Activex.PlayBackFast();
                    break;
                case 'slow':
                    Activex.PlayBackSlow();
                    break;
                case 'capture':
                    Activex.PlayBackCapture();
                    break;
                case 'backup':
                    dispatch('pbslider_tab_change', 0);
                    break;
                case 'frame':
                    Activex.PlayBackFrame();
                    break;
                case 'fullscreen':
                    Activex.FullScreen();
                    break;
                case 'voice':
                    Activex.PlayBackSoundSwitch();
                    break;
            }
        }
    },
    flash_playbackplayer_action_trigger({ dispatch, commit, state, getters }, { cmd }) {
        let Activex = getters.playback_plugin;
        if (!getters.is_tyconew) {
            if (state.ch_list.length == 0) {
                alert(getters.current_language.i18n_check_channel_first);
                return;
            }
        }
        if (Activex) {
            switch (cmd) {
                case 'play':
                    Activex.PbPlay();
                    break;
                case 'pause':
                    Activex.PbPause();
                    break;
                case 'stop':
                    Activex.PbStop();
                    break;
                case 'fast':
                    Activex.PbFast();
                    break;
                case 'slow':
                    Activex.PbSlow();
                    break;
                case 'capture':

                case 'backup':
                    dispatch('pbslider_tab_change', 0);
                    break;
                case 'frame':
                    Activex.PbFrame();
                    break;
                case 'fullscreen':
                    break;
                case 'voice':
                    Activex.PbVoice();
                    break;
            }
        }
    },
    h5_playbackplayer_action_trigger({ dispatch, commit, state, getters }, { cmd }) {
        if (state.ch_list.length == 0) {
            alert(getters.current_language.i18n_check_channel_first);
            return;
        }
        let plugin = state.plugin;
        const pb_utctime_tick = (x) => {
            state.drawer.Play(x.utctime);
            commit('playback/player_StartTime', x.utctime);
        };

        const do_hevc_records_play = () => {
            error('暂不支持hevc 录像回放,绝大多数PC软解hevc效率不够');
            plugin.stop();
        };
        if (plugin) {
            switch (cmd) {
                case 'play':
                    _currentUTCTime.push(EventDisposer(plugin, CVH5Lib.Events.PLAYER_CURRENT_UTCTIME, pb_utctime_tick));
                    _codecChanged.push(EventDisposer(plugin, CVH5Lib.Events.PLAYER_DETECT_VIDEO_CODECID_CHANGED, do_hevc_records_play));

                    plugin.play({
                        url: get_ws_url(getters.ip),
                        protocols: ['video-stream'],
                        cmd: {
                            Type: 1,
                            Ch: 0,
                            Dev: 0,
                            Data: {
                                StartTime: state.player_StartTime,
                                StopTime: state.player_StartTime + 86399,
                                Cmd: 0,
                                Audio: true,
                                Video: true,
                                Smart: false,
                            },
                        },
                    });
                    break;
                case 'pause':
                    plugin.pause();
                    break;
                case 'stop':
                    _currentUTCTime.forEach((fn) => fn());
                    _codecChanged.forEach((fn) => fn());
                    plugin.stop();
                    break;
                case 'fast':
                    //plugin.fast();

                    break;
                case 'slow':
                    //plugin.slow();

                    break;
                case 'frame':
                    break;
                case 'fullscreen':
                    screenfull.toggle(document.querySelector('#playback'));

                    break;
                case 'voice':
                    plugin.SwitchAudio();

                    break;
            }
        }
    },

    pbslider_tab_change({ dispatch, commit, state, getters }, idx) {
        commit('pbslider/tab_index_changed', idx);
        if (idx == 1) {
            commit('backup/activated', false);
            commit('playback/activated', true);
        } else {
            commit('playback/activated', false);
            commit('backup/activated', true);
        }
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
