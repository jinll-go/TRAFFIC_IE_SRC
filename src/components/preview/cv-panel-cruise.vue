<template>
    <div class="w100 pt2" id="divPTZCruise">
        <div name="ptz" class="flc">
            <label v-tr="i18n_cruise"><!-- 巡航 --></label>
        </div>
        <div class="fl">
            <select name="PTZCruise" id="PTZCruise" class="textc" style="width:50px;" v-model="cruise_path">
                <option v-for="opt in options" :value="opt">{{ opt }}</option>
            </select>
        </div>
        <div class="fl pl5">
            <a onfocus="this.blur()" v-if="ui_custom.cruise_set.visible">
                <img src="static/images/16.png" name="Image61" width="20" height="20" border="0" id="Image61" :title="lang.i18n_set" @click="set" />
            </a>
        </div>
        <div class="fl pl5">
            <a onfocus="this.blur()">
                <img src="static/images/17.png" name="Image621" width="20" height="20" border="0" id="Image621" :title="lang.i18n_del" @click="del" />
            </a>
        </div>
        <div class="fl pl5">
            <a onfocus="this.blur()">
                <img src="static/images/15.png" name="Image60" width="20" height="20" border="0" id="Image60" :title="lang.i18n_call" @click="call" />
            </a>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { rangeArray } from 'common/util';

    /*
        ["PTZ/Cruise"]({ dispatch, commit, state, getters }, { CruisePath, Type, Run, PresetNo, Dwell, Speed, CruiseItemNo }) {
            // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
            //  msg([CruisePath]);
            return new Promise((resolve, reject) => {
                Vue.$auth_request({
                    method: "POST",
                    url: "goform/frmPTZCruise",
                    data: JSON.stringify({
                        Dev: getters.preview.dev,
                        Ch: getters.preview.ch,
                        Type,
                        Data: {
                            CruisePath,
                            Run,
                            PresetNo,
                            Dwell,
                            Speed,
                            CruiseItemNo,
                        },
                    }),
                    async: true,
                    auth_type: "digest",
                    successCb(result) {
                        resolve(result);
                    },
                    errorCb(err) {
                        reject(false);
                    },
                });
            });
        },
    */
    export default {
        name: 'CVPanelCruise',

        data() {
            return {
                cruise_path: 1,
                run: 0, //是否调用的标记
            };
        },

        computed: {
            is_fish() {
                return this.$store.getters.factory_info.IsOfFishEye == 'y';
            },
            is_NetHIK() {
                return this.$store.getters.factory_info.IsofDome == 'y_ex';
            }, //网络球机
            options() {
                return this.is_fish ? rangeArray(1, 32) : rangeArray(1, 8);
            },
            cruise_num() {
                return this.$store.getters.preview_ptz_ability.MaxPatrolPathNum;
            },
            ptz_chan() {
                return this.$store.getters.ptz.cur_ch;
            },
        },
        methods: {
            set() {
                //iframe为背景的弹出层
                this.$store.commit('PTZ/property_changed', { cruise_path: this.cruise_path });
                this.$store.commit('preview/dialog_changed', 'CRUISE');
            },
            async del() {
                if (this.is_fish) {
                    let ret = await this.$store.dispatch('request', {
                        url: 'goform/frmFisheyeChanCruise',
                        Type: 3,
                        Data: {
                            ChanNum: this.ptz_chan,
                            OperationType: 0,
                            Route: this.cruise_path - 1,
                        },
                    });
                } else if (this.is_NetHIK) {
                    let tmp = {};
                    // msg(["当前是哪条巡航线",this.cruise_path,this.$store.getters.ptz.cruise_path])
                    tmp['PatrolPath' + this.cruise_path] = {
                        Name: '',
                        Presets: [],
                    };
                    let ret = await this.$store.dispatch('request', {
                        url: 'goform/frmPTZDomePatrolPath',
                        Type: 1,
                        Data: tmp,
                    });
                } else {
                    let ret = await this.$store.dispatch('request', {
                        url: 'goform/frmPTZCruise',
                        Type: 3,
                        Data: {
                            CruisePath: this.cruise_path,
                        },
                    });
                }
            },
            async call() {
                this.run = !this.run;
                if (this.is_fish) {
                    let ret = await this.$store.dispatch('request', {
                        url: 'goform/frmFisheyeChanCruise',
                        Type: 2,
                        Data: {
                            ChanNum: this.ptz_chan,
                            OperationType: this.run ? 1 : 0,
                            Route: this.cruise_path - 1,
                        },
                    });
                } else if (this.is_NetHIK) {
                    //网络球机
                    let ret = await this.$store.dispatch('request', {
                        url: 'goform/frmPTZDomePatrolPathControl',
                        Type: 1,
                        Data: {
                            Cmd: 2,
                            Idx: this.cruise_path,
                        },
                    });
                } else {
                    let ret = await this.$store.dispatch('request', {
                        url: 'goform/frmPTZCruise',
                        Type: 4,
                        Data: {
                            CruisePath: this.cruise_path,
                            Run: /*this.run?1:0*/ 1,
                        },
                    });
                }
            },
        },
        watch: {
            cruise_num(n, o) {
                this.options = rangeArray(1, n);
            },
        },
    };
</script>
