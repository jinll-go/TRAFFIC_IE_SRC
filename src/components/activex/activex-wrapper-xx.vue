<!--<template>
    <div
        :is="plugincomp"
        :identity="identity"
        :type="type"
        :state="state"
        :showbar="showbar"
        @playstate_changed="playstate_changed"
        @voicestate_changed="voicestate_changed"
        @speed_changed="speed_changed"
    ></div>
</template>
<script>-->
    import CVPluginIE from 'components/activex/ie';
    import CVPluginFlash from 'components/activex/flash';
    import CVPluginH5 from 'components/activex/h5';
    /*
{
 // 和`v-bind:class`一样的 API
 'class': {
  foo: true,
  bar: false
 },
 // 和`v-bind:style`一样的 API
 style: {
  color: 'red',
  fontSize: '14px'
 },
 // 正常的 HTML 特性
 attrs: {
  id: 'foo'
 },
 // 组件 props
 props: {
  myProp: 'bar'
 },
 // DOM 属性
 domProps: {
  innerHTML: 'baz'
 },
 // 事件监听器基于 `on`
 // 所以不再支持如 `v-on:keyup.enter` 修饰器
 // 需要手动匹配 keyCode。
 on: {
  click: this.clickHandler
 },
 // 仅对于组件，用于监听原生事件，而不是组件内部使用
 // `vm.$emit` 触发的事件。
 nativeOn: {
  click: this.nativeClickHandler
 },
 // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
 // 赋值，因为 Vue 已经自动为你进行了同步。
 directives: [
  {
   name: 'my-custom-directive',
   value: '2',
   expression: '1 + 1',
   arg: 'foo',
   modifiers: {
    bar: true
   }
  }
 ],
 // Scoped slots in the form of
 // { name: props => VNode | Array<VNode> }
 scopedSlots: {
  default: props => createElement('span', props.text)
 },
 // 如果组件是其他组件的子组件，需为插槽指定名称
 slot: 'name-of-slot',
 // 其他特殊顶层属性
 key: 'myKey',
 ref: 'myRef'
}
*/
    import Vue from 'vue';
    export default {
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
            type: {
                type: String,
                default: '',
            },
            state: {
                type: Number,
                default: 0,
            },
            /**
             * 回放有效,是否显示检索条
             */
            showbar: {
                type: Number,
                default: 1,
            },
        },
        methods: {
            playstate_changed(v) {
                this.$emit('playstate_changed', v);
            },
            voicestate_changed(v) {
                this.$emit('voicestate_changed', v);
            },
            speed_changed(v) {
                this.$emit('speed_changed', v);
            },
        },
        computed: {
            plugincomp() {
                if (this.plugin_type == 'ie') {
                    return 'CVPluginIE';
                } else if (this.plugin_type == 'flash') {
                    return 'CVPluginFlash';
                } else if (this.plugin_type == 'h5') {
                    return 'CVPluginH5';
                }
            },
        },
        components: {
            CVPluginIE,
            CVPluginFlash,
            CVPluginH5,
        },
    };
<!--</script>-->
