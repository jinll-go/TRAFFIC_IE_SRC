<template>
    <!--
	<div class="main_con clearfix">
		<div class="main_con_top">
			<div class="fl pl10 bold">
				<label v-tr="i18n_Temperature_measurement_area"><!--测温区域</label>
			</div>
		</div>

		<div class="main_con_mid">
			<div class="w100 pt1">
				<table width="400" height="340" border="0" cellpadding="2" cellspacing="1">
					<!-- 右侧视频流区域

					<tr>
						<td>
							<div align="center" id="plugin" class="videoarea"></div>

							<div>
								<label class="line" v-tr="i18n_FaceAreatype"><!-- 区域类型 </label>
								<select class="textc line" style="width: 80px" v-model="area_type">
									<option :value="0" v-tr="i18n_FaceAreatype_Detect"></option>
									<option :value="1" v-tr="i18n_FaceAreatype_Shieding"></option> </select
								>&nbsp;&nbsp;
								<button :class="button_style" v-tr="i18n_allClear" @click="btnclear()"></button>
							</div>
						</td>
					</tr>
				</table>
			</div>

			<div class="w100 pt10 text_center" style="position:relative">
				<button :class="button_style" v-tr="i18n_save" @click="save()"></button>
			</div>
		</div>

		<div class="main_con_bot"></div>
	</div>-->
    <div class="main_con_k clearfix" style="padding-top: 10px">
        <div class="main_con_top_k">
            <div class="fl pl10 bold">
                <label v-tr="i18n_Temperature_measurement_area"></label>
            </div>
        </div>
        <div class="main_con_mid_k">
            <div class="w100 pt1">
                <table width="100%" border="0" cellpadding="2" cellspacing="1">
                    <tr>
                        <td colspan="2" valign="top">
                            <table width="100%" border="0" cellspacing="0" cellpadding="5">
                                <tr>
                                    <td width="33%" align="left">
                                        <input type="checkbox" v-model="d.Enable" />
                                        &nbsp;<label v-tr="i18n_enableVideoShelter"><!--启用--></label>
                                    </td>
                                    <td width="33%" align="left"></td>
                                    <td width="33%" align="left"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top" class="td_bg" style="width: 50%">
                            &nbsp;&nbsp;<label v-tr="i18n_BaseConfig"><!--基本配置--></label>
                        </td>
                        <td valign="top" class="td_bg" style="width: 50%">
                            &nbsp;&nbsp;<label style="display:none;" v-tr="i18n_MaskSet"><!--设置区域--></label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table>
                                <tr>
                                    <td width="50%">
                                        <label v-tr="i18n_FaceMinPicPixel" class="head_lb_text_w"> 最小人脸像素 </label>:
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            v-model="d.MinSize"
                                            :disabled="!d.Enable"
                                            v-validator:NOVOID:Number="[16, 300]"
                                        />
                                        <label class="tail_lb_text_w">(16~300)</label>
                                        <label class="head_lb_text_w">{{ this.lang.i18n_enableVideoShelter }}FTP</label>:
                                        <div class="chk_wrapper">
                                            <input type="checkbox" v-model="d.FtpEnable" :disabled="!d.Enable" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label v-tr="i18n_FaceQualityThreshold" class="head_lb_text_w">人脸质量分阈值</label>:
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            v-model="d.Sensitivity"
                                            :disabled="!d.Enable"
                                            v-validator:NOVOID:Number="[0, 10]"
                                        />
                                        <label class="tail_lb_text_w">(0~10)</label>
                                        <label v-tr="i18n_OnlyLargestFace" class="head_lb_text_w">只检测最大人脸</label>:
                                        <input type="checkbox" v-model="d.OnlyMaxFaceEnable" :disabled="!d.Enable" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label v-tr="i18n_FaceRecIntervalMSec" class="head_lb_text_w"> 间隔时间 </label>:
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            v-model="d.FaceRecIntervalMSec"
                                            :disabled="!d.Enable"
                                            v-validator:NOVOID:Number="[1, 10000]"
                                        />
                                        <label class="tail_lb_text_w">(1~10000){{ this.lang.i18n_millisecond }}</label>
                                        <label v-tr="i18n_FacePicQuality" class="head_lb_text_w"> <!-- 抓拍图片质量 --> </label>:
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            v-model="d.CaptureQuality"
                                            :disabled="!d.Enable"
                                            v-validator:NOVOID:Number="[1, 99]"
                                        />
                                        <label class="tail_lb_text_w">(1~99)</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label v-tr="i18n_ftpfulljpeg" class="head_lb_text_w"></label>:
                                        <div class="chk_wrapper">
                                            <input type="checkbox" v-model="d.FtpFullJpeg" :disabled="!d.Enable" />
                                        </div>
                                        <label v-tr="i18n_FullJpegQuality" class="head_lb_text_w"></label>:
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            v-model="d.CaptureFullQuality"
                                            :disabled="!d.Enable || !d.FtpFullJpeg"
                                            v-validator:NOVOID:Number="[1, 99]"
                                        />
                                        <label class="tail_lb_text_w">(1~99)</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label v-tr="i18n_FaceCaptureModel" class="head_lb_text_w"> 抠图模式 </label>:
                                        <select class="textc ipt_w" :disabled="!d.Enable" v-model="d.CaptureType">
                                            <option :value="0" v-tr="i18n_FaceCaptureModel_Interval"></option>
                                            <option :value="1" v-tr="i18n_FaceCaptureModel_Entry"></option>
                                            <option :value="2" v-tr="i18n_FaceCaptureModel_Leave"></option>
                                            <option :value="3" v-tr="i18n_FaceCaptureModel_Entry_Leave"></option>
                                            <option :value="4" v-tr="i18n_FaceCaptureModel_Compare" v-if="ui_custom.FaceCaptureModel.visible"></option>
                                        </select>
                                        <div v-show="d.CaptureType == 0">
                                            <label v-tr="i18n_FaceIntervalTime" class="head_lb_text_w"> 间隔时间 </label>:
                                            <input
                                                type="text"
                                                class="textc ipt_w"
                                                v-model="interTime"
                                                :disabled="!d.Enable"
                                                v-validator:NOVOID:Number="[1, 10000]"
                                            />
                                            <label class="tail_lb_text_w">(1~10000){{ this.lang.i18n_millisecond }}</label>
                                        </div>
                                        <div v-show="d.CaptureType == 2">
                                            <label v-tr="i18n_FaceCapture_Num" class="head_lb_text_w"> 离开模式抓图数目 </label>:
                                            <input
                                                type="text"
                                                class="textc ipt_w"
                                                v-model="d.CaptureOutNum"
                                                :disabled="!d.Enable"
                                                v-validator:NOVOID:Number="[1, 3]"
                                            />
                                            <label class="tail_lb_text_w">(1~3)</label>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-show="d.CaptureType == 1">
                                    <td>
                                        <label v-tr="i18n_FaceEntryTime" class="head_lb_text_w"> 进入时间 </label>:
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            v-model="enterTime"
                                            :disabled="!d.Enable"
                                            v-validator:NOVOID:Number="[1, 10000]"
                                        />
                                        <label class="tail_lb_text_w">(1~10000){{ this.lang.i18n_millisecond }}</label>
                                        <label v-tr="i18n_FaceCapture_Num" class="head_lb_text_w"> 抓图数目 </label>:
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            v-model="d.CaptureInNum"
                                            :disabled="!d.Enable"
                                            v-validator:NOVOID:Number="[1, 3]"
                                        />
                                        <label class="tail_lb_text_w">(1~3)</label>
                                    </td>
                                </tr>
                                <!-- 人脸抓拍图OSD叠加 -->
                                <tr v-show="ui_custom.FaceSnapOSD.visible">
                                    <td>
                                        <label class="head_lb_text_w" v-tr="i18n_OSD_superpose"></label>:
                                        <div class="chk_wrapper">
                                            <input type="checkbox" v-model="d.EnableFaceSnapOSD" :disabled="!d.Enable" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%" v-show="ui_custom.DetectInterval.visible">
                                        <label v-tr="i18n_DetectInterval" class="head_lb_text_w"><!--检测间隔--></label>:&nbsp;
                                        <input
                                            type="text"
                                            class="textc ipt_w"
                                            :disabled="!d.Enable"
                                            v-model="d.DetectIntervalMSec"
                                            v-validator:NOVOID:Number="[40, 60000]"
                                        />
                                        <label class="tail_lb_text_w">(40~60000ms)</label>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td width="50%" align="center" valign="top">
                            <table width="98%" border="0" cellspacing="0" cellpadding="0" id="tab2">
                                <tr>
                                    <td align="center" id="plugin" class="config_plugin_rect"></td>
                                </tr>
                                <tr>
                                    <td style="width: 35%">
                                        <label v-tr="i18n_FaceAreatype"><!-- 区域类型 --></label>
                                        <select class="textc" style="width: 80px" :disabled="!d.Enable" v-model="area_type">
                                            <option :value="0" v-tr="i18n_FaceAreatype_Detect"></option>
                                            <option :value="1" v-tr="i18n_FaceAreatype_Shieding"></option> </select
                                        >&nbsp;&nbsp;
                                        <button
                                            :class="button_style"
                                            style="width:75px;"
                                            v-tr="i18n_allClear"
                                            :disabled="!d.Enable"
                                            @click="btnclear()"
                                        ></button>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="w100 pt10 text_center" style="position:relative">
                <button :class="button_style" style="width:88px;" v-tr="i18n_save" @click="save()"></button>
            </div>
        </div>
        <div class="main_con_bot_k"></div>
    </div>
</template>

<script>
    import style from 'mixin/style';
    import detectmaskregions from 'mixin/config_plugin_detectmaskregions';
    import repos_plugin from 'mixin/repos_plugin';
    export default {
        name: 'CVConfigHumanTempDetectArea',
        mixins: [style, repos_plugin, detectmaskregions],
        data() {
            return {
                d: {},
                interTime: 2,
                enterTime: 1,

                background: {
                    background: 0,
                },
            };
        },
        mounted() {
            this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', Type: 0, Data: {}, Dev: 1, Ch: 1 }).then((r) => {
                if (r.Result == -655365) {
                    this.$store.dispatch('config_no_right');
                } else {
                    if (r.Result == 0) {
                        this.load(r.Data);

                        this.d.CaptureIntervalMSec = this.d.CaptureIntervalMSec || 0;
                        this.interTime = this.d.CaptureIntervalSec * 1000 + this.d.CaptureIntervalMSec;
                        this.d.CaptureInMSec = this.d.CaptureInMSec || 0;
                        this.enterTime = this.d.CaptureInSec * 1000 + this.d.CaptureInMSec;

                        this.area_type = 0;

                        this.d.Sensitivity = parseInt(this.d.Sensitivity, 10);

                        if (this.isIE) {
                            this.background.background = '#' + this.d.DrawFaceRGB;
                            this.DrawFaceRGB = this.d.DrawFaceRGB;
                        } else {
                            this.DrawFaceRGB = '#' + this.d.DrawFaceRGB;
                        }

                        window.toastr.success(this.lang['i18n_getok']);
                    } else {
                        window.toastr.error(this.lang['i18n_getfailed']);
                    }
                }
            });
        },
        methods: {
            backup_plugindraw() {
                this.getpoint();
            },
            load(data) {
                this.plugin_inited();
                if (data) {
                    this.d = data;

                    this.d.CaptureIntervalMSec = this.d.CaptureIntervalMSec || 0;
                    this.interTime = this.d.CaptureIntervalSec * 1000 + this.d.CaptureIntervalMSec;
                    this.d.CaptureInMSec = this.d.CaptureInMSec || 0;
                    this.enterTime = this.d.CaptureInSec * 1000 + this.d.CaptureInMSec;

                    this.Regions = [];
                    this.Regions.push(this.d.DetectRegion);
                    // 传入屏蔽框
                    this.Regions.push(this.d.MaskRegion0);
                    this.Regions.push(this.d.MaskRegion1);
                    this.Regions.push(this.d.MaskRegion2);
                    this.Regions.push(this.d.MaskRegion3);

                    if (this.isIE) {
                        this.background.background = '#' + this.d.DrawFaceRGB;
                    } else {
                        this.d.DrawFaceRGB = '#' + this.d.DrawFaceRGB;
                    }
                }
                this.setpoint();
            },
            btnclear() {
                this.clearall();
            },
            changeStatus() {
                this.isShow = !this.isShow;
            },
            save() {
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
                    return;
                }
                this.backup_plugindraw();
                this.Regions.forEach((item, index) => {
                    if (index) {
                        this.d['MaskRegion' + (index - 1)] = item;
                    } else {
                        this.d.DetectRegion = item;
                    }
                });

                this.d.Enable = this.d.Enable ? 1 : 0;
                this.d.MinSize = parseInt(this.d.MinSize);
                this.d.OnlyMaxFaceEnable = this.d.OnlyMaxFaceEnable ? 1 : 0;
                // this.d.SnapFaceEnable = this.d.Enable;
                this.d.CaptureQuality = parseInt(this.d.CaptureQuality);
                this.d.CaptureIntervalSec = parseInt(parseInt(this.interTime) / 1000);
                this.d.CaptureIntervalMSec = parseInt(this.interTime) % 1000;
                this.d.CaptureInSec = parseInt(parseInt(this.enterTime) / 1000);
                this.d.CaptureInMSec = parseInt(this.enterTime) % 1000;
                this.d.CaptureInNum = parseInt(this.d.CaptureInNum);
                this.d.CaptureOutNum = parseInt(this.d.CaptureOutNum);
                this.d.FtpEnable = this.d.FtpEnable ? 1 : 0;
                this.d.FtpFullJpeg = this.d.FtpFullJpeg ? 1 : 0;
                this.d.Sensitivity = parseInt(this.d.Sensitivity, 10);
                this.d.CaptureFullQuality = parseInt(this.d.CaptureFullQuality);
                this.d.CaptureMaxWidth = parseInt(this.d.CaptureMaxWidth);
                this.d.FaceExtRatioW = parseInt(this.d.FaceExtRatioW);
                this.d.CaptureMaxFaceWidth = parseInt(this.d.CaptureMaxFaceWidth);
                this.d.FaceExtRatioH = parseInt(this.d.FaceExtRatioH);
                this.d.RecEnable = this.d.Enable;
                this.d.FaceRecIntervalMSec = parseInt(this.d.FaceRecIntervalMSec);
                this.d.EnableFaceSnapOSD = this.d.EnableFaceSnapOSD ? 1 : 0;
                this.d.DrawFaceRGB = this.isIE ? this.DrawFaceRGB : this.DrawFaceRGB.substr(1);
                this.d.DetectIntervalMSec = parseInt(this.d.DetectIntervalMSec);

                this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', Type: 1, Data: this.d, Dev: 1, Ch: 1 }).then((r) => {
                    if (r.Result == -655365) {
                        this.$store.commit('errorCode/change', 0);
                        this.$store.commit('face/FaceIndex', 'CVConfigMsg');
                    } else {
                        if (r.Result == 0) {
                            this.$notify.success(this.lang['i18n_saveok']);
                        } else if (r.Result == 1) {
                            this.$notify.success(this.lang['i18n_update_ok']);
                            this.$store.dispatch('request', { url: 'goform/frmDeviceReboot', Type: 0, Data: {} });
                        } else if (r.Result == -5) {
                            this.$notify.error(
                                this.$store.getters.showElectronicFence == true ? this.lang['i18n_smart_error'] : this.lang['i18n_smart_region_error'],
                                '',
                                { timeOut: 6000 }
                            );
                        } else {
                            this.$notify.error(this.lang['i18n_savefailed']);
                        }
                    }
                });
            },
        },
        computed: {
            area_type: {
                get() {
                    return this.AreaType;
                },
                set(v) {
                    //保存当前区域的坐标
                    this.getpoint();
                    this.AreaType = v;
                    //绘制切换的区域的坐标
                    this.setpoint();
                },
            },
        },
    };
</script>
<style scoped>
    .head_lb_text_w {
        /*overflow: hidden;*/
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 120px;
        text-align: right;
        display: inline-block;
    }
    .ipt_w {
        width: 80px;
    }
    .tail_lb_text_w {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100px;
        text-align: left;
        display: inline-block;
    }
    .chk_wrapper {
        text-align: left;
        display: inline-block;
        width: 120px;
    }
</style>
