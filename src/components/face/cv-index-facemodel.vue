<template>
    <div class="clearfix" style="width:1200px;padding-top: 95px; padding-left: 20px;margin:0 auto;">
        <div class="main_con_top_face">
            <div class="fl pl10 bold">
                <label v-tr="i18n_FaceModel"><!-- 人脸库查询 --></label>
            </div>
        </div>

        <div class="main_con_mid_face">
            <div style="float: left" v-if="show_query_condition">
                <label v-tr="i18n_QueryCondition"><!-- 查询条件 --></label>:
            </div>
            <div style="float: right">
                <div style="float: left" v-if="show_query_condition">
                    <label v-tr="i18n_QueryType"></label>:
                    <select class="textc" style="width: 130px" v-model="MatchType">
                        <option :value="0" v-tr="i18n_WholeWord"><!-- 全词匹配 --></option>
                        <option :value="1" v-tr="i18n_FuzzyQuery"></option>
                    </select>
                    <button :class="button_style" style="width: 88px" @click="query" v-tr="i18n_query"></button>
                </div>
                <button style="width: 88px;" :class="button_style" v-tr="i18n_faceImport" @click="btn_import" v-if="!show_query_condition"></button>&nbsp;
                <button style="width: 88px;" :class="button_style" v-tr="i18n_return" @click="btn_back" v-if="!show_query_condition"></button>&nbsp;
            </div>

            <!-- 人脸数据库的添加按钮产生的table -->
            <div style="float: left" v-if="!show_query_condition">
                <label v-tr="i18n_GroupName"></label>: <label>{{ TargetName }}</label
                >&nbsp;&nbsp; <label v-tr="i18n_GroupType"></label>:
                <select class="textc" style="width: 120px" v-model="TargetType" disabled="disabled">
                    <option :value="0" v-tr="i18n_ResOther"></option>
                    <option :value="1" v-tr="i18n_whitelist"></option>
                    <option :value="2" v-tr="i18n_blacklist"></option>
                    <option :value="4" v-tr="i18n_visitlist"></option>
                </select>
            </div>

            <!-- 人脸模板 mounted 的数据-->
            <div class="facedatabase_warp" v-else>
                <table class="w100" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="text-align:right"><input type="checkbox" v-model="TargetName_checked" /></td>
                        <td style="text-align:right"><label v-tr="i18n_GroupName"></label></td>
                        :
                        <td>
                            <input type="text" class="textc" v-model="TargetName" :disabled="!TargetName_checked" v-validator:NameLength />
                        </td>
                        <td style="text-align:right"><input type="checkbox" v-model="Name_checked" /></td>
                        <td style="text-align:right"><label v-tr="i18n_Name"></label></td>
                        :
                        <td>
                            <input type="text" class="textc" v-model="Name" :disabled="!Name_checked" />
                        </td>
                        <td style="text-align:right"><input type="checkbox" v-model="img_path_checked" /></td>
                        <td style="text-align:right"><label v-tr="i18n_FaceSearchFace"></label></td>
                        :
                        <td v-if="plugin_type != 'h5'">
                            <input type="text" class="textc" v-model="img_path" readonly="readonly" />&nbsp;&nbsp;
                            <button :class="button_style" @click="getImageData" :disabled="!img_path_checked" v-tr="i18n_browse"></button>
                        </td>

                        <td v-if="plugin_type == 'h5'">
                            <input type="text" class="textc" v-model="img_path" readonly="readonly" />
                            <input
                                type="file"
                                id="selfilemodel"
                                style="display: none"
                                @change="h5_getImageData"
                                accept=".jpg, .jpeg"
                                :disabled="!img_path_checked"
                            />
                            <label
                                :class="button_style"
                                style="display:inline-block; width:88px;height:24px; margin:0;"
                                for="selfilemodel"
                                v-tr="i18n_browse"
                            ></label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align:right"><input type="checkbox" v-model="FaceId_checked" /></td>
                        <td style="text-align:right"><label v-tr="i18n_FaceID"></label></td>
                        :
                        <td>
                            <input type="text" class="textc" v-model="FaceId" :disabled="!FaceId_checked" />
                        </td>
                        <td style="text-align:right"><input type="checkbox" v-model="Describe_checked" /></td>
                        <td style="text-align:right"><label v-tr="i18n_Describe"></label></td>
                        :
                        <td>
                            <input type="text" class="textc" v-model="Describe" :disabled="!Describe_checked" />
                        </td>
                        <td></td>
                        <td style="text-align:right"><label v-tr="i18n_SimilarityThreshold"></label></td>
                        :
                        <td>
                            <input type="text" class="textc" v-model="Similarity" :disabled="!Similarity_checked" v-validator:NOVOID:Number="[0, 100]" />
                        </td>
                    </tr>
                </table>
            </div>

            <!-- 人脸模板板块，点击查询按钮生成的人脸信息列表 -->
            <div class="w100">
                <table border="0" cellspacing="0" cellpadding="0" class="_table w100 mt10">
                    <tr>
                        <!-- <th  class="_th text_center" style="width: 5%"><label v-tr="i18n_NO"></label></th> -->
                        <th class="_th text_center" style="width: 8%" v-if="show_query_condition"><label v-tr="i18n_GroupName"></label></th>
                        <th class="_th text_center" style="width: 8%"><label v-tr="i18n_Name"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_Describe"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_FaceID"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_wiegandId"></label></th>
                        <th class="_th text_center" style="width: 5%"><label v-tr="i18n_Enable"></label></th>
                        <th class="_th text_center" style="width: 5%"><label v-tr="i18n_FaceModalStatus"></label></th>
                        <th class="_th text_center" style="width: 5%"><label v-tr="i18n_FaceScheduleType"></label></th>
                        <th class="_th text_center" style="width: 8%" v-if="show_query_condition || TargetType == 4"><label v-tr="i18n_beginTime"></label></th>
                        <th class="_th text_center" style="width: 8%" v-if="show_query_condition || TargetType == 4"><label v-tr="i18n_endTime"></label></th>
                        <th class="_th text_center" style="width: 8%"><label v-tr="i18n_operation"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Pic"></label></th>
                    </tr>
                    <tr v-for="(item, idx) in list">
                        <!-- <td  class="_td text_center"><label>{{idx+1}}</label></td> -->
                        <td class="_td text_center" style="word-break: break-all" v-if="show_query_condition">
                            <label>{{ item.TargetName }}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.Name }}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.Describe }}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.FaceId }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.WiegandId }}</label>
                        </td>
                        <td class = "_td text_center">
                            <label v-if="item.Enable" v-tr="i18n_yes"></label>
                            <label v-else v-tr="i18n_no"></label>
                        </td>
                        <td class = "_td text_center">
                            <label v-if="item.ModelValid" v-tr="i18n_nomal"></label>
                            <label v-else v-tr="i18n_abnormal"></label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.ScheduleType }}</label>
                        </td>
                        <td class="_td text_center" v-if="show_query_condition || TargetType == 4">
                            <label v-if="item.StartTime == '1970-01-01 00:00:00'">-</label>
                            <label v-else>{{ item.StartTime }}</label>
                        </td>
                        <td class="_td text_center" v-if="show_query_condition || TargetType == 4">
                            <label v-if="item.EndTime == '2038-01-19 03:14:07'">-</label>
                            <label v-else>{{ item.EndTime }}</label>
                        </td>
                        <td class="_td text_center">
                            <a v-tr="i18n_modify" @click="list_modify(item)"></a>&nbsp;&nbsp;
                            <a v-tr="i18n_del" @click="list_del(item)"></a>
                        </td>
                        <td class="_td text_center"><img style="height: 126px;width: auto;" :src="item.FaceData" /></td>
                    </tr>
                    <tr v-if="list.length == 0">
                        <td class="_td text_center" width="100%" height="24" align="right" colspan="12">
                            <div style="width:60%;margin: 5px auto 5px auto;text-align:center;" v-tr="i18n_no_result"></div>
                        </td>
                    </tr>
                </table>

                <CVFootMenu ref="footmenu" :foot="foot" @pagechanged="pagechanged"></CVFootMenu>
            </div>
        </div>
    </div>
</template>

<script>
    import style from 'mixin/style';
    import CVFootMenu from 'components/log/cv-log-footmenu';
    import { basename } from 'common/util';
    export default {
        name: 'CVIndexSingleFaceList',
        mixins: [style],
        inject: ['popup'],
        props: {
            show_query_condition: {
                type: String,
                default: true,
            },
        },
        data() {
            return {
                list: [],
                TargetName: '',
                TargetType: 0,
                MatchType: 0,
                Offset: 0,
                Num: 10,
                Name: '',
                Describe: '',
                FaceId: '',
                img_path: '',
                img_data: '',
                foot: {
                    logitemcount: 0,
                    totalpages: 1,
                    current_page: 1,
                    name: 'facemodel',
                },
                ParamMask: 0,
                Similarity: 70,
            };
        },
        mounted() {
            if (!this.show_query_condition) {
                this.TargetName = this.popup.extradata.TargetName;
                this.TargetType = this.popup.extradata.TargetType;
                this.TargetName_checked = true;
                this.operatingData();
            }
        },
        methods: {
            pagechanged(n) {
                this.Offset = (n - 1) * this.Num;
                this.foot.current_page = n;
                this.operatingData();
            },
            operatingData(data) {
                if (data == null) {
                    data = {
                        Type: 3,
                        Ch: 1,
                        Data: {
                            MatchType: this.MatchType,
                            Offset: this.Offset,
                            Num: this.Num,
                            ParamMask: this.ParamMask,
                            TargetName: this.TargetName.trim(),
                            Name: this.Name.trim(),
                            Describe: this.Describe.trim(),
                            FaceId: this.FaceId.trim(),
                            FaceData: this.img_data,
                            Similarity: parseInt(this.Similarity),
                        },
                    };
                }

                if (this.img_path.trim().length == 0 && this.img_path_checked) {
                    this.$notify.error(this.lang['i18n_faceImport_single_select_picture']);
                    this.list_clear();
                    return;
                }

                this.$loading.show = true;
                this.$store
                    .dispatch(
                        'request',
                        $.extend(
                            true,
                            {
                                url: 'goform/frmFacePicture',
                                TimeOut: 60000,
                            },
                            data
                        )
                    )
                    .then((res) => {
                        this.$loading.show = false;
                        if (res.Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else {
                            if (res.Result == 0) {
                                if (data.Type == 1) {
                                    this.$notify.success(this.lang['i18n_saveok']);
                                    this.operatingData();
                                } else {
                                    this.foot.logitemcount = res.Data.TotalCount;
                                    let totalpage = Math.ceil(res.Data.TotalCount / this.Num);

                                    this.foot.totalpages = totalpage ? totalpage : 1;
                                    this.foot.current_page = this.Offset / this.Num + 1;
                                    this.list = res.Data.FaceResults;
                                    this.$notify.success(this.lang['i18n_getok']);
                                }
                            } else {
                                this.list_clear();
                                if (res.Result == 4) {
                                    this.$notify.error(this.lang['i18n_querybusy']);
                                } else if (res.Result == -11) {
                                    this.$notify.error(this.lang['i18n_GetFeatureFailed']);
                                } else {
                                    let lang = this.lang;
                                    this.$notify.error(lang[data.Type == 1 ? 'i18n_savefailed' : 'i18n_getfailed']);
                                }
                            }
                        }
                    });
            },
            list_clear() {
                this.list = [];
                this.foot.logitemcount = 0;
                this.foot.totalpages = 1;
                this.foot.current_page = 1;
            },
            btn_back() {
                this.$emit('pagechanged', 'facedatabase');
            },
            list_modify(item) {
                this.popup.isNeedModify = true;
                this.popup.dialogmode = 'CVDialogFaceImport';
                this.popup.extradata = item;
                this.popup.visible = true;
                this.popup.TargetType = this.TargetType;

            },
            list_del(item) {
                this.operatingData({ Type: 1, Ch: 1, Data: { FaceId: item.FaceId } });
            },
            btn_import() {
                let item = { TargetName: this.TargetName };

                this.popup.isNeedModify = false;
                this.popup.extradata = item;
                this.popup.dialogmode = 'CVDialogFaceImport';
                this.popup.visible = true;
                this.popup.TargetType = this.TargetType;
            },
            query() {
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
                    return;
                }
                this.Offset = 0;
                this.foot.totalpages = 1;
                this.foot.logitemcount = 0;
                this.foot.current_page = 1;
                //         let data = {Type:3,Ch:1,Data:{
                //           MatchType:this.TargetType,
                //           Offset:this.Offset,
                //           Num:this.Num
                //         }};
                //         if(this.TargetName_checked)data.Data.TargetName = this.TargetName.trim();
                //         if(this.Name_checked)data.Data.Name = this.Name.trim();
                //         if(this.Describe_checked)data.Data.Describe = this.Describe.trim();
                //         if(this.FaceId_checked)data.Data.FaceId = this.FaceId.trim();
                //         if(this.img_path_checked)data.Data.FaceData = this.img_data;

                //  if(this.TargetName_checked||this.Name_checked||this.Describe_checked||this.FaceId_checked||this.img_path_checked){
                this.operatingData();
                //  }else {
                //    this.$notify.info(this.lang["i18n_Choose_QueryCondition"]);
                //  }
            },
            h5_getImageData(e) {
                msg('h5选择图片', e.target.value);
                let path = e.target.value;
                if (path.length > 0) {
                    let file = e.target.files[0];
                    if (file.size > 1024000) {
                        this.$notify.error(this.lang['i18n_PictooLarge']);
                        return;
                    }
                    this.img_path = file.name;
                    let fileReader = new FileReader();
                    fileReader.onload = (ev) => {
                        let base64 = ev.target.result.split(',');
                        this.img_data = base64[1];
                        this.$notify.success(this.lang.i18n_getPic_success);
                    };
                    fileReader.readAsDataURL(file);
                } else {
                    this.$notify.error(this.lang['i18n_faceTips']);
                }
            },
            getImageData() {
                let plugin = this.$store.getters.config_plugin;
                if (plugin) {
                    this.img_data = '';
                    this.img_path = plugin.OpenFileDialog({ OpenMode: 1 });
                    msg('choose file:' + this.img_path);
                    if (this.img_path.length > 0) {
                        let result = plugin.TransFilesToBase64Str(
                            {
                                file_list: [this.img_path],
                            },
                            function(filename, base64str, status) {
                                if (status == 0) {
                                    this.img_data = base64str;
                                } else if (status == 5) {
                                    this.$notify.success(this.lang.i18n_getPic_success);
                                } else {
                                    this.$notify.error(this.lang.i18n_getPic_failed);
                                }
                            }.bind(this)
                        );
                    }
                }
            },
        },
        computed: {
            isModel() {
                return this.show_query_condition;
            },
            refreshList() {
                msg('facequery', this.popup.refreshQueryList);
                return this.popup.refreshQueryList;
            },
            TargetName_checked: {
                get: function() {
                    return this.ParamMask & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.ParamMask |= 0x01;
                    } else {
                        this.ParamMask &= ~0x01;
                    }
                },
            },
            Name_checked: {
                get: function() {
                    return (this.ParamMask >> 1) & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.ParamMask |= 0x02;
                    } else {
                        this.ParamMask &= ~0x02;
                    }
                },
            },
            Describe_checked: {
                get: function() {
                    return (this.ParamMask >> 2) & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.ParamMask |= 0x04;
                    } else {
                        this.ParamMask &= ~0x04;
                    }
                },
            },
            FaceId_checked: {
                get: function() {
                    return (this.ParamMask >> 3) & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.ParamMask |= 0x08;
                    } else {
                        this.ParamMask &= ~0x08;
                    }
                },
            },
            img_path_checked: {
                get: function() {
                    return (this.ParamMask >> 4) & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.ParamMask |= 0x10;
                    } else {
                        this.ParamMask &= ~0x10;
                    }
                    this.Similarity_checked = v;
                },
            },
            Similarity_checked: {
                get: function() {
                    return (this.ParamMask >> 5) & 0x01 ? true : false;
                },
                set: function(v) {
                    if (v) {
                        this.ParamMask |= 0x20;
                    } else {
                        this.ParamMask &= ~0x20;
                    }
                },
            },
        },
        watch: {
            isModel(newVal) {
                msg(['isSingle', newVal]);
                if (!newVal) {
                    this.list = [];
                    this.TargetName = '';
                    this.TargetType = 0;
                    this.MatchType = 0;
                    this.Offset = 0;
                    this.TargetName_checked = false;
                    this.foot.current_page = 1;
                    this.foot.logitemcount = 0;
                    this.foot.totalpages = 1;
                }
            },
            refreshList(newVal) {
                if (newVal) {
                    this.operatingData();
                }
            },
        },
        components: {
            CVFootMenu,
        },
    };
</script>
