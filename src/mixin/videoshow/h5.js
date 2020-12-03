export default {
    methods: {
        h5_get_reqlist() {
            return this.flash_get_reqlist();
        },
        h5_getdata(d1, d2) {
            return this.flash_getdata(d1, d2);
        },
        h5_save_firstreq() {
            return this.flash_save_firstreq();
        },
        h5_save_secondreq() {
            return this.flash_save_secondreq();
        },
        h5_save_setdata() {
            return this.flash_save_setdata();
        },
        h5_check_position(type, mode) {
            return this.flash_check_position(type, mode);
        },
        h5_chan_location(curVal, oldVal) {
            return this.flash_chan_location(curVal, oldVal);
        },
        h5_time_location(curVal, oldVal) {
            return this.flash_time_location(curVal, oldVal);
        },
        h5_multi_location(curVal, oldVal) {
            return this.flash_multi_location(curVal, oldVal);
        },
        h5_font_name(curVal, oldVal) {
            return this.flash_font_name(curVal, oldVal);
        },
    },
};
