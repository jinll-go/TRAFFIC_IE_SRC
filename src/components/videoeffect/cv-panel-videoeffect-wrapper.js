/*
预览 亮度对比度饱和度色度 面板 包装对象
*/
export default {
    name: 'CVVideoEffect',
    computed: {
        renderTarget() {
            if (this.plugin_type == 'ie') {
                return () => import(/* webpackChunkName: "videoeffect" */ 'components/videoeffect/cv-panel-videoeffect-ie');
            } else {
                return () => import(/* webpackChunkName: "videoeffect" */ 'components/videoeffect/cv-panel-videoeffect-h5');
            }
        },
    },
    render(c) {
        return c(this.renderTarget);
    },
};
