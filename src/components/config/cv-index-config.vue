<template>
    <div class="main_xx">
        <div class="main_right2 fl" style="height: 100%;overflow: auto">
            <!--<div :is="left_menu" ></div>-->
            <CVConfigMenu></CVConfigMenu>
        </div>
        <div class="main_mid_2 config_scollbar" id="main_frame" style="height: 100%;overflow-y: auto">
            <div :key="comp_identity" :ref="main_frame" :is="main_frame"></div>
        </div>
        <!--
		   鱼眼ipc
		   多sensor ipc 支持打开和配置 不同的dev不同的ch
	   -->
        <div style="position: absolute;top: 100px;right: 20px;text-align: right">
            <div v-show="show_dev">
                <label v-tr="i18n_Device"></label>:
                <select style="width: 60px;" v-model="dev_change">
                    <option v-for="(item, index) in DevChanStreams" :value="index + 1">{{ 'dev_' + (index + 1) }}</option>
                </select>
            </div>
            <div v-show="show_chan">
                <label v-tr="i18n_channel"></label>:
                <select style="width: 60px;" v-model="ch_change">
                    <option v-for="(item, index) in DevChanStreams[dev - 1]" :value="index + 1">{{ 'ch0' + (index + 1) }}</option>
                </select>
            </div>
        </div>
        <!---
		vms/p2p 远程自动登录 跳转时使用
		参数配置tab内部共享的小视频窗口-->
        <div
            id="config_plugin_wrapper"
            style="position:absolute;width:1px;height:1px;top:-1px;left:-1px;border:1px solid gray"
            v-if="$store.getters.current_app_frame == 'CVFrameConfig'"
        >
            <CVPlugin identity="config" type="CONFIGPARAMETER" class="full"></CVPlugin>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import CVConfigMenu from 'components/config/cv-config-menu';
    import CVConfigMsg from 'components/config/cv-config-msg';

    const CVConfigBaseInfo = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-baseinfo');
    const CVConfigGataControl = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-gatecontrol');
    const CVConfigGataFeedback = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-gatefeedback');
    const CVConfigIOConfig = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-ioconfig');
    const CVConfigWiegandConfig = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-wiegandconfig');
    const CVConfigDisplayConfig = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-displayconfig');
    const CVConfigLightControl = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-lightcontrol');
    const CVConfigAdverPic = () => import(/* webpackChunkName: "peripheral" */ 'components/config/peripheral/cv-config-adverpic/');

    const CVConfigTimeSet = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-timeset');
    const CVConfigNetworkSetting = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-network');
    const CVConfigWirelessAP = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-ap');
    const CVConfigWifiConfig = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-wifi');
    const CVConfig4G = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-4g');
    const CVConfigPortConfig = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-port');
    const CVConfigP2PConfig = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-p2p');
    const CVConfigTFCard = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-tfcard');
    const CVConfigUser = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-user');
    const CVConfigEmail = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-email');
    const CVConfigStorage = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-storage');
    const CVConfigPasswdOpen = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-passwdopen');
    const CVConfigSwitchOpen = () => import(/* webpackChunkName: "system" */ 'components/config/system/cv-config-switchopen');
    
    const CVConfigFaceConfig = () => import(/* webpackChunkName: "param" */ 'components/config/param/cv-config-faceconfig');
    const CVConfigTempConfig = () => import(/* webpackChunkName: "param" */ 'components/config/param/cv-config-tempconfig');
    const CVConfigDetectMinArea = () => import(/* webpackChunkName: "param" */ 'components/config/param/cv-config-detectminarea');
    const CVConfigFaceSchedule = () => import(/* webpackChunkName: "param" */ 'components/config/param/cv-config-faceschedule');
    const CVConfigSpeech = () => import(/* webpackChunkName: "param" */ 'components/config/param/cv-config-speech');
    const CVConfigOSDConfig = () => import(/* webpackChunkName: "param" */ 'components/config/param/cv-config-osd');
    const CVConfigVideo = () => import(/* webpackChunkName: "param" */ 'components/config/param/cv-config-video');
    
    const CVConfigHTTPUpload = () => import(/* webpackChunkName: "upload" */ 'components/config/upload/cv-config-httpupload');
    const CVConfigFTPUpload = () => import(/* webpackChunkName: "upload" */ 'components/config/upload/cv-config-ftpupload');
    
    const CVConfigVersionInfo = () => import(/* webpackChunkName: "about" */ 'components/config/about/cv-config-versioninfo');
    const CVConfigUpgrade = () => import(/* webpackChunkName: "about" */ 'components/config/about/cv-config-upgrade');
    const CVConfigDiagnose = () => import(/* webpackChunkName: "about" */ 'components/config/about/cv-config-diagnose');
    const CVConfigMaintain = () => import(/* webpackChunkName: "about" */ 'components/config/about/cv-config-maintain');
    const CVConfigLog = () => import(/* webpackChunkName: "about" */ 'components/log/cv-index-log');

    export default {
        name: 'CVFrameConfig',
        data() {
            return {
                dev: 1,
                ch: 1,
                need_dev: [
                    'CVConfigVideo',
                ],
                need_chan: [],
            };
        },
        mounted() {
            this.$store.dispatch('click_configmenu_item', { name: 'CVConfigVersionInfo' });

            msg('CVFrameConfig mounted!');
        },
        computed: {
            DevChanStreams() {
                return this.$store.getters.factory_info.OptionalDevChanStreams;
            },
            activated() {
                return this.$store.getters.config_activated;
            },
            main_frame() {
                return this.$store.getters.main_frame;
            },
            comp_identity() {
                return this.$store.getters.config.key;
            },
            height() {
                msg(['height', this.$parent, this.$store.getters.content_rect.height]);
                return this.$parent.height ? this.$parent.height : this.$store.getters.content_rect.height + 'px';
            },
            is_fish() {
                return this.$store.getters.factory_info.IsOfFishEye == 'y';
            },
            is_temperature() {
                return this.$UI['CVTopMenu']['tab_temperature'].visible;
            },
            dev_change: {
                get: function() {
                    return this.$store.getters.config.dev;
                },
                set: function(v) {
                    msg('dev_change');
                    this.$store.commit('config/dev', v);
                    this.$store.commit('config/ch', 1);
                    //reload current page

                    this.$refs['menulist'].right_main_frame(this.main_frame);
                },
            },
            ch_change: {
                get: function() {
                    return this.$store.getters.config.ch;
                },
                set: function(v) {
                    this.$store.commit('config/ch', v);
                    //reload current page
                    this.$refs['menulist'].right_main_frame(this.main_frame);
                },
            },
            show_dev() {
                //测温设备显示设置页面显示dev
                if (this.is_temperature) {
                    return this.main_frame == 'CVConfigVideoShow';
                } else if (this.is_fish) {
                    return false;
                } else {
                    return this.need_dev.includes(this.main_frame) && this.DevChanStreams.length > 1 ? true : false;
                }
            },
            show_chan() {
                //测温设备显示设置页面显示chan
                if (this.is_temperature) {
                    return false;
                } 
                else {
                    return this.need_chan.includes(this.main_frame) && this.DevChanStreams[this.dev - 1].length > 1 ? true : false;
                }
            },
        },
        watch: {
            activated(newVal, oldVal) {
                let vm = this.$refs[this.main_frame];
                msg('config activated:', vm);
                /**
                 * 约定子选项卡组件$options.name以Tabs结尾
                 */
                let isSubTabs = vm.$options.name && vm.$options.name.endsWith('Tabs');
                /**
                 * bugfixed:
                 * 不带子选项卡有视频的的mainframe 直接调用vm.repos_plugin hide_plugin
                 * 有子选项卡,某个选项卡有视频的 找到当前显示的子tab 在调用repos 和hide
                 */
                if (isSubTabs) {
                    //将vm改为当前显示的子tab
                    vm = vm.$children[0].$children[0];
                }
                if (vm && vm.repos_plugin && vm.hide_plugin) {
                    newVal ? vm.repos_plugin() : vm.hide_plugin();
                }
                if (newVal && vm.load) {
                    vm.load();
                }
            },
        },
        components: {
            CVConfigMsg,
            CVConfigMenu,
           
            CVConfigBaseInfo,
            CVConfigGataControl,
            CVConfigGataFeedback,
            CVConfigIOConfig,
            CVConfigWiegandConfig,
            CVConfigDisplayConfig,
            CVConfigLightControl,
            CVConfigAdverPic,

            CVConfigTimeSet,
            CVConfigNetworkSetting,
            CVConfigWirelessAP,
            CVConfigWifiConfig,
            CVConfig4G,
            CVConfigPortConfig,
            CVConfigP2PConfig,
            CVConfigTFCard,
            CVConfigUser,
            CVConfigEmail,
            CVConfigStorage,
            CVConfigPasswdOpen,
            CVConfigSwitchOpen,
            CVConfigFaceConfig,

            CVConfigTempConfig,
            CVConfigDetectMinArea,
            CVConfigFaceSchedule,
            CVConfigSpeech,
            CVConfigOSDConfig,
            CVConfigVideo,

            CVConfigHTTPUpload,
            CVConfigFTPUpload,

            CVConfigVersionInfo,
            CVConfigUpgrade,
            CVConfigDiagnose,
            CVConfigMaintain,
            CVConfigLog,
        },
    };
</script>
