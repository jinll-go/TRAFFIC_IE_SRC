<template>
	<table width="99%" border="0" align="left" cellpadding="0" cellspacing="0" :class="{ input_check_error: showerror }">
		<!--<tr>
			<td align="right" width="20%"><label v-tr="i18n_Weekday"></label>&nbsp;:</td>
			<td>
				&nbsp;
				<select id="start_wd" class="textc" style="margin-left:15px;width:100px;" v-model="weekday" :disabled="all_enable">
					<option :value="0" v-tr="i18n_Monday"></option>
					<option :value="1" v-tr="i18n_Tusday"></option>
					<option :value="2" v-tr="i18n_Wenday"></option>
					<option :value="3" v-tr="i18n_Thusday"></option>
					<option :value="4" v-tr="i18n_Friday"></option>
					<option :value="5" v-tr="i18n_Satday"></option>
					<option :value="6" v-tr="i18n_Sunday"></option>
				</select>
			</td>
		</tr>-->

		<tr v-for="(item, idx) in list">
			<td height="34" align="right" width="20%">
				<label v-tr="item.text"><!--周一-i18n_TimeSeg1--></label>:
			</td>
			<td align="left" width="80%">
                <input type="checkbox" name="checkbox2" id="sec0" :checked="item.checked" :disabled="all_enable" @change="section_chk_changed($event, idx)" />
				&nbsp;
				<select
					name="be_hour"
					id="be_hour_0"
					class="textc"
					style="width: 50px;"
					:value="item.list[0]"
					:disabled="all_enable ? true : !item.checked"
					@change="section_time_change($event, item, idx, 0)"
				>
					<option v-for="i1 in 24" :value="i1 - 1">{{ i1 - 1 }}</option>
				</select>
				<select
					name="be_min"
					id="be_min_0"
					class="textc"
					style="width: 50px;"
					:value="item.list[1]"
					:disabled="all_enable ? true : !item.checked"
					@change="section_time_change($event, item, idx, 1)"
				>
					<option v-for="i2 in 60" :value="i2 - 1">{{ i2 - 1 }}</option>
				</select>
				-
				<select
					name="end_hour"
					id="end_hour_0"
					class="textc"
					style="width: 50px;"
					:value="item.list[2]"
					:disabled="all_enable ? true : !item.checked"
					@change="section_time_change($event, item, idx, 2)"
				>
					<option v-for="i3 in 24" :value="i3 - 1">{{ i3 - 1 }}</option>
				</select>
				<select
					name="end_min"
					id="end_min_0"
					class="textc"
					style="width: 50px;"
					:value="item.list[3]"
					:disabled="all_enable ? true : !item.checked"
					@change="section_time_change($event, item, idx, 3)"
				>
					<option v-for="i4 in 60" :value="i4 - 1">{{ i4 - 1 }}</option>
				</select>
			</td>
		</tr>
	</table>
</template>
<script>
	import Vue from 'vue';
    import { check_times, generate_default_alarmtime } from 'common/util';
	export default {
		name: 'CVConfigSection',
		model: {
			//清除默认的v-model绑定
			prop: 'alarmtime',
			event: 'input',
		},
		props: {
			type: {
				//&*1 一天一个时间段模式. or 7*8 一天8个时间段模式
				type: String,
				default: 'SECTION_EIGHT',
			},
			disabled: {
				type: Boolean,
				default: true,
			},
			weekday: {
				//7*8 模式下有效, 天的序号
				type: Number,
                default: 0,
			},
			alarmtime: {
				//7*8
				type: Array,
                default: generate_default_alarmtime(),
			},
		},
		data() {
			return {
                list: this.get_list(),
				showerror: false,
			};
		},
        
		computed: {
			all_enable() {
				return this.disabled;
			},
		},
		watch: {
			alarmtime(newVal, oldVal) {
				if (!newVal || newVal.length == 0) return;
                this.list = this.get_list();
			},
			weekday(newVal, oldVal) {
				msg('weekday', newVal);
				let idx = parseInt(newVal, 10);
				let vec = this.alarmtime;

                if (this.type == 'SECTION_EIGHT') {
					//
                    /*} else {
					if (this.list.length) {
						vec[idx].forEach((item, idx) => {
							Vue.set(
								this.list,
								idx,
								$.extend(true, this.list[idx], {
									list: item,
									checked: item.filter((item) => item > 0).length ? true : false,
								}),
							);
						});
                    }*/
                    this.list = this.get_list();
				}
			},
		},
		methods: {
            get_list() {
                let tmp = [];
                if (this.type == 'SECTION_SEVEN') {
                    //
                    let wday = ['i18n_Monday', 'i18n_Tusday', 'i18n_Wenday', 'i18n_Thusday', 'i18n_Friday', 'i18n_Satday', 'i18n_Sunday'];
                    this.alarmtime.forEach((item, idx) => {
                        tmp[idx] = {
                            text: wday[idx],
                            list: item[0],
                            checked: item[0].some((item) => item > 0),
                        };
                    });
                } else {
                    this.alarmtime[this.weekday].forEach((item, idx) => {
                        tmp[idx] = {
                            text: 'i18n_TimeSeg' + (idx + 1),
                            list: item,
                            checked: item.some((item) => item > 0),
                        };
                    });
                }
                return tmp;
            },
			check_all_rows() {
				//循环遍历 所有checked的 row
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].checked) {
						if (!check_times(this.list[i].list)) {
							this.$notify.error(this.$store.getters.current_language['i18n_sectiontime_error']);
							this.showerror = true;
							return false;
						} else {
							this.showerror = false;
						}
					}
				}
				this.showerror = false;
				return true;
			},
			set_alarmTime({ day_idx, section_idx, value }) {
				this.alarmtime[day_idx][section_idx] = value;
				this.$emit('input', this.alarmtime.concat());
			},
            section_chk_changed(e, idx) {
				if (!e.target.checked) {
					let info = {};
					if (this.type == 'SECTION_SEVEN') {
						//this.$store.dispatch('section/row/data_change', { day_idx: idx, section_idx: 0, value: [0, 0, 0, 0] });
						info = { day_idx: idx, section_idx: 0, value: [0, 0, 0, 0] };
					} else {
						//this.$store.dispatch('section/row/data_change', { day_idx: this.weekday, section_idx: idx, value: [0, 0, 0, 0] });
						info = { day_idx: this.weekday, section_idx: idx, value: [0, 0, 0, 0] };
					}
					this.set_alarmTime(info);
				}
				this.list[idx].list = [0, 0, 0, 0];
				this.list[idx].checked = e.target.checked;

				if (!this.check_all_rows()) return;
			},
			section_time_change(e, item, idx, sub_idx) {
				let el = e.target;
				let value = parseInt(el.options[el.selectedIndex].value, 10);
				item.list[sub_idx] = value;

				this.check_all_rows();

				this.list[idx].list = item.list.concat();
				let info = {};
				if (this.type == 'SECTION_SEVEN') {
					//	this.$store.dispatch('section/row/data_change', { day_idx: idx, section_idx: 0, value: item.list.concat() });
					info = { day_idx: idx, section_idx: 0, value: item.list.concat() };
				} else {
					//	this.$store.dispatch('section/row/data_change', { day_idx: this.weekday, section_idx: idx, value: item.list.concat() });
					info = { day_idx: this.weekday, section_idx: idx, value: item.list.concat() };
				}
				this.set_alarmTime(info);
			},
		},
	};
</script>
