import CVPluginIE from 'components/activex/ie';
import CVPluginFlash from 'components/activex/flash';
import CVPluginH5 from 'components/activex/h5';
//插件组件 不适用于异步加载, 异步组件使加载初始化的时间延长,造成开流太慢体验不好.
//const CVPluginIE = () => import(/* webpackChunkName: "activex" */ 'components/activex/ie');
//const CVPluginFlash = () => import(/* webpackChunkName: "activex" */ 'components/activex/flash');
//const CVPluginH5 = () => import(/* webpackChunkName: "activex" */ 'components/activex/h5');
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
export default Vue.component('CVPlugin', {
    functional: true,
    render(h, context) {
        let parent = context.parent;
        let pt = parent.plugin_type;
        msg('cvpkugin render', context.props.identity);
        if (pt == 'ie') {
            return h(CVPluginIE, {
                props: context.props,
                on: {
                    playstatechanged: context.listeners.playstatechanged,
                    voicestatechanged: context.listeners.voicestatechanged,
                    speedchanged: context.listeners.speedchanged,
                    streamready: context.listeners.streamready,
                },
            });
        } else if (pt == 'flash') {
            return h(CVPluginFlash, {
                props: context.props,
            });
        } else if (pt == 'h5') {
            return h(CVPluginH5, {
                props: context.props,
                on: {
                    playstatechanged: context.listeners.playstatechanged,
                    voicestatechanged: context.listeners.voicestatechanged,
                    speedchanged: context.listeners.speedchanged,
                    streamready: context.listeners.streamready,
                },
            });
        }
      
    },
});
//</script>
