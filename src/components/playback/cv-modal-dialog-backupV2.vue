<template>
    <div class="table_like w100" :style="{ height }">
        <div class="m_r_bg td_like" style="margin:10px;">
            <div class=" td_bg text_center">
                <label v-tr="i18n_search"></label>
            </div>
            <ul class="menu">
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

                <li class="text_center">
                    <button @click="search" class="btn1" style="width:140px;" v-tr="i18n_search" :disabled="status == 'start'"></button>
                </li>

                <li class="text_center">
                    <button @click="back_to_playback" class="btn1" style="width:140px;" v-tr="i18n_return" :disabled="status == 'start'"></button>
                </li>
            </ul>
            <div class="w100 xx1">
                <div class=" td_bg text_center " style="margin-top:10px;">
                    <label v-tr="i18n_backup"></label>
                </div>
                <ul class="menu">
                    <li class="text_center" v-show="download_list.length && status == 'stop'">
                        <label v-tr="i18n_allChecked"></label><input type="checkbox" name="" v-model="aChecked" @click="allChecked" />
                    </li>
                    <li class="text_center" v-show="download_list.length >= 2 && status == 'stop'">
                        <label v-tr="i18n_combine_pieces"></label><input type="checkbox" name="" v-model="combine_pieces" />
                    </li>
                    <li class="text_center" v-show="download_list.length && status == 'stop'">
                        <button @click="start_backup" class="btn1" style="width:140px;" v-tr="i18n_start"></button>
                    </li>

                    <li class="text_center" v-show="status == 'start'">
                        <button @click="stop_backup" class="btn1" style="width:140px;" v-tr="i18n_stop"></button>
                    </li>
                </ul>
            </div>

            <div class="w100 " v-show="status == 'start'">
                <div id="progressbar" style="width:180px;border:1px solid gray;height:10px;margin:0 auto"></div>
                <div class="text_center">
                    <label>{{ [current_source.start, current_source.stop].join(',') }}</label>
                </div>
                <div class="text_center">
                    <label>{{ current_source.progress + '%' }}</label>
                </div>
            </div>
        </div>

        <div class="td_like" style="vertical-align:top;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab1">
                <tr>
                    <th class="td-title"><label v-tr="i18n_NO"></label></th>
                    <th class="td-title"><label v-tr="i18n_HDtype"></label></th>
                    <th class="td-title"><label v-tr="i18n_beginTime"></label></th>
                    <th class="td-title"><label v-tr="i18n_endTime"></label></th>
                    <th class="td-title"><label v-tr="i18n_timeLength"></label></th>
                    <th class="td-title"><label v-tr="i18n_operation"></label></th>
                </tr>
                <tr v-for="(n, idx) of list">
                    <td :class="{ 'td-1': idx % 2, text_center: true }">
                        <label>{{ range_start_pos + idx + 1 }}</label>
                    </td>
                    <td :class="{ 'td-1': idx % 2, text_center: true }">
                        <label>{{ trans_filetype(n[0]) }}</label>
                    </td>
                    <td :class="{ 'td-1': idx % 2, text_center: true }">
                        <label>{{ trans_time(n[1] + n[3] - n[4]) }}</label>
                    </td>
                    <td :class="{ 'td-1': idx % 2, text_center: true }">
                        <label>{{ trans_time(n[2] + n[3] - n[4]) }}</label>
                    </td>
                    <td :class="{ 'td-1': idx % 2, text_center: true }">
                        <label>{{ time_details(n[2] - n[1] + 1) }}</label>
                    </td>
                    <td :class="{ 'td-1': idx % 2, text_center: true }">
                        <input
                            type="checkbox"
                            :disabled="status == 'start'"
                            :checked="is_checked(idx + range_start_pos)"
                            @click="push_back_downloadlist(idx + range_start_pos, $event)"
                        />
                        <div style="margin: 1px;width: 20px;height: 8px;"></div>
                    </td>
                </tr>
                <tr v-if="records_list.length == 0">
                    <td class="td-1" width="100%" height="24" align="right" colspan="6">
                        <div style="width:60%;margin: 5px auto 5px auto;text-align:center;" v-tr="i18n_no_result"></div>
                    </td>
                </tr>
            </table>

            <div></div>
            <div class="fr" v-show="records_list.length">
                <label v-tr="i18n_page"></label>
            </div>

            <div class="fr" v-show="records_list.length">
                <select @change="newPage(4, $event)">
                    <option v-for="n in totalpages" :selected="n == currentpage + 1" :value="n">{{ n }}</option>
                </select>
            </div>
            <div class="fr" v-show="records_list.length"><label v-tr="i18n_goto"></label></div>

            <div class="fr" v-show="totalpages > 0 && currentpage + 1 != totalpages">
                <label><a @click="newPage(3)" v-tr="i18n_lastPage"></a></label>&nbsp;&nbsp;
            </div>
            <div class="fr" v-show="currentpage + 1 < totalpages">
                <label><a @click="newPage(1)" v-tr="i18n_nextPage"></a></label>&nbsp;&nbsp;
            </div>
            <div class="fr" v-show="currentpage + 1 != 1">
                <label><a @click="newPage(2)" v-tr="i18n_previousPage"></a></label>&nbsp; &nbsp;
            </div>
            <div class="fr" v-show="currentpage + 1 != 1">
                <label><a @click="newPage(0)" v-tr="i18n_firstPage"></a></label>&nbsp; &nbsp;
            </div>

            <div class="fr" v-show="records_list.length"><label v-tr="i18n_page"></label>&nbsp;&nbsp;</div>
            <div class="fr" v-show="records_list.length">
                <label>&nbsp;{{ currentpage + 1 }}</label
                >&nbsp;
            </div>
            <div class="fr" v-show="records_list.length"><label v-tr="i18n_the"></label>&nbsp;</div>
            <div class="fr" v-show="records_list.length"><label v-tr="i18n_listNum"></label>&nbsp;&nbsp;</div>
            <div class="fr" v-show="records_list.length">
                <label>&nbsp;{{ records_list.length }}</label
                >&nbsp;
            </div>
            <div class="fr" v-show="records_list.length"><label v-tr="i18n_total"></label>&nbsp;</div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { rangeArray, current_year, current_month, current_day, getMonthDays } from 'common/util';

    var DOWNLOAD_CONTEXT = {
        chooseChkVec: [],
        filetype: 'avi',
        streamtype: 1,
    };

    import { LocalTimeToUTC, pad, addEvent } from 'common/util';

    export default {
        name: 'CVModalDialogBackup',
        data() {
            return {
                records_list: [], //总共的日志数
                currentpage: 0,
                download_list: [], //选中的日志

                current_source: { start: '', stop: '', progress: 0 },
                combine_pieces: false,

                backup_list: [], //备份状态
                status: 'stop',
                aChecked: false,
                starttime: '',
                endtime: '',
            };
        },
        mounted() {
            /*let tmp = new Date();
        let _y = tmp.getFullYear();
        let _m = tmp.getMonth();
        let _d = tmp.getDate();
        let _hour = tmp.getHours(); //获取系统时，
        let _min = tmp.getMinutes(); //分
        let _sec = tmp.getSeconds(); //*/
            this.starttime = new Date().format(this.$store.getters.base.date_format + ' 00:00:00');
            this.endtime = new Date().format(this.$store.getters.base.date_format + ' 23:59:59');
        },
        methods: {
            back_to_playback() {
                //返回录像回放页面
                this.$store.dispatch('pbslider_tab_change', 1);
            },
            allChecked(evt) {
                let flg = evt.target.checked;
                msg(['all', evt, flg, this.download_list, this.records_list]);
                this.download_list = [];
                if (flg) {
                    for (var i = 0, len = this.records_list.length; i < len; ++i) {
                        this.download_list.push(i);
                    }
                }
            },
            start_backup() {
                //slice by series.按照连续片段分组
                /*		let slice_piece = [];
			let group_id = 0;

			let rng_start_pos = 0;
			let rng_stop_pos = this.download_list.length;
			msg([rng_start_pos,rng_stop_pos,this.download_list.length == 0])
			if (this.download_list.length == 0) {
				return;
			}else if(this.download_list.length == 1){

				slice_piece[group_id] = [];
				slice_piece[group_id].push(this.download_list[0])
			}else{

				rng_start_pos = 0;
				rng_stop_pos = 1;
				while(rng_stop_pos < this.download_list.length){
					let delta_num = this.download_list[rng_stop_pos] - this.download_list[rng_start_pos]
					msg(delta_num)
					if (delta_num == rng_stop_pos - rng_start_pos) {
						rng_stop_pos++;
						continue;
					}else{
						msg([rng_start_pos,rng_stop_pos])
						slice_piece[group_id] = [];
						slice_piece[group_id++] = this.download_list.slice(rng_start_pos,rng_stop_pos);
						rng_start_pos = rng_stop_pos;

						if (rng_stop_pos == this.download_list.length - 1) {//reach the end
							slice_piece[group_id] = [];
							slice_piece[group_id++] = this.download_list.slice(rng_start_pos,rng_stop_pos + 1);
						}
					}
				}
			}*/
                this.backup_list = [];
                let start = 0;
                let stop = 0;
                let utc_start = 0;
                let utc_stop = 0;
                let tzoffset = 0;
                let dstoffset = 0;
                let time_length = 0;
                let tmp = [];

                if (this.download_list.length == 1) {
                    this.combine_pieces = false;
                }

                if (this.combine_pieces) {
                    let rng_start_pos = 0;
                    let rng_stop_pos = 0;
                    while (rng_stop_pos < this.download_list.length) {
                        let delta_num = this.download_list[rng_stop_pos] - this.download_list[rng_start_pos];
                        msg([delta_num, rng_start_pos, rng_stop_pos]);
                        if (delta_num == 0 || delta_num == rng_stop_pos - rng_start_pos) {
                            rng_stop_pos++;
                            if (rng_stop_pos < this.download_list.length) {
                                //range outside
                                continue;
                            }
                        }

                        msg([rng_start_pos, rng_stop_pos]);
                        /*if (rng_stop_pos == this.download_list.length - 1) {//reach the end
						tmp = this.download_list.slice(rng_start_pos,rng_stop_pos + 1);
					}else{*/
                        tmp = this.download_list.slice(rng_start_pos, rng_stop_pos);
                        rng_start_pos = rng_stop_pos;
                        //}

                        msg(tmp);
                        tmp = tmp.map((item) => {
                            return this.records_list[item];
                        });
                        time_length = 0;
                        tmp.forEach((v) => {
                            time_length += v[2] - v[1] + 1;
                        });

                        utc_start = tmp[0][1];
                        utc_stop = tmp[tmp.length - 1][2];

                        dstoffset = tmp[0][3];
                        tzoffset = tmp[0][4];
                        start = this.get_utc_ymdhms_string(utc_start);
                        stop = this.get_utc_ymdhms_string(utc_stop);
                        this.backup_list.push({
                            start,
                            stop,
                            time_length,
                            utc_start,
                            utc_stop,
                            tzoffset,
                            dstoffset,
                        });
                    }
                } else {
                    tmp = this.download_list.map((item) => {
                        return this.records_list[item];
                    });
                    tmp.forEach((v) => {
                        utc_start = v[1];
                        utc_stop = v[2];
                        tzoffset = v[4];
                        dstoffset = v[3];
                        start = this.get_utc_ymdhms_string(utc_start);
                        stop = this.get_utc_ymdhms_string(utc_stop);
                        time_length = v[2] - v[1] + 1;
                        msg('===', start, stop);
                        this.backup_list.push({ start, stop, time_length, utc_start, utc_stop, tzoffset, dstoffset });
                    });
                }

                let Activex = this.$store.getters.playback_plugin;
                if (Activex) {
                    DOWNLOAD_CONTEXT.filetype = 'avi';

                    this.backup_list.forEach((item) => {
                        let obj = {
                            usrname: this.$store.getters.tokenA,
                            pwd: this.$store.getters.tokenB,
                            file_format: DOWNLOAD_CONTEXT.filetype,
                            ip: this.$store.getters.ip,
                            port: this.$store.getters.rtsp_port,
                            ch: 0,
                            stream_type: 0,
                            date: '',
                            start: item.start,
                            stop: item.stop,
                            utc_start: item.utc_start,
                            utc_stop: item.utc_stop,
                            tzoffset,
                            dstoffset,
                            time_length: item.time_length,
                        };

                        Activex.BackUpInit(obj);
                    });

                    if (this.backup_list.length) {
                        if (!this.bar) {
                            this.bar = new ProgressBar.Line('#progressbar', { color: '#00ff00', easing: 'easeInOut' });
                            this.bar.animate(0.01);
                        }
                        const backup_cb = function(obj) {
                            ['utc_begintime', 'utc_endtime', 'dstoffset', 'tzoffset'].forEach((item) => {
                                obj[item] = parseInt(obj[item], 10);
                            });

                            let begin = this.get_localipc_ymdhms_string(obj.utc_begintime + obj.dstoffset - obj.tzoffset);
                            let end = this.get_localipc_ymdhms_string(obj.utc_endtime + obj.dstoffset - obj.tzoffset);
                            msg('progress', begin, end);
                            this.current_source = { start: begin, stop: end, progress: obj.progress };
                            this.bar.animate(obj.progress / 100);

                            if (obj.progress == 100) {
                                let last = this.backup_list[this.backup_list.length - 1];
                                msg('backup_msg', last.utc_start, obj.utc_begintime, last.utc_stop, obj.utc_endtime);
                                if (last.utc_start == obj.utc_begintime && last.utc_stop == obj.utc_endtime) {
                                    setTimeout((v) => {
                                        msg('!!!!!!!!');
                                        this.stop_backup();
                                    }, 1000);
                                }
                            }
                        }.bind(this);
                        Activex.AddPluginEvent({
                            event_name: 'backup_msg',
                            func: backup_cb,
                        });
                        addEvent(Activex, 'backup_msg', backup_cb);
                        Activex.BackUpStart();
                        this.status = 'start';
                    }
                }
            },
            stop_backup() {
                msg('stop backup');
                let Activex = this.$store.getters.playback_plugin;
                if (Activex) {
                    Activex.BackUpStop();

                    Activex.RemovePluginEvent('backup_msg');

                    this.status = 'stop';
                }
            },
            is_checked(idx) {
                return (
                    -1 !=
                    this.download_list.findIndex((item) => {
                        return item == idx;
                    })
                );
            },
            show_calendar(e) {
                this.calendar.show(e.target, this.hide_calendar);
            },
            hide_calendar(ctrl) {
                var _n = $(ctrl).attr('name');
                if (!_n) return;
                //    var d = ctrl.value.toDate(this.$store.getters.base.date_format + " hh:mm:ss");
                msg([_n, ctrl.value]);
                if (_n == 'starttime') {
                    this.starttime = ctrl.value;
                } else if (_n == 'endtime') {
                    this.endtime = ctrl.value;
                }
            },
            date_trans_to_utc(datetime) {
                let v = datetime.split(' ');
                let v0 = v[0].split('-').map((_) => parseInt(_, 10));
                let v1 = v[1].split(':').map((_) => parseInt(_, 10));
                let date = $.extend(true, [], v0);
                let y, m, d, hour, min, sec;
                switch (this.$store.getters.base.date_format) {
                    case 'MM-dd-yyyy':
                        y = date[2];
                        m = date[0];
                        d = date[1];
                        break;
                    case 'dd-MM-yyyy':
                        y = date[2];
                        m = date[1];
                        d = date[0];
                        break;
                    default:
                        y = date[0];
                        m = date[1];
                        d = date[2];
                }
                hour = v1[0];
                min = v1[1];
                sec = v1[2];
                //    return v0.join("-") +` ${v[1]}`;
                //  let time = LocalTimeToUTC(
                //     new Date(parseInt(v0[0], 10), parseInt(v0[1], 10) - 1, parseInt(v0[2], 10), parseInt(v1[0], 10), parseInt(v1[1], 10), parseInt(v1[2], 10)),
                // );

                return [y, m, d, hour, min, sec].map((item) => pad(item)).join('');
            },
            LocalToUTC(val) {
                //let t = new Date();
                let time = LocalTimeToUTC(val);
                //  time -= parseInt(t.getTimezoneOffset())*60;
                return time;
            },
            async search() {
                this.download_list = [];

                //check date
                let start_t = this.date_trans_to_utc(this.starttime);
                let end_t = this.date_trans_to_utc(this.endtime);
                msg('search:', start_t, end_t);
                if (parseInt(start_t, 10) > parseInt(end_t, 10)) {
                    this.$notify.error(this.$store.getters.current_language['i18n_time_range_error']);
                    return;
                }

                //本地时间UTC转成 IPC时区的UTC时间
                //  let r = await this.$store.dispatch("request", { url: "goform/frmNetNtpPara", Type: 0, Data: {} });
                //{"Result":0,"Data":{"EnableNTP":0,"NTPServer":"","TimeInterval":0,"NTPPort":123,"TimeOffsetHour":8,"TimeOffsetMinute":0}}
                //  let ipcTZOffset = (r.Data.TimeOffsetHour * 60 + r.Data.TimeOffsetMinute) * -1; //min
                //  this.extra_secs = (ipcTZOffset - new Date().getTimezoneOffset()) * 60;

                this.$loading.show = true;

                let result = await this.$store.dispatch('request', {
                    url: 'goform/frmVideoRecordsQuery',
                    Type: 0,
                    Ch: 0,
                    Data: {
                        Channels: [1],
                        DeviceLocalDateTimeStart: start_t,
                        DeviceLocalDateTimeStop: end_t,
                        QueryType: 0xff,
                    },
                });

                this.$loading.show = false;
                Vue.nextTick(() => {
                    if (result.Result == 0) {
                        //this.records_list = result.Data.SearchResults[0].Records;

                        //UTC时间传承ipc本地时间
                        this.records_list = result.Data.SearchResults[0].Records.map((item) => {
                            let extra_secs = item[3] * 60;
                            let pc_ipc_extra_secs = item[4] /*- new Date().getTimezoneOffset()*/ * 60;
                            msg(extra_secs);
                            return [item[0], item[1], item[2], extra_secs, pc_ipc_extra_secs];
                        });

                        //msg(this.extra_secs, JSON.stringify(this.records_list));
                    } else {
                        this.records_list = [];
                    }
                });
            },
            trans_filetype(type) {
                /*switch(type){
				case 1:
				return lang.i18n_timedVideo
				break;
				case 2:
				return lang.i18n_motion;
				break;
				case 3:
				return lang.i18n_alarmVideo;
				break;
				case 9:
				return lang.i18n_ivsVideo;
				break;
				case 10:
				return lang.i18n_faceVideo;
				break;
				case 11:
				return lang.i18n_fireVideo;
				break;
				case 12:
				return lang.i18n_videoDiagnoseVideo;
				break;
			}*/

                if (type == 1) {
                    return this.lang.i18n_timedVideo;
                } else {
                    return this.lang.i18n_alarmVideo;
                }
                //return type;
            },
            get_utc_ymdhms_string(secs) {
                let d = new Date(secs * 1000);
                return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
                    .map((item) => pad(item))
                    .join('');
            },
            get_localipc_ymdhms_string(secs) {
                secs += new Date().getTimezoneOffset() * 60;
                let d = new Date(secs * 1000);
                return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()].map((item) => pad(item)).join('');
            },
            trans_time(secs) {
                /*var start_y = parseInt(this.selected_start_y,10);
			var start_m = parseInt(this.selected_start_m,10);
			var start_d = parseInt(this.selected_start_d,10);
			let h = Math.floor(secs/3600);
			let m = Math.floor((secs - h*3600)/60);
			let s = Math.floor((secs - h*3600 - m*60));
			return [pad(start_y),pad(start_m),pad(start_d)].join("-") + ' ' +  [pad(h),pad(m),pad(s)].join(":");*/

                secs += new Date().getTimezoneOffset() * 60;

                let d = new Date(secs * 1000);

                //if (bool) {
                return d.format('yyyy-MM-dd hh:mm:ss');
                // } else {
                //    return d.format(this.$store.getters.base.date_format + " hh:mm:ss");
                // }
            },
            time_details(secs) {
                let h = Math.floor(secs / 3600);
                let m = Math.floor((secs - h * 3600) / 60);
                let s = Math.floor(secs - h * 3600 - m * 60);
                return [pad(h), pad(m), pad(s)].join(':');
            },
            newPage(mode, evt) {
                switch (mode) {
                    case 0: //first page
                        this.currentpage = 0;
                        break;
                    case 1: //next page
                        this.currentpage++;
                        break;
                    case 2: //previous page
                        this.currentpage--;
                        break;
                    case 3: //last page
                        this.currentpage = this.totalpages - 1;
                        break;
                    case 4: //jump
                        this.currentpage = parseInt($(evt.target).val(), 10) - 1;
                }
            },
            push_back_downloadlist(idx, evt) {
                let flg = $(evt.target).prop('checked');
                let pos = this.download_list.findIndex((item) => {
                    return item == idx;
                });
                if (flg) {
                    if (pos == -1) {
                        this.download_list.push(idx);
                    }
                } else {
                    if (pos != -1) {
                        this.download_list.splice(pos, 1);
                    }
                }
                this.download_list.sort((a, b) => {
                    if (a < b) {
                        return -1;
                    } else if (a == b) {
                        return 0;
                    } else {
                        return 1;
                    }
                });

                if (this.records_list.length === this.download_list.length) {
                    this.aChecked = true;
                } else {
                    this.aChecked = false;
                }
            },
        },
        computed: {
            list() {
                let ar = this.records_list.slice(this.range_start_pos, this.range_end_pos);

                return ar;
            },
            totalpages() {
                return Math.ceil(this.records_list.length / this.range_length);
            },
            range_start_pos() {
                let pos = this.currentpage * this.range_length;
                //if (this.records_list.length >= this.range_length && pos > this.records_list.length - this.range_length) { pos = this.records_list.length - this.range_length}
                return pos;
            },
            range_end_pos() {
                return this.range_start_pos + this.range_length;
            },
            range_length() {
                return 20;
            },
            height() {
                return this.$store.getters.content_rect.height - 76 + 'px';
            },
            calendar() {
                return this.$store.getters.calendar;
            },
        },
    };
</script>
<style scoped>
    li {
        margin-top: 15px;
    }
    a:visited {
        color: #4c4c4c;
    }
</style>
