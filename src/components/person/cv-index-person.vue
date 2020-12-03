<template>
    <AutoSizeLayout top_height="0" left_width="158" right_width="0">
        <template v-slot:leftpanel>
            <div class="tab-tit left" :style="{ height: height }">
                <div :class="[item.active ? 'cur' : '']" v-for="item of menuList" @click="btn_click(item)" v-show="item.show">
                    <a v-tr="item.text"></a>
                </div>
            </div>
        </template>

        <template v-slot:centerpanel>
            <div class="main bkcolor ui-tabs ui-widget ui-widget-content ui-corner-all">
                <div class="main_fish" style="overflow: auto">
                    <div class="mainin" style="margin-right: 0">
                        <div class="tab-con_div" :style="{ height: height, overflow: 'auto', width: '100%' }">
                            <CVIndexPersonCounter v-if="PersonIndex == 'Counter'"></CVIndexPersonCounter>
                            <CVIndexPersonRegion :PersonIndex="PersonIndex" @playrecords="playrecords" v-else></CVIndexPersonRegion>
                        </div>
                    </div>
                </div>

                <CVDialogPersonPlayback
                    v-if="isShowVideo"
                    :playcontext="videoContext"
                    :height="height"
                    @dialoghide="isShowVideo = false"
                ></CVDialogPersonPlayback>
            </div>
        </template>
    </AutoSizeLayout>
</template>

<script>
    import Vue from 'vue';
    import AutoSizeLayout from '../../layout/fixedtop-3column-layout';
    import CVIndexPersonCounter from 'components/person/cv-index-personcounter';
    import CVIndexPersonRegion from 'components/person/cv-index-personregion';
    import CVDialogPersonPlayback from 'components/person/cv-dialog-personplayback';
    export default {
        name: 'CVIndexPerson',
        data() {
            let ui_custom = this.$UI[this.$options.name];
            return {
                PersonIndex: '',
                menuList: [
                    { text: 'i18n_CounterReport', identity: 'Counter', active: true, show: ui_custom.CounterReport.visible },
                    { text: 'i18n_RetrogradeReport', identity: 'Retrograde', active: false, show: ui_custom.RetrogradeReport.visible },
                    { text: 'i18n_AbsentReport', identity: 'Absent', active: false, show: ui_custom.AbsentReport.visible },
                    {
                        text: this.$store.getters.showElectronicFence == true ? 'i18n_RegionReport' : 'i18n_regionDetectReport',
                        identity: 'Region',
                        active: false,
                        show: ui_custom.RegionReport.visible,
                    },
                ],
                isShowVideo: false,
                videoContext: null,
            };
        },
        created() {
            let tem_param = this.$UI['CVIndexPerson'];
            let tmpArr = [
                tem_param['CounterReport'].visible,
                tem_param['RetrogradeReport'].visible,
                tem_param['AbsentReport'].visible,
                tem_param['RegionReport'].visible,
            ];
            // msg(['tmpArr',tmpArr])
            var a = tmpArr.indexOf(true);
            if (a == 0) {
                this.PersonIndex = 'Counter';
            } else if (a == 1) {
                this.PersonIndex = 'Retrograde';
            } else if (a == 2) {
                this.PersonIndex = 'Absent';
            } else if (a == 3) {
                this.PersonIndex = 'Region';
            }
        },

        methods: {
            btn_click(item) {
                // msg(["btn_click",item,item.text,this.PersonIndex])
                this.menuList.forEach((item) => {
                    Vue.set(item, 'active', false);
                });
                Vue.set(item, 'active', true);
                this.PersonIndex = item.identity;
            },
            playrecords(info) {
                this.videoContext = info.context;
                this.isShowVideo = true;
            },
        },
        computed: {
            height() {
                return this.$parent.height ? this.$parent.height : this.$store.getters.content_rect.height + 'px';
            },

            activated() {
                return this.$store.getters.person_activated;
            },
        },

        components: {
            AutoSizeLayout,
            CVDialogPersonPlayback,
            CVIndexPersonCounter,
            CVIndexPersonRegion,
        },
    };
</script>
