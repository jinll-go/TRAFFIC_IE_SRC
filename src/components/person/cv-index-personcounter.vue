<template>
    <div class="main_con_k clearfix person_list" >

        <div class="main_con_top_face">
            <div class="fl pl10 bold"><label v-tr="i18n_CounterReport"><!-- 计数报表 --></label></div>
        </div>

        <div class="main_con_mid_face">
            <div>
                <table style="width: 100%">
                    <tr>
                        <td style="width: 25%;">
                            <label v-tr="i18n_QueryType"></label>:
                            <select type="text" class="textc" v-model="query_type" style="width: 88px">
                                <option :value="1" v-tr="i18n_DailyReport"></option>
                                <option :value="2" v-tr="i18n_MonthlyReport"></option>
                            </select>
                        </td>
                        <td style="width: 25%;">
                            <label v-tr="i18n_dectLine"></label>:
                            <select type="text" class="textc" v-model="region_idx" style="width: 88px">
                                <option v-for="n in 4" :value="n-1">{{n}}</option>
                            </select>
                        </td>
                        <td style="width: 25%;" v-show="query_type == 1">
                            <label v-tr="i18n_Time"></label>:
                            <input class="textc" ref="start_time" name="starttime" :value="starttime" @click="show_calendar" readonly="readonly" style="width: 160px"/>
                        </td>
                        <td style="width: 25%;" v-show="query_type == 2">
                            <label v-tr="i18n_Time"></label>:
                            <select style="width:80px" class="textc" v-model="starttime_year">
                                <option v-for="n in 73" :value="n + 1969">{{n + 1969}}</option>
                            </select>
                            <select style="width: 80px" class="textc" v-model="starttime_month">
                                <option v-for="n in 12" :value="n">{{n}}</option>
                            </select>
                        </td>

                        <td>
                            <button :class="button_style" style="width: 88px" @click="btn_query" v-tr="i18n_query" :disabled="query_disabled"></button>
                            &nbsp;&nbsp;
                            <button :class="button_style" style="width: 88px" @click="btn_export" v-show="list.length" :disabled="export_disabled" v-tr="i18n_Export"></button>
                        </td>
                    </tr>
                    <tr>
                        <td v-if="false">
                            <label v-tr="i18n_StatisticalDirection"></label>:
                            <input type="checkbox" id="whitelist" name="listtype" :value="1" v-model="ListType"/>
                            <label for="whitelist" v-tr="i18n_Enter"></label>&nbsp;&nbsp;
                            <input type="checkbox" id="blacklist" name="listtype" :value="2" v-model="ListType"/>
                            <label for="blacklist" v-tr="i18n_Leave"></label>
                        </td>
                        <td>
                            <label v-tr="i18n_ShowType"><!-- 显示类型 --></label>:
                            <input type="radio" id="Histogram" name="querytype" :value="0" v-model="ShowMode"/>
                            <label for="Histogram" v-tr="i18n_HistogramCharts"></label>&nbsp;&nbsp;
                            <input type="radio" id="LineChart" name="querytype" :value="1" v-model="ShowMode"/>
                            <label for="LineChart" v-tr="i18n_LineChart"></label>&nbsp;&nbsp;
                            <input type="radio" id="List" name="querytype" :value="2" v-model="ShowMode"/>
                            <label for="List" v-tr="i18n_List"></label>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="w100 text_center mt40" style="margin-bottom: 20px">
                <label>{{tips}}</label>
            </div>

            <!-- 列表展示 -->
            <div class="w100" v-if="ShowMode == 2">
                <table  border="0" cellspacing="0" cellpadding="0" class="_table" style="width: 70%;margin: 0 auto">
                    <tr>
                        <th  class="_th text_center" style="width: 15%"><label v-tr="i18n_NO"></label></th>
                        <th  class="_th text_center" style="width: 40%"><label v-tr="i18n_statisticalTime"></label></th>
                        <th  class="_th text_center" style="width: 15%"><label v-tr="i18n_dectLine"></label></th>
                        <th  class="_th text_center" style="width: 15%"><label v-tr="i18n_Enter"></label></th>
                        <th  class="_th text_center" style="width: 15%"><label v-tr="i18n_Leave"></label></th>
                    </tr>
                    <tr v-for="(item,idx) in list">
                        <!-- <td  class="_td text_center"><label>{{idx+1}}</label></td> -->
                        <td  class="_td text_center"><label>{{idx+1}}</label></td>
                        <td  class="_td text_center"><label>{{item.Time}}</label></td>
                        <td  class="_td text_center"><label>{{item.RegionIdx+1}}</label></td>
                        <td  class="_td text_center"><label>{{item.EnterCnt}}</label></td>
                        <td  class="_td text_center"><label>{{item.LeaveCnt}}</label></td>
                    </tr>
                    <tr  v-if="list.length == 0">
                        <td class="_td text_center" width="100%" height="24" align="right" colspan="9" >
                            <div style="width:60%;margin: 5px auto 5px auto;text-align:center;"  v-tr="i18n_no_result" ></div>
                        </td>
                    </tr>
                </table>
                <table border="0" cellspacing="0" cellpadding="0" class="_table" style="width: 70%;margin: 0 auto" v-show="flag == true">
                    <tr>
                        <td colspan="3" class="_td text_center" style="width:70%">
                                <label v-tr="i18n_Aggregate"></label>:
                        </td>
                        <td class="_td text_center" style="width:15%">{{ SumEnterCnt }}</td>
                        <td class="_td text_center" style="width:15%">{{ SumLeaveCnt }}</td>
                    </tr>
                </table>
            </div>

            <!-- 柱状图或折线图 -->
            <div class="w100" v-else>
                <v-chart :options="chartOption" style="width: 100%"/>
            </div>
          
        </div>
    </div>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import { current_year, current_month, LocalTimeToUTC } from 'common/util';
import person_report_export from 'mixin/person_report_export';
import style from 'mixin/style';
export default {
	name: 'CVIndexPersonCounter',
	mixins: [style, person_report_export],
	data() {
		return {
			list: [],
			starttime: '',
			endtime: '',
			query_type: 1,
			region_idx: 0,
			ShowMode: 0,
			ListType: 1,
			handle: 0,
			resultCount: 0,
			starttime_year: current_year,
			starttime_month: current_month,
			lang: this.$store.getters.current_language,
			chartOption: {},
			export_dir: '',
			Sum_count: {},
			query_disabled: false,
			export_disabled: false,
			SumEnterCnt: 0,
			SumLeaveCnt: 0,
			flag: false,
		};
	},
	mounted() {
		this.$loading.show = false;
		this.Sum_count[this.lang.i18n_Enter] = 0;
		this.Sum_count[this.lang.i18n_Leave] = 0;

		this.starttime = new Date().format(this.$store.getters.base.date_format);
		this.chartOption = {
			tooltip: {
				trigger: 'axis',
				textStyle: {
					color: '#ccc',
				},
			},
			legend: {
				textStyle: {
					color: '#ccc',
				},
				formatter: (name) => {
					return name + ':' + this.Sum_count[name];
				},
			},
			xAxis: {
				data: [],
			},
			yAxis: {
				minInterval: 1,
			},
			textStyle: {
				color: '#ccc',
			},
			series: [
				{
					name: this.lang.i18n_Enter,
					type: 'bar',
					itemStyle: {
						color: 'red',
					},
					data: [],
				},
				{
					name: this.lang.i18n_Leave,
					type: 'bar',
					itemStyle: {
						color: 'blue',
					},
					data: [],
				},
			],
		};
	},
	methods: {
		async btn_query() {
			this.query_disabled = true;
			this.$loading.show = true;
			if (this.handle) {
				await this.freeHandle(this.handle);
				this.handle = 0;
			}
			if (this.query_type == 2) {
				this.starttime = `${this.starttime_year}/${this.starttime_month}/01`;
			}
			this.list = [];
			this.GetQueryHandle();
		},
		btn_export() {
			if (this.list.length) {
				let plugin = this.$store.getters.config_plugin;

				if (this.plugin_type == 'ie') {
					this.export_dir = plugin.OpenFileDialog({ OpenMode: 0 });
					msg('choose dir:' + this.export_dir);
					if (this.export_dir.length == 0) {
						return;
					}
				}
				this.start_export();
			}
		},
		start_export() {
			this.export_disabled = true;
			this.$loading.show = true;
			let autorun = async function() {
				let plugin = this.$store.getters.config_plugin;

				let filename = `${this.lang.i18n_CounterReport}_${new Date().toLocaleString().replace(/[/ :]/g, '_')}.xlsx`;
				let ExportPath;
				if (this.plugin_type == 'ie') {
					ExportPath = `${this.export_dir}\\${filename}`;
				} else {
					ExportPath = filename;
				}
				let header_types = [
					{
						name: this.lang.i18n_statisticalTime,
						type_id: 2,
					},
					{
						name: this.lang.i18n_dectLine,
						type_id: 0,
					},
					{
						name: this.lang.i18n_Enter,
						type_id: 0,
					},
					{
						name: this.lang.i18n_Leave,
						type_id: 0,
					},
				];

				let table_name = this.lang.i18n_CounterReport;

				let plugin_handle = this.create_wb(plugin, ExportPath, table_name, header_types);
				if (plugin_handle <= 0) return;

				let data = [];
				for (let i = 0; i < this.list.length; i++) {
					data.push([this.list[i].Time, this.list[i].RegionIdx + 1, this.list[i].EnterCnt, this.list[i].LeaveCnt]);
				}

				this.addrows(plugin, { handle: plugin_handle, data: data });

				this.save_wb(plugin, ExportPath, plugin_handle);
				alert(`${this.lang.i18n_AllIsDone} ${this.lang.i18n_fileName}: ${filename}`);
				this.export_disabled = false;
				this.$loading.show = false;
			}.bind(this);
			autorun();
		},

		freeHandle(handle) {
			return this.$store.dispatch('request', {
				url: 'goform/frmPersonSmartRecords',
				Type: 2,
				Ch: 1,
				Data: { SessionHandle: handle },
			});
		},
		GetQueryHandle() {
			let start_t = this.date_trans_to_utc(this.starttime);

			this.$store
				.dispatch('request', {
					url: 'goform/frmPersonSmartRecords',
					Type: 0,
					Ch: 1,
					Data: {
						TableName: 'Counter',
						QueryType: this.query_type,
						TimeType: 0,
						RegionIdx: this.region_idx,
						StartTime: start_t,
						StopTime: start_t,
					},
				})
				.then((r) => {
					if (r.Result == 0) {
						this.handle = r.Data.SessionHandle;
						this.resultCount = r.Data.ResultCount;

						this.flag = true;
						this.SumEnterCnt = r.Data.SumEnterCnt;
						this.SumLeaveCnt = r.Data.SumLeaveCnt;

						this.Sum_count[this.lang.i18n_Enter] = r.Data.SumEnterCnt;
						this.Sum_count[this.lang.i18n_Leave] = r.Data.SumLeaveCnt;

						msg(['GetQueryHandle', this.resultCount]);
						if (this.resultCount > 0) {
							this.GetQueryResult();
						} else {
							this.chartOption.series[0].data = [];
							this.chartOption.series[1].data = [];
							this.chartOption.xAxis.data = [];
							this.query_disabled = false;
							this.$loading.show = false;
							this.$notify.success(this.$store.getters.current_language['i18n_no_result']);
						}
					} else {
						this.query_disabled = false;
						this.$loading.show = false;
						this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
					}
				});
		},
		GetQueryResult() {
			this.$store
				.dispatch('request', {
					url: 'goform/frmPersonSmartRecords',
					Type: 1,
					Ch: 1,
					Data: {
						SessionHandle: this.handle,
						StartCount: 1,
						StopCount: Math.max(1, this.resultCount),
						TimeType: 0,
					},
				})
				.then((r) => {
					this.query_disabled = false;
					this.$loading.show = false;
					if (r.Result == 0) {
						this.list = r.Data.ResultList.map((item) => {
							item.Time = this.time_show(item);
							return item;
						});
						this.chartOption.series[0].data = [];
						this.chartOption.series[1].data = [];
						this.list.forEach((item) => {
							this.chartOption.series[0].data.push(item.EnterCnt);
							this.chartOption.series[1].data.push(item.LeaveCnt);
						});
						let i = 0;
						this.chartOption.xAxis.data = [];
						if (this.query_type == 1) {
							while (i < 24) {
								let str = (i < 10 ? '0' : '') + i + ':00';
								this.chartOption.xAxis.data.push(str);
								i++;
							}
						} else if (this.query_type == 2) {
							while (i < this.resultCount) {
								++i;
								let str = (i < 10 ? '0' : '') + i;
								this.chartOption.xAxis.data.push(str);
								// i++;
							}
						}

						this.$notify.success(this.$store.getters.current_language['i18n_getok']);
					} else {
						this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
					}
				});
		},
		time_show(item) {
			return this.date_trans_to_local(item.StartTime, item.UtcOffset) + ' - ' + this.date_trans_to_local(item.StopTime, item.UtcOffset);
		},
		date_trans_to_utc(datetime) {
			let d = datetime.replace(/-/g, '/');

			return new Date(d).getTime() / 1000;
		},
		date_trans_to_local(datetime, utcoffset) {
			return new Date((datetime + utcoffset + new Date().getTimezoneOffset() * 60) * 1000).format(this.$store.getters.base.date_format + ' hh:mm:ss');
		},
		show_calendar(e) {
			e.target.isDateOnly = true;
			this.$store.getters.calendar.show(e.target, this.hide_calendar);
		},
		hide_calendar(ctrl) {
			let _n = $(ctrl).attr('name');
			if (!_n) return;
			if (_n == 'starttime') {
				this.starttime = ctrl.value;
			}
		},
	},
	computed: {
		tips() {
			if (this.query_type == 2) {
				return `${this.starttime_year}/${this.starttime_month} ${this.lang.i18n_StatisticalPerson}`;
			} else {
				return `${this.starttime} ${this.lang.i18n_StatisticalPerson}`;
			}
		},
	},
	watch: {
		ShowMode(newval, oldval) {
			if (newval == 0) {
				this.chartOption.series[0].type = 'bar';
				this.chartOption.series[1].type = 'bar';
			} else if (newval == 1) {
				this.chartOption.series[0].type = 'line';
				this.chartOption.series[1].type = 'line';
			}
		},
	},
	beforeDestroy() {
		if (this.handle) {
			this.freeHandle(this.handle);
		}
	},
	components: {
		'v-chart': ECharts,
	},
};
</script>