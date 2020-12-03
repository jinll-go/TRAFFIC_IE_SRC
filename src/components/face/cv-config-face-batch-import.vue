<template>
    <div class="batch_warp">
        <div v-if="isEditFormat">
            <div class="w100">
                <label v-tr="i18n_Separator"></label>:&nbsp;
                <input class="textc" type="text" style="width: 50px" v-model="split_str" v-validator:NOVOID:Separator />&nbsp;&nbsp;
                <input type="checkbox" id="name" v-model="format_name" /><label for="name" v-tr="i18n_Name"></label>&nbsp;&nbsp;
                <input type="checkbox" id="describe" v-model="format_describe" /><label for="describe" v-tr="i18n_Describe"></label>&nbsp;&nbsp;
                <input type="checkbox" id="faceId" v-model="format_faceId" /><label for="faceId" v-tr="i18n_FaceID"></label>&nbsp;&nbsp;
                <input type="checkbox" id="wiegandId" v-model="format_wiegandId" /><label for="wiegandId" v-tr="i18n_wiegandId"></label>
            </div>
            <div class="w100" style="padding-top:10px;">
                <div class="fl text_right" style="width:35%"><label v-tr="i18n_PicNameFormat"></label>:&nbsp;</div>
                <div class="fl" style="width:65%;text-align: left">
                    <input type="text" style="width: 240px" v-model="format_str" class="w100 textc" readonly />
                    &nbsp;<label>.jpg</label>
                </div>
            </div>
            <div class="w100" style="padding-top:10px;">
                <button :class="button_style" style="width: 88px;" v-tr="i18n_save" @click="btn_save"></button>&nbsp;&nbsp;
                <button :class="button_style" style="width: 88px;" v-tr="i18n_return" @click="btn_back">back</button>
            </div>
        </div>
        <div v-else>
            <div class="w100" style="padding-top:60px;">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_GroupName"></label>:&nbsp;</div>
                <div class="fl" style="width:60%">
                    <input type="text" style="width: 140px" v-model="TargetName" class="w100 textc" :disabled="!!TargetName" />
                </div>
            </div>

            <div class="w100" style="padding-top:10px;">
                <div class="fl text_right" style="width:40%">
                    <label v-tr="i18n_PicturePath"><!--图片路径--></label>:&nbsp;
                </div>
                <div class="fl" style="width:60%;text-align: left;" v-if="plugin_type == 'h5'">
                    <div class="fl">
                        <input type="text" class="textc" v-model="dir" style="width: 140px;" readonly="readonly" />
                    </div>
                    <div class="fl pl10">
                        <input
                            type="file"
                            id="selfile1"
                            style="display:none;"
                            @change="h5_choose_dir"
                            accept="image/*"
                            webkitdirectory
                            multiple
                            :disabled="this.popup.isBatchImporting"
                        />
                        <label :class="button_style" style="display:inline-block; width:80px;height:24px;" for="selfile1" v-tr="i18n_Browse"></label>
                        <button
                            v-if="filepath_list && filepath_list.length > 0"
                            @click="batch_import"
                            :class="button_style"
                            style="width:80px;"
                            v-tr="i18n_Import"
                        >
                        </button>
                    </div>
                        <!--导入-->
                </div>

                <!-- plugin_type=ie显示 -->
                <div class="fl" style="width:60%;text-align: left" v-if="plugin_type == 'ie'">
                    <input type="text" class="textc" v-model="dir" style="width: 140px;" readonly="readonly" />
                    <button @click="choose_dir" :class="button_style" style="width:80px;" v-tr="i18n_Browse"></button>
                    <button
                        v-if="dir && dir.length && dir.length > 0"
                        @click="batch_import"
                        :class="button_style"
                        style="width:100px;"
                        v-tr="i18n_Import"
                    ></button>
                </div>
            </div>

            <div class="w100" style="padding-top:10px;">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_PicNameFormat"></label>:&nbsp;</div>
                <div class="fl" style="width:60%;text-align: left">
                    <div class="fl">
                        <input type="text" class="textc" style="width:140px" v-model="format_str" readonly="readonly" />
                    </div>
                    <div class="fl pl10">
                        <button :class="button_style" style="width:80px;" v-tr="i18n_modify" @click="btn_edit" :disabled="this.popup.isBatchImporting"></button>
                    </div>
                </div>
                <!---
                <div v-for="item in format_list">
                    <label style="color: red">{{ format_list_tips[item] }}</label>
                </div>
                --->
            </div>

            <div class="w100" style="padding-top:10px;">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_wiegandAssignType"></label>:&nbsp;</div>
                <div class="fl" style="width:60%;text-align: left">
                    <div class="fl">
                        <select class="textc" style="width:140px" v-model="wiegandAssignType">
                            <option :value="0" v-tr="i18n_CommonWiegand"></option>
                            <option :value="1" v-tr="i18n_wiegandManualInput"></option>
                            <option :value="2" v-tr="i18n_wiegandAutoAssign"></option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="w100" style="padding-top:10px;">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_wiegandId"></label>:&nbsp;</div>
                <div class="fl" style="width:60%; text-align: left">
                    <input type="text" style="width: 140px" v-model="wiegandId" class="w100 textc" :disabled="wiegandAssignType!=1" />
                </div>
            </div>

            <div class="w100" style="padding-top:10px;" v-if="TargetType==4">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_beginTime"></label>:&nbsp;</div>
                <div class="fl" style="width:60%;text-align: left"><input type="datetime" style="width:140px;" class="w100 textc" v-model="startTime" /></div>
            </div>

            <div class="w100" style="padding-top:10px;" v-if="TargetType==4">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_endTime"></label>:&nbsp;</div>
                <div class="fl" style="width:60%;text-align: left"><input type="datetime" style="width:140px;" class="w100 textc" v-model="endTime" /></div>
            </div>

            <div class="w100" style="padding-top:10px;">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_Enable"></label>:&nbsp;</div>
                <div class="fl pt6" style="width:60%;text-align: left"><input type="checkbox" style="width:30px;" class="w100" v-model="enable" /></div>
            </div>

            <div class="w100" style="padding-top:10px;">
                <div class="fl text_right" style="width:40%"><label v-tr="i18n_FaceScheduleType"></label>:&nbsp;</div>
                <div class="fl" style="width:60%;text-align: left">
                    <div class="fl">
                        <select class="textc" style="width:140px" v-model="scheduleType">
                            <option :value="0" v-tr="i18n_no_enable"></option>
                            <option v-for="(type, index) in supportScheduleTypes" :value="type">{{type}}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="w100 pt10 text_center">
                <label>{{ msg_text }}</label>
            </div>
            <div class="w100 fl text_center" style="overflow:auto;height:220px;">
                <div class="w100 text_center" v-for="item in failed_list">
                    <label>{{ item }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import style from 'mixin/style';

    import { CheckFaceId, basename, ImgsAcceptedByImport } from 'common/util';
    export default {
        name: 'CVConfigFaceBatchImport',
        mixins: [style],
        inject: ['popup'],
        data() {
            return {
                TargetName: '',
                TargetType: 1,
                dir: '',
                filepath_list: [], //文件夹 路径列表

                curPos: 0, //当前正在上传
                successed_num: 0, //上传成功的数目
                failed_num: 0, //上传失败的数目

                msg_text: ' ',

                failed_list: [], //上传失败都文件名列表

                format_list: [],
                format_list_tips: [],
                flag: false, //是否要恢复 人脸检测配置的Enable状态
                isEditFormat: false,
                split: '',
                wiegandAssignType: 0,
                wiegandId: 0,
                scheduleType: 0,
                supportScheduleTypes: [],
                enable: 1,
                startTime: '1970-01-01 00:00:00',
                endTime: '2038-01-19 03:14:07',
            };
        },
        created() {
            //获取已添加的调度类型
            this.getFaceScheduleType();
        },
        mounted() {
            this.format_list_tips = {
                name: `${this.lang.i18n_Name}: ${this.lang.i18n_str_range_error}[1,20]`,
                describe: `${this.lang.i18n_Describe}: ${this.lang.i18n_str_range_error}[1,40]`,
                wiegandId: `${this.lang.i18n_numeration}: ${this.lang.i18n_number_error}${this.lang.i18n_range_error}[1,65535]`,
                faceId: `${this.lang.i18n_FaceID}: ${this.lang.i18n_FaceId_error},${this.lang.i18n_str_range_error}[1,36]`,
            };

            this.TargetName = this.popup.extradata.TargetName;
            this.TargetType = this.popup.extradata.TargetType;
            this.split = this.$store.getters.Face.face_format.split;
            $.extend(true, this.format_list, this.$store.getters.Face.face_format.format_list);

            //初始化起止时间为当前时间
            var curDateTime = new Date();
            this.startTime = curDateTime.getFullYear() + '-'
                + (curDateTime.getMonth() + 1) + '-'
                + curDateTime.getDate() + ' '
                + curDateTime.getHours() + ':'
                + curDateTime.getMinutes() + ':'
                + curDateTime.getSeconds();
            this.endTime = curDateTime.getFullYear() + '-'
                + (curDateTime.getMonth() + 1) + '-'
                + curDateTime.getDate() + ' '
                + '23' + ':'
                + '59' + ':'
                + '59';
        },
        methods: {
            h5_choose_dir(e) {
                // msg(['h5 choose dir!!!', e, e.target.files, e.target.files.length]);
                this.filepath_list = [];

                for (let i = 0; i < e.target.files.length; i++) {
                    let checkFile = ImgsAcceptedByImport(e.target.files[i].name); //检测文件格式
                    let tmpArr = e.target.files[i].webkitRelativePath; //获取图片路径
                    let num = tmpArr.split('/').length - 1; //判断路径中 '/'出现的次数，从而判断是文件层级 过滤掉非一级目录中的文件

                    if (checkFile && num === 1) {
                        this.filepath_list.push(e.target.files[i]);
                    }
                    // msg(['出现几次', checkFile, tmpArr, num, this.filepath_list]);
                }
                if (this.filepath_list.length > 0) {
                    let tmppath = this.filepath_list[0].webkitRelativePath || '';
                    this.dir = tmppath.substring(0, tmppath.length - this.filepath_list[0].name.length - 1);
                } else {
                    //提示用户选择的文件夹中没有任何jpeg jpg
                    // this.$notify.error(this.lang['i18n_checkinput']);
                }
            },
            choose_dir() {
                if (this.popup.isBatchImporting) return;
                this.dir = '';

                this.failed_list = [];

                let plugin = this.$store.getters.config_plugin;

                if (plugin) {
                    this.dir = plugin.OpenFileDialog({ OpenMode: 0 });
                    msg('choose dir:' + this.dir);
                    if (this.dir.length > 0) {
                        let result = plugin.ShowFolder({
                            path: this.dir,
                            filetype: ['jpeg', 'jpg', 'JPEG', 'JPG'],
                        });

                        msg(result);
                        if (result && result.files && result.files.length) {
                            this.filepath_list = result.files.map((item) => {
                                return this.dir + '//' + item;
                            });
                        }
                    }
                }
            },
            batch_import() {
                if (this.popup.isBatchImporting) return;
                if (this.TargetName.trim().length == 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
                    return;
                }
                if (this.filepath_list.length == 0) {
                    msg('filepath_list.length == 0');
                    return;
                }
                this.popup.refreshQueryList = false;
                if (confirm(this.lang['i18n_batchImpWarn'])) {
                    this.curPos = 0; //当前正在上传
                    this.successed_num = 0; //上传成功的数目
                    this.failed_num = 0; //上传失败的数目
                    this.failed_list = []; //上传失败都文件名列表
                    this.popup.isBatchImporting = true;

                    /*
                    //批量上传前关掉 底层 检测 抓拍和识别
                    this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', Type: 0, Data: {} }).then((_r) => {
                        if (_r.Result == 0) {
                            this.flag = _r.Data.Enable ? true : false;
                            this.$store.commit('face/isNeedEnableFace', this.flag);
                            if (this.flag) {
                                this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', Type: 1, Data: { Enable: 0 } });
                            }
                        }
                    });
                    */

                    let autorun = async function(data) {
                        //分解数据，划分任务列表
                        let range_len = 200; //一次处理200张图
                        let total_size = data.length;
                        let transBase64_failed_num = 0;
                        let len = total_size % range_len == 0 ? parseInt(total_size / range_len) : parseInt(total_size / range_len) + 1; //需要导多少次

                        for (let i = 0; i < len; ++i) {
                            let r = {};
                            if (this.plugin_type == 'h5') {
                                r = { image_list: [], failed_list: [] };
                                let min = Math.min((i + 1) * range_len, total_size); //小小取小
                                for (let j = i * range_len; j < min; j++) {
                                    let c = await this.H5CreateTransFileToBase64Promise(data[j]);
                                    r.image_list.push(c); //总共需要处理的图片数量
                                }
                            } else {
                                let subar = data.slice(i * range_len, (i + 1) * range_len);

                                //预处理 file 转换成base64
                                r = await this.CreateTransFileToBase64Promise(subar);
                            }
                            transBase64_failed_num += r.failed_list.length;

                            let num_per_req = 5; //一个请求 发送5个图片
                            let image_list_offset = 0; //数组偏移个数
                            //  let len = (r.image_list.length % num_per_req) == 0?parseInt(r.image_list.length / num_per_req):(parseInt(r.image_list.length / num_per_req) + 1);//发送次数

                            let len = 0; //数据长度
                            let tmplist = []; // 分段处理
                            this.msg_text = `${this.lang.i18n_Importing}     ${this.successed_num + this.failed_num} / ${this.filepath_list.length} `;

                            while (1) {
                                if (image_list_offset < r.image_list.length) {
                                    //数据片段处理
                                    len += r.image_list[image_list_offset].FaceData.length;
                                }
                                if (len > 1000000 || tmplist.length >= 50 || image_list_offset === r.image_list.length) {
                                    //post data
                                    num_per_req = tmplist.length;
                                    msg(['post num', num_per_req]);
                                    if (num_per_req > 0) {
                                        let rl;
                                        try {
                                            rl = await this.$store.dispatch('request', {
                                                url: 'goform/frmFacePicture',
                                                Type: 0,
                                                Ch: 1,
                                                Data: { TargetName: this.TargetName, List: tmplist },
                                                TimeOut: 60000,
                                            });
                                        } catch (e) {
                                            await this.sleep(20000);
                                            continue;
                                        }

                                        if (rl.Result == 0) {
                                            rl.Data.ResultList.forEach((item, index) => {
                                                if (item.Result == 0) {
                                                    this.successed_num++;
                                                } else {
                                                    this.failed_num++;

                                                    let errStr;
                                                    switch (item.Result) {
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
                                                        case -21:
                                                            errStr = this.lang.i18n_GroupNameNull;
                                                            break;
                                                        case -22:
                                                            errStr = this.lang.i18n_HDFull;
                                                            break;
                                                        case -24:
                                                            errStr = this.lang.i18n_Multiple_Faces;
                                                            break;
                                                        default:
                                                            errStr = this.lang.i18n_ImportFailed;
                                                    }
                                                    this.failed_list.push(`${tmplist[index].fileName} ${errStr}`);
                                                }
                                            });
                                        } else {
                                            this.failed_num += tmplist.length;
                                            tmplist.forEach((item, index) => {
                                                this.failed_list.push(`${tmplist[index].fileName} ${this.lang.i18n_savefailed}`);
                                            });
                                        }
                                    } else {
                                        this.failed_num++;
                                        this.failed_list.push(`${r.image_list[image_list_offset].fileName} ${this.lang.i18n_PictooLarge}`);
                                        image_list_offset++;
                                    }
                                    // this.successed_num += successed_num;
                                    // this.failed_num += failed_num;
                                    msg(['NNNum', this.successed_num, this.failed_num, num_per_req]);
                                    this.msg_text = `${this.lang.i18n_Importing}     ${this.successed_num + this.failed_num} / ${this.filepath_list.length} `;
                                    if (!this.popup.isBatchImporting) break; //用户终止

                                    if (image_list_offset === r.image_list.length) break; //数据片段处理完成
                                    len = 0;
                                    tmplist = [];
                                } else {
                                    tmplist.push(r.image_list[image_list_offset]);
                                    image_list_offset++;
                                }
                            }

                            if (!this.popup.isBatchImporting) break;
                        }
                        msg([this.successed_num, this.failed_list.length, total_size, transBase64_failed_num]);
                        if (this.successed_num + this.failed_list.length == total_size - transBase64_failed_num) {
                            this.msg_text = this.lang.i18n_AllIsDone;
                            this.popup.isBatchImporting = false;
                            // this.$store.commit('face/isBatchImporting', false);

                            this.$notify.success(this.lang.i18n_successNum + this.successed_num + ', ' + this.lang.i18n_failedNum + this.failed_num);

                            msg('导入完成1111');
                            //      this.$store.commit("face/isShowDialog",false);

                            if (this.flag) {
                                this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', Type: 1, Data: { Enable: 1 } });
                                this.$store.commit('face/isNeedEnableFace', !this.flag);
                            }
                        } else {
                            if (!this.popup.isBatchImporting) {
                                this.$notify.success(this.lang.i18n_successNum + this.successed_num + ', ' + this.lang.i18n_failedNum + this.failed_num);
                            }
                        }
                    }.bind(this);

                    autorun(this.filepath_list);
                }
            },
            sleep(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            },
            H5CreateTransFileToBase64Promise(file) {
                msg(['CreateTransFileToBase64Promise', file]);
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        let item_face = {};
                        let obj = file.name.substring(0, file.name.lastIndexOf('.'));
                        let name_arr = obj.split(this.split);
                        item_face.fileName = file.name;
                        msg(['name_arr', name_arr]);
                        this.format_list.forEach((item, index) => {
                            msg(['item', item]);
                            switch (item) {
                                case 'name':
                                    item_face.Name = name_arr[index] || '';
                                    if (item_face.Name.length > 20) {
                                        item_face.Name = item_face.Name.substr(0, 20);
                                    }
                                    break;
                                case 'describe':
                                    item_face.Describe = name_arr[index] || '';
                                    if (item_face.Describe.length > 40) {
                                        item_face.Describe = item_face.Describe.substr(0, 40);
                                    }
                                    break;
                                case 'faceId':
                                    item_face.FaceId = name_arr[index] || '';
                                    if (item_face.FaceId.length > 36 || !CheckFaceId(item_face.FaceId)) {
                                        item_face.FaceId = '';
                                    }
                                    break;
                                case 'wiegandId':
                                    item_face.WiegandId = parseInt(name_arr[index]) || 1;
                                    if (item_face.WiegandId < 0 || item_face.WiegandId > 65535) {
                                        item_face.WiegandId = 1;
                                    }
                                    break;
                            }
                        });
                        let base64 = e.target.result.split(',');
                        item_face.FaceData = base64[1];
                        item_face.WiegandId = this.wiegandId;
                        item_face.WiegandAssignType = this.wiegandAssignType;
                        item_face.ScheduleType = this.scheduleType;
                        this.enable = this.enable ? 1 : 0;
                        item_face.Enable = this.enable;
                        item_face.StartTime = this.startTime;
                        item_face.EndTime = this.endTime;
                        resolve(item_face);
                    };
                    reader.readAsDataURL(file);
                });
            },
            CreateTransFileToBase64Promise(file_list) {
                return new Promise((resolve, reject) => {
                    let image_list = [];
                    let failed_list = [];
                    let plugin = this.$store.getters.config_plugin;

                    if (plugin) {
                        plugin.TransFilesToBase64Str({ file_list }, (filename, base64str, status) => {
                            msg(['插件转base64', filename, base64str, status]);
                            let item_face = {};
                            if (status == 0) {
                                this.msg_text = this.lang.i18n_WifiStatus_Scanning + ': ' + filename;
                                {
                                    // parse filename
                                    let v1 = filename.replace(/\\/g, '|');
                                    let v2 = v1.replace(/\/\//g, '|');
                                    let vec = v2.split('|');
                                    let basename = vec.length > 0 ? vec[vec.length - 1] : '';
                                    msg(basename);
                                    if (basename.length > 0 && basename.lastIndexOf('.') != -1) {
                                        let obj = basename.substring(0, basename.lastIndexOf('.'));
                                        msg(['obj', obj]);
                                        let name_arr = obj.split(this.split);

                                        msg(['name_arr和format_list', name_arr, this.format_list]);
                                        this.format_list.forEach((item, index) => {
                                            msg(['item', item]);
                                            switch (item) {
                                                case 'name':
                                                    item_face.Name = name_arr[index] || '';
                                                    if (item_face.Name.length > 20) {
                                                        item_face.Name = item_face.Name.substr(0, 20);
                                                    }
                                                    break;
                                                case 'describe':
                                                    item_face.Describe = name_arr[index] || '';
                                                    if (item_face.Describe.length > 40) {
                                                        item_face.Describe = item_face.Describe.substr(0, 40);
                                                    }
                                                    break;
                                                case 'faceId':
                                                    item_face.FaceId = name_arr[index] || '';
                                                    if (item_face.FaceId.length > 36 || !CheckFaceId(item_face.FaceId)) {
                                                        item_face.FaceId = '';
                                                    }
                                                    break;
                                                case 'wiegandId':
                                                    item_face.WiegandId = parseInt(name_arr[index]) || 1;
                                                    if (item_face.WiegandId < 0 || item_face.WiegandId > 65535) {
                                                        item_face.WiegandId = 1;
                                                    }
                                                    break;
                                            }
                                        });
                                        item_face.fileName = basename;
                                    }
                                }
                                item_face.FaceData = base64str;
                                item_face.WiegandId = this.wiegandId;
                                item_face.WiegandAssignType = this.wiegandAssignType;
                                item_face.ScheduleType = this.scheduleType;
                                this.enable = this.enable ? 1 : 0;
                                item_face.Enable = this.enable;
                                item_face.StartTime = this.startTime;
                                item_face.EndTime = this.endTime;
                                image_list.push(item_face);
                            } else if (status == 5) {
                                //  this.msg_text = this.lang.i18n_AllIsDone + this.lang.i18n_PictureNum + this.image_list.length;

                                resolve({
                                    image_list,
                                    failed_list,
                                });
                            } else {
                                failed_list.push(filename);
                            }
                        });
                    }
                });
            },
            btn_edit() {
                this.isEditFormat = true;
            },
            btn_save() {
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
                    return;
                }
                let FacePicFormat = this.format_list.join(this.split);
                /*
                this.$store.dispatch('request', { url: 'goform/frmLocalSettings', Type: 1, Data: { FacePicFormat } }).then((r) => {
                    if (r.Result == 0) {
                        this.$store.commit('face/Format', { split: this.split, format_list: this.format_list });
                        this.$notify.success(this.lang['i18n_saveok']);
                    } else {
                        this.$notify.error(this.lang['i18n_savefailed']);
                    }
                });
                */

                this.isEditFormat = false;

            },
            btn_back() {
                this.isEditFormat = false;
                this.split = this.$store.getters.Face.face_format.split;
                this.format_list = [];
                $.extend(true, this.format_list, this.$store.getters.Face.face_format.format_list);
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
                        this.supportScheduleTypes = res.Data.SupportType;
                    }

                });
            },
        },
        computed: {
            split_str: {
                get: function() {
                    return this.split;
                },
                set: function(v) {
                    this.split = v;
                },
            },
            format_name: {
                get: function() {
                    return this.format_list.includes('name');
                },
                set: function(v) {
                    if (v) {
                        this.format_list.push('name');
                    } else {
                        this.format_list.splice(
                            this.format_list.findIndex((item) => item == 'name'),
                            1
                        );
                    }
                },
            },
            format_describe: {
                get: function() {
                    return this.format_list.includes('describe');
                },
                set: function(v) {
                    if (v) {
                        this.format_list.push('describe');
                    } else {
                        this.format_list.splice(
                            this.format_list.findIndex((item) => item == 'describe'),
                            1
                        );
                    }
                },
            },
            format_faceId: {
                get: function() {
                    return this.format_list.includes('faceId');
                },
                set: function(v) {
                    if (v) {
                        this.format_list.push('faceId');
                    } else {
                        this.format_list.splice(
                            this.format_list.findIndex((item) => item == 'faceId'),
                            1
                        );
                    }
                },
            },
            format_wiegandId: {
                get: function() {
                    return this.format_list.includes('wiegandId');
                },
                set: function(v) {
                    if (v) {
                        this.format_list.push('wiegandId');
                    } else {
                        this.format_list.splice(
                            this.format_list.findIndex((item) => item == 'wiegandId'),
                            1
                        );
                    }
                },
            },
            format_str() {
                return this.format_list
                    .map((item) => {
                        switch (item) {
                            case 'name':
                                return this.lang.i18n_Name;
                            case 'describe':
                                return this.lang.i18n_Describe;
                            case 'faceId':
                                return this.lang.i18n_FaceID;
                            case 'wiegandId':
                                return this.lang.i18n_numeration;
                        }
                    })
                    .join(this.split);
            },
        },
    };
</script>
