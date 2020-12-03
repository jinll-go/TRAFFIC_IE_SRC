/**
 * 参数设置 插件调用相关
 * 移动侦测
 * 智能移动侦测
 */

export default {
    data() {
        return {
            MinSize: 0,
            MotionScope: [
                //18*22
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            canvas_t: {},
        };
    },

    methods: {
        //插件初始化
        plugin_inited() {
            let info = {};
            if (this.plugin_type == 'ie') {
                info = { mode: 1 };
            } else if (this.plugin_type == 'h5') {
                this.canvas_t = new CVCanvasDraw.Config_Motion($('#plugin').width(), $('#plugin').height(), this.config_plugin.mask_canvas);
                this.canvas_t.bgColor = 'rgba(0,0,0,0)';
                this.canvas_t.Init();
                info = {};
            } else {
                info = {
                    mode: 'MOTION',
                    Stream: 1,
                };
            }
            this.$store.dispatch(`${this.plugin_type}_config_plugin_init`, info);
        },
        //清除当前绘图
        clearall() {
            if (this.config_plugin) {
                let motion_ar = [];
                for (let i = 0; i < 18; i++) {
                    motion_ar[i] = new Array(22).fill(0);
                }
                this.MotionScope = motion_ar;
                this.setpoint();
            }
        },
        //区域画到视频上
        setpoint() {
            // plugin.MinorMode = -1;
            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    this.config_plugin.ConfigDrawData = {
                        scope: this.MotionScope,
                        normalsize: this.MinSize,
                    };
                } else if (this.plugin_type == 'h5') {
                    this.canvas_t.motionScope = this.MotionScope;
                    this.canvas_t.scale = this.MinSize;
                } else {
                    //flash
                    this.config_plugin.SetRectContent(JSON.stringify(this.MotionScope));
                    this.config_plugin.SetDrawDashedRect(JSON.stringify({ numerator: this.MinSize, denominator: 10000 }));
                }
            }
        },
        //获取视频上显示的数据
        getpoint() {
            let ar = [];

            if (this.config_plugin) {
                if (this.plugin_type == 'flash') {
                    ar = JSON.parse(this.config_plugin.GetRectContent());
                } else if (this.plugin_type == 'ie') {
                    ar = this.config_plugin.ConfigDrawData;
                } else {
                    ar = this.canvas_t.motionScope;
                }

                this.MotionScope = ar;
            }
        },
        //Scale画到视频上
        setscale() {
            let ms = parseInt(this.MinSize, 10);
            if (this.config_plugin) {
                if (this.plugin_type == 'h5') {
                    this.canvas_t.scale = ms;
                } else if (this.plugin_type == 'ie') {
                    this.config_plugin.ConfigDrawData = {
                        normalsize: ms,
                    };
                } else {
                    this.config_plugin.SetDrawDashedRect(JSON.stringify({ numerator: ms, denominator: 10000 }));
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
