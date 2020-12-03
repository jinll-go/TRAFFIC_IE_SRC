<template>
    <div class="main_index_center">
        <FixedTop3ColumnAutoSizeLayout top_height="76" left_width="0" right_width="0">
            <template v-slot:header>
                <CVTopMenu ref="top" v-show="ui_custom.topmenu.visible"> </CVTopMenu>
            </template>
            <template v-slot:centerpanel>
                <div :ref="item.name" :style="{ height: '100%' }" v-for="item in frames" :key="item.name" :is="item.component_name" v-show="frame == item.component_name"></div>
            </template>
        </FixedTop3ColumnAutoSizeLayout>

        <CVModalDialogCruise v-if="show_cruise"></CVModalDialogCruise>
        <CVModalDialogIdle v-if="show_idleOperation"></CVModalDialogIdle>

        <div id="config_plugin_wrapper" style="position:absolute;width:1px;height:1px;top:-1px;left:-1px;border:1px solid gray;overflow: hidden">
            <CVPlugin identity="config" type="CONFIGPARAMETER" class="full"></CVPlugin>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import FixedTop3ColumnAutoSizeLayout from '../layout/fixedtop-3column-layout';
    import CVModalDialogIdle from 'components/preview/cv-modal-dialog-idleoperation';

    import CVModalDialogCruise from 'components/preview/cv-modal-dialog-cruise';
    import CVFrameAlarm from 'components/preview/cv-modal-dialog-alarm';

    import CVTopMenu from 'components/cv-index-topmenu';
    import CVFramePreview from 'components/preview/cv-index-preview';
    const CVFramePBSlider = () => import(/* webpackChunkName: "playback" */ 'components/playback/cv-index-frame-slider');

    import CVFrameConfig from 'components/config/cv-index-config';
    import CVFrameLog from 'components/log/cv-index-log';
    const CVFrameFace = () => import(/* webpackChunkName: "facecomp" */ 'components/face/cv-index-face');
    //liuxin add 人脸分组管理
    const CVFrameFaceManage = () => import('components/face/cv-index-face-manage');
    //liuxin add 人脸分组管理
    import CVFrameCustom from 'components/custom/cv-index-custom';
    const CVFramePerson = () => import(/* webpackChunkName: "person" */ 'components/person/cv-index-person');

    const CVFrameTemperature = () => import(/* webpackChunkName: "temperature" */ 'components/temperature/cv-index-temperature');
    import CVFrameFile from 'components/file/cv-index-file-wrapper.js';

    export default {
        name: 'CVIndex',

        data() {
            return {
                top: '',
                frames: [
                    //{ name: 'preview', component_name: '' },
                    //{ name: 'playback', component_name: '' }, //CVFramePBSlider
                    //{ name: 'file', component_name: '' }, //CVFrameFile
                    { name: 'face', component_name: '' },
                    { name: 'facemanage', component_name: 'CVFrameFaceManage' },
                    { name: 'config', component_name: 'CVFrameConfig' }, //CVFrameConfig
                    { name: 'log', component_name: 'CVFrameLog' },
                    //{ name: 'alarm', component_name: 'CVFrameAlarm' },
                    { name: 'person', component_name: '' },
                    { name: 'custom', component_name: '' },
                    { name: 'temperature', component_name: '' },
                ],
            };
        },
        created() {


            this.$store.dispatch('frame_change', 'facedb');

            //首次登录 预览界面显示设备名称
            this.$store.dispatch('request', { url: 'goform/frmDevicePara', Type: 0, Data: {} }).then((r) => {
                if (r && r.Result == 0) {
                    this.$store.commit('deviceinfo/property_changed', { DeviceName: r.Data.DVRName });
                }
            });

            this.$store.commit('preview/is_horizon_changed', this.$UI['CVConfigMenu'].CVConfigFaceDetectHR.visible);
        },
        computed: {
            frame() {
                return this.$store.getters.current_frame;
            },
            height() {
                return this.$store.getters.content_rect.height - 76 + 'px';
            },
            show_cruise() {
                var flg = 'CRUISE' == this.$store.getters.preview.dialog;;
                return flg;
            },

            show_idleOperation() {
                var flg = 'IDLEOPERATION' == this.$store.getters.preview.dialog;
                return flg;
            },
        },
        watch: {
            frame(newVal, oldVal) {
                var prefixs = [newVal.substr(7).toLowerCase(), oldVal.substr(7).toLowerCase()];

                let identy = '';
                if (newVal == 'CVFramePBSlider') {
                    identy = 'playback';
                } else if (newVal == 'CVFrameFile') {
                    identy = 'file';
                } else if (newVal == 'CVFrameConfig') {
                    identy = 'config';
                } else if (newVal == 'CVFrameFace') {
                    identy = 'face';
                }else if (newVal == 'CVFrameFaceManage') {
                    identy = 'facemanage'; 
                }else if (newVal == 'CVFramePerson') {
                    identy = 'person';
                } else if (newVal == 'CVFrameCustom') {
                    identy = 'custom';
                } else if (newVal == 'CVFrameAlarm') {
                    identy = 'alarm';
                } else if (newVal == 'CVFrameLog') {
                    identy = 'log';
                } else if (newVal == 'CVFramePreview') {
                    identy = 'preview';
                } else if (newVal == 'CVFrameTemperature') {
                    identy = 'temperature';
                }
                msg("---liuxin add  test identy "+ identy);
                if (identy.length) {
                    for (var i = 0; i < this.frames.length; ++i) {
                        if (this.frames[i].name == identy) break;
                    }
                    if (this.frames[i].component_name.length == 0) {
                        msg("---liuxin add  test newVal "+ newVal);
                        Vue.set(this.frames[i], 'component_name', newVal);
                        msg("---liuxin add  test nextTick 0 "+ prefixs[0]);
                        msg("---liuxin add  test nextTick 1  "+ prefixs[1]);
                        Vue.nextTick(() => {
                            if (prefixs[1].length) this.$store.commit(prefixs[1] + '/activated', false);
                            this.$store.commit(prefixs[0] + '/activated', true);
                        });
                    } else {
                        msg("---liuxin add  test 22  nextTick 0"+ prefixs[0]);
                        msg("---liuxin add  test 22  nextTick 1"+ prefixs[1]);
                        this.$store.commit(prefixs[1] + '/activated', false);
                        Vue.nextTick(() => {
                            this.$store.commit(prefixs[0] + '/activated', true);
                        });
                    }
                }
            },
        },
        components: {
            CVTopMenu,
            CVFramePreview,
            CVFramePBSlider,
            CVFrameFile,
            CVFrameConfig,
            CVFrameLog,
            CVFrameFace,
            //liuxin add 人脸分组管理
            CVFrameFaceManage,
            //liuxin add 人脸分组管理
            CVFramePerson,
            CVFrameCustom,
            CVFrameAlarm,
            //CVModalDialogBackup,
            CVModalDialogCruise,
            //CVModalDialogHead,
            CVModalDialogIdle,
            //    CVPlugin,

            FixedTop3ColumnAutoSizeLayout,
            CVFrameTemperature,
        },
    };
</script>
