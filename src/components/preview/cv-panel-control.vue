<template>
    <div class="main_right_mid_right">
        <!-- <div v-if="$store.getters.is_tyconew">
            <table style="width: 140px;margin-left: 20px">
                <tr>
                    <td
                        class="td_plus trans0"
                        :title="lang.i18n_plus"
                        v-for="(item, idx) of control_list"
                        @mousedown.prevent="minus_plus('down', item.cmd_plus, 0)"
                        @mouseup="minus_plus('up', item.cmd_plus, 1)"
                        v-show="item.show"
                        @mouseover="mouse_over"
                        @mouseout="mouse_out"
                    ></td>
                </tr>
                <tr>
                    <td
                        v-for="(item, idx) of control_list"
                        :class="[item.text + ' trans0']"
                        v-show="item.show"
                        :title="name_view(item.text)"
                        @mouseover="mouse_over"
                        @mouseout="mouse_out"
                    ></td>
                </tr>
                <tr>
                    <td
                        class="td_minus trans0"
                        :title="lang.i18n_minus"
                        v-for="(item, idx) of control_list"
                        @mousedown.prevent="minus_plus('down', item.cmd_minus, 0)"
                        @mouseup="minus_plus('up', item.cmd_minus, 1)"
                        v-show="item.show"
                        @mouseover="mouse_over"
                        @mouseout="mouse_out"
                    ></td>
                </tr>
            </table>
        </div>-->
        <div :class="[$store.getters.is_tyconew ? 'table_like' : '', 'w100']" v-for="(item, idx) of control_list" v-show="item.show">
            <div :class="[$store.getters.is_tyconew ? 'td_like' : 'fl']">
                <a
                    @mousedown.prevent="minus_plus('down', item.cmd_minus, 0)"
                    @mouseup="minus_plus('up', item.cmd_minus, 1)"
                    @mouseleave="minus_plus('up', item.cmd_minus, 1, $event)"
                >
                    <img :src="minus_url" name="Image1" width="26" height="27" border="0" id="Image1" :title="lang.i18n_minus" />
                </a>
            </div>
            <div name="ptz" :class="[$store.getters.is_tyconew ? 'td_like' : '', 'r_1']"><label v-tr="item.text"></label></div>
            <div :class="[$store.getters.is_tyconew ? 'td_like' : 'fl']">
                <a
                    @mousedown.prevent="minus_plus('down', item.cmd_plus, 0)"
                    @mouseup="minus_plus('up', item.cmd_plus, 1)"
                    @mouseleave="minus_plus('up', item.cmd_plus, 1, $event)"
                >
                    <img :src="plus_url" name="Image2" width="26" height="27" border="0" id="Image2" :title="lang.i18n_plus" />
                </a>
            </div>
        </div>

        <div :class="[$store.getters.is_tyconew ? 'pl50' : '', 'td_like pt10']" name="disSection">
            <CVSlider :ref="slideridentity" :name="slideridentity" :min="1" :max="10" :value="5" :step="1" :width="124"></CVSlider>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import CVSlider from 'components/slider/slider.vue';

    export default {
        name: 'CVPanelControl',
        props: {
            mode: {
                type: String,
                default: '',
            },
            show_speed_slider: {
                type: Boolean,
                default: true,
            },
            show_zoom: {
                type: Boolean,
                default: true,
            },
            show_focus: {
                type: Boolean,
                default: true,
            },
            show_iris: {
                type: Boolean,
                default: true,
            },
            slideridentity: {
                type: String,
                default: 'speed_slider',
            },
        },
        data() {
            return {
                control_list: [],
            };
        },
        mounted() {
            this.$store.commit('preview/speed_changed', 5);
            this.$refs[this.slideridentity].$on('input', (val) => {
                this.$store.commit('preview/speed_changed', val);
            });

            this.state = 0;
            if (this.mode == '') {
                this.control_list = [
                    {
                        text: 'i18n_zoom',
                        cmd_minus: 12,
                        cmd_plus: 11,
                        show: this.show_zoom,
                    },
                    {
                        text: 'i18n_focus',
                        cmd_minus: 14,
                        cmd_plus: 13,
                        show: this.show_focus,
                    },
                    {
                        text: 'i18n_iris',
                        cmd_minus: 16,
                        cmd_plus: 15,
                        show: this.show_iris,
                    },
                ];
            } else if (this.mode == 'TRACK' || this.mode == 'SETSCAN') {
                this.control_list = [
                    {
                        text: 'i18n_zoom',
                        cmd_minus: 12,
                        cmd_plus: 11,
                        show: true,
                    },
                ];
            } else if (this.mode == 'PRIVACYMASK') {
                if (this.$store.getters.factory_info.IsofDome == 'y_ex') {
                    this.control_list = [
                        {
                            text: 'i18n_zoom',
                            cmd_minus: 12,
                            cmd_plus: 11,
                            show: true,
                        },
                    ];
                } else {
                    this.control_list = [
                        {
                            text: 'i18n_width',
                            cmd_minus: 12,
                            cmd_plus: 11,
                            show: true,
                        },
                        {
                            text: 'i18n_height',
                            cmd_minus: 14,
                            cmd_plus: 13,
                            show: true,
                        },
                    ];
                }
            }
        },
        computed: {
            minus_url() {
                return this.$store.getters.is_tyconew ? 'static/images/minus_a.png' : 'static/images/minus.png';
            },
            plus_url() {
                return this.$store.getters.is_tyconew ? 'static/images/plus_a.png' : 'static/images/plus.png';
            },
            speed() {
                return this.$store.getters.preview.speed;
            },
        },
        methods: {
            /**
             * bug to fix:
             * mousedown.prevent 之后 不松,移动到 按钮图片之外的区域,松开.mousedown.prevent不会触发!!!
             * 导致停止命令没有发
             */
            async minus_plus(idx, Cmd, IsStop, e) {
                let Speed = this.$store.getters.preview.speed;
                let state = this.state; //0 need down   1 need up

                if (IsStop == 1) {
                    if (e && e.buttons == 0) {
                        return;
                    }
                }

                if (this.$store.getters.factory_info.IsOfFishEye == 'y') {
                    if (IsStop == 0) {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmFisheyeChanMove',
                            Type: 1,
                            Data: {
                                ChanNum: this.$store.getters.ptz.cur_ch,
                                Operation: 'ContinousMove',
                                ZoomRate: Cmd == 11 ? 1 : -1,
                                ZoomSpeed: Speed / 10,
                            },
                        });
                    } else if (IsStop == 1) {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmFisheyeChanMove',
                            Type: 1,
                            Data: {
                                ChanNum: this.$store.getters.ptz.cur_ch,
                                Operation: 'ContinousMove',
                                ZoomRate: 0,
                                ZoomSpeed: Speed / 10,
                            },
                        });
                    }
                } else {
                    //网络球机 变倍速度 打开时
                    if ((Cmd == 11 || Cmd == 12) && this.$UI.CVConfigVideoPara.ZoomSpeed.visible) {
                        msg('!!!!!!', this.$store.getters.localsettings.ZoomSpeed);
                        Speed = this.$store.getters.localsettings.ZoomSpeed || 5;
                    }
                    if (state == 0 && IsStop == 0) {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmPTZControl',
                            Type: 1,
                            Data: { Cmd, IsStop, Speed },
                            async: false,
                        });
                        this.state = 1;
                    } else if (state == 1 && IsStop == 1) {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmPTZControl',
                            Type: 1,
                            Data: { Cmd, IsStop, Speed },
                            async: false,
                        });
                        this.state = 0;
                    }
                }
            },
            mouse_over(e) {
                let classname = e.target.className;
                let arr = classname.split(' ');
                arr[0] += '_on';
                e.target.className = arr.join(' ');
            },
            mouse_out(e) {
                let classname = e.target.className;
                let arr = classname.split(' ');
                arr[0] = arr[0].substring(0, arr[0].length - 3);
                e.target.className = arr.join(' ');
            },
            name_view(value) {
                switch (value) {
                    case 'i18n_zoom':
                        return this.lang.i18n_zoom;
                    case 'i18n_focus':
                        return this.lang.i18n_focus;
                    case 'i18n_iris':
                        return this.lang.i18n_iris;
                }
            },
        },
        watch: {
            speed(n, o) {
                if (n !== o) {
                    this.$refs[this.slideridentity].setValue(n);
                }
            },
        },
        components: {
            CVSlider,
        },
    };
</script>
