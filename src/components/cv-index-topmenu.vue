<template>
    <div class="top">
        <iframe frameborder="0" style="left: 0px; top: 0px; width: 100%; height: 100%; position: absolute; z-index: -1;"></iframe>
        <slot>
            <div class="top_01" v-if="!$store.getters.is_xiaoding">
                <div class="top_mt1"><img src="static/images/logo.png" /></div>
                <div class="top_mt2 bold f14" v-show="ui_custom.lblmolNO.visible">
                    <label>{{ lblmolNO }}</label
                    >&nbsp;&nbsp;
                    <label v-show="false">{{ lblversion }}</label>
                </div>
            </div>
        </slot>

        <div class="top_02">
            <div class="nav">
                <div v-for="item of menu_items" :key="item.text" :class="[item.active ? 'nav_2' : 'nav_1']" @click="choose_menu_item(item)" v-show="item.show">
                    <a v-tr="item.text" style="position: relative; top:40%;margin-top: -150px;"></a>
                    <!--<div v-if="item.identity == 'alarm'" style=" height:100%;display:inline-block;vertical-align:middle;"><img :src="alarm_state_url" /></div>-->
                </div>
            </div>
        </div>
        <div class="fr">
            <div class="mt10 f16 bold pr20">
                <label v-show="ui_custom.brand.visible">{{ lblBrand }}</label>
            </div>
            <div class="logc">
                <label>{{ lblUserName }}</label
                >&nbsp;&nbsp;|&nbsp;&nbsp;<a @click="logout" v-tr="i18n_logout">{{}}</a>
            </div>
        </div>
        
    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapState } from 'vuex';

    export default {
        name: 'CVTopMenu',
        data() {
            /*此时计算属性中的值还不能访问*/
            let ui_custom = this.$UI[this.$options.name];
            return {
                lblmolNO: this.$store.getters.factory_info.DeviceModel,
                lblversion: '',
                lblBrand: this.$store.getters.factory_info.Brand,
                lblUserName: this.$store.getters.tokenA,
                logout_text: '',
                menu_items: [
                    /**********liuxin change top 调整**************/
                    // 去掉不要的,调整顺序，增加新top
                    /*   i18n_face  <--->  客户端的预览
                         i18n_face_list_manage   <--->  客户端的名单管理
                         i18n_config  <--->  客户端的系统配置
                         i18n_log  <--->  客户端的通信配置  */
                    /*{
                        text: 'i18n_preview',
                        identity: 'preview',
                        active: this.$UI['CVTopMenu']['tab_temperature'].visible ? false : true,
                        show: ui_custom.tab_preview.visible,
                    },*/
                    //{ text: 'i18n_playback', identity: 'pbslider', active: false, show: ui_custom.tab_playback.visible },
                    //{ text: 'i18n_fileManage', identity: 'file', active: false, show: ui_custom.tab_file.visible },
                    { text: 'i18n_face', identity: 'facedb', active: true, show: ui_custom.tab_face.visible },
                    { text: 'i18n_face_list_manage', identity: 'face_manage', active: false, show: ui_custom.tab_ManageFace.visible },
                    { text: 'i18n_config', identity: 'config', active: false, show: ui_custom.tab_config.visible },
                    { text: 'i18n_traffic_record', identity: 'log', active: false, show: ui_custom.tab_log.visible },
                    //{ text: 'i18n_log', identity: 'log', active: false, show: ui_custom.tab_log.visible },
                    /*{ text: 'i18n_alarm', identity: 'alarm', active: false, show: ui_custom.tab_alarm.visible },*/
                    /*{ text: 'i18n_face', identity: 'facedb', active: false, show: ui_custom.tab_face.visible },*/
                    /*{ text: 'i18n_StatisticalReport', identity: 'persondb', active: false, show: ui_custom.tab_person.visible },
                    { text: 'i18n_AIFunction', identity: 'custom', active: false, show: ui_custom.tab_custom.visible },
                    {
                        text: 'i18n_body_temperature',
                        identity: 'temperature',
                        active: this.$UI['CVTopMenu']['tab_temperature'].visible ? true : false,
                        show: ui_custom.tab_temperature.visible,
                    },*/
                    /**********liuxin change top 调整**************/
                ],
            };
        },
        created() {
            //获取smart能力集
            this.$store
                .dispatch('request', { url: 'goform/frmGetSmartAbility', Type: 0, Data: {} })
                .then((r) => {
                    //smart ability
                    if (r.Result == 0) {
                        // msg(['瞅瞅有哪些能力级',_.Data.List])
                        this.$store.commit('SmartAbility/data_change', r.Data.List);
                    }
                })
                .catch((e) => {
                    //404
                });
            
             //获取能力集
            this.$store
                .dispatch('request', { url: 'goform/frmDevicePara', Type: 99, Data: {} })
                .then((r) => {
                    if (r.Result == 0) {
                         //msg(['瞅瞅有哪些能力级',r.Data])
                        this.$store.commit('Ability/fc_cap_change', r.Data);
                    }
                })
                .catch((e) => {
                    //404
                });

            //flash hide fileManage
            if (this.plugin_type == 'flash') {
                Vue.set(this.menu_items[2], 'show', false);
            }
            //人脸识别tab定制打开时 参数配置 人脸检测需要隐藏
            if (this.ui_custom.tab_face.visible == true) {
                this.$UI['CVConfigMenu']['CVConfigFaceDetect'].visible = false;
            }
            if (
                this.ui_custom['tab_face'].visible == false /*非人脸识别机 */ &&
                this.$UI['CVConfigMenu']['CVConfigFaceDetect'].visible == false /*非人脸抓拍机 */
            ) {
                this.$UI['CVFramePreview']['face_pics_save'].visible = false;
                this.$UI['CVFramePreview']['fullpic_save'].visible = false;
            }

            this.$store.dispatch('request', { url: 'goform/frmGetHDInfo', Type: 0, Data: {} }).then((r) => {
                //是否有sd卡
                //check deivce mount SD cards or not
                if (r) {
                    let visible;
                    let SDConfig = this.$UI.SDCard.visible;
                    if (!r.Data || !r.Data.HDInfoList || r.Data.HDInfoList.length == 0) {
                        visible = false;
                    } else {
                        visible = true;
                    }
                    if (!SDConfig || !visible) {
                        //隐藏 sd卡相关ui
                        this.$UI.SDCard.visible = false;
                    }

                    visible = this.$UI.SDCard.visible;

                    Vue.set(this.$UI['CVTopMenu'], 'tab_playback', { visible });
                    Vue.set(this.menu_items[1], 'show', visible);

                    if (visible == false) {
                        this.$UI['CVTopMenu']['tab_person'].visible == false;
                        Vue.set(this.menu_items[7], 'show', visible);
                    }
                    let leftmenu = this.get_configmenu_vm();
                    //更新参数配置左侧菜单
                    /*Vue.set(leftmenu.$data.list, 'i18n_videoplan', {
                        visible: visible && this.$UI.CVConfigMenu.CVConfigVideoPlan.visible,
                        component_name: 'CVConfigVideoPlan',
                    });*/
                    leftmenu.update_subitem(this.lang.i18n_videoplan, {
                        visible: visible && this.$UI.CVConfigMenu.CVConfigVideoPlan.visible,
                        component_name: 'CVConfigVideoPlan',
                    });
                    let isShowHD = true;
                    let tmpComponentName = '';
                    if (visible && this.$UI.CVConfigMenu.CVConfigIndexCapacity.visible) {
                        tmpComponentName = 'CVConfigIndexCapacity';
                    } else if (visible && this.$UI.CVConfigMenu.HD.visible) {
                        tmpComponentName = 'CVConfigHD';
                    } else {
                        isShowHD = false;
                    }
                    /*Vue.set(leftmenu.$data.list, 'i18n_HD', {
                        visible: isShowHD,
                        component_name: tmpComponentName,
                    });*/
                    leftmenu.update_subitem(this.lang.i18n_HD, {
                        visible: isShowHD,
                        component_name: tmpComponentName,
                    });
                }
            });
            this.$store.dispatch('request', { url: 'goform/frmGetQRCode', Type: 0, Data: {} }).then((r) => {
                //check if need to hide qrcode page
                if (r.Result == -655365) {
                    //this.$store.dispatch('config_no_right');
                } else if (r.Result == 0) {
                    if (!r.Data || !r.Data.QRSelects) {
                        this.$UI['CVConfigMenu']['CVConfigQRCode'].visible = false;
                        let leftmenu = this.get_configmenu_vm();
                        //Vue.set(leftmenu.$data.list, 'i18n_qrCode', { visible: false, component_name: 'CVConfigQRCode' });
                        leftmenu.update_subitem(this.lang.i18n_qrCode, { visible: false, component_name: 'CVConfigQRCode' });
                    }
                }
            });
            /*this.$store
                .dispatch('request', { url: 'goform/frmNetLtepara', Type: 0, Data: {} })
                .then((r) => {
                    let net4G = this.$UI['CVConfigMenu']['net4G'];
                    //4g
                    if (r.Result == 0) {
                        if (r.Data && typeof r.Data.IsSupported != 'undefined' && r.Data.IsSupported == 0) {
                            net4G.visible = false;
                        } else {
                            net4G.visible = true;
                        }
                    } else {
                        net4G.visible = false;
                    }
                    msg('!!!!!!!!!!!!!', net4G.visible);
                    let leftmenu = this.get_configmenu_vm();
                    //Vue.set(leftmenu.$data.list, 'i18n_4GConfig', { visible: net4G.visible, component_name: 'CVConfig4G' });
                    leftmenu.update_subitem(this.lang.i18n_4GConfig, { visible: net4G.visible, component_name: 'CVConfig4G' });
                })
                .catch((e) => {
                    //404
                    let leftmenu = this.get_configmenu_vm();
                    //Vue.set(leftmenu.$data.list, 'i18n_4GConfig', { visible: false, component_name: 'CVConfig4G' });
                    leftmenu.update_subitem(this.lang.i18n_4GConfig, { visible: false, component_name: 'CVConfig4G' });
                });*/
            this.$store.dispatch('request', { url: 'goform/frmWifiPara', Type: 0, Data: {} }).then((r) => {
                let wifi = this.$UI['CVConfigMenu']['wifi'];
                //wifi
                if (r.Result == 0) {
                    if (r.Data && typeof r.Data.IsSupported != 'undefined' && r.Data.IsSupported == 0) {
                        wifi.visible = false;
                    }
                } else {
                    wifi.visible = false;
                }
                let leftmenu = this.get_configmenu_vm();
                //Vue.set(leftmenu.$data.list, 'i18n_wificonig', { visible: wifi.visible, component_name: 'CVConfigWifi' });
                leftmenu.update_subitem(this.lang.i18n_wificonig, { visible: wifi.visible, component_name: 'CVConfigWifi' });
            });
        },

        mounted() {
            window.onbeforeunload = function() {
                msg(this);
                msg('window.onbeforeunload');
                if (this.$store.getters.Face.isNeedEnableFace) {
                    this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', async: false, Type: 1, Data: { Enable: 1 } });
                }
                this.beforeunloadHandler();
            }.bind(this);
        },
        destroyed() {
            window.onbeforeunload = null;
        },

        methods: {
            get_configmenu_vm() {
                //找到CVFrameConfig
                let leftmenu = null;
                let vm = this.$parent.$children.find((vm) => {
                    return vm.$options._componentTag == 'CVFrameConfig';
                });
                //找到lefmenu的vm
                if (vm) {
                    //find CVConfigMenu
                    /* leftmenu = vm.$children.find((vm) => {
                        return vm.$options._componentTag == 'cvlist';
                    });*/
                    //try cvlist
                    // if (!leftmenu) {
                    leftmenu = vm.$children[0].$children[0];
                    //  }
                }
                return leftmenu;
            },
            beforeunloadHandler() {
                msg('beforeunloadHandler');
                if (this.$store.getters.login_status) {
                    this.$store
                        .dispatch('logout', { reason: 'beforeunloadHandler fire' })
                        .then((login_status) => {})
                        .catch(() => {
                            //alert(this.$store.getters.current_language["i18n_tips_logout_failed"]);
                        });
                }
            },
            logout(str) {
                window.location.reload();
            },
            choose_menu_item(item) {
                msg("----liuxin  test msg ----"+item.identity);
                msg(item.identity);

                this.menu_items.forEach((item) => {
                    Vue.set(item, 'active', false);
                });

                Vue.set(item, 'active', true);
                this.$store.dispatch('frame_change', item.identity);
            },
        },
        computed: {
            alarm_state_url() {
                let obj = this.$store.getters.config.alarm_list;
                let ar = obj.filter((i) => {
                    return i.State == 'true' || i.Status;
                });
                //msg(ar)
                return ar.length ? 'static/images/32.gif' : 'static/images/32a.gif';
            },
        },
    };
</script>
