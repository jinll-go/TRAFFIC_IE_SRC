<template>
<div style="padding: 10px">
                <!-- 人脸比对 -->
                <table class="_table" cellpadding="0" cellspacing="0" style="width:100%" >
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_Time"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ CommonObj.Time }}</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_FaceModel"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ trans_Type(CommonObj.Target) }}</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_GroupName"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ CommonObj.TargetName }}</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_GroupType"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ trans_Type(CommonObj.TargetType, 'TargetType') }}</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_FaceID"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ CommonObj.FaceId }}</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_Name"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ CommonObj.Name }}</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_Describe"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ CommonObj.Describe }}</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="_td text_center p5" style="width: 30%;">
                            <label v-tr="i18n_Face_Similary"></label>
                        </td>
                        <td class="_td text_center p5" style="width: 70%;">
                            <label>{{ CommonObj.TargetSimilarity }}</label>
                        </td>
                    </tr>

            <!-- 测温 -->
            <tr v-show="popup.isTemperature">
                <td class="_td text_center p5" style="width: 30%;">
                    <label v-tr="i18n_temperature"></label>
                </td>
                <td class="_td text_center p5" style="width: 70%;">
                    <label>{{ CommonObj.Temperature.toFixed(1) }}</label>
                </td>
            </tr>
            <tr v-show="popup.isTemperature">
                <td class="_td text_center p5" style="width: 30%;">
                    <label v-tr="i18n_temperatureAlarm"></label>
                </td>
                <td class="_td text_center p5" style="width: 70%;">
                    <label>{{ trans_Type(CommonObj.TemperatureAlarm, 0) }}</label>
                </td>
            </tr>
            <tr v-show="popup.isTemperature">
                <td class="_td text_center p5" style="width: 30%;">
                    <label v-tr="i18n_maskStatus"></label>
                </td>
                <td class="_td text_center p5" style="width: 70%;">
                    <label>{{ trans_masktype(CommonObj.MaskType) }}</label>
                </td>
            </tr>
            <!-- 测温end -->
            <tr>
                <td class="_td text_center" colspan="2">
                    <table cellpadding="0" cellspacing="0" style="width: 100%">
                        <tr>
                            <td class="border_right" style="width: 20%">
                                <label v-tr="i18n_capture"></label>
                            </td>
                            <td class="border_right" style="width: 30%">
                                <label><img style="height: 126px;width: auto;" :src="'data:image/jpeg;base64,' + CommonObj.FaceData"/></label>
                            </td>
                            <td class="border_right" style="width: 20%">
                                <label v-tr="i18n_FaceModelPic"></label>
                            </td>
                            <td style="width: 30%">
                                <label><img style="height: 126px;width: auto;" :src="ShowTargetFace(CommonObj.TargetFaceData)"/></label>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
    export default {
        name: 'CVDialogFacecomparisonDetail',
        inject: ['popup'],
        data() {
            return {
                CommonObj: this.popup.extradata,
                //flag: false, //是否显示测温的配置
            };
        },

        methods: {
            hide() {
                this.popup.visible = false;
            },
            trans_Type(type, option) {
                let str = '';
                let lang = this.lang;
                if (option) {
                    switch (type) {
                        case 0:
                            str = lang.i18n_ResOther;
                            break;
                        case 1:
                            str = lang.i18n_whitelist;
                            break;
                        case 2:
                            str = lang.i18n_blacklist;
                            break;
                    }
                } else {
                    str = type ? lang.i18n_yes : lang.i18n_no;
                }
                return str;
            },
            ShowTargetFace(facedata) {
                let FaceData = this.popup.extradata.TargetFaceData;
                if (FaceData) {
                    return 'data:image/jpeg;base64,' + FaceData;
                } else {
                    return 'static/images/defaultface.png';
                }
            },
            trans_masktype(t) {
                if (t == 0) {
                    return this.lang.i18n_undetect;
                } else if (t == 1) {
                    return this.lang.i18n_maskInvalid;
                } else if (t == 2) {
                    return this.lang.i18n_maskValid;
                } else if (t == 3) {
                    return '';
                }
            },
        },
    };
</script>
