<template>
	<div class="main_con_advanced_container clearfix">
		<div class="main_con_top">
			<div class="fl pl10 bold">
				<label v-tr="i18n_AdvancedCfg">高级配置</label>
			</div>
		</div>

		<div class="main_con_mid">
			<div class="w100 pt1">
				<table width="100%" border="0" cellpadding="2" cellspacing="1">
					<tr>
						<td colspan="2" valign="top">
							<table width="100%" border="0" cellspacing="0" cellpadding="5">
								<tr>
									<table width="100%" border="0" cellspacing="0" cellpadding="5">
										<tr>
											<td width="33%" align="left">
												<select class="textc" style="width: 130px;" @change="GroupTypeChange">
													<option :value="0" v-tr="i18n_whiteListLink"></option>
													<option :value="1" v-tr="i18n_blackListLink"></option>
													<option :value="2" v-tr="i18n_ComparisonFailedLink"></option>
												</select>
											</td>
											<td width="20%" align="center">
												<input type="checkbox" v-model="d.EnableHandle" /><label v-tr="i18n_enableVideohide"></label>
											</td>
											<td width="43%" align="center">
												<label v-tr="i18n_Weekday"></label>&nbsp;:
                                                <select id="start_wd" class="textc" style="width: 100px;" v-model="weekdayidx" :disabled="!d.EnableHandle">
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
								</tr>

								<tr>
									<td valign="top" class="td_bg" colspan="2">
										&nbsp;
										<label v-tr="i18n_ArmSchedule"></label>
									</td>
								</tr>
								<tr>
									<td width="100%" aligin="center" valign="top">
                                        <CVConfigSection
                                            type="SECTION_EIGHT"
                                            v-model="alarmtime"
                                            :weekday="weekdayidx"
                                            :disabled="!d.EnableHandle"
                                        ></CVConfigSection>
									</td>
								</tr>

								<tr>
									<td valign="top" class="td_bg" colspan="2">
										&nbsp;
										<label v-tr="i18n_linkType"></label>
									</td>
								</tr>
								<CVConfigPTZLinkType
									name="alarmin"
									:disabled="!d.EnableHandle"
									:linktype_email="false"
									:linktype_snap="false"
									:linktype_record="false"
									:linktype_alarmout="ui_custom.alarmout.visible"
									:linktype_ptz="false"
									:linktype_ftp="false"
									:linktype_http="false"
									:linktype_audio="false"
									:linktype_wiegand="ui_custom.link_wiegand.visible && GroupType != 2"
                                    v-model="linktype"
								></CVConfigPTZLinkType>
							</table>
						</td>
					</tr>
				</table>
			</div>
			<div class="w100 pt10 text_center" style="position:relative">
				<button :class="button_style" style="width:88px;" v-tr="i18n_save" @click="save"></button>
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
        name: 'CVConfigAdvancedSet',
        mixins: [style, sections, linktype],
		data() {
			return {
				d: {
                    EnableHandle: 0,
				},
                GroupType: 0,
			};
		},
		mounted() {
			// this.$store.dispatch('request',{url:"goform/frmFaceRecognizeCfg",Type:0,Data:{GroupType:0}})
			this.GroupType = 0;
			this.GetInfo();
		},
		methods: {
			save() {
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
					return;
				}

				this.d.EnableHandle = this.d.EnableHandle ? 1 : 0;
				this.GroupType = parseInt(this.GroupType);

                let time_sections = this.alarmtime;

				let data = {
					GroupType: this.GroupType,
					AlarmTime: time_sections,
                    LinkCfg: this.linktype,
					EnableHandle: this.d.EnableHandle,
                    AlarmTimeType: 1,
				};

				this.$store
                    .dispatch('request', {
                        url: 'goform/frmFaceRecognizeCfg',
						Type: 1,
                        Data: data,
					})
                    .then((r) => {
						if (r.Result == -655365) {
                            this.$store.commit('errorCode/change', 0);
                            this.$store.commit('face/FaceIndex', 'CVConfigMsg');
						} else {
							if (r.Result == 0) {
                                this.$notify.success(this.lang['i18n_saveok']);
							} else {
                                this.$notify.error(this.lang['i18n_savefailed']);
							}
						}
					});
			},
			GetInfo() {
				this.$store
                    .dispatch('request', {
                        url: 'goform/frmFaceRecognizeCfg',
						Type: 0,
                        Data: { GroupType: this.GroupType, AlarmTimeType: 1 },
					})
                    .then((r) => {
						if (r.Result == -655365) {
                            this.$store.commit('errorCode/change', 0);
                            this.$store.commit('face/FaceIndex', 'CVConfigMsg');
						} else {
							if (r.Result == 0) {
								this.d = r.Data;

                                this.alarmtime = r.Data.AlarmTime;
                                this.linktype = r.Data.LinkCfg;

                                this.$notify.success(this.lang['i18n_getok']);
							} else {
                                this.$notify.error(this.lang['i18n_getfailed']);
							}
						}
					});
			},
			GroupTypeChange(e) {
				this.GroupType = parseInt(e.target.value);
				this.GetInfo();
		},
		},

	};
</script>
