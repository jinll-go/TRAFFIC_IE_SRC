<template>
    <div>
        <div class="file_container clearfix">
            <!-- 左侧日历 -->
            <div class="file_left r_bg" :style="'height:' + plugin_height + 'px;'">
                <div>
                    <label class="bold" v-tr="i18n_file_linkpic"></label>
                </div>
                <ul class="menu" style="margin:0 auto px10 ">
                    <li>
                        <div class="log_1 text_center"><label v-tr="i18n_beginTime"></label></div>
                        <div class="log_2">
                            <input class="w99  textc" ref="begin_time" name="file_starttime" :value="file_starttime" @click="show_calendar" readonly="true" />
                        </div>
                    </li>
                    <li>
                        <div class="log_1 text_center"><label v-tr="i18n_endTime"></label></div>
                        <div class="log_2">
                            <input class="w99 textc" ref="end_time" name="file_endtime" :value="file_endtime" @click="show_calendar" readonly="true" />
                        </div>
                    </li>
                    <li>
                        <div class="log_1 text_center"><label v-tr="i18n_pageNum"></label></div>
                        <div class="log_2">
                            <select class="w99  textc" v-model="Num" @change="getPageNum($event)">
                                <option value="20" selected="selected">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </li>
                    <li style="margin-left:30px;margin-top:10px">
                        <button @click="search" :class="button_style" style="width:140px;" v-tr="i18n_search"></button>
                    </li>
                </ul>
            </div>
            <!-- 右侧 搜索出的图片 -->
            <div :style="'height:' + plugin_height + 'px;'" style="overflow:auto">
                <div>

						<ul class="file_middle">
							<li v-for="(item, idx) in pic_list" class="rightPic">
								<img class="min" :src="img_src + '/snapshot/' + item" @click="clickImg($event)" />
								<label style="word-wrap:break-word;width:138px; ">{{ item }}</label>
							</li>
						</ul>
						<CVFootMenu ref="footmenu" :foot="foot" @pagechanged="pagechanged"></CVFootMenu>
                </div>
            </div>
        </div>
        <CVFileDialog v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></CVFileDialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CVLogSearch from 'components/log/cv-log-search';
    import { rangeArray, padZero } from 'common/util';
    import style from 'mixin/style';
    import { current_year, current_month, current_day, LocalTimeToUTC, isLeapYear, getMonthDays } from 'common/util';

    import CVFootMenu from 'components/log/cv-log-footmenu';
    import CVFileDialog from 'components/file/cv-file-dialog';

    export default {
        name: 'CVFrameFile',
        mixins: [style],
        data() {
            return {
                check_times: false,
                pic_list: [],

                foot: {
                    logitemcount: 0, //搜索时间段内图片总数量
                    totalpages: 1, //总页数
                    current_page: 1, //当前页
                    name: 'file',
                },
                Offset: 0, //偏移量
                showImg: false,
                imgSrc: '',
                totalPicList: [],
            };
        },

        mounted() {
            msg(['File Mounted!']);

            let ctrl = this.$refs.begin_time;
            ctrl.value = new Date().format(this.$store.getters.base.date_format);
            this.$store.commit('file/starttime_val_changed', this.LocalToUTC(ctrl.value + '-00-00-00'));

            ctrl = this.$refs.end_time;
            ctrl.value = new Date().format(this.$store.getters.base.date_format);
            this.$store.commit('file/endtime_val_changed', this.LocalToUTC(ctrl.value + '-23-59-59'));
        },
        methods: {
            pagechanged(n) {
                this.CurrentPage = this.foot.current_page = n; //第几页
                // msg(['n是多少？', n, this.Num]);
                this.refresh_list((n - 1) * this.Num); //每页显示条数
            },
            clickImg(e) {
                this.showImg = true;
                this.imgSrc = e.target.currentSrc;
            },
            viewImg() {
                this.showImg = false;
            },

            getPageNum(e) {
                this.Offset = 0;
                this.$store.commit('file/pageNum_changed', parseInt(e.target.value));
            },

            //更新显示的图片列表

            /*result拿到的是页面跳转的Offset
		更新图片列表偏移量: result
		图片总数:this.totalPicList
		当前页:this.CurrentPage
		截取到的数组要渲染: this.CurrentPage * this.Num
		每页显示的条数: this.Num */

            refresh_list(result) {
                this.pic_list = [];
                this.Offset = result;
                this.pic_list = this.totalPicList.slice(this.Offset, this.CurrentPage * this.Num);
            },

            getData() {
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmSearchSDCardPics',
                        Type: 0,
                        Data: {
                            DeviceLocalDateTimeStart: this.File_StartTime,
                            DeviceLocalDateTimeStop: this.File_EndTime,
                        },
                    })
                    .then((_) => {
                        if (_.Result === 0) {
                            if (_.Data.SearchResults.length == 0) {
                                this.$notify.success(this.$store.getters.current_language['i18n_search_null']);
                            }
                            this.foot.logitemcount = _.Data.SearchResults.length; //图片总数量
                            this.totalPicList = _.Data.SearchResults;
                            let totalpage = Math.ceil(_.Data.SearchResults.length / this.Num);
                            this.foot.totalpages = totalpage ? totalpage : 1;

                            if (this.Offset >= _.Data.SearchResults.length) {
                                this.Offset = (this.foot.totalpages - 1) * this.Num;
                            }
                            this.foot.current_page = this.Offset / this.Num + 1;

                            this.pic_list = [];
                            let tmp_min = Math.min(_.Data.SearchResults.length, this.Num + this.Offset);
                            for (let i = this.Offset; i < tmp_min; i++) {
                                this.pic_list.push(_.Data.SearchResults[i]);
                            }
                        }
                    });
            },

            search() {
                this.File_File_StartTime = this.LocalToUTC(this.file_starttime + '-00-00-00');
                this.File_EndTime = this.LocalToUTC(this.file_endtime + '-23-59-59');
                if (parseInt(this.File_StartTime, 10) > parseInt(this.File_EndTime, 10)) {
                    alert(this.lang['i18n_time_range_error']);
                    return;
                }
                this.CurrentPage = 1;
                this.foot.totalpages = 1;
                this.foot.logitemcount = 0;
                this.foot.current_page = 1;

                this.getData();
            },
            LocalToUTC(val) {
                let ar = val.split('-');
                switch (this.$store.getters.base.date_format) {
                    case 'MM-dd-yyyy':
                        [ar[1], ar[2], ar[0]] = ar;
                        break;
                    case 'dd-MM-yyyy':
                        [ar[2], ar[1], ar[0]] = ar;
                        break;
                    default:
                        break;
                }

                return ar.join('');
            },

            show_calendar(e) {
                e.target.isDateOnly = true;
                this.$store.getters.calendar.show(e.target, this.hide_calendar);
            },

            hide_calendar(ctrl) {
                var _n = $(ctrl).attr('name');
                if (!_n) return;
                let val = {
                    file_starttime: '-00-00-00',
                    file_endtime: '-23-59-59',
                };
                this.$store.dispatch(`${_n}_val_changed`, this.LocalToUTC(ctrl.value + val[_n]));

                if (parseInt(this.$store.getters.file_StartTime, 10) > parseInt(this.$store.getters.file_EndTime, 10)) {
                    this.check_times = true;
                } else {
                    this.check_times = false;
                }
            },
            get_format_datetime_str(val) {
                let y = val.substr(0, 4);
                let m = val.substr(4, 2);
                let d = val.substr(6, 2);

                let ret = '';
                switch (this.$store.getters.base.date_format) {
                    case 'MM-dd-yyyy':
                        ret = [m, d, y].join('-'); //+ " " + [hour, min, sec].join(":");
                        break;
                    case 'dd-MM-yyyy':
                        ret = [d, m, y].join('-'); //+ " " + [hour, min, sec].join(":");
                        break;
                    default:
                        ret = [y, m, d].join('-'); //+ " " + [hour, min, sec].join(":");
                        break;
                }

                return ret;
            },
        },
        computed: {
            img_src() {
                return window.location.protocol + '//' + this.$store.getters.ip;
            },
            plugin_height() {
                return this.$store.getters.content_rect.height - 76;
            },

            File_StartTime: {
                get() {
                    return this.$store.getters.file.StartTime;
                },
                set(v) {
                    this.$store.commit('file/starttime_val_changed', v);
                },
            },
            File_EndTime: {
                get() {
                    return this.$store.getters.file.EndTime;
                },
                set(v) {
                    this.$store.commit('file/endtime_val_changed', v);
                },
            },
            Num: {
                get() {
                    return this.$store.getters.file.Num;
                },
                set(v) {
                    this.$store.commit('file/pageNum_changed', parseInt(v));
                },
            },
            CurrentPage: {
                get() {
                    return this.$store.getters.file.CurrentPage;
                },
                set(v) {
                    this.$store.commit('file/pageIdx_changed', v);
                },
            },

            file_starttime() {
                return this.get_format_datetime_str(this.File_StartTime);
            },
            file_endtime() {
                return this.get_format_datetime_str(this.File_EndTime);
            },
        },
        components: {
            CVLogSearch,
            CVFootMenu,
            CVFileDialog,
        },
    };
</script>

<style scoped>
    .div-inline {
        display: inline;
    }
    .max {
        width: 100%;
        height: 100%;
    }

    .min {
        width: auto;
	height: 103.5px;
        max-width: 100%;
        max-height: 100%;
    }
    .rightPic {
        width: 138px;
        height: 130px;
        float: left;
        margin-right: 20px;
        margin-bottom: 10px;
        margin-top: 20px;
    }
</style>
