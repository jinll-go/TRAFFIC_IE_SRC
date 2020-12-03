<template>
    <div class="main_con_k clearfix" style="margin-top:100px;">
        <!-- 测温设置 -->
        <div class="main_con_top_k">
            <div class="fl pl10 bold"><label v-tr="i18n_ThermometrySetting"></label></div>
        </div>

        <div class="main_con_mid_k">
            <table width="100%" border="0" cellpadding="2" cellspacing="1">
                <tr>
                    <td style="width: 60%">
                        <!-- 基本配置 -->
                        <div class="td_bg pl10">
                            <label v-tr="i18n_BaseConfig"></label>
                        </div>

                        <div class="w100 pt5" v-show="false">
                            <div class="fl text_right" style="width:34%"><label v-tr="i18n_thermoDetectEnable"></label></div>
                            <div class="fl" style="width:66%">&nbsp;&nbsp;<input type="checkbox" v-model="d.Enable" /></div>
                        </div>

                        <!-- 安装距离 -->
                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:34%"><label v-tr="i18n_TargetDistance"></label>:&nbsp;</div>
                            <div class="fl" style="width:66%">
                                <input
                                    type="text"
                                    class="textc"
                                    style="width:180px;"
                                    v-model="d.InstallDistance"
                                    :disabled="!d.Enable"
                                    v-validator:NOVOID:Float="[0, 10.0]"
                                />
                                <label v-tr="i18n_meter"></label>&nbsp;(0~10.0)
                            </div>
                        </div>

                        <!-- 温度单位 -->
                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:34%"><label v-tr="i18n_TempUnit"></label>:&nbsp;</div>
                            <div class="fl" style="width:66%">
                                <select class="textc" style="width:180px;" v-model="d.TemperatureUnit" :disabled="!d.Enable">
                                    <option v-for="(item, index) in TempUnit_list" :value="index">{{ item }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- 温度补偿模式 -->
                        <div class="w100 pt5" v-show="ui_custom.CompensateMode.visible">
                            <div class="fl text_right" style="width:34%"><label v-tr="i18n_CompensateMode"></label>:&nbsp;</div>
                            <div class="fl" style="width:66%">
                                <input type="radio" :value="0" v-model="d.CompensateMode" id="radio_manual" :disabled="!d.Enable" />
                                <label for="radio_manual" v-tr="i18n_Manual"></label>&nbsp;
                                <input type="radio" :value="1" v-model="d.CompensateMode" id="radio_auto" :disabled="!d.Enable" />
                                <label for="radio_auto" v-tr="i18n_auto"></label>
                            </div>
                        </div>

                        <!-- 温度补偿值 -->
                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:34%"><label v-tr="i18n_TempCompensate"></label>:&nbsp;</div>
                            <div class="fl" style="width:66%">
                                <input
                                    type="text"
                                    class="textc"
                                    style="width:180px;"
                                    v-model="delta_tempcompensate_val"
                                    :max="TempCompensate_list[d.TemperatureUnit]"
                                    :min="-1 * TempCompensate_list[d.TemperatureUnit]"
                                    :disabled="!(d.Enable && d.CompensateMode == 0)"
                                    v-validator:NOVOID:Float.max.min
                                />
                                <!--
                                <input
                                    type="text"
                                    class="textc"
                                    style="width:180px;"
                                    v-model="TempCompensateF"
                                    id="mode_1"
                                    :disabled="!(d.Enable && d.CompensateMode == 0)"
                                    v-show="d.TemperatureUnit"
                                    v-validator:NOVOID:Float="[-50.0, 50.0]"
                                />
                               <input
                                    type="text"
                                    class="textc"
                                    style="width:180px;"
                                    v-model="TempCompensateC"
                                    id="mode_2"
                                    :disabled="!(d.Enable && d.CompensateMode == 0)"
                                    v-show="!d.TemperatureUnit"
                                    v-validator:NOVOID:Float="[-10.0, 10.0]"
                                /> -->
                                <label>{{ TempUnit_list[d.TemperatureUnit] }}</label
                                >&nbsp;
                                <label>(-{{ TempCompensate_list[d.TemperatureUnit] }}~{{ TempCompensate_list[d.TemperatureUnit] }})</label>
                            </div>
                        </div>

                        <!-- 图像模式 -->
                        <div class="w100 pt5" v-show="ui_custom.ImageType.visible">
                            <div class="fl text_right" style="width:34%"><label v-tr="i18n_ImageMode"></label>:&nbsp;</div>
                            <div class="fl" style="width:66%">
                                <select class="textc" style="width:180px;" v-model="d.ImageType" :disabled="!d.Enable">
                                    <option :value="0" v-tr="i18n_whiteLight"></option>
                                    <option :value="1" v-tr="i18n_blackLight"></option>
                                    <option :value="2" v-tr="i18n_pseudoColor"></option>
                                </select>
                            </div>
                        </div>
                        <!-- 黑体校正 -->
                        <div class="w100 pt5" v-show="ui_custom.TemperatureCorrection.visible">
                            <div class="td_bg pl10">
                                <!--v-if="this.$store.getters.main_frame == 'CVConfigIndexBodyTemperature' "-->
                                <label v-tr="i18n_BlackbodyCorrection"></label>
                                <!--<label v-tr="i18n_TemperatureCorrection" v-else></label>-->
                            </div>

                            <!-- 发射率 -->
                            <div class="w100 pt5">
                                <div class="fl text_right" style="width:34%"><label v-tr="i18n_Emissivity"></label>:&nbsp;</div>
                                <div class="fl" style="width:66%">
                                    <input type="text" class="textc" style="width:180px;" v-model="d.EmissionRate" :disabled="!d.Enable" />
                                </div>
                            </div>

                            <!-- 黑体距离 -->
                            <div class="w100 pt5">
                                <div class="fl text_right" style="width:34%"><label v-tr="i18n_blackbody_distance"></label>:&nbsp;</div>
                                <div class="fl" style="width:66%">
                                    <input
                                        type="text"
                                        class="textc"
                                        style="width:180px;"
                                        v-model="d.TargetDistance"
                                        :disabled="!d.Enable"
                                        v-validator:NOVOID:Float="[0, 10.0]"
                                    />
                                    <label v-tr="i18n_meter"></label>&nbsp;(0~10.0)
                                </div>
                            </div>

                            <!-- 黑体温度 -->
                            <div class="w100 pt5">
                                <div class="fl text_right" style="width:34%"><label v-tr="i18n_blackbody_temperature"></label>:&nbsp;</div>
                                <div class="fl" style="width:66%">
                                    <input type="text" class="textc" style="width:180px;" v-model="delta_temp_val" :disabled="!d.Enable" /><label>{{
                                        TempUnit_list[d.TemperatureUnit]
                                    }}</label>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="width: 40%" valign="top">
                        <table width="98%" border="0" cellspacing="0" cellpadding="0" id="tab2">
                            <tr>
                                <td align="left" valign="middle" id="plugin" colspan="3" class="config_plugin_rect"></td>
                            </tr>
                            <tr>
                                <td class="text_right">
                                    <button :class="button_style" v-tr="i18n_allClear" :disabled="!d.Enable" @click="btnclear()"></button>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <div class="w100 pt10 text_center" style="position:relative">
                <button :class="button_style" v-tr="i18n_save" @click="save()">{{}}</button>
            </div>
        </div>

        <div class="main_con_bot_k"></div>
    </div>
</template>

<script>
    import NP from 'number-precision';

    import { is_null_or_undefined } from 'common/util';
    import repos_plugin from 'mixin/repos_plugin';
    import style from 'mixin/style';
    export default {
        name: 'CVConfigThermometrySet',
        mixins: [style, repos_plugin],
        data() {
            return {
                TempUnit_list: ['°C', '°F'],
                TempCompensate_list: ['10.0', '18.0'],
                d: {
                    Enable: null,
                    InstallDistance: null,
                    TemperatureUnit: null,
                    CompensateMode: null,
                    TempCompensate: null,
                    EmissionRate: null,
                    TargetDistance: null,
                    TargetTemp: null,
                    ImageType: null,
                },
                delta_temp_val: null, //黑体温度
                delta_tempcompensate_val: null, //温度补偿值
            };
        },
        mounted() {
            this.$store
                .dispatch('request', {
                    url: 'goform/frmVideoTemperatureCfg',
                    Type: 0,
                    Dev: 1,
                    Ch: 1,
                    Data: {},
                })
                .then((r) => {
                    if (r.Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (r.Result == 0) {
                            this.load(r.Data);
                            this.$notify.success(this.lang['i18n_getok']);
                        } else {
                            this.$notify.error(this.lang['i18n_getfailed']);
                        }
                    }
                });
        },
        methods: {
            backup_plugindraw() {
                if (this.config_plugin) {
                    if (this.plugin_type == 'ie') {
                        let data = this.config_plugin.ConfigDrawData;
                        [this.d.TargetX, this.d.TargetY] = [data.testpoint.x, data.testpoint.y];
                    } else if (this.plugin_type == 'h5') {
                        let data = this.canvas_t.testpoint;
                        msg('111', data);
                        this.d.TargetX = parseInt(data.x);
                        this.d.TargetY = parseInt(data.y);
                    }
                }
            },
            load(cont) {
                if (cont) {
                    this.d = cont;
                }

                if (this.config_plugin) {
                    this.$store.dispatch(`${this.plugin_type}_config_plugin_init`, { mode: 11, dev: 2 });

                    if (this.plugin_type == 'ie') {
                        this.config_plugin.ConfigDrawData = {
                            enable: true,
                            testpoint: {
                                x: this.d.TargetX,
                                y: this.d.TargetY,
                            },
                        };
                    } else if (this.plugin_type == 'h5') {
                        this.canvas_t = new CVCanvasDraw.Config_Temperature_BlackBodyPosition(
                            $('#plugin').width(),
                            $('#plugin').height(),
                            this.config_plugin.mask_canvas
                        );
                        this.canvas_t.bgColor = 'rgba(0,0,0,0)';
                        this.canvas_t.Init();

                        this.canvas_t.testpoint = {
                            x: this.d.TargetX,
                            y: this.d.TargetY,
                        };
                    }
                }

                //this.TempCompensateC = this.TempCompensateF = this.d.TempCompensate;
                if (!this.ui_custom.CompensateMode.visible) {
                    this.d.CompensateMode = 0;
                }
            },
            btnclear() {
                if (this.config_plugin) {
                    if (this.plugin_type == 'ie') {
                        this.config_plugin.ConfigDrawData = {
                            enable: true,
                            testpoint: {
                                x: -1,
                                y: -1,
                            },
                        };
                    } else if (this.plugin_type == 'h5') {
                        this.canvas_t.testpoint = {
                            x: -1,
                            y: -1,
                        };
                    }
                }
            },
            save() {
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
                    return;
                }

                this.d.Enable = this.d.Enable ? 1 : 0;
                this.d.InstallDistance = parseFloat(this.d.InstallDistance);
                this.d.TempCompensate = parseFloat(this.d.TempCompensate);
                this.d.EmissionRate = parseFloat(this.d.EmissionRate);
                this.d.TargetDistance = parseFloat(this.d.TargetDistance);
                this.d.TargetTemp = parseFloat(this.d.TargetTemp);
                this.d.ImageType = parseInt(this.d.ImageType, 10);
                this.backup_plugindraw();

                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoTemperatureCfg',
                        Type: 1,
                        Data: this.d,
                        Dev: 1,
                        Ch: 1,
                    })
                    .then((r) => {
                        if (r.Result == 0) {
                            this.$notify.success(this.lang['i18n_saveok']);
                        } else if (r.Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else {
                            this.$notify.error(this.lang['i18n_savefailed']);
                        }
                    });
            },
        },
        computed: {
            config_plugin() {
                return this.$store.getters.config_plugin;
            },
        },
        watch: {
            ['d.TemperatureUnit']: {
                handler(n) {
                    if (n == 0) {
                        //黑体温度
                        //save old

                        if (!is_null_or_undefined(this.delta_temp_val)) {
                            this.d.TargetTemp = ((parseFloat(this.delta_temp_val) - 32) * 5) / 9;
                        }
                        //set new

                        this.delta_temp_val = NP.round(this.d.TargetTemp, 1);

                        //温度补偿值
                        //save old

                        if (!is_null_or_undefined(this.delta_tempcompensate_val)) {
                            msg(this.d.TempCompensate);
                            this.d.TempCompensate = parseFloat(this.delta_tempcompensate_val) / 1.8;
                        }
                        //set new

                        this.delta_tempcompensate_val = NP.round(this.d.TempCompensate, 1);
                    } else if (n == 1) {
                        //save old

                        if (!is_null_or_undefined(this.delta_temp_val)) {
                            this.d.TargetTemp = this.delta_temp_val;
                        }
                        //set new

                        this.delta_temp_val = NP.round(this.d.TargetTemp * 1.8 + 32, 1);

                        //温度补偿值
                        //save old

                        if (!is_null_or_undefined(this.delta_tempcompensate_val)) {
                            msg(this.d.TempCompensate);
                            this.d.TempCompensate = this.delta_tempcompensate_val;
                        }
                        //set new

                        this.delta_tempcompensate_val = NP.round(this.d.TempCompensate * 1.8, 1);
                    }
                },
                deep: true,
            },
            delta_temp_val(n) {
                if (this.d.TemperatureUnit == 1) {
                    //黑体温度
                    //save old

                    if (!is_null_or_undefined(n)) {
                        this.d.TargetTemp = ((parseFloat(n) - 32) * 5) / 9;
                    }
                    //set new
                } else if (this.d.TemperatureUnit == 0) {
                    //save old

                    if (!is_null_or_undefined(n)) {
                        this.d.TargetTemp = n;
                    }
                    //set new
                }
            },
            delta_tempcompensate_val(n) {
                if (this.d.TemperatureUnit == 1) {
                    //温度补偿值
                    //save old

                    if (!is_null_or_undefined(n)) {
                        this.d.TempCompensate = parseFloat(n) / 1.8;
                    }
                    //set new
                } else if (this.d.TemperatureUnit == 0) {
                    //温度补偿值
                    //save old

                    if (!is_null_or_undefined(n)) {
                        this.d.TempCompensate = n;
                    }
                    //set new
                }
            },
        },
    };
</script>
