<template>
    <div class="main_con clearfix" style="margin-top:100px">
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_TemperatureDetect">温度检测</label>
            </div>
        </div>

        <div class="main_con_mid">
            <!-- 温度单位类型 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureUnitType"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <select class="textc" style="width:200px;" v-model="tempFahEnable">
                        <option :value="0" v-tr="i18n_TemperatureCelsius"></option>
                        <option :value="1" v-tr="i18n_TemperatureFahrenheit"></option>
                    </select>
                </div>
            </div>
            <!--温度显示模式  -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureDisplayMode"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <select class="textc" style="width:200px;" v-model="tempDisplayMode">
                        <option :value="0" v-tr="i18n_TemperatureShowValue"></option>
                        <option :value="1" v-tr="i18n_TemperatureShowState"></option>
                    </select>
                </div>
            </div>
            <!--体温  -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_Bodytemperature"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="enableTempCheck" v-model="enableTempCheck" />
                    <span class="f1" v-tr="i18n_TemperatureEnable"></span>
                </div>
            </div>
            <!-- 体温阈值 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureRange"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="normalDegree" class="textc" style="width:200px;"
                        :disabled="!enableTempCheck" />
                    <span class="f1">{{tempFahEnable?"℉":"℃"}}</span>
                </div>
            </div>
            <!-- 温度校正 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureCorrection"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="compensateDegree" class="textc" style="width:200px; "
                        :disabled="!enableTempCheck" />
                    <span class="fl" style="width:70%"> </span>
                    <span class="f1">{{tempFahEnable?"℉":"℃"}}</span>
                </div>
            </div>

            <!--  智能模式-->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureSmartMode"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <select class="textc" style="width:200px;" v-model="tempDetectMode" :disabled="!enableTempCheck">
                        <option :value="0" v-tr="i18n_TemperatureNormalMode"></option>
                        <option :value="1" v-tr="i18n_TemperatureSmartMode"></option>
                        <option :value="2" v-tr="i18n_TemperatureFastMode"></option>
                    </select>
                </div>
            </div>
            <!--高温联动邮件  -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureLinkage"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="emailLinkHighTemp" v-model="emailLinkHighTemp"
                        :disabled="!enableTempCheck" />
                    <span class="f1" v-tr="i18n_TemperatureEnable"></span>
                </div>
            </div>
            <!--温度显示类型  -->
            <div class="w100 pt5" v-show="emailLinkHighTemp">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureDisplayType"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <select class="textc" style="width:200px;" v-model="emailShowTempType"  :disabled="!enableTempCheck">
                        <option :value="0" v-tr="i18n_TemperatureShowValue"></option>
                        <option :value="1" v-tr="i18n_TemperatureShowState"></option>
                    </select>
                </div>
            </div>
            <!--低温检测  -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureLowDetection"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="enableTempCheck" v-model="enableMinTempCheck"  :disabled="!enableTempCheck"/>
                    <span class="f1" v-tr="i18n_TemperatureEnable"></span>
                </div>
            </div>
            <!-- 低温阈值 -->
            <div class="w100 pt5" v-show="enableMinTempCheck">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_TemperatureLowRange"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="minDegree" class="textc" style="width:200px;"
                        :disabled="!enableTempCheck" />
                    <span class="f1">{{tempFahEnable?"℉":"℃"}}</span>
                </div>
            </div>
            <!--低温禁止通行  -->
            <div class="w100 pt5"  v-show="enableMinTempCheck">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_LowTemperatureTraffic"></label>:&nbsp;
                </div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="trafficMinTemp" v-model="trafficMinTemp"  :disabled="!enableTempCheck"/>
                    <span class="f1" v-tr="i18n_LowTemperatureProhibited"></span>
                </div>
            </div>
            <div class="w100 pt10 text_center" style="position:relative">
                <button :class="button_style" style="width:60px;" v-tr="i18n_save" @click="save"></button>
            </div>
        </div>
        <div class="main_con_bot"></div>
    </div>

</template>
<script>
    import style from 'mixin/style';

    export default {
        name: "CVConfigOsd",
        mixins: [style],
        data() {
            return {
                supportTempCheck: 0,
                enableTempCheck: 0,
                tempFahEnable: 0,
                tempDisplayMode: 0,
                normalDegree: "",
                compensateDegree: "",
                tempDetectMode: 0,
                emailLinkHighTemp: 0,
                emailShowTempType: 0,
                enableMinTempCheck: 0,
                minDegree: "",
                trafficMinTemp: 0,
                getData: {},
            };
        },

        mounted() {
            this.gettemp();

        },

        methods: {
            gettemp: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 16,
                        Data: {},
                    })
                    .then((r) => {
                        if (r.Result === 0) {
                            msg("temp:", r);
                            this.getData = JSON.parse(JSON.stringify(r.Data))
                            let temp = r.Data
                            this.supportTempCheck = temp.SupportTempCheck
                            this.enableTempCheck = temp.EnableTempCheck
                            this.tempFahEnable = temp.TempFahEnable
                            this.tempDisplayMode = temp.TempDisplayMode
                            this.normalDegree = temp.NormalDegree
                            this.compensateDegree = temp.CompensateDegree

                            this.tempDetectMode = temp.TempDetectMode
                            this.emailLinkHighTemp = temp.EmailLinkHighTemp
                            this.emailShowTempType = temp.EmailShowTempType
                            this.enableMinTempCheck = temp.EnableMinTempCheck
                            this.minDegree = temp.MinDegree
                            this.trafficMinTemp = temp.TrafficMinTemp
                          
                        } else {
                            this.$store.dispatch('config_no_right');
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        msg('Get frmVideoFaceRecognitionPara info failed!!');
                    });
            },

            save() {

                this.getData.SupportTempCheck = this.supportTempCheck
                this.getData.EnableTempCheck = this.enableTempCheck
                this.getData.TempFahEnable = this.tempFahEnable
                this.getData.TempDisplayMode = this.tempDisplayMode
                this.getData.NormalDegree = this.normalDegree
                this.getData.CompensateDegree = this.compensateDegree

                this.getData.TempDetectMode = this.tempDetectMode
                this.getData.EmailLinkHighTemp = this.emailLinkHighTemp
                this.getData.EmailShowTempType = this.emailShowTempType
                this.getData.EnableMinTempCheck = this.enableMinTempCheck
                this.getData.MinDegree = this.minDegree
                this.getData.TrafficMinTemp = this.trafficMinTemp
                console.log(this.getData);
                this.$store.dispatch("request", {
                    url: "goform/frmVideoFaceRecognitionPara",
                    Type: 17,
                    Data: this.getData,

                }).then(r => {
                    if (r.Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (r.Result == 0) {
                            this.$notify.success(this.$store.getters.current_language["i18n_saveok"]);
                        } else {
                            this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
                        }
                    }
                })
            },
        },
    };
</script>