<template>
    <!-- 点击设置轨迹的设置页面 -->

    <CVModalDialogHead v-if="show_head"></CVModalDialogHead>

    <!--  预览mount的页面-->
    <div class="main_fish xy_stretch" v-else>
        <div class="main_right_mid" v-show="ui_custom.ptz.visible && show_ptz">
            <CVPanelPtz v-show="ui_custom.ptz_panel.visible"></CVPanelPtz>
            <CVPanelControl v-show="ui_custom.ptz_control.visible" slideridentity="prev_slider"></CVPanelControl>
        </div>

        <CVVideoEffect v-if="$store.getters.plugin_type == 'ie'" v-show="ui_custom.video_effect.visible && show_ptz"></CVVideoEffect>

        <div class="main_right_mid xx1" v-show="ui_custom.preset_cruise_track.visible && show_ptz">
            <CVPanelPreset v-show="ui_custom.preset.visible"></CVPanelPreset>
            <CVPanelCruise v-show="ui_custom.cruise.visible"></CVPanelCruise>
            <CVPanelTrack v-show="ui_custom.track.visible"></CVPanelTrack>
        </div>

        <div class="main_right_mid xx1" v-show="ui_custom.ptz_extend.visible && show_ptz">
            <!--两点扫描-->
            <CVTwoPointScan v-show="ui_custom.two_point_scan.visible"></CVTwoPointScan>
            <!--空闲操作-->
            <CVIdleOperation v-show="ui_custom.idle_operation.visible"></CVIdleOperation>
            <!--红外补光-->
            <CVIRLightControl v-show="ui_custom.ir_light_ctrl.visible"></CVIRLightControl>
            <!--隐私遮蔽-->
            <CVPrivacyMask v-show="ui_custom.privacy_mask.visible" :disabled="manualtrack || pos3d"></CVPrivacyMask>
            <!--3D-->
            <CV3DPosition v-show="ui_custom['3d_position'].visible" :disabled="manualtrack" v-model="pos3d"></CV3DPosition>
            <!-- 雨刷-->
            <CVPanelWiper v-show="ui_custom.wiper.visible"></CVPanelWiper>
            <!-- 喷淋位置-->
            <CVSprayPos v-show="ui_custom.spraypos.visible"></CVSprayPos>
            <!-- 喷淋模式-->
            <CVSprayMode v-show="ui_custom.spraymode.visible"></CVSprayMode>
            <CVMannualTrack v-show="ui_custom.manualtrack.visible" :disabled="pos3d" v-model="manualtrack"></CVMannualTrack>
        </div>

        <div class="main_right_mid xx1" v-show="ui_custom.shortcutbar_smartchecks.visible && show_ptz">
            <CVPanelShortcutBar v-show="ui_custom.shortcutbar.visible"></CVPanelShortcutBar>

            <div class="w100" style="text-align: left" v-show="ui_custom.smart_rule.visible">
                <input type="checkbox" id="cb_show_smart_rule" v-model="ClientFaceStrategy.EnableRule" />&nbsp;
                <label id="lab_show_smart_rule" for="cb_show_smart_rule" v-tr="i18n_showSmartRule"><!--显示智能检测规则--></label>
            </div>

            <div class="w100" style="text-align: left" v-show="ui_custom.smart_result.visible">
                <input type="checkbox" id="cb_show_smart_result" v-model="ClientFaceStrategy.EnableResult" />&nbsp;
                <label id="lab_show_smart_result" for="cb_show_smart_result" v-tr="i18n_showSmartResult"><!--显示智能检测结果--></label>
            </div>

            <div class="w100" style="text-align: left" v-show="ui_custom.face_pics_save.visible && support_activex_npapi">
                <input type="checkbox" id="cb_face_pics_save" v-model="ClientFaceStrategy.Capture_face_pics_save" />&nbsp;
                <label for="cb_face_pics_save" v-tr="i18n_saveCaptureFacePics"><!--PC是否保存抓拍--></label>
            </div>

            <div class="w100" style="text-align: left" v-show="ui_custom.fullpic_save.visible && support_activex_npapi">
                <input type="checkbox" id="cb_face_fullpic_save" v-model="ClientFaceStrategy.Capture_face_fullpic_save" />&nbsp;
                <label for="cb_face_fullpic_save" v-tr="i18n_saveFullPic"><!--PC是否保存全景图--></label>
            </div>

            <div class="w100" style="text-align: left" v-show="ui_custom.draw_id_score.visible">
                <input type="checkbox" id="cb_draw_id_score" v-model="ClientFaceStrategy.Face_draw_id_score" />&nbsp;
                <label for="cb_draw_id_score" v-if="is_temperatureDevice" v-tr="i18n_drawTemp"><!--绘制温度--></label>
                <label for="cb_draw_id_score" v-else v-tr="i18n_drawIdScore"><!--绘制人脸框是否显示id score--></label>
            </div>

            <div class="w100 pt5" style="text-align: left" v-if="ui_custom.trigger_alarm.visible && $store.getters.AlarmOutPortNum > 0">
                <div style="float: left">
                    <img src="static/images/32a.gif" width="31" height="27" @click="trigger_alarm" />
                </div>
                <div>
                    <label v-tr="i18n_triggerAlarm"></label>&nbsp;&nbsp;
                    <select class="textc" style="width: 45px" v-model="alarmOutPort">
                        <option :value="1">1</option>
                        <option :value="2" v-if="$store.getters.AlarmOutPortNum > 1">2</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CVPanelPtz from 'components/preview/cv-panel-ptz';
    import CVPanelControl from 'components/preview/cv-panel-control';
    import CVVideoEffect from 'components/videoeffect/cv-panel-videoeffect-wrapper';
    import CVPanelPreset from 'components/preview/cv-panel-preset';
    import CVPanelCruise from 'components/preview/cv-panel-cruise';
    import CVPanelTrack from 'components/preview/cv-panel-track';

    import CVTwoPointScan from 'components/preview/cv-panel-twopointscan';
    import CVIdleOperation from 'components/preview/cv-panel-idleoperation';
    import CVIRLightControl from 'components/preview/cv-panel-irlightctrl';
    import CVPrivacyMask from 'components/preview/cv-panel-privacymask';
    import CV3DPosition from 'components/preview/cv-panel-3dposition';
    import CVPanelWiper from 'components/preview/cv-panel-wiper';
    import CVSprayPos from 'components/preview/cv-panel-spraypos';
    import CVSprayMode from 'components/preview/cv-panel-spraymode';
    import CVPanelShortcutBar from 'components/preview/cv-panel-shortcutbar';

    import CVModalDialogHead from 'components/preview/cv-modal-dialog-head';
    import CVMannualTrack from 'components/preview/cv-panel-manualtrack';
    export default {
        name: 'CVFramePreview',
        data() {
            return {

                ptz_chan: 1,
                is_fish: this.$store.getters.factory_info.IsOfFishEye == 'y',
                is_normal: this.$store.getters.is_normal,
                alarmOutPort: 1,
                is_NetHIK: this.$store.getters.factory_info.IsofDome == 'y_ex', //网络球机
                is_temperatureDevice: this.$UI.CVTopMenu.tab_temperature.visible,
                manualtrack: 0, //手动跟踪 status
                pos3d: 0, //3d定位 status
            };
        },
        mounted() {
            if (this.is_NetHIK) {
                //网络球机
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmPTZDomeGetAbility',
                        Type: 0,
                        Data: {},
                        // Data: {"MaxPersetNum":256,"MaxPatrolPathNum":8,"MaxPersetNumPrePatrolPath":8,"MaxPatternNum":4,"MaxScheduleNodePreDay":10,"ParkAndScheduleTimeMin":5,"ParkAndScheduleTimeMax":5},
                    })
                    .then((r) => {
                        if (r.Result == 0) {
                            this.$store.commit('preview/ptz_Ability_change', r.Data);
                        }
                    });
            }

            //let obj = this.$store.getters.current_language;
            //let zObjNodes = [];

            this.$nextTick(() => {
                this.min_height = $('#td_div_right').outerHeight() + 'px';
            });
        },
        methods: {
            //触发 报警输出

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
                return this.$store.getters.content_rect.height - 76 - (!this.$store.getters.is_multisensor ? 33 : 0) + 'px';
                //msg(['=======',this.$el.style.height,plugin.style.height]);
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
                msg('show_head: ', flg);
                this.$store.commit('preview/ptz_state_changed', !flg);
                return flg;
            },
            show_detect() {
                let flag = 'FACEDETECT' == this.$store.getters.preview.dialog;
                this.$store.commit('preview/ptz_state_changed', !flag);
                return flag;
            },
            ptz_chan_change: {
                get: function() {
                    return this.ptz_chan;
                },
                set: function(v) {
                    //msg(["ptz_chan_change set",v]);
                    this.ptz_chan = v;
                    this.$store.commit('PTZ/cur_ch_changed', v);
                },
            },
            support_activex_npapi() {
                return this.plugin_type == 'ie';
            },
            ClientFaceStrategy() {
                return this.$store.getters.base.rtspplugin_params;
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
            CVPanelPtz,
            CVPanelControl,
            CVVideoEffect,
            CVPanelPreset,
            CVPanelCruise,
            CVPanelTrack,
            CVTwoPointScan,
            CVIdleOperation,
            CVIRLightControl,
            CVPrivacyMask,
            CV3DPosition,
            CVPanelWiper,
            CVSprayPos,
            CVSprayMode,
            CVPanelShortcutBar,

            CVModalDialogHead,
            CVMannualTrack,
        },
    };
</script>
