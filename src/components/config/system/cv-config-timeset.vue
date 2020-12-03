<template>
	<div class="main_con clearfix" style="margin-top:100px;">
		<div class="main_con_top">
			<div class="fl pl10 bold">
				<label v-tr="i18n_timeset"></label>
			</div>
		</div>

		<div class="main_con_mid">
			<div class="w100 pt5">
				<div class="fl text_right" style="width:25%"><label v-tr="i18n_devTime"></label>:&nbsp;</div>
				<div class="fl" style="width:75%">
					<input type="text" class="textc" style="width:200px;" :value="txtdev_time" @click="show_calendar" readonly="readonly" />
					<button
						:class="button_style"
						style="width:50px;margin-left:2px;"
						v-tr="i18n_devTiming"
						@click="set_device_time($event)"
						:disabled="d.EnableNTP == 1"
					></button>
					<button 
						:class="button_style" 
						style="width:50px;margin-left:2px;" 
						@click="set_device_time($event, 'pc')" 
						:disabled="d.EnableNTP == 1">
						PC
					</button>
				</div>
			</div>
			<!--liuxin add 时间格式-->
			<div class="w100 pt5">
				<div class="fl text_right" style="width:25%"><label v-tr="i18n_date_format"></label>:&nbsp;</div>
				<div class="fl" style="width:75%">
					<select style="width:200px;" class="textc" id="selTFormat" v-model="Data_format">
						<!--liuxin add 注意: val 值和格式要对上, 0-MDY  1-YMD  2-DMY -->
						<option v-tr="i18n_date_format_MDY" :value="0"></option>
						<option v-tr="i18n_date_format_YMD" :value="1"></option>
						<option v-tr="i18n_date_format_DMY" :value="2"></option>
					</select>
				</div>
			</div>
			<!--liuxin add 时间格式-->
			<div class="w100 pt5">
				<div class="fl text_right" style="width:25%"><label v-tr="i18n_chooseTimeZone"></label>:&nbsp;</div>
				<div class="fl" style="width:75%">
					<select style="width:200px;" class="textc" id="selGMT" v-model="hour">
						<!--liuxin change 适配双目设备时区-->
						<option v-tr="i18n_GMTW12" :value="0"></option>
						<option v-tr="i18n_GMTW11" :value="1"></option>
						<option v-tr="i18n_GMTW10" :value="2"></option>
						<!--<option v-tr="i18n_GMTW9_30" :value="-570"></option>-->
						<option v-tr="i18n_GMTW9" :value="3"></option>
						<option v-tr="i18n_GMTW8" :value="4"></option>
						<option v-tr="i18n_GMTW7" :value="5"></option>
						<option v-tr="i18n_GMTW6" :value="6"></option>
						<option v-tr="i18n_GMTW5" :value="7"></option>
						<option v-tr="i18n_GMTW4_30" :value="8"></option>
						<option v-tr="i18n_GMTW4" :value="9"></option>
						<option v-tr="i18n_GMTW3_30" :value="10"></option>
						<option v-tr="i18n_GMTW3" :value="11"></option>
						<option v-tr="i18n_GMTW2" :value="12"></option>
						<option v-tr="i18n_GMTW1" :value="13"></option>
						<option v-tr="i18n_GMTE0" :value="14"></option>
						<option v-tr="i18n_GMTE1" :value="15"></option>
						<option v-tr="i18n_GMTE2" :value="16"></option>
						<option v-tr="i18n_GMTE3" :value="17"></option>
						<option v-tr="i18n_GMTE3_30" :value="18"></option>
						<option v-tr="i18n_GMTE4" :value="19"></option>
						<option v-tr="i18n_GMTE4_30" :value="20"></option>
						<option v-tr="i18n_GMTE5" :value="21"></option>
						<option v-tr="i18n_GMTE5_30" :value="22"></option>
						<option v-tr="i18n_GMTE5_45" :value="23"></option>
						<option v-tr="i18n_GMTE6" :value="24"></option>
						<option v-tr="i18n_GMTE6_30" :value="25"></option>
						<option v-tr="i18n_GMTE7" :value="26"></option>
						<option v-tr="i18n_GMTE8" :value="27"></option>
						<option v-tr="i18n_GMTE9" :value="28"></option>
						<option v-tr="i18n_GMTE9_30" :value="29"></option>
						<option v-tr="i18n_GMTE10" :value="30"></option>
						<option v-tr="i18n_GMTE11" :value="31"></option>
						<option v-tr="i18n_GMTE12" :value="32"></option>
						<option v-tr="i18n_GMTE13" :value="33"></option>
						<!--liuxin change 适配双目设备时区-->
					</select>
				</div>
			</div>
			<div class="w100 pt5">
				<!--liuxin change 时区微调-->
				<!--<input type="radio" v-model="d.EnableBias" />-->
				<div class="fl text_right" style="width:25%" v-tr="i18n_time_micro"></div>
				<div class="fl" style="width:5%">
						<input type="checkbox" style="vertical-align:middle" v-model="d.EnableBias" />
				</div>
				<div class="fl" style="width:70%">
					<input type="text"
					 v-model="Check_UTC" 
					 class="textc" 
					 style="width:50px;" 
					 maxlength="2" 
					 :disabled="!d.EnableBias"
					 v-validator:UTC />
					<span style="width:40px;"
						>&nbsp;
						<label v-tr="i18n_minitue"></label>
					</span>
				</div>
				<!--liuxin change 时区微调-->
			</div>

			<div v-show="ui_custom.ntp.visible">
				<div class="w100 pt5">
					<div class="td_bg pl10"><label v-tr="i18n_ntp"></label></div>
				</div>
				<div class="w100 pt5">
					<div class="fl text_right" style="width:25%"><label v-tr="i18n_enableNtp"></label>&nbsp;</div>
					<div class="fl" style="width:75%">
						<input type="checkbox" style="vertical-align:middle" v-model="d.EnableNTP" />
					</div>
				</div>
				<div class="w100 pt5">
					<div class="fl text_right" style="width:25%">
						<label v-tr="i18n_svrAddr"></label>
						:&nbsp;
					</div>
					<div class="fl" style="width:75%">
						<input type="text" class="textc" style="width:240px;" v-model="d.NTPServer" :disabled="!d.EnableNTP" v-validator:NTPAddr />
					</div>
				</div>

				<!--
				<div class="w100 pt5" v-if="false">
					<div class="fl text_right" style="width:25%">
						<label v-tr="i18n_port"></label>
						:&nbsp;
					</div>
					<div class="fl" style="width:75%">
						<input
							type="text"
							class="textc tip"
							data-title="i18n_port_error"
							style="width:240px;"
							v-model="d.NTPPort"
							:disabled="!d.EnableNTP"
							v-validator:NOVOID:Number="[0, 65535]"
						/>
					</div>
				</div>
        -->

				<div class="w100 pt5">
					<div class="fl text_right" style="width:25%">
						<label v-tr="i18n_regulateTimeInterval"></label>
						:&nbsp;
					</div>
					<div class="fl" style="width:75%">
						<input
							type="text"
							class="textc tip"
							data-title="i18n_number_error"
							style="width:240px;"
							v-model="d.TimeInterval"
							:disabled="!d.EnableNTP"
							v-validator:NOVOID:Number="[0, 24]"
						/>
						<span style="width:40px;"
							>&nbsp;
							<label v-tr="i18n_hour"></label>
						</span>
					</div>
				</div>
			</div>

			<div v-show="ui_custom.dst.visible">
				<div class="w100 pt5">
					<div class="td_bg pl10"><label v-tr="i18n_DST"></label></div>
				</div>
				<div class="w100 pt5">
					<div class="fl text_right" style="width:25%">&nbsp; <label v-tr="i18n_enableDST"></label>&nbsp;</div>
					<div class="fl" style="width:75%">
						<input type="checkbox" v-model="dst.EnableDST" />
					</div>
				</div>

				<!--	<div class="w100 pt5" v-if="false">
					<div class="fl text_right" style="width:25%"><label v-tr="i18n_ResModel"></label>:&nbsp;</div>
					<div class="fl" style="width:75%">
						<select class="textc" style="width:120px;">
							<option :value="1" v-tr="i18n_Dst_YM"></option>
							<option :value="2" v-tr="i18n_Dst_Day"></option>
							<option :value="3" v-tr="i18n_Dst_IDay"></option>
						</select>
					</div>
				</div>-->
				<!--liuxin change 夏令时 适配 日期效果-->
				<div class="w100 pt5">
					<div class="fl text_right" style="width:25%">&nbsp;<label v-tr="i18n_DSTModel"></label>&nbsp;</div>
					<div class="fl text_center" style="width:35%">
						<input type="radio" :value="0"  v-model="dst.DSTMode"/>
						<label v-tr="i18n_DSTModel_W"></label>
					</div>
					<div class="fl text_center" style="width:35%">
						<input type="radio" :value="1"  v-model="dst.DSTMode"/>
						<label v-tr="i18n_DSTModel_D"></label>
					</div>
				</div>
				<div v-show="dst.DSTMode==0?true:false">
					<div class="w100 pt5">
						<div class="fl text_right" style="width:25%"><label v-tr="i18n_DSTstarttime">&nbsp;</label>:&nbsp;</div>
						<div class="fl" style="width:75%">
							<select class="textc" style="width:90px;" v-model="BeginPoint.Month" :disabled="!dst.EnableDST">
								<option v-for="(opt, index) in MonthArr" v-tr="opt" :value="index"></option> </select
							>-
							<select class="textc" style="width:90px;" v-model="BeginPoint.WeekNo" :disabled="!dst.EnableDST">
								<option v-for="n in 5" :value="n - 1">{{ n }}{{ trans_week }}</option> </select
							>-
							<select class="textc" style="width:90px;" v-model="BeginPoint.WeekDate" :disabled="!dst.EnableDST">
								<option v-for="(opt, index) in WeekArr" v-tr="opt" :value="index"></option>
							</select>
						</div>
					</div>
					<div class="w100 pt5">
						<div class="fl text_right" style="width:25%">&nbsp;</div>
						<div class="fl" style="width:75%">
							<select class="textc" style="width:90px;" v-model="BeginPoint.Hour" :disabled="!dst.EnableDST">
								<option v-for="n in 24" :value="n - 1">{{ n - 1 }}{{ trans_hour }}</option> </select
							>-
							<select class="textc" style="width:90px;" v-model="BeginPoint.Min" :disabled="!dst.EnableDST">
								<option v-for="n in 60" :value="n - 1">{{ n - 1 }}{{ trans_min }}</option>
							</select>
						</div>
					</div>
					<div class="w100 pt5">
						<div class="fl text_right" style="width:25%"><label v-tr="i18n_DSTendtime">&nbsp;</label>:&nbsp;</div>
						<div class="fl" style="width:75%">
							<select class="textc" style="width:90px;" v-model="EndPoint.Month" :disabled="!dst.EnableDST">
								<option v-for="(opt, index) in MonthArr" v-tr="opt" :value="index"></option> </select
							>-
							<select class="textc" style="width:90px;" v-model="EndPoint.WeekNo" :disabled="!dst.EnableDST">
								<option v-for="n in 5" :value="n - 1">{{ n }}{{ trans_week }}</option> </select
							>-
							<select class="textc" style="width:90px;" v-model="EndPoint.WeekDate" :disabled="!dst.EnableDST">
								<option v-for="(opt, index) in WeekArr" v-tr="opt" :value="index"></option>
							</select>
						</div>
					</div>
					<div class="w100 pt5">
						<div class="fl text_right" style="width:25%">&nbsp;</div>
						<div class="fl" style="width:75%">
							<select class="textc" style="width:90px;" v-model="EndPoint.Hour" :disabled="!dst.EnableDST">
								<option v-for="n in 24" :value="n - 1">{{ n - 1 }}{{ trans_hour }}</option> </select
							>-
							<select class="textc" style="width:90px;" v-model="EndPoint.Min" :disabled="!dst.EnableDST">
								<option v-for="n in 60" :value="n - 1">{{ n - 1 }}{{ trans_min }}</option>
							</select>
						</div>
					</div>
				</div>
				<div v-show="dst.DSTMode==1?true:false">
					<div class="w100 pt5">
						<div class="fl text_right" style="width:25%"><label v-tr="i18n_DSTstarttime">&nbsp;</label>:&nbsp;</div>
						<input type="text" 
							class="textc" 
							style="width:200px;"  
							:value="txtDSTStart_time"
							:disabled="!dst.EnableDST"
							@click="show_calendar_DSTStart" 
							readonly="readonly" />
					</div>
					<div class="w100 pt5">
						<div class="fl text_right" style="width:25%"><label v-tr="i18n_DSTendtime">&nbsp;</label>:&nbsp;</div>
						<input type="text" 
							class="textc" 
							style="width:200px;" 
							:value="txtDSTStop_time"
							:disabled="!dst.EnableDST"
							@click="show_calendar_DSTStop" 
							readonly="readonly" />
					</div>
				</div>
				<!--liuxin change 夏令时 适配 日期效果-->
				<div class="w100 pt5">
					<div class="fl text_right" style="width:25%"><label v-tr="i18n_DSTBias">&nbsp;</label>:&nbsp;</div>
					<div class="fl" style="width:75%">
						<input class="textc" style="width:50px;" v-model="offset" :disabled="!dst.EnableDST" v-validator:NOVOID:Number="[0, 720]" />
						<span>{{ trans_min }}</span>
					</div>
				</div>
			</div>
			<div class="w100 pt10 text_center">
				<button :class="button_style" style="width:88px;" v-tr="i18n_save" @click="save()"></button>
			</div>
		</div>

		<div class="main_con_bot"></div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import { isDateTimeString, GMT_Check,UTC_Micro,checkNTPAddr } from 'common/util';
	import style from 'mixin/style';
	export default {
		name: 'CVConfigTimeSet',
		mixins: [style],
		data() {
			return {
				txtdev_time: '',
				txtDSTStart_time:'',
				txtDSTStop_time:'',
				hour: 0,
				minute: 2,
				//liuxin add 时间格式
				Data_format:0,
				//liuxin add 时间格式
				//liuxin add 支持的时区信息
				Support_Time_Zone:[],
				Time_Zone:27, //默认使用中国北京时间
				//liuxin add 支持的时区信息
				d: {},
				MonthArr: [
					'i18n_Jan',
					'i18n_Feb',
					'i18n_Mar',
					'i18n_Apr',
					'i18n_May',
					'i18n_Jun',
					'i18n_Jul',
					'i18n_Aug',
					'i18n_Sep',
					'i18n_Oct',
					'i18n_Nov',
					'i18n_Dec',
				],
				WeekArr: ['i18n_Sunday', 'i18n_Monday', 'i18n_Tusday', 'i18n_Wenday', 'i18n_Thusday', 'i18n_Friday', 'i18n_Satday'],
				trans_hour: this.$store.getters.current_language['i18n_suffix_hour'],
				trans_min: this.$store.getters.current_language['i18n_suffix_min'],
				trans_week: this.$store.getters.current_language['i18n_week'],
				dst: {},
				offset: 0,
				BeginPoint: {
					Month:0,
					WeekNo:0,
					WeekDate:0,
					Hour:0,
					Min:0,
				},
				EndPoint: {
					Month:0,
					WeekNo:0,
					WeekDate:0,
					Hour:0,
					Min:0,
				},
				BeginPointByTime:{
					Year:0,
					Month:0,
					Day:0,
					Hour:0,
					Minute:0,
				},
				EndPointByTime:{
					Year:0,
					Month:0,
					Day:0,
					Hour:0,
					Minute:0,
				},
				//liuxin add 时区时间差值 min
				Time_Zone_Delte:[
					{Zone:0,Delte:-720},{Zone:1,Delte:-660},{Zone:2,Delte:-600},{Zone:3,Delte:-540},{Zone:4,Delte:-480},{Zone:5,Delte:-420},
					{Zone:6,Delte:-360},{Zone:7,Delte:-300},{Zone:8,Delte:-270},{Zone:9,Delte:-240},{Zone:10,Delte:-210},{Zone:11,Delte:-180},
					{Zone:12,Delte:-120},{Zone:13,Delte:-60},{Zone:14,Delte:0},{Zone:15,Delte:60},{Zone:16,Delte:120},{Zone:17,Delte:180},
					{Zone:18,Delte:210},{Zone:19,Delte:240},{Zone:20,Delte:270},{Zone:21,Delte:300},{Zone:22,Delte:330},{Zone:23,Delte:345},
					{Zone:24,Delte:360},{Zone:25,Delte:390},{Zone:26,Delte:420},{Zone:27,Delte:480},{Zone:28,Delte:540},{Zone:29,Delte:570},
					{Zone:30,Delte:600},{Zone:31,Delte:660},{Zone:32,Delte:720},{Zone:33,Delte:780},
				],
				//liuxin add 时区时间差值 min
			};
		},
		mounted() {
			Promise.all([
				//获取时间
				this.$store.dispatch('request', { url: 'digest/frmDeviceTimeCtrl', Type: 0,Ch:1, Data: {} }),  //[0]
				//获取日期格式
				this.$store.dispatch('request', { url: 'digest/frmDeviceTimeCtrl', Type: 2,Ch:1, Data: {} }),  //[1]
				//获取时区支持
				this.$store.dispatch('request', { url: 'digest/frmGetTimeZoneCap', Type: 1,Ch:1, Data: {} }),   //[2]
				//获取设备时区及NTP服务配置
				this.$store.dispatch('request', { url: 'digest/frmNetNtpPara', Type: 0,Ch:1, Data: {} }),   //[3]
				//获取夏令时配置
				this.$store.dispatch('request', { url: 'digest/frmDDSTPara', Type: 0,Ch:1, Data: {} }),   //[4]
			]).then((_) => {
				if (_[0].Result == -655365 || _[1].Result == -655365 || _[2].Result == -655365 || _[3].Result == -655365|| _[4].Result == -655365) {
					//this.$notify.info(this.$store.getters.current_language["i18n_noright"]);
					this.$store.dispatch('config_no_right');
				} else {
					if (_[0].Result == 0 && _[1].Result == 0 && _[2].Result == 0 && _[3].Result == 0 && _[4].Result == 0) {
						//liuxin add 时间格式
						this.Data_format= _[1].Data.DeviceDateFormat;
						msg("---liuxin debug Data_format  "+this.Data_format);
						let date_format_tmp = 'yyyy-MM-dd';
						switch(this.Data_format){
							case 0: //MDY
								date_format_tmp = 'MM-dd-yyyy';
								break;
							case 1: //YMD
								date_format_tmp = 'yyyy-MM-dd';
								break;
							case 2:  //DMY
								date_format_tmp = 'dd-MM-yyyy';
								break;
							default:
								date_format_tmp = 'yyyy-MM-dd';
						}
						this.$store.dispatch('date_format_change', date_format_tmp);
						//liuxin add 时间格式
						//liuxin change 为了适配时间格式，从前面移动到这
						this.txtdev_time = this.make_time_by_array(_[0].Data.Time);
						//liuxin change 为了适配时间格式，从前面移动到这
						//liuxin add 支持的时区信息
						this.Support_Time_Zone=_[2].Data.TimeZone;
						msg("---liuxin debug --------Support_Time_Zone-------length : "+this.Support_Time_Zone.length);
						//msg("---liuxin debug : Desc : "+this.Support_Time_Zone[0].TimeZoneDescribe+" Type : "+this.Support_Time_Zone[1].TimeZoneType);
						for(let index =0;index < this.Support_Time_Zone.length;index++){
							msg("---liuxin debug : Desc : "+this.Support_Time_Zone[index].TimeZoneDescribe+" Type : "+this.Support_Time_Zone[index].TimeZoneType);
						}
						msg("---liuxin debug --------Support_Time_Zone--------end--------  ");
						//liuxin add 支持的时区信息
						this.d = _[3].Data;
						//liuxin change 适配双目时间
						//this.hour = this.d.TimeOffsetHour * 60 + this.d.TimeOffsetMinute;
						this.hour = this.d.TimeZoneType;
						//liuxin add 下面这坨代码,是之前的, 之前的select 的val 是偏移时间(min), 先不删,防止以后要拓展
						/*let sel_gmt = document.getElementById('selGMT').options;
						for (let i = 0; i < sel_gmt.length; i++) {
							if (this.hour == sel_gmt[i].value) {
								break;
							} else if (i < sel_gmt.length - 1 && (this.hour > 0 ? this.hour < sel_gmt[i + 1].value : this.hour < sel_gmt[i].value)) {
								this.hour = sel_gmt[i].value;
								break;
							} else if (i == sel_gmt.length - 1 && this.hour - sel_gmt[i].value < 60) {
								this.hour = sel_gmt[i].value;
							}
						}*/
						//liuxin change 适配双目时间
						this.dst = _[4].Data;
						//this.offset = this.dst.DSTBias/60;
						let Time_start=[],Time_stop=[];
						this.offset = this.dst.DSTBias;
						this.BeginPoint.Month=parseInt(this.dst.BeginPoint.Month);
						this.BeginPoint.WeekNo=parseInt(this.dst.BeginPoint.WeekNo);
						this.BeginPoint.WeekDate=parseInt(this.dst.BeginPoint.WeekDate);
						this.BeginPoint.Hour=parseInt(this.dst.BeginPoint.Hour);
						this.BeginPoint.Min=parseInt(this.dst.BeginPoint.Min);

						this.EndPoint.Month=parseInt(this.dst.EndPoint.Month);
						this.EndPoint.WeekNo=parseInt(this.dst.EndPoint.WeekNo);
						this.EndPoint.WeekDate=parseInt(this.dst.EndPoint.WeekDate);
						this.EndPoint.Hour=parseInt(this.dst.EndPoint.Hour);
						this.EndPoint.Min=parseInt(this.dst.EndPoint.Min);

						Time_start[0]=this.BeginPointByTime.Year=parseInt(this.dst.BeginPointByTime.Year);
						Time_start[1]=this.BeginPointByTime.Month=parseInt(this.dst.BeginPointByTime.Month);
						Time_start[2]=this.BeginPointByTime.Day=parseInt(this.dst.BeginPointByTime.Day);
						Time_start[3]=this.BeginPointByTime.Hour=parseInt(this.dst.BeginPointByTime.Hour);
						Time_start[4]=this.BeginPointByTime.Minute=parseInt(this.dst.BeginPointByTime.Minute);
						
						Time_stop[0]=this.EndPointByTime.Year=parseInt(this.dst.EndPointByTime.Year);
						Time_stop[1]=this.EndPointByTime.Month=parseInt(this.dst.EndPointByTime.Month);
						Time_stop[2]=this.EndPointByTime.Day=parseInt(this.dst.EndPointByTime.Day);
						Time_stop[3]=this.EndPointByTime.Hour=parseInt(this.dst.EndPointByTime.Hour);
						Time_stop[4]=this.EndPointByTime.Minute=parseInt(this.dst.EndPointByTime.Minute);

						this.txtDSTStart_time=this.DST_make_time_by_array(Time_start);
						this.txtDSTStop_time=this.DST_make_time_by_array(Time_stop);
						this.$notify.success(this.$store.getters.current_language['i18n_getok']);
					} else {
						this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
					}
				}
			});
		},
		methods: {
			//liuxin add 夏令时日期调整
			DST_make_time_by_array(Time) {
				let time = $.extend(true, [], Time);
				return (
					Time.slice(0, 3)
						.map((item) => (item < 10 ? '0' + item : item))
						.join('-') +
					' ' +
					Time.slice(3, 5)
						.map((item) => (item < 10 ? '0' + item : item))
						.join(':')
				);
			},
			//liuxin add 夏令时日期调整
			make_time_by_array(Time) {
				let time = $.extend(true, [], Time);
				switch (this.$store.getters.base.date_format) {
					case 'MM-dd-yyyy':
						Time[0] = time[1];
						Time[1] = time[2];
						Time[2] = time[0];
						break;
					case 'dd-MM-yyyy':
						Time[0] = time[2];
						Time[1] = time[1];
						Time[2] = time[0];
						break;
					case 'yyyy-MM-dd':
						Time[0] = time[0];
						Time[1] = time[1];
						Time[2] = time[2];
						break;
				}
				return (
					Time.slice(0, 3)
						.map((item) => (item < 10 ? '0' + item : item))
						.join('-') +
					' ' +
					Time.slice(3, 6)
						.map((item) => (item < 10 ? '0' + item : item))
						.join(':')
				);
			},
			set_device_time(...args) {
				let Time = [];
				//let isNeedReboot = false;
				if (args[1] && args[1] == 'pc') {
					msg("---liuxin add debug ---set_device_time--");
					let myDate = new Date();
					Time = [myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), myDate.getHours(), myDate.getMinutes(), myDate.getSeconds()];
					//liuxin change 调整下时间和时区差值的对应关系获取
					msg("---liuxin debug hour 00000  :"+this.Time_Zone_Delte.length);
					for(let index=0;index<this.Time_Zone_Delte.length;index++){
						if(this.Time_Zone_Delte[index].Delte == -myDate.getTimezoneOffset()){
							this.hour =this.Time_Zone_Delte[index].Zone;
							msg("---liuxin debug hour 1111111111  :"+this.hour);
							break;
						}
					}
					/*Promise.all([
						this.$store.dispatch('request', {
							url: 'digest/frmNetNtpPara',
							Type: 1,
							Ch:1,
							Data: {
								EnableNTP:this.d.EnableNTP,
								NTPServer:this.d.NTPServer,
								TimeZoneType:this.d.hour,
								EnableBias:this.d.EnableBias,
								TimeOffsetMinute:this.d.TimeOffsetMinute,
								TimeInterval:this.d.TimeInterval
							},
						}),
						this.$store.dispatch('request', {
							url: 'digest/frmDeviceTimeCtrl',
							Type: 1,
							Ch:1,
							Data: { Time },
							TimeOut: 3000
						}),
					]).then((_) => {
						if (_[0].Result == -655365 || _[0].Result == -655365) {
							//this.$notify.info(this.$store.getters.current_language["i18n_noright"]);
							this.$store.dispatch('config_no_right');
						} else {
							this.txtdev_time = this.make_time_by_array(Time);
							if(_[0].Result == 0) {
								//this.txtdev_time = this.make_time_by_array(Time);
								this.$notify.success(this.$store.getters.current_language['i18n_settimeok']);
							}else{
								this.$notify.error(this.$store.getters.current_language['i18n_settimefailed']);
							}
							if(_[0].Result != 0) {
								this.$notify.error(this.$store.getters.current_language['i18n_settimezone_failed']);
							}
						}
					});*/
					/*this.$store
						.dispatch('request', {
							url: 'digest/frmNetNtpPara',
							Type: 1,
							Ch:1,
							Data: {
								EnableNTP:this.d.EnableNTP,
								NTPServer:this.d.NTPServer,
								TimeZoneType:this.d.hour,
								EnableBias:this.d.EnableBias,
								TimeOffsetMinute:this.d.TimeOffsetMinute,
								TimeInterval:this.d.TimeInterval
							},
						})
						.then((_) => {
							if (_.Result == -655365) {
								this.$store.dispatch('config_no_right');
							} else if (_.Result == 0) {
								//isNeedReboot = _.Data.NeedReboot;*/
								this.$store
									.dispatch('request', {
										url: 'digest/frmDeviceTimeCtrl',
										Type: 1,
										Ch:1,
										Data: { Time },
									})
									.then((result) => {
										if (result.Result == 0) {
											this.txtdev_time = this.make_time_by_array(Time);
											this.$notify.success(this.$store.getters.current_language['i18n_settimeok']);
										} else if (result.Result == -655365) {
											this.$store.dispatch('config_no_right');
										} else {
											this.$notify.error(this.$store.getters.current_language['i18n_settimefailed']);
										}
									});
							/*} else {
								this.$notify.error(this.$store.getters.current_language['i18n_settimezone_failed']);
							}
						});*/
				} else {
					msg("---liuxin add debug ---set_device_time-22222-");
					let v = this.txtdev_time.split(' ');
					let v0 = v[0].split('-').map((_) => parseInt(_, 10));
					let v1 = v[1].split(':').map((_) => parseInt(_, 10));
					let date = $.extend(true, [], v0);
					switch (this.$store.getters.base.date_format) {
						case 'MM-dd-yyyy':
							v0[0] = date[2];
							v0[1] = date[0];
							v0[2] = date[1];
							break;
						case 'dd-MM-yyyy':
							v0[0] = date[2];
							v0[1] = date[1];
							v0[2] = date[0];
							break;
						case 'yyyy-MM-dd':
							v0[0] = date[0];
							v0[1] = date[1];
							v0[2] = date[2];
							break;
					}
					Time = v0.concat(v1);
					this.$store
						.dispatch('request', {
							url: 'digest/frmDeviceTimeCtrl',
								Type: 1,
								Ch:1,
								Data: { Time },
								TimeOut: 3000
						})
						.then((result) => {
							if (result.Result == 0) {
								this.txtdev_time = this.make_time_by_array(Time);
								this.$notify.success(this.$store.getters.current_language['i18n_settimeok']);
							} else if (result.Result == -655365) {
								this.$store.dispatch('config_no_right');
							} else {
								this.$notify.error(this.$store.getters.current_language['i18n_settimefailed']);
							}
						})
						.catch((e) => {
							error(e);
							msg("---liuxin add debug ---set_device_time-err-");
                        	//this.jump();
						});                   
				}
			},
			/*timeFull(n) {
				let just = Math.abs(n);
				if (just < 10) {
					return (n < 0 ? '-0' : '0') + just;
				}
				return n + '';
			},*/
			save() {
				if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
					this.$notify.error(this.$store.getters.current_language['i18n_checkinput']);
					return;
				}
				this.d.EnableNTP = this.d.EnableNTP ? 1 : 0;
				//this.d.NTPPort = parseInt(this.d.NTPPort, 10);
				this.d.TimeOffsetMinute = parseInt(this.d.TimeOffsetMinute, 10);
				//这个地方先屏蔽了,设置NTP 校时 间隔的时候。 这个要给 字符串，和语言有出入
				//this.d.TimeInterval = parseInt(this.d.TimeInterval, 10);
				msg("---liuxin add debug d.TimeOffsetMinute  "+this.d.TimeOffsetMinute);
				msg("---liuxin add debug d.TimeInterval "+this.d.TimeInterval);
				//this.d.TimeOffsetHour = parseInt(this.hour / 60, 10);
				//this.dst.AutoReboot = this.d.AutoReboot = 0;

				this.dst.EnableDST = this.dst.EnableDST ? 1 : 0;
				this.dst.DSTBias = parseInt(this.offset, 10);
				this.dst.BeginPoint=this.BeginPoint;
				this.dst.EndPoint= this.EndPoint;
				this.dst.BeginPointByTime = this.BeginPointByTime;

				this.dst.EndPointByTime = this.EndPointByTime;

				//let isNeedReboot = false;
				this.$store
					.dispatch('request', {
						url: 'digest/frmNetNtpPara ',
						Type: 1,
						Ch:1,
						Data: this.d,
					})
					.then((_) => {
						if (_.Result == -655365) {
							this.$store.dispatch('config_no_right');
						} else if (_.Result == 0) {
							/*if (_.Data.NeedReboot) {
								isNeedReboot = true;
							}*/
							this.$store
								.dispatch('request', {
									url: 'digest/frmDDSTPara',
									Type: 1,
									Ch:1,
									Data: this.dst,
								})
								.then((_) => {
									if (_.Result == -655365) {
										this.$store.dispatch('config_no_right');
									} else if (_.Result == 0) {
										/*if (_.Data.NeedReboot) {
											isNeedReboot = true;
										}*/
										/*if (isNeedReboot) {
											this.$store.dispatch('request', { url: 'goform/frmDeviceReboot', Type: 0, Data: {} });
											alert(this.$store.getters.current_language['i18n_update_ok']);
										} else {
											this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
										}*/
										this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
									} else {
										this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
									}
								});
							setTimeout(() => {
								this.$store
									.dispatch('request', {
										url: 'digest/frmDeviceTimeCtrl',
										Type: 0,
										Ch:1,
										Data: {},
									})
									.then((_) => {
										if (_.Result == 0) {
											this.txtdev_time = this.make_time_by_array(_.Data.Time);
											msg(this.txtdev_time);
										}
									});
							}, 1000);
						} else {
							this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
						}
					});
			},
			//liuxin add 夏令时日期调整
			show_calendar_DSTStart(e) {
				e.target.isDateOnly = false;
				this.$store.getters.calendar.show(e.target, this.hide_calendar_DSTStart);
			},
			hide_calendar_DSTStart(ctrl) {
				msg("--liuxin--debug ctrl.value: " +ctrl.value);
				let Time = [];
				let lx_tmp = ctrl.value.split(' ');
				msg("--liuxin--debug lx_tmp length : " +lx_tmp.length);
				for(let i=0;i<lx_tmp.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp[i]);
				let lx_tmp1 = lx_tmp[0].split('-');
				msg("--liuxin--debug lx_tmp1 length : " +lx_tmp1.length);
				for(let i=0;i<lx_tmp1.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp1[i]);
				Time[0]=parseInt(lx_tmp1[0]);
				Time[1]=parseInt(lx_tmp1[1]);
				Time[2]=parseInt(lx_tmp1[2]);
				let lx_tmp2 = lx_tmp[1].split(':');
				msg("--liuxin--debug lx_tmp2 length : " +lx_tmp2.length);
				for(let i=0;i<lx_tmp2.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp2[i]);
				Time[3]=parseInt(lx_tmp2[0]);
				Time[4]=parseInt(lx_tmp2[1]);
				//Time[5]=parseInt(lx_tmp2[2]);
				msg("--liuxin--debug Time length : " +Time.length);
				for(let i=0;i<Time.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +Time[i]);
				this.BeginPointByTime.Year=Time[0];
				this.BeginPointByTime.Month=Time[1];
				this.BeginPointByTime.Day=Time[2];
				this.BeginPointByTime.Hour=Time[3];
				this.BeginPointByTime.Minute=Time[4];
				this.txtDSTStart_time = this.DST_make_time_by_array(Time);
				//this.txtdev_time = ctrl.value;
				var _n = $(ctrl).attr('name');
				if (!_n) return;
			},
			show_calendar_DSTStop(e) {
				e.target.isDateOnly = false;
				this.$store.getters.calendar.show(e.target, this.hide_calendar_DSTStop);
			},
			hide_calendar_DSTStop(ctrl) {
				msg("--liuxin--debug ctrl.value: " +ctrl.value);
				let Time = [];
				let lx_tmp = ctrl.value.split(' ');
				msg("--liuxin--debug lx_tmp length : " +lx_tmp.length);
				for(let i=0;i<lx_tmp.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp[i]);
				let lx_tmp1 = lx_tmp[0].split('-');
				msg("--liuxin--debug lx_tmp1 length : " +lx_tmp1.length);
				for(let i=0;i<lx_tmp1.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp1[i]);
				Time[0]=parseInt(lx_tmp1[0]);
				Time[1]=parseInt(lx_tmp1[1]);
				Time[2]=parseInt(lx_tmp1[2]);
				let lx_tmp2 = lx_tmp[1].split(':');
				msg("--liuxin--debug lx_tmp2 length : " +lx_tmp2.length);
				for(let i=0;i<lx_tmp2.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp2[i]);
				Time[3]=parseInt(lx_tmp2[0]);
				Time[4]=parseInt(lx_tmp2[1]);
				//Time[5]=parseInt(lx_tmp2[2]);
				msg("--liuxin--debug Time length : " +Time.length);
				for(let i=0;i<Time.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +Time[i]);
				this.EndPointByTime.Year=Time[0];
				this.EndPointByTime.Month=Time[1];
				this.EndPointByTime.Day=Time[2];
				this.EndPointByTime.Hour=Time[3];
				this.EndPointByTime.Minute=Time[4];
				this.txtDSTStop_time = this.DST_make_time_by_array(Time);
				//this.txtdev_time = ctrl.value;
				var _n = $(ctrl).attr('name');
				if (!_n) return;
			},
			//liuxin add 夏令时日期调整
			show_calendar(e) {
				e.target.isDateOnly = false;
				this.$store.getters.calendar.show(e.target, this.hide_calendar);
			},
			hide_calendar(ctrl) {
				msg("--liuxin--debug ctrl.value: " +ctrl.value);
				let Time = [];
				let lx_tmp = ctrl.value.split(' ');
				msg("--liuxin--debug lx_tmp length : " +lx_tmp.length);
				for(let i=0;i<lx_tmp.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp[i]);
				let lx_tmp1 = lx_tmp[0].split('-');
				msg("--liuxin--debug lx_tmp1 length : " +lx_tmp1.length);
				for(let i=0;i<lx_tmp1.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp1[i]);
				Time[0]=parseInt(lx_tmp1[0]);
				Time[1]=parseInt(lx_tmp1[1]);
				Time[2]=parseInt(lx_tmp1[2]);
				let lx_tmp2 = lx_tmp[1].split(':');
				msg("--liuxin--debug lx_tmp2 length : " +lx_tmp2.length);
				for(let i=0;i<lx_tmp2.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +lx_tmp2[i]);
				Time[3]=parseInt(lx_tmp2[0]);
				Time[4]=parseInt(lx_tmp2[1]);
				Time[5]=parseInt(lx_tmp2[2]);
				msg("--liuxin--debug Time length : " +Time.length);
				for(let i=0;i<Time.length;i++)
					msg("--liuxin--debug lx_tmp[i]: " +Time[i]);
				this.txtdev_time = this.make_time_by_array(Time);
				//this.txtdev_time = ctrl.value;
				var _n = $(ctrl).attr('name');
				if (!_n) return;
			},
		},
		computed: {
			//liuxin add 时区微调规格变化
			Check_UTC: {
				get: function() {
					let enable_micro = this.d.EnableBias;
					if(enable_micro){
						let min = this.d.TimeOffsetMinute;
						return min;
					}else{
						let min='00';
						return min;
					}
				},
				set: function(value) {
					if (!UTC_Micro(value)) {
						return;
					}
					this.d.TimeOffsetMinute=value;
				},
			},
			//liuxin add 时区微调规格变化
			//liuxin change 时区微调规格变化
			Check_GMT: {
				get: function() {
					//liuxin change 时区微调规格变化
					/*let hour = parseInt(this.hour / 60, 10);
					let min = this.hour % 60;
					if (this.minute) {
						min = this.d.TimeOffsetMinute;
						this.minute--;
					}
					this.d.TimeOffsetMinute = min;
					return this.timeFull(hour) + ':' + this.timeFull(Math.abs(this.d.TimeOffsetMinute));*/
					let min = this.hour;
					min = this.d.TimeOffsetMinute;
					this.d.TimeOffsetMinute = min;
					return min;
					//liuxin change 时区微调规格变化
				},
				set: function(value) {
					let GMTArr = value.split(':');
					//liuxin change 时区微调规格变化
					/*if (!GMT_Check(value)) {
						return;
					}*/
					if (!UTC_Micro(value)) {
						return;
					}
					//liuxin change 时区微调规格变化
					GMTArr[0] = parseInt(GMTArr[0], 10);
					GMTArr[1] = parseInt(GMTArr[1], 10);

					let sel_gmt = document.getElementById('selGMT').options;
					let allMinute = GMTArr[0] < 0 ? GMTArr[0] * 60 - GMTArr[1] : GMTArr[0] * 60 + GMTArr[1];
					for (let i = 0; i < sel_gmt.length; i++) {
						if (allMinute == sel_gmt[i].value) {
							this.hour = allMinute;
							break;
						} else if (i < sel_gmt.length - 1 && (allMinute > 0 ? allMinute < sel_gmt[i + 1].value : allMinute < sel_gmt[i].value)) {
							this.hour = sel_gmt[i].value;
							break;
						} else if (i == sel_gmt.length - 1 && allMinute - sel_gmt[i].value < 60) {
							this.hour = sel_gmt[i].value;
						}
					}
					this.d.TimeOffsetMinute = GMTArr[1];
					this.minute++;
				},
			},
			//liuxin change 时区微调规格变化
		},
	};
</script>
