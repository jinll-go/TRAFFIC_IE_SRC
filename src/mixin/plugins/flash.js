import swfobject from 'common/swfobject';
export default {
    methods: {
        //flash player
        //promise api
        flash_context_init() {
            return new Promise((resolve, reject) => {
                let flashvars = {};
                let params = {
                    menu: 'true',
                    scale: 'noScale',
                    allowFullscreen: 'true',
                    allowScriptAccess: 'always',
                    allowNetworking: 'true',
                    bgcolor: '0x000000',
                    wmode: 'direct', // can cause issues with FP settings & webcam
                };
                let attributes = {
                    id: this.identity,
                };
                swfobject.embedSWF(
                    'static/swfs/RTMPClient.swf',
                    'altContent',
                    '100%',
                    '100%',
                    '11.5.0',
                    './swfs/expressInstall.swf',
                    flashvars,
                    params,
                    attributes,
                );
                //Flash准备好的回调
                //加上超时,处理插件回调不触发的异常情况
                let tid = setTimeout(() => {
                    window.FlashReadyCb = null;
                    clearTimeout(tid);
                    resolve(null);
                }, 1000);

                msg('set FlashReadyCb');
                window.FlashReadyCb = function(flg) {
                    msg('Flash is Ready!', flg);
                    //判断tab activated状态 定位当前那个flashplayer激活
                    let ar = ['preview', 'playback', 'config'];
                    for (let name of ar) {
                        msg(name, this.$store.getters[name].activated);
                        if (this.$store.getters[name].activated) {
                            //dispatch(`${name}/plugin_changed`, { plugin: document.querySelector(`#${name}`) });
                            clearTimeout(tid);
                            resolve(document.querySelector(`#${name}`));
                            break;
                        }
                    }
                };
            });
        },
        flash_logicsetup_preview(plugin) {
            // plugin = $('#preview')[0];
            this.$store.commit('preview/plugin_change', plugin);
            if (plugin) {
                if (this.$store.getters.is_fisheye) {
                    plugin.InitPrevPlayers(9, 0);
                    plugin.WndSequence(this.$store.getters.ChanNum, 0);
                } else if (this.$store.getters.is_normal) {
                    plugin.InitPrevPlayers(1, 1);
                } else if (this.$store.getters.is_multisensor) {
                    plugin.InitPrevPlayers(9, 1);
                }

                this.$store.dispatch('request', { url: 'goform/frmUserRights_V2', Type: 0, Data: { UserName: this.$store.getters.tokenA } }).then((r) => {
                    if (r.Result == 0) {
                        this.$store.commit('preview/preview_right_changed', r.Data.RemoteRight[7]);
                        plugin.PlaySmart(true, true);
                        this.$store.dispatch('flash_switch_stream', { val: state.default_stream });
                    }
                });
            }

            //this.$store.dispatch('flash_get_alarm', {});
            return Promise.resolve(true);
        },
        flash_plugin_cleanup_preview() {},
        flash_logicsetup_playback(plugin) {
            if (plugin) {
                this.$store.commit('playback/plugin_change', plugin);
                plugin.InitPbPlayers();

                function getOffsetX(evt) {
                    if (evt.offsetX) return evt.offsetX;

                    var ele = evt.target || evt.srcElement;
                    var o = ele;

                    var x = 0;
                    while (o.offsetParent) {
                        x += o.offsetLeft;
                        o = o.offsetParent;
                    }
                    // 处理当元素处于滚动之后的情况
                    var left = 0;
                    while (ele.parentNode) {
                        left += ele.scrollLeft;
                        ele = ele.parentNode;
                    }

                    return evt.pageX + left - x;
                }
                plugin.DisplaySmart(true);

                $('#DivObj').bind('mousewheel DOMMouseScroll', function(event) {
                    event.preventDefault();

                    if (event.wheelDelta) {
                        //统一为±120，其中正数表示为向上滚动，负数表示向下滚动
                        var delta = event.wheelDelta;
                        //opera 9x系列的滚动方向与IE保持一致，10后修正
                        if (window.opera && opera.version() < 10) delta = -delta;
                        //由于事件对象的原有属性是只读，我们只能通过添加一个私有属性delta来解决兼容问题
                        event.delta = Math.round(delta) / 120; //修正safari的浮点 bug
                    } else if (event.detail) {
                        event.wheelDelta = -event.detail * 40; //为FF添加更大众化的wheelDelta
                        event.delta = event.wheelDelta / 120; //添加私有的delta
                    }

                    event.offsetX = event.offsetX || getOffsetX(event);
                    plugin.MouseWheel(event.delta > 0 ? 1 : -1, event.offsetX);
                });

                if (!window.PbCallback) {
                    window.PbCallback = function(type, data) {
                        let obj = JSON.parse(data);
                        //						msg([type,obj])
                        switch (type) {
                            case 'PbState':
                                if (obj) {
                                    if (obj.state) {
                                        switch (obj.state) {
                                            case 'Play':
                                                if (obj.speed != null && obj.speed != undefined) {
                                                    //this.$store.commit('playercontrolbar/speed_changed', obj.speed);
                                                }
                                                break;
                                            case 'Stop':
                                                break;
                                            case 'Pause':
                                                break;
                                            case 'Frame':
                                                break;
                                        }
                                        //  this.$store.commit('playercontrolbar/state_changed', obj.state.toUpperCase());
                                    }
                                }
                                break;
                            case 'Voice':
                                if (obj.state == 'Closed') {
                                    this.$store.commit('playercontrolbar/voice_state_changed', false);
                                } else if (obj.state == 'Open') {
                                    this.$store.commit('playercontrolbar/voice_state_changed', true);
                                }
                                break;
                        }
                    }.bind(this);
                }
            }

            return Promise.resolve(true);
        },
        flash_plugin_cleanup_playback() {},
        //不支持
        flash_logicsetup_backup(plugin) {
            return Promise.resolve(true);
        },
        flash_plugin_cleanup_backup() {},
        /**
         * 不支持
         * @param {*} plugin
         */
        flash_logicsetup_file(plugin) {
            return Promise.resolve(true);
        },
        flash_plugin_cleanup_file() {},
        flash_logicsetup_config(plugin) {
            this.$store.commit('config/plugin', plugin);
            if (this.$store.getters.is_tyconew && this.$store.getters.config.stream_status == false) {
                this.$store.dispatch('flash_config_plugin_init', { mode: 0 });
            }
            return Promise.resolve(true);
        },
        flash_plugin_cleanup_config() {},
        //不支持
        flash_logicsetup_face(plugin) {
            return Promise.resolve(true);
        },
        flash_plugin_cleanup_face() {},
        //不支持
        flash_logicsetup_person(plugin) {
            return Promise.resolve(true);
        },
        flash_plugin_cleanup_person() {},
        //不支持
        flash_logicsetup_temperature(plugin) {
            return Promise.resolve(true);
        },
        flash_plugin_cleanup_temperature() {},
    },
};
