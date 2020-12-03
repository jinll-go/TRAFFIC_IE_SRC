import { addEvent, rangeArray, EventDisposer } from 'common/util';

const state = {
    preview_activated: undefined,
    alarm_activated: undefined,
    custom_activated: undefined,
    plugin: null,
    // DevicePara:{},
    framerate_avr: '',

    showSel: 0,

    isShowComparisonOK: false,
    record_state: false,

    color: {
        brightness: 8,
        contrast: 8,
        saturation: 8,
        hue: 8,
    },
    speed: 5,
    dialog: '' /*弹出层窗口的类型 为空表示当前没有显示的弹出窗口*/,
    preview_right: 0,
    scale_level: 1,
    ptz_state: true,
    stream_type: 0,
    stream_state: false,

    //stream_info: [], //记录预览所有通道的播放状态

    dev: 1,
    ch: 1,
    is_horizon: false,

    default_stream: 0,

    PTZDomAbility: {
        MaxPersetNum: 256,
        MaxPatrolPathNum: 8,
        MaxPersetNumPrePatrolPath: 8,
        MaxPatternNum: 4,
        MaxScheduleNodePreDay: 10,
        ParkAndScheduleTimeMin: 5,
        ParkAndScheduleTimeMax: 720,
        DomeVersion: '',
    },
    track_id: 1, //轨迹的值

    voicetalk_recorder: null,
    vt_ws: null,
    voice_talk_state: false, //对讲开关状态
    voice_state: false, //预览声音状态
};

const mutations = {
    ['preview/activated'](state, payload) {
        state.preview_activated = payload;
    },
    ['alarm/activated'](state, payload) {
        state.alarm_activated = payload;
    },
    ['custom/activated'](state, payload) {
        state.custom_activated = payload;
    },
    /* ['preview/frmDevicePara'](state,payload){
    state.DevicePara = payload;
  },*/
    /**
     * 更新 播放信息的记录
     * Dev >= 1
     * Ch >=1
     * StreamId  流id 0-main 1-sub 3-thrid 4-fourth 5-fifth
     * RecordStatus 是否正在录像
     * @param {*} state
     * @param {Ch, Dev, StreamId} object

    ['preview/streaminfo_changed'](state, { Ch, Dev, StreamId }) {
        let idx = state.stream_info.findIndex((val) => {
            return val.Dev == Dev && val.Ch == Ch;
        });
        if (idx != -1) {
            state.stream_info[idx] = {
                Ch,
                Dev,
                StreamId,
            };
        } else {
            state.stream_info.push({ Ch, Dev, StreamId });
        }
    },*/

    ['preview/plugin_change'](state, payload) {
        state.plugin = payload;
    },
    ['preview/framerate_avr'](state, payload) {
        state.framerate_avr = payload;
    },
    ['preview/record_state_changed'](state, payload) {
        state.record_state = payload;
    },
    ['preview/voice_talk_state_changed'](state, payload) {
        state.voice_talk_state_changed = payload;
    },
    ['preview/plugin_color_changed'](state, payload) {
        $.extend(true, state.color, payload);
    },

    ['preview/speed_changed'](state, payload) {
        state.speed = payload;
    },
    ['preview/dialog_changed'](state, payload) {
        state.dialog = payload;
    },

    ['preview/preview_right_changed'](state, payload) {
        state.preview_right = payload;
    },
    ['preview/scale_level_changed'](state, payload) {
        state.scale_level = payload;
    },
    ['preview/ptz_state_changed'](state, payload) {
        state.ptz_state = payload;
    },
    ['preview/stream_type_changed'](state, payload) {
        state.stream_type = payload;
    },
    ['preview/stream_state_changed'](state, payload) {
        state.stream_state = payload;
    },

    ['preview/dev_ch_changed'](state, payload) {
        state.dev = payload.dev;
        state.ch = payload.ch;
    },
    ['preview/is_horizon_changed'](state, payload) {
        state.is_horizon = payload;
    },

    ['preview/showSel_changed'](state, payload) {
        state.showSel = payload;
        state.face_list = [];
    },
    ['preview/default_stream_changed'](state, payload) {
        state.default_stream = payload;
    },
    ['preview/is_ShowComparison_OK'](state, payload) {
        state.isShowComparisonOK = payload;
    },
    ['preview/ptz_Ability_change'](state, payload) {
        state.PTZDomAbility = payload;
    },
    ['preview/track_id_change'](state, payload) {
        state.track_id = payload;
    },
};

const getters = {
    preview_ptz_ability(state) {
        return state.PTZDomAbility;
    },
    preview_activated(state) {
        return state.preview_activated;
    },
    alarm_activated(state) {
        return state.alarm_activated;
    },
    custom_activated(state) {
        return state.custom_activated;
    },
    preview_plugin(state) {
        return state.plugin;
    },
    framerate_avr(state) {
        return state.framerate_avr;
    },
    record_state(state) {
        return state.record_state;
    },
    voice_talk_state(state) {
        return state.voice_talk_state;
    },
    plugin_color(state) {
        return state.color;
    },
    preview_right(state) {
        return state.preview_right;
    },
    preview(state) {
        return state;
    },
    ptz_state(state) {
        return state.ptz_state;
    },
    stream_type(state) {
        return state.stream_type;
    },
    stream_state(state) {
        return state.stream_state;
    },
    face_list(state) {
        return state.face_list;
    },
    comparison_list(state) {
        return state.comparison_list;
    },
    showSel(state) {
        return state.showSel;
    },
};
let _codecChanged = [];
let _encodeToG711u = [];
const actions = {
    /*
  弹出层 页面关闭时触发
   */
    ['dialog/exit']({ dispatch, commit, state, getters }, name) {
        if (name == 'SETSCAN') {
            dispatch('PTZExtend/SetScan', { Index: getters.ptzextend.SetScanIndex, Type: 1 });
        } else if (name == 'PRIVACYMASK') {
            if (getters.factory_info.IsofDome == 'y_ex') {
                state.plugin.DrawFuncMode = { mode: 2 };
            } else {
                dispatch('PTZExtend/SetCover', { Index: getters.ptzextend.privacymask_idx, Type: 3 });
            }
        }
        //hide 弹出层的背景iframe
        $('#backlayer').hide();
        commit('preview/dialog_changed', '');
    },

    /**
     * 预览 打开码流
     * val:0-主码流 1-子码流 2-弃用 3-三码流 4-四码流 5-五码流
     */
    ie_switch_stream({ commit, state, getters, dispatch }, { val }) {
        //预览切换码流
        let Activex;
        //if (!getters.preview_right) return;
        if ((Activex = state.plugin)) {

            if (getters.is_fisheye) {
                let chList = rangeArray(1, getters.ChanNum);
                Activex.OpenAllStream({
                    streamType: val,
                    transProto: 1,
                    chList: chList,
                    ip: getters.ip,
                    port: getters.rtsp_port,
                    usrname: getters.tokenA,
                    pwd: getters.tokenB,
                });
            } else if (getters.is_normal) {
                Activex.StopStream({ ch: 1 });
                msg(['playstream', getters.ip, getters.rtsp_port, getters.tokenA, getters.tokenB, val]);
                Activex.PlayStream({
                    streamType: val,
                    transProto: 1,
                    ch: 1,
                    ip: getters.ip,
                    port: getters.rtsp_port,
                    usrname: getters.tokenA,
                    pwd: getters.tokenB,
                });
            } else if (getters.is_temperature) {
                Activex.PlayStream({
                    streamType: 0,
                    transProto: 1,
                    ch: 1,
                    dev: 1,
                    ip: getters.ip,
                    port: getters.rtsp_port,
                    usrname: getters.tokenA,
                    pwd: getters.tokenB,
                    wndidx: 0,
                });
                Activex.PlayStream({
                    streamType: 0,
                    transProto: 1,
                    ch: 1,
                    dev: 2,
                    ip: getters.ip,
                    port: getters.rtsp_port,
                    usrname: getters.tokenA,
                    pwd: getters.tokenB,
                    wndidx: 1,
                });
            }

            let color = Activex.GetColor({ ch: 1 });
            //开流之后
            setTimeout((_) => {
                commit('preview/plugin_color_changed', color);
            }, 250);
        }
    },
    flash_switch_stream({ commit, state, getters, dispatch }, { val }) {
        let Activex = state.plugin;
        msg([getters.ip, getters.rtmp_port]);
        let rtmp_url = ['rtmp://', getters.ip, ':', getters.rtmp_port, '/live'].join('');
        if (getters.factory_info.IsOfFishEye == 'y') {
            let chList = rangeArray(1, getters.ChanNum);
            chList = chList.map((item) => {
                return {
                    ch: item,
                    stream_type: 0,
                };
            });
            Activex.OpenDeviceAll(rtmp_url, JSON.stringify(chList));
        } else {
            if (val == '0') {
                // Activex.StopStream(1, rtmp_url, 'ch01_sub.264');
                Activex.PlayStream(1, rtmp_url, 'ch01.264');
            } else if (val == '1') {
                //Activex.StopStream(0, rtmp_url, 'ch01.264');
                Activex.PlayStream(1, rtmp_url, 'ch01_sub.264');
            } else if (val == '3') {
                //三码流
                Activex.PlayStream(1, rtmp_url, 'ch01_third.264');
            } else if (val == '4') {
                Activex.PlayStream(1, rtmp_url, 'ch01_fourth.264');
            } else if (val == '5') {
                Activex.PlayStream(1, rtmp_url, 'ch01_fifth.264');
            }
            //Activex.PlaySmart(is_play_rule,is_play_result);
        }
    },
    /**
     * 预览 打开码流
     * val:0-主码流 1-子码流 2-三码流 3-四码流 4-五码流
     */
    h5_switch_stream({ commit, state, getters, dispatch }, { val, op }) {
        if (!state.plugin) return;
        if (!getters.preview_right) return;
        const codec_changed = (player, info) => {
            msg('codec changed fired!', player, info);

            dispatch('h5_switch_stream', { op: 'open', val: 1 });
        };
        if (getters.is_temperature) {
            if (op == 'open') {
                state.plugin.forEach((plugin, idx) => {
                    _codecChanged.push(EventDisposer(plugin, CVH5Lib.Events.PLAYER_DETECT_VIDEO_CODECID_CHANGED, codec_changed));
                    let { EnableRule, EnableResult, Face_draw_id_score } = getters.base.rtspplugin_params;
                    plugin.smartconfig = {
                        rule: !!EnableRule && idx == 0,
                        result: !!EnableResult,
                        draw_extrainfo: !!Face_draw_id_score,
                    };
                    if (idx == 0) {
                        plugin.set_tempmaparea(getters.temperature.DetectTempAreaMappingInfo);
                    }
                });

                state.plugin[0].play({
                    url: get_ws_url(getters.ip),
                    protocols: ['video-stream'],
                    cmd: {
                        Type: 0,
                        Ch: 0,
                        Dev: 0,
                        Data: {
                            StreamId: val,
                            Video: true,
                            Audio: true,
                            Smart: true,
                        },
                    },
                });
                /*commit('preview/streaminfo_changed', {
                    Ch: 1,
                    Dev: 1,
                    StreamId: val,
                });*/
                state.plugin[1].play({
                    url: get_ws_url(getters.ip),
                    protocols: ['video-stream'],
                    cmd: {
                        Type: 0,
                        Ch: 0,
                        Dev: 1,
                        Data: {
                            StreamId: val,
                            Video: true,
                            Audio: false,
                            Smart: true,
                        },
                    },
                });
                /*commit('preview/streaminfo_changed', {
                    Ch: 1,
                    Dev: 2,
                    StreamId: val,
                });*/
            } else if (op == 'close') {
                state.plugin.forEach((item) => {
                    item.stop();
                });
                _codecChanged.forEach((e) => e());
            }
        } else if (getters.is_fisheye) {
            if (op == 'open') {
                state.plugin.forEach((item, idx) => {
                    _codecChanged.push(EventDisposer(item, CVH5Lib.Events.PLAYER_DETECT_VIDEO_CODECID_CHANGED, codec_changed));

                    let { EnableRule, EnableResult, Face_draw_id_score } = getters.base.rtspplugin_params;
                    item.smartconfig = {
                        rule: !!EnableRule && idx == 0,
                        result: !!EnableResult,
                        draw_extrainfo: !!Face_draw_id_score,
                    };
                    if (idx < 5 ) {
                        item.play({
                            url: get_ws_url(getters.ip),
                            protocols: ['video-stream'],
                            cmd: {
                                Type: 0,
                                Ch: idx,
                                Dev: 0,
                                Data: {
                                    StreamId: val,
                                    Video: true,
                                    Audio: true,
                                    Smart: true,
                                },
                            },
                        });
                        /*commit('preview/streaminfo_changed', {
                            Ch: idx + 1,
                            Dev: 1,
                            StreamId: val,
                        });*/
                    }
                });
            } else if (op == 'close') {
                state.plugin.forEach((item) => {
                    item.stop();
                });
                _codecChanged.forEach((e) => e());
            }
        } else if (getters.is_normal) {
            if (op == 'open') {
                _codecChanged.push(EventDisposer(state.plugin, CVH5Lib.Events.PLAYER_DETECT_VIDEO_CODECID_CHANGED, codec_changed));

                let { EnableRule, EnableResult, Face_draw_id_score } = getters.base.rtspplugin_params;
                state.plugin.smartconfig = {
                    rule: !!EnableRule,
                    result: !!EnableResult,
                    draw_extrainfo: !!Face_draw_id_score,
                };

		//websocket 码流id，三码流 - 2  四码流-3 五码流-4
                if (val >= 3) {
                    val--;
                }
                let tmpObj = {
                    url: get_ws_url(getters.ip),
                    protocols: ['video-stream'],
                    cmd: {
                        Type: 0,
                        Ch: 0,
                        Dev: 0,
                        Data: {
                            StreamId: val,
                            Video: true,
                            Audio: true,
                            Smart: true,
                        },
                    },
                };
                state.plugin.play(tmpObj);
                //标记当前的流类型id，之后tab切换 开关流需要参考
                /*commit('preview/streaminfo_changed', {
                    Ch: 1,
                    Dev: 1,
                    StreamId: val,
                });*/
            } else if (op == 'close') {
                _codecChanged.forEach((e) => e());
                state.plugin.stop();
            }
        }
    },
    /**
     * 预览获取帧率.仅activex/npapi支持.
     * @param {*} param0
     * @param {*} param1
     */
    get_framerate({ commit, state, dispatch, getters }, {}) {
        //开始监听 码率帧率变化
        let Activex = state.plugin;
        if (Activex) {
            const avr_framerate_cb = function(obj) {
                //state.framerate_avr = Math.round(8*obj.avr_kbs)+" kbps | "+ framerate + ":"+Math.round(obj.avr_framerate) + " fps";

                let str = `${getters.current_language.i18n_bitrate}:${Math.round(8 * obj.avr_kbs)} kbps | ${
                    getters.current_language.i18n_framerate
                }:${Math.round(obj.avr_framerate.toFixed(1))} fps`;
                //commit('preview/framerate_avr', str);
                $('#framerate_avr').html(str);
            };

            //监听帧率码率变化
            Activex.AddPluginEvent({
                event_name: 'avr_framerate_kbs_msg',
                func: avr_framerate_cb,
            });

            addEvent(Activex, 'avr_framerate_kbs_msg', avr_framerate_cb);
            //recvMsg(Activex, 'avr_framerate_kbs_msg', avr_framerate_cb, 1000);

            /**
             js array concat slice 对象 和数组的数组都是浅拷贝
            */



            //监听网络球机隐私遮蔽
            const ipc_ptzdome_privacymask_cb = async function(obj) {
                msg(['ipc_ptzdome_privacymask_msg', obj.left, obj.top, obj.right, obj.bottom]);

                let Data = {};

                Data['Rect' + getters.ptzextend.privacymask_idx] = {
                    X: parseInt(obj.left * 704),
                    Y: parseInt(obj.top * 576),
                    W: parseInt((obj.right - obj.left) * 704),
                    H: parseInt((obj.bottom - obj.top) * 576),
                };

                let ret = await dispatch('PTZExtend/SetCover', { Type: 1, Data });
            };
            Activex.AddPluginEvent({
                event_name: 'ipc_ptzdome_privacymask_msg',
                func: ipc_ptzdome_privacymask_cb,
            });
            addEvent(Activex, 'ipc_ptzdome_privacymask_msg', ipc_ptzdome_privacymask_cb);
        }
    },

    ie_preview_plugin_callbackmsg({ commit, state, getters }, {}) {
        let Activex = state.plugin;
        if (Activex) {
            const plugin_cb = function(obj) {
                switch (obj.type) {
                    case 'VOICE_OPENED_ALREADY':
                        window.toastr.error(getters.current_language.i18n_plugin_msg_1);
                        break;
                    case 'VOICE_TALK_OPENED_ALREADY':
                        window.toastr.error(getters.current_language.i18n_plugin_msg_2);
                        break;
                    // case "VOICE_TALK_CHANNEL_OPENED_ALREADY"://nvr
                    //   alert(getters.current_language.i18n_plugin_msg_3);
                    // break;
                }
            };

            Activex.AddPluginEvent({
                event_name: 'plugin_msg',
                func: plugin_cb,
            });
            addEvent(Activex, 'plugin_msg', plugin_cb);

            const streamready_cb = (obj) => {
                msg('streamready', obj);
                //isPlaying isRecord streamType ch dev
                commit('preview/stream_type_changed', obj.streamType);
                commit('preview/stream_state_changed', false);
                //if(typeof(obj.isPlaying) != 'undefined' && obj.isRecord  != 'undefined'
                //  && obj.streamType  != 'undefined'&& obj.ch != 'undefined'){

                let zTree = $.fn.zTree.getZTreeObj('preview_tree');
                if (zTree) {
                    let node;
                    if (getters.is_multisensor) {
                        node = zTree.getNodesByParam('id', [obj.dev, '_', obj.ch].join(''), null);
                    } else {
                        //fisheye normal
                        node = zTree.getNodesByParam('ch', obj.ch, null);
                    }
                    if (node.length) {
                        if (!getters.is_fisheye) {
                            node[0].streamStatus = obj.streamType;
                        }
                        node[0].recordStatus = obj.isRecord;
                        zTree.updateNode(node[0]);
                    }
                }
                commit('preview/dev_ch_changed', { dev: obj.dev, ch: obj.ch });
                let color = Activex.GetColor({
                    dev: obj.dev,
                    ch: obj.ch,
                });
                commit('preview/plugin_color_changed', color);
                //}
            };
            Activex.AddPluginEvent({
                event_name: 'streamready',
                func: streamready_cb,
            });
            addEvent(Activex, 'streamready', streamready_cb);

            const streamclosed_cb = (obj) => {
                commit('preview/stream_state_changed', true);
                let zTree = $.fn.zTree.getZTreeObj('preview_tree');
                if (zTree) {
                    let node;
                    if (getters.is_multisensor) {
                        node = zTree.getNodesByParam('id', [obj.dev, '_', obj.ch].join(''), null);
                    } else {
                        node = zTree.getNodesByParam('ch', obj.ch, null);
                    }

                    if (node.length) {
                        node[0].streamStatus = -1;
                        node[0].recordStatus = 0;
                        zTree.updateNode(node[0]);
                    }
                }
            };
            Activex.AddPluginEvent({
                event_name: 'streamclosed',
                func: streamclosed_cb,
            });
            addEvent(Activex, 'streamclosed', streamclosed_cb);

            const focuswndchanged_cb = (obj) => {
                if (obj.isPlaying && obj.dev != -1 && obj.ch != -1) {
                    commit('preview/dev_ch_changed', { dev: obj.dev, ch: obj.ch });
                    let color = Activex.GetColor({
                        dev: obj.dev,
                        ch: obj.ch,
                    });
                    commit('preview/plugin_color_changed', color);
                }
            };
            Activex.AddPluginEvent({
                event_name: 'focuswndchanged_msg',
                func: focuswndchanged_cb,
            });
            addEvent(Activex, 'focuswndchanged_msg', focuswndchanged_cb);
        }
    },
    h5_preview_plugin_callbackmsg({ commit, state, getters }, { plugin }) {
        plugin.on(CVH5Lib.Events.PLAYER_STREAM_OPENED, (obj) => {
            msg('stream opened', obj);
            /*let zTree = $.fn.zTree.getZTreeObj('preview_tree');
                if (zTree) {
                    let node;
                    if (getters.is_multisensor) {
                        node = zTree.getNodesByParam('id', [obj.dev, '_', obj.ch].join(''), null);
                    } else {
                        //fisheye normal
                        node = zTree.getNodesByParam('ch', obj.ch, null);
                    }
                    if (node.length) {
                        if (!getters.is_fisheye) {
                            node[0].streamStatus = obj.streamType;
                        }
                        node[0].recordStatus = obj.isRecord;
                        zTree.updateNode(node[0]);
                    }
                }*/
        });

        plugin.on(CVH5Lib.Events.PLAYER_STREAM_CLOSED, (obj) => {
            msg('stream opened', obj);
            /*let zTree = $.fn.zTree.getZTreeObj('preview_tree');
                if (zTree) {
                    let node;
                    if (getters.is_multisensor) {
                        node = zTree.getNodesByParam('id', [obj.dev, '_', obj.ch].join(''), null);
                    } else {
                        node = zTree.getNodesByParam('ch', obj.ch, null);
                    }

                    if (node.length) {
                        node[0].streamStatus = -1;
                        node[0].recordStatus = 0;
                        zTree.updateNode(node[0]);
                    }
                }*/
        });

        //events must off  in cleanup
    },
    color_changed({ commit, state, getters }, { brightness, contrast }) {
        let Activex = state.plugin;
        if (Activex) {
            let obj = {
                ch: 1,
                brightness: 8,
                contrast: 8,
                saturation: 8,
                hue: 8,
            };
            obj.brightness = state.color.brightness;
            obj.contrast = state.color.contrast;
            obj.dev = state.dev;
            obj.ch = state.ch;
            if (brightness) {
                obj.brightness = brightness;
                commit('preview/plugin_color_changed', { brightness });
            }
            if (contrast) {
                obj.contrast = contrast;
                commit('preview/plugin_color_changed', { contrast });
            }
            Activex.SetColor(obj);
        }
    },
    //预览 快捷栏  预览录像 ,只针对 普通单dev ipc
    ie_click_record_button({ commit, state, getters }, {}) {
        //预览录像
        let Activex = state.plugin;
        if (Activex) {
            if (state.record_state) {
                Activex.StopSaveReal({ dev: 1, ch: 1 });
            } else {
                Activex.StartSaveReal({ dev: 1, ch: 1 });
            }
            commit('preview/record_state_changed', !state.record_state);
        }
    },
    flash_click_record_button({ commit, state, getters }, {}) {},
    h5_click_record_button({ commit, state, getters }, {}) {},
    //预览 快捷栏 语音对讲
    ie_click_voicetalk({ commit, state, getters }, {}) {
        //预览快捷栏 对讲
        let Activex = state.plugin;
        if (Activex) {
            var ret = Activex.VoiceCom({
                transProto: 1,
                port: getters.rtsp_port,
                ip: getters.ip,
                usrname: getters.tokenA,
                pwd: getters.tokenB,
            });
            if (ret > 0) state.voice_talk_state = !state.voice_talk_state;
        }
    },
    flash_click_voicetalk({ commit, state, getters }, {}) {},
    h5_click_voicetalk({ commit, state, getters }, {}) {
        //预览快捷栏 对讲
        if (state.voice_state) {
            window.toastr.error(getters.current_language.i18n_plugin_msg_1);
            LOG.ERROR('You should close preview Voice auido first!');
            return;
        }

        const send_audioframes = (frame) => {
            state.vt_ws.send(frame);
        };
        if (state.plugin) {
            //翻转状态
            state.voice_talk_state = !state.voice_talk_state;
            state.plugin.volumne = state.voice_talk_state ? 1.0 : 0.0;
            if (!state.voicetalk_recorder) {
                //new a instance
                state.voicetalk_recorder = CVH5Lib.CreateVoiceRecorder();
            }

            if (state.voice_talk_state) {
                state.vt_ws = new WebSocket(get_ws_url(getters.ip), ['talk-stream']);
                state.vt_ws.binaryType = 'arraybuffer';
                state.vt_ws.onopen = function() {
                    msg('talk-stream is open');
                    state.voicetalk_recorder.start_record_push();
                    //test with https
                    _encodeToG711u.push(EventDisposer(state.voicetalk_recorder, CVH5Lib.Events.AUDIODATA_RECORD_ENCODE_TO_G711U, send_audioframes));
                }.bind(this);
                state.vt_ws.onclose = function() {
                    msg('talk-stream on close');
                };
                state.vt_ws.onerror = function(e) {
                    error('talk-stream on error', e);
                };
            } else {
                state.vt_ws.close();
                _encodeToG711u.forEach((fn) => fn());
                state.voicetalk_recorder.stop();
            }
        }
    },
    //预览 快捷栏 抓图
    ie_click_capturePic({ commit, state, getters }, {}) {
        //预览抓图
        let Activex = state.plugin;
        if (Activex) {
            Activex.CapturePic({});
        }
    },
    flash_click_capturePic({ commit, state, getters }, {}) {
        window.open('pic.html');
    },
    h5_click_capturePic({ commit, state, getters }, {}) {
        window.open('pic.html');
    },
    //预览快捷栏  全屏
    ie_click_fullscreen({ commit, state, getters }, {}) {
        //预览全屏
        let Activex = state.plugin;
        if (Activex) {
            Activex.FullScreen();
        }
    },
    flash_click_fullscreen({ commit, state, getters }, {}) {},
    h5_click_fullscreen({ commit, state, getters }, {}) {
        if (state.plugin) {
            if (getters.is_fisheye) {
                screenfull.toggle(document.querySelector('#preview_ch0').parentNode);
            } else if (getters.is_temperature) {
                screenfull.toggle(document.querySelector('#preview_dev0').parentNode);
            } else {
                screenfull.toggle(document.querySelector('#preview'));
            }
        }
    },
    //预览声音
    ie_click_voice({ commit, state, getters }, {}) {
        //预览抓图
        if (state.voice_talk_state) {
            window.toastr.error(getters.current_language.i18n_plugin_msg_2);
            LOG.ERROR('You should close Voice talk auido first!');
            return;
        }
        if (state.plugin) {
            state.voice_state = !state.voice_state;
            state.plugin.SoundSwitch();
        }
    },
    flash_click_voice({ commit, state, getters }, {}) {
        let plugin = state.plugin;
        if (plugin && plugin.PrevSetVolumn) {
            state.voice_state = !state.voice_state;
            plugin.PrevSetVolumn(state.voice_state ? 1 : 0);
        }
    },
    h5_click_voice({ commit, state, getters }, {}) {
        //预览抓图
        if (state.voice_talk_state) {
            window.toastr.error(getters.current_language.i18n_plugin_msg_2);
            LOG.ERROR('You should close Voice talk auido first!');
            return;
        }
        if (state.plugin) {
            state.voice_state = !state.voice_state;
            if (Array.isArray(state.plugin)) {
                state.plugin[0].volumne = state.voice_state ? 1.0 : 0.0;
            } else {
            state.plugin.volumne = state.voice_state ? 1.0 : 0.0;
            }
        }
    },
    /**
     * 仅tyconew版本使用
     * @param {*} param0
     * @param {*} param1
     */
    scale_level_changed({ commit, state, dispatch }, { val }) {
        commit('preview/scale_level_changed', val);
    },
    /**
     * 预览设置  plugin显示智能相关
     */
    ie_set_ClientFaceStrategy({ commit, state, dispatch }, conf) {
        let plugin = state.plugin;

        if (!plugin) return;
        plugin.ClientFaceStrategy = conf;
    },
    flash_set_ClientFaceStrategy({ commit, state, dispatch }, conf) {},
    h5_set_ClientFaceStrategy({ commit, state, dispatch }, conf) {
        let plugin = state.plugin;
        if (!plugin) return;
        const obj = {
            rule: conf.EnableRule, //绘制规则
            result: conf.EnableResult, //绘制结果
            enbale_faceonly: conf.enableOnlyFaceResult, //只显示人脸结果
            draw_extrainfo: conf.Face_draw_id_score, //绘制额外信息。人脸：id/score 测温： 温度
        };
        if (Array.isArray(plugin)) {
            plugin.forEach((val) => {
                val.smartconfig = obj;
            });
        } else {
            plugin.smartconfig = obj;
        }
    },
    /**
     *预览 tab 激活/失活 的hook
     */
    ie_preview_tab_active_changed({ commit, state, dispatch }, status) {
        let plugin = state.plugin;
        if (plugin) {
            //plugin.SoundSwitch();
        }
    },
    flash_preview_tab_active_changed({ commit, state, dispatch }, status) {
        //关闭声音
        let plugin = state.plugin;
        if (plugin && plugin.PrevSetVolumn) {
            plugin.PrevSetVolumn(status ? 1 : 0);
        }
    },
    h5_preview_tab_active_changed({ commit, state, dispatch }, { status, info }) {
        if (status) {
            //恢复上一次的播放状态
            if (info.hasOwnProperty('streamidx')) {
                dispatch('h5_switch_stream', { val: info.streamidx, op: 'open' });
            }
        } else {
            //保存 当前播放状态,关闭流
            dispatch('h5_switch_stream', { op: 'close' });
        }
    },

    tree_changeStream({ commit, state, getters, dispatch }, d) {
        let Activex = state.plugin;
        if (Activex) {
            if (getters.plugin_type == 'flash') {
                let zTree = $.fn.zTree.getZTreeObj('preview_tree');
                if (zTree) {
                    let node = zTree.getNodesByParam('ch', d.ch, null);
                    if (node.length) {
                        zTree.updateNode(node[0]);
                    }
                }

                let rtmp_url = ['rtmp://', getters.ip, ':', getters.rtmp_port, '/live'].join('');

                if (d.streamStatus == -1) {
                    //Activex.CloseChStream({ch:d.ch});

                    Activex.CloseChStream(rtmp_url, d.streamStatus, d.ch);
                } else {
                    Activex.PlayChStream(rtmp_url, d.streamStatus, d.ch);
                }
            } else if (getters.plugin_type == 'h5') {
            } else {
                let dev = 1;
                if (getters.is_multisensor) {
                    dev = d.dev;
                }

                if (d.streamStatus == -1) {
                    Activex.CloseChStream({ dev, ch: d.ch });
                } else {
                    Activex.PlayChStream({
                        streamType: d.streamStatus,
                        transProto: 1,
                        ch: d.ch,
                        ip: getters.ip,
                        port: getters.rtsp_port,
                        usrname: getters.tokenA,
                        pwd: getters.tokenB,
                        dev,
                    });
                }
            }
        }
    },
    tree_changeRecord({ commit, state, getters, dispatch }, d) {
        let Activex = state.plugin;
        if (Activex) {
            msg(JSON.stringify(d));
            if (d.recordStatus) {
                Activex.StartSaveReal({ dev: d.dev, ch: d.ch });
            } else {
                Activex.StopSaveReal({ dev: d.dev, ch: d.ch });
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
