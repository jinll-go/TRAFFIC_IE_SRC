<!--<template>
    <div :class="container_cls">
        <!-- 单窗口 预览 回放
        <div class="full" :id="identity"></div>-->

<!--测温 水平左右 均分
        <div style="float:left;width:50%;height:100%" :id="identity + '_dev0'"></div>
        <div style="float:left;width:50%;height:100%" :id="identity + '_dev1'"></div>-->

<!-- 鱼眼  不规则布局-->

<!--<table class="black-back" style="table-layout:fixed" width="100%" height="100%" cellspacing="0" cellpadding="0" border="1">
            <tr v-for="rowdata of wnd_sequence">
                <td v-for="item of rowdata" :id="item.id" :rowspan="item.rowspan" :colspan="item.colspan"></td>
            </tr>
        </table>

        <div v-for="(item, idx) of wnd_sequence" :class="item.classlist" :id="item.id" v-on:dblclick="doSequences(item, idx)"></div>
    </div>
</template>-->

<script>
    import Vue from 'vue';
    import h5 from 'mixin/plugins/h5';

    export default {
        name: 'CVPlugin',
        mixins: [h5],
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
        data() {
            return {
                container_cls: [],
                wnd_sequence: [],
                wndmode: 0, //0 --grid  1--- full
            };
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
        created() {
            if (this.identity == 'playback') {
                this.container_cls.push('grid1x1-pb-container');
                this.wnd_sequence = this.pb_sequence.concat();
            } else if (this.identity == 'person') {
                this.container_cls.push('grid1x1-person-container');
                this.wnd_sequence = this.pb_sequence.concat();
            } else if (this.is_fisheye) {
                this.container_cls.push('grid3x3-container');
                this.wnd_sequence = this.fisheye_sequence.concat();
                this.wndmode = 0;
            } else if (this.is_temperature_double_wnd) {
                this.container_cls.push('grid1x2-container');
                this.wnd_sequence = this.temperature_sequence.concat();
            } else {
                this.container_cls.push('grid1x1-container');
                this.wnd_sequence = this.normal_sequence.concat();
            }
        },
        beforeDestroy() {
            //插件销毁时 需要关流 ，注销事件监听 等
            this.clean_plugin_stuffs();
        },
        methods: {
            doSequences(item, idx) {
                //    msg('dbclick', idx, item.classlist);
                if (!this.is_fisheye) return;

                if (this.$el.childNodes[idx].childNodes.length == 0) {
                    warn('ignore this doSequences! idx = ', idx);
                    return;
                }

                if (this.wndmode == 0) {
                    this.container_cls = ['grid1x1-container'];
                    //trans to full
                    this.wnd_sequence.forEach((el) => {
                        Vue.set(el, 'classlist', ['hide']);
                    });
                    Vue.set(this.wnd_sequence[idx], 'classlist', ['full']);
                    this.wndmode = 1;
                } else if (this.wndmode == 1) {
                    this.container_cls = ['grid3x3-container'];
                    this.wnd_sequence.forEach((el, idx) => {
                        Vue.set(el, 'classlist', ['p' + (idx + 1)]);
                    });
                    this.wndmode = 0;
                }
            },
            run_plugin_logical(plugin) {
                let fname = `${this.plugin_type}_logicsetup_${this.identity}`;

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

                this[fname]();
            },
        },
        computed: {
            is_temperature_double_wnd() {
                return this.$UI.CVTopMenu.tab_temperature.visible && (this.identity == 'preview' || this.identity == 'temperature');
            },
            is_fisheye() {
                return this.$store.getters.is_fisheye && this.identity == 'preview';
            },
            normal_sequence() {
                return [
                    {
                        id: `${this.identity}`,
                        classlist: ['p1'],
                    },
                ];
            },
            temperature_sequence() {
                return [
                    {
                        id: `${this.identity}_dev0`,
                        classlist: ['p1'],
                    },

                    {
                        id: `${this.identity}_dev1`,
                        classlist: ['p2'],
                    },
                ];
            },
            pb_sequence() {
                return this.identity == 'playback'
                    ? [
                          {
                              id: `${this.identity}`,
                              classlist: ['p1'],
                          },

                          {
                              id: `searchbar`,
                              classlist: ['p2'],
                          },
                      ]
                    : [
                          {
                              id: `${this.identity}`,
                              classlist: ['p1'],
                          },
                      ];
            },

            fisheye_sequence() {
                return [
                    {
                        id: `${this.identity}_ch0`,
                        classlist: ['p1'],
                    },

                    {
                        id: `${this.identity}_ch1`,
                        classlist: ['p2'],
                    },

                    {
                        id: `${this.identity}_ch2`,
                        classlist: ['p3'],
                    },

                    {
                        id: `${this.identity}_ch3`,
                        classlist: ['p4'],
                    },
                    {
                        id: `${this.identity}_ch4`,
                        classlist: ['p5'],
                    },
                    {
                        id: `${this.identity}_ch5`,
                        classlist: ['p6'],
                    },
                ];
            },
        },
        render(h) {
            //<div v-for="(item, idx) of wnd_sequence" :class="item.classlist" :id="item.id" v-on:dblclick="doSequences(item, idx)"></div>
            //回放单独处理
            if (this.identity == 'playback') {
                return h('div', { class: this.container_cls }, [
                    h('div', {
                        class: this.wnd_sequence[0].classlist,
                        style: {
                            height: this.$store.getters.content_rect.height - 76 - 80 - 40 + 'px',
                        },
                        attrs: {
                            id: this.wnd_sequence[0].id,
                        },
                    }),
                    h('canvas', {
                        class: [...this.wnd_sequence[1].classlist, 'w100'],
                        style: {
                            height: '80px',
                        },
                        attrs: {
                            id: this.wnd_sequence[1].id,
                        },
                    }),
                ]);
            } else {
                /**
                    鱼眼预览
                    测温预览  比对
                    普通预览  比对
                 */
                return h(
                    'div',
                    { class: this.container_cls },
                    this.wnd_sequence.map((item, idx) => {
                        return h('div', {
                            class: item.classlist,
                            attrs: {
                                id: item.id,
                            },
                            on: {
                                dblclick: () => {
                                    this.doSequences(item, idx);
                                },
                            },
                        });
                    }),
                );
            }
        },
    };
</script>
<style scoped>
    .grid3x3-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 1px 1px;
        grid-template-areas:
            'a a b'
            'a a c'
            'd e f';
        background-color: gray;
    }
    .grid3x3-container .p1 {
        grid-area: a;
        background-color: black;
    }
    .grid3x3-container .p2 {
        grid-area: b;
        background-color: black;
    }
    .grid3x3-container .p3 {
        grid-area: c;
        background-color: black;
    }
    .grid3x3-container .p4 {
        grid-area: d;
        background-color: black;
    }
    .grid3x3-container .p5 {
        grid-area: e;
        background-color: black;
    }
    .grid3x3-container .p6 {
        grid-area: f;
        background-color: black;
    }

    .grid1x2-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        grid-gap: 1px 1px;
        grid-template-areas: 'a b';

        background-color: gray;
    }
    /*测温,水平均分*/
    .grid1x2-container .p1 {
        grid-area: a;
        background-color: black;
    }
    .grid1x2-container .p2 {
        grid-area: b;
        background-color: black;
    }
    /*单路 预览 */
    .grid1x1-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-gap: 1px 1px;
        grid-template-areas: 'a ';
        background-color: gray;
    }
    .grid1x1-container .p1 {
        grid-area: a;
        background-color: black;
    }

    /*单路 回放 底部固定 其余自适应 */
    .grid1x1-pb-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 80px;
        grid-gap: 1px 1px;
        grid-template-areas:
            'a'
            'b';
        background-color: gray;
    }
    .grid1x1-pb-container .p1 {
        grid-area: a;
        background-color: black;
    }
    .grid1x1-pb-container .p2 {
        grid-area: b;
        background-color: black;
    }
    /**计数统计  没有searchbar的回放 */
    .grid1x1-person-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        grid-gap: 1px 1px;
        grid-template-areas: 'a';
        background-color: gray;
    }
    .grid1x1-person-container .p1 {
        grid-area: a;
        background-color: black;
    }

    .hide {
        display: none;
    }
</style>
