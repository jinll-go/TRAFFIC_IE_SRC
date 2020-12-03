<template>
    <div class="main_con clearfix">
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_exposureControl">人脸曝光策略</label>
            </div>
        </div>

        <div class="main_con_mid">
            <div class="w100 pt1">
                <table width="100%" border="0" cellpadding="2" cellspacing="1">
                    <tr>
                        <td>
                            <label class="head_lb_text_w" v-tr="i18n_enableVideoShelter">启用 </label>:
                            <input type="checkbox" v-model="d.EnableFaceExposure" />&nbsp;&nbsp;
                        </td>
                    </tr>
                    <tr>
                        <td valign="top" class="td_bg">&nbsp;&nbsp;<label v-tr="i18n_auto_face_exposure">自动人脸曝光</label></td>
                    </tr>

                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width:100% ;padding:5px">
                                <tr>
                                    <td valign="top" align="right" height="30px" width="30%">
                                        <label v-tr="i18n_FaceExposureBrightness">参考亮度 </label>:&nbsp;
                                    </td>
                                    <td valign="top" height="30px" align="left">
                                        <input
                                            type="text"
                                            class="textc"
                                            style="width: 150px"
                                            v-model="d.FaceExposureBrightness"
                                            :disabled="!d.EnableFaceExposure"
                                            v-validator:NOVOID:Number="[0, 100]"
                                        />(0~100)
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td valign="top" class="td_bg">&nbsp;&nbsp;<label v-tr="i18n_Manual_exposure_ctrl">手动曝光控制</label></td>
                    </tr>

                    <tr>
                        <td>
                            <table cellpadding="0" cellspacing="0" style="width:100% ;padding:10px">
                                <!-- 背光模式 -->
                                <tr>
                                    <td valign="top" align="right" height="30px"><label v-tr="i18n_backlightmode"></label>:&nbsp;</td>
                                    <td valign="top" height="30px" align="left">
                                        <select class="textc" style="width: 150px;" v-model="d1.LightCorrectMode" :disabled="d.EnableFaceExposure">
                                            <option :value="0" v-tr="i18n_close"></option>
                                            <option :value="1" v-tr="i18n_hlcmode"></option>
                                            <option :value="2" v-tr="i18n_blcmode"></option>
                                        </select>
                                    </td>
                                </tr>

                                <!-- 背光等级 -->
                                <tr>
                                    <td valign="top" align="right" height="30px"><label v-tr="i18n_backlightlevel"></label>:&nbsp;</td>
                                    <td valign="top" height="30px" align="left">
                                        <select class="textc" style="width: 150px;" v-model="d1.LightCorrectLevel" :disabled="d.EnableFaceExposure">
                                            <option v-for="n in 10" :value="n">{{ n }}</option>
                                        </select>
                                    </td>
                                </tr>

                                <!-- 目标亮度 -->
                                <tr>
                                    <td valign="top" align="right" height="30px"><label v-tr="i18n_targetbrightness"></label>:&nbsp;</td>
                                    <td valign="top" height="30px" align="left">
                                        <input
                                            type="text"
                                            class="textc"
                                            style="width: 150px"
                                            v-model="d1.AECompensation.Level"
                                            v-validator:NOVOID:Number="[1, 100]"
                                            :disabled="d.EnableFaceExposure"
                                        />(1-100)
                                    </td>
                                </tr>

                                <!-- 曝光分配策略 -->
                                <tr>
                                    <td height="30px" align="right" valign="top"><label v-tr="i18n_AeRoute"></label>:&nbsp;</td>
                                    <td valign="top" align="left" height="30px">
                                        <select class="textc" style="width:150px;" v-model="d1.AeRouteMode" :disabled="d.EnableFaceExposure">
                                            <option :value="0" v-tr="i18n_ShutterFirst"></option>
                                            <option :value="1" v-tr="i18n_IncreFirst"></option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="30px" align="right" valign="top">
                                        <!--增益控制-->
                                        <label v-tr="i18n_incre"></label>:&nbsp;
                                    </td>
                                    <td valign="top" align="left" height="30px">
                                        <select
                                            name="autoincre"
                                            id="autoincre"
                                            class="textc"
                                            style="width:150px;"
                                            v-model="d1.GainMode"
                                            :disabled="d.EnableFaceExposure"
                                        >
                                            <option :value="0" v-tr="i18n_low"></option>
                                            <option :value="1" v-tr="i18n_lesslow"></option>
                                            <option :value="2" v-tr="i18n_middle"></option>
                                            <option :value="3" v-tr="i18n_lessHigh"></option>
                                            <option :value="4" v-tr="i18n_high"></option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="30px" align="right" valign="top">
                                        <!--快门-->
                                        <label v-tr="i18n_shutter"></label>:&nbsp;
                                    </td>
                                    <td valign="top" align="left" height="30px">
                                        <select
                                            name="Shutter"
                                            id="Shutter"
                                            class="textc"
                                            style="width:150px;"
                                            v-model="d1.ShutterMode"
                                            :disabled="d.EnableFaceExposure"
                                        >
                                            <option v-for="item in shutterlist" :value="item[0]">{{ item[1] }}</option>
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="w100 pt10 text_center" style="position:relative">
                <button :class="button_style" style="width:88px;" v-tr="i18n_save" @click="saveExpo()"></button>
            </div>
        </div>
        <div class="main_con_bot"></div>
    </div>
</template>

<script>
    import style from 'mixin/style';

    export default {
        name: 'CVConfigFaceExposure',
        mixins: [style],
        data() {
            return {
                d: {
                    EnableFaceExposure: false,
                    FaceExposureBrightness: 99,
                },
                d1: {
                    LightCorrectMode: 0,
                    LightCorrectLevel: 0,
                    AeRouteMode: 0,
                    GainMode: 0,
                    ShutterMode: 0,
                    AECompensation: {
                        Level: 0,
                    },
                },
                shutterlist: [],
            };
        },
        mounted() {
            let default_list = [
                [1, '1/30(1/25)'],
                [2, '1/60(1/50)'],
                [33, '1/75'],
                [3, '1/120(1/100)'],
                [34, '1/125'],
                [35, '1/150'],
                [36, '1/175'],
                [4, '1/200'],
                [37, '1/225'],
                [5, '1/250'],
                [38, '1/300'],
                [39, '1/400'],
                [6, '1/500'],
                [40, '1/750'],
                [7, '1/1000'],
                [8, '1/2000'],
                [41, '1/4000'],
                [9, '1/5000'],
                [10, '1/10000'],
            ];
            try {
                this.shutterlist = this.$Param['CVConfigVideoPara']['ShutterList'] || default_list;
            } catch (e) {
                this.shutterlist = default_list;
            }

            this.load_data();
        },
        methods: {
            load_data() {
                Promise.all([
                    this.$store.dispatch('request', {
                        url: 'goform/frmVideoParaEx',
                        Type: 0,
                        Data: {},
                    }),
                    this.$store.dispatch('request', {
                        url: 'goform/frmVideoFaceDetectV2',
                        Type: 0,
                        Data: {},
                    }),
                ]).then((r) => {
                    if (r[0].Result == -655365 || r[1].Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (r[0].Result == 0 && r[1].Result == 0) {
                            this.d1 = r[0].Data;
                            this.d = r[1].Data;

                            this.d.FaceExposureBrightness = this.d.FaceExposureBrightness;
                            this.d.EnableFaceExposure = this.d.EnableFaceExposure ? true : false;

                            this.$notify.success(this.$store.getters.current_language['i18n_getok']);
                        } else {
                            this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
                        }
                    }
                });
            },

            saveExpo() {
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.$store.getters.current_language['i18n_checkinput']);
                    return;
                }

                // msg(['看看',this.d.EnableFaceExposure])

                if (this.d.EnableFaceExposure) {
                    //保存自动曝光参数

                    this.d.FaceExposureBrightness = parseInt(this.d.FaceExposureBrightness);
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmVideoFaceDetectV2',
                            Type: 1,
                            Data: { FaceExposureBrightness: this.d.FaceExposureBrightness, EnableFaceExposure: 1 },
                        })
                        .then((r) => {
                            if (r.Result == -655365) {
                                this.$store.dispatch('config_no_right');
                            } else if (r.Result == 0) {
                                this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
                            } else {
                                this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
                            }
                        });
                } else {
                    //保存手动曝光参数

                    this.d1.AECompensation.Level = parseInt(this.d1.AECompensation.Level);

                    Promise.all([
                        this.$store.dispatch('request', {
                            url: 'goform/frmVideoParaEx',
                            Type: 1,
                            Data: this.d1,
                        }),
                        this.$store.dispatch('request', {
                            url: 'goform/frmVideoFaceDetectV2',
                            Type: 1,
                            Data: {
                                EnableFaceExposure: 0,
                            },
                        }),
                    ]).then((r) => {
                        if (r[0].Result == -655365 || r[0].Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else if (r[0].Result == 0 && r[0].Result == 0) {
                            this.d.EnableFaceExposure = false;
                            this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
                        } else {
                            this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
                        }
                    });
                }
            },
        },
        watch: {
            // ["d.RecEnable"](newVal) {
            //   this.d.SnapFaceEnable = newVal;
            // }
            ['d.EnableFaceExposure'](newVal, oldVal) {
                // msg(['mm',newVal,oldVal])
                if (newVal) {
                    this.d.EnableFaceExposure = newVal;
                }
            },
        },
    };
</script>

<style></style>
