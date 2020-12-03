export default {
    data() {
        return {
            d: [],
            foot: {
                logitemcount: 0,
                totalpages: 1,
                current_page: this.$store.getters.current_page,
                name: 'log',
            },
            need_restore_loading: false,
        };
    },
    mounted() {
        this.$store.dispatch('log_val_restore');
    },
    methods: {
        search() {
            this.$store.dispatch('page_turning', 1);
            this.GetLog();
        },
        pagechanged(n) {
            this.$store.dispatch('page_turning', n);
            this.GetLog();
        },
        async GetLog() {
            if (this.$refs.logsearch.check_times) {
                alert(this.$store.getters.current_language['i18n_time_range_error']);
                return;
            }

            //本地时间UTC转成 IPC时区的UTC时间
            // let r = await this.$store.dispatch("request", { url: "goform/frmNetNtpPara", Type: 0, Data: {} });
            //{"Result":0,"Data":{"EnableNTP":0,"NTPServer":"","TimeInterval":0,"NTPPort":123,"TimeOffsetHour":8,"TimeOffsetMinute":0}}
            // let ipcTZOffset = (r.Data.TimeOffsetHour * 60 + r.Data.TimeOffsetMinute) * -1; //min
            // let extra_secs = (ipcTZOffset - new Date().getTimezoneOffset()) * 60;

            //  this.$store.commit("log/starttime_val_changed", this.$store.getters.log.StartTime + extra_secs);
            // this.$store.commit("log/endtime_val_changed", this.$store.getters.log.EndTime + extra_secs);

            this.$loading.show = true;
            try {
                let list = await this.$store.dispatch('frmLogCtrl', {});

                this.$loading.show = false;
                if (list.Result == -655365) {
                    //get log failed!
                    alert(this.$store.getters.current_language['i18n_no_rights']);
                } else if (list.Result == -655366) {
                    //get query busy!
                    this.$loading.show = false;
                    alert(this.$store.getters.current_language['i18n_log_getbusy']);
                } else if (list.Result == 0) {
                    this.d = list.Data.LogResults.Items;
                    this.foot.logitemcount = list.Data.LogItemCount;
                    this.foot.totalpages = list.Data.TotalPages;
                    this.foot.current_page = this.$store.getters.current_page;
                    this.$loading.show = false;
                } else {
                    alert(this.$store.getters.current_language['i18n_log_getfailed']);
                }
            } catch (e) {
                this.$loading.show = false;
                alert(this.$store.getters.current_language['i18n_log_getexception']);
            }
        },
    },
    computed: {
        activated() {
            return this.$store.getters.log_activated;
        },
    },
    watch: {
        activated(newVal, oldVal) {
            if (newVal) {
                if (this.need_restore_loading) {
                    this.$loading.show = true;
                    this.need_restore_loading = false;
                }
            } else {
                if ($('#waitDiv').is(':visible')) {
                    this.need_restore_loading = true;
                    this.$loading.show = false;
                }
            }
        },
    },
};
