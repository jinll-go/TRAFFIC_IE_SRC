/**
 * 参数设置 插件调用相关 (不规则区域)
 * 离岗检测
 * 区域监测(电子围栏)
 * 目标计数
 * 密度检测
 * 物品检测
 * 逆行检测
 * 虚拟警戒线
 */
import { arr_to_int } from 'common/util';

export default {
    data() {
        return {
            mode_list: {
                //  '0': 'OSD',
                //   '1': 'MOTION',
                //      '2': 'HIDEALARM',
                //      '3': 'SHELTERS',
                '4': 'COUNTER',
                '5': 'OBJECT',
                '6': 'AREA',
                '7': 'WIRE',
                '14': 'WIRE',
            },
            DetectNo: -1,
            PointPara: [{
                Scale: 0,
                CounterPoint: [
                    [0, 20]
                ],
            }, ],
            canvas_s: {},
        };
    },
    methods: {
        //插件初始化
        plugin_inited({ mode }) {
            let info = {};
            if (this.plugin_type == 'ie') {
                info = {
                    mode,
                };
                if (!!this.$Param.EnableSmartDomePages) {
                    if (this.config_plugin.SetConfigParams) {
                        this.config_plugin.SetConfigParams({ enable_drawActiveOnly: 1 });
                    } else {
                        error('插件不支持SetConfigParams (enable_drawActiveOnly)');
                    }
                }
            } else if (this.plugin_type == 'h5') {
                if (mode == 4 || mode == 7) {
                    this.canvas_s = new CVCanvasDraw.Config_Line_Counter(
                        $('#plugin').width(),
                        $('#plugin').height(),
                        this.config_plugin.mask_canvas,
                        mode == 4
                    );
                } else if (mode == 14) {
                    this.canvas_s = new CVCanvasDraw.Config_Line_Retrograde($('#plugin').width(), $('#plugin').height(), this.config_plugin.mask_canvas);
                } else {
                    this.canvas_s = new CVCanvasDraw.Config_Line_Area($('#plugin').width(), $('#plugin').height(), this.config_plugin.mask_canvas);
                }
                this.canvas_s.bgColor = 'rgba(0,0,0,0)';
                this.canvas_s.defaultConfig.showActiveOnly = !!this.$Param.EnableSmartDomePages;
                this.canvas_s.Init();
                info = {};
            } else {
                info = {
                    mode: this.mode_list[mode],
                };
            }
            this.$store.dispatch(`${this.plugin_type}_config_plugin_init`, info);
        },
        //开始画图
        startpaint() {
            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    this.config_plugin.StartDrawLine();
                } else if (this.plugin_type == 'h5') {
                    this.canvas_s.isStartPaint = true;
                }
            }
        },
        //清除当前线
        clearall() {
            if (this.config_plugin) {
                if (this.plugin_type == 'ie') {
                    this.config_plugin.ClearAllDraw();
                } else if (this.plugin_type == 'h5') {
                    this.canvas_s.clearCurrentLine(); //暂未实现清除功能
                    this.canvas_s.clearCurrentLine();
                } else {
                    this.config_plugin.ClearRectContent();
                }
            }
        },
        //点画到视频上
        setpoint() {
            let SmartLinePoint = []; //记录智能规则点

            this.PointPara.forEach((item) => {
                SmartLinePoint.push(item.CounterPoint);
            });

            if (this.config_plugin && this.idx_isvalid) {
                if (this.plugin_type == 'ie') {
                    SmartLinePoint.unshift(this.DetectNo);
                    this.config_plugin.SetDrawContent(SmartLinePoint);
                    this.config_plugin.SetSmartScale(this.PointPara[this.DetectNo].Scale);
                } else if (this.plugin_type == 'h5') {
                    this.canvas_s.all_lines = this.PointPara.map((item) => {
                        return {
                            CounterPoint: item.CounterPoint,
                            Scale: item.Scale,
                        };
                    });
                    this.canvas_s.active_idx = this.DetectNo;
                } else {
                    //flash
                    this.config_plugin.SetSmartConter(JSON.stringify(SmartLinePoint), this.DetectNo);
                    this.config_plugin.SetSmartScale(this.PointPara[this.DetectNo].Scale);
                }
            }
        },
        //获取视频上显示的点的坐标并commit到state
        getpoint() {
            let ar = [];

            if (this.config_plugin && this.idx_isvalid) {
                if (this.plugin_type == 'flash') {
                    let counter = this.config_plugin.GetRectContent();
                    ar = arr_to_int(JSON.parse(counter));
                } else if (this.plugin_type == 'ie') {
                    ar = this.config_plugin.GetShelters();
                } else {
                    ar = this.canvas_s.all_lines[this.DetectNo].CounterPoint;
                }

                this.PointPara[this.DetectNo].CounterPoint = ar;
            }
        },
        swapAB() {
            if (this.config_plugin) {
                if (this.plugin_type == 'h5') {
                    this.canvas_s.SwapAB();
                } else {
                    this.config_plugin.SwapLabelAB();
                }
            }
        },
        //Scale画到视频上
        setscale() {

            if (this.config_plugin && this.idx_isvalid) {
                let scale = this.PointPara[this.DetectNo].Scale;
                if (this.plugin_type == 'h5') {
                    this.canvas_s.all_lines[this.DetectNo].Scale = scale;
                    this.canvas_s.DrawEverything(); //暂未实现实时看效果
                } else {
                    this.config_plugin.SetSmartScale(scale);
                }
            }
        },
    },
    computed: {
        config_plugin() {
            return this.$store.getters.config.plugin;
        },
        idx_isvalid() {
            return this.DetectNo >= 0 && this.DetectNo < 4
        }
    },
};
