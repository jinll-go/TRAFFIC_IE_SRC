<template>
	<div class="main_con clearfix" style="margin-top:100px;">
		<div class="main_con_top">
			<div class="fl pl10 bold">
				<label v-tr="i18n_about" v-if="$store.getters.is_tyconew || $store.getters.is_dongshun"></label>
				<label v-tr="i18n_devInfo" v-else></label>
			</div>
		</div>

		<div class="main_con_mid">
			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_devName"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtDVRName" class="textc" style="width:200px;" v-validator:NameLength />
					<span class="fl" style="width:70%"> </span>
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_customId"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtDeviceId" class="textc" style="width:200px;" v-validator:NameLength />
					<span class="fl" style="width:70%"> </span>
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_showResolution"></label>:&nbsp;</div>
				<div class="fl" style="width:70%"><input type="text" v-model="txtResolution" disabled="disabled" class="textc" style="width:200px;" /></div>
			</div>

			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_serialNumber"></label>:&nbsp;</div>
				<div class="fl" style="width:70%"><input type="text" v-model="txtSerialNumber" disabled="disabled" class="textc" style="width:200px;" /></div>
			</div>

			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_softwareVersion"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtSoftwareVersion" class="textc" disabled="disabled" style="width:200px;" />
				</div>
			</div>

			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_softDescribe"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtSoftDescribe" class="textc" disabled="disabled" style="width:200px;" />
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_algModelVersion"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtAlgModelVersion" class="textc" disabled="disabled" style="width:200px;" />
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_liveDetectVersion"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtLiveDetectVersion" class="textc" disabled="disabled" style="width:200px;" />
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_vmsVersion"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtVmsVersion" class="textc" disabled="disabled" style="width:200px;" />
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_ispVersion"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtIspVersion" class="textc" disabled="disabled" style="width:200px;" />
				</div>
			</div>
			<div class="w100 pt5" v-show="this.support_temp">
				<div class="fl text_right" style="width:30%"><label v-tr="i18n_tempVersion"></label>:&nbsp;</div>
				<div class="fl" style="width:70%">
					<input type="text" v-model="txtTempVersion" class="textc" disabled="disabled" style="width:200px;" />
				</div>
			</div>

			<div class="w100 pt10 text_center">
				<button :class="button_style"  v-tr="i18n_save" @click="save"></button>
			</div>
		</div>

		<div class="main_con_bot"></div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { isDateTimeString ,debounce} from 'common/util';
	//import {GetCustomizeMenu} from 'common/get_customize_menu'
	import style from 'mixin/style';
	export default {
		name: 'CVConfigVersionInfo',
		mixins: [style],
		data() {
			return {
				txtDVRName: '',
				txtDVRType: '',
				txtHardwareVersion: '',
				txtSoftwareVersion: '',
				txtSerialNumber: '',
				selFormat: 0,
				formatList: [],
				ImageMode: 0,
				ImageModeList: [],
				d: {},
				CfgVersion: '',
				txtDeviceId: '',
				txtResolution: '',
				txtSoftDescribe: '',
				txtAlgModelVersion: '',
				txtLiveDetectVersion: '',
				txtVmsVersion: '',
				txtIspVersion: '',
				txtTempVersion: '',
				support_temp: false,
			};
		},
		created() {
			this.save = debounce(this.btnsave,1000);
		},
		mounted() {
			Promise.all([
				this.$store.dispatch('request', { url: 'goform/frmDevicePara', ch: 1, Type: 0, Data: {} }),
				this.$store.dispatch('request', { url: 'goform/frmDevicePara', ch: 1, Type: 2, Data: {} }),
				this.$store.dispatch('request', { url: 'goform/GetFactoryInfo', ch: 1, Type: 0, Data: {} }),
				this.$store.dispatch('request', { url: 'goform/frmVideoFaceRecognitionPara', ch: 1, Type: 16, Data: {} })
			]).then((r) => {
				if (r[0].Result == -655365 || r[1].Result == -655365 || r[2].Result == -65535 || r[3].Result == -65535) {
					this.$store.dispatch('config_no_right');
				} else {
					if (r[0].Result == 0) {
						this.txtDVRName = r[0].Data.DVRName;
						this.txtSerialNumber = r[0].Data.SerialNumber;
						this.txtResolution = r[0].Data.CurLocalRes;
					}
					if (r[1].Result == 0) {
						this.txtDeviceId = r[1].Data.DeviceSerialID;
					} 

					if (r[2].Result == 0) {
						this.txtSoftwareVersion = r[2].Data.SoftwareVersion;
						this.txtSoftDescribe = r[2].Data.VersionDescription;
						this.txtAlgModelVersion = r[2].Data.AiVersion;
						this.txtLiveDetectVersion = r[2].Data.LiveDetectVersion;
						this.txtVmsVersion = r[2].Data.VMSVersion;
						this.txtIspVersion = r[2].Data.IspVersion;
						this.txtTempVersion = r[2].Data.TempVersion;
					}

					if (r[3].Result == 0) {
						this.support_temp = r[3].Data.SupportTempCheck;
					}
				}
			}).catch((error) => {
				msg('Get version info failed!!');
			});
		},
		computed: {
			
		},
		methods: {
			btnsave() {
				if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
					this.$notify.error(this.$store.getters.current_language['i18n_checkinput']);
					return;
				}

				Promise.all([
					this.$store.dispatch('request', { url: 'goform/frmDevicePara', ch: 1, Type: 1, Data: {DVRName: this.txtDVRName} }),
					this.$store.dispatch('request', { url: 'goform/frmDevicePara', ch: 1, Type: 3, Data: {DeviceSerialID: this.txtDeviceId} }),
				]).then((r) => {
					if (r[0].Result == -655365 || r[1].Result == -655365) {
						this.$store.dispatch('config_no_right');
					} else {
						if (r[0].Result == 0 && r[1].Result == 0) {
							this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
						} else {
							this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
						}
					}
				});
			},
		},
	};
</script>
