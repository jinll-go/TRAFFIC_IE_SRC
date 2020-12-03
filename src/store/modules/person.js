import Vue from 'vue'; //此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败
import { EventDisposer } from 'common/util';
const state = {
    person_activated: false,
    isShowDialog: false,
    PersonIndex: 'Counter',
    plugin: null,
    recordTime: 0,
    pb_state: 'STOP',
    streamContext: {},
};

const mutations = {
    ['person/activated'](state, payload) {
        state.person_activated = payload;
    },
    ['person/isShowDialog'](state, payload) {
        state.isShowDialog = payload;
    },
    ['person/plugin_change'](state, payload) {
        // state.plugin = document.getElementById('person');
        state.plugin = payload;
        msg('人形tabvuex', state.plugin);
    },
    ['person/recordTime_change'](state, payload) {
        state.recordTime = payload;
        // msg("统计时间！！！",state.recordTime)
    },
    ['person/pb_state_changed'](state, payload) {
        state.pb_state = payload;
    },
    ['person/streamContext_changed'](state, payload) {
        state.streamContext = payload;
        msg('store变了吗', state.streamContext);
    },
};

const getters = {
    person_activated(state) {
        return state.person_activated;
    },
    person(state) {
        return state;
    },
    person_plugin(state) {
        return state.plugin;
    },
    person_pb_state(state) {
        return state.pb_state;
    },
};
let _currentTime = [];
const actions = {
    /*person_plugin_change({ dispatch, commit, state, getters }, { plugin }) {
        if (!plugin) {
            plugin = $("#person")[0];
        }

        commit("person/plugin_change", plugin);

		const cb = function(obj) {
                var tmp = obj.status.split("_")[1];

                if (tmp.toUpperCase() != "VOICE") {
                    //播放状态回调

                    commit("person/pb_state_changed", tmp || "STOP");
                }
		};
		plugin.AddPluginEvent({
			event_name: "pb_msg",
			func: cb,
        });
		addEvent(plugin, "pb_msg", cb);
    },*/
    ie_personplayer_action_trigger({ dispatch, commit, state, getters }, { cmd }) {
        let Activex = getters.person_plugin;
        if (Activex) {
            switch (cmd) {
                case 'play':
                    if (this.Status) {
                        //暂停恢复
                        Activex.PlayBackStart();
                    } else {
                        //stop时正常播放
                        Activex.PlayByRange(getters.person.streamContext);
                    }
                    break;
                case 'pause':
                    Activex.PlayBackPause();
                    break;
                case 'stop':
                    Activex.PlayBackStop();
                    break;
            }
        }
    },
    h5_personplayer_action_trigger({ dispatch, commit, state, getters }, { cmd }) {
        let plugin = getters.person_plugin;
        msg('1111', cmd, plugin);
        const person_utctime_tick = (x) => {
            msg('222', x, x.utctime)
            commit('person/recordTime_change', x.utctime);
        };

        if (plugin) {
            switch (cmd) {
                case 'play':
                    _currentTime.push(EventDisposer(plugin, CVH5Lib.Events.PLAYER_CURRENT_UTCTIME, person_utctime_tick));

                    plugin.play({
                        url: get_ws_url(getters.ip),
                        protocols: ['video-stream'],
                        cmd: {
                            Type: 1,
                            Ch: 0,
                            Dev: 0,
                            Data: {
                                StartTime: state.recordTime - 5,
                                StopTime: state.recordTime + 10,
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
                    _currentTime.forEach((fn) => fn());
                    plugin.stop();
                    break;

            }
        }






    },
    person_recordTime_change({ dispatch, commit, state, getters }, time) {
        commit('person/recordTime_change', time);
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
