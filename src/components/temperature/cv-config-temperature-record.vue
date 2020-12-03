<template>
    <div class=" clearfix" style="width:1200px;padding-top: 95px; padding-left: 20px;margin:0 auto;">
        <div class="main_con_top_face">
            <div class="fl pl10 bold">
                <label v-tr="i18n_FaceComparison"><!-- 记录查询 --></label>
            </div>
        </div>

        <div class="main_con_mid_face">
            <div class="w100">
                <table style="width: 100%">
                    <tr>
                        <td><label v-tr="i18n_beginTime"></label>:</td>
                        <td>
                            <input class="textc" ref="temp_start_time" name="starttime" :value="starttime" @click="show_calendar" readonly="readonly" />
                        </td>
                        <td><label v-tr="i18n_endTime"></label>:</td>
                        <td>
                            <input class="textc" ref="temp_end_time" name="endtime" :value="endtime" @click="show_calendar" readonly="readonly" />
                        </td>

                        <!-- <td>
							<select type="text" class="textc" v-model="query_type">
                                <option :value="0" v-tr="i18n_ComparisonResult"></option>
                                <option :value="3" v-tr="i18n_GroupType"></option>
								<option :value="9" v-tr="i18n_tempRange"></option>
                            </select>
						</td> -->
                        <td style="width: 120px">
                            <button :class="button_style" style="width: 88px" @click="btn_query" :disabled="query_disabled" v-tr="i18n_query"></button>
                        </td>
                        <td style="width: 100px">
                            <button :class="button_style" style="width: 88px" @click="btn_export" v-show="list.length" v-tr="i18n_Export"></button>
                        </td>
                    </tr>
                    <tr>
                        <td><label v-tr="i18n_tempRange"></label>:</td>
                        <td>
                            <input type="text" class="textc" v-model="TempMin" v-validator:NOVOID:Float /><label v-tr="i18n_min"></label>
                            /
                            <input type="text" class="textc" v-model="TempMax" v-validator:NOVOID:Float /><label v-tr="i18n_max"></label>
                        </td>
                        <td><label v-tr="i18n_maskSearch"></label>:</td>
                        <td>
                            <select class="textc" v-model="masktype">
                                <option :value="0" v-tr="i18n_all"></option>
                                <option :value="1" v-tr="i18n_maskInvalid"></option>
                                <option :value="2" v-tr="i18n_maskValid"></option>
                            </select>
                        </td>
                        <td colspan="3"></td>
                    </tr>

                    <tr v-if="show_extra_condition">
                        <td><label v-tr="i18n_ComparisonResult"></label>:</td>
                        <td colspan="3">
                            <input type="radio" id="ComparisonAll" name="querytype" :value="0" v-model="QueryMode" />
                            <label for="ComparisonAll" v-tr="i18n_all"></label>&nbsp;&nbsp;
                            <input type="radio" id="ComparisonSuccess" name="querytype" :value="1" v-model="QueryMode" />
                            <label for="ComparisonSuccess" v-tr="i18n_ComparisonSuccess"></label>&nbsp;&nbsp;
                            <input type="radio" id="ComparisonFailed" name="querytype" :value="2" v-model="QueryMode" />
                            <label for="ComparisonFailed" v-tr="i18n_ComparisonFailed"></label>
                        </td>
                    </tr>
                    <tr v-if="show_extra_condition">
                        <td><label v-tr="i18n_GroupType"></label>:</td>
                        <td colspan="3">
                            <input type="checkbox" id="whitelist" name="listtype" :value="1" v-model="list_type_whitelist" />
                            <label for="whitelist" v-tr="i18n_whitelist"></label>&nbsp;&nbsp;
                            <input type="checkbox" id="blacklist" name="listtype" :value="2" v-model="list_type_blacklist" />
                            <label for="blacklist" v-tr="i18n_blacklist"></label>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="w100">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="_table">
                    <tr>
                        <th class="_th text_center" style="width: 5%"><label v-tr="i18n_NO"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_Time"></label></th>
                        <th class="_th text_center" style="width: 15%" v-if="show_extra_condition"><label v-tr="i18n_Face_Name"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_temperature"></label></th>
                        <!-- <th class="_th text_center" style="width: 10%"><label v-tr="i18n_temperatureAlarm"></label></th> -->
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_maskStatus"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_Pic"></label></th>
                        <th class="_th text_center" style="width: 10%" v-if="show_extra_condition"><label v-tr="i18n_operation"></label></th>
                    </tr>

                    <tr v-for="(item, idx) of list" :key="idx">
                        <td class="_td text_center">
                            <label>{{ Offset + (idx + 1) }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.Time }}</label>
                        </td>
                        <td class="_td text_center" v-if="show_extra_condition">
                            <label for="">{{ item.Name }}</label>
                        </td>
                        <td class="_td text_center">
                            <label :style="{ color: item.TemperatureAlarm ? 'red' : 'green' }">{{ trans_temperature(item.Temperature).toFixed(1) }}</label>
                        </td>
                        <!-- <td class="_td text_center" style="word-break: break-all" v-if="false">
                            <label>{{ trans_temperatureAlarm(item.TemperatureAlarm) }}</label>
                        </td> -->
                        <td class="_td text_center">
                            <label>{{ trans_masktype(item.MaskType) }}</label>
                        </td>
                        <td class="_td text_center">
                            <label><img style="height: 126px;width: auto;" :src="'data:image/jpeg;base64,' + item.FaceData"/></label>
                        </td>
                        <td class="_td text_center" v-if="show_extra_condition">
                            <a @click="list_detail(item)" v-tr="i18n_Detail"></a>
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
            <div class="w100 pt10 text_center">
                <label style="color:red;" v-tr="i18n_temperatureNote"></label>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import style from 'mixin/style';
    import history_records from 'mixin/compare-records/comparison_records';
    import export_excel from 'mixin/compare-records/export_excel';

    export default {
        name: 'CVConfigTemperatureRecord',
        mixins: [style, history_records, export_excel],
        inject: ['popup'],
        data() {
            return {
                foot: {
                    logitemcount: 0,
                    totalpages: 1,
                    current_page: 1,
                    name: 'TemperatureComparison',
                },

                tempmin: 30.0,
                tempmax: 40.0,
                masktype: 0,

                temp_unit: 0,

                list_type: 0,
                query_type: 9,
                QueryMode: 0,
            };
        },
        mounted() {
            this.popup.isExport = false;

            msg('CVConfigTemperatureRecord mounted');
            //温度模式 摄氏度 华氏度
            this.$store
                .dispatch('request', {
                    url: 'goform/frmVideoTemperatureCfg',
                    Type: 0,
                    Data: {},
                })
                .then((r) => {
                    this.temp_unit = r.Data.TemperatureUnit;
                });
        },
        methods: {
            pagechanged(n) {
                this.Num = 10;
                this.Offset = (n - 1) * this.Num;
                this.foot.current_page = n;

                this.getQueryResult(1);
            },
            btn_export() {
                this.popup.dialogmode = 'CVDialogFacecomparisonExport';
                this.popup.visible = true;
                this.popup.ExportMsg = '';
            },
            start_export() {
                let autorun = async function() {
                    let plugin = this.$store.getters.config_plugin;
                    let plugin_handle;
                    if (!plugin) {
                        msg('plugin error!!');
                        return;
                    }
                    let filepath = this.popup.ExportPath;
                    msg(['btn_export plugin', plugin, filepath]);

                    let header_types = [
                        {
                            name: this.lang.i18n_capture,
                            type_id: 3,
                        },
                        {
                            name: this.lang.i18n_Time,
                            type_id: 2,
                        },
                        {
                            name: this.lang.i18n_temperature,
                            type_id: 1,
                        },
                    ];
                    if (this.show_extra_condition) {
                        header_types.push({
                            name: this.lang.i18n_Face_Name,
                            type_id: 2,
                        });
                    }
                    header_types = header_types.concat([
                        {
                            name: this.lang.i18n_temperatureAlarm,
                            type_id: 2,
                        },
                        {
                            name: this.lang.i18n_maskStatus,
                            type_id: 2,
                        },
                    ]);
                    plugin_handle = this.create_wb(plugin, filepath, header_types);

                    this.Offset = 0;
                    this.Num = 40;
                    while (1) {
                        if (this.Offset >= this.foot.logitemcount) {
                            msg('export ok!!');
                            this.save_wb(plugin, filepath, plugin_handle);
                            this.popup.isExport = false;
                            // this.$store.commit('temperature/isExport', false);

                            // this.$store.commit('temperature/ExportMsg', this.lang['i18n_AllIsDone']);
                            this.popup.ExportMsg = this.lang['i18n_AllIsDone'];
                            return;
                        }
                        if (!this.popup.isExport) {
                            msg('export break!!');
                            this.save_wb(plugin, filepath, plugin_handle);
                            return;
                        }
                        msg(['offset', this.Offset]);
                        this.popup.ExportMsg = `${this.Offset} / ${this.foot.logitemcount}`;
                        // this.$store.commit('temperature/ExportMsg', `${this.Offset} / ${this.foot.logitemcount}`);
                        let r;
                        try {
                            //重用上次查询的句柄
                            let data = { Type: 5, Ch: 1, Data: { ResultHandle: this.handle, Offset: this.Offset, Num: this.Num } };
                            r = await this.$store.dispatch(
                                'request',
                                $.extend(
                                    true,
                                    {
                                        url: 'goform/frmFaceCompare',
                                    },
                                    data,
                                ),
                            );
                        } catch (e) {
                            msg(['catch', e]);
                            await this.sleep(20000);
                            continue;
                        }
                        if (r.Result == 0) {
                            let data_list = [];
                            r.Data.FaceResults.forEach((item) => {
                                let lt = ['data:image/jpeg;base64,' + item.FaceData, '' + item.Time, item.Temperature];
                                if (this.show_extra_condition) {
                                    lt.push(item.Name);
                                }
                                lt = lt.concat([this.trans_temperatureAlarm(item.TemperatureAlarm), this.trans_masktype(item.MaskType)]);
                                data_list.push(lt);
                            });
                            //  msg(['data_list', data_list, data_list.length]);
                            //plugin.XLSXWriteRowDataList({ handle: plugin_handle, data: data_list });
                            this.addrows(plugin, { handle: plugin_handle, data: data_list });
                        } else if (r.Result == -6) {
                            try {
                                let result_handle = await this.$store.dispatch(
                                    'request',
                                    $.extend(
                                        true,
                                        {
                                            url: 'goform/frmFaceCompare',
                                        },
                                        this.query_data,
                                    ),
                                );
                                if (result_handle.Result == 0) {
                                    this.handle = result_handle.Data.ResultHandle;
                                    while (1) {
                                        let result_progress = await this.$store.dispatch('request', {
                                            url: 'goform/frmFaceCompare',
                                            Type: 4,
                                            Ch: 1,
                                            Data: { ResultHandle: this.handle },
                                        });
                                        if (result_progress.Result == 0) {
                                            if (result_progress.Data.TotalSearchNum > result_progress.Data.CurrentSearchNum) {
                                            } else {
                                                this.foot.logitemcount = result_progress.Data.MatchNum;
                                                break;
                                            }
                                        }
                                    }
                                    continue;
                                }
                            } catch (e) {
                                await this.sleep(20000);
                                continue;
                            }
                        }
                        this.Offset += this.Num;
                    }
                }.bind(this);
                autorun();
            },
            trans_temperature(temp) {
                if (this.temp_unit == 1) {
                    return temp * 1.8 + 32;
                } else {
                    return temp;
                }
            },
            trans_masktype(t) {
                if (t == 0) {
                    return this.lang.i18n_undetect;
                } else if (t == 1) {
                    //未佩戴
                    return this.lang.i18n_maskInvalid;
                } else if (t == 2) {
                    //已佩戴
                    return this.lang.i18n_maskValid;
                } else if (t == 3) {
                    return '';
                }
            },
            trans_temperatureAlarm(t) {
                return t ? this.lang.i18n_yes : this.lang.i18n_no;
            },
            queryRecords() {
                let start_t = this.date_trans(this.starttime);
                let end_t = this.date_trans(this.endtime);
                this.query_data = { Type: this.query_type, Ch: 1, Data: { BeginDateTime: start_t, EndDateTime: end_t } };
                //识别结果
                this.query_data.Data.QueryMode = this.QueryMode;
                //组类型
                this.query_data.Data.SearchType = this.list_type;
                //温度范围
                this.query_data.Data.TemperatureMin = parseFloat(this.tempmin);
                this.query_data.Data.TemperatureMax = parseFloat(this.tempmax);
                this.query_data.Data.MaskType = parseInt(this.masktype);

                this.query();
            },

            list_detail(item) {
                msg('点详情', item);
                this.popup.dialogmode = 'CVDialogFacecomparisonDetail';
                this.popup.visible = true;

                let obj = JSON.parse(JSON.stringify(item));
                obj.Temperature = this.trans_temperature(obj.Temperature);
                this.popup.extradata = obj;
            },
        },
        computed: {
            isExport() {
                return this.popup.isExport;
            },
            list_type_whitelist: {
                get: function() {
                    return (this.list_type >> 1) & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.list_type |= 0x02;
                    } else {
                        this.list_type &= ~0x02;
                    }
                },
            },
            list_type_blacklist: {
                get: function() {
                    return (this.list_type >> 2) & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.list_type |= 0x04;
                    } else {
                        this.list_type &= ~0x04;
                    }
                },
            },

            TempMin: {
                get() {
                    let ret = 0;
                    if (this.temp_unit == 0) {
                        // 摄氏度
                        ret = this.tempmin;
                    } else if (this.temp_unit == 1) {
                        //华氏度
                        ret = this.tempmin * 1.8 + 32;
                    }
                    let vec = ret
                        .toString()
                        .split('.')
                        .map((v) => parseInt(v));
                    if (vec[1]) {
                        return ret.toFixed(1);
                    } else {
                        return ret;
                    }
                },
                set(v) {
                    v = parseFloat(v);
                    if (Object.is(v, NaN)) return;

                    if (this.temp_unit == 0) {
                        // 摄氏度
                        this.tempmin = v;
                    } else if (this.temp_unit == 1) {
                        //华氏度
                        this.tempmin = ((v - 32) * 5) / 9;
                    }
                },
            },
            TempMax: {
                get() {
                    let ret = 0;
                    if (this.temp_unit == 0) {
                        // 摄氏度
                        ret = this.tempmax;
                    } else if (this.temp_unit == 1) {
                        //华氏度
                        ret = this.tempmax * 1.8 + 32;
                    }
                    let vec = ret
                        .toString()
                        .split('.')
                        .map((v) => parseInt(v));
                    if (vec[1]) {
                        return ret.toFixed(1);
                    } else {
                        return ret;
                    }
                },
                set(v) {
                    v = parseFloat(v);
                    if (Object.is(v, NaN)) return;

                    if (this.temp_unit == 0) {
                        // 摄氏度
                        this.tempmax = v;
                    } else if (this.temp_unit == 1) {
                        //华氏度
                        this.tempmax = ((v - 32) * 5) / 9;
                    }
                },
            },
            //是否支持 识别功能
            show_extra_condition() {
                return this.$UI.CVIndexTemperature.CVConfigFaceDB.visible && this.$UI.CVIndexTemperature.CVTempFaceQuery.visible;
            },
        },
        watch: {
            isExport(n, o) {
                if (n) {
                    this.start_export();
                }
            },
        },
    };
</script>
