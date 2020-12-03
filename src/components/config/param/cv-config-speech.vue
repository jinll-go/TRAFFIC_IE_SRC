<template>
    <div class="main_con_k clearfix" style="margin-top:100px">
        <div class="main_con_top_k">
            <div class="fl pl10 bold">
                <label v-tr="i18n_SceneAudio">语音播报</label>
            </div>
        </div>
        <!--内容-->
        <div class="main_con_mid_ss " id="divMid" v-show="!isShowImportAudio">
            <div class="w100 pt5">
                <div class="fl text_right" style="width:15%"><label v-tr="i18n_BroadcastMode"></label>:&nbsp;</div>
                <div class="fl " style="width:10% " ><span v-tr="i18n_BroadcastName"></span></div>
                 <div class="fl " style="width:15%">
                <button :class="button_style" @click="addName" style="width:50px;margin-left:10px;float: left;"
                    v-tr="i18n_BroadcastAdd"></button>
                    </div>
                <div class="fl " style="width:10%"> <span v-tr="i18n_BroadcastScene"></span></div>
                <div class="fl " style="width:15%">
                <button :class="button_style" @click="addScene" style="width:50px; margin-left:10px; float: left;"
                    v-tr="i18n_BroadcastAdd"></button>
                    </div>
            </div>
            <div class="w100 pt5">
                <div class="fl text_right" style="width:20%"><label v-tr="i18n_BroadcastContent"></label>:&nbsp;</div>
                <div class="f1" style="width:80%">
                    <div class="fl text_center" style="width:30%"><label >{{retBroadcastMode()}}</label>&nbsp;</div>
                    <button :class="button_style" @click="clearMode" style="margin-left: 10px;;"
                        v-tr="i18n_BroadcastClear"></button>
                    <button :class="button_style" @click="setBroadcastMode" style="margin-left: 10px;"
                        v-tr="i18n_BroadcastSet"></button>
                </div>
            </div>
            <div class="w100 pt5" v-show="supportTempCheck">
                <div class="fl text_right" style="width:15%"><label v-tr="i18n_BroadcastTemp"></label>:&nbsp;</div>
                <div class="fl" style="width:85%">
                    <input type="checkbox" id="broadcastTemp" v-model.lazy="isBroadcastTemp" @change="setTempAudio" />
                </div>
            </div>
            <div class="w100 pt5">
                <div v-for="(item, index) in scenes" :key="index" style="margin-bottom: 20px;">
                    <div class="w100 pt5" v-show="item.Result === 0">
                        <!-- <span>{{retText(item.Scene)}}</span> -->
                        <div class="fl text_right" style="width:15%"><label>{{retText(item.Scene)}}</label>:&nbsp;</div>
                        <div class="fl" style="width:85%">
                            <select style="width:200px;" class="textc" id="selscene" v-model="item.DefaultText">
                                <option v-for="n in item.Default.length" :value="item.Default[n-1].Text">
                                    {{ item.Default[n-1].Text }}</option>
                                <option :value="cusotmoSelect" v-tr="i18n_CustomSet"></option>
                            </select>

                            <!-- <input v-show="item.DefaultText === cusotmoSelect " v-model="item.Defined.Text" type="text" /> -->
                            <input type="text"  v-model="item.Defined.Text" class="textc" v-show="item.DefaultText === cusotmoSelect " style="width:200px; margin-left: 10px;" />
                            <button @click="set(item)" :class="button_style" style="margin-left: 10px;"
                                v-tr="i18n_BroadcastSet">
                            </button>
                            <button :class="button_style" @click="importAudio(item)" style="margin-left: 10px;"
                                v-tr="i18n_BroadcastImport">
                            </button>
                            <button :class="button_style" @click="listen(item)" style="margin-left: 10px;"
                                v-tr="i18n_testlisten">
                                &nbsp;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <importAudio v-model="isShowImportAudio" :scene="currentScene" @importAudioConfirm="importAudioConfirm">
        </importAudio>

        <div class="main_con_bot_k"></div>
    </div>
</template>

<script>
    import importAudio from "./cv-config-importaudio.vue";
    import style from 'mixin/style';

    export default {
        name: "CVConfigSpeech",
        mixins: [style],
        components: {
            importAudio: importAudio,
        },
        data() {
            return {
                broadcastMode: 0,
                get_broadcastMode: 0,
                isBroadcastTemp: false,
                supportTempCheck: false, // 设备是否支持温度检测
                scenes: [],
                customEnable: [],
                selfDefined: "",
                isShowImportAudio: false,
                currentScene: 0,
                cusotmoSelect: 99,
            };
        },
        created() {
            //页面刷出来前先读音频定制文件
            this.getCustomAudio();
            // 获取设备是否支持温度检测
            this.getSupportTempCheck();
            // 获取播报模式
            this.getBroadcastMode();
            // 获取是否播报温度
            this.getTempAudio();
            // 查询场景音频信息
            this.getSceneAudio();

        },
   
        methods: {
            // 获取温度检测控制参数
            getSupportTempCheck: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 16,
                        Data: {

                        },
                    })
                    .then((response) => {
                        if (response.Result === 0) {

                            this.supportTempCheck =
                                response.Data.SupportTempCheck;

                        } else {
                            this.$store.dispatch('config_no_right');
                            console.log(response);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            // 获取播报模式
            getBroadcastMode: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmAudio',
                        Type: 10,

                    })
                    .then((response) => {
                        if (response.Result === 0) {
                            this.broadcastMode = response.Data.BroadcastMode;
                            //console.log("broadcastMode", this.broadcastMode);
                            this.get_broadcastMode = this.broadcastMode;
                        } else {

                            // this.$store.dispatch('config_no_right');
                            console.log(response);
                        }
                    })
                    .catch((error) => {

                        console.log(error);
                    });
            },
            // 返回显示播报模式内容
            retBroadcastMode: function () {
                if (this.broadcastMode === 0) {
                    return;
                }
                if (this.broadcastMode === 0x1) {
                    return this.lang.i18n_scenename;
                }
                if (this.broadcastMode === 0x2) {
                    return this.sencemode;
                }
                if (this.broadcastMode === ((0x2 << 8) | 0x1)) {
                    return (
                        this.lang.i18n_scenename +
                        " + " +
                        this.lang.i18n_scenemode
                    );
                }
                if (this.broadcastMode === ((0x1 << 8) | 0x2)) {
                    return (
                         this.lang.i18n_scenemode +
                        " + " +
                        this.lang.i18n_scenename
                    );
                }
            },
            // 清除播报模式内容
            clearMode: function () {
                this.broadcastMode = 0;
            },
            // 姓名+号
            addName: function () {
                if (this.broadcastMode === 0) {
                    this.broadcastMode = 0x1;
                } else if (this.broadcastMode === 0x2) {
                    this.broadcastMode = (0x1 << 8) | 0x2;
                }
            },
            // 场景+号
            addScene: function () {
                if (this.broadcastMode === 0) {
                    this.broadcastMode = 0x2;
                } else if (this.broadcastMode === 0x1) {
                    this.broadcastMode = (0x2 << 8) | 0x1;
                }
            },
            // 设置播报模式
            setBroadcastMode: function () {
                if (this.broadcastMode === this.get_broadcastMode) {
                    this.$notify.success(this.lang['i18n_saveok']);
                    return;
                }

                this.$store
                    .dispatch('request', {
                        url: 'goform/frmAudio',
                        Type: 9,
                        Data: {
                            BroadcastMode: this.broadcastMode,
                        },
                    })
                    .then((response) => {
                        if (response.Result === 0) {

                            this.get_broadcastMode = this.broadcastMode;
                              this.$notify.success(this.lang['i18n_saveok']);
                        } else {

                            this.$store.dispatch('config_no_right');
                            console.log(response);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            // 获取是否播报温度
            getTempAudio: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmAudio',
                        Type: 14,
                        Data: {

                        },
                    })
                    .then((response) => {
                        if (response.Result === 0) {
                            if (response.Data.TempAudio === 1) {
                                this.isBroadcastTemp = true;
                            } else {
                                this.isBroadcastTemp = false;
                            }
                        } else {
                            this.isBroadcastTemp = false;
                            this.$store.dispatch('config_no_right');
                            console.log(response);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            // 设置是否播报温度
            setTempAudio: function () {
                let tempAudio = 0;
                if (this.isBroadcastTemp) {
                    tempAudio = 1;
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmAudio',
                        Type: 13,
                        Data: {
                            TempAudio: tempAudio,
                        },
                    })
                    .then((response) => {
                        if (response.Result === 0) {
                        } else {
                            console.log(response);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            //按照顺序来push
            getCustomAudio: function () {
            var DevicefcCap = this.$store.getters.device_fc_Ability;
            console.log("健康码",DevicefcCap.SupportHealthCode);
            console.log("安全帽",DevicefcCap.SupportHelmet);
            console.log("口罩",DevicefcCap.SupportEmask);
  
                this.customEnable = [];
                const enable = 1;
                const unEnable = 0;
                if (this.ui_custom.Traffic.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }

                if (this.ui_custom.Stranger.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }

                if (this.ui_custom.IDCard.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }

                if (this.ui_custom.Admin.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.AuthFail.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.ACCard.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.Helmet.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.TempCheck.visible && this.SupportTempCheck) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.TempHigh.visible && this.SupportTempCheck) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.TempFar.visible && this.SupportTempCheck){
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.TempLow.visible && this.supportTempCheck) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.FaceMask.visible && DevicefcCap.SupportEmask) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.ICIllegal.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.Moving.visible  && this.supportTempCheck) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.Schedule.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }

                if (this.ui_custom.HealthCodeOK.visible && DevicefcCap.SupportHealthCode) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.HealthCodeCheck.visible && DevicefcCap.SupportHealthCode) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.HealthCodeFail.visible && DevicefcCap.SupportHealthCode) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }

                if (this.ui_custom.QrcodeOk.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }

                if (this.ui_custom.HealthCodeUnmatch.visible && DevicefcCap.SupportHealthCode) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }


                if (this.ui_custom.WifiConnecting.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.WifiConnectOK.visible) {
                    customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.WifiConnectFailed.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.GrpCtlOpen.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.GrpCtlTimeout.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
                if (this.ui_custom.ACUnmatch.visible) {
                    this.customEnable.push(enable);
                } else {
                    this.customEnable.push(unEnable);
                }
            },
            // 获取场景音频信息
            getSceneAudio: function () {
                let data = [];
                // 目前有13中类型
                for (let i = 0; i < 27; i++) {
                    let scene = {
                        Scene: i,
                    };
                    data.push(scene);
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmAudio',
                        Type: 0,
                        Data: data,
                    })
                    .then((r) => {
                        if (r.Result == 0) {
                            this.scenes = [];
                            for (let i = 0; i < r.Data.length - 1; i++) {
                                let scene = r.Data[i];
                                if (scene.UseDefault == 0) {
                                    scene.DefaultText = this.cusotmoSelect;

                                }
                               // console.log(scene.Defined.Text);
                                //console.log(scene.Default[0].Text);
                                //console.log(scene.Default[1].Text);
                                console.log(scene.UseDefault);

                                if (scene.Result !== 0 || !this.customEnable[i] || (scene.UseDefault === 1 &&
                                        scene.DefaultText ===
                                        '')) {
                                    continue;
                                }
                                this.scenes.push(scene);
                            }
                        } else {
                            console.log(r);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            // 返回场景
            retText: function (scene) {
                let text = "";
                switch (scene) {
                    case 0:
                        text = this.lang.i18n_Traffic;
                        break;
                    case 1:
                        text = this.lang.i18n_Stranger;
                        break;
                    case 2:
                        text = this.lang.i18n_IdentityCard;
                        break;
                    case 3:
                        text = this.lang.i18n_AdminTraffic;
                        break;
                    case 4:
                        text = this.lang.i18n_AuthFail;
                        break;
                    case 5:
                        text = this.lang.i18n_CreditCardTips;
                        break;
                    case 6:
                        text = this.lang.i18n_HelmetTip;
                        break;
                    case 7:
                        text = this.lang.i18n_TempPrompt;
                        break;
                    case 8:
                        text = this.lang.i18n_TempHigh;
                        break;
                    case 9:
                        text = this.lang.i18n_TempFar;
                        break;
                    case 10:
                        text = this.lang.i18n_TempLow;
                        break;
                    case 11:
                        text = this.lang.i18n_MaskPrompt;
                        break;
                    case 12:
                        text = this.lang.i18n_ACFailed;
                        break;
                    case 13:
                        text = this.lang.i18n_StayStill;
                        break;
                    case 14:
                        text = this.lang.i18n_ScheduleFail;
                        break;
                    case 15:
                        text = this.lang.i18n_ScanCodeSuccess;
                        break;
                    case 16:
                        text = this.lang.i18n_ScanCodePrompt;
                        break;
                    case 17:
                        text = this.lang.i18n_HealthcodeError;
                        break;
                    case 18:
                        text = this.lang.i18n_QrCodeSuccess;
                        break;
                    case 19:
                        text = this.lang.i18n_HealthcodeUnmatch;
                        break;
                    case 20:
                        text = this.lang.i18n_WifiConnecting;
                        break;
                    case 21:
                        text = this.lang.i18n_WifiConnectOK;
                        break;
                    case 22:
                        text = this.lang.i18n_WifiConnectFailed;
                        break;
                    case 23:
                        text = this.lang.i18n_GroupOpen;
                        break;
                    case 24:
                        text = this.lang.i18n_GroupTimeout;
                        break;
                    case 25:
                        text = this.lang.i18n_ACUnmatched;
                        break;
                    default:
                        break;
                }
                return text;
            },
            // 试听
            listen: function (scene) {
                console.log("listen", scene.Scene);
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmAudio',
                        Type: 11,
                        Data: {
                            Scene: scene.Scene
                        },
                    }).then((response) => {
                        if (response.Result === 0) {
                        } else {
                            console.log(response);
                        }
                    });
            },

            // 设置按钮
            set: function (scene) {
                console.log(scene.DefaultText);
                // 设置为设备自带语音
                if (scene.DefaultText != this.cusotmoSelect) {
                    scene.UseDefault = 1;
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmAudio',
                            Type: 12,
                            Data: {
                                Scene: scene.Scene,
                                DefaultText: scene.DefaultText,
                            },
                        })
                        .then((response) => {
                            if (response.Result === 0) {
                                this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
                            } else {
                                 this.$notify.success(this.$store.getters.current_language['i18n_savefailed']);
                                console.log(response);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else if (scene.DefaultText == this.cusotmoSelect) {
                    scene.UseDefault = 0;
                    // 先把文字合成语音，调用阿里云的接口
                    let antsRequest = {
                        rate: "8000",
                        aue: "raw",
                        voice_name: "xiaoyan",
                        speed: "50",
                        volume: "100",
                        pitch: "50",
                        text: scene.Defined.Text,
                    };
                    let url = "http://www.antsvision.com:9999/voice";
                    this.$http
                        .post(url, antsRequest, )
                        .then((response) => {
                            if (parseInt(response.body.error_code) === 0) {
                                fetch(response.body.url)
                                    .then((res) => res.blob())
                                    .then((blob) => {
                                        this.importAudioConfirm(
                                            blob,
                                            scene.Defined.Text,
                                            scene.Scene
                                        );
                                    });
                            } else {
                                this.$notify.success(this.lang['i18n_getaudio_fail']);
                               
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            },
            // 导入音频弹窗
            importAudio: function (scene) {
                this.currentScene = scene.Scene;
                this.isShowImportAudio = true;
            },
            // 确认导入音频
            importAudioConfirm: function (audioData, text, scene) {
                if (audioData) {
                    const reader = new FileReader();
                    // FileReader.readAsDataURL读取文件之后是base64编码的字符串
                    reader.readAsDataURL(audioData);

                    let _this = this;
                    // 读取成功
                    reader.onload = (e) => {
                        let audioData = e.target.result;
                        audioData = audioData.substr(audioData.indexOf(",") + 1);

                        this.$store
                            .dispatch('request', {
                                url: 'goform/frmAudio',
                                Type: 99,
                                Data: [{
                                    Scene: scene,
                                    Text: text,
                                    VoiceName: "xiaoyan",
                                    Speed: 100,
                                    Volume: 100,
                                    Pitch: 50,
                                    AudioData: audioData,
                                }]

                            })
                            .then((response) => {
                                if (response.Result === 0) {
                                    this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
                                    _this.isShowImportAudio = false;
                                    _this.getSceneAudio();
                                } else {

                                    console.log(response);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    };
                    reader.onerror = (e) => {

                
                    };
                }
            },
        },
    };
</script>