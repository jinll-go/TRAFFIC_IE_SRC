<template>
    <div class="batch_warp">
        <div :class="this.$store.getters.is_sanbao ? '' : 'w100'" style="padding-top:50px;">
            <div class="fl text_right" style="width:35%;"><label v-tr="i18n_PicturePath"></label>:&nbsp;</div>
            <div class="fl" style="width:65%;text-align: left;">
                <input type="text" class="textc" v-model="dir" style="width: 140px;" readonly="readonly" />
                <button @click="choose_dir" :class="button_style" style="width:100px;" v-tr="i18n_Browse"><!--���--></button>
                <button v-if="dir && dir.length && dir.length > 0" @click="batch_import" :class="button_style" style="width:100px;" v-tr="i18n_Import"></button>
            </div>
        </div>
        <div :class="this.$store.getters.is_sanbao ? '' : 'w100 pt20'" :style="{ 'padding-left': this.$store.getters.is_sanbao ? '180px' : '' }">
            <div class="fl text_right" style="width:35%"><label v-tr="i18n_PicNameFormat"></label>:&nbsp;</div>
            <div class="fl" style="width:65%;text-align: left">
                <label>{{ format_str }}</label>
                &nbsp;<label>.jpg</label>
            </div>
        </div>
        <div class="w100" v-if="false">
            <div>
                <label style="color: red">{{ `${this.cur_lang.i18n_GroupName}: ${this.cur_lang.i18n_str_range_error}[1,20]` }}</label
                ><br />
                <label style="color: red">{{
                    `${this.cur_lang.i18n_FaceID}: ${this.cur_lang.i18n_FaceId_error},${this.cur_lang.i18n_str_range_error}[1,36]`
                }}</label>
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
</template>

<script>
    import Vue from 'vue';
    import style from 'mixin/style';

    import { CheckFaceId } from 'common/util';
    export default {
        name: 'CVConfigFaceBatchModify',
        mixins: [style],
        inject: ['popup'],
        data() {
            return {
                dir: '',
                filepath_list: [],
                curPos: 0,
                successed_num: 0,
                failed_num: 0,
                msg_text: ' ',
                failed_list: [],
                cur_lang: this.lang,
                format_list: [],
                format_list_tips: [],
                flag: false,
                groupName: '',
                format_str: '',
            };
        },
        mounted() {
            this.format_str = this.cur_lang.i18n_GroupName + '_' + this.cur_lang.i18n_FaceID;
        },
        methods: {
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

                if (confirm(this.lang['i18n_batchImpWarn'])) {
                    this.curPos = 0; //当前正在上传
                    this.successed_num = 0; //上传成功的数目
                    this.failed_num = 0; //上传失败的数目
                    this.failed_list = []; //上传失败都文件名列表
                    this.popup.isBatchImporting = true;

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
                            this.msg_text = `${this.cur_lang.i18n_Importing}     ${this.successed_num + this.failed_num} / ${this.filepath_list.length} `;

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
                                                Type: 4,
                                                Ch: 1,
                                                Data: { TargetName: this.groupName, List: tmplist },
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
                                                            errStr = this.cur_lang.i18n_ImportFailed;
                                                            break;
                                                        case -5:
                                                            errStr = this.cur_lang.i18n_InvalidParam;
                                                            break;
                                                        case -7:
                                                            errStr = this.cur_lang.i18n_NoMemory;
                                                            break;
                                                        case -10:
                                                            errStr = this.cur_lang.i18n_FaceBaseMaxount;
                                                            break;
                                                        case -11:
                                                            errStr = this.cur_lang.i18n_GetFeatureFailed;
                                                            break;
                                                        case -21:
                                                            errStr = this.cur_lang.i18n_GroupNameNull;
                                                            break;
                                                        case -22:
                                                            errStr = this.cur_lang.i18n_HDFull;
                                                            break;
                                                        case -24:
                                                            errStr = this.cur_lang.i18n_Multiple_Faces;
                                                            break;
                                                        default:
                                                            errStr = this.cur_lang.i18n_ImportFailed;
                                                    }
                                                    this.failed_list.push(`${tmplist[index].fileName} ${errStr}`);
                                                }
                                            });
                                        } else {
                                            this.failed_num += tmplist.length;
                                            tmplist.forEach((item, index) => {
                                                this.failed_list.push(`${tmplist[index].fileName} ${this.cur_lang.i18n_savefailed}`);
                                            });
                                        }
                                    } else {
                                        this.failed_num++;
                                        this.failed_list.push(`${r.image_list[image_list_offset].fileName} ${this.cur_lang.i18n_PictooLarge}`);
                                        image_list_offset++;
                                    }
                                    // this.successed_num += successed_num;
                                    // this.failed_num += failed_num;
                                    msg(['NNNum', this.successed_num, this.failed_num, num_per_req]);
                                    this.msg_text = `${this.cur_lang.i18n_Importing}     ${this.successed_num + this.failed_num} / ${
                                        this.filepath_list.length
                                    } `;
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
                            this.msg_text = this.cur_lang.i18n_AllIsDone;
                            this.popup.isBatchImporting = false;
                            // this.$store.commit('face/isBatchImporting', false);

                            this.$notify.success(this.cur_lang.i18n_successNum + this.successed_num + ', ' + this.cur_lang.i18n_failedNum + this.failed_num);

                            msg('导入完成1111');
                            //      this.$store.commit("face/isShowDialog",false);

                            if (this.flag) {
                                this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', Type: 1, Data: { Enable: 1 } });
                                this.$store.commit('face/isNeedEnableFace', !this.flag);
                            }
                        } else {
                            if (!this.popup.isBatchImporting) {
                                this.$notify.success(
                                    this.cur_lang.i18n_successNum + this.successed_num + ', ' + this.cur_lang.i18n_failedNum + this.failed_num,
                                );
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
                                this.msg_text = this.cur_lang.i18n_WifiStatus_Scanning + ': ' + filename;
                                {
                                    // parse filename
                                    let v1 = filename.replace(/\\/g, '|');
                                    let v2 = v1.replace(/\/\//g, '|');
                                    let vec = v2.split('|');
                                    let basename = vec.length > 0 ? vec[vec.length - 1] : '';
                                    msg(basename);
                                    if (basename.length > 0 && basename.lastIndexOf('.') != -1) {
                                        let tmpObj = basename.substring(0, basename.lastIndexOf('.'));
                                        this.groupName = tmpObj.substring(0, basename.lastIndexOf('_'));
                                        let tmp_faceId = tmpObj.substring(basename.indexOf('_'), basename.lastIndexOf('.'));
                                        item_face.SrcFaceId = tmp_faceId.substring(1, basename.lastIndexOf('.'));

                                        item_face.fileName = basename;
                                        msg(['obj', tmpObj, this.groupName, tmp_faceId, item_face.SrcFaceId, item_face.fileName]);
                                    }
                                }

                                item_face.FaceData = base64str;
                                item_face.NeedModifyFacePic = 1;
                                image_list.push(item_face);
                                msg(['555', image_list, item_face]);
                            } else if (status == 5) {
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
        },

        computed: {},
    };
</script>
