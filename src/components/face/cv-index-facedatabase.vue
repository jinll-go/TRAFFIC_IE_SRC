<template>
    <div class="clearfix facedatabase_container">
        <div class="main_con_top_ss_facedatabase">
            <div class="fl pl10 bold"><label v-tr="i18n_FaceDatabase"></label></div>
        </div>

        <div class="main_con_mid_ss">
            <div style="float: right">
                <button style="width: 120px;" :class="button_style" v-tr="i18n_add" @click="list_add"></button>&nbsp;
                <!---
                <button style="width: 120px;" :class="button_style" @click="list_cleanall" v-tr="i18n_ClearDatabase"></button>
                --->
            </div>
            <div class="w100 mt10">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="_table">
                    <tr>
                        <th class="_th text_center" style="width: 8%"><label v-tr="i18n_NO"></label></th>
                        <!---
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_status"></label></th>
                        --->
                        <th class="_th text_center" style="width: 25%"><label v-tr="i18n_GroupName"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_GroupType"></label></th>
                        <!---
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_SimilarityThreshold"></label></th>
                        --->

                        <th class="_th text_center" style="width: 12%"><label v-tr="i18n_FaceModelNumber"></label></th>
                        <th class="_th text_center" style="width: 20%"><label v-tr="i18n_operation"></label></th>
                    </tr>
                    <tr v-for="(item, idx) in list">
                        <td class="_td text_center">
                            <label>{{ Offset + idx + 1 }}</label>
                        </td>

                        <!---
                        <td class="_td text_center">
                            <label>{{ Status[item.Enable] }}</label>
                        </td>
                        --->

                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.TargetName }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ trans_Type(item.TargetType) }}</label>
                        </td>
                        <!---
                        <td class="_td text_center">
                            <label>{{ item.Similarity + '%' }}</label>
                        </td>
                        --->
                        <td class="_td text_center">
                            <label>{{ item.Count }}</label>
                        </td>
                        <td class="_td text_center">
                            <a @click="list_detail(item)" v-tr="i18n_Detail"></a>&nbsp;|&nbsp;
                            <a v-tr="i18n_modify" @click="list_modify(item)"></a>&nbsp;|&nbsp; 
                            <a v-tr="i18n_del" @click="list_del(item)"></a>
                        </td>
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
        <div class="main_con_bot_ss"></div>
    </div>
</template>

<script>
    import style from 'mixin/style';
    import CVFootMenu from 'components/log/cv-log-footmenu';
    export default {
        name: 'CVConfigFaceDB',
        mixins: [style],
        data() {
            return {
                list: [],
                filterStr: '',
                add_name: '',
                add_type: 0,
                Offset: 0,
                Num: 10,
                foot: {
                    logitemcount: 0,
                    totalpages: 1,
                    current_page: 1,
                    name: 'facedatabase',
                },
                Status: [],
                isCleanAll: false, //标识数据库是否有数据
            };
        },
        inject: ['popup'],
        mounted() {
            this.Status = [this.lang['i18n_no_enable'], this.lang['i18n_enableFtp']];
            this.getData();
        },
        methods: {
            pagechanged(n) {
                if (this.isCleanAll) return;
                this.Offset = (n - 1) * this.Num;
                this.foot.current_page = n;
                this.getData();
            },
            getData() {
                this.$loading.show = true;
                Promise.all([
                    this.$store.dispatch('request', {
                        url: 'goform/frmFaceDatabase',
                        Type: 4,
                        Ch: 1,
                        Data: {},
                    }),
                    this.$store.dispatch('request', {
                        url: 'goform/frmFaceDatabase',
                        Type: 5,
                        Ch: 1,
                        Data: { Offset: this.Offset, Num: this.Num },
                    }),
                ]).then((res) => {
                    this.$loading.show = false;
                    if (res[0].Result == -655365 || res[1].Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (res[0].Result == 0 && res[1].Result == 0) {
                            this.foot.logitemcount = res[0].Data.TargetItemTotalNum;
                            let totalpage = Math.ceil(res[0].Data.TargetItemTotalNum / this.Num);
                            this.foot.totalpages = totalpage ? totalpage : 1;
                            this.foot.current_page = this.Offset / this.Num + 1;
                            this.list = res[1].Data.TargetResults.TargetItems;
                            this.$notify.success(this.lang['i18n_getok']);
                        } else {
                            this.$notify.error(this.lang['i18n_getfailed']);
                        }
                    }
                });
            },
            setData(data) {
                this.$loading.show = true;
                this.$store.dispatch('request', $.extend(true, { url: 'goform/frmFaceDatabase' }, data)).then((_) => {
                    this.isCleanAll = false;
                    this.$loading.show = false;
                    if (_.Result == -655365) {
                        this.$store.dispatch('config_no_right');
                    } else {
                        if (_.Result == 0) {
                            this.$notify.success(this.lang['i18n_saveok']);
                            this.getData();
                        } else {
                            this.$notify.error(this.lang['i18n_savefailed']);
                        }
                    }
                });
            },
            list_add() {
                //  let data = {TargetName:this.add_name,TargetType:this.add_type};
                //  this.setData({Type:0,Ch:1,Data:data});
                if (this.isCleanAll) return;
                let item = { TargetName: '', TargetType: 1, Enable: 1, Similarity: 75, submit_type: 0 };

                this.popup.dialogmode = 'CVDialogFaceAddGroup';
                this.popup.extradata = item;
                this.popup.visible = true;
                this.popup.refreshAddGroupList = false;
            },
            list_clearAllFace(item)
            {
                //查询人脸ID
                Promise.all([
                this.$store.dispatch('request', {
                    url: 'goform/frmFacePicture',
                    Type: 5,
                    Ch: 1,
                    Data: { TargetName: item.TargetName, MatchType: 1, ParamMask: 1, NeedBase64: 0, Offset: 0, Num: item.Count },
                    })
                ]).then((res)=> {
                    console.log(res);
                    if (res[0].Result == 0) {
                        //循环删除人脸
                        for (var i = 0; i < res[0].Data.FaceResults.length; i++)
                        {
                            var result = res[0].Data.FaceResults[i];
                            console.log(result);
                            Promise.all([
                                this.$store.dispatch('request', {
                                    url: 'goform/frmFacePicture',
                                    Type: 1,
                                    Ch: 1,
                                    Data: {FaceId: result.FaceId},
                                })
                            ]).then((res) => {
                                //nothing to do.
                            });
                        }

                        this.getData();
                    } else {                               
                        this.$notify.error(this.lang['i18n_getfailed']);
                    }
                });
                
            },          
            list_del(item) {
                if (this.isCleanAll) return;

                let is_default = item.TrafficDefault;//['defaultwhitelist', 'defaultblacklist', 'defaultvisitlist'].includes(name) && this.$Param.extra_delete_defaultgroup_tips;
                if (confirm(is_default ? this.lang.i18n_confirm_delDatabase_default : this.lang.i18n_confirm_delDatabase)) {
                    if (is_default)
                    {
                        if (item.Count == 0) 
                        {
                            return ;
                        }

                        this.list_clearAllFace(item);
                    }
                    else
                    {
                        this.setData({ Type: 1, Ch: 1, Data: { TargetName: item.TargetName } });
                    }                                
                }
            },
            list_modify(item) {
                if (this.isCleanAll) return;
                item.submit_type = 2;
                this.popup.dialogmode = 'CVDialogFaceAddGroup';
                this.popup.extradata = item;
                this.popup.visible = true;
		        this.popup.refreshAddGroupList = false;
            },
            list_detail(item) {
                if (this.isCleanAll) return;
                //this.$store.commit('face/Facedb_to_model', true);

                this.popup.extradata = item;
                this.$emit('pagechanged', 'facemodel');
            },
            list_cleanall() {
                if (this.isCleanAll) return;
                if (confirm(this.lang['i18n_clear_database_tips'])) {
                    this.isCleanAll = true;
                    this.setData({ Type: 3, Ch: 1, Data: {} });
                }
            },
            trans_Type(type) {
                let str = '';
                let lang = this.lang;
                switch (type) {
                    case 0:
                        str = lang.i18n_ResOther;
                        break;
                    case 1:
                        str = lang.i18n_whitelist;
                        break;
                    case 2:
                        str = lang.i18n_blacklist;
                        break;
                    case 4:
                        str = lang.i18n_visitlist;
                        break;
                }
                return str;
            },
        },
        computed: {
            refreshList() {
                msg('组件中', this.popup.refreshAddGroupList);
                return this.popup.refreshAddGroupList;
            },
        },
        watch: {
            refreshList(newVal, oldVal) {
                msg(['刷新列表？', newVal, oldVal]);
                if (newVal) {
                    this.getData();
                }
                // this.$store.commit('temp_face/refreshAddGroupList', false);
            },
        },
        components: {
            CVFootMenu,
        },
    };
</script>
