/**
 * 人脸识别  测温 的历史记录查询 抽取的公共部分
 *
 *
 */
import CVFootMenu from 'components/log/cv-log-footmenu';
import { debounce, checkFloat } from 'common/util';
export default {
    data() {
        return {
            list: [], //显示的历史记录
            starttime: '', //搜索的开始时间
            endtime: '', //搜索的结束时间

            handle: 0, //搜索句柄
            Offset: 0, //获取数据的偏移
            Num: 10, //每次显示数据的个数

            GetNum: 1000, //查询数目

            enableAuth: 0,
            enableUnAuth: 0,
            timer: '',
            value: 0,

            query_disabled: false,
            query_data: {},
            btn_query: () => {},
        };
    },
    mounted() {
        if (!this.queryRecords) {
            msg('!!!!', '查询历史记录缺少queryRecords定义');
        }
        this.btn_query = debounce(this.queryRecords, 1000);
        this.starttime = new Date().format(this.$store.getters.base.date_format) + ' 00:00:00';
        // this.endtime = new Date().format(this.$store.getters.base.date_format + ' hh:mm:ss');
        this.endtime = new Date().format(this.$store.getters.base.date_format + ' 23:59:59');

	//每两分钟重置一下结果句柄的自动释放时间
        this.timer = setInterval(this.activeResultHandle, 2 * 60 *1000);
    },

    methods: {
        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
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
        query() {
            if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                this.$notify.error(this.lang['i18n_checkinput']);
                return;
            }

            this.Offset = 0;
            this.Num = 10;
            this.foot.totalpages = 1;
            this.foot.logitemcount = 0;
            this.foot.current_page = 1;
            if (this.handle != 0) {
                this.freeHandle(this.handle)
                    .then((r) => {
                        this.getData();
                    })
                    .catch((e) => {
                        msg('freehandle error!');
                    });
                this.handle = 0;
            } else {
                this.getData();
            }
        },
        freeHandle(handle) {
            return this.$store.dispatch('request', {
                url: 'goform/frmTrafficPeople ',
                Type: 8,
                Ch: 1,
                Data: { ResultHandle: handle },
            });
        },
        getData() {
            let start_t = this.date_trans(this.starttime);
            let end_t = this.date_trans(this.endtime);
            if (this.date_compare(start_t, end_t)) {
                this.$notify.error(this.lang['i18n_time_range_error']);
                return;
            }

            this.getQueryHandle();
        },
        getQueryHandle() {
            msg(['getData', this.query_data]);
            this.$loading.show = true;
            this.query_disabled = true;
            this.$store
                .dispatch(
                    'request',
                    $.extend(
                        true,
                        {
                            url: 'goform/frmTrafficPeople',
                            type: 1,
                        },
                        this.query_data
                    )
                )
                .then((_) => {
                    if (_.Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (_.Result == 0) {
                            this.handle = _.Data.ResultHandle;
                            this.getQueryProgress();
                        } else if (_.Result == 4) {
                            this.$notify.error(this.lang['i18n_querybusy']);
                        } else {
                            this.$notify.error(this.lang['i18n_getfailed']);
                        }
                    }
                })
                .finally(() => {
                    this.$loading.show = false;
                    this.query_disabled = false;
                });
        },
        getQueryProgress() {
            let data = { Type: 5, Ch: 1, Data: { ResultHandle: this.handle } };
            this.$store
                .dispatch(
                    'request',
                    $.extend(
                        true,
                        {
                            url: 'goform/frmTrafficPeople',
                        },
                        data
                    )
                )
                .then((_) => {
                    if (_.Result == 0) {
                        if (_.Data.StatusCode == 1) {
                            this.getQueryProgress();
                        } else {
                            this.foot.logitemcount = _.Data.MatchNum;
                            let totalpage = Math.ceil(_.Data.MatchNum / this.Num);
                            this.foot.totalpages = totalpage ? totalpage : 1;
                            if (this.Offset >= _.Data.MatchNum) {
                                this.Offset = (this.foot.totalpages - 1) * this.Num;
                            }
                            this.foot.current_page = this.Offset / this.Num + 1;
                            this.getQueryResult();
                        }
                    } else if (_.Result == 4) {
                        this.$notify.error(this.lang['i18n_querybusy']);
                    } else {
                        this.$notify.error(this.lang['i18n_getfailed']);
                    }
                })
                .finally(() => {
                    this.$loading.show = false;
                    this.query_disabled = false;
                });
        },
        getQueryResult(type) {
            let tmpVal = this.foot.logitemcount - this.Num * this.foot.current_page; //由于从数组中取数据是由后往前取的，这里是 计算 每次应该 从何处开始取
            let tmpOffset = null;
            let tmpNum = null;
            if (tmpVal > 0) {
                tmpOffset = tmpVal;
                tmpNum = this.Num;
            } else if (tmpVal == 0) {
                //总数为10的倍数时,最后一页取数组前10个数
                tmpOffset = 0;
                tmpNum = this.Num;
            } else {
                tmpOffset = 0;
                tmpNum = this.foot.logitemcount % this.Num;
            }
            let data = {
                Type: 6,
                Ch: 1,
                Data: {
                    ResultHandle: this.handle,
                    Offset: tmpOffset,
                    Num: tmpNum,
                },
            };
            this.$store
                .dispatch(
                    'request',
                    $.extend(
                        true,
                        {
                            url: 'goform/frmTrafficPeople',
                        },
                        data
                    )
                )
                .then((_) => {
                    if (_.Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (_.Result == 0) {
                            //获取渲染列表的10条数据
                            this.list = _.Data.FaceResults.reverse();
                            this.$notify.success(this.lang['i18n_getok']);
                        } else{
                            this.list = {};
                            this.$notify.error(this.lang['i18n_NoResult']);
                        } 
                    }
                })
                .finally(() => {
                    this.$loading.show = false;
                    this.query_disabled = false;
                });
        },
        date_trans(datetime) {
            let v = datetime.split(' ');
            let v0 = v[0].split('-').map((_) => parseInt(_, 10));
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
            return v0.join('-') + ` ${v[1]}`;
        },
        date_compare(date1, date2) {
            let v1 = new Date(date1.replace(/-/g, '/'));
            let v2 = new Date(date2.replace(/-/g, '/'));
            return v1 > v2;
        },
        activeResultHandle(){
            this.value ++;
           if(this.handle <= 0){
                return;
           }

            let data = {
                Type: 13,
                Ch: 1,
                Data: {
                    ResultHandle: this.handle,
                },
            };
            this.$store
            .dispatch(
                'request',
                $.extend(
                    true,
                    {
                        url: 'goform/frmTrafficPeople',
                    },
                    data
                )
            )
            .then((_) => {})
        },
        date_isopen(){},
    },
    beforeDestroy() {
        if (this.handle) {
            this.freeHandle(this.handle);
        }

        clearInterval(this.timer);
    },


    components: {
        CVFootMenu,
    },
};
