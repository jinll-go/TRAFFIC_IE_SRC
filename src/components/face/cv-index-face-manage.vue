<template>
    <div>
        <AutoSizeLayout top_height="0" left_width="158" right_width="0">
            <template v-slot:leftpanel>
                <div
                        class="main bkcolor ui-tabs ui-widget ui-widget-content ui-corner-all"
                        :style="{ height: '100%', 'margin-left': $store.getters.is_sanbao ? '155px' : '' }"
                >
                    <div class="tab-tit left" style="height:100%">
                        <div :class="{ cur: current_page == 'facedatabasewrapper' }" @click="btn_click('facedatabasewrapper')">
                            <label v-tr="i18n_FaceDatabase"></label>
                        </div>
                        <div :class="{ cur: current_page == 'facemodel' }" @click="btn_click('facemodel')">
                            <label v-tr="i18n_FaceModel"></label>
                        </div>
                        <div :class="{ cur: current_page == 'facebackup' }" @click="btn_click('facebackup')">
                            <label v-tr="i18n_faceBackup"></label>
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
    import AutoSizeLayout from '../../layout/fixedtop-3column-layout';
    import facedatabasewrapper from 'components/face/cv-index-facedatabase-wrapper';
    import facedialog from 'components/face/cv-index-dialog-face';
    import facemodel from 'components/face/cv-index-facemodel';
    import style from 'mixin/style';
    import facebackup from 'components/face/cv-config-facebackup';

    export default {
        name: 'CVIndexFaceManage',
        mixins: [style],
        data() {
            return {
                current_page: 'facedatabasewrapper',
                flag: true,
                compkey: '',
                popup: {
                    dialogmode: '',
                    visible: false,
                    extradata: null,
                    isExport: false,
                    ExportPath: '',
                    ExportMsg: '',
                    refreshAddGroupList: false, //刷新人脸组
                    refreshQueryList: false, //是否刷新人脸库查询列表,
                    isBatchImporting: false,
                    isNeedModify: false, //是否 修改人脸模板图
                },
            };
        },
        provide() {
            //向所有 子孙组件注入
            return {
                popup: this.popup,
            };
        },
        mounted() {
            //    this.$store.commit('face/isShowDialog', false);

        },
        methods: {
            btn_click(component_name) {
                this.$loading.show = false;

                //    this.$store.commit('face/Facedb_to_model', false);
                if (component_name == this.current_page) {
                    //reload
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
            /* isShowDialog() {
                return this.$store.getters.Face.isShowDialog;
            },
            FaceIndex() {
                return this.$store.getters.Face.FaceIndex;
            },*/
            activated() {
                return this.$store.getters.face_activated;
            },
            bk_style() {
                msg(['ssss', this.$store.getters.is_honeynew]);
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
                // msg(['face activated:',newVal,this.current_page])
                if (newVal) {
                    if (this.current_page == 'CVConfigIdentification') {
                        this.btn_click('CVConfigIdentification');
                    }
                    if (this.current_page == 'CVConfigEigenvalueTab') {
                        this.btn_click('CVConfigEigenvalueTab');
                    }
                }
                msg('face', this.$refs[this.current_page]);
                let vm = this.$refs[this.current_page];
                //只处理识别配置
                if (vm && vm.$options._componentTag == 'CVConfigIdentification') {
                    let item = vm.$children[0].$children[0];
                    msg('vm', item, item.$options._componentTag);
                    if (item.repos_plugin && item.hide_plugin) {
                        newVal ? item.repos_plugin() : item.hide_plugin();
                    }
                    if (newVal && item.load) {
                        item.load(); //restore plugin draw data
                    }
                }
            },
        },
        components: {
            AutoSizeLayout,
            facedatabasewrapper,
            facemodel,
            facebackup,
            facedialog
        },
    };
</script>