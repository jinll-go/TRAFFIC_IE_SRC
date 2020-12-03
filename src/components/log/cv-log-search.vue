<template>
	<div class="w100 ">
		<div class="w100">
			<div :class="[$store.getters.is_tyconew || $store.getters.is_dongshun ? 'td_bg pl10' : '']"><label class="bold" v-tr="i18n_logSearch"></label></div>
			<ul class="menu">
				<li>
					<div class="log_1 text_center"><label v-tr="i18n_logType"></label></div>
					<div class="log_2">
						<select class="w99  textc" @change="getLogMainType($event)">
							<option value="0" v-tr="i18n_all" selected="selected"></option>
							<option value="1" v-tr="i18n_alarm"></option>
							<option value="2" v-tr="i18n_exception"></option>
							<option value="3" v-tr="i18n_operation"></option>
							<option value="4" v-tr="i18n_config"></option>
						</select>
					</div>
				</li>

				<li>
					<div class="log_1 text_center"><label v-tr="i18n_logType"></label></div>
					<div class="log_2">
						<select class="w99  textc" @change="getLogSubType($event)">
							<option value="0" v-tr="i18n_all" selected="selected"></option>
							<option value="1" v-tr="i18n_new_log_1"></option>
							<option value="2" v-tr="i18n_new_log_2"></option>
							<option value="3" v-tr="i18n_new_log_3"></option>
							<option value="4" v-tr="i18n_new_log_4"></option>
   							<option value="5" v-tr="i18n_new_log_5"></option>
							<option value="6" v-tr="i18n_new_log_6"></option>
							<option value="9" v-tr="i18n_new_log_9"></option>	
							<option value="10" v-tr="i18n_new_log_10"></option>	
							<option value="25" v-tr="i18n_new_log_25"></option>	
							<option value="26" v-tr="i18n_new_log_26"></option>	
							<option value="27" v-tr="i18n_new_log_27"></option>	
							<option value="28" v-tr="i18n_new_log_28"></option>	
							<option value="29" v-tr="i18n_new_log_29"></option>	
							<option value="30" v-tr="i18n_new_log_30"></option>	
							<option value="31" v-tr="i18n_new_log_31"></option>	
							<option value="32" v-tr="i18n_new_log_32"></option>	
							<option value="33" v-tr="i18n_new_log_33"></option>	
							<option value="36" v-tr="i18n_new_log_36"></option>	
							<option value="39" v-tr="i18n_new_log_39"></option>	
							<option value="40" v-tr="i18n_new_log_40"></option>	
							<option value="47" v-tr="i18n_new_log_47"></option>	
							<option value="48" v-tr="i18n_new_log_48"></option>	
							<option value="49" v-tr="i18n_new_log_49"></option>	
							<option value="50" v-tr="i18n_new_log_50"></option>	
							<option value="51" v-tr="i18n_new_log_51"></option>	
							<option value="52" v-tr="i18n_new_log_52"></option>	
							<option value="53" v-tr="i18n_new_log_53"></option>	
							<option value="60" v-tr="i18n_new_log_60"></option>	
							<option value="61" v-tr="i18n_new_log_61"></option>	
							<option value="73" v-tr="i18n_new_log_73"></option>	
							<option value="74" v-tr="i18n_new_log_74"></option>	
							<option value="81" v-tr="i18n_new_log_81"></option>	
							<option value="82" v-tr="i18n_new_log_82"></option>	
							<option value="83" v-tr="i18n_new_log_83"></option>	
							<option value="84" v-tr="i18n_new_log_84"></option>	
						</select>
					</div>
				</li>

				<li>
					<div class="log_1 text_center"><label v-tr="i18n_beginTime"></label></div>
					<div class="log_2">
						<input class="w99  textc" ref="begin_time" name="starttime" :value="starttime" @click="show_calendar" readonly="true" />
					</div>
				</li>
				<li>
					<div class="log_1 text_center"><label v-tr="i18n_endTime"></label></div>
					<div class="log_2">
						<input class="w99  textc" ref="end_time" name="endtime" :value="endtime" @click="show_calendar" readonly="true" />
					</div>
				</li>
				<li>
					<div class="log_1 text_center"><label v-tr="i18n_pageNum"></label></div>
					<div class="log_2">
						<select class="w99  textc" @change="getPageNum($event)">
							<option value="20">20</option>
							<option value="30" selected="selected">30</option>
							<option value="40">40</option>
							<option value="50">50</option>
						</select>
					</div>
				</li>
				
				<li>
					<div class="log_2">
					<button @click="search" :class="button_style" style="width:140px;" v-tr="i18n_search"></button>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { LocalTimeToUTC, pad } from "common/util";
	import style from "mixin/style";
	export default {
		name: "CVLogSearch",
		mixins: [style],
		data() {
			return {
				check_times: false,
			};
		},
		methods: {
			getLogMainType(e) {
				//       msg('get logtype');
				this.$store.dispatch("logMaintype_val_changed", parseInt(e.target.value));
			},
			getLogSubType(e) {
				this.$store.dispatch("logSubtype_val_changed", parseInt(e.target.value));
			},
			getPageNum(e) {
				this.$store.dispatch("pagenum_val_changed", parseInt(e.target.value));
			},
			search() {
				//     msg("search");
				this.$emit("search");
			},
			LocalToUTC(val) {
				// let t = new Date();
				let ar = val.split("-");
				// let y, m, d, hour, min, sec;
				switch (this.$store.getters.base.date_format) {
					case "MM-dd-yyyy":
						[ar[1], ar[2], ar[0]] = ar;
						// y = ar[2];
						// m = ar[0];
						// d = ar[1];
						break;
					case "dd-MM-yyyy":
						[ar[2], ar[1], ar[0]] = ar;
						// y = ar[2];
						// m = ar[1];
						// d = ar[0];
						break;
					default:
						[ar[0], ar[1], ar[2]] = ar;
						// y = ar[0];
						// m = ar[1];
						// d = ar[2];
						break;
				}
				// hour = parseInt(ar[3], 10);
				// min = parseInt(ar[4], 10);
				// sec = parseInt(ar[5], 10);
				// let time = LocalTimeToUTC(
				//     new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10), parseInt(ar[3], 10), parseInt(ar[4], 10), parseInt(ar[5], 10)),
				// );
				//time -= parseInt(t.getTimezoneOffset())*60;
				//return `${pad(y)}${pad(m)}${pad(d)}${pad(hour)}${pad(min)}${pad(sec)}`;
				return ar.join("");
			},
			show_calendar(e) {
				msg("show_calendar");
				e.target.isDateOnly = false;
				this.calendar.show(e.target, this.hide_calendar);
			},
			hide_calendar(ctrl) {
				msg("hide_calendar");
				var _n = $(ctrl).attr("name");
				if (!_n) return;

				this.$store.dispatch(_n + "_val_changed", (ctrl.value));

				//check time
				if (parseInt(this.$store.getters.log.StartTime, 10) > parseInt(this.$store.getters.log.EndTime, 10)) {
					this.check_times = true;
				} else {
					this.check_times = false;
				}
			},
		},
		mounted() {
			let ctrl = this.$refs.begin_time;
			ctrl.value = new Date().format(this.$store.getters.base.date_format);
			this.$store.dispatch("starttime_val_changed", (ctrl.value + " 00:00:00"));
			ctrl.value = ctrl.value + " 00:00:00";

			ctrl = this.$refs.end_time;
			ctrl.value = new Date().format(this.$store.getters.base.date_format);
			this.$store.dispatch("endtime_val_changed",(ctrl.value + " 23:59:59"));
			ctrl.value = ctrl.value + " 23:59:59";
		},
		computed: {
			calendar() {
				return this.$store.getters.calendar;
			},
			starttime() {
				let val = this.$store.getters.log.StartTime;
				return val;
			},
			endtime() {
				let val = this.$store.getters.log.EndTime;
				return val;
			},
		},
	};
</script>
