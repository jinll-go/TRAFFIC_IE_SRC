<template>
    <div>
        <AutoSizeLayout top_height="0" left_width="158" right_width="0">
            <template v-slot:leftpanel>
                <div class="main bkcolor ui-tabs ui-widget ui-widget-content ui-corner-all" style="height:100%">
                    <div class="tab-tit left" style="height:100%">
                        <div
                            v-for="item of tabs"
                            :class="{
                                cur: $store.getters.temperature.initTempquery ? item.pagename == 'CVConfigTempFaceDBWrapper' : item.pagename == current_page,
                            }"
                            @click="btn_click(item.pagename)"
                            v-show="item.visible"
                        >
                            <label>{{ item.transname }}</label>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:centerpanel>
                <div :style="{ 'background-color': bk_style, height: '100%', width: '100%', margin: '0 auto', padding: 0, overflow: 'auto' }">
                    <div :ref="current_page" :is="current_page" :key="compkey"></div>
                </div>
            </template>
        </AutoSizeLayout>

        <facedialog :dialogmode="popup.dialogmode" v-if="popup.visible" :extradata="popup.extradata"></facedialog>
    </div>
</template>
<script>
    import Vue from 'vue';
    // import tempdialog from 'components/temperature/cv-index-dialog-temperature';
    import AutoSizeLayout from '../../layout/fixedtop-3column-layout';
    import CVIndexTemperatureView from 'components/temperature/cv-index-temperature-view';
    import CVConfigTemperatureRecord from 'components/temperature/cv-config-temperature-record';
    import CVConfigTemperatureCfg from 'components/temperature/cv-config-temperatureCfg';
    import facemodel from 'components/face/cv-index-facemodel';
    import CVConfigAdvancedSet from 'components/face/cv-config-advancedset';
    import facedialog from 'components/face/cv-index-dialog-face';
    import CVConfigTempFaceDBWrapper from 'components/face/cv-index-facedatabase-wrapper';

    import style from 'mixin/style';
    export default {
        name: 'CVIndexTemperature',
        mixins: [style],
        data() {
            let lang = this.$store.getters.current_language;
            let ui_custom = this.$UI[this.$options.name];
            return {
                current_page: 'CVIndexTemperatureView',
                tabs: [
                    {
                        pagename: 'CVIndexTemperatureView',
                        transname: lang.i18n_temperatureview,
                        visible: ui_custom.CVIndexTemperatureView.visible,
                    },

                    {
                        pagename: 'CVConfigTempFaceDBWrapper',
                        transname: lang.i18n_FaceDatabase,
                        visible: ui_custom.CVConfigFaceDB.visible,
                    },
                    {
                        pagename: 'facemodel',
                        transname: lang.i18n_FaceModel,
                        visible: ui_custom.CVTempFaceQuery.visible,
                    },
                    {
                        pagename: 'CVConfigTemperatureRecord',
                        transname: lang.i18n_FaceComparison,
                        visible: ui_custom.CVConfigTemperatureRecord.visible,
                    },
                    {
                        pagename: 'CVConfigTemperatureCfg',
                        transname: lang.i18n_temperatureconfig,
                        visible: ui_custom.CVConfigTemperatureCfg.visible,
                    },
                    {
                        pagename: 'CVConfigAdvancedSet',
                        transname: lang.i18n_AdvancedCfg,
                        visible: ui_custom.CVConfigAdvancedSet.visible,
                    },
                ],
                tabClass: '',
                popup: {
                    dialogmode: '',
                    visible: false,
                    extradata: null,
                    isExport: false,
                    ExportPath: '',
                    ExportMsg: '',
                    refreshAddGroupList: false, //刷新人脸组
                    isTemperature: true, //记录查询中点详情，区分人脸和测温
                    refreshQueryList: false, //是否刷新人脸库查询列表,
                    isBatchImporting: false,
                    isNeedModify: false,
                },
                compkey: '',
            };
        },
        provide() {
            //向所有 子孙组件注入
            return {
                popup: this.popup,
            };
        },

        methods: {
            btn_click(component_name) {
                if (component_name == this.current_page) {
                    if (component_name == 'CVIndexTemperatureView') return;
                    this.compkey = `${new Date().getTime()}-${Math.random() * 1000}`;
                } else {
                    this.current_page = component_name;
                }
            },
        },
        computed: {
            height() {
                return this.$parent.height ? this.$parent.height : this.$store.getters.content_rect.height + 'px';
            },
            activated() {
                return this.$store.getters.temperature.activated;
            },
            bk_style() {
                if (this.$store.getters.is_honeynew) {
                    return '#fff';
                } else if (this.$store.getters.is_sanbao) {
                    return '#18202F';
                } else {
                    return '#262626';
                }
            },
        },
        watch: {
            activated(newVal, oldVal) {
                //获取当前生效的左边栏tab项
                let vm = this.$refs[this.current_page];
                //只处理测温配置(含有子tabs)
                if (vm && vm.$options._componentTag == 'CVConfigTemperatureCfg') {
                    let item = vm.$children[0].$children[0];
                    // msg('vm', item, item.$options._componentTag);
                    if (item.repos_plugin && item.hide_plugin) {
                        newVal ? item.repos_plugin() : item.hide_plugin();
                    }
                    if (newVal && item.load) {
                        item.load(); //restore plugin draw data
                    }
                } else if (vm && vm.$options._componentTag == 'CVIndexTemperatureView') {
                    //tab显示隐藏时开关流
                    this.$store.dispatch(`${this.plugin_type}_init_temperature_stream`, { stream: newVal ? 'open' : 'close' });
                }
            },
        },
        components: {
            AutoSizeLayout,
            CVIndexTemperatureView,
            CVConfigTemperatureRecord,
            CVConfigTemperatureCfg,

            facemodel,

            facedialog,
            CVConfigTempFaceDBWrapper,
            CVConfigAdvancedSet,
        },
    };
</script>
