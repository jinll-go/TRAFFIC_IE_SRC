<template>
    <div>
        <div class="w100 pt5" style="text-align: center">
            <label v-tr="i18n_devChannel"></label>
        </div>
        <div class="w100 pt5 xx1" style="height: 500px">
            <ul class="ztree" :id="z_id"></ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CVLeftMenu',
        props: {
            z_id: {
                type: String,
                default: 'preview_tree', //playback_tree
            },
        },
        data() {
            return {
                checked: false,
                DevChanStreams: [[1]],
            };
        },
        mounted() {
            if (this.$store.getters.factory_info.OptionalDevChanStreams) {
                this.DevChanStreams = this.$store.getters.factory_info.OptionalDevChanStreams;
            }
            msg(['mounted lm', this.DevChanStreams]);
            this.setting = {
                view: {
                    showLine: true,
                    selectedMulti: false,
                    dblClickExpand: true,
                    enableMultiIcon: false,
                },
                data: {
                    simpleData: {
                        enable: true,
                    },
                },
                callback: {
                    beforeCheck: this.is_playback ? this.BeforeCheckClick : null,
                    onIConClick: this.zTreeOnIconClick,
                },
                check: {
                    enable: true,
                    chkStyle: 'checkbox',
                    radioType: 'all',
                    autoCheckTrigger: true,
                },
            };
            let { is_fisheye, is_multisensor } = this.$store.getters;
            let zObjNodes = [];
            if (this.is_preview && !this.is_fisheye) {
                this.setting.view.enableMultiIcon = true;
                delete this.setting.check;

                let is_humantemp = this.$UI['CVTopMenu']['tab_temperature'].visible;
                if (is_multisensor) {
                    for (let i = 1; i <= this.DevChanStreams.length; i++) {
                        zObjNodes.push({
                            id: i,
                            pId: 0,
                            name: 'Dev_' + i,
                            isParent: true,
                            open: true,
                            dispatch: this.$store.dispatch,
                            streamStatus: 0,
                        });
                        for (let j = 1; j <= this.DevChanStreams[i - 1].length; j++) {
                            zObjNodes.push({
                                id: i + '_' + j,
                                pId: i,
                                name: 'ch0' + j,
                                isParent: false,
                                dispatch: this.$store.dispatch,
                                streamStatus: is_humantemp ? 0 : -1,
                                streamNum: this.DevChanStreams[i - 1][j - 1],
                                dev: i,
                                ch: j,
                            });
                        }
                    }
                }
                $.fn.zTree.init($('#' + this.z_id), this.setting, zObjNodes);
            } else if (this.is_playback) {
                //普通ipc  单路回放
                //测温ipc 单路回放
                //人脸ipc  单路回放
                //鱼眼ipc  单路回放 只有鱼眼通道 有录像
                this.DevChanStreams = [[1]];

                this.setting.view.enableMultiIcon = false;
                this.setting.check = {
                    enable: true,
                    chkStyle: 'checkbox',
                    radioType: 'all',
                    autoCheckTrigger: true,
                };
                for (let i = 1; i <= this.DevChanStreams.length; i++) {
                    zObjNodes.push({
                        id: i,
                        pId: 0,
                        name: 'Dev_' + i,
                        isParent: true,
                        open: true,
                        icon: 'static/images/2.png',
                        nocheck: true,
                    });
                    for (let j = 1; j <= this.DevChanStreams[i - 1].length; j++) {
                        zObjNodes.push({
                            id: i + '_' + j,
                            pId: i,
                            name: 'ch0' + j,
                            isParent: false,
                            icon: 'static/images/main_closed.png',
                            dev: i,
                            ch: j,
                            dispatch: this.$store.dispatch,
                        });
                    }
                }
                $.fn.zTree.init($('#' + this.z_id), this.setting, zObjNodes);
            }
        },
        computed: {
            checkbox_url() {
                return this.checked ? 'static/images/_checkbox1.gif' : 'static/images/_checkbox0.gif';
            },
            is_preview() {
                return this.z_id == 'preview_tree';
            },
            is_playback() {
                return this.z_id == 'playback_tree';
            },
            viewmode() {
                return this.$store.getters.ptz.fisheye.curmode.ViewMode;
            },
            default_recordstatus() {
                if (this.plugin_type == 'ie') {
                    return 0;
                } else {
                    return -1; //不显示record icon
                }
            },
        },
        methods: {
            BeforeCheckClick(treeId, treeNode) {
                let treeObj = $.fn.zTree.getZTreeObj(this.z_id);
                let checkNodes = treeObj.getCheckedNodes(true);

                let ret = false;

                if (!treeNode.checked) {
                    let checked_num = this.$store.getters.pb_ch_list.length;
                    if (checked_num < 1) {
                        ret = true;
                    }
                } else {
                    ret = true;
                }

                treeNode.dispatch('leftmenu_click_channel', {
                    ch: treeNode.ch,
                    dev: treeNode.pId,
                    status: !treeNode.checked,
                });
                msg(['BeforeCheckClick', ret]);
                return ret;
            },
            zTreeOnIconClick(treeNode, status) {
                if (this.$store.getters.is_fisheye && this.plugin_type != 'ie') {
                    if (status == 'record') return;
                }
                let ch = parseInt(treeNode.ch);
                msg('zTreeOnIconClick', treeNode, status, treeNode.ch);
                if (!ch) return;
                switch (status) {
                    case 'main':
                        {
                            if (treeNode.streamStatus == 0) {
                                treeNode.streamStatus = -1;
                            } else {
                                treeNode.streamStatus = 0;
                            }
                        }
                        break;
                    case 'sub':
                        {
                            if (treeNode.streamStatus == 1) {
                                treeNode.streamStatus = -1;
                            } else {
                                treeNode.streamStatus = 1;
                            }
                        }
                        break;
                    case 'third':
                        {
                            if (treeNode.streamStatus == 3) {
                                treeNode.streamStatus = -1;
                            } else {
                                treeNode.streamStatus = 3;
                            }
                        }
                        break;
                    case 'record': {
                        treeNode.recordStatus = treeNode.recordStatus ? 0 : 1;
                        treeNode.dispatch('tree_changeRecord', { dev: treeNode.dev, ch: ch, recordStatus: treeNode.recordStatus });
                        return;
                    }
                }

                treeNode.dispatch('tree_changeStream', { dev: treeNode.dev, ch: ch, streamStatus: treeNode.streamStatus });
            },
        },
        watch: {
            viewmode(val) {
                msg('leftmenu viewmode', val);
                let zObjNodes = [];
                if (val.FisheyeView) {
                    zObjNodes.push({
                        id: 1,
                        pId: 0,
                        name: this.lang.i18n_FishEye,
                        isParent: true,
                        open: true,
                        dispatch: this.$store.dispatch,
                        streamStatus: 0,
                    });
                    zObjNodes.push({
                        id: '1_1',
                        pId: 1,
                        name: 'ch01',
                        isParent: false,
                        dispatch: this.$store.dispatch,
                        streamStatus: -1,
                        dev: 1,
                        ch: 1,
                        recordStatus: this.default_recordstatus,
                        streamNum: 0, //this.DevChanStreams[0][0]
                    });
                }
                let chan = 2;
                if (val.FullView) {
                    zObjNodes.push({
                        id: 2,
                        pId: 0,
                        name: this.lang.i18n_Panoramic,
                        dispatch: this.$store.dispatch,
                        isParent: true,
                        open: true,
                        streamStatus: 0,
                    });
                    let t = 1;
                    while (t <= val.FullView) {
                        zObjNodes.push({
                            id: '2_' + t,
                            pId: 2,
                            name: 'ch0' + chan,
                            dispatch: this.$store.dispatch,
                            isParent: false,
                            streamStatus: -1,
                            dev: 1,
                            ch: chan,
                            recordStatus: this.default_recordstatus,
                            streamNum: 0, //this.DevChanStreams[0][chan - 1]
                        });
                        t++;
                        chan++;
                    }
                }
                if (val.PtzView) {
                    zObjNodes.push({
                        id: 3,
                        pId: 0,
                        name: this.lang.i18n_Ptz,
                        isParent: true,
                        open: true,
                        dispatch: this.$store.dispatch,
                        streamStatus: 0,
                    });
                    let t = 1;
                    while (t <= val.PtzView) {
                        zObjNodes.push({
                            id: '3_' + t,
                            pId: 3,
                            name: 'ch0' + chan,
                            isParent: false,
                            dispatch: this.$store.dispatch,
                            streamStatus: -1,
                            dev: 1,
                            ch: chan,
                            recordStatus: this.default_recordstatus,
                            streamNum: 0, //this.DevChanStreams[0][chan - 1]
                        });
                        //   this.ptz_chan_list.push([chan - 1, 'ch0' + chan]);
                        t++;
                        chan++;
                    }
                }
                $.fn.zTree.init($('#' + this.z_id), this.setting, zObjNodes);
            },
        },
        beforeDestroy() {
            if (this.is_playback) {
                this.$store.dispatch('leftmenu_click_channel', { checked: 0 });
                this.$store.commit('playback/clear_channel');
            }
        },
    };
</script>
