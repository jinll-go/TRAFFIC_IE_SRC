import { addEvent, getImg } from 'common/util';
import _check_plugin from 'common/check_plugin_installed';

const bultin_identities = ['preview', 'playback', 'backup', 'file', 'config', 'face', 'person', 'temperature', 'face_capture'];
//默认人脸图
const default_facepic =
    'data:image/jpg;base64,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';

export default {
    data() {
        return {
            hasInit: false,
        };
    },
    methods: {
        //activex player
        //Promise api
        ie_context_init(identity) {
            if (window.plugin_download_addr) {
                this.download_exe_name = window.plugin_download_addr;
            }

            //check activex npapi plugins
            let status = _check_plugin.CheckIEPluginStatus();

            if (!window.onbeforeunload) {
                window.onbeforeunload = function() {
                    _check_plugin.ClearPlugin();
                };
            }

            this.$store.commit('base/plugin_installed', status);

            if (!bultin_identities.includes(identity)) {
                msg('unsupported plugin identity:', identity);
                return Promise.resolve(null);
            } else {
                return new Promise((resolve, reject) => {
                    //全局的插件回调,向前兼容
                    window.VersionCheck = function() {
                        // msg(args);
                    };
                    //加上超时,处理插件回调不触发的异常情况
                    /* let tid = setTimeout(() => {
                        clearTimeout(tid);
                        error('plugin init timeout! failed!', identity);
                        resolve(null);
                    }, 3000);*/
                    //注册回调
                    /**
                     * 1.未装插件,进入预览.安装插件,触发预览播放逻辑
                     * 2.(activex)安装插件,版本ok.进入预览
                     * 3.(npapi)安装插件,版本ok.进入预览, 隐藏预览插件销毁,组件仍然存在.再次显示预览.重新触发 预览播放逻辑.
                     */
                    window[`${identity}_pluginLoaded`] = function() {
                        //清除超时timer
                        //clearTimeout(tid);
                        //tid = 0;
                        //bugfix:  IE9下 预览无流,控制台打印报错 TypeError. 参数配置的插件对象初始化也报错,
                        //不使用回调 传入的插件对象,换用document.getElementById('preview')获取的插件对象 就可以出流
                        let plugin = document.getElementById(identity);
                        if (!plugin) {
                            throw new Error('invalid identity', identity);
                        }
                        //1.PC已安装插件,组件第一次初始化,走resolve的流程
                        // if (!this.isMounted) {
                        msg(identity, 'plugin loaded!', plugin);
                        if (!this.hasInit) {
                            this.hasInit = true;
                            resolve(plugin);
                        } else {
                            //.tab隐藏时 npapi的浏览器会强制销毁 plugin.再次再显示时会直接触发这个回调.无法走resolve的过程
                            //支持npapi的浏览器 才会进到这里
                            warn('npapi plugin show/hide fire!');
                            this.run_plugin_logical(plugin);
                        }
                    }.bind(this);
                });
            }
        },
        /**
         * 预览插件初始化的相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_preview(plugin) {
            return new Promise((resolve, reject) => {
                let localsettings = this.$store.getters.localsettings;

                plugin.SetRegConfig(localsettings);
                this.$store.commit('preview/plugin_change', plugin);
                //应用pluginconfig.json的配置
                plugin.ClientFaceStrategy = this.$store.getters.base.rtspplugin_params;
                //}
                this.$store.dispatch('request', { url: 'goform/frmUserRights_V2', Type: 0, Data: { UserName: this.$store.getters.tokenA } }).then((r) => {
                    if (r.Result == 0) {
                        this.$store.commit('preview/preview_right_changed', r.Data.RemoteRight[7]);
                        this.$store.dispatch('ie_switch_stream', { val: this.$store.getters.preview.default_stream });
                    }
                });

                //普通单sensor 才获取码率
                msg('is_normal', this.$store.getters.is_normal);
                if (this.$store.getters.is_normal) {
                    this.$store.dispatch('get_framerate', {});
                    plugin.WndSequence({
                        splitNum: this.$store.getters.ChanNum,
                        seqIndex: 0,
                    });
                    this.$store.dispatch('ie_preview_plugin_callbackmsg', {});
                } else if (this.$store.getters.is_fisheye) {
                    this.$store.dispatch('get_framerate', {});
                    plugin.WndProfileSequence({
                        splitNum: this.$store.getters.ChanNum,
                    });
                    this.$store.dispatch('ie_preview_plugin_callbackmsg', {});
                } else if (this.$store.getters.is_temperature) {
                    //测温
                    plugin.WndHorizontalSequence({ wndNum: 2 });
                    this.$store.dispatch('request', { url: 'goform/frmTempVideoLocationCal', Type: 0, Data: {} }).then((r) => {
                        if (r.Result == 0) {
                            msg('DetectTempAreaMappingInfo', r.Data);
                            plugin.DetectTempAreaMappingInfo = r.Data;
                        }
                    });
                } else {
                    //多sensor
                    plugin.WndSequence({
                        splitNum: this.$store.getters.ChanNum,
                        seqIndex: 0,
                    });
                }

                resolve(true);
            });
        },
        ie_plugin_cleanup_preview() {},
        /**
         * 回放插件初始化的相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_playback(plugin) {
            return new Promise((resolve, reject) => {
                this.$store.commit('playback/plugin_change', plugin);

                if (plugin) {
                    const cb = function(obj) {
                        let tmp = obj.status.split('_')[1];
                        msg('pb_msg', tmp);
                        if (tmp.toUpperCase() == 'VOICE') {
                            //声音状态回调
                            //this.$data.voice_state = obj.voice;
                            this.$emit('voicestatechanged', !!obj.voice);
                        } else {
                            //播放状态回调
                            //this.$emit("",$data.state =  tmp || 'STOP';
                            // this.$emit("",$data.speed = obj.speed;
                            this.$emit('playstatechanged', tmp || 'STOP');
                            this.$emit('speedchanged', obj.speed);
                        }
                    }.bind(this);

                    plugin.AddPluginEvent({
                        event_name: 'pb_msg',
                        func: cb,
                    });

                    addEvent(plugin, 'pb_msg', cb);
                    plugin.EnableSmartDisplay({
                        type: 1,
                        param: 0x1 | 0x2,
                    });
                }
                resolve(true);
            });
        },
        ie_plugin_cleanup_playback() {},
        /**
         *  备份插件初始化相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_backup(plugin) {
            return new Promise((resolve, reject) => {
                this.$store.commit('backup/plugin_change', plugin);
                resolve(true);
            });
        },
        ie_plugin_cleanup_backup() {},
        /**
         * 文件管理插件初始化相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_file(plugin) {
            return new Promise((resolve, reject) => {
                this.$store.commit('file/plugin_change', plugin);
                const cb = function(obj) {
                    msg('!!!', obj);
                    let tmp = obj.status.split('_')[1];
                    if (tmp.toUpperCase() == 'VOICE') {
                        //声音状态回调
                        //this.$data.voice_state = obj.voice;
                        this.$emit('voicestatechanged', obj.voice);
                    } else {
                        //播放状态回调
                        //this.$data.state =  tmp || 'STOP';
                        //this.$data.speed = obj.speed;
                        this.$emit('playstatechanged', tmp || 'STOP');
                        this.$emit('speedchanged', obj.speed);
                    }
                }.bind(this);
                plugin.AddPluginEvent({
                    event_name: 'file_msg',
                    func: cb,
                });
                addEvent(plugin, 'file_msg', cb);
                this.$store.dispatch('init_root_nodes', {});
                resolve(true);
            });
        },
        ie_plugin_cleanup_file() {},
        /**
         * 参数配置插件初始化相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_config(plugin) {
            return new Promise((resolve, reject) => {
                let localsettings = this.$store.getters.localsettings;
                plugin.SetRegConfig(localsettings);

                this.$store.commit('config/plugin_change', plugin);

                /*if (this.$store.getters.is_tyconew && this.$store.getters.config.stream_status == false) {
                    this.$store.dispatch('ie_config_plugin_init', {
                        mode: 0
                    });
                }*/
                this.$store.dispatch(`ie_get_alarm`);
                resolve(true);
            });
        },
        ie_plugin_cleanup_config() {},
        /**
         * 人脸识别插件初始化相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_face(plugin) {
            return new Promise((resolve, reject) => {
                if (plugin) {
                    let localsettings = this.$store.getters.localsettings;
                    plugin.SetRegConfig(localsettings);
                    plugin.WndSequence({
                        splitNum: 1,
                        seqIndex: 0,
                    });

                    plugin.ClientFaceStrategy = {
                        pipeSnapFaceMsgToJs: true,
                        pipeFaceCompareMsgToJs: true,
                        enableOnlyFaceResult: true, //只显示人脸结果
                    };
                    plugin.EnableSmartDisplay({
                        type: 0,
                        param: 0x2, //绘制智能结果
                    });
                    const cb = (obj) => {
                        /*if (obj && obj.PictureBase64 && obj.PictureBase64.trim().length) {
                            getImg('data:image/jpeg;base64,' + obj.PictureBase64)
                                .then((img) => {
                                    this.$store.commit('preview/plugin_face_changed', img);
                                })
                                .catch((e) => {
                                    msg(e);
                                });
                        }*/
                        if (this.$store.getters.preview.isShowComparisonOK) {
                            if (obj.face_id.trim().length == 0) {
                                return;
                            }
                        }
                        let param = {
                            capPic: 'data:image/jpeg;base64,' + obj.PictureBase64,
                            srcPic: 'data:image/jpeg;base64,' + obj.IdentifyBase64,
                            similary: obj.similarity + '%',
                            name: obj.name,
                            faceId: obj.face_id,
                            // id: ID2('cp'),
                            groupname: obj.grp_name,
                        };
                        if (obj.IdentifyBase64.trim().length === 0) {
                            param.srcPic = default_facepic;
                            //"static/images/defaultface.png";
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
                    };
                    plugin.AddPluginEvent({
                        event_name: 'face_comparison_result',
                        func: cb,
                    });
                    addEvent(plugin, 'face_comparison_result', cb);

                    plugin.PlayStream({
                        streamType: 0,
                        transProto: 1,
                        ch: 1,
                        ip: this.$store.getters.ip,
                        port: this.$store.getters.rtsp_port,
                        usrname: this.$store.getters.tokenA,
                        pwd: this.$store.getters.tokenB,
                    });
                }
                resolve(true);
            });
        },
        ie_plugin_cleanup_face() {},
        /**
         * 人脸、测温  抓拍导入
         * @param {*} plugin
         */
        ie_logicsetup_face_capture(plugin) {
            return new Promise((resolve, reject) => {
                this.$store.commit('face/capture_plugin_change', plugin);
                const cb = (obj) => {
                    msg('视频流加载完成！！！');
                    /*setTimeout(() => {
                        this.capBtnShow = true;
                    }, 1500);*/
                    this.$emit('streamready');
                };
                plugin.AddPluginEvent({
                    //确认流加载完成后，才显示抓怕按钮
                    event_name: 'streamready',
                    func: cb,
                });
                addEvent(plugin, 'streamready', cb);
                if (plugin && plugin.DoInit) {
                    plugin.DoInit({
                        streamType: 1,
                        transProto: 1,
                        ch: 1,
                        ip: this.$store.getters.ip,
                        port: this.$store.getters.rtsp_port,
                        usrname: this.$store.getters.tokenA,
                        pwd: this.$store.getters.tokenB,
                        dev: 1,
                    });
                }
                resolve(true);
            });
        },
        ie_plugin_cleanup_face_capture() {
            let plugin = this.$store.getters.Face.capture_plugin;
            if (plugin) {
            }
        },
        /**
         * 计数统计  回放报警片段的插件初始化相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_person(plugin) {
            return new Promise((resolve, reject) => {
                this.$store.commit('person/plugin_change', plugin);
                const cb = function(obj) {
                    /* let tmp = obj.status.split('_')[1];

                    if (tmp.toUpperCase() != 'VOICE') {
                        //播放状态回调

                        this.$emit('playstatechanged', tmp || 'STOP');
                    }*/

                    let tmp = obj.status.split('_')[1];

                    if (tmp.toUpperCase() == 'VOICE') {
                        //声音状态回调

                        this.$emit('voicestatechanged', !!obj.voice);
                    } else {
                        //播放状态回调

                        this.$emit('playstatechanged', tmp || 'STOP');
                        this.$emit('speedchanged', obj.speed);
                    }
                }.bind(this);
                plugin.AddPluginEvent({
                    event_name: 'pb_msg',
                    func: cb,
                });
                addEvent(plugin, 'pb_msg', cb);

                this.$parent.PlayVideo('play');
                resolve(true);
            });
        },
        ie_plugin_cleanup_person() {},
        /**
         * 红外测温插件初始化相关逻辑
         * @param {*} plugin
         */
        ie_logicsetup_temperature(plugin) {
            let localsettings = this.$store.getters.localsettings;
            plugin.SetRegConfig(localsettings);
            plugin.WndHorizontalSequence({
                wndNum: 2,
            });
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
                plugin.DetectTempAreaMappingInfo = $.extend(r[0].Data, { TempUnit: r[1].Data.TemperatureUnit });
                this.$store.commit('temperature/property_changed', {
                    DetectTempAreaMappingInfo: $.extend(r[0].Data, { TempUnit: r[1].Data.TemperatureUnit }),
                });
            });
            plugin.PlayStream({
                streamType: 0,
                transProto: 1,
                ch: 1,
                dev: 1,
                ip: this.$store.getters.ip,
                port: this.$store.getters.rtsp_port,
                usrname: this.$store.getters.tokenA,
                pwd: this.$store.getters.tokenB,
                wndidx: 0,
            });

            plugin.PlayStream({
                streamType: 0,
                transProto: 1,
                ch: 1,
                dev: 2,
                ip: this.$store.getters.ip,
                port: this.$store.getters.rtsp_port,
                usrname: this.$store.getters.tokenA,
                pwd: this.$store.getters.tokenB,
                wndidx: 1,
            });
            plugin.ClientFaceStrategy = {
                Face_draw_id_score: 1,
                pipeSnapFaceMsgToJs: 0,
                pipeFaceCompareMsgToJs: 1,
                enableOnlyFaceResult: 0,
            };

            plugin.EnableSmartDisplay({
                type: 0,
                param: 0x2, //绘制智能结果
            });

            const cb = (obj) => {
                let param = {
                    capPic: 'data:image/jpeg;base64,' + obj.PictureBase64,
                    srcPic: 'data:image/jpeg;base64,' + obj.IdentifyBase64,
                    temp_enable: obj.temp_enable || 0,
                    temp_isalarm: obj.temp_isalarm || 0,
                    max_temp: obj.max_temp || 0.0,
                    temp: obj.temp || 0.0,
                    face_attr: obj.face_attr || 0x0,
                    capture_time: obj.capture_time,
                    similarity: obj.similarity + '%',
                    name: obj.name,
                    groupName: obj.grp_name,
                    temp_unit: obj.temp_unit,
                };

                if (obj.IdentifyBase64.trim().length === 0) {
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
            };
            plugin.AddPluginEvent({
                event_name: 'face_comparison_result',
                func: cb,
            });
            addEvent(plugin, 'face_comparison_result', cb);

            return Promise.resolve(true);
        },
        ie_plugin_cleanup_temperature() {},
        /**
         * 用户未装插件.点击下载插件时触发
         * 每个3s检测一次,直到插件正确初始化
         */
        GetPluginInstallStatus() {
            //e.preventDefault()
            let isInstalled = _check_plugin.CheckIEPluginStatus();
            if (isInstalled == 2) {
                //	window.location.reload(true);
                if (this.plugin_installed == 1) {
                    window.close();
                }
                this.$store.commit('base/plugin_installed', 2);
            } else {
                setTimeout(this.GetPluginInstallStatus, 3000);
            }
        },
    },
};
