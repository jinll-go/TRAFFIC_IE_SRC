/**
 * 参数设置 插件调用相关,only video
 * 机芯设置(视频参数)
 * 场景变换
 * 视频诊断
 * 编码参数
 * 显示设置
 */
export default {
    methods: {
        //插件初始化
        plugin_inited({ dev, ch, reopen }) {
            let info = {};
            if (this.plugin_type == 'ie') {
                info = { mode: 0, dev, ch, reopen };
            } else if (this.plugin_type == 'h5') {
                info = { mode: 0, dev, ch, reopen };
                this.canvas_t = new CVCanvasDraw.Canvas($('#plugin').width(), $('#plugin').height(), this.config_plugin.mask_canvas);
                this.canvas_t.bgColor = 'rgba(0,0,0,0)';
                this.canvas_t.Init();
            } else {
                info = { mode: 'OSD' };
            }
            this.$store.dispatch(`${this.plugin_type}_config_plugin_init`, info);
        },
    },
    computed: {
        config_plugin() {
            return this.$store.getters.config.plugin;
        },
    },
};
