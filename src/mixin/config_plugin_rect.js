/**
 * 参数设置 插件调用相关
 * 遮挡报警/
 * 火灾检测/
 * 车牌检测
 */
import { arr_to_int } from 'common/util';

export default {
    data() {
        return {
            rect_arr: [], //[0,0,0,0]
            canvas_t: {},
        };
    },

    methods: {
        //插件初始化
        plugin_inited() {
            let info = {};
            if (this.plugin_type == 'ie') {
                info = { mode: 2 };
            } else if (this.plugin_type == 'h5') {
                this.canvas_t = new CVCanvasDraw.Config_Rect($('#plugin').width(), $('#plugin').height(), this.config_plugin.mask_canvas);
                this.canvas_t.bgColor = 'rgba(0,0,0,0)';
                this.canvas_t.Init();
                info = {};
            } else {
                info = { mode: 'HIDEALARM' };
            }
            this.$store.dispatch(`${this.plugin_type}_config_plugin_init`, info);
        },
        //清除当前绘图
        clearall() {
            if (this.config_plugin) {
                this.rect_arr = [0, 0, 0, 0];
                this.setpoint();
            }
        },
        //区域画到视频上
        setpoint() {
            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    this.config_plugin.SetDrawContent(this.rect_arr);
                } else if (this.plugin_type == 'h5') {
                    this.canvas_t.rectArr = [
                        {
                            x: this.rect_arr[0],
                            y: this.rect_arr[1],
                            w: this.rect_arr[2],
                            h: this.rect_arr[3],
                        },
                    ];
                } else {
                    //flash
                    this.config_plugin.SetRectContent(JSON.stringify(this.rect_arr));
                }
            }
        },
        //获取视频上显示的数据
        getpoint() {
            let ar = [];

            if (this.config_plugin) {
                if (this.plugin_type == 'flash') {
                    let counter = this.config_plugin.GetRectContent();
                    ar = arr_to_int(JSON.parse(counter));
                } else if (this.plugin_type == 'ie') {
                    ar = this.config_plugin.GetShelters();
                    msg(ar);
                } else {
                    ar = [this.canvas_t.rectArr[0].x, this.canvas_t.rectArr[0].y, this.canvas_t.rectArr[0].w, this.canvas_t.rectArr[0].h];
                }
                this.rect_arr = ar.concat();
            }
        },
    },
    computed: {
        config_plugin() {
            return this.$store.getters.config.plugin;
        },
    },
};
