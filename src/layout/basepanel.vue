<template>
    <div class="clearfix">
        <div :class="panelcls">
            <div :class="topcls" v-if="showtitle">
                <div class="fl pl10 bold">
                    <label>{{ titletext }}</label>
                </div>
            </div>
            <div :class="midcls">
                <div class="w100 pt1">
                    <slot />
                </div>
                <div class="w100 pt10 text_center" style="position:relative">
                    <button :class="button_style" v-tr="i18n_save" @click="save()"></button>
                </div>
            </div>
            <div :class="botcls"></div>
        </div>
    </div>
</template>
<script>
    import style from 'mixin/style';
    export default {
        name: 'BasePanel',
        mixins: [style],
        props: {
            showtitle: {
                type: Boolean,
                default: true, //是否显示标题
            },
            titletext: {
                type: String,
                default: '', //面板标题
            },
            extendwidth: {
                type: Boolean,
                default: false, //是否启用 宽面板,默认是普通宽度面板
            },
            oldclass: {
                type: Boolean,
                default: true, //是否启用老的样式
            },
        },
        data() {
            return {};
        },
        computed: {
            panelcls() {
                return this.oldclass ? [this.extendwidth ? 'main_con_k' : 'main_con', 'clearfix'] : '';
            },
            topcls() {
                return this.oldclass ? (this.extendwidth ? 'main_con_top_k' : 'main_con_top') : '';
            },
            midcls() {
                return this.oldclass ? (this.extendwidth ? 'main_con_mid_k' : 'main_con_mid') : '';
            },
            botcls() {
                return this.oldclass ? (this.extendwidth ? 'main_con_bot_k' : 'main_con_bot') : '';
            },
        },
        methods: {
            save() {
                this.$emit('savedata');
            },
        },
    };
</script>
