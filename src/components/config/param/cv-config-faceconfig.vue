<template>
    <div class="main_con clearfix" style="margin-top:100px">
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_FaceDetect">人脸检测</label>
            </div>
        </div>

        <div class="main_con_mid">
            <!-- 相似度 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_similarity"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input class="fl" type="range" v-model="similarity" step="1" max="100" min="0"
                        :style="'background-size: ' + similarity + '% 100%'" />
                    <span class="fl">{{similarity}}</span>
                </div>
            </div>
            <!-- 人脸打分阀值 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_faceConfidence"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input class="fl" type="range" v-model="threshold" step="1" max="100" min="0"
                        :style="'background-size: ' + threshold + '% 100%'" />
                    <span class="fl">{{threshold}}</span>
                </div>
            </div>
            <!-- 活体检测 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_bioassay"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="timeAndDate" v-model="isDetection" />
                </div>
            </div>
            <!-- 活体检测宽容度 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_bioassayPercent"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input class="f1" :disabled="!isDetection" type="range" v-model="detectionWidth" step="1" max="100"
                        min="0" :style="'background-size: ' + detectionWidth + '% 100%'" />
                    <span class="f1">{{detectionWidth}}</span>
                </div>
            </div>

            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_trafficInterval"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input class="f1" type="range" v-model="passInterval" step="1" max="300" min="0"
                        :style="'background-size: ' + passInterval/3 + '% 100%'" />
                    <span class="f1">{{passInterval}}s</span>
                </div>
            </div>
            <!--去重间隔  -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_dedupliInterval"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input class="f1" type="range" v-model="removeInterval" step="1" max="300" min="0"
                        :style="'background-size: ' + removeInterval/3 + '% 100%'" />
                    <span class="f1">{{removeInterval}}s</span>
                </div>
            </div>
            <!-- 启用安全帽检测 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_enableHelmet"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="timeAndDate" v-model="isSafetyHelmet" />
                </div>
            </div>
            <!-- 安全帽通行 -->
            <div class="w100 pt5" v-show="showTrafficHelmet">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_trafficHelmet"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="timeAndDate" v-model="isSafetyHelmetPass" />
                    <span class="f1" v-tr="i18n_trafficHelmetHint"></span>

                </div>
            </div>

            <!-- 口罩检测 -->
            <div class="w100 pt5" v-show="showDetectMask">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_detectMask"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="timeAndDate" v-model="isDetectMask" />

                </div>
            </div>
            <!-- 口罩通行 -->
            <div class="w100 pt5" v-show="showDetectMask">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_trafficEmask"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="timeAndDate" v-model="isTrafficEmask" />
                    <span class="f1" v-tr="i18n_trafficEmaskHint"></span>
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
        name: "CVConfigFaceDetect",
        mixins: [style],
        data() {
            return {

                similarity: 0,
                threshold: 0,
                isDetection: false,
                detectionWidth: 0,
                passInterval: 0,
                removeInterval: 0,
                isSafetyHelmet: false,
                isSafetyHelmetPass: false,
                isDetectMask: false,
                isTrafficEmask: false,
                get_similarity: 0,
                get_threshold: 0,
                get_isDetection: false,
                get_detectionWidth: 0,
                get_passInterval: 0,
                get_removeInterval: 0,
                get_isSafetyHelmet: false,
                get_isSafetyHelmetPass: false,
                get_isDetectMask: false,
                get_isTrafficEmask: false,
                showDetectMask: true,
                showTrafficHelmet: true,
            };
        },

        created() {

            // 获取对比相似度
            this.getSimilarity()
            // 获取人脸打分阈值
            this.getConfidence()
            // 获取活体检测开关
            this.getBioassay()
            // 获取开门间隔时间
            this.getTrafficInterval()
            // 获取去重间隔时间
            this.getDedupliInterval()
            // 获取安全帽参数
            this.getHelmet()
            // 获取口罩检测参数
            this.getMaskDetect()
        },

        methods: {
            getSimilarity: function () {

                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 1,
                        Data: {

                        },
                    })
                    .then(response => {
                        if (response.Result === 0) {
                            this.similarity = response.Data.Similarity
                            this.get_similarity = this.similarity
                        } else {
                            console.log(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            // 设置对比相似度
            setSimilarity: function () {
                // 如果没有发生改变，直接退出
                if (this.similarity === this.get_similarity) {
                    return
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 0,
                        Data: {
                            Similarity: parseInt(this.similarity),
                        },
                    }).then(response => {
                        if (response.Result === 0) {
                            this.get_similarity = this.similarity

                        } else {
                            this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
                            console.log(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            // 获取人脸打分阈值
            getConfidence: function () {
                   this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 4,
                        Data: {

                        },
                    })
                    .then(response => {
                    if (response.Result === 0) {
                        this.threshold = response.Data.confidence
                        this.get_threshold = this.threshold
                    } else {
                        console.log(response)
                    }
                }).catch(error => {
                    console.log(error)
                })
            },
            // 设置人脸打分阈值
            setConfidence: function () {
                if (this.threshold === this.get_threshold) {
                    return
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 5,
                        Data: {
                            confidence: parseInt(this.threshold),
                        },
                    }).then(response => {
                        if (response.Result === 0) {
                            this.get_threshold = this.threshold
                        } else {
                              this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
                            console.log(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            // 获取活体检测开关
            getBioassay: function () {

                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 3,
                        Data: {

                        },
                    }).then(response => {
                        if (response.Result === 0) {
                            this.isDetection = response.Data.Open
                            this.detectionWidth = response.Data.Percent
                            this.get_isDetection = this.isDetection
                            this.get_detectionWidth = this.detectionWidth
                        } else {
                            console.log(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            // 设置活体检测开关
            setBioassay: function () {
                if (this.get_isDetection === this.isDetection && this.get_detectionWidth === this.detectionWidth) {
                    return
                }

                let open = 0
                if (this.isDetection) {
                    open = 1
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 2,
                        Data: {
                            Open: parseInt(open),
                            Percent: parseInt(this.detectionWidth)
                        },
                    }).then(response => {

                        if (response.Result === 0) {
                            this.get_isDetection = this.isDetection
                            this.get_detectionWidth = this.detectionWidth
                        } else {
                            this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
                            console.log(response)
                        }
                    }).catch(error => {

                        console.log(error)
                    })
            },
            // 获取开门间隔时间
            getTrafficInterval: function () {

                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 8,
                        Data: {},
                    }).then(response => {
                        if (response.Result === 0) {
                            this.passInterval = response.Data.trafficInterval
                            this.get_passInterval = this.passInterval
                        } else {
                            console.log(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            // 设置开门间隔时间
            setTrafficInterval: function () {
                if (this.get_passInterval === this.passInterval) {
                    return
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 9,
                        Data: {
                            trafficInterval: parseInt(this.passInterval)
                        },
                    }).then(response => {
                        if (response.Result === 0) {
                            this.get_passInterval = this.passInterval
                        } else {
                            this.$notify.error(this.$store.getters.current_language["i18n_savefailed"])
                            console.log(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            // 获取去重间隔时间
            getDedupliInterval: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 10,
                        Data: {

                        },
                    }).then(response => {
                        if (response.Result === 0) {
                            this.removeInterval = response.Data.dedupliInterval
                            this.get_removeInterval = this.removeInterval
                        } else {
                            console.log(response)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
            },
            // 设置去重间隔时间
            setDedupliInterval: function () {
                if (this.get_removeInterval === this.removeInterval) {
                    return
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 11,
                        Data: {
                            dedupliInterval: parseInt(this.removeInterval)
                        },
                    }).then(response => {
                        if (response.Result === 0) {
                            this.get_removeInterval = this.removeInterval
                        } else {
                           this.$notify.error(this.$store.getters.current_language["i18n_savefailed"])
                            console.log(response)
                        }
                    }).catch(error => {

                        console.log(error)
                    })
            },
            // 获取安全帽参数
            getHelmet: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 13,
                        Data: {

                        },
                    }).then(response => {
                        if (response.Result === 0) {
                            this.showTrafficHelmet = true
                            this.isSafetyHelmet = response.Data.EnableHelmet
                            this.isSafetyHelmetPass = response.Data.TrafficHelmet
                            this.get_isSafetyHelmet = this.isSafetyHelmet
                            this.get_isSafetyHelmetPass = this.isSafetyHelmetPass
                        } else {
                            this.showTrafficHelmet = false
                            console.log(response)
                        }
                    }).catch(error => {
                        this.showTrafficHelmet = false
                        console.log(error)
                    })
            },
            // 设置安全帽参数
            setHelmet: function () {
                if (this.get_isSafetyHelmet === this.isSafetyHelmet && this.get_isSafetyHelmetPass === this
                    .isSafetyHelmetPass) {
                    return
                }

                let enableHelmet = 0
                let trafficHelmet = 0
                if (this.isSafetyHelmet) {
                    enableHelmet = 1
                }
                if (this.isSafetyHelmetPass) {
                    trafficHelmet = 1
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 12,
                        Data: {
                            EnableHelmet: parseInt(enableHelmet),
                            TrafficHelmet: parseInt(trafficHelmet)
                        },
                    }).then(response => {

                        if (response.Result === 0) {

                            this.get_isSafetyHelmet = this.isSafetyHelmet
                            this.get_isSafetyHelmetPass = this.isSafetyHelmetPass

                        } else {
                            console.log(response)
                        }
                    }).catch(error => {

                        console.log(error)
                    })
            },
            // 获取口罩检测
            getMaskDetect: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 23,
                        Data: {

                        },
                    }).then(response => {

                        if (response.Result === 0) {
                            this.isDetectMask = response.Data.EnableEmask
                            this.get_isDetectMask = this.isDetectMask
                            this.isTrafficEmask = response.Data.TrafficEmask
                            this.get_isTrafficEmask = this.isTrafficEmask
                            this.showDetectMask = true
                        } else {
                            this.showDetectMask = false
                            console.log(response)
                        }
                    }).catch(error => {
                        this.showDetectMask = false
                        console.log(error)
                    })
            },
            // 设置口罩检测参数
            setMaskDetect: function () {
                if (this.get_isDetectMask === this.isDetectMask &&
                    this.get_isTrafficEmask === this.isTrafficEmask) {
                    return
                }

                let trafficEmask = 0
                let enableEmask = 0
                if (this.isTrafficEmask) {
                    trafficEmask = 1
                }
                if (this.isDetectMask) {
                    enableEmask = 1
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoFaceRecognitionPara',
                        Type: 22,
                        Data: {
                            EnableEmask: parseInt(enableEmask),
                            TrafficEmask: parseInt(trafficEmask)
                        },
                    }).then(response => {

                        if (response.Result === 0) {
                            this.get_isDetectMask = this.isDetectMask
                            this.get_isTrafficEmask = this.isTrafficEmask

                        } else {
                             this.$notify.error(this.$store.getters.current_language["i18n_savefailed"])
                            console.log(response)
                        }
                    }).catch(error => {

                        console.log(error)
                    })
            },
            // 保存
            save: function () {
                if (this.similarity === this.get_similarity && this.threshold === this.get_threshold &&
                    this.isDetection === this.get_isDetection && this.detectionWidth === this.get_detectionWidth &&
                    this.passInterval === this.get_passInterval && this.removeInterval === this
                    .get_removeInterval &&
                    this.isSafetyHelmet === this.get_isSafetyHelmet && this.isSafetyHelmetPass === this
                    .get_isSafetyHelmetPass &&
                    this.isDetectMask === this.get_isDetectMask && this.get_isTrafficEmask === this.isTrafficEmask
                ) {
                   this.$notify.success(this.$store.getters.current_language["i18n_saveok"]);
                   return;
                }
                this.setSimilarity()
                this.setConfidence()
                this.setBioassay()
                this.setTrafficInterval()
                this.setDedupliInterval()
                this.setHelmet()
                this.setMaskDetect()
                this.$notify.success(this.$store.getters.current_language["i18n_saveok"]);
            }
        }
    }
</script>