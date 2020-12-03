<template>
    <!-- 鱼眼的配置 -->
    <div>
        <div class="w100 pt5">
            <label v-tr="i18n_FishEyeSettings"><!--鱼眼参数设置--></label>
        </div>

        <div class="w100 pt5 xx1">
            <table style="margin: 0 5px">
                <tr>
                    <td>
                        <label v-tr="i18n_InstallMode"><!--安装方式--></label>:
                    </td>
                    <td>
                        <select class="textc" style="width: 120px;" v-model="InstallMode">
                            <option :value="0" v-tr="i18n_FishEye_Top"><!--顶装--></option>
                            <option :value="1" v-tr="i18n_FishEye_Wall"><!--壁装--></option>
                            <option :value="2" v-tr="i18n_FishEye_Ground"><!--地装--></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label v-tr="i18n_ViewMode"><!--展示方式--></label>:
                    </td>
                    <td>
                        <select class="textc" style="width: 120px;" v-model="ViewMode_selected">
                            <option v-for="(item, index) in list" :value="index">{{ item }}</option>
                            <!--<option :value="1">1鱼眼</option>-->
                            <!--<option :value="2">1鱼眼+1全景</option>-->
                            <!--<option :value="3">1鱼眼+3云台</option>-->
                            <!--<option :value="4">1鱼眼+4云台</option>-->
                            <!--<option :value="5">1鱼眼+1全景+3云台</option>-->
                        </select>
                    </td>
                </tr>
                <tr v-show="show_FullViewMode">
                    <td>
                        <label v-tr="i18n_FullViewMode"><!--展示方式--></label>:
                    </td>
                    <td>
                        <select class="textc" style="width: 120px;" v-model="FullViewMode">
                            <option :value="0">180°</option>
                            <option :value="1">360°</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>

        <div class="w100 pt5">
            <button class="btn1 middle" @click="save" v-tr="i18n_save"></button>
        </div>
        <div style="margin: 10px;">
            <div class="w100 mt40 xx1">
                <!--<label v-tr="i18n_PtzOperation"></label>-->
                <div class="w100" v-show="ui_custom.smart_rule.visible">
                    <input type="checkbox" id="cb_show_smart_rule" v-model="ClientFaceStrategy.EnableRule" />&nbsp;
                    <label id="lab_show_smart_rule" for="cb_show_smart_rule" v-tr="i18n_showSmartRule"><!--显示智能检测规则--></label>
                </div>
                <div class="w100" v-show="ui_custom.smart_result.visible">
                    <input type="checkbox" id="cb_show_smart_result" v-model="ClientFaceStrategy.EnableResult" />&nbsp;
                    <label id="lab_show_smart_result" for="cb_show_smart_result" v-tr="i18n_showSmartResult"><!--显示智能检测结果--></label>
                </div>
            </div>
        </div>
        <div style="margin: 10px;" v-show="ptz_chan_list.length">
            <!-- <div class="w100 mt40 xx1">

                <div class="w100" v-show="ui_custom.smart_rule.visible">
                    <input type="checkbox" id="cb_show_smart_rule" v-model="ClientFaceStrategy.EnableRule" />&nbsp;
                    <label id="lab_show_smart_rule" for="cb_show_smart_rule" v-tr="i18n_showSmartRule"><!--显示智能检测规则</label>
                </div>
                <div class="w100" v-show="ui_custom.smart_result.visible">
                    <input type="checkbox" id="cb_show_smart_result" v-model="ClientFaceStrategy.EnableResult" />&nbsp;
                    <label id="lab_show_smart_result" for="cb_show_smart_result" v-tr="i18n_showSmartResult"><!--显示智能检测结果</label>
                </div>
            </div>-->

            <!-- 云台通道 -->
            <div class="w100 pt10 xx1">
                <label v-tr="i18n_PtzChan"></label>:
                <select class="textc" style="width: 130px" v-model="ptz_chan">
                    <option v-for="item in ptz_chan_list" :value="item[0]">{{ item[1] }}</option>
                </select>
            </div>

            <div class="w100 pt10 mt5 xx1">
                <CVPanelPtz></CVPanelPtz>
                <CVPanelControl :show_focus="false" :show_iris="false"></CVPanelControl>
            </div>

            <div class="w100 pt5 mt10 xx1">
                <CVPanelPreset></CVPanelPreset>
                <CVPanelCruise></CVPanelCruise>
            </div>
        </div>

        <div class="w100 pt10 mt10 xx1">
            <CVPanelShortcutBar v-show="ui_custom.shortcutbar.visible"></CVPanelShortcutBar>
        </div>
    </div>
</template>
<script>
    import CVPanelPtz from 'components/preview/cv-panel-ptz';
    import CVPanelControl from 'components/preview/cv-panel-control';
    import CVPanelPreset from 'components/preview/cv-panel-preset';
    import CVPanelCruise from 'components/preview/cv-panel-cruise';
    import CVPanelShortcutBar from 'components/preview/cv-panel-shortcutbar';
    export default {
        name: 'CVFramePreview',

        data() {
            return {
                ViewMode: [[]],

                ViewMode_selected: 0,
                InstallMode: 1,
                FullViewMode: 1,
                list: [],

                alarmOutPort: 1,
            };
        },
        mounted() {
            Promise.all([
                this.$store.dispatch('request', {
                    url: '/goform/frmFisheyeAbility',
                    Ch: 1,
                    Type: 0,
                    Data: {},
                }),
                this.$store.dispatch('request', {
                    url: '/goform/frmFisheyeMode',
                    Ch: 1,
                    Type: 0,
                    Data: {},
                }),
            ]).then((r) => {
                msg(r);
                if (r[0].Result == -655365 || r[1].Result == -655365) {
                    //this.$store.dispatch('config_no_right');
                    error('frmFisheyeAbility frmFisheyeMode no right!');
                } else if (r[0].Result == 0 && r[1].Result == 0) {
                    this.$store.commit('PTZ/property_changed', {
                        fisheye: {
                            ability: r[0].Data,
                            curmode: r[1].Data,
                        },
                    });
                    let obj = this.lang;
                    this.ViewMode = r[0].Data.ViewMode;

                    this.mode_temp = r[1].Data.ViewMode;

                    for (let i = 0; i < this.ViewMode.length; i++) {
                        let str = this.ViewMode[i].FisheyeView + obj.i18n_FishEye;
                        if (this.ViewMode[i].FullView) {
                            str += '+' + this.ViewMode[i].FullView + obj.i18n_Panoramic;
                        }
                        if (this.ViewMode[i].PtzView) {
                            str += '+' + this.ViewMode[i].PtzView + obj.i18n_Ptz;
                        }
                        this.list.push(str);
                        if (
                            this.ViewMode[i].FisheyeView == this.mode_temp.FisheyeView &&
                            this.ViewMode[i].FullView == this.mode_temp.FullView &&
                            this.ViewMode[i].PtzView == this.mode_temp.PtzView
                        ) {
                            this.ViewMode_selected = i;
                        }
                    }

                    this.InstallMode = r[1].Data.InstallMode;
                    this.FullViewMode = r[1].Data.FullViewMode;

                    this.$notify.success(this.lang['i18n_getok'], '', { positionClass: 'toast-top-center' });
                } else {
                    this.$notify.error(this.lang['i18n_getfailed'], '', { positionClass: 'toast-top-center' });
                }
            });
        },

        methods: {
            save() {
                let is_reboot = false;
                if (this.curmode.InstallMode != this.InstallMode) is_reboot = true;
                if (
                    this.ViewMode[this.ViewMode_selected].FisheyeView != this.curmode.ViewMode.FisheyeView ||
                    this.ViewMode[this.ViewMode_selected].FullView != this.curmode.ViewMode.FullView ||
                    this.ViewMode[this.ViewMode_selected].PtzView != this.curmode.ViewMode.PtzView
                ) {
                    is_reboot = true;
                }
                msg(['is_reboot', is_reboot]);
                let d = {
                    InstallMode: this.InstallMode,
                    ViewMode: this.ViewMode[this.ViewMode_selected],
                    FullViewMode: this.FullViewMode,
                };
                this.$store
                    .dispatch('request', {
                        url: '/goform/frmFisheyeMode',
                        Ch: 1,
                        Type: 1,
                        Data: d,
                    })
                    .then((r) => {
                        if (r.Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else if (r.Result == 0) {
                            if (is_reboot) {
                                this.$store.dispatch('request', { url: 'goform/frmDeviceReboot', Type: 0, Data: {} }).then((r) => {
                                    alert(this.lang.i18n_update_ok);
                                });
                            } else {
                                this.$notify.success(this.lang['i18n_saveok'], '', { positionClass: 'toast-top-center' });
                            }
                        } else {
                            this.$notify.error(this.lang['i18n_savefailed'], '', { positionClass: 'toast-top-center' });
                        }
                    });
            },
            trigger_alarm() {
                msg('trigger_alarm!');
                this.$store.dispatch('request', { url: 'goform/frmAlarmOut', Type: 3, Data: { AlarmCh: this.alarmOutPort } }).then((r) => {
                    this.$store.dispatch('request', { url: 'goform/frmAlarmOut', Type: 4, Data: { AlarmCh: this.alarmOutPort } });
                });
            },
        },
        computed: {
            click_cruise() {
                return this.$store.getters.preview.dialog == 'CRUISE';
            },
            height() {
                return this.$store.getters.content_rect.height - 76 - (this.$store.getters.is_multisensor ? 33 : 0) + 'px';
            },
            show_ptz() {
                msg('ptz_state:' + this.$store.getters.preview.ptz_state);
                return this.$store.getters.preview.ptz_state;
            },
            show_head() {
                let flg =
                    'TRACK' == this.$store.getters.preview.dialog ||
                    'SETSCAN' == this.$store.getters.preview.dialog ||
                    'PRIVACYMASK' == this.$store.getters.preview.dialog;

                this.$store.commit('preview/ptz_state_changed', !flg);
                return flg;
            },
            show_detect() {
                let flag = 'FACEDETECT' == this.$store.getters.preview.dialog;
                this.$store.commit('preview/ptz_state_changed', !flag);
                return flag;
            },

            show_FullViewMode() {
                let flag = this.ViewMode[this.ViewMode_selected].FullView == 1 && this.InstallMode != 1;
                return flag;
            },
            ClientFaceStrategy() {
                return this.$store.getters.base.rtspplugin_params;
            },
            curmode() {
                return this.$store.getters.ptz.fisheye.curmode;
            },
            ability() {
                return this.$store.getters.ptz.fisheye.ability;
            },
            ptz_chan: {
                set(v) {
                    this.$store.commit('PTZ/property_changed', { cur_ch: parseInt(v) });
                },
                get() {
                    return this.$store.getters.ptz.cur_ch;
                },
            },
            ptz_chan_list() {
                let list = [];
                let val = this.curmode.ViewMode;
                if (!val) return list;
                let chan = 2;
                if (val.FullView) {
                    let t = 1;
                    while (t <= val.FullView) {
                        t++;
                        chan++;
                    }
                }
                if (val.PtzView) {
                    let t = 1;
                    while (t <= val.PtzView) {
                        list.push([chan - 1, 'ch0' + chan]);
                        t++;
                        chan++;
                    }
                    this.ptz_chan = list[0][0];
                }

                return list;
            },
        },
        watch: {
            ClientFaceStrategy: {
                handler(newVal, oldVal) {
                    this.$store.dispatch(`${this.plugin_type}_set_ClientFaceStrategy`, newVal);
                },
                deep: true,
            },
        },
        components: {
            CVPanelControl,
            CVPanelCruise,
            CVPanelPreset,
            CVPanelPtz,
            CVPanelShortcutBar,
        },
    };
</script>
