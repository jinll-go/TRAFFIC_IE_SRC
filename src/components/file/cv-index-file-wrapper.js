
/*
IE 文件管理 和 h5/flash 文件管理 差异很大.
使用wrapper自适应 如何初始化
*/
export default {
    name: 'CVFrameFile',

    computed: {
        renderTarget() {
            if (this.plugin_type == 'ie') {
                return () => import(/* webpackChunkName: "file" */ 'components/file/cv-index-file-ie');
            } else if (this.plugin_type == 'h5' || this.plugin_type == 'flash') {
                return () => import(/* webpackChunkName: "file" */ 'components/file/cv-index-file-h5');
            }
        },
    },
    render(c) {
        return c(this.renderTarget);
    },
};