import { mbStringLength } from 'common/util';
export default {
    methods: {
        ie_get_reqlist() {
            return Promise.all([
                this.$store.dispatch('request', {
                    url: 'goform/frmSingleLineOSD',
                    Type: 10,
                    Data: {},
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                }),
                this.$store.dispatch('request', {
                    url: 'goform/frmMultiLineOSD',
                    Type: 10,
                    Data: {},
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                }),
            ]);
        },
        ie_getdata({ OSDLattice }, { MultiOSDLattice }) {
            ['Main', 'Sub', 'Third', 'Fourth', 'Fifth'].forEach((element) => {
                if (OSDLattice[`${element}StreamFontSize`]) {
                    this[`${element}_osd_selected`] = OSDLattice[`${element}StreamFontSize`];
                } else {
                    this.ui_custom[`${element.toLowerCase()}OSDFontSize`].visible = false;
                }
            });

            this.chan_name = OSDLattice.Text;
            this.show_channame = OSDLattice.Enable ? true : false;
            this.show_hourosd = OSDLattice.EnableDateOSD ? true : false;
            this.date_osd_type = OSDLattice.DateOSDType;
            this.hour_osd_type = OSDLattice.DateOSDHourType;
            this.chan_location = OSDLattice.ChanNameLocation;
            this.time_location = OSDLattice.TimeLocation;
            this.font_name = OSDLattice.FontName;
            this.d.OSDLattice = OSDLattice;

            if (this.isIE) {
                this.background.background = '#' + OSDLattice.BitColor;
                this.bitcolor = OSDLattice.BitColor;
            } else {
                this.bitcolor = '#' + OSDLattice.BitColor;
            }
            msg('multi');

            this.show_multiosd = MultiOSDLattice.Enable ? true : false;
            this.multi_text = MultiOSDLattice.Text;
            this.multi_location = MultiOSDLattice.Location;
            this.d.MultiOSDLattice = MultiOSDLattice;
        },
        ie_save_firstreq() {
            return this.$store.dispatch('request', {
                url: 'goform/frmSingleLineOSD',
                Type: 11,
                Data: { OSDLattice: this.d.OSDLattice },
                Dev: this.$store.getters.config.dev,
                Ch: this.$store.getters.config.ch,
            });
        },
        ie_save_secondreq() {
            return this.$store.dispatch('request', {
                url: 'goform/frmMultiLineOSD',
                Type: 11,
                Data: { MultiOSDLattice: this.d.MultiOSDLattice },
                Dev: this.$store.getters.config.dev,
                Ch: this.$store.getters.config.ch,
            });
        },
        ie_save_setdata() {
            this.d.OSDLattice.EnableDateOSD = this.show_hourosd ? 1 : 0;
            this.d.OSDLattice.DateOSDType = this.date_osd_type;
            this.d.OSDLattice.DateOSDHourType = this.hour_osd_type;
            this.d.OSDLattice.Text = this.chan_name;
            this.d.OSDLattice.Enable = this.show_channame ? 1 : 0;
            this.d.OSDLattice.BitColor = this.isIE ? this.bitcolor : this.bitcolor.substr(1);
            this.d.MultiOSDLattice.BitColor = this.d.OSDLattice.BitColor;

            this.d.MultiOSDLattice.Enable = this.show_multiosd ? 1 : 0;
            this.d.MultiOSDLattice.Text = this.multi_text;
            this.d.MultiOSDLattice.BitColor = this.d.OSDLattice.BitColor;

            this.ie_generate_matrix();
            this.d.OSDLattice.TextLength = mbStringLength(this.d.OSDLattice.Text);
            this.d.OSDLattice.BitType = 0;
            this.d.MultiOSDLattice.TextLength = mbStringLength(this.d.MultiOSDLattice.Text);
            this.d.MultiOSDLattice.BitType = 0;
        },

        ie_check_position(type, mode) {
            if (type == 'chan_name') {
                switch (mode) {
                    case 0:
                        this.d.OSDLattice.PosY -= 50;
                        break;
                    case 1:
                        this.d.OSDLattice.PosY += 50;
                        break;
                    case 2:
                        this.d.OSDLattice.PosX -= 50;
                        break;
                    case 3:
                        this.d.OSDLattice.PosX += 50;
                        break;
                }
                if (this.d.OSDLattice.PosY < 0) {
                    this.d.OSDLattice.PosY = 0;
                }
                if (this.d.OSDLattice.PosY > 1000) {
                    this.d.OSDLattice.PosY = 1000;
                }
                if (this.d.OSDLattice.PosX < 0) {
                    this.d.OSDLattice.PosX = 0;
                }
                if (this.d.OSDLattice.PosX > 1000) {
                    this.d.OSDLattice.PosX = 1000;
                }
                this.$store.dispatch('request', {
                    url: 'goform/frmSingleLineOSD',
                    Type: 11,
                    Data: {
                        OSDLattice: {
                            ChanNameLocation: 0,
                            PosX: this.d.OSDLattice.PosX,
                            PosY: this.d.OSDLattice.PosY,
                        },
                    },
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                });
            } else if (type == 'osd') {
                switch (mode) {
                    case 0:
                        this.d.OSDLattice.DateOSDPosY -= 50;
                        break;
                    case 1:
                        this.d.OSDLattice.DateOSDPosY += 50;
                        break;
                    case 2:
                        this.d.OSDLattice.DateOSDPosX -= 50;
                        break;
                    case 3:
                        this.d.OSDLattice.DateOSDPosX += 50;
                        break;
                }
                if (this.d.OSDLattice.DateOSDPosY < 0) {
                    this.d.OSDLattice.DateOSDPosY = 0;
                }
                if (this.d.OSDLattice.DateOSDPosY > 1000) {
                    this.d.OSDLattice.DateOSDPosY = 1000;
                }
                if (this.d.OSDLattice.DateOSDPosX < 0) {
                    this.d.OSDLattice.DateOSDPosX = 0;
                }
                if (this.d.OSDLattice.DateOSDPosX > 1000) {
                    this.d.OSDLattice.DateOSDPosX = 1000;
                }

                this.$store.dispatch('request', {
                    url: 'goform/frmSingleLineOSD',
                    Type: 11,
                    Data: {
                        OSDLattice: {
                            TimeLocation: 0,
                            DateOSDPosX: this.d.OSDLattice.DateOSDPosX,
                            DateOSDPosY: this.d.OSDLattice.DateOSDPosY,
                        },
                    },
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                });

                switch (mode) {
                    case 0:
                        this.d.OSD.OSDTopLeftY -= 10;
                        break;
                    case 1:
                        this.d.OSD.OSDTopLeftY += 10;
                        break;
                    case 2:
                        this.d.OSD.OSDTopLeftX -= 10;
                        break;
                    case 3:
                        this.d.OSD.OSDTopLeftX += 10;
                        break;
                }
                if (this.d.OSD.OSDTopLeftY < 0) {
                    this.d.OSD.ChanNamOSDTopLeftYeTopLeftY = 0;
                }
                if (this.d.OSD.OSDTopLeftY > 288) {
                    this.d.OSD.OSDTopLeftY = 288;
                }
                if (this.d.OSD.OSDTopLeftX < 0) {
                    this.d.OSD.OSDTopLeftX = 0;
                }
                if (this.d.OSD.OSDTopLeftX > 352) {
                    this.d.OSD.OSDTopLeftX = 352;
                }
                this.$store.dispatch('request', {
                    url: 'goform/frmSingleLineOSD',
                    Type: 1,
                    Data: {
                        OSD: {
                            TimeLocation: 0,
                            OSDTopLeftX: this.d.OSD.OSDTopLeftX,
                            OSDTopLeftY: this.d.OSD.OSDTopLeftY,
                        },
                    },
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                });
            } else if (type == 'multi_osd') {
                switch (mode) {
                    case 0:
                        this.d.MultiOSDLattice.PosY -= 50;
                        break;
                    case 1:
                        this.d.MultiOSDLattice.PosY += 50;
                        break;
                    case 2:
                        this.d.MultiOSDLattice.PosX -= 50;
                        break;
                    case 3:
                        this.d.MultiOSDLattice.PosX += 50;
                        break;
                }
                if (this.d.MultiOSDLattice.PosY < 0) {
                    this.d.MultiOSDLattice.PosY = 0;
                }
                if (this.d.MultiOSDLattice.PosY > 1000) {
                    this.d.MultiOSDLattice.PosY = 1000;
                }
                if (this.d.MultiOSDLattice.PosX < 0) {
                    this.d.MultiOSDLattice.PosX = 0;
                }
                if (this.d.MultiOSDLattice.PosX > 1000) {
                    this.d.MultiOSDLattice.PosX = 1000;
                }
                this.$store.dispatch('request', {
                    url: 'goform/frmMultiLineOSD',
                    Type: 11,
                    Data: {
                        MultiOSDLattice: {
                            Location: 0,
                            PosX: this.d.MultiOSDLattice.PosX,
                            PosY: this.d.MultiOSDLattice.PosY,
                        },
                    },
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                });
            }
        },

        ie_chan_location(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == -1) return;

                this.d.OSDLattice.ChanNameLocation = curVal;
                let align = curVal == 2 || curVal == 4 ? 'right' : 'left';
                if (curVal) {
                    this.ie_generate_matrix(true, false, align);

                    this.$store.dispatch('request', {
                        url: 'goform/frmSingleLineOSD',
                        Type: 11,
                        Data: {
                            OSDLattice: this.d.OSDLattice,
                        },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    });
                } else {
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmSingleLineOSD',
                            Type: 10,
                            Data: {},
                            Dev: this.$store.getters.config.dev,
                            Ch: this.$store.getters.config.ch,
                        })
                        .then((r) => {
                            if (r.Result == 0) {
                                this.d.OSDLattice.PosX = r.Data.OSDLattice.PosX;
                                this.d.OSDLattice.PosY = r.Data.OSDLattice.PosY;
                            }
                        });
                }
            }
        },
        ie_time_location(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == -1) return;

                this.d.OSDLattice.TimeLocation = curVal;
                let align = curVal == 2 || curVal == 4 ? 'right' : 'left';
                if (curVal) {
                    this.ie_generate_matrix(true, false, align);
                    this.$store.dispatch('request', {
                        url: 'goform/frmSingleLineOSD',
                        Type: 11,
                        Data: { OSDLattice: this.d.OSDLattice },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    });
                } else {
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmSingleLineOSD',
                            Type: 10,
                            Data: {},
                            Dev: this.$store.getters.config.dev,
                            Ch: this.$store.getters.config.ch,
                        })
                        .then((r) => {
                            if (r.Result == 0) {
                                this.d.OSDLattice.DateOSDPosX = r.Data.OSDLattice.DateOSDPosX;
                                this.d.OSDLattice.DateOSDPosY = r.Data.OSDLattice.DateOSDPosY;
                            }
                        });
                }
            }
        },
        ie_multi_location(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == -1) return;

                this.d.MultiOSDLattice.Location = curVal;
                let align = curVal == 2 || curVal == 4 ? 'right' : 'left';
                if (curVal) {
                    this.ie_generate_matrix(false, true, align);
                    this.$store.dispatch('request', {
                        url: 'goform/frmMultiLineOSD',
                        Type: 11,
                        Data: {
                            MultiOSDLattice: this.d.MultiOSDLattice,
                        },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    });
                } else {
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmMultiLineOSD',
                            Type: 10,
                            Data: {},
                            Dev: this.$store.getters.config.dev,
                            Ch: this.$store.getters.config.ch,
                        })
                        .then((r) => {
                            if (r.Result == 0) {
                                this.d.MultiOSDLattice.PosX = r.Data.MultiOSDLattice.PosX;
                                this.d.MultiOSDLattice.PosY = r.Data.MultiOSDLattice.PosY;
                            }
                        });
                }
            }
        },
        ie_font_name(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == '') return;

                this.d.OSDLattice.FontName = curVal;
                this.d.MultiOSDLattice.FontName = curVal;

                this.ie_generate_matrix();

                Promise.all([
                    this.$store.dispatch('request', {
                        url: 'goform/frmSingleLineOSD',
                        Type: 11,
                        Data: { OSDLattice: this.d.OSDLattice },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    }),
                    this.$store.dispatch('request', {
                        url: 'goform/frmMultiLineOSD',
                        Type: 11,
                        Data: { MultiOSDLattice: this.d.MultiOSDLattice },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    }),
                ]);
            }
        },
        /**
         * 根据当前码流 产生标题和多行osd的点阵
         * @param {boolean} [single=true] 是否产生标题点阵
         * @param {boolean} [multi=true] 是否产生多行osd点阵
         * @param {string} [align="left"] 点阵 默认左对齐
         */
        ie_generate_matrix(single = true, multi = true, align = 'left') {
            var Activex = this.config_plugin;
            msg('get Matrix', Activex);
            if (Activex) {
                let curFont = this.get_font();
                for (let el of ['Main', 'Sub', 'Third', 'Fourth', 'Fifth']) {
                    let b1, b2;
                    if (single && this.d.OSDLattice[`${el}StreamFontSize`]) {
                        this.d.OSDLattice[`${el}StreamFontSize`] = this[`${el}_osd_selected`];
                        b1 = true;
                    } else {
                        b1 = false;
                    }
                    if (multi && this.d.MultiOSDLattice[`${el}StreamFontSize`]) {
                        this.d.MultiOSDLattice[`${el}StreamFontSize`] = this[`${el}_osd_selected`];
                        b2 = true;
                    } else {
                        b2 = false;
                    }
                    if (!b1 && !b2) continue;
                    //Get Dot Matrix

                    //get osd
                    if (single && this.d.OSDLattice[`${el}StreamFontSize`]) {
                        var ret = Activex.StringToDotMatrix({
                            data: this.d.OSDLattice.Text,
                            pt: (12 * this[`${el}_osd_selected`]) / 10,
                            bit_type: 0,
                            align,
                            font_family: curFont,
                        });
                    }

                    //get MultiOSDLattice
                    if (multi && this.d.MultiOSDLattice.SubStreamFontSize) {
                        var mul_ret = Activex.StringToDotMatrix({
                            data: this.d.MultiOSDLattice.Text,
                            pt: (12 * this[`${el}_osd_selected`]) / 10,
                            bit_type: 0,
                            align,
                            font_family: curFont,
                        });
                    }

                    var tmp = ['bytes_array', 'bytes_length', 'width', 'height'];
                    var tmp_real = ['BytesArray', 'BytesLength', 'Width', 'Height'];

                    if (single) this.d.OSDLattice[`${el}`] = {};
                    if (multi) this.d.MultiOSDLattice[`${el}`] = {};

                    for (var i = 0; i < tmp.length; i++) {
                        if (single) this.d.OSDLattice[`${el}`][tmp_real[i]] = ret[tmp[i]];
                        if (multi) this.d.MultiOSDLattice[`${el}`][tmp_real[i]] = mul_ret[tmp[i]];
                    }
                }
            }
        },
    },
};
