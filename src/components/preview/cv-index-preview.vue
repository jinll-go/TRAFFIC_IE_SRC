<template>
    <div class="w100">
        <FixedTop3ColumnAutoSizeLayout :top_height="top_height" :left_width="left_width" right_width="217">
            <template v-slot:header>
                <!-- 多通道 -->
                <div class="main_top bold f14" v-if="!$store.getters.is_multisensor">
                    <div class="main_top_01"  style=display:none>
                        <CVStreamSelect ref="select_streams"></CVStreamSelect>
                    </div>

                    <div class="main_top_02" v-if="ui_custom.framerate_avr.visible && plugin_type == 'ie'">
                        <label id="framerate_avr"
                            ><!--{{ framerate_avr
                            }}Bit Rate:3096 kbps | Frame Rate:25 fps--></label
                        >
                    </div>

                    <div class="main_top_03" v-show="ui_custom.device_name.visible">
                        Camera:<label>{{ device_name }}</label>
                    </div>
                    <!-- <div class="main_top_04" style="margin: 0 40px;color: red" v-if="$store.getters.factory_info.Status != 'Activated'">
                        <label v-tr="i18n_warnings"></label>
                    </div> -->
                </div>
            </template>
            <!-- 鱼眼通道 或者 多sensor-->
            <template v-slot:leftpanel>
                <CVLeftMenu z_id="preview_tree"></CVLeftMenu>
            </template>

            <template v-slot:centerpanel>
                <!-- 视频区域 -->
                <CVPlugin identity="preview" type="PREVIEW" class="full"></CVPlugin>
            </template>

            <template v-slot:rightpanel>
                <RightPanelFishEye v-if="is_fish"></RightPanelFishEye>
                <RightPanel ref="rightpanel" v-else></RightPanel>
            </template>
        </FixedTop3ColumnAutoSizeLayout>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapState } from 'vuex';
    import { is_boolean } from 'common/util';

    import FixedTop3ColumnAutoSizeLayout from '../../layout/fixedtop-3column-layout';
    import RightPanel from './cv-panel-right-normal';
    import RightPanelFishEye from './cv-panel-right-fisheye';

    import CVStreamSelect from 'components/preview/cv-panel-selectstream';

  //  import CVPlugin from 'components/activex/activex-wrapper.js';

    import CVLeftMenu from 'components/leftmenu/cv-left-menu';

    export default {
        name: 'CVFramePreview',
        data() {
            return {
                //    fisheyeinfo: { ability: {}, curmode: {}, ptz_chan_idx: 0, cruise_idx: 0 },
            };
        },

        computed: {
            device_name() {
                return this.$store.getters.DeviceInfo.DeviceName;
            },
            framerate_avr() {
                return this.$store.getters.framerate_avr;
            },
            activated() {
                return this.$store.getters.preview_activated;
            },
            show_left_tree() {
                if (this.is_normal) {
                    return false;
                } else {
                    if (this.is_temp_device) {
                        return false;
                    }
                    return true;
                }
            },
            is_fish() {
                return this.$store.getters.factory_info.IsOfFishEye == 'y';
            },
            is_normal() {
                return this.$store.getters.is_normal;
            },
            is_temp_device() {
                return this.$UI.CVTopMenu.tab_temperature.visible && this.$store.getters.is_multisensor;
            },
            /**
             * normal 左边不需要显示tree
             * fisheye 显示tree
             * multisensor 测温 h5 flash 不显示 ie显示
             *
             */
            left_width() {
                if (this.is_normal) {
                    return 0;
                } else {
                    if (this.is_temp_device && this.plugin_type != 'ie') {
                        return 0;
                    }
                    return 217;
                }
            },
            /*
            非普通ipc 就不要显示 码流选择框  帧率码率 那一行
            */
            top_height() {
                if (this.is_normal) {
                    return 33;
                } else {
                    return 0;
                }
            },
        },
        watch: {
            activated(newVal, oldVal) {
                let info = {};
                if (!newVal) {
                    //collect preview panel states, restore it when we go back
                    //H5 切换tab ,3d 手动跟踪 状态丢失
                    if (this.plugin_type == 'h5') {
                        this.$refs.rightpanel.pos3d = 0;
                        this.$refs.rightpanel.manualtrack = 0;
                    }
                } else {
                    if (is_boolean(oldVal)) info.streamidx = this.$refs.select_streams.streamidx;
                }
                this.$store.dispatch(`${this.plugin_type}_preview_tab_active_changed`, { info, status: newVal });
            },
        },
        components: {
            //        CVPlugin,
            CVStreamSelect,
            CVLeftMenu,
            FixedTop3ColumnAutoSizeLayout,
            RightPanel,
            RightPanelFishEye,
        },
    };
</script>
