<template>
    <div class="main_con_k clearfix person_list">
        <div class="main_con_top_face">
            <div class="fl pl10 bold"><label v-tr="title"></label></div>
        </div>

        <div class="main_con_mid_face">
            <div>
                <table style="width: 100%">
                    <tr>
                        <td style="width: 5%;"></td>
                        <td style="width: 20%;">
                            <label v-tr="i18n_videoDectZone"></label>:
                            <select type="text" class="textc" v-model="region_idx" style="width: 88px">
                                <option v-for="n in 4" :value="n - 1">{{ n }}</option>
                            </select>
                        </td>
                        <td style="width: 25%;">
                            <label v-tr="i18n_beginTime"></label>:
                            <input class="textc" ref="start_time" name="starttime" :value="starttime" @click="show_calendar" readonly="readonly" />
                        </td>
                        <td style="width: 25%;">
                            <label v-tr="i18n_endTime"></label>:
                            <input class="textc" ref="end_time" name="endtime" :value="endtime" @click="show_calendar" readonly="readonly" />
                        </td>

                        <td>
                            <button :class="button_style" style="width: 88px" @click="btn_query" v-tr="i18n_query" :disabled="query_disabled"></button>
                            &nbsp;&nbsp;
                            <button
                                :class="button_style"
                                style="width: 88px"
                                @click="btn_export"
                                v-show="list.length"
                                :disabled="export_disabled"
                                v-tr="i18n_Export"
                            ></button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="w100 text_center mt40" style="margin-bottom: 20px">
                <label>{{ starttime }} - {{ endtime }}</label
                >&nbsp;<label v-tr="i18n_AlarmStatistical"></label>
            </div>
            <div class="w100">
                <table border="0" cellspacing="0" cellpadding="0" class="_table" style="width: 70%;margin: 0 auto">
                    <tr>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_NO"></label></th>
                        <th class="_th text_center" style="width: 40%"><label v-tr="i18n_AlarmTime"></label></th>
                        <th class="_th text_center" style="width: 30%"><label v-tr="i18n_videoDectZone"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_playback"></label></th>
                    </tr>
                    <tr v-for="(item, idx) in list">
                        <td class="_td text_center">
                            <label>{{ Offset + idx + 1 }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ time_show(item) }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.RegionIdx + 1 }}</label>
                        </td>
                        <td class="_td text_center">
                            <div style="height: 32px">
                                <img src="static/images/play.png" @click="btn_play(item)" />
                            </div>
                        </td>
                    </tr>
                    <tr v-if="list.length == 0">
                        <td class="_td text_center" width="100%" height="24" align="right" colspan="9">
                            <div style="width:60%;margin: 5px auto 5px auto;text-align:center;" v-tr="i18n_no_result"></div>
                        </td>
                    </tr>
                </table>

                <CVFootMenu ref="footmenu" :foot="foot" @pagechanged="pagechanged"></CVFootMenu>
            </div>
        </div>
    </div>
</template>

<script>
import CVFootMenu from 'components/log/cv-log-footmenu';
import { LocalTimeToUTC, trans_datetime_to_string } from 'common/util';
import person_report_export from 'mixin/person_report_export';

import style from 'mixin/style';
export default {
	name: 'CVIndexPersonRegion',
	mixins: [style, person_report_export],
	props: {
		PersonIndex: {
                type: String,
                default: 'Region',
            },
        },
        data() {
            return {
                list: [],
                starttime: '',
                endtime: '',
                handle: 0,
                resultCount: 0,
                title: '',
                foot: {
                    logitemcount: 0,
                    totalpages: 1,
                    current_page: 1,
                    name: 'person_region',
                },
                region_idx: 0,
                Offset: 0,
                Num: 20,
                lang: this.$store.getters.current_language,
                query_disabled: false,
                export_disabled: false,
            };
        },
        mounted() {
            this.Restore();
        },
        methods: {
            pagechanged(n) {
                this.Num = 20;
                this.Offset = (n - 1) * this.Num;
                this.foot.current_page = n;
                this.GetQueryResult();
            },
            Restore() {
                if (this.PersonIndex == 'Region') {
                    if (this.$store.getters.showElectronicFence) {
                        this.title = 'i18n_' + this.PersonIndex + 'Report';
                    } else {
                        this.title = 'i18n_regionDetectReport';
                    }
			} else if (this.PersonIndex == 'Retrograde') {
				this.title = 'i18n_videoRetrograde';
                } else {
                    this.title = 'i18n_' + this.PersonIndex + 'Report';
                }

                this.starttime = new Date().format(this.$store.getters.base.date_format) + ' 00:00:00';
                this.endtime = new Date().format(this.$store.getters.base.date_format + ' hh:mm:ss');
                this.list = [];
                this.foot.logitemcount = 0;
                this.foot.totalpages = 1;
                this.foot.current_page = 1;
                this.region_idx = 0;
                this.query_disabled = false;
                this.export_disabled = false;
                this.$loading.show = false;
            },
            async btn_query() {
                this.query_disabled = true;
                this.$loading.show = true;
                if (this.handle) {
                    await this.freeHandle(this.handle);
                    this.handle = 0;
                }
                this.Offset = 0;
                this.foot.totalpages = 1;
                this.foot.logitemcount = 0;
                this.foot.current_page = 1;
                this.list = [];
                this.GetQueryHandle();
            },
            btn_export() {
                if (this.list.length) {
                    let plugin = this.$store.getters.config_plugin;

				if (this.plugin_type == 'ie') {
                        this.export_dir = plugin.OpenFileDialog({ OpenMode: 0 });

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

				let filename = `${this.lang[this.title]}_${new Date().toLocaleString().replace(/[/ :]/g, '_')}.xlsx`;
				let ExportPath;

				if (this.plugin_type == 'ie') {
					ExportPath = `${this.export_dir}\\${filename}`;
				} else {
					ExportPath = filename;
				}

				let header_types = [
					{
						name: this.lang.i18n_AlarmTime,
						type_id: 2,
					},
					{
						name: this.lang.i18n_videoDectZone,
						type_id: 0,
					},
				];
				let table_name = this.lang[this.title];

				let plugin_handle = this.create_wb(plugin, ExportPath, table_name, header_types);
				if (plugin_handle <= 0) return;

				let result = await this.$store.dispatch('request', {
					url: 'goform/frmPersonSmartRecords',
					Type: 1,
					Ch: 1,
					Data: {
						SessionHandle: this.handle,
						StartCount: 1,
						StopCount: this.resultCount,
						TimeType: 0,
					},
				});

				let resultList = [];
				if (result.Result == 0) {
					resultList = result.Data.ResultList.map((item) => {
						item.Time = this.time_show(item);
						return item;
					});
				}

				let data = [];
				for (let i = 0; i < resultList.length; i++) {
					data.push([resultList[i].Time, resultList[i].RegionIdx + 1, resultList[i].RegionIdx]);
				}

				this.addrows(plugin, { handle: plugin_handle, data: data });

				this.save_wb(plugin, ExportPath, plugin_handle);

				alert(`${this.lang.i18n_AllIsDone} ${this.lang.i18n_fileName}: ${filename}`);
				this.export_disabled = false;
				this.$loading.show = false;
			}.bind(this);
			autorun();
		},

            btn_play(item) {
                //check这个片段是否还在

                let start_time = trans_datetime_to_string(item.Time - 3600);
                let end_time = trans_datetime_to_string(item.Time + 86399 + 3600);

                // 新方式的录像查询接口
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoRecordsQuery',
                        Type: 1,
                        Ch: 1,
                        Data: {
                            Channels: [1],
                            DeviceLocalDateTimeStart: start_time,
                            DeviceLocalDateTimeStop: end_time,
                            QueryType: 255,
                        },
                    })
                    .then((r) => {
                        if (r.Result == 0) {
                            let res = r.Data.SearchResults[0].Records.some((_item) => {
                                item[1] = item[1] + item[3] * 60 - item[4] * 60;
                                item[2] = item[2] + item[3] * 60 - item[4] * 60;
                                return (item.Time >= _item[1] && _item[2] >= item.Time) || (item.Time + 60 >= _item[1] && _item[2] >= item.Time + 60);
                            });
                            if (!res) {
                                alert(this.$store.getters.current_language['i18n_personRecordTips']);
                            } else {
                                //  this.$store.dispatch('person_recordTime_change', item.Time);

                                let start_time = item.Time - 5;
                                let stop_time = start_time + 60;
                                //this.$store.commit('person/streamContext_changed');
                                // this.$store.commit('person/isShowDialog', true);
                                let context = {
                                    utc_begintime: start_time,
                                    utc_endtime: stop_time,
                                };

                                this.$emit('playrecords', {
                                    context,
                                });
                            }
                        }
                    });
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
                let end_t = this.date_trans_to_utc(this.endtime);
                if (start_t > end_t) {
                    this.$notify.error(this.$store.getters.current_language['i18n_time_range_error']);
                    this.query_disabled = false;
                    this.$loading.show = false;
                    return;
                }
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmPersonSmartRecords',
                        Type: 0,
                        Ch: 1,
                        Data: {
                            TableName: this.PersonIndex,
                            QueryType: 0,
                            RegionIdx: this.region_idx,
                            TimeType: 0,
                            StartTime: start_t,
                            StopTime: end_t,
                        },
                    })
                    .then((r) => {
                        if (r.Result == 0) {
                            this.handle = r.Data.SessionHandle;
                            this.resultCount = r.Data.ResultCount;
                            this.foot.logitemcount = this.resultCount;
                            let totalpage = Math.ceil(this.resultCount / this.Num);
                            this.foot.totalpages = totalpage ? totalpage : 1;
                            if (this.Offset >= this.resultCount) {
                                this.Offset = (this.foot.totalpages - 1) * this.Num;
                            }
                            this.foot.current_page = this.Offset / this.Num + 1;
                            if (this.resultCount > 0) {
                                this.GetQueryResult();
                            } else {
                                this.query_disabled = false;
                                this.$loading.show = false;
                                this.$notify.success(this.$store.getters.current_language['i18n_getok']);
                            }
                        } else {
                            this.query_disabled = false;
                            this.$loading.show = false;
                            // this.$notify.error(this.$store.getters.current_language["i18n_getfailed"]);
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
                            StartCount: this.Offset + 1,
                            StopCount: Math.min(this.Offset + this.Num, this.resultCount),
                            TimeType: 0,
                        },
                    })
                    .then((r) => {
                        this.query_disabled = false;
                        this.$loading.show = false;
                        if (r.Result == 0) {
                            this.list =
                                r.Data.ResultList; /*.map(item=>{
                            item.Time = new Date(item.Time*1000).format(this.$store.getters.base.date_format + " hh:mm:ss");
                            return item
                        });*/
                            this.$notify.success(this.$store.getters.current_language['i18n_getok']);
                        } else if (r.Result == -111) {
                            //msg('超时！')
                            this.GetQueryHandle();
                            return;
                        } else {
                            this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
                        }
                    });
            },
            time_show(item) {
                return this.date_trans_to_local(item);
            },
            date_trans_to_utc(datetime) {
                let v = datetime.split(' ');
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
                }
                //    return v0.join("-") +` ${v[1]}`;
                let time = LocalTimeToUTC(
                    new Date(parseInt(v0[0], 10), parseInt(v0[1], 10) - 1, parseInt(v0[2], 10), parseInt(v1[0], 10), parseInt(v1[1], 10), parseInt(v1[2], 10)),
                );

                return time;
            },
            date_trans_to_local(item) {
                return new Date((item.Time + item.UtcOffset + new Date().getTimezoneOffset() * 60) * 1000).format(
                    this.$store.getters.base.date_format + ' hh:mm:ss',
                );
            },
            show_calendar(e) {
                e.target.isDateOnly = false;
                this.$store.getters.calendar.show(e.target, this.hide_calendar);
            },
            hide_calendar(ctrl) {
                let _n = $(ctrl).attr('name');
                if (!_n) return;
                if (_n == 'starttime') {
                    this.starttime = ctrl.value;
                }
                if (_n == 'endtime') {
                    this.endtime = ctrl.value;
                }
            },
        },
        watch: {
            PersonIndex(newVal, oldVal) {
                msg(['PersonIndex', newVal, oldVal]);
                this.Restore();
            },
        },
        beforeDestroy() {
            if (this.handle) {
                this.freeHandle(this.handle);
            }
        },
        components: {
            CVFootMenu,
        },
    };
</script>
