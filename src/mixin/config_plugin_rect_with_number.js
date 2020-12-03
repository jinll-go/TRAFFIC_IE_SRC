/*
 绘制 带序号text的 矩形
 ROI 12
 隐私遮蔽 3
*/
export default {
    data() {
        return {
            rect_arr: [
                /*
                setpoint 之前 需将rect_arr格式转换如下
                {
                    "x": 0,
                    "y": 0,
                    "width": 0,
                    "height": 0,
                    "enable":0
                }
                */
            ],
            token: 'NOSET', //SHELTERS INTREST_AREA
            canvas_s: {},
        };
    },
    methods: {
        plugin_inited() {
            let info = {};
            if (this.plugin_type == 'ie') {
                info = {};
                if (this.token == 'INTREST_AREA') {
                    info.mode = 12;
                } else if (this.token == 'SHELTERS') {
                    info.mode = 3;
                } else {
                    error('invalid token:', this.token);
                    return;
                }
            } else if (this.plugin_type == 'h5') {
                this.canvas_s = new CVCanvasDraw.Config_Rect($('#plugin').width(), $('#plugin').height(), this.config_plugin.mask_canvas);

                this.canvas_s.bgColor = 'rgba(0,0,0,0)';
                this.canvas_s.Init();
            } else {
                info = {
                    mode: this.token,
                };
                if (this.token != 'INTREST_AREA' && this.token != 'SHELTERS') {
                    error('invalid token:', this.token);
                    return;
                }
            }
            this.$store.dispatch(`${this.plugin_type}_config_plugin_init`, info);
        },

        // 清除当前绘图
        clearall() {
            if (this.config_plugin) {
                this.rect_arr.forEach((item, idx, ar) => {
                    ar[idx] = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                        enable: item.enable,
                    };
                });

                /* if (this.plugin_type == 'flash') {
                    this.config_plugin.SetRectContent(JSON.stringify(ar));
                } else if (this.plugin_type == 'h5') {

                } else {
                    this.config_plugin.ConfigDrawData = ar.concat();
                }*/
                this.setpoint();
            }
        },
        setpoint() {
            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    this.config_plugin.ConfigDrawData = this.rect_arr.concat();
                } else if (this.plugin_type == 'h5') {
                    let tmpArr = this.rect_arr.map((item) => {
                        return {
                            x: item.x,
                            y: item.y,
                            w: item.width,
                            h: item.height,
                            enable: item.enable,
                        };
                    });

                    this.canvas_s.rectArr = tmpArr;
                } else {
                    //flash
                    this.config_plugin.SetRectContent(JSON.stringify(this.rect_arr));
                }
            }
        },
        getpoint() {
            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    //let tmpObj = ;
                    /*let tmpArr = tmpObj.map((item) => {
                        return {
                            X: item.x,
                            Y: item.y,
                            Width: item.width,
                            Height: item.height,
                            Enable: item.enable,
                        };
                    });*/
                    this.rect_arr = this.config_plugin.ConfigDrawData;
                } else if (this.plugin_type == 'h5') {
                    let tpArr = [];
                    this.canvas_s.rectArr.forEach((item, idx) => {
                        tpArr.push({
                            x: item.x,
                            y: item.y,
                            width: item.w,
                            height: item.h,
                            enable: item.enable,
                        });
                    });
                    this.rect_arr = tpArr;
                } else {
                    //flash
                    let obj = JSON.parse(this.config_plugin.GetRectContent());
                    obj = obj.map((item) => {
                        return {
                            x: item[0],
                            y: item[1],
                            width: item[2],
                            height: item[3],
                        };
                    });
                    this.rect_arr = obj;
                }
            }
        },
    },
    computed: {
        config_plugin() {
            return this.$store.getters.config.plugin;
        },
    },
};
