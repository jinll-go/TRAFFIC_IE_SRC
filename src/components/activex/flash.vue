<template>
    <div id="altContent">
        <h1>RTMPClient</h1>
        <p style="text-decoration: underline"><a href="http://www.adobe.com/go/getflashplayer" v-tr="i18n_flash_install_tips">Get Adobe Flash player</a></p>
    </div>
</template>

<script>
    import flash from 'mixin/plugins/flash';

    export default {
        name: 'CVPlugin',
        mixins: [flash],
        props: {
            /**
             * 插件模块标识
             * preview 预览
             * playback 回放
             * backup 备份
             * file 文件管理
             * config 参数配置
             * face 人脸识别
             * person 计数统计
             * temperature 测温
             */
            identity: {
                type: String,
                default: '',
            },
        },

        beforeMount() {
            //promise try 需要pollyfill
            //Promise.try(() => {
            this[`${this.plugin_type}_context_init`](this.identity)
                //})
                .then((plugin) => {
                    if (!plugin) {
                        msg('plugin inited failed!');
                        return Promise.resolve(false);
                    } else {
                        return this.run_plugin_logical(plugin);
                    }
                })
                .then((logic_setup_status) => {
                    msg(this.identity, 'logical setup run ', logic_setup_status);
                })
                .catch((err) => {
                    error(this.identity, err);
                });
        },
        beforeDestroy() {
            //插件销毁时 需要关流 ，注销事件监听 等
            this.clean_plugin_stuffs();
        },
        methods: {
            run_plugin_logical(plugin) {
                let fname = `${this.plugin_type}_logicsetup_${this.identity}`;
                msg(fname);
                let fn = this[fname];
                if (!fn) {
                    msg('not impls fn:', fname);
                    return Promise.resolve(false);
                } else {
                    return fn(plugin);
                }
            },
            clean_plugin_stuffs() {
                let fname = `${this.plugin_type}_plugin_cleanup_${this.identity}`;
                msg(fname);
                this[fname]();
            },
        },
    };
</script>
<style scoped>
    .black-back {
        background: black;
    }
</style>
