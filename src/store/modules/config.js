import { addEvent, is_null_or_undefined } from 'common/util';
const state = {
    plugin: null,
    activated: false,
    main_frame: '',
    stream_status: false,
    is_uploading: false, //是否正在升级
    dev: 1, //参数配置 右上角 当前dev ch
    ch: 1, //
    key: '', //刷新组件的key
    vms_remote_autologin: false, //vms,p2p组 远程 自动登录跳转到 某一个tab的标记
    //报警列表
    alarm_list: [],
    shared_dev: 1, //config_init的状态
    sahred_ch: 1,
};

const mutations = {
    ['config/plugin_change'](state, payload) {
        state.plugin = payload;
    },
    ['config/activated'](state, payload) {
        state.activated = payload;
    },
    ['config/main_frame'](state, payload) {
        state.main_frame = payload;
    },
    ['config/plugin_stream_status'](state, payload) {
        state.stream_status = payload;
    },
    ['config/is_uploading_file'](state, payload) {
        state.is_uploading = payload;
    },
    ['config/dev'](state, payload) {
        state.dev = payload;
        
    },
    ['config/ch'](state, payload) {
        state.ch = payload;
       
    },
    ['config/alarm_list_changed'](state, payload) {
        state.alarm_list = payload;
    },
    /**
     * 属性改变
     * @param {*} state
     * @param {*} payload  {plugin|activated|main_frame|stream_status|is_uploading|dev|ch|key}
     */
    ['config/value_changed'](state, payload) {
        $.extend(true, state, payload);
    },
};

const getters = {
    config_activated(state) {
        return state.activated;
    },
    main_frame(state) {
        return state.main_frame;
    },
    config_plugin(state) {
        return state.plugin;
    },
    config(state) {
        return state;
    },
};
let copy_alarm_list = [];
const actions = {
    click_configmenu_item({ commit, state, dispatch }, { name }) {
        if (state.is_uploading) return;
        commit('config/main_frame', name);
    },

    config_no_right({ commit, state }) {
        commit('errorCode/change', 0);
        commit('config/main_frame', 'CVConfigMsg');
    },
    ie_config_plugin_init({ commit, getters, state, dispatch }, info) {
        //fuck IE9
        //Object.prototype.toString.call(undefined) ==> [object Undefined]
        //Object.prototype.toString.call(window.xxxx) ==> [object Window]
        //导致is_null_or_undefined判断失效
        // if (is_null_or_undefined(dev));
        // if (is_null_or_undefined(ch));
        msg(info);
        let mode, ch, dev, reopen;
        if (typeof info.dev == 'undefined') {
            dev = 1;
        } else {
            dev = info.dev;
        }
        if (typeof info.ch == 'undefined') {
            ch = 1;
        } else {
            ch = info.ch;
        }
        if (typeof info.reopen == 'undefined') {
            reopen = false;
        } else {
            reopen = info.reopen;
        }
        if (typeof info.mode == 'undefined') {
            mode = 0;
        } else {
            mode = info.mode;
        }
        //  dev = dev || 1;
        //  ch = ch || 1;
        // reopen = reopen || false;
        msg('ie_config_plugin_init', mode, ch, dev);

        //change state
        if (state.plugin.SetDrawType) {
            state.plugin.SetDrawType(mode, -1);
        } else if (state.plugin.DoInit) {
            state.plugin.DoInit({
                state: mode,
            });
        }

        msg('dev:', state.shared_dev, dev);
        if (state.shared_dev != dev || state.shared_ch != ch || reopen) {
            commit('config/plugin_stream_status', false);
        }

        msg('stream status', state.stream_status);
        if (state.stream_status == false) {
            msg('config stream open', mode, dev, ch);
            state.plugin.DoInit({
                streamType: getters.factory_info.IsOfFishEye == 'y' ? 0 : 1,
                transProto: 1,
                ch /*: state.shared_ch*/,
                ip: getters.ip,
                port: getters.rtsp_port,
                usrname: getters.tokenA,
                pwd: getters.tokenB,
                dev /*: dev ? dev : state.shared_dev*/,
            });
            commit('config/value_changed', { shared_dev: dev });
            commit('config/value_changed', { shared_ch: ch });
            commit('config/plugin_stream_status', true);
        }
    },
    flash_config_plugin_init({ commit, getters, state, dispatch }, { mode, dev }) {
        if (state.stream_status == false) {
            state.plugin.InitConfigPlayers(
                ['rtmp://', getters.ip, ':', getters.rtmp_port, '/live'].join(''),
                getters.factory_info.IsOfFishEye == 'y' ? 'ch01.264' : 'ch01_sub.264',
                mode
            );
            commit('config/plugin_stream_status', true);
        }
    },
    h5_config_plugin_init({ commit, getters, state, dispatch }, { mode, dev, ch, reopen = false }) {
        if (is_null_or_undefined(dev)) dev = 1;
        if (is_null_or_undefined(ch)) ch = 1;
        msg('h5_config_plugin_init', mode, dev, ch, reopen);

        msg('dev:', state.shared_dev, dev);
        if (state.shared_dev != dev || state.shared_ch != ch || reopen) {
            commit('config/plugin_stream_status', false);
        }
        msg('stream status', state.stream_status);
        if (state.stream_status == false) {
            msg('config stream open', mode, dev, ch);
            let tmpObj = {
                url: get_ws_url(getters.ip),
                protocols: ['video-stream'],
                cmd: {
                    Type: 0,
                    Ch: ch - 1,
                    Dev: dev - 1,
                    Data: {
                        StreamId: 1,
                        Video: true,
                        Audio: false,
                        Smart: false,
                    },
                },
            };
            state.plugin.play(tmpObj);

            commit('config/value_changed', { shared_dev: dev });
            commit('config/value_changed', { shared_ch: ch });
            commit('config/plugin_stream_status', true);
        }
    },
    config_plugin_uninit({ commit, state }, {}) {
        msg(['config_plugin_uninit', state.plugin]);
        if (state.plugin) {
            msg(['current stream status:', state.stream_status]);
            if (state.stream_status) {
                /*
                if(getters.plugin_type == 'ie'){
          state.plugin.DoUnInit({});
        }else if(getters.plugin_type == 'flash'){
           state.plugin.UnInitConfigPlayers()
                }
                */
                commit('config/plugin_stream_status', false);
            }
        }
    },
    /**
     * 获取报警信息
     * @param { } param0
     */
    ie_get_alarm({ commit, state, dispatch, getters }) {
        msg('ie_get_alarm');
        const alarm_msg_process = function(msgObj) {
            let obj = JSON.parse(JSON.stringify(msgObj));
            obj.current_time = new Date().getTime();
            if (obj.Detect && obj.Detect.startsWith('Helmet')) {
                obj.ch = parseInt(obj.Detect.substring(6));
                // msg(["通道是多少",obj.Detect,obj.ch])
            }
            if (obj.Human && obj.Human.startsWith('Temperature')) {
                obj.ch = parseInt(obj.Human.substring(11));
                // msg(["通道是多少",obj.Detect,obj.ch])
            }
            if (obj.Face && obj.Face.startsWith('Mask')) {
                obj.ch = parseInt(obj.Face.substring(4));
                // msg(["通道是多少",obj.Detect,obj.ch])
            }
            if (obj.InputToken) {
                obj.ch = parseInt(obj.InputToken.substring(7));
            }
            if (obj.Detect && obj.Detect.startsWith('Ewall')) {
                obj.ch = parseInt(obj.Detect.substring(5));
            }
            if (obj.UserNum) {
                obj.ch = parseInt(obj.UserNum.substring(4));
            }
            if (obj.EthNum) {
                obj.ch = parseInt(obj.EthNum.substring(3));
            }
            if (obj.DiskNum) {
                obj.ch = parseInt(obj.DiskNum.substring(4));
            }
            if (!obj.utc_start) {
                obj.utc_start = obj.utc_time;
            }
            //预处理obj
            obj.utc_start = obj.utc_start.replace('T', ' ');
            obj.utc_stop = obj.utc_stop.replace('T', ' ');
            if (obj.id) obj.ch += '_' + obj.id;
            let idx = copy_alarm_list.findIndex((el) => el.topic == obj.topic && el.ch == obj.ch);
            if (idx == -1) {
                obj.tid = setTimeout(() => {
                    obj.State = 'False';
                    obj.tid = 0;
                    copy_alarm_list.splice(0, 1);
                    commit('config/alarm_list_changed', JSON.parse(JSON.stringify(copy_alarm_list)));
                }, 5000);
                // msg('new add', new Date(), obj.tid);
                copy_alarm_list.push(obj);
            } else {
                $.extend(true, copy_alarm_list[idx], obj); //合并更新
                //  msg('update', new Date());
                if (copy_alarm_list[idx].tid > 0) {
                    //     msg('clear tid', copy_alarm_list[idx].tid);
                    clearTimeout(copy_alarm_list[idx].tid);
                    copy_alarm_list[idx].tid = 0;
                }
                copy_alarm_list[idx].tid = setTimeout(() => {
                    //    msg('5s timeout,clear item', new Date(), copy_alarm_list[idx].tid);
                    obj.State = 'False';
                    copy_alarm_list.splice(idx, 1);
                    commit('config/alarm_list_changed', JSON.parse(JSON.stringify(copy_alarm_list)));
                }, 5000);
                //  msg('set tid', copy_alarm_list[idx].tid);
            }
            commit('config/alarm_list_changed', JSON.parse(JSON.stringify(copy_alarm_list)));
        };
        //监听报警
        //每种类型的ipc只保留最新发生的
        let Activex = state.plugin;
        msg('!!!!!!!', Activex);
        if (Activex) {
            Activex.AddPluginEvent({
                event_name: 'alarm_msg',
                func: alarm_msg_process,
            });
            addEvent(Activex, 'alarm_msg', alarm_msg_process);
            //	recvMsg(Activex, 'alarm_msg', alarm_msg_process, 1000);
            //开启报警
            Activex.SetupAlarm({
                ip: getters.ip,
                port: getters.rtsp_port,
                usrname: getters.tokenA,
                pwd: getters.tokenB,
            });
        }
    },
    flash_get_alarm({ commit, state, dispatch, getters }) {
        //flash http alarm
        const getAlarm = () => {
            dispatch('request', {
                url: '/goform/frmQueryAlarmInfo',
                Ch: 1,
                Type: 0,
                Data: {},
                timeout: 3000,
            }).then((r) => {
                if (r.Result == 0) {
                    let start, stop;
                    if (r.Data.AlarmInfo) {
                        let ar = r.Data.AlarmInfo.map((item) => {
                            start = new Date(item.StartTime * 1000).toISOString();
                            stop = new Date(item.StopTime * 1000).toISOString();
                            start = start.substr(0, start.lastIndexOf('.')).replace('T', ' ');
                            stop = stop.substr(0, stop.lastIndexOf('.')).replace('T', ' ');
                            return {
                                State: item.State ? 'true' : 'false',
                                utc_start: start,
                                utc_stop: stop,
                                ch: item.Source,
                                topic: item.MinorType,
                            };
                        });
                        commit('config/alarm_list_changed', ar);
                    }
                    setTimeout(getAlarm, 5000);
                }
            });
        };
        setTimeout(getAlarm, 5000);
    },
    h5_get_alarm({ commit, state, dispatch, getters }) {
        function time_split(str) {
            let arr = str.split('');
            arr.splice(12, 0, ':');
            arr.splice(10, 0, ':');
            arr.splice(8, 0, ' ');
            arr.splice(6, 0, '-');
            arr.splice(4, 0, '-');
            return arr.join('');
        }
        let ws_alarm = new WebSocket(get_ws_url(getters.ip), ['alarm-notify']);
        ws_alarm.onopen = function() {
            ws_alarm.send(
                JSON.stringify({
                    Type: 2,
                    Ch: 0,
                    Dev: 0,
                    Data: {},
                })
            );
        };
        ws_alarm.onmessage = function(evt) {
            let alarminfo = JSON.parse(evt.data);
            msg(alarminfo);
            /*
            "RegionId": 0 // 图像偏色
            "RegionId": 1,亮度过暗
            RegionId":2 //亮度过亮
            RegionId ":7 视频丢失
            "RegionId": 8 图像模糊
            */
            alarminfo.current_time = new Date().getTime();
            //暂定是 之前没出现过得报警
            let fresh_alarm = true;
            //当前显示列表
            let list = copy_alarm_list;
            alarminfo.StartTime = time_split(alarminfo.StartTime);
            alarminfo.StopTime = time_split(alarminfo.StopTime);
            let idx = -1;
            list.some((item, index) => {
                if (item.AlarmName == alarminfo.AlarmName && item.Channel == alarminfo.Channel && item.RegionId == alarminfo.RegionId) {
                    fresh_alarm = false;
                    //更新
                    if (item.tid) {
                        clearTimeout(item.tid);
                    }
                    alarminfo.tid = setTimeout(() => {
                        let npos = list.findIndex(
                            (item) => item.AlarmName == alarminfo.AlarmName && item.Channel == alarminfo.Channel && item.RegionId == alarminfo.RegionId
                        );
                        if (npos != -1) {
                            list.splice(npos, 1);
                            msg('10S timeout,clear item at pos:', npos);
                        }
                        commit('config/alarm_list_changed', list.concat());
                    }, 6000);
                    list[index] = alarminfo;
                    msg('refresh item!');
                }
                return !fresh_alarm;
            });
            if (fresh_alarm) {
                //标记延时,5s后清除
                alarminfo.tid = setTimeout(() => {
                    let npos = list.findIndex(
                        (item) => item.AlarmName == alarminfo.AlarmName && item.Channel == alarminfo.Channel && item.RegionId == alarminfo.RegionId
                    );
                    if (npos != -1) {
                        list.splice(npos, 1);
                        msg('10S timeout,clear item at pos:', npos);
                    }
                    commit('config/alarm_list_changed', list.concat());
                }, 6000);

                list.push(alarminfo);
                msg('new add!');
            }
            commit('config/alarm_list_changed', list.concat());
        };
        ws_alarm.onclose = function() {
            // 关闭 websocket
            msg('alarm_ws:连接已关闭...');
        };
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
