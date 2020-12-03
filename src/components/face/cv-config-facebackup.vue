<template>
    <div class="main_con_facebackup_container clearfix">
        <div class="main_con_top">
            <div class="fl pl10 bold">
                <label v-tr="i18n_faceBackup">人脸库备份</label>
            </div>
        </div>

        <div class="main_con_mid">
            <div class="w100 pt10 text_center">
                <label :class="button_style" style="width:135px;display: block;margin: 0 auto;cursor: pointer" @click="faceBackup" v-tr="i18n_faceBackup">
                    人脸库备份
                </label>
            </div>

            <input type="file" id="selfile_backup" name="selfile_backup" style="display: none;" @change="getfile" multiple="multiple" accept=".bin"/>
            <div class="w100 pt10 text_center">
                <label
                    :class="button_style"
                    for="selfile_backup"
                    style="width:135px;display: block;margin: 0 auto;cursor: pointer"
                    v-show="ImportStatus == 0 || ImportStatus == 3"
                    v-tr="i18n_faceRestore"
                >
                </label>
            </div>
            <div class="w100 text_center">
                <button
                        :class="button_style"
                        style="width:135px;display: block;margin: 0 auto;cursor: pointer"
                        @click="cancelImport"
                        v-show="ImportStatus == 1 || ImportStatus == 2"
                        v-tr="i18n_cancel"
                >
                </button>
            </div>
            <div class="w100 text_center" v-show="OperateMode == 1">
                <div v-show="ImportStatus == 1">正在上传 {{ FileName }}...</div>
                <div v-show="ImportStatus == 2">
                    <p>当前导入文件： {{ FileName }}</p>
                    <p>模板数： {{ TotalFaceNum }}</p>
                    <p>正在导入第 {{ CurrentFaceNum }} 个模板</p>
                    <p>成功导入人脸数：{{ SuccessFaceNum }} </p>
                </div>
                <div v-show="ImportStatus==3">
                    <p>人脸库导入完成！</p>
                </div>

            </div>
        </div>

        <div class="main_con_bot"></div>
    </div>
</template>

<script>
    import { wsseHeader } from 'common/wsse';
    import style from 'mixin/style';
    export default {
        name: 'CVConfigFaceBackup',
        mixins: [style],
        data() {
            return {
                OperateMode: 0,
                FileList: [],
                CurFileIndex: 0,
                FileName: '',
                TotalFaceNum: 0,
                CurrentFaceNum: 0,
                SuccessFaceNum: 0,
                ImportStatus: 0,
            };
        },
        mounted() {},
        methods: {
            faceBackup() {
                this.OperateMode = 0;//导出模式
                this.$loading.show = true;
                //创建定时器循环查询导出进度
                var export_timer = setInterval(() => {
                    this.$store.dispatch('request', { url: 'goform/frmGetFaceGroupFile', Type: 0, Data: {} }).then((r) => {
                        if (r.Result == 0) {
                            //隐藏加载界面
                            this.$loading.show = false;

                            //关闭人脸导出定时器
                            clearInterval(export_timer);

                            // document.getElementById("export_download").src = r.Data.FileName;
                            let iframe = document.getElementById('facemodelbackup_download');
                            if (iframe) {
                                iframe.parentNode.removeChild(iframe);
                            }
                            let elemIF = document.createElement('iframe');
                            elemIF.id = 'facemodelbackup_download';
                            elemIF.src = window.location.origin + '/' + r.Data.CompressPath;
                            elemIF.style.display = 'none';

                            document.body.appendChild(elemIF);

                            let timer = setInterval(() => {
                                let ifr = document.getElementById('facemodelbackup_download');
                                msg(['ifr', ifr]);
                                let iframeDoc;
                                let error_list = [];
                                try {
                                    iframeDoc = ifr.contentDocument;
                                } catch (e) {
                                    msg(['catch contentDocument', e]);
                                    error_list[0] = e;
                                }

                                if (error_list[0]) {
                                    try {
                                        iframeDoc = ifr.contentWindow.document;
                                    } catch (e) {
                                        msg(['catch contentWindow.document', e]);
                                        error_list[1] = e;
                                    }
                                }
                                if (error_list[1]) {
                                    try {
                                        iframeDoc = ifr.document;
                                    } catch (e) {
                                        msg(['catch document', e]);
                                        return;
                                    }
                                }
                                msg(['iframeDoc', iframeDoc]);
                                if (iframeDoc) {
                                    msg('iframeDoc is not null.');
                                    if (iframeDoc.readyState) {
                                        msg(['readyState is not null.', iframeDoc.readyState]);
                                        // Check if loading is complete
                                        if (iframeDoc.readyState == 'complete' || iframeDoc.readyState == 'interactive') {
                                            this.deleteTempFile();
                                            clearInterval(timer);
                                        }
                                    }
                                }
                            }, 4000);

                            //    this.$notify.success(this.$store.getters.current_language["i18n_export_success"]);
                        }
                        else if (r.Result == 2)
                        {
                            //正在处理
                        }
                        else {
                            this.$notify.error(this.$store.getters.current_language['i18n_export_error']);
                        }
                    });
                }, 2000);
            },
            cancelImport() {
                if (this.ImportStatus == 1 || this.ImportStatus == 2) {
                    //取消导入
                    this.$store.dispatch('request', {
                        url: 'goform/frmFaceGroupFileUpRequest',
                        Type: 3,
                        Data: {}
                    });

                    this.ImportStatus = 0;
                    $("#selfile_backup").val("");
                }
            },
            faceImport(fileObject) {
                this.FileName = fileObject.name;

                //第1步，查询设备硬盘空间是否充足
                this.$store.dispatch('request', {
                    url: 'goform/frmFaceGroupFileUpRequest',
                    Type: 0,
                    Data: {
                        FileSize: fileObject.size
                    }
                }).then((res) => {
                    if (res.Result == 0) {
                        msg("disk has enough space, start upload file " + this.FileName);
                        this.ImportStatus = 1;
                        var fd = new FormData();
                        fd.append("file", fileObject);
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", "/goform/upldForm", false);
                        xhr.send(fd);

                        msg('upload bin file complete, start import face!');
                        this.$store.dispatch('request', {
                            url: 'digest/frmFaceGroupFileStartUp',
                            Type: 0,
                            Data: {}
                        }).then((res) => {
                            if (res.Result == 0) {
                                this.ImportStatus = 2;//正在导入
                                //第4步，循环获取人脸库导入进度
                                var import_status_timer = setInterval(() => {
                                    //手动取消了导入
                                    if (this.ImportStatus == 0) {
                                        clearInterval(import_status_timer);
                                        return ;
                                    }

                                    this.$store.dispatch('request', {
                                        url: 'digest/frmFaceGroupFileUpRequest',
                                        Type: 1,
                                        Data: {}
                                    }).then((res) => {
                                        if (res.Result == -1) {
                                            //正在导入
                                            this.TotalFaceNum = res.Data.TotalNum;
                                            this.CurrentFaceNum = res.Data.CurNum;
                                            this.SuccessFaceNum = res.Data.SuccessNum;
                                        } else if (res.Result == 0) {
                                            this.CurFileIndex++;

                                            clearInterval(import_status_timer);

                                            //导入下一个文件
                                            if (this.CurFileIndex < this.FileList.length) {
                                                this.faceImport(this.FileList[this.CurFileIndex]);
                                            } else {
                                                this.ImportStatus = 3; //导入完成
                                                //全部导入完成后清空控件，防止再次选择无效
                                                $("#selfile_backup").val("");
                                            }
                                        } else {
                                            this.ImportStatus = 3;
                                            clearInterval(import_status_timer);
                                        }
                                    });
                                }, 1000);
                            } else {
                                this.$notify.error(this.$store.getters.current_language['i18n_inport_error']);
                            }
                        });
                    } else {
                        //空间不足
                        this.$notify.error(this.$store.getters.current_language['i18n_inport_error']);
                    }

                });

            },
            getfile(e) {
                this.click_file = true;
                this.OperateMode = 1;//导入模式

                msg(e);

                if (e.target.files.length == 0) {
                    this.$notify.error(this.$store.getters.current_language['i18n_nofile']);
                    return ;
                }

                this.FileList = e.target.files;
                this.CurFileIndex = 0;

                this.faceImport(this.FileList[this.CurFileIndex]);
            },
            deleteTempFile() {
                msg('delete face group file!');
                this.$store.dispatch('request', { url: 'goform/frmDeleteFaceGroupFile', Type: 1, Data: {} });
            },
        },
        computed: {
            hidden_json() {
                return JSON.stringify($.extend(true, wsseHeader(this.$store.getters.tokenA, this.$store.getters.tokenB), { uploadType: 'FaceModel' }));
            },
        },
    };
</script>

<style scoped></style>
