<template>
    <div>
        <!--单张导入-->
        <div class="full" style="border:1px solid gray;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
                <tr>
                    <td width="500px" height="500px">
                        <!-- 人脸单张导入模态框 -->
                        <table cellpadding="0" cellspacing="0" width="100%" height="100%">
                            <tr>
                                <td style="display:table-cell;text-align:center;vertical-align:middle;">
                                    <!--<div style="width: 450px;height: 450px;margin: 20px" v-if="plugin_type == 'h5'">
										<div id="face_capture" style="width: 450px;height: 450px;" v-show="isShowVideo"></div>
										<img id="big" src="static/images/defaultface.png" v-show="!isShowVideo"/>
									</div>
									<div style="width: 450px;height: 450px;margin: 20px" v-else>
                                        <CVPlugin identity="face_capture" type="CONFIGPARAMETER" class="full" v-if="isShowVideo"></CVPlugin>
                                        <img id="big" src="static/images/defaultface.png" v-show="!isShowVideo" />
                                    </div>-->

                                    <div style="width: 450px;height: 450px;margin: 20px">
                                        <CVPlugin
                                            identity="face_capture"
                                            type="CONFIGPARAMETER"
                                            class="full"
                                            @streamready="capBtnShow = true"
                                            v-if="isShowVideo"
                                        ></CVPlugin>

                                        <img id="big" src="static/images/defaultface.png" name="pic" v-show="!isShowVideo" />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td height="30px">
                                    <div class="w100 pt10 pb10 text_center">
                                        <label>{{ get_features_info }}</label>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>

                    <td width="300px" valign="top" style="border-left:1px solid gray;">
                        <div v-tr="lang_ImportType"></div>
                        <hr style="border:0;background-color:#808080;height:1px;" />
                        <div class="w100 pt5 text_center" v-if="isImportIndex">
                            <button @click="IndextoType(0)" :class="button_style" style="min-width:100px;" v-tr="i18n_LocalImport">
                                Local Import<!-- 本地导入 -->
                            </button>
                            <br /><br />
                            <button @click="IndextoType(1)" :class="button_style" style="min-width:100px;" v-tr="i18n_faceImport_capture">
                                <!-- 抓拍导入 -->
                            </button>
                        </div>
                        <div class="w100 pt5 text_center" v-show="!isImportIndex">
                            <div v-if="isLocalImport">
                                <div v-if="plugin_type == 'h5'">
                                    <input type="file" id="selfilexx" style="display: none" @change="h5_choose_file" accept=".jpg, .jpeg" />
                                    <label
                                        :class="button_style"
                                        style="display:inline-block; width:100px;height:24px; margin:0;"
                                        for="selfilexx"
                                        v-tr="i18n_faceImport_single_select_picture"
                                    ></label>
                                </div>
                                <div v-else>
                                    <button @click="choose_file" :class="button_style" style="min-width:100px;" v-tr="i18n_faceImport_single_select_picture">
                                        请选择图片
                                    </button>
                                </div>
                                <!--      <cv-file-selector
                                    identity="selxx"
                                    :text="lang.i18n_faceImport_single_select_picture"
                                    @change="h5_choose_file"
                                ></cv-file-selector>-->
                            </div>
                            <div v-else>
                                <!-- 抓拍 -->
                                <button @click="capture_from_stream" :class="button_style" style="min-width:100px;" v-tr="i18n_Snapshot" v-if="isShowVideo">
                                    <!-- v-show="capBtnShow"    视频流加载完成后在显示抓拍按钮 -->
                                </button>
                                <button @click="return_stream" :class="button_style" style="min-width:100px;" v-tr="i18n_returnVideo" v-else>
                                    <!-- 返回预览 -->
                                </button>
                            </div>
                            <br />
                            <button style="min-width: 100px;" :class="button_style" v-tr="i18n_return" @click="TypetoIndex"><!-- 返回 --></button>
                        </div>
                        <div class="w100 pt5 text_center">
                            <br />
                            <button :class="button_style" style="min-width:100px;" v-show="base64_list.length" @click="img_undo" v-tr="i18n_undo">
                                <!-- 撤销 -->
                            </button>
                        </div>

                        <div class="w100" style="border-bottom:1px solid gray;height:1px;padding-top:20px"></div>

                        <!---
                        <div class="w100" style="padding-top:20px;">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_GroupName"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%"><input type="text" v-model="TargetName" class="w100 textc" disabled="disabled" /></div>
                        </div>
                        --->

                        <!---启用--->
                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_Enable"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%"><input type="checkbox" v-model="info.Enable" /></div>
                        </div>

                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:40%">
                                <label v-tr="i18n_Name"><!--姓名--></label>:&nbsp;
                            </div>
                            <div class="fl" style="width:50%">
                                <input type="text" v-model="info.Name" class="w100 textc" v-validator:NOVOID:StrLength="[1, 32]" />
                            </div>
                        </div>

                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_Describe"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%">
                                <input type="text" v-model="info.Describe" class="w100 textc" v-validator:StrLength="[0, 32]" />
                            </div>
                        </div>

                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_FaceID"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%"><input type="text" v-model="info.FaceId" class="w100 textc" v-validator:StrLength="[0, 40]"
                                                                     readonly="!popup.isNeedModify"/></div>
                        </div>

                        <div class="w100 pt5" v-if="TargetType == 4">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_beginTime"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%"><input type="datetime" v-model="info.StartTime" class="w100 textc" /></div>
                        </div>

                        <div class="w100 pt5" v-if="TargetType == 4">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_endTime"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%"><input type="datetime" v-model="info.EndTime" class="w100 textc" /></div>
                        </div>

                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_wiegandAssignType"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%">
                                <select v-model="info.WiegandAssignType" class="w100 textc">
                                    <option :value="0" v-tr="i18n_CommonWiegand"></option>
                                    <option :value="1" v-tr="i18n_wiegandManualInput"></option>
                                    <option :value="2" v-tr="i18n_wiegandAutoAssign"></option>
                                </select>
                            </div>
                        </div>

                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_wiegandId"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%">
                                <input type="text" v-model="info.WiegandId" class="w100 textc" :disabled="info.WiegandAssignType != 1"/>
                            </div>
                        </div>

                        <div class="w100 pt5">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_FaceScheduleType"></label>:&nbsp;</div>
                            <div class="fl" style="width:50%">
                                <select type="text" v-model="info.ScheduleType" class="w100 textc">
                                    <option :value="0" v-tr="i18n_no_enable"></option>
                                    <option v-for="(type, index) in scheduleType" :value="type">{{type}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="w100 pt10 text_center">
                            <button :class="button_style" @click="send" v-tr="i18n_Import" :disabled="flag"><!--导入--></button>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div style="color:red">
            <label v-tr="i18n_faceimport_tips"></label>
        </div>
    </div>
</template>

<script>
   // import CVPlugin from 'components/activex/activex-wrapper.js';

    import style from 'mixin/style';
    import repos_plugin from 'mixin/repos_plugin';
    import { addEvent } from 'common/util';
    export default {
        name: 'CVConfigFaceSingleImport',
        mixins: [style, repos_plugin],
        inject: ['popup'],
        data() {
            return {
                TargetName: '',
                TargetType: 1,
                info: {
                    Name: '',
                    Describe: '',
                    SrcFaceId: '',
                    FaceId: '',
                    Enable: 1,
                    StartTime: '1970-01-01 00:00:00',
                    EndTime: '2038-01-19 03:14:07',
                    FaceData: '',
                    WiegandAssignType: 0,
                    WiegandId: '0',
                    ScheduleType: 0,
                    UseCustomAudio: 0,
                },
                get_features_info: '',
                isShowVideo: false,
                isShowCrop: false,
                isShowSnap: false,
                isReturnVideo: false,
                base64_list: [],
                isImportIndex: true,
                isLocalImport: true,
                lang_ImportType: '',
                flag: false,
                capBtnShow: false,
                scheduleType: [0],
                needModifyPic: 0,
            };
        },
        created() {
            //获取已添加的调度类型
            this.getFaceScheduleType();
        },
        mounted() {
            // 从人脸数据库中  详情 点击 人脸录入 按钮进入的单张录入模态框
            // this.TargetName = this.$store.getters.Face.DialogSingleFace.TargetName;
            this.TargetName = this.popup.extradata.TargetName;
            this.TargetType = this.popup.TargetType;
            var curDateTime = new Date();
            this.info.StartTime = curDateTime.getFullYear() + '-'
                + (curDateTime.getMonth() + 1) + '-'
                + curDateTime.getDate() + ' '
                + curDateTime.getHours() + ':'
                + curDateTime.getMinutes() + ':'
                + curDateTime.getSeconds();
            this.info.EndTime = curDateTime.getFullYear() + '-'
                + (curDateTime.getMonth() + 1) + '-'
                + curDateTime.getDate() + ' '
                + '23' + ':'
                + '59' + ':'
                + '59';
            this.lang_ImportType = this.lang.i18n_ImportType;
            this.options = {
                aspectRatio: 0,
                autoCrop: false,
                cropend: (e) => {
                    let result = $('#big').cropper('getCroppedCanvas', {});
                    let img_base64 = result.toDataURL('image/jpeg');
                    if (img_base64 == 'data:,') {
                        img_base64 = e.target.src;
                    }
                    this.base64_list.push(e.target.src);
                    this.show_img(img_base64);
                    if (this.base64_list.length > 3) {
                        this.base64_list.shift();
                    }
                },
            };

            if (this.popup.isNeedModify) {
                this.info.Name = this.popup.extradata.Name;
                this.info.FaceId = this.popup.extradata.FaceId;
                this.info.Describe = this.popup.extradata.Describe;
                this.info.SrcFaceId = this.popup.extradata.FaceId;
                this.info.WiegandId = this.popup.extradata.WiegandId;
                this.info.FaceData = this.popup.extradata.FaceData;
                this.info.ScheduleType = this.popup.extradata.ScheduleType;
                this.info.Enable = this.popup.extradata.Enable;
                this.info.StartTime = this.popup.extradata.StartTime;
                this.info.EndTime = this.popup.extradata.EndTime;
                this.show_img(this.info.FaceData);
                this.isShowVideo = false;
                this.isShowCrop = true;
                this.isShowSnap = false;
                this.isReturnVideo = true;
            }
        },
        methods: {
            IndextoType(type) {
                this.isImportIndex = false;
                this.isLocalImport = !type;
                this.isShowVideo = type;
                if (type) {
                    //抓拍导入
                    this.base64_list = [];
                    this.info.FaceData = '';
                    this.capBtnShow = false;
                }
                this.lang_ImportType = this.lang[type ? 'i18n_faceImport_capture' : 'i18n_LocalImport'];
            },
            TypetoIndex() {
                this.isImportIndex = true;
                this.isShowCrop = false;
                this.isShowVideo = false;
                this.lang_ImportType = this.lang.i18n_ImportType;
                $('#big')
                    .cropper('destroy')
                    .attr('src', 'static/images/defaultface.png');
                this.base64_list = [];
                this.info.FaceData = '';
                //  this.ClearInfo();
            },
            return_stream() {
                //返回预览
                this.isShowVideo = true;
                this.base64_list = [];
                this.info.FaceData = '';
                this.capBtnShow = false;
                //  this.ClearInfo();
                //    $('#big').cropper('destroy').attr("src","static/images/defaultface.png");
            },
            ClearInfo() {
                this.info.Name = '';
                this.info.Describe = '';
                this.info.SrcFaceId = '';
                this.info.WiegandId = 0;
                this.info.FaceData = '';
                this.base64_list = [];
            },
            h5_choose_file(e) {
                msg(['h5导入选择文件！！！！', e.target, e.target.value]);
                let path = e.target.value;
                if (path.length > 0) {
                    // if (path.endsWith('jpg') || path.endsWith('jpeg')) {
                    let file = e.target.files[0];
                    if (file.size > 1024000) {
                        this.$notify.error(this.lang['i18n_PictooLarge']);
                        return;
                    }
                    let fileReader = new FileReader();
                    fileReader.onload = (ev) => {
                        this.needModifyPic = 1;
                        let base64 = ev.target.result;
                        this.show_img(base64);
                        this.get_features_info = this.lang.i18n_getPic_success;
                        let v1 = e.target.value.replace(/\\/g, '|');
                        //msg(v1)
                        let v2 = v1.replace(/\/\//g, '|');
                        //msg(v2)
                        let vec = v2.split('|');
                        // msg(vec)
                        let basename = vec.length > 0 ? vec[vec.length - 1] : '';
                        //msg(["basename",basename]);
                        if (basename.length > 0 && basename.indexOf('.') != -1) {
                            let obj = basename.split('.');
                            //  msg(["obj",obj]);
                            let name_arr = obj[0].split('_');
                            this.info.Name = name_arr[0];
                            this.info.Describe = name_arr[1];
                        }
                    };
                    fileReader.readAsDataURL(file);
                    /* } else {
					this.$notify.error(this.lang['i18n_faceTips']);
				} */
                }
            },
            choose_file() {
                var plugin = this.$store.getters.config_plugin;

                this.get_features_info = '';
                if (plugin) {
                    var path = plugin.OpenFileDialog({ OpenMode: 1 });
                    msg('choose file:' + path);
                    if (path.length > 0) {
                        msg('选择的是图片');
                        //    this.ClearInfo();
                        this.base64_list = [];
                        var result = plugin.TransFilesToBase64Str(
                            {
                                file_list: [path],
                            },
                            function(filename, base64str, status) {
                                if (status == 0) {
                                    this.needModifyPic = 1;
                                    this.show_img('data:image/jpg;base64,' + base64str);
                                    this.get_features_info = this.lang.i18n_getPic_success;

                                    let v1 = filename.replace(/\\/g, '|');
                                    //msg(v1)
                                    let v2 = v1.replace(/\/\//g, '|');
                                    //msg(v2)
                                    let vec = v2.split('|');
                                    // msg(vec)
                                    let basename = vec.length > 0 ? vec[vec.length - 1] : '';
                                    //msg(["basename",basename]);
                                    if (basename.length > 0 && basename.indexOf('.') != -1) {
                                        let obj = basename.substring(0, basename.lastIndexOf('.'));
                                        //  msg(["obj",obj]);
                                        let name_arr = obj.split('_');
                                        this.info.Name = name_arr[0];
                                        this.info.Describe = name_arr[1];
                                    }
                                } else if (status == 5) {
                                    this.isShowCrop = true;
                                    this.get_features_info = this.lang.i18n_AllIsDone;
                                } else {
                                    this.get_features_info = this.lang.i18n_getPic_failed;
                                }
                            }.bind(this)
                        );
                    }
                }
            },
            faceImport_capture() {
                this.isShowVideo = true;
                this.isShowSnap = true;
                this.isShowCrop = false;
                this.isReturnVideo = false;
                //    $('#big').cropper('destroy').attr("src","static/images/defaultface.png");
            },
            capture_from_stream() {
                this[`${this.plugin_type}_capture_from_stream`]();
            },

            ie_capture_from_stream() {
                //抓拍按钮

                var plugin = document.getElementById('face_capture');
                this.get_features_info = '';
                //    this.ClearInfo();

                if (plugin) {
                    var result = plugin.TransFilesToBase64Str(
                        { capture_from_stream: 1 },
                        function(filename, base64str, status) {
                            if (status == 0) {
                                this.needModifyPic = 1;
                                this.show_img('data:image/jpg;base64,' + base64str);
                                this.get_features_info = this.lang['i18n_getPic_success'];
                            } else if (status == 5) {
                                this.isShowVideo = false;
                                this.isShowCrop = true;
                                this.isShowSnap = false;
                                this.isReturnVideo = true;
                                this.get_features_info = this.lang.i18n_AllIsDone;
                            } else {
                                this.get_features_info = this.lang['i18n_getPic_failed'];
                            }
                        }.bind(this)
                    );
                }
            },
            h5_capture_from_stream() {
                //抓拍按钮
                let r_img = this.$store.getters.Face.capture_plugin.capture();
                //把图标base64编码后变成一段url字符串
                this.show_img(r_img.toDataURL('image/jpeg', 0.8));
                this.get_features_info = this.lang['i18n_getPic_success'];
                this.isShowVideo = false;
                this.isShowCrop = true;
                this.isShowSnap = false;
                this.isReturnVideo = true;
            },
            back_ShowVideo() {
                this.isShowVideo = true;
                this.isShowSnap = true;
                this.isShowCrop = false;
                this.isReturnVideo = false;
                //    $('#big').cropper('destroy');
            },
            show_img(ImageData) {
                $('#big')
                    .cropper('destroy')
                    .attr('src', ImageData)
                    .cropper(this.options);
                //添加模式是base64数据
                if (this.needModifyPic)
                {
                    let list = ImageData.split(',');
                    this.info.FaceData = list[1];
                }
            },
            img_undo() {
                if (this.base64_list) {
                    let img_base64 = this.base64_list.pop();
                    //  $('#big').cropper('replace',img_base64,false );
                    this.show_img(img_base64);
                }
            },
            send() {
                this.popup.refreshQueryList = false;
                // 参数过滤
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
                    return;
                }
                /*
                if (this.TargetName.trim().length == 0 || this.info.Name.trim().length == 0) {
                    this.$notify.error(this.lang['i18n_checkinput_tips2']);
                    return;
                }
                if (this.info.FaceData.trim().length == 0) {
                    this.$notify.error(this.lang['i18n_faceImport_single_select_picture']);
                    return;
                }
                */

                //this.info.WiegandId = parseInt(this.info.WiegandId);

                if (this.popup.isNeedModify) {
                    if (this.info.FaceData != this.popup.extradata.FaceData) {
                        this.info.NeedModifyFacePic = 1;
                    } else {
                        this.info.NeedModifyFacePic = 0;
                        delete this.info.FaceData;
                    }

                    this.info.SrcFaceId = this.info.FaceId;
                }
                msg('点击导入了，禁掉！！！');
                this.flag = true;
                this.info.Enable = this.info.Enable ? 1 : 0;
                // 添加人脸
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmFacePicture',
                        Type: this.popup.isNeedModify ? 4 : 0,
                        Ch: 1,
                        Data: { TargetName: this.TargetName, List: [this.info] },
                    })
                    .then((r) => {
                        if (r.Result == -655365) {
                            this.$store.dispatch('config_no_right');
                        } else {
                            if (r.Result == 0) {
                                // this.$store.commit('face/need_get_model', true);
                                if (r.Data.ResultList[0].Result == 0) {
                                    this.$notify.success(this.lang['i18n_saveok']);
                                    this.popup.visible = false;
                                    //this.$store.commit('face/isEigenValue', true); //刷新特征值页面
                                } else {
                                    let errStr;
                                    switch (r.Data.ResultList[0].Result) {
                                        case 0:
                                            errStr = this.lang.i18n_saveok;
                                            break;
                                        case -1:
                                            errStr = this.lang.i18n_ImportFailed;
                                            break;
                                        case -5:
                                            errStr = this.lang.i18n_InvalidParam;
                                            break;
                                        case -7:
                                            errStr = this.lang.i18n_NoMemory;
                                            break;
                                        case -10:
                                            errStr = this.lang.i18n_FaceBaseMaxount;
                                            break;
                                        case -11:
                                            errStr = this.lang.i18n_GetFeatureFailed;
                                            break;
                                        case -22:
                                            errStr = this.lang.i18n_HDFull;
                                            break;
                                        case -24:
                                            errStr = this.lang.i18n_Multiple_Faces;
                                            break;
                                        default:
                                            errStr = this.lang.i18n_savefailed;
                                            break;
                                    }
                                    this.$notify.error(errStr);
                                }
                            } else {
                                this.$notify.error(this.lang['i18n_savefailed']);
                            }
                            this.popup.refreshQueryList = true;
                            // this.$store.commit('temp_face/fresh_QueryList', true);
                        }
                        msg('导入完成了,解禁！！');
                        this.flag = false;
                    });
            },
            getFaceScheduleType() {
                this.$store.dispatch('request', {
                        url: 'goform/frmFaceSchedule',
                        Type: 5,
                        Ch: 1,
                        Data: { },
                    }).then((res) => {
                        if (res.Result == 0)
                        {
                            this.scheduleType = res.Data.SupportType;
                            msg(this.scheduleType);
                        }

                });
            },
        },
        /*beforeDestroy() {
            if (this.plugin_type == 'h5' && this.plugin) {
                this.plugin.stop();
                this.plugin.destroy();
            }
        },*/
        watch: {
            isShowVideo(newVal, oldVal) {
                if (newVal) {
                    $('#big')
                        .cropper('destroy')
                        .attr('src', 'static/images/defaultface.png');
                }
            },
        },

      
    };
</script>
