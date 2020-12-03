<template>
    <div class="file_container clearfix">
        <div class="file_left r_bg">
            <div class="w100 ">
                <!--<div class="fl"></div>-->
                <div class="100 pl5" style="height: 35px;">
                    <input class="textc" :value="filetime" style="width: 65%" @click="show_calendar" readonly="true" />
                    <button :class="button_style" :style="{ width: '55px' }" v-tr="i18n_search" @click="search"></button>
                </div>
            </div>
            <div class="w100 xx1" :style="{ 'overflow-y': 'auto', height: tree_height + 'px' }">
                <ul class="ztree" id="tree"></ul>
            </div>
        </div>

        <div class="file_middle">
            <div id="divObj" :style="'height:' + plugin_height + 'px;'">
                <CVPlugin
                    ref="fileobject"
                    identity="file"
                    type="LOCALFILE"
                    class="full"
                    @playstatechanged="playstate_changed"
                    @voicestatechanged="voicestate_changed"
                    @speedchanged="speed_changed"
                ></CVPlugin>
            </div>

            <div class="w100">
                <CVPlayerControlBar
                    type="file"
                    :showCapture="ui_custom.showCapture.visible"
                    :playstate="playstate"
                    :voicestate="voicestate"
                    :speed="speed"
                ></CVPlayerControlBar>
            </div>
        </div>
    </div>
</template>

<script>
    import CVPlayerControlBar from 'components/playercontrolbar/cv-player-controlbar';

    import { rangeArray } from 'common/util';
//    import CVPlugin from 'components/activex/activex-wrapper.js';
    import style from 'mixin/style';

    import { current_year, current_month, current_day, LocalTimeToUTC, isLeapYear, getMonthDays } from 'common/util';

    //节点配置
    var setting = {
        view: {
            showLine: true,
            selectedMulti: false,
            dblClickExpand: true,
        },
        data: {
            simpleData: {
                enable: true,
            },
        },
        callback: {
            beforeExpand: beforeExpand,
            //onExpand:onExpand,
            onDblClick: onDbClick, //双击播放
            onClick: onClick, //单击
            beforeCollapse: beforeCollapse,
        },
    };

    function beforeCollapse(treeId, treeNode) {
        treeNode.isExpand = false; //设置节点属性为折叠
        if (treeNode.id == 6 && treeNode.children != undefined) {
            for (var i = 0, l = treeNode.children.length; i < l; i++) {
                $.fn.zTree.getZTreeObj('tree').expandNode(treeNode.children[i], false, true, false, false);
            }
        }
    }

    //节点展开之间的事件
    function beforeExpand(treeId, treeNode) {
        //Util.ShowWait();
        var zTree = $.fn.zTree.getZTreeObj('tree');
        treeNode.isExpand = true; //设置节点属性为展开
        zTree.updateNode(treeNode);

        getAllFile(zTree, treeNode);

        treeNode.open = false;

        return true;
    }

    var path = '';
    var isExpand = true;
    //双击节点事件
    function onDbClick(e, treeId, treeNode) {
        //console.log("onDblClick  trigger!!");
        if (treeNode == null) return;
        path = treeNode.t;
        //判断节点是文件还是文件夹  文件直接播放 文件夹则展开/关闭
        if (path.endsWith('avi') > 0 || path.endsWith('i8') > 0 || path.endsWith('jpg') > 0 || path.endsWith('jpeg') > 0 || path.endsWith('bmp') > 0) {
            //doAction(0);
            treeNode.dispatch('choosed_filename', { path });
            treeNode.dispatch('ie_fileplayer_action_trigger', { cmd: 'play' });
            return;
        }

        if (treeNode.isExpand == undefined || !treeNode.isExpand) {
            return;
        }

        var zTree = $.fn.zTree.getZTreeObj('tree');
        zTree.updateNode(treeNode); //更新当前选中节点展开状态
        let nodes = zTree.getSelectedNodes();
        let treeNodes = nodes[0];

        //  getAllFile(zTree,treeNodes);
    }

    function onClick(e, treeId, treeNode) {
        //console.log("onClick  trigger!!");
        if (treeNode == null) return;
        treeNode.dispatch('choosed_filename', { path: treeNode.t });
        // path = treeNode.t;
    }

    function sortNumber(a, b) {
        return a - b;
    }

    var sd_list = [];
    var list_pic = {};
    //遍历获取所有的文件夹和指定日期的文件
    function getAllFile(zTree, treeNode) {
        //     msg([treeNode.id,treeNode.t]);
        //msg(zTree.transformToArray(treeNode).length)

        if (treeNode.id == 6 || (typeof treeNode.id == 'string' && treeNode.id.indexOf('6_') > -1)) {
            if (treeNode.id == 6) {
                treeNode.dispatch('get_sdcards_pics', { path: treeNode.t }).then((r) => {
                    if (r.Result != 0) return;
                    let list = r.Data.SearchResults;
                    let i = 0;
                    if (list.length >= sd_list.length) {
                        i = parseInt(sd_list.length % 200 ? sd_list.length / 200 + 1 : sd_list.length / 200);
                    }

                    if (sd_list[0] && list[0].substr(0, 8) != sd_list[0].substr(0, 8)) {
                        i = 0;
                    }
                    if (!i) {
                        if (treeNode.children != undefined) {
                            //删除节点下原有子节点
                            /*  while(treeNode.children.length>0)
                    {
                      //删除选中的子节点
                      //zTree.removeNode(treeNode.children[0]);
                    }*/
                            zTree.removeChildNodes(treeNode);
                            treeNode.isParent = true;
                        }
                    }
                    sd_list = list;
                    let num = parseInt(list.length % 200 ? list.length / 200 + 1 : list.length / 200);
                    for (; i < num; i++) {
                        let nodeid = treeNode.id + '_' + i;
                        zTree.addNodes(treeNode, {
                            id: nodeid,
                            pId: treeNode.id,
                            name: i + 1,
                            getters: treeNode.getters,
                            dispatch: treeNode.dispatch,
                            t: treeNode.t,
                            isParent: true,
                            isExpand: false,
                            icon: 'static/images/c1.gif',
                        }); //文件夹
                    }
                });
            } else {
                let curNum = parseInt(treeNode.id.substr(2));
                let leng = (curNum + 1) * 200 > sd_list.length ? sd_list.length : (curNum + 1) * 200;
                let curNodeNum = zTree.transformToArray(treeNode).length - 1;
                let i = curNum * 200;
                if (leng < curNodeNum) {
                    if (treeNode.children != undefined) {
                        //删除节点下原有子节点
                        while (treeNode.children.length > 0) {
                            //删除选中的子节点
                            zTree.removeNode(treeNode.children[0]);
                        }
                    }
                } else {
                    i += curNodeNum;
                }
                for (; i < leng; i++) {
                    let nodeid = treeNode.id + '_' + i;
                    zTree.addNodes(treeNode, {
                        id: nodeid,
                        pId: treeNode.id,
                        name: sd_list[i],
                        getters: treeNode.getters,
                        dispatch: treeNode.dispatch,
                        t: treeNode.t + '/' + sd_list[i],
                        icon: 'static/images/c3.gif',
                    }); //图片文件
                }
            }
        } else {
            let path = treeNode.t;
            let level = new String(treeNode.id).split('_').length;
            let isFace = treeNode.id == 8 || (typeof treeNode.id == 'string' && treeNode.id.indexOf('8_') > -1);
            let dirs = [];
            let files = [];
            if (treeNode.children != undefined) {
                //删除节点下原有子节点
                while (treeNode.children.length > 0) {
                    //删除选中的子节点
                    zTree.removeNode(treeNode.children[0]);
                }
            }

            if ((!isFace && level > 2) || (isFace && level > 4)) {
                files = list_pic[treeNode.id.substr(0, 2)];
                let curNum = parseInt(treeNode.name) - 1;
                let leng = (curNum + 1) * 200 > files.length ? files.length : (curNum + 1) * 200;
                let i = curNum * 200;

                let node_t = treeNode.t.substring(0, treeNode.t.lastIndexOf('/'));
                for (; i < leng; i++) {
                    let nodeid = treeNode.id + '_' + i;
                    if (files[i].name.endsWith('avi') > 0 || files[i].name.endsWith('i8') > 0)
                        zTree.addNodes(treeNode, {
                            id: nodeid,
                            pId: treeNode.id,
                            name: files[i].name,
                            getters: treeNode.getters,
                            dispatch: treeNode.dispatch,
                            t: node_t + '/' + files[i].name,
                            icon: 'static/images/c2.gif',
                        });
                    //录像文件
                    else if (files[i].name.endsWith('jpg') > 0 || files[i].name.endsWith('jpeg') > 0 || files[i].name.endsWith('bmp') > 0)
                        zTree.addNodes(treeNode, {
                            id: nodeid,
                            pId: treeNode.id,
                            name: files[i].name,
                            getters: treeNode.getters,
                            dispatch: treeNode.dispatch,
                            t: node_t + '/' + files[i].name,
                            icon: 'static/images/c3.gif',
                        });
                    //图片文件
                    else
                        zTree.addNodes(treeNode, {
                            id: nodeid,
                            pId: treeNode.id,
                            name: files[i].name,
                            getters: treeNode.getters,
                            dispatch: treeNode.dispatch,
                            t: node_t + '/' + files[i].name,
                            icon: 'static/images/29.gif',
                        });
                }
            } else {
                treeNode.dispatch('get_path_map', { path }).then(({ Dirs, Files, DateStr }) => {
                    msg(['level', level, { Dirs, Files, DateStr }]);
                    if (level == 1) {
                        //第一层目录 必须是20100908格式
                        for (let i = 0; i < Dirs.length; i++) {
                            if (DateStr == Dirs[i]) {
                                dirs.push({ name: Dirs[i] }); //文件夹
                            }
                        }
                    } else if (isFace && (level == 2 || level == 3)) {
                        if (level == 2) {
                            //ip
                            let IpStr = window.location.hostname;
                            Dirs.forEach((item) => {
                                if (IpStr == item) {
                                    dirs.push({ name: item }); //文件夹
                                }
                            });
                        } else if (level == 3) {
                            //SnapFaces
                            Dirs.forEach((item) => {
                                //    if("SnapFaces" == item)
                                //    {
                                dirs.push({ name: item }); //文件夹
                                //    }
                            });
                        }
                    } else {
                        if ((!isFace && level == 2) || (isFace && level == 4)) {
                            let num = parseInt(Files.length % 200 ? Files.length / 200 + 1 : Files.length / 200);
                            for (let i = 0; i < num; i++) {
                                dirs.push({ name: i + 1 });
                            }
                            list_pic[treeNode.id.substr(0, 2)] = Files.map((item) => {
                                return { name: item };
                            });
                            msg(['list_pic', list_pic]);
                        } else {
                            files = Files.map((item) => {
                                return { name: item };
                            });
                        }
                    }

                    msg(['dirs,files', dirs, files]);
                    let zNodes = [];
                    dirs.forEach((item, i) => {
                        if ($.isArray(item.name)) {
                            item.name.sort(sortNumber);
                            item.name.forEach((item, i) => {
                                let nodeid = treeNode.id + '_' + i;
                                zNodes.push({
                                    id: nodeid,
                                    pId: treeNode.id,
                                    name: item,
                                    getters: treeNode.getters,
                                    dispatch: treeNode.dispatch,
                                    t: treeNode.t + '/' + item,
                                    isParent: true,
                                    isExpand: false,
                                    icon: 'static/images/c1.gif',
                                }); //文件夹
                            });
                        } else {
                            let nodeid = treeNode.id + '_' + i;
                            zNodes.push({
                                id: nodeid,
                                pId: treeNode.id,
                                name: item.name,
                                getters: treeNode.getters,
                                dispatch: treeNode.dispatch,
                                t: treeNode.t + '/' + item.name,
                                isParent: true,
                                isExpand: false,
                                icon: 'static/images/c1.gif',
                            }); //文件夹
                        }
                    });
                    files.forEach((item, i) => {
                        var nodeid = treeNode.id + '_' + i;
                        if (item.name.endsWith('avi') > 0 || item.name.endsWith('i8') > 0)
                            zNodes.push({
                                id: nodeid,
                                pId: treeNode.id,
                                name: item.name,
                                getters: treeNode.getters,
                                dispatch: treeNode.dispatch,
                                t: treeNode.t + '/' + item.name,
                                icon: 'static/images/c2.gif',
                            });
                        //录像文件
                        else if (item.name.endsWith('jpg') > 0 || item.name.endsWith('jpeg') > 0 || item.name.endsWith('bmp') > 0)
                            zNodes.push({
                                id: nodeid,
                                pId: treeNode.id,
                                name: item.name,
                                getters: treeNode.getters,
                                dispatch: treeNode.dispatch,
                                t: treeNode.t + '/' + item.name,
                                icon: 'static/images/c3.gif',
                            });
                        //图片文件
                        else
                            zNodes.push({
                                id: nodeid,
                                pId: treeNode.id,
                                name: item.name,
                                getters: treeNode.getters,
                                dispatch: treeNode.dispatch,
                                t: treeNode.t + '/' + item.name,
                                icon: 'static/images/29.gif',
                            });
                    });

                    for (var i = 0; i < zNodes.length; i++) {
                        zTree.addNodes(treeNode, zNodes[i]); //添加新子节点
                    }
                });
            }
        }
    }

    //以str结尾
    /*String.prototype.endsWith = function(str)
{
  return this.substr(this.lastIndexOf(".") + 1).toUpperCase().trim() == str.toUpperCase();
}*/

    export default {
        name: 'CVFrameFile',
        mixins: [style],
        data() {
            return {
                filetime: '2018-01-01',
                playstate: undefined,
                voicestate: undefined,
                speed: undefined,
            };
        },

        mounted() {
            msg('File Mounted!');
            this.filetime = new Date().format(this.$store.getters.base.date_format);
        },

        methods: {
            playstate_changed(v) {
                this.playstate = v;
            },
            voicestate_changed(v) {
                this.voicestate = v;
            },
            speed_changed(v) {
                this.speed = v;
            },
            search() {
                let date = this.filetime.split('-');
                let v0 = date;
                switch (this.$store.getters.base.date_format) {
                    case 'MM-dd-yyyy':
                        v0[0] = date[2];
                        v0[1] = date[0];
                        v0[2] = date[1];
                        break;
                    case 'dd-MM-yyyy':
                        v0[0] = date[2];
                        v0[1] = date[1];
                        v0[2] = date[0];
                        break;
                }
                this.$store.commit('file/selected_year', parseInt(v0[0], 10));
                this.$store.commit('file/selected_month', parseInt(v0[1], 10));
                this.$store.commit('file/selected_day', parseInt(v0[2], 10));
                this.$store.dispatch('init_root_nodes', {});
            },
            show_calendar(e) {
                e.target.isDateOnly = true;
                this.$store.getters.calendar.show(e.target, this.hide_calendar);
            },
            hide_calendar(ctrl) {
                this.filetime = ctrl.value;
                var _n = $(ctrl).attr('name');
                if (!_n) return;
            },
        },
        computed: {
            root_nodes_path() {
                return this.$store.getters.root_path_map;
            },
            activated() {
                return this.$store.getters.file_activated;
            },
            plugin_height() {
                if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                    return this.$store.getters.content_rect.height - 91 - 30 - 10 - 6 - 41 - 16;
                } else {
                    return this.$store.getters.content_rect.height - 76 - 41;
                }
            },
            tree_height() {
                if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                    return this.$store.getters.content_rect.height - 91 - 30 - 10 - 35 - 16;
                } else {
                    return this.$store.getters.content_rect.height - 76 - 35;
                }
            },
        },
        watch: {
            activated(newVal, oldVal) {
                if (newVal) {
                }
            },
            root_nodes_path(curVal, oldVal) {
                //   msg('need init tree ndoes!!')

                let zObjNodes = [];
                let obj = this.lang;
                zObjNodes.push({
                    id: 1,
                    pId: 0,
                    name: obj.i18n_file_previewpic,
                    dispatch: this.$store.dispatch,
                    t: curVal.prevCapture,
                    isParent: true,
                    isExpand: false,
                    icon: 'static/images/c1.gif',
                });

                if (this.$UI['SDCard'].visible && this.$UI['CVFramePlayback'].showCapture.visible) {
                    zObjNodes.push({
                        id: 2,
                        pId: 0,
                        name: obj.i18n_file_pb_pic,
                        dispatch: this.$store.dispatch,
                        t: curVal.pbCapture,
                        isParent: true,
                        isExpand: false,
                        icon: 'static/images/c1.gif',
                    });
                }

                if (this.$UI['SDCard'].visible && this.$UI['CVFramePlayback'].showBackup.visible) {
                    zObjNodes.push({
                        id: 3,
                        pId: 0,
                        name: obj.i18n_file_backup,
                        dispatch: this.$store.dispatch,
                        t: curVal.backupPath,
                        isParent: true,
                        isExpand: false,
                        icon: 'static/images/c1.gif',
                    });
                }

                if (this.ui_custom.showCapture.visible) {
                    zObjNodes.push({
                        id: 4,
                        pId: 0,
                        name: obj.i18n_file_pic,
                        dispatch: this.$store.dispatch,
                        t: curVal.fileCapture,
                        isParent: true,
                        isExpand: false,
                        icon: 'static/images/c1.gif',
                    });
                }

                zObjNodes.push({
                    id: 5,
                    pId: 0,
                    name: obj.i18n_file_rec,
                    dispatch: this.$store.dispatch,
                    t: curVal.recPath,
                    isParent: true,
                    isExpand: false,
                    icon: 'static/images/c1.gif',
                });

                if (this.$UI['CVConfigMenu'].CVConfigPlateDetect.visible) {
                    zObjNodes.push({
                        id: 7,
                        pId: 0,
                        name: obj.i18n_file_platePics,
                        dispatch: this.$store.dispatch,
                        t: curVal.platePics,
                        isParent: true,
                        isExpand: false,
                        icon: 'static/images/c1.gif',
                    });
                }

                //识别或者抓拍
                if (this.$UI['CVConfigMenu'].CVConfigFaceDetect.visible || this.$UI['CVTopMenu'].tab_face.visible) {
                    zObjNodes.push({
                        id: 8,
                        pId: 0,
                        name: obj.i18n_file_facePics,
                        dispatch: this.$store.dispatch,
                        t: curVal.facePics,
                        isParent: true,
                        isExpand: false,
                        icon: 'static/images/c1.gif',
                    });
                }

                if (this.$UI['SDCard'].visible) {
                    //有SD卡才显示
                    zObjNodes.push({
                        id: 6,
                        pId: 0,
                        name: obj.i18n_file_linkpic,
                        dispatch: this.$store.dispatch,
                        t: curVal.sdcardsPics,
                        isParent: true,
                        isExpand: false,
                        icon: 'static/images/c1.gif',
                    });
                }

                $.fn.zTree.init($('#tree'), setting, zObjNodes);
                sd_list = [];
            },
        },
        components: {
            CVPlayerControlBar,
            //      CVPlugin,
        },
    };
</script>

<style scoped></style>
