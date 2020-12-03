<template>
    <div class="main_con_k clearfix" style="margin-top:100px;">
        <div class="main_con_top_k">
            <div class="fl pl10 bold">
                <label v-tr="i18n_videoPara">
                    <!-- 视频参数 -->{{}}</label>
            </div>
        </div>
        <div class="main_con_mid_k" id="divMid">
            <div class="w100 pt1">
                <table width="100%" border="0" cellpadding="2" cellspacing="1">
                    <tr>
                        <td width="55%" align="center" valign="top">
                            <table width="99%" height="398px" border="0" cellspacing="0" cellpadding="0" id="tab1">
                                <!--码流压缩类型:主码流/子码流-->

                                <tr>
                                    <td width="30%" height="30" align="right"><label id="labBaudRate"
                                            v-tr="i18n_streamCompressType">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="SelBaudRate" id="SelBaudRate" class="textc" style="width:220px;"
                                            v-model="SelBaudRate">
                                            <option :value="0" v-tr="i18n_mainStream"></option>
                                            <option :value="1" v-tr="i18n_subStream"></option>
                                        </select>
                                    </td>
                                </tr>

                                <!--码流类型:复合流/视频流-->
                                <tr v-show="ui_custom.stream_type.visible">
                                    <td width="30%" height="30" align="right"><label
                                            v-tr="i18n_streamType">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="selStreamType" id="selStreamType" class="textc"
                                            style="width:220px;" v-model="selStreamType">
                                            <!-- :disabled="SelBaudRate != 0"> -->
                                            <option value="0" v-tr="i18n_videoStream">{{}}</option>
                                            <option value="1" v-tr="i18n_complexStream">{{}}</option>
                                        </select>
                                    </td>
                                </tr>

                                <!--分辨率:-->
                                <tr v-show="ui_custom.resolution.visible">
                                    <td width="26%" height="30" align="right"><label id="lblResolution"
                                            v-tr="i18n_resolution">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="selResolution" id="selResolution" class="textc"
                                            style="width:220px;" v-model="selResolution">
                                            <option v-for="opt in Resolution" :value="opt[1]">{{ opt[0] }}</option>
                                        </select>
                                    </td>
                                </tr>

                                <!--码率类型:-->
                                <tr v-show="ui_custom.bitrate_type.visible">
                                    <td width="30%" height="30" align="right"><label id="lblBitrateType"
                                            v-tr="i18n_videoBitrateType">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="selBitrateType" id="selBitrateType" class="textc"
                                            style="width:220px;" v-model="selBitrateType">
                                            <option value="0" v-tr="i18n_changedRate">{{}}</option>
                                            <option value="1" v-tr="i18n_fixedRate">{{}}</option>
                                        </select>
                                    </td>
                                </tr>


                                <!--码率上限:-->
                                <tr v-show="ui_custom.bitrate.visible">
                                    <td width="30%" height="30" align="right"><label id="lblVB"
                                            v-tr="i18n_videoBitrate">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="selVideoBitrate" id="selVideoBitrate" class="textc"
                                            style="width:220px;" v-model="selVideoBitrate">
                                            <option v-for="opt in Bitrate" :value="opt[1]">{{ opt[0] }}</option>
                                        </select>
                                    </td>

                                </tr>

                                <tr v-show="selVideoBitrate == 0">
                                   <td width="30%" height="30" align="right"><label id="lblVB"
                                            v-tr=""></label>&nbsp;</td>
                                    <td width="70%" align="left">
                                        <input name="text" type="text" class="textc" v-model="Bit" style="width:220px"
                                            v-if="Bitrate.length" 
                                            v-validator:NOVOID:Number="[16, 4000]" />
                                        <span v-show="selVideoBitrate == 0"> Kbps</span>
                                    </td>
                                </tr>


                                <!--视频帧率-->
                                <tr v-show="ui_custom.framerate.visible">
                                    <td width="30%" height="30" align="right"><label id="lblVideoFrameRate"
                                            v-tr="i18n_videoFrameRate">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="selVideoFrameRate" id="selVideoFrameRate" class="textc"
                                            style="width:220px;" v-model="selVideoFrameRate">
                                            <option v-for="opt in FrameRate" :value="opt[1]">{{ opt[0] }}</option>
                                        </select>
                                    </td>
                                </tr>


                                <!--图像质量:-->
                                <tr id="divPicQuality">
                                    <td width="30%" height="30" align="right"><label
                                            v-tr="i18n_picQuality">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="selPicQuality" id="selPicQuality"
                                            :disabled="selBitrateType == 1 ? false : true" class="textc"
                                            style="width:220px;" v-model="selPicQuality">
                                            <option value="0" v-tr="i18n_best">{{}}</option>
                                            <option value="1" v-tr="i18n_lessBest">{{}}</option>
                                            <option value="2" v-tr="i18n_better">{{}}</option>
                                            <option value="3" v-tr="i18n_general">{{}}</option>
                                            <option value="4" v-tr="i18n_poor">{{}}</option>
                                            <option value="5" v-tr="i18n_worst">{{}}</option>
                                        </select>
                                    </td>
                                </tr>


                                <!--编码类型-->
                                <tr>
                                    <td width="30%" height="30" align="right"><label
                                            v-tr="i18n_videoEncode">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <select name="selVideoEncode" id="selVideoEncode" class="textc"
                                            style="width:220px;" v-model="selVideoEncode">
                                            <option v-for="opt in VideoEncType" :value="opt[1]">{{ opt[0] }}</option>
                                        </select>
                                    </td>
                                </tr>

                                <!--I帧间隔:-->
                                <tr id="divIFrameInterval"
                                    v-show="ui_custom.i_frame_interval.visible">
                                    <td width="30%" height="30" align="right"><label id="lblIFrameInterval"
                                            v-tr="i18n_IFrameInterval">{{}}</label>:&nbsp;</td>
                                    <td width="70%" align="left">
                                        <input id="IFrameInterval" class="textc tip" style="width:220px;" value=""
                                            v-model="frame_interval" v-validator:NOVOID:Number="[2, 255]" />
                                             <span > (1-255)</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="w100 pt10 text_center" style="position:relative">
                <button id="button" :class="button_style" v-tr="i18n_save" @click="save">{{}}</button>
            </div>
        </div>
        <div class="main_con_bot_k"></div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import style from 'mixin/style';

    export default {
        name: 'CVConfigVideo',
        mixins: [style],
        data() {
            return {
                SelBaudRate: 0,

                selStreamType: 0,

                selResolution: 0,
                Resolution: [],

                selVideoFrameRate: 0,
                FrameRate: [],

                selVideoEncode: 0,
                VideoEncType: [],

                selBitrateType: 0,
                BitrateType: [],

                selVideoBitrate: 0,
                Bitrate: [],

                selH264PROFILE: 0,
                H264PROFILE: [],

                selPicQuality: 0,
                Bit: 0,
                CopyChan: [],
                ChanNum: 1,

            };
        },
        mounted() {
            this.request(0);
        },
        methods: {

            load(data) {
                if (data) {
                    this.SelBaudRate = data.CompressPara.AbilityType;
                    this.selStreamType = data.CompressPara.StreamType;
                    this.selResolution = data.CompressPara.Resolution;
                    this.selBitrateType = data.CompressPara.BitrateType;
                    this.selVideoEncode = data.CompressPara.VideoEncType;
                    this.selVideoFrameRate = data.CompressPara.VideoFrameRate;
                    //  this.selH264PROFILE = data.CompressPara.VideoH264Profile;
                    this.selPicQuality = data.CompressPara.PicQuality;
                    this.frame_interval = data.CompressPara.IFrameInterval;

                    //位率上限
                    if (data.CompressPara.VideoBitrate === 0) {
                        //自定义
                        this.Bit = data.CompressPara.InBit;
                    } else {
                        this.selVideoBitrate = data.CompressPara.VideoBitrate;
                    }
                }
            },
            request(type) {
                this.$loading.show = true;
                msg("request jll", type, parseInt(type));
                Promise.all([
                    this.$store.dispatch('request', {
                        url: 'goform/frmVideoCompressAbility',
                        Type: 0,
                        Ch: 1,
                        Data: {
                            AbilityType: type
                        },
                    }),
                    this.$store.dispatch('request', {
                        url: 'goform/frmVideoCompressPara',
                        Type: 0,
                        Ch: 1,
                        Data: {
                            AbilityType: type
                        },
                    }),
                ]).then((_) => {

                    msg("request then");
                    this.$loading.show = false;
                    if (_[0].Result == -655365 || _[1].Result == -655365) {
                        msg("request config_no_right");
                        this.$store.dispatch('config_no_right');
                    } else {
                        let r1 = _[0];
                        let r2 = _[1];
                        console.log("r1:", r1);
                        console.log("r2:", r2);
                        if (r1.Result == 0 && r2.Result == 0) {
                            this.Resolution = r1.Data.CompressAbility.Resolution;
                            this.FrameRate = r1.Data.CompressAbility.FrameRate;
                            this.VideoEncType = r1.Data.CompressAbility.VideoEncType;

                            this.Bitrate = r1.Data.CompressAbility.Bitrate;
                            this.load(r2.Data);

                            this.$notify.success(this.lang['i18n_getok']);
                        } else {

                            msg("request i18n_getfailed");
                            this.$notify.error(this.lang['i18n_getfailed']);
                        }
                    }
                });
            },
            save() {

                let data = {
                    AbilityType: this.SelBaudRate,
                    InBit: parseInt(this.Bit, 10),
                    BitrateType: parseInt(this.selBitrateType, 10),
                    IFrameInterval: parseInt(this.frame_interval, 10),
                    PicQuality: parseInt(this.selPicQuality, 10),

                    Resolution: this.selResolution,
                    StreamType: parseInt(this.selStreamType, 10),
                    VideoBitrate: this.selVideoBitrate,

                    VideoEncType: this.selVideoEncode,
                    VideoFrameRate: this.selVideoFrameRate,
                    //  VideoH264Profile: this.selH264PROFILE,
                };
                console.log("data:jll", data);
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoCompressPara',
                        Type: 1,
                        Data: {
                            AbilityType: this.SelBaudRate,
                            CompressPara: data
                        }
                    })
                    .then((_) => {
                        if (_.Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else {
                            if (_.Result == 0) {
                                this.$notify.success(this.lang['i18n_saveok']);
                            } else {
                                this.$notify.error(this.lang['i18n_savefailed']);
                            }
                        }
                    });
            },
        },

        watch: {
            SelBaudRate(newVal, oldVal) {
                this.request(newVal);
            },
        },
    };
</script>