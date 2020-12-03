<template>
    <div class="main_con clearfix" style="margin-top:100px">
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_videoManagement">TF¿¨</label>
            </div>
        </div>
        <div class="main_con_mid_ss">
            <div class="w100 pt5">
                <div class="fl text_right" style="width:20%"><label v-tr="i18n_videotape"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="showName" v-model="enableTraffic" />
                </div>
            </div>
            <div class="w100 pt5">
                <div class="fl text_right" style="width:20%"><label v-tr="i18n_trafficRecord"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="timeAndDate" v-model="enableRec" />
                </div>
            </div>

            <div class="w100 pt5">
                <div class="td_bg pl10"><label v-tr="i18n_tfCard"></label></div>
            </div>

            <div class="w100 mt10">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="_table">
                    <tr>
                        <th class="_th text_center" style="width: 20%"><label v-tr="i18n_tfState"></label></th>

                        <th class="_th text_center" style="width: 20%"><label v-tr="i18n_tfUsed"></label></th>
                        <th class="_th text_center" style="width: 20%"><label v-tr="i18n_tfAvailable"></label></th>


                        <th class="_th text_center" style="width: 20%"><label v-tr="i18n_tfAll"></label></th>
                        <th class="_th text_center" style="width: 20%"><label v-tr="i18n_utilizationRate"></label></th>
                    </tr>
                    <tr v-for="(item, idx) in list" :key="idx">
                        <td class="_td text_center">
                            <label> {{item.state}}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{item.Capacity-item.FreeSpace}}MB</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{item.FreeSpace}}MB</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{item.Capacity}}MB</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{((item.Capacity-item.FreeSpace)/item.Capacity*100).toFixed(0)}}%</label>
                        </td>
                    </tr>
                </table>

            </div>

            <div class="w100 pt10 text_center">
                <div class="f1 text_center">
                    <button :class="button_style" style="margin-left: 10px; width:60px;" v-tr="i18n_refresh"
                        @click="refresh"></button>


                    <button :class="button_style" style="margin-left: 10px; width:60px;" v-tr="i18n_save"
                        @click="save"></button>

                    <button :class="button_style" style="margin-left: 10px; width:60px;" v-tr="i18n_format"
                        @click="format"></button>
                </div>
            </div>
        </div>
        <div class="main_con_bot"></div>
    </div>

</template>
<script>
    import style from 'mixin/style';

    export default {
        name: "CVConfigTFCard",
        mixins: [style],
        data() {
            var timer;
            return {
                enableRec: true,
                enableTraffic: true,
                getData: {},
                list: [],
                d: {},
            };
        },

        mounted() {
            this.getTFCatd();
        },

        methods: {
            getTFCatd() {
                Promise.all([
                    this.$store.dispatch('request', {
                        url: 'goform/frmVideoPlanPara',
                        ch: 1,
                        Type: 4,
                        Data: {}
                    }),
                    this.$store.dispatch('request', {
                        url: 'goform/frmGetHDInfo',
                        ch: 1,
                        Type: 0,
                        Data: {}
                    })
                ]).then((r) => {
                    msg("getTFCatd");
                    if (r[0].Result == -655365 || r[1].Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (r[0].Result == 0) {
                            this.getData = JSON.parse(JSON.stringify(r[0].Data))
                            this.enableRec = r[0].Data.EnableRec;
                            this.enableTraffic = r[0].Data.EnableTraffic;
                        }
                        if (r[1].Result == 0) {
                            this.d = r[1].Data;
                            this.list = [];
                            for (let i = 0; i < this.d.HDInfoList.length; i++) {
                                if (this.d.HDInfoList[i].IsLocal == 0 && this.d.HDInfoList[i].HDNo > 0) {
                                    msg("push");
                                    switch (this.d.HDInfoList[i].HdStatus) {
                                        case 0:
                                            this.d.HDInfoList[i].state = this.lang.i18n_unkonw;
                                            break;
                                        case 4:
                                            this.d.HDInfoList[i].state = this.lang.i18n_needFormat;
                                            break;
                                        case 5:
                                            this.d.HDInfoList[i].state = this.lang.i18n_abnormal;
                                            break;
                                        case 6:
                                            this.d.HDInfoList[i].state = this.lang.i18n_normal;
                                            break;
                                        case 10:
                                            this.d.HDInfoList[i].state = this.lang.i18n_formating;
                                            break;
                                        default:
                                            this.d.HDInfoList[i].state = this.lang.i18n_unkonw;
                                            break;
                                    }
                                    this.list.push(this.d.HDInfoList[i]);
                                }
                            }
                        }
                    }
                }).catch((error) => {
                    msg('Get  info failed!!');
                });
            },
            save() {
                this.getData.EnableRec = this.enableRec;
                this.getData.EnableTraffic = this.enableTraffic;
                this.$store.dispatch("request", {
                    url: "goform/frmVideoPlanPara",
                    Type: 5,
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
            refresh() {
                this.getTFCatd();
            },
            format() {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmHDFormat',
                        Type: 0,
                        Data: {
                            FormatNum: 1,
                            FormatList: [{
                                DiskType: this.list[0].DiskType,
                                DiskId: this.list[0].DiskId,
                            }]
                        },
                    })
                    .then((r) => {
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
                    .catch((error) => {
                        console.log(error);
                        msg('Get frmSingleLineOSD info failed!!');
                    });

                     this.timer = setInterval(() => {
                             this.getTFCatd();
                            }, 4000);
            },
        },
        beforeDestroy(){
            msg("beforeDestroy");
            clearInterval(this.timer);
        }
    };
</script>