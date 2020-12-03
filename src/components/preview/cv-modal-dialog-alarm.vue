<template>
    <div class="main bkcolor">
        <div class="main_mid_2" style=" overflow: auto">
            <div class="main_con clearfix" style="margin-top: 100px">
                <!--标题-->
                <div class="main_con_top">
                    <div class="fl pl10 bold">
                        <label v-tr="i18n_alarmInfo"></label>
                    </div>
                </div>
                <!--内容-->
                <div class="main_con_mid" id="alarm_content">
                    <!--
					<table class="_table text_center" cellpadding="0" cellspacing="0" border="0" style=" margin:auto; padding:auto; width:98%; height:98%;">
						<thead>
						<tr>
							<th class="_th" v-tr="i18n_channel"></th>
							<th class="_th" v-tr="i18n_eventType"></th>
							<th class="_th" v-tr="i18n_beginTime"></th>
							<th class="_th" v-tr="i18n_endTime"></th>
							<th class="_th" v-tr="i18n_status"></th>
						</tr>
						</thead>
						<tbody id="tbody_alarm"></tbody>

					</table>

					<div class="w100 pt10 text_center">
						<button class="btn1" style="width:88px;" v-tr="i18n_clearAlarm" v-if="false" @click="clear"></button> &nbsp;
						<button class="btn1" style="width:88px;" v-tr="i18n_exit" v-if="false" @click="exit"></button> &nbsp;
                    </div>-->
                </div>
                <!--底部-->
                <div class="main_con_bot"></div>
            </div>
        </div>
    </div>
</template>

<script>
    let trans_method = null;
    const ch_region = ['CounterWire', 'DetectWire', 'DetectRegion', 'ObjectRegion', 'Retrograde', 'HighDensity', 'DetectAbsent'];
    export default {
        name: 'CVModalDialogAlarmList',
        mounted() {
            //绑定解析函数

            trans_method = this[`${this.plugin_type}_trans_info`];

            this.CheckAlarmList([]);
        },
        methods: {
            CheckAlarmList(list) {
                //IE9 tablede innerHTML 是readonly的.操作会直接报错
                let time = new Date().getTime();

                let header_str = ` <table class="_table text_center" cellpadding="0" cellspacing="0" border="0" style=" margin:auto; padding:auto; width:98%; height:98%;">
                        <thead>
                            <tr>
                                <th class="_th" >${this.lang.i18n_channel}</th>
                                <th class="_th" >${this.lang.i18n_eventType}</th>
                                <th class="_th" >${this.lang.i18n_beginTime}</th>
                                <th class="_th" >${this.lang.i18n_endTime}</th>
                                <th class="_th" >${this.lang.i18n_status}</th>
                            </tr>
    		</thead>`;
                let footer = `</table>`;

                let table_text = '';
                if (list.length) {
                    let show_alarm_list = list.filter((item) => {
                        return item.current_time > time - 5000;
                    });

                    show_alarm_list.forEach((item) => {
                        let info = trans_method(item);
                        if (info.Topic) {
                        table_text +=
                            `<tr><td class="_td">${info.Ch}</td>` +
                            `<td class="_td">${info.Topic}</td>` +
                            `<td class=\"_td\">${info.StartTime}</td>` +
                            `<td class="_td">${info.StopTime}</td>` +
                            `<td class="_td">${info.Status}</td></tr>`;
                        }
                    });
                }
                document.getElementById('alarm_content').innerHTML = header_str + table_text + footer;

                time = null;
            },
            ie_trans_info(obj) {
                return {
                    Ch: this.ie_trans_ch(obj),
                    Topic: this.ie_trans_topic(obj),
                    StartTime: obj.utc_start,
                    StopTime: obj.utc_stop,
                    Status: this.ie_trans_status(obj),
                };
            },
            flash_trans_info(obj) {
                return this.ie_trans_info(obj);
            },
            h5_trans_info(obj) {
                return {
                    Ch: this.h5_trans_ch(obj),
				Topic: this.h5_trans_topic(obj),
                    StartTime: obj.StartTime,
                    StopTime: obj.StopTime,
                    Status: this.h5_trans_status(obj),
                };
            },
            ///////////////////////////////////
            ie_trans_ch(obj) {
                return obj.ch;
            },
            ie_trans_topic(obj) {
                let lang = this.lang;

                let index = obj.topic.lastIndexOf('/');
                let tempId = obj.topic.substr(index + 1);

                //报警输入处理
                if (obj.InputToken) {
                    tempId = 'InputToken';
                }
                //   msg(tempId);

                return this.ie_topic_langmap[tempId] || obj.topic;
            },
            ie_trans_status(obj) {
                if (obj.State == 'true') {
                    return this.lang.i18n_firing;
                } else if (obj.State == 'false') {
                    return this.lang.i18n_stop;
                }
            },
            flash_trans_ch(obj) {
                return this.ie_trans_ch(obj);
            },
            flash_trans_topic(obj) {
                return flash_topic_langmap[obj.topic] || obj.topic;
            },
            flash_trans_status(obj) {
                return this.ie_trans_status(obj);
            },

            h5_trans_ch(obj) {
                let str = (obj.Channel + 1).toString();
                if (ch_region.includes(obj.AlarmName)) {
                    str = `${str}_${obj.RegionId + 1}`;
                }
                return str;
            },
            h5_trans_topic(obj) {
                if (obj.AlarmName == 'RecognitionFace') {
				return null;
			} else if (obj.AlarmName == 'Vdiagnose') {
				return this.h5_trans_RegionId(obj);
			}
                return this.h5_topic_langmap[obj.AlarmName] || obj.AlarmName;
            },
            h5_trans_status(obj) {
                if (obj.Status) {
                    return this.lang.i18n_firing;
                } else {
                    return this.lang.i18n_stop;
                }
            },
		/*
        "RegionId": 0 // 图像偏色
        "RegionId": 1,亮度过暗
        RegionId":2 //亮度过亮
        RegionId ":7 视频丢失
        "RegionId": 8 图像模糊
        */
		h5_trans_RegionId(obj) {
			switch (parseInt(obj.RegionId)) {
				case 0:
					return this.lang.i18n_videoColorCast;
					break;
				case 1:
					return this.lang.i18n_videoColorDark;
					break;
				case 2:
					return this.lang.i18n_videoOverExposure;
					break;
				case 7:
					return this.lang.i18n_videoLost;
					break;
				case 8:
					return this.lang.i18n_videoOutOfFocus;
					break;
                }
            },
        },
        computed: {
            alarmlist() {
                return this.$store.getters.config.alarm_list;
            },
            lang() {
                return this.$store.getters.current_language;
            },
            ie_topic_langmap() {
                let lang = this.lang;
                //报警输入处理
                return {
                    InputToken: lang.i18n_alarmIn,

                    MotionAlarm: lang.i18n_motion, //移动侦测处理
                    ImageTooDark: lang.i18n_videoHide, //遮挡报警处理

                    IvsCountWire: lang.i18n_videoCounter,

                    IvsObjectRegion: lang.i18n_videoObjDect,

                    IvsHighDensity: lang.i18n_videoHighDensity,

                    IvsRetrograde: lang.i18n_videoRetrograde,

                    IvsMaxHeight: lang.i18n_videoMaxHeight,

                    IvsHumanoid: lang.i18n_videoHuman,

                    HumanTemperature: lang.i18n_humantemperature,
                    FaceMask: lang.i18n_faceMask,
                    DetectHelmet: lang.i18n_safetyHelmet,
                    //检测

                    IvsDetectRegion: this.$store.getters.showElectronicFence == true ? lang.i18n_EFence : lang.i18n_videoAreaDect, //区域检测

                    IvsDetectAbsent: lang.i18n_absentDetect,
                    IvsDetectWire: lang.i18n_videoVirtualLine, //虚拟警戒
                    PlateDetect: lang.i18n_videoPlateDetect,
                    FaceDetect: lang.i18n_videoFaceDetect,
                    FireDetect: lang.i18n_videoFireDetect,
                    IvsMotionDetect: lang.i18n_smartMotion,
                    PesronDetect: lang.i18n_HumanDect,

                    Color: lang.i18n_videoColorCast, //颜色异常
                    Bright: lang.i18n_videoOverExposure, //亮度过亮
                    Blur: lang.i18n_videoOutOfFocus, //视频模糊
                    Dark: lang.i18n_videoColorDark, //亮度过暗
                    ViLost: lang.i18n_videoLost, //视频丢失

                    IvsSoundAlarm: lang.i18n_soundBad,

                    IllegeAccess: lang.i18n_illegaAccess,

                    IpConelict: lang.i18n_IPConflict,

                    ReticleDisconnect: lang.i18n_NetNoConnected,

                    MediaDisconnect: lang.i18n_MediaDisconnect,

                    DiskIOError: lang.i18n_hdRWError,

                    IvsScenceChange: lang.i18n_SceneChange,
                    IvsDetectEBike: lang.i18n_ElectricBikeDetect,
                };
            },
            flash_topic_langmap() {
                let lang = this.lang;
                return {
                    0: lang.i18n_alarmIn,

                    1: lang.i18n_HDFull,

                    2: lang.i18n_NoVideo,

                    3: lang.i18n_motion,

                    4: lang.i18n_hdFormatError,

                    5: lang.i18n_hdRWError,

                    6: lang.i18n_videoHide,

                    7: lang.i18n_FormatNotMatch,

                    8: lang.i18n_illegaAccess,

                    9: lang.i18n_videoSignalBad,

                    10: lang.i18n_recordBad,

                    20: lang.i18n_NetNoConnected,

                    21: lang.i18n_IPConflict,

                    22: lang.i18n_videoCounter,

                    23: lang.i18n_videoVirtualLine,

                    24: this.$store.getters.showElectronicFence == true ? lang.i18n_EFence : lang.i18n_videoAreaDect,

                    25: lang.i18n_videoObjDect,

                    26: lang.i18n_soundBad,

                    27: lang.i18n_videoPlateDetect,

                    28: lang.i18n_videoFaceDetect,

                    29: lang.i18n_fireDetect,

				30: lang.i18n_videoColorCast, //图像偏色

				31: lang.i18n_videoOverExposure, //亮度过亮

				32: lang.i18n_videoOutOfFocus, //图片模糊

                    33: lang.i18n_smartMotion,

				34: lang.i18n_videoColorDark, //亮度过暗

                    35: lang.i18n_Temperaturedetect,

                    36: lang.i18n_MediaDisconnect,

				40: lang.i18n_videoColorBad, //颜色异常

                    41: lang.i18n_videoColorDark,

				42: lang.i18n_videoOverExposure, //亮度过亮

                    43: lang.i18n_VideoStripe,

                    44: lang.i18n_VideoSnowFlake,

                    45: lang.i18n_VideoShield,

                    46: lang.i18n_VideoFreeze,

                    47: lang.i18n_videoLost,

                    48: lang.i18n_videoBlur,

                    49: lang.i18n_VideoJitter,

                    50: lang.i18n_VideoPTZ,

                    51: lang.i18n_HumanDect,

                    52: lang.i18n_absentDetect,

                    53: this.$store.getters.showElectronicFence == true ? lang.i18n_EFence : lang.i18n_videoAreaDect,
                };
            },
            h5_topic_langmap() {
                let lang = this.lang;
                return {
                    AlarmIn: lang.i18n_alarmIn,
                    DiskFull: lang.i18n_HDFull,
                    Motion: lang.i18n_motion,
                    DiskErr: lang.i18n_hdRWError,

				Vhide: lang.i18n_videoHide, //遮挡报警

				UnmatchFormat: lang.i18n_FormatNotMatch, //制式不匹

                    IllegallyAcc: lang.i18n_illegaAccess,

                    // 9: lang.i18n_videoSignalBad,

				VideoRecordErr: lang.i18n_recordBad, //录像异常

                    NetCableBreak: lang.i18n_NetNoConnected,

                    IpConflict: lang.i18n_IPConflict,

                    CounterWire: lang.i18n_videoCounter,

                    DetectWire: lang.i18n_videoVirtualLine,

                    DetectRegion: this.$store.getters.showElectronicFence == true ? lang.i18n_EFence : lang.i18n_videoAreaDect,

				ObjectRegion: lang.i18n_videoObjDect, //物品遗留丢失

				SoundDetect: lang.i18n_soundBad, //异常声音

                    DetectPlate: lang.i18n_videoPlateDetect,

                    DetectFace: lang.i18n_videoFaceDetect,

                    //  RecognitionFace: lang.i18n_videoFaceRecognize, 不支持

                    DetectFire: lang.i18n_fireDetect,

				Vdiagnose: lang.i18n_videoColorCast, //图像偏色

                    /* 31: lang.i18n_videoOverExposure,

                    32: lang.i18n_videoOutOfFocus,*/

                    SmartMotion: lang.i18n_smartMotion,

                    /*34: lang.i18n_videoColorDark,

                    35: lang.i18n_Temperaturedetect,*/

				MediaDisconnect: lang.i18n_MediaDisconnect, //平台断开连接

				VideoColor: lang.i18n_videoColorBad, //颜色异常

				VideoDark: lang.i18n_videoColorDark, //亮度过暗

				VideoBright: lang.i18n_videoOverExposure, //亮度过亮

				VideoStripe: lang.i18n_VideoStripe, //条纹干扰

				VideoSnowFlake: lang.i18n_VideoSnowFlake, //雪花干扰

				VideoShield: lang.i18n_VideoShield, //视频遮挡

				VideoFreeze: lang.i18n_VideoFreeze, //画面冻结

                    /*  47: lang.i18n_videoLost,

                    48: lang.i18n_videoBlur,

                    49: lang.i18n_VideoJitter,

                    50: lang.i18n_VideoPTZ,

                    51: lang.i18n_HumanDect,*/

                    Retrograde: lang.i18n_videoRetrograde,

                    DetectAbsent: lang.i18n_absentDetect,
                    DetectHelmet: lang.i18n_safetyHelmet,
                    HumanTemperature: lang.i18n_humantemperature,
                    FaceMask: lang.i18n_faceMask,
                    DetectEBike: lang.i18n_ElectricBikeDetect,
                };
            },
        },
        watch: {
            /**
             * 数组元素类型
             * ie：
             * {
             *  topic:tns1:Device/HumanTemperature
                2020-06-20 14:22:19
                2020-06-20 14:22:19
                Human
                Temperature01
                State
                true
             *}
             * flash：
             * {
             *  "Source": "1",
                "MajorType": 0,
                "MinorType": 6,
                "State": 0,
                "StartTime": 1592634504,
                "StopTime": 1592634508
                }
             *
             * h5:
             * {
             *  AlarmName: "Vhide"
                AlarmSrcType: 1
                AlarmType: 2
                Channel: 0
                DevName: ""
                Device: 0
                RegionId: 0
                StartTime: "2020-06-20 12:07:23"
                Status: 1
                StopTime: "2020-06-20 12:07:31"
                Stream: 0
                current_time: 1592626040695
                }
             *
             *
             *
             *
             */
            alarmlist(newVal, oldVal) {
                this.CheckAlarmList(newVal.concat());
            },
        },
    };
</script>
