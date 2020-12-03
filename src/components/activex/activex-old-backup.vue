<template>
    <div v-if="plugin_installed == 2">
        <div id="altContent" v-if="plugintype_is_flash">
            <h1>RTMPClient</h1>
            <p style="text-decoration: underline"><a href="http://www.adobe.com/go/getflashplayer" v-tr="i18n_flash_install_tips">Get Adobe Flash player</a></p>
        </div>
        <!-- h5测温 特殊处理。 插件提供了一个obejct 播放2分屏的功能，h5只能一个plugin播放一路流 -->
        <div class="full" v-else-if="is_temperature_double_wnd">
            <div style="float:left;width:50%;height:100%" :id="identity + '_dev0'"></div>
            <div style="float:left;width:50%;height:100%" :id="identity + '_dev1'"></div>
        </div>
        <div class="full " v-else-if="is_fisheye_h5">
            <table class="black-back" style="table-layout:fixed" width="100%" height="100%" cellspacing="0" cellpadding="0" border="1">
                <tr v-for="rowdata of fish_wnd_sequence">
                    <td v-for="item of rowdata" :id="item.id" :rowspan="item.rowspan" :colspan="item.colspan"></td>
                </tr>
            </table>
        </div>
        <object :id="identity" width="100%" height="100%" type="application/x-rtspvideoplugin" v-else>
            <param :value="readyCb" name="onload" />

            <param :value="chan_num" name="CHNUM" v-if="type == 'PREVIEW'" />
            <!--<param value="9" name="CHNUM" v-if="type == 'FISHEYE'" />-->
            <param :value="pb_split_num" name="SPILTNUM" v-if="type == 'PLAYBACK'" />
            <param name="STATE" :value="state" v-if="type == 'CONFIGPARAMETER'" />
            <param value="8.3.0.0" name="VERSION" />
            <param :value="type" name="TYPE" />
            <param value="memory" name="LOCALSETTINGS" />
            <param :value="showbar" name="SHOWSEARCHBAR" />
        </object>
    </div>
    <div v-else style="text-align: left;background: #000;color: #fff;height: 100%">
        <div style="padding: 10px;">
            <div v-if="plugin_installed == 0">
                <p v-tr="i18n_plugin_not_installed">plugin is not installed !</p>
                <div style="text-decoration: underline">
                    <p>
                        <a :href="download_exe_name" target="_blank" @click="GetPluginInstallStatus" v-tr="i18n_activex_install_tips"
                            >Click here to install activex plugin for IE only.</a
                        >
                    </p>
                    <!--					<p><a href="http://www.adobe.com/go/getflashplayer" v-tr="i18n_flash_install_tips">Click here to get adobe flash player for other browsers.</a></p>-->
                </div>
            </div>
            <div v-if="plugin_installed == 1">
                <p v-tr="i18n_activex_version_lower">plugin's version is lower !</p>
                <p style="text-decoration: underline">
                    <a :href="download_exe_name" target="_blank" v-tr="i18n_activex_upgrade_tips">Click here to update activex plugin.</a>
                </p>
                <p style="color: red;" v-tr="i18n_activex_upgrade_tips_1">
                    When upgrading activex plugin, please close your browser to ensure the plugin are installed correctly.
                </p>
            </div>
            <div v-if="plugin_installed == -1">
                <p style="color: red;" v-tr="i18n_activex_filtering_enable">ActiveX filtering is enabled, please disable it !</p>
            </div>
            <div v-if="plugin_installed == -2">
                <p style="color: red;" v-tr="i18n_browser_unsupported_activex">Current browser is not supported ActiveX !</p>
            </div>
        </div>
    </div>
</template>

<script>
    import plugins from 'mixin/plugins';

    export default {
        name: 'CVPlugin',
        mixins: [...plugins],
        props: {
            /**
             * 插件模块标识
             * preview 预览
             * playback 回放
             * backup 备份
             * file 文件管理
             * config 参数配置
             * face 人脸识别
             * person 计数统计
             * temperature 测温
             */
            identity: {
                type: String,
                default: '',
            },
            type: {
                type: String,
                default: '',
            },
            state: {
                type: Number,
                default: 0,
            },
            /**
             * 回放有效,是否显示检索条
             */
            showbar: {
                type: Number,
                default: 1,
            },
        },
        data() {
            return {
                download_exe_name: 'rtspvideoplugin.exe',
            };
        },
        beforeMount() {
            if (window.plugin_download_addr) {
                this.download_exe_name = window.plugin_download_addr;
            }
            //promise try 需要pollyfill
            //Promise.try(() => {
            this[`${this.plugin_type}_context_init`](this.identity)
                //})
                .then((plugin) => {
                    if (!plugin) {
                        msg('plugin inited failed!');
                        return Promise.resolve(false);
                    } else {
                        return this.run_plugin_logical(plugin);
                    }
                })
                .then((logic_setup_status) => {
                    msg(this.identity, 'logical setup run ', logic_setup_status);
                })
                .catch((err) => {
                    error(this.identity, err);
                });
        },
        beforeDestroy() {
            //插件销毁时 需要关流 ，注销事件监听 等
            this.clean_plugin_stuffs();
        },
        methods: {
            run_plugin_logical(plugin) {
                let fname = `${this.plugin_type}_logicsetup_${this.identity}`;
                msg(fname);
                let fn = this[fname];
                if (!fn) {
                    msg('not impls fn:', fname);
                    return Promise.resolve(false);
                } else {
                    return fn(plugin);
                }
            },
            clean_plugin_stuffs() {
                let fname = `${this.plugin_type}_plugin_cleanup_${this.identity}`;
                msg(fname);
                this[fname]();
            },
        },
        computed: {
            plugintype_is_flash() {
                return this.plugin_type == 'flash';
            },
            readyCb() {
                return this.identity + '_pluginLoaded';
            },
            plugin_installed() {
                return this.$store.getters.base.plugin_installed;
            },
            is_temperature_double_wnd() {
                return this.plugin_type == 'h5' && this.$UI.CVTopMenu.tab_temperature.visible && (this.identity == 'preview' || this.identity == 'temperature');
            },
            is_fisheye_h5() {
                return this.plugin_type == 'h5' && this.$store.getters.is_fisheye && this.identity == 'preview';
            },
            fish_wnd_sequence() {
                let list = [];
                //2*2
                list.push([
                    {
                        id: `${this.identity}_ch0`,
                        rowspan: 2,
                        colspan: 2,
                    },

                    {
                        id: `${this.identity}_ch1`,
                    },
                ]);
                list.push([
                    {
                        id: `${this.identity}_ch2`,
                    },
                ]);
                list.push([
                    {
                        id: `${this.identity}_ch3`,
                    },
                    {
                        id: `${this.identity}_ch4`,
                    },
                    {
                        id: `${this.identity}_ch5`,
                    },
                ]);

                return list;
            },
            chan_num() {
                /**
                 * 预览模块
                 * 普通ipc 按 单通道 初始化
                 * 测温 按照 2分屏
                 *  其他ipc 按9分屏初始化
                 */
                let { is_fisheye, is_temperature, is_multisensor, is_normal } = this.$store.getters;
                if (is_normal) {
                    return 1;
                }
                if (is_temperature) {
                    return 2;
                } else {
                    return 9;
                }
            },
            pb_split_num() {
                /**
                 * 回放模块
                 * 普通ipc 按照单通道 初始化
                 * 鱼眼ipc 按照其模式 来初始化,单通道 或者4分屏
                 * 测温 按单通道
                 * 剩余都按照4分屏初始化
                 */
                let { is_fisheye, is_temperature, is_multisensor, is_normal } = this.$store.getters;

                if (is_normal) {
                    return 1;
                } else if (is_fisheye) {
                    //鱼眼 单屏模式 1 ，多屏 4
                    num = ChanNum <= 1 ? 1 : 4;
                } else if (is_multisensor) {
                    if (!is_temperature) {
                        return 4;
                    } else {
                        return 1;
                    }
                }
            },
        },
    };
</script>
<style scoped>
   

    .black-back {
        background: black;
    }
</style>
