/**
 * 参数设置 插件调用相关 检测1个/屏蔽区域4个
 *
 * 人脸检测(抓拍)
 * 安全帽检测
 * 人行检测
 *
 */

export default {
    data() {
        return {
            AreaType: 0,
            Regions: [
                {
                    X: 0,
                    Y: 0,
                    W: 1,
                    H: 1,
                },
            ],
            canvas_s: {},
        };
    },
    methods: {
        //插件初始化
        plugin_inited() {
            let info = {};
            if (this.plugin_type == 'ie') {
                info = {
                    mode: 10,
                };
            } else if (this.plugin_type == 'h5') {
                this.canvas_s = new CVCanvasDraw.Config_Rect_Face($('#plugin').width(), $('#plugin').height(), this.config_plugin.mask_canvas);
                this.canvas_s.bgColor = 'rgba(0,0,0,0)';
                this.canvas_s.Init();
                this.canvas_s.isDecimal = true;
                info = {};
            } else {
                info = {
                    mode: 'OSD',
                };
            }
            this.$store.dispatch(`${this.plugin_type}_config_plugin_init`, info);
        },
        //清除当前绘图
        clearall() {
            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    this.config_plugin.ClearAllDraw();
                    this.AreaType = 0;
                } else if (this.plugin_type == 'h5') {
                    //defineObjectProperty
                    //更改数组的一部分 无法触发 更新函数
                    //改为整体替换
                    let copyvec = this.canvas_s.all_rects.concat();
                    if (this.area_type == 0) {
                        copyvec[this.AreaType] = [
                            {
                                x: 0,
                                y: 0,
                                w: 0,
                                h: 0,
                            },
                        ];
                    } else {
                        copyvec[this.area_type] = [
                            {
                                x: 0,
                                y: 0,
                                w: 0,
                                h: 0,
                            },
                            {
                                x: 0,
                                y: 0,
                                w: 0,
                                h: 0,
                            },
                            {
                                x: 0,
                                y: 0,
                                w: 0,
                                h: 0,
                            },
                            {
                                x: 0,
                                y: 0,
                                w: 0,
                                h: 0,
                            },
                        ];
                    }

                    this.canvas_s.all_rects = copyvec;
                }
            }
        },
        //区域画到视频上
        setpoint() {
            let SmartAreaInfo = [];

            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    SmartAreaInfo = this.Regions.concat();
                    SmartAreaInfo.unshift(this.AreaType);
                    this.config_plugin.SetDrawContent(SmartAreaInfo);
                } else if (this.plugin_type == 'h5') {
                    let arr0 = [];
                    let arr1 = [];
                    this.Regions.forEach((item, index) => {
                        if (index) {
                            arr1.push({
                                x: item.X,
                                y: item.Y,
                                w: item.W,
                                h: item.H,
                            });
                        } else {
                            arr0.push({
                                x: item.X,
                                y: item.Y,
                                w: item.W,
                                h: item.H,
                            });
                        }
                    });

                    this.canvas_s.type = this.AreaType;
                    this.canvas_s.all_rects = [arr0, arr1];
                } else {
                    //flash
                }
            }
        },
        //获取视频上显示的数据
        getpoint() {
            let ar = [];

            if (this.config_plugin) {
                if (this.plugin_type == 'flash') {
                } else if (this.plugin_type == 'ie') {
                    ar = this.config_plugin.GetShelters();
                } else {
                    ar = this.canvas_s.all_rects[0].concat(this.canvas_s.all_rects[1]).map((item) => {
                        return {
                            X: item.x,
                            Y: item.y,
                            W: item.w,
                            H: item.h,
                        };
                    });
                }

                this.Regions = ar;
            }
        },
    },
    computed: {
        config_plugin() {
            return this.$store.getters.config.plugin;
        },
    },
};
