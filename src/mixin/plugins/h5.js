import { getImg, EventDisposer } from 'common/util';
const default_facepic =
    'data:image/jpg;base64,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';
import Vue from 'vue';
 /*import CVH5Lib from 'h5player';
window.CVH5Lib = CVH5Lib;

import CVCanvasDraw from 'canvas_alpha';
window.CVCanvasDraw = CVCanvasDraw;*/
window.get_ws_url = function(domain) {
    //判断是非调试模式，
    //host包含ip：port，否则更改http https端口后 无法开流
    if (!window.__VUE_HOT_MAP__) {
        domain = window.location.host;
    }
    return ['ws', window.location.protocol.includes('https') ? 's://' : '://', domain, '/ws/test'].join('');
};
export default {
    methods: {
        //html5 player
        h5_context_init(identity) {
            if (!window.CVH5Lib) {
                error('find no CVH5Lib !');
                return Promise.resolve(null);
            }
            //测温 双通道 单独处理

            if ((identity == 'preview' || identity == 'temperature') && this.$UI.CVTopMenu.tab_temperature.visible) {
                return Promise.all([
                    new Promise((resolve, reject) => {
                        //dev0
                        let p1 = CVH5Lib.CreateLivePlayer({
                            name: `${identity}_dev0`,
                            reconnect: true,
                            render_type: CVH5Lib.RenderType.AUTO,
                            use_smart: true,
                        });
                        p1.volumne = 0.0; //默认关闭声音
                        p1.once(CVH5Lib.Events.PLAYER_READY, () => {
                            p1.delay = { min: 0.1, normal: 0.3, max: 0.5 };
                            resolve(p1);
                        });
                    }),
                    new Promise((resolve, reject) => {
                        //dev1
                        let p2 = CVH5Lib.CreateLivePlayer({
                            name: `${identity}_dev1`,
                            reconnect: true,
                            render_type: CVH5Lib.RenderType.AUTO,
                            use_smart: true,
                        });
                        p2.volumne = 0.0; //默认关闭声音
                        p2.once(CVH5Lib.Events.PLAYER_READY, () => {
                            p2.delay = { min: 0.1, normal: 0.3, max: 0.5 };
                            resolve(p2);
                        });
                    }),
                ]);
            } else if (identity == 'preview' && this.$store.getters.is_fisheye) {
                let chNum = this.$store.getters.ChanNum;
                msg('chNum is', chNum);
                let list = [];
                for (let i = 0; i < chNum; ++i) {
                    list.push(
                        new Promise((resolve, reject) => {
                            //dev0
                            let p1 = CVH5Lib.CreateLivePlayer({
                                name: `${identity}_ch${i}`,
                                reconnect: true,
                                render_type: CVH5Lib.RenderType.AUTO,
                                use_smart: i == 0,
                            });
                            p1.volumne = 0.0; //默认关闭声音
                            p1.once(CVH5Lib.Events.PLAYER_READY, () => {
                                p1.delay = { min: 0.1, normal: 0.3, max: 0.5 };
                                resolve(p1);
                            });
                        })
                    );
                }
                return Promise.all(list);
            } else {
                //普通单通道
                return new Promise((resolve, reject) => {
                    if (identity == 'preview' || identity == 'face' || identity == 'config') {
                        let p1 = CVH5Lib.CreateLivePlayer({
                            name: identity,
                            reconnect: true,
                            render_type: CVH5Lib.RenderType.AUTO,
                            use_smart: identity != 'config',
                        });
                        p1.volumne = 0.0; //默认关闭声音
                        p1.once(CVH5Lib.Events.PLAYER_READY, () => {
                            resolve(p1);
                        });
                    } else if (identity == 'face_capture') {
                        let p1 = CVH5Lib.CreateLivePlayer({
                            name: identity,
                            reconnect: true,
                            render_type: CVH5Lib.RenderType.AUTO,
                            use_smart: false,
                        });
                        p1.volumne = 0.0; //默认关闭声音
                        p1.once(CVH5Lib.Events.PLAYER_READY, () => {
                            resolve(p1);
                        });
                    } else if (identity == 'playback' || identity == 'person') {
                        let p1 = CVH5Lib.CreateVodPlayer({
                            name: identity,
                            reconnect: false,
                            render_type: CVH5Lib.RenderType.AUTO,
                            use_smart: false,
                        });
                        p1.volumne = 0.0; //默认关闭声音
                        p1.once(CVH5Lib.Events.PLAYER_READY, () => {
                            resolve(p1);
                        });
                    } else {
                        resolve(null);
                    }
                });
            }
        },
        /**
         * h5 预览
         */
        h5_logicsetup_preview(plugin) {
            this.$store.commit('preview/plugin_change', plugin);
            this.$store
                .dispatch('request', {
                    url: 'goform/frmUserRights_V2',
                    Type: 0,
                    Data: {
                        UserName: this.$store.getters.tokenA,
                    },
                })
                .then((r) => {
                    if (r.Result == 0) {
                        this.$store.commit('preview/preview_right_changed', r.Data.RemoteRight[7]);
                        let { is_fisheye, is_temperature, is_multisensor, is_normal } = this.$store.getters;
                        if (is_temperature) {
                            plugin.forEach((val, idx) => {
                                val.Attach(document.querySelector(`#preview_dev${idx}`));
                            });
                            //默认打开主码流
                            this.$store.dispatch('h5_switch_stream', {
                                val: 0,
                                op: 'open',
                            });
                        } else if (is_fisheye) {
                            plugin.forEach((item, idx) => {
                                item.Attach(document.querySelector(`#preview_ch${idx}`));
                            });
                            this.$store.dispatch('h5_switch_stream', {
                                val: 0,
                                op: 'open',
                            });
                        } else if (is_multisensor) {
                        } else if (is_normal) {
                            plugin.Attach(document.querySelector('#preview'));
                            this.$store.dispatch('h5_switch_stream', {
                                val: this.$store.getters.preview.default_stream,
                                op: 'open',
                            });
                        }
                    }
                });

            return Promise.resolve(true);
        },
        h5_plugin_cleanup_preview() {
            if (this.$UI.CVTopMenu.tab_temperature.visible) {
                this.$store.dispatch('h5_switch_stream', { op: 'close' });
                plugin.forEach((val, idx) => {
                    val.destroy();
                });
            } else {
                this.$store.dispatch('h5_switch_stream', { op: 'close' });
                plugin.destroy();
            }
        },
        /**
         * h5 回放
         * @param {*} plugin
         */
        h5_logicsetup_playback(plugin) {
            this.$store.commit('playback/plugin_change', plugin);

            if (plugin) {
                plugin.Attach(document.querySelector('#playback'));
                //监听 回放播放时刻
                let canvas_s = new CVCanvasDraw.SearchBar(this.$store.getters.content_rect.width - 222 - 158, 80, 'searchbar');
                this.$store.commit('playback/drawer', canvas_s);
                canvas_s.Init();
                canvas_s.Dbclick = ({ hms, utcsecs }) => {
                    let d = new Date(utcsecs * 1000);
                    warn(d.getHours(), d.getMinutes(), d.getSeconds(), d.toISOString());
                    this.$store.commit('playback/player_StartTime', utcsecs);
                    this.$store.dispatch(`h5_playbackplayer_action_trigger`, { cmd: 'play' });
                };
                this.remove_streamopen = EventDisposer(plugin, CVH5Lib.Events.PLAYER_STREAM_OPENED, (x) => {
                    this.$emit('playstatechanged', 'PLAY');
                });
                this.remove_streamclose = EventDisposer(plugin, CVH5Lib.Events.PLAYER_STREAM_CLOSED, (x) => {
                    this.$emit('playstatechanged', 'STOP');
                });

                this.remove_statusmsg = EventDisposer(plugin, CVH5Lib.Events.PLAYER_STATUS_MSG, (x) => {
                    msg(x);
                    if (x.hasOwnProperty('status')) this.$emit('playstatechanged', x.status);
                    if (x.hasOwnProperty('voice_status')) this.$emit('voicestatechanged', x.voice_status);
                });
            }
            return Promise.resolve(true);
        },
        h5_plugin_cleanup_playback() {
            if (this.remove_streamclose) this.remove_streamclose();
            if (this.remove_streamopen) this.remove_streamopen();
            if (this.remove_statusmsg) this.remove_statusmsg();
        },
        /**
         * h5 暂不支持
         * @param {*} plugin
         */
        h5_logicsetup_backup(plugin) {
            return Promise.resolve(true);
        },
        h5_plugin_cleanup_backup() {},
        /**
         * 暂不支持
         * @param {*} plugin
         */
        h5_logicsetup_file(plugin) {
            return Promise.resolve(true);
        },
        h5_plugin_cleanup_file() {},
        /**
         * h5 参数配置 初始逻辑
         * @param {} plugin
         */
        h5_logicsetup_config(plugin) {
            this.$store.commit('config/plugin_change', plugin);
            plugin.Attach(document.querySelector('#config'));
            /*if (this.$store.getters.is_tyconew && this.$store.getters.config.stream_status == false) {
            this.$store.dispatch('h5_config_plugin_init', { mode: 0 });
            }*/
            this.$store.dispatch('h5_get_alarm');
            return Promise.resolve(true);
        },
        h5_plugin_cleanup_config() {},

        /**
         * 人脸比对
         * @param {*} plugin
         */
        h5_logicsetup_face(plugin) {
            this.$store.commit('face/plugin_change', plugin);
            plugin.smartconfig = {
                rule: false,
                result: true,
                enbale_faceonly: true,
                draw_extrainfo: true,
            };
            plugin.Attach(document.querySelector('#face'));

            plugin.play({
                url: get_ws_url(this.$store.getters.ip),
                protocols: ['video-stream'],
                cmd: {
                    Type: 0,
                    Ch: 0,
                    Dev: 0,
                    Data: {
                        StreamId: 0,
                        Video: true,
                        Audio: false,
                        Smart: true,
                    },
                },
            });

            //处理比对结果
            msg('PARSED_SMARTFRAME_FACECOMPARISON_RESULT  listener on');
            this.remove_compareresult = EventDisposer(plugin, CVH5Lib.Events.PARSED_SMARTFRAME_FACECOMPARISON_RESULT, (info) => {
                let obj = info.frameData[0];
                let param = {
                    capPic: obj.PictureBase64,
                    srcPic: obj.IdentifyBase64,
                    similary: obj.similarity + '%',
                    name: obj.name,
                    faceId: obj.face_id,
                    groupname: obj.grp_name,
                };

                if (!obj.IdentifyBase64) {
                    param.srcPic = default_facepic;
                }
                Promise.all([getImg(param.capPic), getImg(param.srcPic)])
                    .then((r) => {
                        param.capPic = r[0];
                        param.srcPic = r[1];
                        this.$store.commit('face/cmpface_result_changed', param);
                    })
                    .catch((e) => {
                        msg(e);
                    });
            });

            return Promise.resolve(true);
        },
        h5_plugin_cleanup_face() {
            let plugin = this.$store.getters.Face.plugin;
            if (plugin) {
                this.remove_compareresult();
                plugin.stop();
                //处理比对结果
                msg('PARSED_SMARTFRAME_FACECOMPARISON_RESULT  listener off');
                plugin.destroy();
            }
        },
        /**
         * h5 人脸、测温 抓拍导入
         * @param {*} plugin
         */
        h5_logicsetup_face_capture(plugin) {
            this.$store.commit('face/capture_plugin_change', plugin);
            plugin.Attach(document.getElementById('face_capture'));
            plugin.play({
                url: get_ws_url(this.$store.getters.ip),
                protocols: ['video-stream'],
                cmd: {
                    Type: 0,
                    Ch: 0,
                    Dev: 0,
                    Data: {
                        StreamId: 1,
                        Video: true,
                        Audio: false,
                        Smart: false,
                    },
                },
            });
            setTimeout(() => {
                this.$emit('streamready');
            }, 1500);
            return Promise.resolve(true);
        },
        h5_plugin_cleanup_face_capture() {
            let plugin = this.$store.getters.Face.capture_plugin;
            if (plugin) {
                plugin.stop();
                plugin.destroy();
            }
        },
        /**
         * 计数统计
         * @param {*} plugin
         */
        h5_logicsetup_person(plugin) {
            this.$store.commit('person/plugin_change', plugin);
            if (plugin) {
                plugin.Attach(document.querySelector('#person'));
                //监听 回放播放时刻
                // let canvas_s = new CVCanvasDraw.SearchBar(this.$store.getters.content_rect.width - 222 - 158, 80, 'searchbar');
                // this.$store.commit('playback/drawer', canvas_s);
                // canvas_s.Init();
                // canvas_s.Dbclick = ({ hms, utcsecs }) => {
                //   let d = new Date(utcsecs * 1000);
                //  warn(d.getHours(), d.getMinutes(), d.getSeconds(), d.toISOString());
                //  this.$store.commit('playback/player_StartTime', utcsecs);
                //  this.$store.dispatch(`h5_playbackplayer_action_trigger`, { cmd: 'play' });
                //};
                this.remove_streamopen = EventDisposer(plugin, CVH5Lib.Events.PLAYER_STREAM_OPENED, (x) => {
                    this.$emit('playstatechanged', 'PLAY');
                });
                this.remove_streamclose = EventDisposer(plugin, CVH5Lib.Events.PLAYER_STREAM_CLOSED, (x) => {
                    this.$emit('playstatechanged', 'STOP');
                });

                this.remove_statusmsg = EventDisposer(plugin, CVH5Lib.Events.PLAYER_STATUS_MSG, (x) => {
                    msg(x);
                    if (x.hasOwnProperty('status')) this.$emit('playstatechanged', x.status);
                    if (x.hasOwnProperty('voice_status')) this.$emit('voicestatechanged', x.voice_status);
                });

                this.$parent.PlayVideo('play');
            }
            return Promise.resolve(true);
        },
        h5_plugin_cleanup_person() {
            if (this.remove_streamclose) this.remove_streamclose();
            if (this.remove_streamopen) this.remove_streamopen();
            if (this.remove_statusmsg) this.remove_statusmsg();
        },
        /**
         * h5 测温 初始逻辑
         * @param {*} plugin
         */
        h5_logicsetup_temperature(plugin) {
            this.$store.commit('temperature/plugin_change', plugin);

            Promise.all([
                /**
                 * 红外映射区域
                 */
                this.$store.dispatch('request', {
                    url: 'goform/frmTempVideoLocationCal',
                    Type: 0,
                    Data: {},
                }),
                //温度模式 摄氏度 华氏度
                this.$store.dispatch('request', {
                    url: 'goform/frmVideoTemperatureCfg',
                    Type: 0,
                    Data: {},
                }),
            ]).then((r) => {
                let d = {};
                if (r[0].Result == 0) {
                    msg('DetectTempAreaMappingInfo', r[0].Data);
                }
                if (r[1].Result == 0) {
                    msg('VideoTemperatureCfg', r[1].Data);
                }
                this.$store.commit('temperature/property_changed', {
                    DetectTempAreaMappingInfo: $.extend(r[0].Data, { TempUnit: r[1].Data.TemperatureUnit }),
                });

                plugin[0].set_tempmaparea(this.$store.getters.temperature.DetectTempAreaMappingInfo);
            });

            plugin.forEach((val, idx) => {
                val.Attach(document.querySelector(`#temperature_dev${idx}`));
            });
            //处理比对结果
            this.remove_facecmpdata = EventDisposer(plugin[0], CVH5Lib.Events.PARSED_SMARTFRAME_FACECOMPARISON_RESULT, (info) => {
                    // msg(['测温比对数据', info.frameData[0], info.frameData[0].PictureBase64])
                    //   msg(info.name, info.uid);
                    let tmpObj = info.frameData[0];
                    let param = {
                        capPic: tmpObj.PictureBase64,
                        srcPic: tmpObj.IdentifyBase64,
                        have_modal: tmpObj.have_modal,
                        similarity: tmpObj.similarity + '%',
                        open_type: tmpObj.open_type,
                        temp: tmpObj.temp || 0.0,
                        temp_valid: tmpObj.temp_valid,
                        temp_type: tmpObj.temp_type,
                        emask: tmpObj.emask,
                        capture_time: tmpObj.capture_time,
                        normal_info: tmpObj.normal_info,
                    };

                    if (tmpObj.have_modal == false) {
                        param.srcPic = default_facepic;
                    }
                    
                    Promise.all([getImg(param.capPic), getImg(param.srcPic)])
                        .then((r) => {
                            param.capPic = r[0];
                            param.srcPic = r[1];
                            this.$store.commit('temperature/plugin_face_changed', param);
                        })
                        .catch((e) => {
                            msg(e);
                        });
                    // warn(info);
                });
            this.remove_facecapturedata = EventDisposer(plugin[0], CVH5Lib.Events.PARSED_SMARTFRAME_FACECAPTURE_RESULT, (info) => {
                    let tmpObj = info.frameData[0];
                    let param = {
                        capPic: tmpObj.FaceCaptureBase64,
                        temp: tmpObj.temp || 0.0,
                        temp_valid: tmpObj.temp_valid,
                        temp_type: tmpObj.temp_type,
                        emask: tmpObj.emask,
                        capture_time: tmpObj.capture_time,
                    };
                    Promise.all([getImg(param.capPic)])
                        .then((r) => {
                            param.capPic = r[0];
                            this.$store.commit('temperature/plugin_capture_changed', param);
                        })
                        .catch((e) => {
                            msg(e);
                        });
                    // warn(info);
                });
            this.$store.dispatch('h5_init_temperature_stream', { stream: 'open' });

            return Promise.resolve(true);
        },
        h5_plugin_cleanup_temperature() {
            //处理比对结果
            this.remove_facecmpdata();
            this.remove_facecapturedata();
            this.$store.dispatch('h5_init_temperature_stream', { stream: 'close' });
            let plugin = this.$store.getters.temperature.plugin;
            plugin.forEach((val, idx) => {
                val.destroy();
            });
        },
    },
};
