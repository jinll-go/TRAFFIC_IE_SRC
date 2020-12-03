<template>
    <div class="main_con clearfix" style="margin-top:100px">
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_Osd">OSD</label>
            </div>
        </div>
        <div class="main_con_mid">
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_showName"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="showName" v-model="isShowChannelName" />
                </div>
            </div>
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_osdName"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="channelName" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>

            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_timeAndDate"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="timeAndDate" v-model="isShowTimeDate" />
                </div>
            </div>
            <!-- 日期时间size选择 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_dateFormat"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <select class="textc" style="width:200px;" v-model="hour_osd_type">
                        <option :value="0" v-tr="i18n_12hour"></option>
                        <option :value="1" v-tr="i18n_24hour"></option>
                    </select>
                </div>
            </div>

            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_timeFormat"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <select class="textc" style="width:200px;" v-model="date_osd_type">
                        <option :value="0" v-tr="i18n_mdy"></option>
                        <option :value="1" v-tr="i18n_ymd"></option>
                        <option :value="2" v-tr="i18n_dmy"></option>
                    </select>
                </div>
            </div>
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_osdname"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <select class="textc" style="width:200px;" v-model="osd_size">
                        <option :value="0">12</option>
                        <option :value="1">18</option>
                        <option :value="2">24</option>
                        <option :value="3">36</option>
                        <option :value="4">48</option>
                    </select>
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
        name: "CVConfigOSDConfig",
        mixins: [style],
        data() {
            return {
                isShowChannelName: true,
                isShowTimeDate: true,
                hour_osd_type: 0,
                date_osd_type: 0,
                osd_size: 12,
                channelName: "",
                getData: {},
            };
        },

        mounted() {
            this.getOSD();

        },

        methods: {
            getOSD: function () {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmSingleLineOSD',
                        Type: 0,
                        Data: {},
                    })
                    .then((r) => {
                        if (r.Result === 0) {
                            msg("OSD:", r);
                            this.getData = JSON.parse(JSON.stringify(r.Data))
                            let osd = r.Data.OSD
                            this.isShowChannelName = osd.IsShowChanName //是否显示Osd
                            this.channelName = osd.ChanName
                            this.isShowTimeDate = osd.IsDisplayWeek
                            this.hour_osd_type = osd.OSDHourType
                            this.date_osd_type = osd.OSDType
                            this.osd_size = osd.MainOSDSize


                        } else {
                            this.$store.dispatch('config_no_right');
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        msg('Get frmSingleLineOSD info failed!!');
                    });
            },

            save() {
                console.log("save___osd");
                this.getData.OSD.IsShowChanName = 0;
                if (this.isShowChannelName) {
                    this.getData.OSD.IsShowChanName = 1;
                }
                this.getData.OSD.IsDisplayWeek = 0
                if (this.isShowTimeDate) {
                    this.getData.OSD.IsDisplayWeek = 1;
                }

                this.getData.OSD.MainOSDSize = this.osd_size;
                this.getData.OSD.ChanName = this.channelName;
                this.getData.OSD.OSDHourType = this.hour_osd_type;
                this.getData.OSD.OSDType = this.date_osd_type;

                console.log(this.getData);
                this.$store.dispatch("request", {
                    url: "goform/frmSingleLineOSD",
                    Type: 1,
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