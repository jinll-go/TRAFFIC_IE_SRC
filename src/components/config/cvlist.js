import Vue from 'vue';
import { generate_compkeys } from 'common/util';
export default {
    name: 'CVConfigMenu',
    data() {
        return {
            list: [],
        };
    },
    mounted() {
        if (this.$UI['CVTopMenu']['tab_face'].visible == true) {
            this.$UI['CVConfigMenu']['CVConfigFaceDetect'].visible = false;
        }
        this.$store.commit('config/plugin_stream_status', false);
        this.refresh();
    },

    methods: {
        refresh() {
            let lang = this.$store.getters.current_language;
            let ui_custom = this.$UI.CVConfigMenu;
            let showSmartDomepages = this.$Param.EnableSmartDomePages;
            this.list = [
                {
                    name : lang.i18n_menu_peripheral,
                    visible : true,
                    children:[
                        {
                            name: lang.i18n_menu_baseInfo,
                            component_name:'CVConfigBaseInfo',
                            visible: ui_custom.CVConfigBaseInfo.visible,
                        },
                        
                        {
                            name: lang.i18n_menu_gateControl,
                            component_name:'CVConfigGataControl',
                            visible:ui_custom.CVConfigGataControl.visible,
                        },
                        {
                            name: lang.i18n_menu_gateFeedback,
                            component_name:'CVConfigGataFeedback',
                            visible:ui_custom.CVConfigGataFeedback.visible,
                        },
                        {
                            name: lang.i18n_menu_IOConfig,
                            component_name:'CVConfigIOConfig',
                            visible:ui_custom.CVConfigIOConfig.visible,
                        },
                        {
                            name: lang.i18n_menu_wiegandConfig,
                            component_name:'CVConfigWiegandConfig',
                            visible:ui_custom.CVConfigWiegandConfig.visible,
                        },
                        {
                            name: lang.i18n_menu_displayConfig,
                            component_name:'CVConfigDisplayConfig',
                            visible:ui_custom.CVConfigDisplayConfig.visible,
                        },
                        {
                            name: lang.i18n_menu_lightControl,
                            component_name:'CVConfigLightControl',
                            visible:ui_custom.CVConfigLightControl.visible,
                        },
                        {
                            name: lang.i18n_menu_adverPic,
                            component_name:'CVConfigAdverPic',
                            visible:ui_custom.CVConfigAdverPic.visible,
                        },
                    ],
                },
                {
                    name: lang.i18n_menu_System,
                    children:[
                        {
                            name: lang.i18n_menu_timeSet,
                            component_name:'CVConfigTimeSet',
                            visible:ui_custom.CVConfigTimeSet.visible,
                        },
                        /*客户端位置不够单拎出来，IE端复用的IPC界面是在一块的，就先不实现该页面
                        {
                            name: lang.i18n_menu_dstSet,
                            component_name:'CVConfigDstSet',
                            visible:ui_custom.CVConfigDstSet.visible,
                        },
                        */
                       
                        {
                            name: lang.i18n_menu_network,
                            visible: ui_custom.CVConfigNetworkSetting.visible,
                            component_name: 'CVConfigNetworkSetting',
                        },
                        {
                            name: lang.i18n_menu_wirelessAP,
                            visible: ui_custom.CVConfigWirelessAP.visible,
                            component_name: 'CVConfigWirelessAP',
                        },
                        {
                            name: lang.i18n_menu_wifi,
                            visible: ui_custom.CVConfigWifiConfig.visible,
                            component_name: 'CVConfigWifi',
                        },
                        {
                            name: lang.i18n_menu_4g,
                            visible: ui_custom.CVConfig4G.visible,
                            component_name: 'CVConfig4G',
                        },
                        {
                            name: lang.i18n_menu_port,
                            visible: ui_custom.CVConfigPortConfig.visible,
                            component_name: 'CVConfigPortConfig',
                        },
                        {
                            name: lang.i18n_menu_P2P,
                            visible: ui_custom.CVConfigP2PConfig.visible,
                            component_name: 'CVConfigP2PConfig',
                        },
                        {
                            name: lang.i18n_menu_tfCard,
                            visible: ui_custom.CVConfigTFCard.visible,
                            component_name: 'CVConfigTFCard',
                        },
                        {
                            name: lang.i18n_menu_userManage,
                            visible: ui_custom.CVConfigUser.visible,
                            component_name: 'CVConfigUser',
                        },
                        {
                            name: lang.i18n_menu_email,
                            visible: ui_custom.CVConfigEmail.visible,
                            component_name: 'CVConfigEmail',
                        },
                        {
                            name: lang.i18n_menu_storage,
                            visible: ui_custom.CVConfigStorage.visible,
                            component_name: 'CVConfigStorage',
                        },
                        {
                            name: lang.i18n_menu_passwdOpen,
                            visible: ui_custom.CVConfigPasswdOpen.visible,
                            component_name: 'CVConfigPasswdOpen',
                        },
                        {
                            name: lang.i18n_menu_switchOpen,
                            visible: ui_custom.CVConfigSwitchOpen.visible,
                            component_name: 'CVConfigSwitchOpen',
                        },
                        
                    ],
                },
                {
                    name: lang.i18n_menu_param,
                    children:[
                        {
                            name: lang.i18n_menu_faceConfig,
                            component_name:'CVConfigFaceConfig',
                            visible:ui_custom.CVConfigFaceConfig.visible,
                        },
                        {
                            name: lang.i18n_menu_tempConfig,
                            component_name:'CVConfigTempConfig',
                            visible:ui_custom.CVConfigTempConfig.visible,
                        },
                        {
                            name: lang.i18n_menu_detectMinArea,
                            component_name:'CVConfigDetectMinArea',
                            visible:ui_custom.CVConfigDetectMinArea.visible,
                        },
                        {
                            name: lang.i18n_menu_faceSchedule,
                            component_name:'CVConfigFaceSchedule',
                            visible:ui_custom.CVConfigFaceSchedule.visible,
                        },
                        {
                            name: lang.i18n_menu_speech,
                            component_name:'CVConfigSpeech',
                            visible:ui_custom.CVConfigSpeech.visible,
                        },
                        {
                            name: lang.i18n_menu_osd,
                            component_name:'CVConfigOSDConfig',
                            visible:ui_custom.CVConfigOSDConfig.visible,
                        },
                        {
                            name: lang.i18n_menu_video,
                            component_name:'CVConfigVideo',
                            visible:ui_custom.CVConfigVideo.visible,
                        },
                    ],
                },
                {
                    name:  lang.i18n_menu_upload,
                    children:[
                        {
                            name: lang.i18n_menu_httpUpload,
                            component_name:'CVConfigHTTPUpload',
                            visible:ui_custom.CVConfigHTTPUpload.visible,
                        }, 
                        {
                            name: lang.i18n_menu_ftpUpload,
                            component_name:'CVConfigFTPUpload',
                            visible:ui_custom.CVConfigFTPUpload.visible,
                        }, 
                    ]
                },
                {
                    name:  lang.i18n_menu_about,
                    children:[
                        {
                            name: lang.i18n_menu_versionInfo,
                            component_name:'CVConfigVersionInfo',
                            visible:ui_custom.CVConfigVersionInfo.visible,
                        }, 
                        {
                            name: lang.i18n_menu_upgrade,
                            component_name:'CVConfigUpgrade',
                            visible:ui_custom.CVConfigUpgrade.visible,
                        }, 
                        {
                            name: lang.i18n_menu_diagnose,
                            component_name:'CVConfigDiagnose',
                            visible:ui_custom.CVConfigDiagnose.visible,
                        },
                        {
                            name: lang.i18n_menu_maintain,
                            component_name:'CVConfigMaintain',
                            visible:ui_custom.CVConfigMaintain.visible,
                        },
                        {
                            name: lang.i18n_menu_log,
                            component_name:'CVConfigLog',
                            visible:ui_custom.CVConfigLog.visible,
                        },
                    ]
                }
            ];
        },
        loaditem(name, component_name) {
            msg('loaditem', name, component_name);

            if (this.$store.getters.main_frame == component_name) {
                //双击reload
                /*this.$store.dispatch('click_configmenu_item', { name: '' });
                setTimeout(() => {
                    this.$store.dispatch('click_configmenu_item', { name });
                }, 150);*/
                /**
                 * 异步更新 需要在nextTick中处理
                 */
                //使用$forceUpdate 强制组件刷新,不会触发组件生命周期函数
                //使用key,同一组件实例key发生变化,可触发组件remount
                this.$store.commit('config/value_changed', {
                    key: generate_compkeys(),
                });
            } else {
                //切换前 判断是否需要关闭plugin rtsp流
                let oldname = this.$store.getters.main_frame;
                msg([oldname, '=>', name]);

                this.$store.dispatch('click_configmenu_item', {
                    name: component_name,
                });
            }

            if (this.focusitem) {
                Vue.set(this.focusitem, 'focus', false);
            }
            let i, j;
            i = this.list.findIndex((el) => {
                j = -1;
                if (el.children.length) {
                    j = el.children.findIndex((item) => item.name == name);
                }
                return j != -1;
            });

            this.focusitem = this.list[i].children[j];

            Vue.set(this.focusitem, 'focus', true);
        },
        right_main_frame(component_name) {
            this.loaditem('', component_name);
        },
        expand(name) {
            msg('expend!!!', name);

            let i = this.list.findIndex((el) => el.visible);
            let sec = this.list[i];
            Vue.set(sec, 'visible', false);

            i = this.list.findIndex((el) => el.name == name);
            sec = this.list[i];

            Vue.set(sec, 'visible', !sec.visible);
        },
        //更新 列表子项的状态
        update_subitem(name, val) {
            for (let tmp of this.list) {
                let idx = tmp.children.findIndex((item) => item.name == name);
                if (idx != -1) {
                    Vue.set(tmp.children, idx, $.extend(true, {}, tmp.children[idx], val));

                    break;
                }
            }
        },
    },

    render() {
        return this.$scopedSlots.default({
            tags: this.list,
            expand: this.expand,
            loaditem: this.loaditem,
        });
    },
};
