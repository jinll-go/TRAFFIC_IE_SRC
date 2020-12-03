<template>
    <div class="clearfix" style="width:1500px;padding-top: 95px; padding-left: 20px;margin:0 auto;" v-if="operateMode==0">
        <div class="main_con_top_faceSchedule">
            <div class="fl pl10 bold">
                <label v-tr="i18n_faceSchedule"></label>
            </div>
        </div>

        <div class="main_con_mid_ss">
            <div style="float: right">
                <button style="width: 120px;" :class="button_style" v-tr="i18n_add" @click="add">Add</button>&nbsp;
                <!---
                <button style="width: 120px;" :class="button_style" @click="clearAll" v-tr="i18n_clear_all">Clear</button>
                --->
            </div>
            <div class="w100 mt10">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="_table">
                    <tr>
                        <th class="_th text_center" style="width: 5%"><label v-tr="i18n_faceScheduleType"></label></th>
                        <th class="_th text_center" style="width: 5%"><label v-tr="i18n_scheduleMode"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_scheduleDesc"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Monday"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Tusday"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Wenday"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Thusday"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Friday"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Satday"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_Sunday"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_operation"></label></th>
                    </tr>

                    <tr v-for="(item, index) in scheduleList">
                        <td class="_td text_center">
                            <label>{{item.ScheduleType}}</label>
                        </td>

                        <td class="_td text_center">
                            <label v-if="item.Mode == 0" v-tr="i18n_scheduleByDay">按天</label>
                            <label v-else v-tr="i18n_scheduleByWeek">按周</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{item.Description}}</label>
                        </td>

                        <td class="_td text_center" v-if="item.Mode==0" colspan="7">
                            <label v-for="quan in item.Day.TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>
                        <td class="_td text_center" v-else>
                            <label v-for="quan in item.Week[0].TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>

                        <td class="_td text_center" v-if="item.Mode==1">
                            <label v-for="quan in item.Week[1].TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>
                        <td class="_td text_center" v-if="item.Mode==1">
                            <label v-for="quan in item.Week[2].TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>
                        <td class="_td text_center" v-if="item.Mode==1">
                            <label v-for="quan in item.Week[3].TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>
                        <td class="_td text_center" v-if="item.Mode==1">
                            <label v-for="quan in item.Week[4].TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>
                        <td class="_td text_center" v-if="item.Mode==1">
                            <label v-for="quan in item.Week[5].TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>
                        <td class="_td text_center" v-if="item.Mode==1">
                            <label v-for="quan in item.Week[6].TimeQuan">
                                {{timeQuanStr(quan.StartTime, quan.StopTime)}}
                                <br>
                            </label>
                        </td>
                        <td class="_td text_center">
                            <a v-tr="i18n_modify" @click="modify(index)"></a>&nbsp;|&nbsp;
                            <a v-tr="i18n_del" @click="del(index)"></a>
                        </td>

                    </tr>

                    <tr v-show="scheduleList.length == 0">
                        <td class="_td text_center" width="100%" height="24" align="right" colspan="11">
                            <div style="width:60%;margin: 5px auto 5px auto;text-align:center;" v-tr="i18n_no_result"></div>
                        </td>
                    </tr>

                </table>

                <CVFootMenu ref="footmenu" :foot="foot" @pagechanged="pagechanged"></CVFootMenu>

            </div>
        </div>

        <div class="main_con_bot_faceSchedule"></div>


    </div>

    <!---
    添加修改界面
    --->
    <div class="clearfix" style="width:700px;padding-top: 95px; padding-left: 20px;margin:0 auto;" v-else>
        <div class="main_con_top_ss">
            <div class="fl pl10 bold"><label v-if="operateMode == 1" v-tr="i18n_add"></label></div>
            <div class="fl pl10 bold"><label v-if="operateMode == 2" v-tr="i18n_modify"></label></div>
        </div>
        <div class="main_con_mid_k">
            <div class="w100 pt5 pl50">
                <div class="pt10">
                    <!--- 类型 --->
                    <label class="text_right pr20" v-tr="i18n_faceScheduleType"></label>
                    <select class="textc" v-model="faceSchedule.type" style="width:130px;">
                        <option v-for="i in 200" v-if="unused(i)" :value="i" v-show="operateMode == 1"> {{ i }}</option>
                        <option :value="faceSchedule.type" v-show="operateMode == 2"> {{ faceSchedule.type }}</option>
                    </select>
                    <!--- 描述 --->
                    <label class="text_right pl40  pr20" v-tr="i18n_scheduleDesc"></label>
                    <input type="text" class="textc" style="width: 130px" v-model="faceSchedule.desc" v-validator:NOVOID:StrLength="[1, 64]">

                </div>

                <div class="pt10">
                    <!--- 模式 --->
                    <label class="text_right pr20" v-tr="i18n_scheduleMode"></label>
                    <select class="textc" v-model="faceSchedule.mode" style="width: 132px;">
                        <option :value="0" v-tr="i18n_scheduleByDay"></option>
                        <option :value="1" v-tr="i18n_scheduleByWeek"></option>
                    </select>
                    <!--- 周一到周日  --->
                    <label class="text_right pl40 pr20" style="margin-right: 10px" v-tr="i18n_week" v-show="faceSchedule.mode == 1"></label>
                    <select class="textc" v-model="faceSchedule.week" style="width: 130px;" v-show="faceSchedule.mode == 1">
                        <option :value="0" v-tr="i18n_Monday"></option>
                        <option :value="1" v-tr="i18n_Tusday"></option>
                        <option :value="2" v-tr="i18n_Wenday"></option>
                        <option :value="3" v-tr="i18n_Thusday"></option>
                        <option :value="4" v-tr="i18n_Friday"></option>
                        <option :value="5" v-tr="i18n_Satday"></option>
                        <option :value="6" v-tr="i18n_Sunday"></option>
                    </select>

                    <button :class="button_style" style="width: 100px; margin-left: 40px;" v-tr="i18n_add" @click="addTimeQuan"></button>
                </div>

            </div>

            <div class="w100 pt15 pl50">
                <label class="text_right" v-tr="i18n_timeQuan">:</label>

                <div class="p5" v-for="(item, index) in faceSchedule.daySchedule[faceSchedule.mode + faceSchedule.week].timeQuan">
                    <label class="text_center pr20"> {{ index + 1 }}. </label>
                    <label class="text_right pr20" v-tr="i18n_beginTime">:</label>
                    <input type="time" class="textc" v-model="item.startTime">
                    <label class="text_right pl40 pr20" v-tr="i18n_endTime">:</label>
                    <input type="time" class="textc" v-model="item.stopTime">
                    <button :class="button_style" style="margin-left: 20px; padding-bottom: 5px;" v-tr="i18n_del" @click="delTimeQuan(index)"></button>
                </div>
            </div>

            <div class="w100 pt15 pl50">
                <button :class="button_style" style="width: 100px; margin-left: 20%" @click="save" v-tr="i18n_confirm"></button>
                <button :class="button_style" style="width: 100px; margin-left: 20px" @click="cancel" v-tr="i18n_cancel"></button>
            </div>

        </div>

        <div class="main_con_bot_k"></div>
    </div>
</template>

<script>
    import style from "../../../mixin/style";
    import CVFootMenu from '@/components/log/cv-log-footmenu';

    export default {
        name: 'CVConfigFaceSchedule',
        mixins: [style],
        data() {
            return {
                operateMode: 0,
                totalNum: 0,
                scheduleList:[],
                supportType: [],
                curPage: 0,
                numPerPage: 10,
                foot: {
                    logitemcount: 0,
                    totalpages: 1,
                    current_page: 1,

                },
                faceSchedule: {
                    type: 0,
                    mode: 0,
                    desc: '',
                    daySchedule: [],
                    week: 0,
                },
            }
        },
        created() {
            this.initFaceSchedule();
        },
        mounted() {
            this.getFaceSchedule(0);
        },
        computed: {
            scheduleMode() {
                return this.faceSchedule.mode;
            },
            scheduleWeek() {
                return this.faceSchedule.week;
            }
        },
        methods: {
            initFaceSchedule() {
                this.faceSchedule.type = 0;
                this.faceSchedule.desc = '';
                this.faceSchedule.mode = 0;
                this.faceSchedule.week = 0;
                this.faceSchedule.daySchedule.splice(0, this.faceSchedule.daySchedule.length);
                for (var i = 0; i < 8; i++) {
                    var info = {
                        num: 0,
                        timeQuan: [
                        ]
                    };
                    this.faceSchedule.daySchedule.push(info);
                }
            },
            getFaceSchedule(page) {
                //获取总数
                this.$store.dispatch('request', {
                    url: 'goform/frmFaceSchedule',
                    Type: 3,
                    Ch: 0
                }).then((res) => {
                    if (res.Result == 0)
                    {
                        this.foot.logitemcount = res.Data.TotalNum;
                        let totalpage = Math.ceil(res.Data.TotalNum / this.numPerPage);
                        this.foot.totalpages = totalpage ? totalpage : 1;
                        this.foot.current_page = page + 1;

                        this.totalNum = res.Data.TotalNum;
                        var offset = page * this.numPerPage;
                        var getNum = offset + this.numPerPage > this.totalNum ? this.totalNum - offset : this.numPerPage;
                        this.$store.dispatch('request', {
                            url: 'goform/frmFaceSchedule',
                            Type: 4,
                            Ch: 0,
                            Data: {
                                Offset: offset,
                                GetNum: getNum
                            }
                        }).then((res) => {
                            if (res.Result == 0) {
                                this.scheduleList = res.Data.Schedule;
                            } else {
                                this.scheduleList.splice(0, this.scheduleList.length);
                            }
                        });
                    } else {
                        this.scheduleList.splice(0, this.scheduleList.length);
                    }
                });
            },
            timeQuanStr(StartTime, StopTime) {
                var text = (Math.floor(StartTime/100) < 10 ? '0' + Math.floor(StartTime/100) : Math.floor(StartTime/100))
                    + ':'
                    + (Math.floor(StartTime%100) < 10 ? '0' + Math.floor(StartTime%100) : Math.floor(StartTime%100))
                    + ' ~ '
                    + (Math.floor(StopTime/100) < 10 ? '0' + Math.floor(StopTime/100) : Math.floor(StopTime/100))
                    + ':'
                    + (Math.floor(StopTime%100) < 10 ? '0' + Math.floor(StopTime%100) : Math.floor(StopTime%100));

                return text;
            },
            unused(type) {
                if (type == 0) {
                    return false;
                }

                if (this.supportType.includes(type))
                {
                    return false;
                }

                return true;
            },
            add() {
                this.initFaceSchedule();
                this.$store.dispatch('request', {
                    url: 'goform/frmFaceSchedule',
                    Type: 5,
                    Ch: 0,
                }).then((res) => {
                    if (res.Result == 0) {
                        this.supportType = res.Data.SupportType;
                    }

                    for (var i = 1; i <= 200; i++) {
                        if (this.faceSchedule.type == 0 && this.unused(i)) {
                            this.faceSchedule.type = i;
                            break;
                        }
                    }
                    this.operateMode = 1;
                });
            },
            del(index) {
                this.$store.dispatch('request', {
                    url: 'goform/frmFaceSchedule',
                    Type: 2,
                    Ch: 0,
                    Data: {
                        ScheduleType: this.scheduleList[index].ScheduleType
                    }
                }).then((res) => {
                    if (res.Result == 0) {
                        //删除当前页最后一个时自动跳到上一页
                        if (this.scheduleList.length == 1) {
                            this.curPage = this.curPage - 1 > 0 ? this.curPage - 1 : 0;
                        }
                        this.getFaceSchedule(this.curPage);
                    }
                });
            },
            modify(index) {
                this.initFaceSchedule();
                this.faceSchedule.type = this.scheduleList[index].ScheduleType;
                this.faceSchedule.desc = this.scheduleList[index].Description;
                this.faceSchedule.mode = this.scheduleList[index].Mode;
                if (this.faceSchedule.mode == 0) {
                    this.faceSchedule.daySchedule[0].num = this.scheduleList[index].Day.TimeQuanNum;
                    for (var i = 0; i < this.faceSchedule.daySchedule[0].num; i++) {
                        var StartTime = this.scheduleList[index].Day.TimeQuan[i].StartTime;
                        var StopTime = this.scheduleList[index].Day.TimeQuan[i].StopTime;
                        var timeQuan = {
                            startTime:
                            (Math.floor(StartTime/100) < 10 ? '0' + Math.floor(StartTime/100) : Math.floor(StartTime/100))
                            + ':'
                            + (Math.floor(StartTime%100) < 10 ? '0' + Math.floor(StartTime%100) : Math.floor(StartTime%100)),

                            stopTime :
                            (Math.floor(StopTime/100) < 10 ? '0' + Math.floor(StopTime/100) : Math.floor(StopTime/100))
                            + ':'
                            + (Math.floor(StopTime%100) < 10 ? '0' + Math.floor(StopTime%100) : Math.floor(StopTime%100))
                        };

                        this.faceSchedule.daySchedule[0].timeQuan.push(timeQuan);
                    }
                } else {
                    for (var k = 0; k < 7; k++) {
                        this.faceSchedule.daySchedule[k + 1].num = this.scheduleList[index].Week[k].TimeQuanNum;
                        for (var i = 0; i < this.faceSchedule.daySchedule[k+1].num; i++) {
                            var StartTime = this.scheduleList[index].Week[k].TimeQuan[i].StartTime;
                            var StopTime = this.scheduleList[index].Week[k].TimeQuan[i].StopTime;
                            var timeQuan = {
                                startTime:
                                (Math.floor(StartTime/100) < 10 ? '0' + Math.floor(StartTime/100) : Math.floor(StartTime/100))
                                + ':'
                                + (Math.floor(StartTime%100) < 10 ? '0' + Math.floor(StartTime%100) : Math.floor(StartTime%100)),
                                stopTime:
                                (Math.floor(StopTime/100) < 10 ? '0' + Math.floor(StopTime/100) : Math.floor(StopTime/100))
                                + ':'
                                + (Math.floor(StopTime%100) < 10 ? '0' + Math.floor(StopTime%100) : Math.floor(StopTime%100))
                            };

                            this.faceSchedule.daySchedule[k+1].timeQuan.push(timeQuan);
                        }
                    }
                }

                this.operateMode = 2;
            },
            clearAll() {
                for (var i = 0; i < this.scheduleList.length; i++) {
                    this.$store.dispatch('request', {
                        url: 'goform/frmFaceSchedule',
                        Type: 2,
                        Ch: 0,
                        Data: {
                            ScheduleType: this.scheduleList[i].ScheduleType
                        }
                    }).then((res) => {
                        if (res.Result == 0 && i == this.scheduleList.length - 1) {
                            this.getFaceSchedule(0);
                        }
                    });
                }
            },
            addTimeQuan() {
                var num = this.faceSchedule.daySchedule[this.faceSchedule.mode + this.faceSchedule.week].num;
                if (num == 6) {
                    return ;
                }
                this.faceSchedule.daySchedule[this.faceSchedule.mode + this.faceSchedule.week].num++;
                var timequan = {startTime: '00:00', stopTime: '00:00'};
                this.faceSchedule.daySchedule[this.faceSchedule.mode + this.faceSchedule.week].timeQuan.push(timequan);
            },
            delTimeQuan(index) {
                this.faceSchedule.daySchedule[this.faceSchedule.mode + this.faceSchedule.week].num--;
                this.faceSchedule.daySchedule[this.faceSchedule.mode + this.faceSchedule.week].timeQuan.splice(index, 1);
            },
            save() {
                //处理按天的数据
                var dayTimeQuanArray = [];
                var timeQuan = this.faceSchedule.daySchedule[0].timeQuan;
                for (var i = 0; i < timeQuan.length; i++) {
                    var timeObject = {startTime: 0, stopTime: 0};
                    timeObject.startTime = parseInt(timeQuan[i].startTime.split(':')[0]) * 100 + parseInt(timeQuan[i].startTime.split(':')[1]);
                    timeObject.stopTime = parseInt(timeQuan[i].stopTime.split(':')[0]) * 100 + parseInt(timeQuan[i].stopTime.split(':')[1]);

                    dayTimeQuanArray.push(timeObject);
                }

                //处理按周的数据
                var week = [];
                for (var k = 0; k < 7; k++) {
                    var weekParam = {TimeQuanNum: 0, TimeQuan: []};
                    var weekDayTimeQuan = [];
                    timeQuan = this.faceSchedule.daySchedule[k+1].timeQuan;
                    for (var i = 0; i < timeQuan.length; i++) {
                        var timeObject = {startTime: 0, stopTime: 0};
                        timeObject.startTime = parseInt(timeQuan[i].startTime.split(':')[0]) * 100 + parseInt(timeQuan[i].startTime.split(':')[1]);
                        timeObject.stopTime = parseInt(timeQuan[i].stopTime.split(':')[0]) * 100 + parseInt(timeQuan[i].stopTime.split(':')[1]);

                        weekDayTimeQuan.push(timeObject);
                    }
                    weekParam.TimeQuanNum = this.faceSchedule.daySchedule[k+1].num;
                    weekParam.TimeQuan = weekDayTimeQuan;

                    week.push(weekParam);
                }

                msg('week: ' + week);

                this.$store.dispatch('request', {
                    url: 'goform/frmFaceSchedule',
                    Type: this.operateMode - 1,
                    Ch: 0,
                    Data: {
                        Schedule: {
                            ScheduleType: this.faceSchedule.type,
                            Description: this.faceSchedule.desc,
                            Mode: this.faceSchedule.mode,
                            Day: {
                                TimeQuanNum: this.faceSchedule.daySchedule[0].num,
                                TimeQuan: dayTimeQuanArray
                            },
                            Week: week
                        }
                    }
                }).then((res) => {
                    if (res.Result == 0) {
                        this.operateMode = 0;
                        this.getFaceSchedule(this.curPage);
                    } else {
                        this.$notify.error(this.lang['i18n_faceScheduleAddError']);
                    }
                });
            },
            cancel() {
                this.operateMode = 0;
            },
            pagechanged(page) {
                this.curPage = page - 1;
                this.getFaceSchedule(this.curPage);
            }
        },
        watch: {
            scheduleMode(val) {
                if (val == 0) {
                    this.faceSchedule.week = 0;
                }
            },
        },
        components: {
            CVFootMenu,
        }
    }
</script>

<style scoped>
    .main_con_top_faceSchedule {
        background: #575757;
        width: 1500px;
        height: 28px;
        padding-top: 4px;
        border-radius: 4px 4px 0 0;
    }
    .main_con_bot_faceSchedule {
        background-image: url(../../../../public/static/images/contop_bg3_ss.gif);
        background-repeat: no-repeat;
        background-size: 100%;
        height: 7px;
        width: 1500px;
    }
</style>