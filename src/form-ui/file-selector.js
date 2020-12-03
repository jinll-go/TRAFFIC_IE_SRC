/*<template>
    <div v-if="plugin_type == 'h5'">
        <input type="file" :id="identity" style="display: none" @change="h5_choose_file" :accept="accept" />
        <label :class="button_style" style="display:inline-block; min-width:100px;height:24px; margin:0;" :for="identity">{{ text }}</label>
    </div>
    <div v-else>
        <button @click="ie_choose_file" :class="button_style" style="min-width:100px;">
            {{ text }}
        </button>
    </div>
</template>
<script>*/
import style from 'mixin/style';
export default {
    name: 'CVFileSelector',
    mixin: [style],
    props: {
        identity: {
            type: String,
            required: true, //不重复的id
        },
        text: {
            type: String,
            required: true, //按钮 文本
        },
        accept: {
            type: String,
            default: '*/*', //所有文件,不过滤
        },
    },
    methods: {
        ie_choose_file() {
            let plugin = this.$store.getters.config_plugin;

            if (plugin) {
                let path = plugin.OpenFileDialog({ OpenMode: 1 });
                msg('choose file:' + path);
                this.$emit('change', { path });
            }
        },
        h5_choose_file(e) {
            this.$emit('change', e.target);
        },
    },
    render(h) {
        if (this.plugin_type == 'h5') {
            return h('div', {}, [
                h('input', {
                    attrs: {
                        type: 'file',
                        id: this.identity,
                        accept: this.accept,
                    },
                    style: {
                        display: 'none',
                    },
                }),

                h(
                    'label',
                    {
                        class: [this.button_style],
                        style: {
                            display: 'inline-block',
                            'min-width': '100px',
                            height: '24px',
                            margin: '0',
                        },
                        attrs: {
                            for: this.identity,
                        },
                    },
                    [this.text]
                ),
            ]);
        } else if (this.plugin_type == 'ie') {
            return h(
                'button',
                {
                    class: [this.button_style],
                    style: {
                        'min-width': '100px',
                    },
                    on: {
                        click: this.ie_choose_file,
                    },
                },
                [this.text]
            );
        }
    },
};
