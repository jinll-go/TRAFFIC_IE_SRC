<template>
    <div class="main_con clearfix" style="margin-top:100px">
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_P2PProtocol">P2P</label>
            </div>
        </div>

        <div class="main_con_mid">
            <!-- 协议名称 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_protocolName"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="protocolName" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>

            <!-- 启用 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_ProtocalEnable"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="enable" v-model="enable" />
                </div>
            </div>
            <!-- 报警推送 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_pushAlarm"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="checkbox" id="enableAlarmUpload" v-model="enableAlarmUpload" />
                </div>
            </div>
            <!-- 中心服务器地址 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_centerServerAddr"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="server" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>
            <!-- 设备ID -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_deviceId"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="serialNumber" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>
            <!-- 服务器连接状态 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_serverConnectState"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="status" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>
            <!-- P2P版本 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_P2PVersion"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="autoP2PVersion" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>
            <!-- autoupgrade版本 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_autoupgtadeVersion"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="autoUpgradeVersion" class="textc" style="width:200px;" />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>

            <!-- <div class="w100 pt5 text_center" style="width: 33%;" v-if="serialNumber">
                <div class="fl" style="width:50%" >
                     <img  src = "http://10.8.0.35/tmp/android_qr.bmp" alt="" style="width:106px;height:106px">
                </div>
                <div class="fl" style="width:50%" ><label>ID</label>&nbsp;</div>

                  <div class="fl" style="width:50%">
                     <img  src = "http://10.8.0.35/tmp/id_qr.bmp" alt="" style="width:106px;height:106px">
                </div>
                <div class="fl" style="width:50%"><label>ID</label>&nbsp;</div>
            </div> -->

            <!-- ipaddr代表设备网址，调试阶段网址为自己电脑ip所以不能显示图片 -->
            <div class="w100 pt5">
                <div class="w100 pt5 text_center" style="width: 50%;" v-if="!isAppleHide">
                    <div class="fl" style="width:100%">
                        <img :src="ipaddr + appleQrPath" style="width:106px;height:106px" />
                    </div>
                    <div class="fl" style="width:100%"><label>{{appleName}}</label>&nbsp;</div>
                </div>
                <div class="w100 pt5 text_center" style="width: 50%;" v-if="!isAndroidHide">
                    <div class="fl" style="width:100%">
                        <img :src="ipaddr + androidQrPath" style="width:106px;height:106px" />
                    </div>
                    <div class="fl" style="width:100%"><label>{{androidName}}</label>&nbsp;</div>
                </div>
                <div class="w100 pt5 text_center" style="width: 33%;" v-if="serialNumber">
                    <div class="fl" style="width:100%">
                        <img :src=" ipaddr + qrIdPath" style="width:106px;height:106px" />
                    </div>
                    <div class="fl" style="width:100%"><label>{{qrIdAlias}}</label>&nbsp;</div>
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
        name: "CVConfigP2PConfig",
        mixins: [style],
        data() {
            return {
                serialNumber: 0,
                protocolName: "",
                p2PDisplay: 0,
                enable: 0,
                server: "",
                enableAlarmUpload: 0,
                qrIdAlias: "",
                qrIdPath: "",
                appleName: "",
                appleQrPath: "",
                androidName: "",
                androidQrPath: "",
                isAppleHide: 0,
                isAndroidHide: 0,
                autoP2PVersion: "",
                autoUpgradeVersion: "",
                getData: {},
                status: "", //在线状态
                ipaddr: "",
            };
        },

        mounted() {

            this.ipaddr = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' +
                window.location.port : '');
            msg("addr", this.ipaddr);
            Promise.all([
                this.$store.dispatch('request', {
                    url: 'goform/frmDevicePara',
                    ch: 0,
                    Type: 0,
                    Data: {}
                }),

                this.$store.dispatch('request', {
                    url: 'goform/frmP2PPara',
                    ch: 0,
                    Type: 0,
                    Data: {}
                }),
                this.$store.dispatch('request', {
                    url: 'goform/frmP2PPara',
                    ch: 0,
                    Type: 3,
                    Data: {}
                }),

            ]).then((r) => {
                if (r[0].Result == -655365 || r[1].Result == -655365 || r[2].Result == -655365) {
                    this.$store.dispatch('config_no_right');
                } else {
                    if (r[0].Result == 0) {
                        this.serialNumber = r[0].Data.SerialNumber;
                    }
                    if (r[1].Result == 0) {
                        console.log("R1", r[1]);
                        this.getData = JSON.parse(JSON.stringify(r[1].Data))
                        this.protocolName = r[1].Data.ProtocolName;
                        this.p2PDisplay = r[1].Data.P2PDisplay;
                        this.enable = r[1].Data.Enable;
                        this.server = r[1].Data.Server;
                        if (this.server === "") {
                            this.server = this.lang.i18n_getData;
                        }
                        this.enableAlarmUpload = r[1].Data.EnableAlarmUpload;
                        this.qrIdAlias = r[1].Data.QrIdAlias;
                        this.qrIdPath = r[1].Data.QrIdPath;
                        this.appleName = r[1].Data.AppleName;
                        this.appleQrPath = r[1].Data.AppleQrPath;
                        this.androidName = r[1].Data.AndroidName;
                        this.androidQrPath = r[1].Data.AndroidQrPath;
                        this.isAppleHide = r[1].Data.IsAppleHide;
                        this.isAndroidHide = r[1].Data.IsAndroidHide;

                        this.autoP2PVersion = r[1].Data.AutoP2PVersion;
                        this.autoUpgradeVersion = r[1].Data.AutoUpgradeVersion;
                    }
                    if (r[2].Result == 0) {
                        this.status = (r[2].Data.Status > 0) ? this.lang.i18n_deviceOnline : this.lang
                            .i18n_deviceOffline;
                    }
                }
            }).catch((error) => {
                msg('Get  info failed!!');
            });
        },

        methods: {
            save() {
                this.getData.Enable = this.enable;
                this.getData.EnableAlarmUpload = this.enableAlarmUpload;

                console.log(this.getData);
                this.$store.dispatch("request", {
                    url: "goform/frmP2PPara",
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