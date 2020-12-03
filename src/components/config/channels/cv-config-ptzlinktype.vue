<template>
	<tr id="tr_linkAll_2">
		<td>
			<table border="0" width="100%">
				<tr>
					<td v-show="linktype_email" width="30%">
						<!--上传邮件-->
						<label v-tr="i18n_Uploademail"></label>:&nbsp;
						<input name="checkbox4" type="checkbox" id="email_chk" style="vertical-align: middle;" v-model="upload_email" :disabled="all_enable" />
					</td>

					<td id="td_linkSnap" v-show="$UI['SDCard'].visible && linktype_snap">
						<!--抓拍-->
						<label v-tr="i18n_snap"></label>:&nbsp;
						<input name="checkbox" type="checkbox" id="cap_chk" style="vertical-align: middle;" v-model="snap" :disabled="all_enable" />
					</td>

					<td id="td_linkRecord" v-show="$UI['SDCard'].visible && linktype_record">
						<!--联动录像-->
						<label v-tr="i18n_record"></label>:&nbsp;
						<input name="checkbox3" type="checkbox" id="record_chk" style="vertical-align: middle;" v-model="record" :disabled="all_enable" />
					</td>
				</tr>

				<tr>
					<td v-show="linktype_alarmout && $store.getters.AlarmOutPortNum > 0" align="right">
						<!--报警输出-->
						<label v-tr="i18n_alarmOut"></label>:&nbsp;
					</td>

					<td v-show="linktype_alarmout && $store.getters.AlarmOutPortNum > 0">
						<div style="float: left;">
							<label>1</label>&nbsp;
							<input style="vertical-align: middle;" type="checkbox" v-model="alarmout1" :disabled="all_enable" />
						</div>
						<div style="float: left;" v-if="$store.getters.AlarmOutPortNum > 1">
							&nbsp; <label>2</label>&nbsp;
							<input style="vertical-align: middle;" type="checkbox" v-model="alarmout2" :disabled="all_enable" />
						</div>
					</td>
					<td v-show="linktype_ftp">
						<!----><label>Ftp</label>:&nbsp;
						<input name="checkbox4" type="checkbox" style="vertical-align: middle;" v-model="ftp" :disabled="all_enable" />
					</td>
					<td v-show="linktype_http">
						<!----><label>Http</label>:&nbsp;
						<input name="checkbox4" type="checkbox" style="vertical-align: middle;" v-model="http" :disabled="all_enable" />
					</td>
				</tr>

                <tr v-if="name == 'alarmin'" v-show="$UI['SDCard'].visible && linktype_snap">
					<td height="30" align="right"><!--间隔--><label v-tr="i18n_snapInterval"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<select name="capInterval" id="capInterval" class="textc" style="width: 220px;" v-model="snap_interval" :disabled="all_enable">
							<option :value="1">1</option>
							<option :value="2">2</option>
							<option :value="3">3</option>
							<option :value="4">4</option>
							<option :value="5">5</option>
							<option :value="6">6</option>
							<option :value="7">7</option>
							<option :value="8">8</option>
							<option :value="9">9</option>
							<option :value="10">10</option>
						</select>
					</td>
				</tr>

                <tr v-if="name == 'alarmin'" v-show="$UI['SDCard'].visible && linktype_snap">
					<td height="30" align="right"><label v-tr="i18n_snapCount"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<select name="capCount" class="textc" style="width: 220px;" v-model="snap_count" :disabled="all_enable">
							<option :value="1">1</option>
							<option :value="2">2</option>
							<option :value="3">3</option>
							<option :value="4">4</option>
							<option :value="5">5</option>
							<option :value="6">6</option>
							<option :value="7">7</option>
							<option :value="8">8</option>
							<option :value="9">9</option>
							<option :value="10">10</option>
						</select>
					</td>
				</tr>

				<!-- 韦根类型 -->
                <tr v-if="name == 'alarmin'" v-show="linktype_wiegand">
					<td height="30" align="right"><label v-tr="i18n_wiegandset"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<select class="textc" style="width:220px;" v-model="wiegandEnable" :disabled="all_enable">
							<option :value="0" v-tr="i18n_no_enable"></option>
							<option :value="1" v-tr="i18n_CommonWiegand"></option>
							<option :value="2" v-tr="i18n_Custom"></option>
							<option :value="3" v-tr="i18n_auto"></option>
						</select>
					</td>
				</tr>

				<!-- 韦根通道 -->
                <tr v-if="name == 'alarmin'" v-show="linktype_wiegand">
					<td height="30" align="right" v-if="wiegandEnable == 2">
						<div><label v-tr="i18n_wiegandChan"></label>:&nbsp;</div>
					</td>
					<td align="left" colspan="3" v-if="wiegandEnable == 2">
						<select class="textc" v-model="wiegandCh" style="width: 220px">
                            <option v-for="n in linktype.Wiegand.length" :value="n - 1">{{ n }}</option>
						</select>
					</td>
				</tr>

				<!-- 韦根号 -->
                <tr v-if="name == 'alarmin'" v-show="linktype_wiegand">
					<td height="30" align="right" v-if="wiegandEnable == 2"><label v-tr="i18n_wiegandId"></label>:&nbsp;</td>
					<td align="left" colspan="3" v-if="wiegandEnable == 2">
						<input
							class="textc"
							type="text"
							style="width: 220px"
							v-model="wiegandId"
							:disabled="all_enable || wiegandEnable == 0"
							v-validator:NOVOID:Number="[1, 65535]"
						/>
					</td>
				</tr>

				<tr id="tr_linkPtz" v-show="linktype_ptz">
					<td align="right">
						<label style="vertical-align: middle;" v-tr="i18n_enablePTZ"><!--启用PTZ--></label>:&nbsp;
						<input name="checkbox6" type="checkbox" id="enablePTZ" style="vertical-align: middle;" v-model="enable_ptz" :disabled="all_enable" />
					</td>
					<td align="left" colspan="3">
						<select name="select3" class="textc" id="preset_sel" style="width: 220px;" v-model="preset" :disabled="all_enable ? true : !enable_ptz">
							<option :value="opt.value" v-tr="opt.text" v-for="opt of preset_list">1</option>
							<!-- <option :value="2">2</option>
	                      <option :value="3">3</option>
	                      <option :value="4">4</option>
	                      <option :value="5">5</option>
	                      <option :value="6">6</option>
	                      <option :value="7">7</option>
	                      <option :value="8">8</option> -->
						</select>
					</td>
				</tr>

				<!-- 录音联动 -->
				<tr id="tr_linkRecord" v-show="linktype_audio">
					<td align="right">
						<label style="vertical-align: middle;" v-tr="i18n_linkAudio">录音联动</label>:&nbsp;
						<input
							name="checkbox7"
							type="checkbox"
							id="EnableRecord"
							style="vertical-align: middle;"
							v-model="enable_audio"
							:disabled="all_enable"
						/>
					</td>
					<td align="left" colspan="3">
						<select name="select4" class="textc" id="audio_sel" style="width:220px;" :disabled="all_enable ? true : !enable_audio" v-model="audio">
							<option :value="opt.Id" v-for="opt of audio_list">{{ opt.Name }}</option>
							<!--<option :value="1">1</option>-->
							<!--<option :value="2">2</option>-->
							<!--<option :value="3">3</option>-->
							<!--<option :value="4">4</option>-->
							<!--<option :value="5">5</option>-->
							<!--<option :value="6">6</option>-->
							<!--<option :value="7">7</option>-->
							<!--<option :value="8">8</option>-->
						</select>
					</td>
				</tr>
				<tr v-show="linktype_lightAlarm">
					<td style="text-align: right;">
						<!--联动声光-->
						<label style="vertical-align: middle" v-tr="i18n_lightAlarm"></label>:&nbsp;
					</td>
					<td style="text-align: left;">
						<input type="checkbox" style="vertical-align: middle" v-model="light_alarm" :disabled="all_enable" />
					</td>
				</tr>
			</table>
		</td>

		<td id="td_snapSet" v-if="this.name != 'alarmin'">
			<table width="100%">
				<!-- 间隔 -->
				<tr v-show="$UI['SDCard'].visible && linktype_snap">
					<td height="30" align="right"><!--间隔--><label v-tr="i18n_snapInterval"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<select name="capInterval" class="textc" style="width: 220px;" v-model="snap_interval" :disabled="all_enable">
							<option :value="1">1</option>
							<option :value="2">2</option>
							<option :value="3">3</option>
							<option :value="4">4</option>
							<option :value="5">5</option>
							<option :value="6">6</option>
							<option :value="7">7</option>
							<option :value="8">8</option>
							<option :value="9">9</option>
							<option :value="10">10</option>
						</select>
					</td>
				</tr>

				<tr v-show="$UI['SDCard'].visible && linktype_snap">
					<td height="30" align="right"><label v-tr="i18n_snapCount"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<select name="capCount" id="capCount" class="textc" style="width: 220px;" v-model="snap_count" :disabled="all_enable">
							<option :value="1">1</option>
							<option :value="2">2</option>
							<option :value="3">3</option>
							<option :value="4">4</option>
							<option :value="5">5</option>
							<option :value="6">6</option>
							<option :value="7">7</option>
							<option :value="8">8</option>
							<option :value="9">9</option>
							<option :value="10">10</option>
						</select>
					</td>
				</tr>

				<!-- 韦根类型 -->
				<tr v-show="linktype_wiegand">
					<td height="30" align="right"><label v-tr="i18n_HDtype"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<select class="textc" style="width:220px;" v-model="wiegandEnable" :disabled="all_enable">
							<option :value="0" v-tr="i18n_no_enable"></option>
							<option :value="1" v-tr="i18n_CommonWiegand"></option>
							<option :value="2" v-tr="i18n_Custom"></option>
							<option :value="3" v-tr="i18n_auto"></option>
						</select>
					</td>
				</tr>

				<!-- 韦根通道 -->
				<tr v-if="wiegandEnable == 2" v-show="linktype_wiegand">
					<td height="30" align="right"><label v-tr="i18n_wiegandChan"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<select class="textc" v-model="wiegandCh" style="width: 220px">
                            <option v-for="n in linktype.Wiegand.length" :value="n - 1">{{ n }}</option>
						</select>
					</td>
				</tr>

				<!-- 韦根号 -->
				<tr v-if="wiegandEnable == 2" v-show="linktype_wiegand">
					<td height="30" align="right"><label v-tr="i18n_wiegandId"></label>:&nbsp;</td>
					<td align="left" colspan="3">
						<input
							class="textc"
							type="text"
							style="width: 220px"
							v-model="wiegandId"
							:disabled="all_enable || wiegandEnable == 0"
							v-validator:NOVOID:Number="[0, 65535]"
						/>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</template>
<script>
	import { isNum } from 'common/util';

	export default {
		name: 'CVConfigPTZLinkType',
        model: {
            //清除默认的v-model绑定
            prop: 'linktype',
            event: 'input',
        },
		props: {
			name: {
				type: String,
				default: 'linktype',
			},
			disabled: {
				type: Boolean,
				default: true,
			},
			linktype_email: {
				type: Boolean,
				default: true,
			},
			linktype_snap: {
				type: Boolean,
				default: true,
			},
			linktype_record: {
				type: Boolean,
				default: true,
			},
			linktype_alarmout: {
				type: Boolean,
				default: true,
			},
			linktype_ptz: {
				type: Boolean,
				default: true,
			},
			linktype_audio: {
				type: Boolean,
				default: true,
			},
			linktype_ftp: {
				type: Boolean,
				default: true,
			},
			linktype_http: {
				type: Boolean,
                default: false,
			},
			linktype_wiegand: {
				type: Boolean,
				default: false,
			},
			linktype_lightAlarm: {
				type: Boolean,
				default: false,
            },
            linktype: {
                type: Object,
                default: {
                    HandleType: 0,
                    AlarmOut: 0,
                    SnapCount: 0,
                    SnapInterval: 0,
                    EnablePreset: 0,
                    PresetNo: 0,
                    EnableAudio: 0,
                    AudioNo: 0,
                    Wiegand: [
                        {
                            Id: 0,
                            Enable: 0,
                        },
                    ],
                },
			},
		},
		data() {
			return {
				preset_list: [],
				wiegandCh: 0,
				audio_list: [],
			};
		},
		mounted() {
            msg(JSON.stringify(this.linktype), this['linktype_email'], this['linktype_snap'], this['linktype_record'], this['linktype_alarmout']);

            if (this.linktype_audio) {
			this.$store.dispatch('request', { url: 'goform/frmAudioAlarmCfg', Type: 0, Data: {} }).then((_) => {
				if (_.Result == 0) {
					this.audio_list = _.Data.ResList;
				}
			});
            }
			let ar = [];
			if (this.$Param['CVPanelPreset']) {
				ar = this.$Param['CVPanelPreset'].filterPresetArray || [];
			}

			let vec = [];
			for (var i = 0; i <= 7; i++) {
				if (!ar.includes(i)) {
                    vec.push({ text: this.lang['i18n_preset'] + i, value: i });
				}
			}
			this.preset_list = vec;

			if (ar.includes(this.preset)) {
				this.preset = vec[0].value;
			}
        },
        methods: {
            update_value() {
                this.$emit('input', this.linktype);
            },
		},
		computed: {
			all_enable() {
				return this.disabled;
			},
			upload_email: {
				get: function() {
					return (this.handle_type >> 4) & 0x01 ? true : false;
				},
				set: function(v) {
					if (v) {
						this.handle_type |= 0x10;
					} else {
						this.handle_type &= ~0x10;
					}
                    this.update_value();
				},
			},
			snap: {
				get: function() {
					return (this.handle_type >> 6) & 0x01 ? true : false;
				},
				set: function(v) {
					if (v) {
						this.handle_type |= 0x40;
					} else {
						this.handle_type &= ~0x40;
					}
                    this.update_value();
				},
			},
			record: {
				get: function() {
					return (this.handle_type >> 5) & 0x01 ? true : false;
				},
				set: function(v) {
					if (v) {
						this.handle_type |= 0x20;
					} else {
						this.handle_type &= ~0x20;
					}
                    this.update_value();
				},
			},
			AlarmOut: {
				get: function() {
                    msg(['AlarmOut', this.linktype.AlarmOut]);
                    return this.linktype.AlarmOut;
				},
				set: function(v) {
                    this.linktype.AlarmOut = v;
				},
			},
			alarmout1: {
				get: function() {
					return this.AlarmOut & 0x1 ? true : false;
				},
				set: function(val) {
					if (val) {
						this.AlarmOut |= 0x1;
					} else {
						this.AlarmOut &= ~0x1;
					}
                    this.update_value();
				},
			},
			alarmout2: {
				get: function() {
					return (this.AlarmOut >> 1) & 0x1 ? true : false;
				},
				set: function(val) {
					if (val) {
						this.AlarmOut |= 0x1 << 1;
					} else {
						this.AlarmOut &= ~(0x1 << 1);
					}
                    this.update_value();
				},
			},
			ftp: {
				get: function() {
					return (this.handle_type >> 7) & 0x01 ? true : false;
				},
				set: function(v) {
					if (v) {
						this.handle_type |= 0x80;
					} else {
						this.handle_type &= ~0x80;
					}
                    this.update_value();
				},
			},
			http: {
				get: function() {
					return (this.handle_type >> 8) & 0x01 ? true : false;
				},
				set: function(v) {
					if (v) {
						this.handle_type |= 0x100;
					} else {
						this.handle_type &= ~0x100;
					}
                    this.update_value();
				},
			},
			handle_type: {
				get: function() {
                    return this.linktype.HandleType;
				},
				set: function(v) {
                    this.linktype.HandleType = v;
				},
			},
			snap_count: {
				get: function() {
                    return this.linktype.SnapCount;
				},
				set: function(v) {
                    this.linktype.SnapCount = v;
                    this.update_value();
				},
			},
			snap_interval: {
				get: function() {
                    return this.linktype.SnapInterval;
				},
				set: function(v) {
                    this.linktype.SnapInterval = v;
                    this.update_value();
				},
			},
			enable_ptz: {
				get: function() {
                    return this.linktype.EnablePreset;
				},
				set: function(v) {
                    this.linktype.EnablePreset = v ? 1 : 0;
                    this.update_value();
				},
			},
			preset: {
				get: function() {
                    return this.linktype.PresetNo;
				},
				set: function(v) {
                    this.linktype.PresetNo = v;
                    this.update_value();
				},
			},

			enable_audio: {
				get: function() {
                    return this.linktype.EnableAudio;
				},
				set: function(v) {
                    this.linktype.EnableAudio = v ? 1 : 0;
                    this.update_value();
				},
			},
			audio: {
				get: function() {
                    return this.linktype.AudioNo;
				},
				set: function(v) {
                    this.linktype.AudioNo = v;
                    this.update_value();
			},
				},

			wiegandId: {
				get: function() {
					msg(['wiegandId', this.name]);

                    return this.linktype_wiegand ? this.linktype.Wiegand[this.wiegandCh].Id : 0;
				},
				set: function(v) {
					if (isNum(v)) {
                        let arr = this.linktype.Wiegand;
						arr[this.wiegandCh].Id = parseInt(v);
						msg(['wiegand', v, this.wiegandCh, arr]);
                        this.linktype.Wiegand = arr;
                        this.update_value();
					}
				},
			},
			wiegandEnable: {
				get: function() {
					msg(['wiegandEnable']);
                    return this.linktype_wiegand ? this.linktype.Wiegand[this.wiegandCh].Enable : 0;
				},
				set: function(v) {
					if (isNum(v)) {
                        let arr = this.linktype.Wiegand;
						arr[this.wiegandCh].Enable = parseInt(v);
						msg(['wiegand', v, this.wiegandCh, arr]);
                        this.linktype.Wiegand = arr;
                        this.update_value();
					}
				},
			},

			light_alarm: {
				get: function() {
					return (this.handle_type >> 9) & 0x01 ? true : false;
				},
				set: function(v) {
					if (v) {
						this.handle_type |= 0x200;
					} else {
						this.handle_type &= ~0x200;
					}
                    this.update_value();
				},
			},
		},
	};
</script>
