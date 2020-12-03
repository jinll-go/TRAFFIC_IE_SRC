<template>
    <div class="main_con_k clearfix" style="width:1200px;padding: 95px auto 20px">
        <div class="main_con_top_face">
            <div class="fl pl10 bold"><label v-tr="i18n_faceFailRecord"></label></div>
        </div>
        <div class="main_con_mid_face">
            <div>
                <button :class="button_style" style="width:88px;float:right" v-tr="i18n_query" @click="query()"></button>
            </div>
            <!-- 失败记录查询mounted数据 -->
            <div>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="_table w100 mt10">
                    <tr>
                        <th class="_th text_center" style="width: 5%"><label v-tr="i18n_NO"></label></th>
                        <th class="_th text_center" style="width: 25%"><label v-tr="i18n_FaceID"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_Name"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_GroupName"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_failReason"></label></th>
                        <th class="_th text_center" style="width: 20%"><label v-tr="i18n_operation"></label></th>
                    </tr>
                    <tr v-for="(item, idx) in list" v-if="flag">
                        <td class="_td text_center">
                            <label>{{ Offset + (idx + 1) }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.FaceID }}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.FaceName }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.GroupName }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ TransCh(list[idx].Code) }}</label>
                        </td>
                        <td class="_td text_center"><a v-tr="i18n_modify" @click="list_modify(item)"></a>&nbsp;</td>
                    </tr>
                    <tr v-if="list.length == 0">
                        <td class="_td text_center" width="100%" height="24" align="right" colspan="7">
                            <div style="width:60%;margin: 5px auto 5px auto;text-align:center;" v-tr="i18n_no_result"></div>
                        </td>
                    </tr>
                </table>

                <CVFootMenu ref="footmenu" :foot="foot" @pagechanged="pagechanged"></CVFootMenu>
            </div>
        </div>
        <div class="main_con_bot_face"></div>
    </div>
</template>

<script>
    import style from 'mixin/style';
    import CVFootMenu from 'components/log/cv-log-footmenu';
    import { debounce } from 'common/util';
    export default {
        name: 'CVConfigEigenvalue',
        mixins: [style],
        data() {
            return {
                list: [],
                Offset: 0,
                Num: 10,
                foot: {
                    logitemcount: 0,
                    totalpages: 1,
                    current_page: 1,
                    name: 'faceErrRecord',
                },
                Status: [],
                isCleanAll: false,

                FaceId: '',
                flag: false,
            };
        },
        created() {
            this.query = debounce(this.btnquery, 1000);
        },

        mounted() {
            this.$store.commit('face/Eigenvalue_mounted', true);
        },
        methods: {
            pagechanged(n) {
                this.Num = 10;
                this.Offset = (n - 1) * this.Num;
                this.foot.current_page = n;
                this.$store.commit('face/Eigenvalue_mounted', false);
                this.GetList();
            },
            btnquery() {
                this.flag = true;
                this.GetList();
            },

            GetList() {
                //初始化渲染列表
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmFacePictureUpgradeQuery',
                        Type: 0,
                        Data: {
                            Offset: this.$store.getters.Face.Eigenvalue_mounted ? 0 : this.Offset,
                            Num: 10,
                        },
                    })
                    .then((r) => {
                        if (r.Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else {
                            if (r.Result == 0) {
                                msg(['初始化记录', r.Data.ResultList]);
                                this.foot.logitemcount = r.Data.ResultCount;
                                let totalpage = Math.ceil(r.Data.ResultCount / this.Num);
                                this.foot.totalpages = totalpage ? totalpage : 1;
                                this.foot.current_page = this.Offset / this.Num + 1;
                                this.list = r.Data.ResultList;

                                this.$notify.success(this.lang['i18n_getok']);
                            } else {
                                this.$notify.error(this.lang['i18n_getfailed']);
                            }
                        }
                    });
            },

            list_modify(item) {
                this.operatingData(item);

            
            },

            operatingData(item) {
                msg(['item??', item]);
                this.$loading.show = true;
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmFacePicture',
                        Type: 3,
                        Data: {
                            MatchType: 0,
                            Offset: 0,
                            Num: 10,
                            ParamMask: 8,
                            TargetName: '',
                            Name: '',
                            Describe: '',
                            FaceId: item.FaceID,
                            FaceData: '',
                            Similarity: 0,
                        },
                    })
                    .then((_) => {
                        this.$loading.show = false;
                        if (_.Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else {
                            if (_.Result == 0) {
                                if (_.Data.FaceResults.length == 0) {
                                    this.$notify.success(this.lang['i18n_no_result']);
                                } else {
                                    this.popup.visible = true;
                                    this.popup.extradata = _.Data.FaceResults[0];
                                    this.popup.dialogmode = 'CVDialogFaceImport';
                                    this.popup.isNeedModify = true;
                                }
                            }
                        }
                    });
            },

            TransCh(num) {
                switch (num) {
                    case 1:
                        return this.lang.i18n_faceFail_01;
                        break;
                    case 2:
                        return this.lang.i18n_faceFail_02;
                        break;
                    case 3:
                        return this.lang.i18n_faceFail_03;
                        break;
                    case 4:
                        return this.lang.i18n_faceFail_04;
                        break;
                    case 5:
                        return this.lang.i18n_faceFail_05;
                        break;
                    case 6:
                        return this.lang.i18n_faceFail_06;
                        break;
                    case 7:
                        return this.lang.i18n_faceFail_07;
                        break;
                    case 8:
                        return this.lang.i18n_faceFail_08;
                        break;
                    case 9:
                        return this.lang.i18n_faceFail_09;
                        break;
                    case 10:
                        return this.lang.i18n_faceFail_10;
                        break;
                    case 11:
                        return this.lang.i18n_faceFail_11;
                        break;
                    case 12:
                        return this.lang.i18n_faceFail_12;
                        break;
                    default:
                        return 'Unknow Error';
                }
            },
        },
        computed: {
            isEigenValue() {
                return this.popup.isEigenValue;
            },
        },
        watch: {
            isEigenValue(newVal, oldVal) {
                if (newVal) {
                    setTimeout(this.GetList(), 2000);
                }
            },
        },
        components: {
            CVFootMenu,
        },
    };
</script>
