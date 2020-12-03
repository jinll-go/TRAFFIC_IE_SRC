<template>
    <div class="main" style="width: 100%">
        <div class="main_fish">
            <div class="mainin_nl" :style="{ height: height(200), 'padding-left': '1px', 'margin-right': '400px'}">
                <div :style="{width: preview_width,height: preview_height, margin: '0 auto', 'margin-top': top_margin}">
                    <CVPlugin identity="face" type="PREVIEW" class="full"></CVPlugin>
                </div>
            </div>
            <div
                class="boot"
                :style="{
                    height: capture_flag ? '200px' : '10px',
                    width: '100%',
                    float: 'left',
                    'margin-right': comparison_flag ? '400px' : '10px',
                    overflow: 'hidden',
                    display: 'none'
                }"
            >
                <div style="width: 100%; height: 10px; float: left;cursor: pointer; display: none" @click="HideCapture">
                    <img
                        src="static/images/arrow-top.png"
                        :style="{ float: 'left', 'margin-left': '35%', height: '10px', transform: capture_flag ? 'rotate(180deg)' : '' }"
                    />
                </div>
                <div style="text-align: left;margin: 0 10px;height: 100%; display: none" v-show="capture_flag">
                    <div style="border-bottom: 1px solid #bbb;">
                        <strong v-tr="i18n_CaptureRecord"><!-- 抓拍记录 --></strong>
                    </div>
                    <div style="width: 100%;">
                        <canvas id="canvas_facecapture" width="1742" height="158"></canvas>
                        <!--                            <div style="margin: 10px;height: 150px;float: left;width: auto" v-for="item of $store.getters.face_list" :key="item.id">-->
                        <!--                                <img :src="item.data" style="height: 130px;width: auto;">-->
                        <!--                                &lt;!&ndash; <div style="margin-top:-10px">-->
                        <!--                                    <span >2019-08-26 16:45</span>-->
                        <!--                                </div> &ndash;&gt;-->
                        <!--                            </div>-->
                    </div>
                </div>
            </div>
        </div>
        <div
            class="right"
            :style="{
                height: height(),
                width: comparison_flag ? '400px' : '10px',
                'margin-left': comparison_flag ? '-400px' : '-10px',
                overflow: 'hidden',
                'background-color': bk_style,
            }"
        >
            <div :style="{ paddingTop: ComparisonHeight }" style="width: 10px; float: left;cursor: pointer" @click="HideComparison">
                <img src="static/images/arrow-left.png" :style="{ width: '10px', transform: comparison_flag ? 'rotate(180deg)' : '' }" />
            </div>
            <p style="border-bottom: 1px solid #bbb;margin-bottom: 10px;text-align: left;" v-show="comparison_flag">
                <strong v-tr="i18n_ComparisonRecord"><!-- 识别记录 --></strong>
            </p>
            <div style="float:left;width:380px;top:10px;" v-show="comparison_flag">
                <table cellpadding="0" cellspacing="0" border="2" style="width:100%; margin-bottom: 10px">
                    <tr style="text-align:center">
                        <td width="30%" v-tr="i18n_CapturePic"><!-- 抓拍图 --></td>
                        <td width="30%" v-tr="i18n_SamplePic"><!-- 样本图 --></td>
                        <td width="40%" v-tr="i18n_PersonInfo"><!-- 人员信息 --></td>
                    </tr>
                </table>
            </div>
            <div class="face-list" v-show="comparison_flag">
                <div style="float: left">
                    <canvas id="canvas_facecomparison" class="face_cmp_rightpanel" width="380" height="832"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
  //  import CVPlugin from 'components/activex/activex-wrapper.js';
    export default {
        name: 'CVIndexFaceView',
        data() {
            return {
                comparison_flag: true,
                capture_flag: false,
                // comparison_list: [],
                ctx_face: null,
                ctx_comparison: null,
                preview_width: 0,
                preview_height: 0,
                top_margin: 0,
            }
        },
        mounted() {
            this.ctx_face = document.getElementById('canvas_facecapture').getContext('2d'); //拿到要操作的canvas对象并渲染上下文
            this.ctx_comparison = document.getElementById('canvas_facecomparison').getContext('2d'); //拿到要操作的canvas对象并渲染上下文
            this.ctx_comparison.font = '12px Arial'; //设置字体属性
        },

        created() {
            let container_width = 1580 - 400;
            let container_height = 765;
            let ratio = {};
            let res_str = this.$store.getters.device_para.CurLocalRes;
            //解析分辨率800x1280-P60
            let ori_width = res_str.substring(0, res_str.indexOf('x'));
            ratio.num = ori_width;
            ori_width = ori_width > container_width ? container_width : ori_width;
            let ori_height = res_str.substring(res_str.indexOf('x')+1, res_str.indexOf('-'));
            ratio.den = ori_height;
            ori_height = ori_height > container_height ? container_height : ori_height;

            let display_width = ori_height * ratio.num/ratio.den > ori_width ? ori_width : ori_height * ratio.num/ratio.den;
            let display_height = ori_width * ratio.den/ratio.num > ori_height ? ori_height : ori_width * ratio.den/ratio.num;
            this.preview_width = display_width + 'px';
            this.preview_height = display_height + 'px';
            this.top_margin = ((container_height - display_height) / 2) + 'px';
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
            HideComparison() {
                this.comparison_flag = !this.comparison_flag;
            },
            HideCapture() {
                this.capture_flag = !this.capture_flag;
            },
        },

        computed: {
            ComparisonHeight() {
                return parseInt(this.height()) / 2 + 'px';
            },
            showComparison: {
                get: function() {
                    return this.$store.getters.preview.isShowComparisonOK;
                },
                set: function(v) {
                    this.$store.commit('preview/is_ShowComparison_OK', v);
                },
            },

            comparison_result() {
                return this.$store.getters.Face.face_compare_result;
            },
        },
        watch: {
            comparison_result(n) {
                //cap
                let imgData = this.ctx_face.getImageData(0, 0, 1742, 158);
                this.ctx_face.drawImage(n.capPic, 0, 20, 90, 130);
                this.ctx_face.putImageData(imgData, 110, 0);
                //cmp
                imgData = this.ctx_comparison.getImageData(0, 0, 380, 832);

                this.ctx_comparison.drawImage(n.capPic, 0, 0, 90, 130);
                this.ctx_comparison.drawImage(n.srcPic, 100, 0, 90, 130);
                this.ctx_comparison.fillStyle = '#575757';
                this.ctx_comparison.fillRect(200, 0, 170, 130);
                let similarity = this.lang.i18n_Face_Similary + ':' + n.similary;
                this.ctx_comparison.fillStyle = '#fff';
                this.ctx_comparison.fillText(similarity, 210, 50, 170);
                similarity = '';
                let name = this.lang.i18n_Face_Name + ':' + n.name;
                this.ctx_comparison.fillText(name, 210, 80, 170);
                name = '';
                let groupname = this.lang.i18n_listLibrary + ':' + n.groupname;
                this.ctx_comparison.fillText(groupname, 210, 110, 170);
                groupname = '';
                this.ctx_comparison.putImageData(imgData, 0, 140);
                imgData = null;
            },
        },
        components: {
            //    CVPlugin,
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
