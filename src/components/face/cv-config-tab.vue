<template>
    <div class="tab-wrapper">
        <ul class="tab-menu" v-show="!popup.isNeedModify">
            <li :class="currentView == tab.view ? 'active' : ''" @click="toggle(tab.view, index)" v-for="(tab, index) in tabs">
                <a style="display:block;height:20px;border-right:1px solid gray;padding-right:5px" v-tr="tab.text"></a>
            </li>
        </ul>
        <label class="tab" v-show="popup.isNeedModify" v-tr="i18n_modify"></label>

        <div class="tab-content">
            <component :is="currentView"></component>
        </div>
    </div>
</template>

<script>
    import CVConfigFaceSingleImport from 'components/face/cv-config-face-single-import';
    import CVConfigFaceBatchImport from 'components/face/cv-config-face-batch-import';

    import style from 'mixin/style';

    export default {
        name: 'CVConfigTab',
        mixins: [style],
        inject: ['popup'],
        data() {
            return {
                currentView: 'CVConfigFaceSingleImport',
                tabs: [
                    { view: 'CVConfigFaceSingleImport', text: 'i18n_faceImport_signle' },
                    { view: 'CVConfigFaceBatchImport', text: 'i18n_faceImport_multi' },
                ],
            };
        },
        mounted() {
            if (!window.btoa) window.btoa = $.base64.btoa;
            if (!window.atob) window.atob = $.base64.atob;
        },
        methods: {
            toggle(view, index) {
                if (this.popup.isBatchImporting) return;
                this.currentView = view;
            },
        },
        components: {
            CVConfigFaceSingleImport,
            CVConfigFaceBatchImport,
        },
    };
</script>
<style scoped>
    .tab-wrapper {
        margin: 0px auto;
        width: 90%;
        max-width: 800px;
    }

    .tab-menu li {
        position: relative;
        /*background-color: #757575;*/
        color: #bcbcbc;
        display: inline-block;
        padding: 10px 10px;
        opacity: 0.8;
        cursor: pointer;
        z-index: 0;
    }

    .tab-menu li.active {
        /*background-color:#167998;*/
        opacity: 1;

        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .tab-menu li.active:hover {
    }

    .tab-content {
        width: 100%;
        min-height: 500px;
    }

    .line {
        position: absolute;
        width: 0;
        height: 7px;
        background-color: aqua;
        top: 0;
        left: 0;
    }
</style>
