<template>
    <div class="main" style="width: 100%;">
        <div class="main_fish">
            <!-- 视频流区域 -->
            <div class="mainin_nl" :style="{ height: height(200), 'padding-left': '1px', 'margin-right': comparison_flag ? '400px' : '10px' }">
                <CVPlugin identity="temperature" type="PREVIEW" class="full"></CVPlugin>
            </div>

            <!-- 底部抓拍记录 -->
            <div
                class="boot"
                :style="{
                    height: capture_flag ? '200px' : '10px',
                    width: '100%',
                    float: 'left',
                    'margin-right': comparison_flag ? '400px' : '10px',
                    overflow: 'hidden',
                }"
            >
                <div style="width: 100%; height: 10px; float: left; cursor: pointer;" @click="HideCapture">
                    <img
                        src="static/images/arrow-top.png"
                        :style="{ float: 'left', 'margin-left': '35%', height: '10px', transform: capture_flag ? 'rotate(180deg)' : '' }"
                    />
                </div>
                <!-- 抓拍记录 -->
                <div style="text-align: left; margin: 0 10px; height: 100%;" v-show="capture_flag">
                    <div style="border-bottom: 1px solid #bbb;">
                        <strong v-tr="i18n_CaptureRecord"><!-- 抓拍记录 --></strong>
                    </div>
                    <div style="width: 100%;">
                        <canvas id="cvs_temperature_cap" width="1710" height="158"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧的识别比对记录 -->
        <div
            v-if="is_facecompare"
            class="right"
            :style="{
                height: height(),
                width: comparison_flag ? '400px' : '10px',
                'margin-left': comparison_flag ? '-400px' : '-10px',
                overflow: 'hidden',
                'background-color': bk_style,
            }"
        >
            <div :style="{ paddingTop: ComparisonHeight }" style="width: 10px; float: left; cursor: pointer;" @click="HideComparison">
                <img src="static/images/arrow-left.png" :style="{ width: '10px', transform: comparison_flag ? 'rotate(180deg)' : '' }" />
            </div>

            <div style="float:left;width:380px;top:10px;" v-show="comparison_flag">
                <p style="border-bottom: 1px solid #bbb;margin-bottom: 10px;text-align: left;">
                    <strong v-tr="i18n_temperatureRecords"><!-- 测温记录 --></strong>
                </p>
                <table cellpadding="0" cellspacing="0" border="2" style="width: 100%; margin-bottom: 10px;">
                    <tr style="text-align: center;">
                        <td width="30%" v-tr="i18n_CapturePic"><!-- 抓拍图 --></td>
                        <td width="30%" v-tr="i18n_SamplePic"><!-- 样本图 --></td>
                        <td width="40%" v-tr="i18n_PersonInfo"><!-- 人员信息 --></td>
                    </tr>
                </table>

                <canvas id="cvs_temperature_compar" class="face_cmp_rightpanel" width="380" height="832"></canvas>
            </div>
        </div>
    </div>
</template>
<script>
    async function get_modal_picture() {
        alert(url);
        let data_base64 = await get_data_base64_from_url(url);
        return data_base64;
    }

  //  import CVPlugin from 'components/activex/activex-wrapper.js';
    export default {
        name: 'CVIndexTemperatureView',
        data() {
            return {
                comparison_flag: false,
                capture_flag: true,
                ctx_cap: null, //抓拍
                ctx_comparison: null, //比对
                current_language: this.$store.getters.base.selected_language == 'en',
                temperature_ctl: {},
            };
        },
        mounted() {
            this.ctx_cap = document.getElementById('cvs_temperature_cap').getContext('2d'); //抓拍canvas
            this.ctx_cap.font = '12px Arial';
            this.comparison_flag = this.is_facecompare;
            if (this.is_facecompare) {
                this.ctx_comparison = document.getElementById('cvs_temperature_compar').getContext('2d'); //比对canvas
                this.ctx_comparison.font = '12px Arial';
            }

            this.$store
            .dispatch('request', {
                url: 'goform/frmVideoFaceRecognitionPara',
                Type: 16,
                Data: {},
            })
            .then((r) => {
                if (r && r.Result == 0) {
                    this.temperature_ctl = r.Data;
                }
                return Promise.resolve();
            });
        },
        methods: {
            height(h = 0) {
                let hc = 0;
                if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                    hc = this.$store.getters.content_rect.height - 91 - 30 - 10 - 6 - 16 - h;
                } else {
                    hc = this.$store.getters.content_rect.height - 76 - h;
                }
                if (h) {
                    hc += this.capture_flag ? 0 : 190;
                }
                return hc + 'px';
            },
            HideCapture() {
                this.capture_flag = !this.capture_flag;
            },
            HideComparison() {
                this.comparison_flag = !this.comparison_flag;
            },
            trans_temperature(temp) {
                if (!this.temperature_ctl.SupportTempCheck)
                    return temp;
                let unit = this.temperature_ctl.TempFahEnable;
                if (unit == 1) {
                    return temp * 1.8 + 32;
                } else {
                    return temp;
                }
            },
            download_modal_picture(face_id) {
                let url = '';
                this.$store
                .dispatch('request', {
                    url: 'goform/frmFacePicture',
                    Type: 3,
                    Ch: 1,
                    Data: {
                        TargetName: '',
                        ParamMask: 1 << 3,
                        FaceId: face_id,
                        MatchType: 1,
                        Name: '',
                        ListType: 0,
                        ModelValid: 0,
                        Offset: 0,
                        Num: 1,
                    },
                })
                .then((r) => {
                    if (r && r.Result == 0) {
                        if (r.Data.FaceResults[0].dataType == 1) {
                            url = 'http://' + this.$store.getters.ip + '/' + r.Data.FaceResults[0].FaceData;
                            alert(url);
                            let data_base64 = get_modal_picture(url);
                            return Promise.resolve(data_base64);
                        }
                    }
                    
                });
            }
        },
        computed: {
            ComparisonHeight() {
                return parseInt(this.height()) / 2 + 'px';
            },

            temperature_compdata() {
                return this.$store.getters.temperature.comparedata;
            },

            temperature_capture() {
                return this.$store.getters.temperature.capturedata;
            },

            is_facecompare() {
                return true;
                return this.$UI.CVIndexTemperature.CVConfigFaceDB.visible && this.$UI.CVIndexTemperature.CVTempFaceQuery.visible;
            },
        },
        watch: {
            /**
             * 绘制抓拍图
             */
            temperature_capture: {
                handler(n) {
                    let tmpObj = {};
                    let tmpStr = '';
                    let maskFontColor = '';

                    let tempfontCol = !n.temp_valid && this.temperature_ctl.SupportTempCheck ? '#FF0033' : '#09F709';
                    if (n.emask == 0) {
                        tmpStr = this.lang.i18n_undetect;
                        maskFontColor = '#FFFFFF'; //不检测默认字体为白色
                    } else if (n.emask == 1) {
                        //不带口罩
                        tmpStr = this.lang.i18n_maskInvalid;
                        maskFontColor = '#FF0033'; //red
                    } else if (n.emask == 2) {
                        //戴口罩
                        tmpStr = this.lang.i18n_maskValid;
                        maskFontColor = '#09F709'; //green
                    }

                    tmpObj = {
                        detectResult: tmpStr,
                    };

                    //绘制抓拍图

                    let imgData = this.ctx_cap.getImageData(0, 0, 1710, 160);
                    this.ctx_cap.drawImage(n.capPic, 0, 10, 120, 120);

                    //绘制背景
                    let lx = 0;
                    this.ctx_cap.fillStyle = '#383838';
                    this.ctx_cap.fillRect(0, 130, 120, 50);
                    if (this.temperature_ctl.SupportTempCheck) {
                        //绘制 温度/口罩状态
                        let tmp_str = n.temp_enable ? this.trans_temperature(n.temp).toFixed(1) : n.temp.toFixed(1);

                        let temperature = this.current_language ? tmp_str : this.lang.i18n_temperature + ':' + tmp_str;

                        let w1 = this.ctx_cap.measureText(temperature).width;

                        let splitstr = '/';
                        let w2 = this.ctx_cap.measureText(splitstr).width + 3;

                        // 绘制分隔符
                        let star_val = this.current_language ? 42 : 55;
                        this.ctx_cap.beginPath();
                        this.ctx_cap.lineWidth = 0.5;
                        this.ctx_cap.strokeStyle = '#FFFFFF';
                        this.ctx_cap.moveTo(star_val, 130);
                        this.ctx_cap.lineTo(star_val, 142);
                        this.ctx_cap.stroke();

                        let whetherMask = this.current_language ? tmpObj.detectResult : this.lang.i18n_mask + ':' + tmpObj.detectResult;
                        let w3 = this.ctx_cap.measureText(whetherMask).width;
                        //let lx = (120 - (w1 + w2 + w3)) / 2;
                        lx = (120 - (w1 + w2 + w3)) / 2;
                        this.ctx_cap.fillStyle = tempfontCol;
                        this.ctx_cap.fillText(temperature, lx, 140);
                        // this.ctx_cap.fillStyle = '#FFFFFF';
                        //	this.ctx_cap.fillText(splitstr, lx + w1, 140);
                        this.ctx_cap.fillStyle = maskFontColor;
                        this.ctx_cap.fillText(whetherMask, lx + w1 + w2, 140);
                    }
                    
                    //绘制抓拍时间
                    let dt = new Date(n.capture_time * 1000).format('yyyy-MM-dd hh:mm:ss');
                    let w4 = this.ctx_cap.measureText(dt).width;
                    lx = (120 - w4) / 2;
                    this.ctx_cap.fillStyle = '#FFFFFF';
                    this.ctx_cap.fillText(dt, lx, 155);
                    //绘制剩余偏移的画布数据
                    this.ctx_cap.putImageData(imgData, 130, 0);
                    imgData = null;
                },

                deep: true,
            },
            temperature_compdata: {
                handler(n) {
                     if (n.open_type == 1 || n.open_type == 2) {
                        if (n.have_modal == false) {
                            n.srcPic = this.download_modal_picture(n.normal_info.face_id);
                            n.have_modal = true;
                        }
                     }
                    // 绘制比对
                    let compare_imgData = this.ctx_comparison.getImageData(0, 0, 380, 832);
                    this.ctx_comparison.drawImage(n.capPic, 0, 0, 90, 130);
                    this.ctx_comparison.drawImage(n.srcPic, 100, 0, 90, 130);
                    this.ctx_comparison.fillStyle = '#383838';
                    this.ctx_comparison.fillRect(200, 0, 170, 130);

                    this.ctx_comparison.fillStyle = '#fff';
                    let tempfontCol = !n.temp_valid && this.temperature_ctl.SupportTempCheck ? '#FF0033' : '#09F709';
                    let y_pos = 20;

                    if (n.open_type == 1 || n.open_type == 2) {
                        if (n.have_modal) {
                            // 相似度
                            let similarity = this.lang.i18n_Face_Similary + ':' + n.similarity;
                            this.ctx_comparison.fillText(similarity, 210, y_pos, 170);
                            similarity = '';
                            y_pos += 20;

                            // 姓名
                            let name = this.lang.i18n_Face_Name + ':' + n.normal_info.name;
                            this.ctx_comparison.fillText(name, 210, y_pos, 170);
                            name = '';
                            y_pos += 20;

                            // 描述
                            let describe = this.lang.i18n_face_describe + ':' + n.normal_info.describe;
                            this.ctx_comparison.fillText(describe, 210, y_pos, 170);
                            describe = '';
                            y_pos += 20;

                            // 组名
                            let groupname = this.lang.i18n_face_group + ':' + n.normal_info.grp_name;
                            this.ctx_comparison.fillText(groupname, 210, y_pos, 170);
                            groupname = '';
                            y_pos += 20;

                            // 名单类型
                            let list_type = '';
                            if (n.normal_info.type == 1) {
                                list_type = this.lang.i18n_face_white;
                            } else if (n.normal_info.type == 4) {
                                list_type = this.lang.i18n_face_visit;
                            } else {
                                list_type = this.lang.i18n_face_black;
                            }
                            list_type = this.lang.i18n_face_list + ':' + list_type;
                            this.ctx_comparison.fillText(list_type, 210, y_pos, 170);
                            list_type = '';
                            y_pos += 20;
                        }
                    } else if (n.open_type == 4) {
                        // 相似度
                        let similarity = this.lang.i18n_Face_Similary + ':' + n.similarity;
                        this.ctx_comparison.fillText(similarity, 210, y_pos, 170);
                        similarity = '';
                        y_pos += 20;

                        // 姓名
                        let name = this.lang.i18n_Face_Name + ':' + n.identity_info.name;
                        this.ctx_comparison.fillText(name, 210, y_pos, 170);
                        name = '';
                        y_pos += 20;

                        // 性别
                        let gender = this.lang.i18n_face_gender + ':' + n.identity_info.gender;
                        this.ctx_comparison.fillText(gender, 210, y_pos, 170);
                        gender = '';
                        y_pos += 20;

                        let national = this.lang.i18n_face_national + ':' + n.identity_info.national;
                        this.ctx_comparison.fillText(national, 210, y_pos, 170);
                        national = '';
                        y_pos += 20;
                    } else {
                        let date_time = new Date(n.capture_time * 1000).format('yyyy-MM-dd hh:mm:ss');
                        date_time = this.lang.i18n_face_capture_time + ':' + date_time;
                        this.ctx_comparison.fillText(date_time, 210, y_pos, 170);
                        date_time = '';
                        y_pos += 20;
                    }
                    
                    let temperature;
                    if (this.temperature_ctl.SupportTempCheck) {
                        if (n.temp_type != 0) {
                            if (n.temp_type == 2) {
                                temperature = this.lang.i18n_temperature + ':' + this.trans_temperature(n.temp).toFixed(1);
                            } else {
                                temperature = this.lang.i18n_face_get_temp_failed;
                            }
                        } else {
                            temperature = this.lang.i18n_face_temperature_no_detect;
                        }
                        
                        this.ctx_comparison.fillStyle = tempfontCol;
                        this.ctx_comparison.fillText(temperature, 210, y_pos, 170);
                        temperature = '';
                        y_pos += 20;
                        
                        // // 口罩状态
                        // whetherMask = this.lang.i18n_mask + ':' + tmpObj.detectResult;
                        // // this.ctx_comparison.fillStyle = tempfontCol;
                        // this.ctx_comparison.fillStyle = maskFontColor;
                        // this.ctx_comparison.fillText(whetherMask, 210, y_pos, 170);
                        // whetherMask = '';
                        // y_pos += 20;
                    }

                    this.ctx_comparison.putImageData(compare_imgData, 0, 140);
                    compare_imgData = null;
                },

                deep: true,
            },
        },
        components: {
            //       CVPlugin,
        },
    };
</script>

<style scoped>
    .face-list {
        width: 380px;
        height: 100%;
        list-style: none;
        margin: 10px;
    }

    .item-face {
        width: 400px;
        height: 150px;
    }

    .face-item {
        border: 1px solid yellow;
        background-color: #5d5d5d;
    }

    .item-show {
        /*border: 1px solid green;*/
        height: 150px;
        width: 220px;
        float: left;
    }

    .item-left {
        float: left;
        width: 105px;
        height: 150px;
        padding-top: 2px;
        /*border: 1px solid green;*/
    }

    .item-right {
        float: right;
        width: 105px;
        height: 130px;
        padding-top: 2px;
        /*border: 1px solid green;*/
    }

    .item-info {
        width: 160px;
        height: 90px;
        float: left;
        margin: 20px 0;
        /*border: 1px solid burlywood;*/
    }

    .lb-left {
        float: left;
        width: 60px;
    }

    .lb-right {
        float: left;
        width: 100px;
    }

    .face-similar {
        font: 20px bold;
        color: #2fb6c9;
        margin: 0;
    }

    .item-footer {
        border: 1px solid;
    }
    .boot {
        /*background-color: #0A2E65;*/
    }
</style>
