export default {
    methods: {
        flash_get_reqlist() {
            return Promise.all([
                this.$store.dispatch('request', {
                    url: 'goform/frmSingleLineOSD',
                    Type: 0,
                    Data: {},
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                }),
                this.$store.dispatch('request', {
                    url: 'goform/frmMultiLineOSD',
                    Type: 0,
                    Data: {},
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                }),
            ]);
        },
        flash_getdata({ OSD }, { MultiOSD }) {
            let osd = OSD;
            this.show_hourosd = osd.IsShowOSD ? true : false;
            this.date_osd_type = osd.OSDType;
            this.hour_osd_type = osd.OSDHourType;
            this.d.OSD = osd;

            if (this.isIE) {
                this.background.background = '#' + osd.BitColor;
                this.bitcolor = osd.BitColor;
            } else {
                this.bitcolor = '#' + osd.BitColor;
            }

            this.Main_osd_selected = osd.FirstStreamOsdSize;

            if (osd.SecondStreamOsdSize) {
                this.Sub_osd_selected = osd.SecondStreamOsdSize;
            } else {
                this.ui_custom.subOSDFontSize.visible = false;
            }
            if (osd.ThirdStreamOsdSize) {
                this.Third_osd_selected = osd.ThirdStreamOsdSize;
            } else {
                this.ui_custom.thirdOSDFontSize.visible = false;
            }

            if (osd.FourthStreamFontSize) {
                this.Fourth_osd_selected = osd.FourthStreamFontSize;
            } else {
                this.ui_custom.fourthOSDFontSize.visible = false;
            }

            if (osd.FifthStreamFontSize) {
                this.Fifth_osd_selected = osd.FifthStreamFontSize;
            } else {
                this.ui_custom.fifthOSDFontSize.visible = false;
            }
            this.chan_name = osd.ChanName;
            this.show_channame = osd.IsShowChanName ? true : false;
            this.chan_location = osd.ChanNameLocation;
            this.time_location = osd.TimeLocation;
            this.font_name = osd.FontName;

            this.show_multiosd = MultiOSD.IsShowMultiOSD ? true : false;
            this.multi_text = MultiOSD.Text;
            this.multi_location = MultiOSD.Location;
            this.d.MultiOSD = MultiOSD;
        },
        flash_save_firstreq() {
            return this.$store.dispatch('request', {
                url: 'goform/frmSingleLineOSD',
                Type: 1,
                Data: { OSD: this.d.OSD },
                Dev: this.$store.getters.config.dev,
                Ch: this.$store.getters.config.ch,
            });
        },
        flash_save_secondreq() {
            return this.$store.dispatch('request', {
                url: 'goform/frmMultiLineOSD',
                Type: 1,
                Data: { MultiOSD: this.d.MultiOSD },
                Dev: this.$store.getters.config.dev,
                Ch: this.$store.getters.config.ch,
            });
        },
        flash_save_setdata() {
            this.d.OSD.ChanName = this.chan_name;
            this.d.OSD.IsShowChanName = this.show_channame ? 1 : 0;

            this.d.OSD.OSDType = this.date_osd_type;
            this.d.OSD.OSDHourType = this.hour_osd_type;
            this.d.OSD.IsShowOSD = this.show_hourosd ? 1 : 0;
            this.d.OSD.FirstStreamOsdSize = this.Main_osd_selected;
            if (this.d.OSD.SecondStreamOsdSize) {
                this.d.OSD.SecondStreamOsdSize = this.Sub_osd_selected;
            }
            if (this.d.OSD.ThirdStreamOsdSize) {
                this.d.OSD.ThirdStreamOsdSize = this.Third_osd_selected;
            }
            if (this.d.OSD.FourthStreamFontSize) {
                this.d.OSD.FourthStreamFontSize = this.Fourth_osd_selected;
            }
            if (this.d.OSD.FifthStreamFontSize) {
                this.d.OSD.FifthStreamFontSize = this.Fifth_osd_selected;
            }
            this.d.OSD.BitColor = this.isIE ? this.bitcolor : this.bitcolor.substr(1);
            this.d.MultiOSD.BitColor = this.d.OSD.BitColor;
            this.d.MultiOSD.Text = this.multi_text;
            this.d.MultiOSD.IsShowMultiOSD = this.show_multiosd ? 1 : 0;
            this.d.MultiOSD.FirstStreamOsdSize = this.Main_osd_selected;
            if (this.d.MultiOSD.SecondStreamOsdSize) {
                this.d.MultiOSD.SecondStreamOsdSize = this.Sub_osd_selected;
            }
            if (this.d.MultiOSD.ThirdStreamOsdSize) {
                this.d.MultiOSD.ThirdStreamOsdSize = this.Third_osd_selected;
            }

            if (this.d.MultiOSD.FourthStreamFontSize) {
                this.d.MultiOSD.FourthStreamFontSize = this.Fourth_osd_selected;
            }

            if (this.d.MultiOSD.FifthStreamFontSize) {
                this.d.MultiOSD.FifthStreamFontSize = this.Fifth_osd_selected;
            }
        },
        flash_check_position(type, mode) {
            if (type == 'chan_name') {
                switch (mode) {
                    case 0:
                        this.d.OSD.ChanNameTopLeftY -= 10;
                        break;
                    case 1:
                        this.d.OSD.ChanNameTopLeftY += 10;
                        break;
                    case 2:
                        this.d.OSD.ChanNameTopLeftX -= 10;
                        break;
                    case 3:
                        this.d.OSD.ChanNameTopLeftX += 10;
                        break;
                }
                if (this.d.OSD.ChanNameTopLeftY < 0) {
                    this.d.OSD.ChanNameTopLeftY = 0;
                }
                if (this.d.OSD.ChanNameTopLeftY > 288) {
                    this.d.OSD.ChanNameTopLeftY = 288;
                }
                if (this.d.OSD.ChanNameTopLeftX < 0) {
                    this.d.OSD.ChanNameTopLeftX = 0;
                }
                if (this.d.OSD.ChanNameTopLeftX > 352) {
                    this.d.OSD.ChanNameTopLeftX = 352;
                }
                this.$store.dispatch('request', {
                    url: 'goform/frmSingleLineOSD',
                    Type: 1,
                    Data: {
                        OSD: {
                            ChanNameLocation: 0,
                            ChanNameTopLeftX: this.d.OSD.ChanNameTopLeftX,
                            ChanNameTopLeftY: this.d.OSD.ChanNameTopLeftY,
                        },
                    },
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                });
            } else if (type == 'osd') {
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
                        this.d.MultiOSD.TopLeftY -= 10;
                        break;
                    case 1:
                        this.d.MultiOSD.TopLeftY += 10;
                        break;
                    case 2:
                        this.d.MultiOSD.TopLeftX -= 10;
                        break;
                    case 3:
                        this.d.MultiOSD.TopLeftX += 10;
                        break;
                }
                if (this.d.MultiOSD.TopLeftY < 0) {
                    this.d.MultiOSD.TopLeftY = 0;
                }
                if (this.d.MultiOSD.TopLeftY > 288) {
                    this.d.MultiOSD.TopLeftY = 288;
                }
                if (this.d.MultiOSD.TopLeftX < 0) {
                    this.d.MultiOSD.TopLeftX = 0;
                }
                if (this.d.MultiOSD.TopLeftX > 352) {
                    this.d.MultiOSD.TopLeftX = 352;
                }
                this.$store.dispatch('request', {
                    url: 'goform/frmMultiLineOSD',
                    Type: 1,
                    Data: {
                        MultiOSD: {
                            Location: 0,
                            PosX: this.d.MultiOSD.TopLeftX,
                            PosY: this.d.MultiOSD.TopLeftY,
                        },
                    },
                    Dev: this.$store.getters.config.dev,
                    Ch: this.$store.getters.config.ch,
                });
            }
        },

        flash_chan_location(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == -1) return;
                this.d.OSD.ChanNameLocation = curVal;
                if (curVal) {
                    this.$store.dispatch('request', {
                        url: 'goform/frmSingleLineOSD',
                        Type: 1,
                        Data: {
                            OSD: {
                                ChanNameLocation: curVal,
                            },
                        },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    });
                } else {
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmSingleLineOSD',
                            Type: 0,
                            Data: {},
                            Dev: this.$store.getters.config.dev,
                            Ch: this.$store.getters.config.ch,
                        })
                        .then((r) => {
                            if (r.Result == 0) {
                                this.d.OSD.ChanNameTopLeftY = r.Data.OSD.ChanNameTopLeftX;
                                this.d.OSD.ChanNameTopLeftY = r.Data.OSD.ChanNameTopLeftY;
                            }
                        });
                }
            }
        },
        flash_time_location(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == -1) return;
                this.d.OSD.TimeLocation = curVal;
                if (curVal) {
                    this.$store.dispatch('request', {
                        url: 'goform/frmSingleLineOSD',
                        Type: 1,
                        Data: {
                            OSD: { TimeLocation: curVal },
                        },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    });
                } else {
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmSingleLineOSD',
                            Type: 0,
                            Data: {},
                            Dev: this.$store.getters.config.dev,
                            Ch: this.$store.getters.config.ch,
                        })
                        .then((r) => {
                            if (r.Result == 0) {
                                this.d.OSD.OSDTopLeftX = r.Data.OSD.OSDTopLeftX;
                                this.d.OSD.OSDTopLeftY = r.Data.OSD.OSDTopLeftY;
                            }
                        });
                }
            }
        },
        flash_multi_location(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == -1) return;
                this.d.MultiOSD.Location = curVal;
                if (curVal) {
                    this.$store.dispatch('request', {
                        url: 'goform/frmMultiLineOSD',
                        Type: 1,
                        Data: {
                            MultiOSD: {
                                Location: curVal,
                            },
                        },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    });
                } else {
                    this.$store
                        .dispatch('request', {
                            url: 'goform/frmMultiLineOSD',
                            Type: 0,
                            Data: {},
                            Dev: this.$store.getters.config.dev,
                            Ch: this.$store.getters.config.ch,
                        })
                        .then((r) => {
                            if (r.Result == 0) {
                                this.d.MultiOSD.TopLeftX = r.Data.MultiOSD.TopLeftX;
                                this.d.MultiOSD.TopLeftY = r.Data.MultiOSD.TopLeftY;
                            }
                        });
                }
            }
        },
        flash_font_name(curVal, oldVal) {
            if (curVal != oldVal) {
                if (oldVal == '') return;

                this.d.OSD.FontName = curVal;
                this.d.MultiOSD.FontName = curVal;
                Promise.all([
                    this.$store.dispatch('request', {
                        url: 'goform/frmSingleLineOSD',
                        Type: 1,
                        Data: {
                            OSD: {
                                FontName: curVal,
                            },
                        },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    }),
                    this.$store.dispatch('request', {
                        url: 'goform/frmMultiLineOSD',
                        Type: 1,
                        Data: {
                            MultiOSDLattice: {
                                FontName: curVal,
                            },
                        },
                        Dev: this.$store.getters.config.dev,
                        Ch: this.$store.getters.config.ch,
                    }),
                ]);
            }
        },
    },
};
