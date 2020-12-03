<template>
    <div class="main_con_temperature_container clearfix">
        <!-- 人体测温 -->
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_humantemperature"></label>
            </div>
        </div>
        <div class="main_con_mid">
            <div class="w100 pt1">
                <table width="100%" border="0" cellpadding="2" cellspacing="1">
                    <tr>
                        <td align="center" valign="top">
                            <table width="99%" border="0" cellspacing="0" cellpadding="0" id="tab1">
                                <tr>
                                    <td width="35%" height="30" align="right"><label v-tr="i18n_enableVideoShelter"></label> :&nbsp;</td>
                                    <td width="65%" align="left">
                                        <input type="checkbox" v-model="d.Enable" />
                                    </td>
                                </tr>
                                <!-- 播放温度语音开关 -->
                                  <tr>
                                    <td width="35%" height="30" align="right"><label v-tr="i18n_TempAudioPlay"></label> :&nbsp;</td>
                                    <td width="65%" align="left">
                                        <input type="checkbox" v-model="d.TempAudioPlay" :disabled="!d.Enable"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="35%" height="30" align="right"><label v-tr="i18n_MaxTempThreshold"></label> :&nbsp;</td>
                                    <td width="65%" align="left">
                                        <input type="text" class="textc" v-model="d.MaxTemperature" />
                                        <label>{{ TempUnit_list[d.TemperatureUnit] }}</label>
                                    </td>
                                </tr>

                                <tr>
                                    <td valign="top" class="td_bg" colspan="2">
                                        &nbsp;
                                        <label v-tr="i18n_Weekday"></label>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="35%" height="30" align="right"><label v-tr="i18n_Weekday"></label> :&nbsp;</td>
                                    <td width="65%" align="left">
                                        <select id="start_wd" class="textc" style="width: 220px;" v-model="weekdayidx" :disabled="!d.Enable">
                                            <option :value="0" v-tr="i18n_Monday"></option>
                                            <option :value="1" v-tr="i18n_Tusday"></option>
                                            <option :value="2" v-tr="i18n_Wenday"></option>
                                            <option :value="3" v-tr="i18n_Thusday"></option>
                                            <option :value="4" v-tr="i18n_Friday"></option>
                                            <option :value="5" v-tr="i18n_Satday"></option>
                                            <option :value="6" v-tr="i18n_Sunday"></option>
                                        </select>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td valign="top" class="td_bg">
                            &nbsp;
                            <label v-tr="i18n_ArmSchedule"></label>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top">
                            <CVConfigSection type="SECTION_EIGHT" v-model="alarmtime" :weekday="weekdayidx" :disabled="!d.Enable"></CVConfigSection>
                        </td>
                    </tr>

                    <tr id="tr_linkAll_1" v-show="ui_custom.linkAll.visible">
                        <td valign="top" class="td_bg">
                            &nbsp;
                            <label v-tr="i18n_linkType"></label>
                        </td>
                    </tr>

                    <CVConfigPTZLinkType
                        name="alarmin"
                        :disabled="!d.Enable"
                        v-show="ui_custom.linkAll.visible"
                        :linktype_email="ui_custom.upload_email.visible"
                        :linktype_snap="ui_custom.snap.visible"
                        :linktype_record="ui_custom.link_record.visible"
                        :linktype_alarmout="ui_custom.alarmout.visible"
                        :linktype_ptz="ui_custom.ptz.visible"
                        :linktype_ftp="ui_custom.ftp.visible"
                        :linktype_http="ui_custom.http.visible"
                        :linktype_audio="ui_custom.link_audio.visible"
                        :linktype_lightAlarm="ui_custom.light_alarm.visible"
                        v-model="linktype"
                    ></CVConfigPTZLinkType>
                </table>
            </div>
            <div class="w100 pt10 text_center" style="position:relative">
                <button :class="button_style" v-tr="i18n_save" @click="save"></button>
            </div>
        </div>
        <div class="main_con_bot"></div>
    </div>
</template>

<script>
    import sections from 'mixin/sections';
    import linktype from 'mixin/linktype';
    import style from 'mixin/style';

export default {
	name: 'CVConfigHumanTemperature',
	mixins: [style, sections, linktype],
	data() {
		return {
			TempUnit_list: ['°C', '°F'],
			d: {
				Enable: false,
				MaxTemperature: 0.0,
				TemperatureUnit: 0,
				TempAudioPlay: 0,
			},
		};
	},
	mounted() {
		Promise.all([
			this.$store.dispatch('request', { url: 'goform/frmHumanTemperaturePara', Type: 0, Data: {}, Dev: 1, Ch: 1 }),
			this.$store.dispatch('request', { url: 'goform/frmDetectLinkPara', Type: 0, Dev: 1, Ch: 1, Data: { DetectLinkType: 19, AlarmTimeType: 1 } }),
		]).then((r) => {
			if (r[0].Result == -655365 || r[1].Result == -655365) {
				this.$store.dispatch('config_no_right');
			} else {
				if (r[1].Result == 0 && r[0].Result == 0) {
					this.d = r[0].Data;
					this.alarmtime = r[1].Data.AlarmTime;
					this.linktype = r[1].Data;

					window.toastr.success(this.lang['i18n_getok']);
				} else {
					window.toastr.error(this.lang['i18n_getfailed']);
				}
			}
		});
	},
	methods: {
		save() {
			if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
				this.$notify.error(this.lang['i18n_checkinput']);
				return;
			}

			this.d.Enable = this.d.Enable ? 1 : 0;
			this.d.TempAudioPlay = this.d.TempAudioPlay ? 1 : 0;
			this.d.MaxTemperature = parseFloat(this.d.MaxTemperature);

                this.linktype.EnableHandle = this.d.Enable;

                let time_sections = this.alarmtime;

                Promise.all([
                    this.$store.dispatch('request', {
                        url: 'goform/frmHumanTemperaturePara',
                        Type: 1,
                        Dev: 1,
                        Ch: 1,
                        Data: this.d,
                    }),
                    this.$store.dispatch('request', {
                        url: 'goform/frmDetectLinkPara',
                        Type: 1,
                        Dev: 1,
                        Ch: 1,
                        Data: $.extend(true, { DetectLinkType: 19, AlarmTimeType: 1 }, this.linktype, { AlarmTime: time_sections }),
                    }),
                ]).then((r) => {
                    if (r[0].Result == -655365 || r[1].Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (r[0].Result == 0 && r[1].Result == 0) {
                            this.$notify.success(this.lang['i18n_saveok']);
                        } else {
                            this.$notify.error(this.lang['i18n_savefailed']);
                        }
                    }
                });
            },
        },
    };
</script>
