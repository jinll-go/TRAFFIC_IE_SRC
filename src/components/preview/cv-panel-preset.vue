<template>
    <div class="w100 pt2">
        <div name="ptz" class="flc">
            <label v-tr="i18n_preset"><!-- 预设点 --></label>
        </div>
        <div class="fl">
            <select name="PTZPreset" id="PTZPreset" class="textc" style="width:50px;" v-model="preset_no">
                <option v-for="opt of options" :value="opt - 1">{{ opt - 1 }}</option>
            </select>
        </div>
        <div class="fl pl5">
            <a onfocus="this.blur()"
                ><img src="static/images/16.png" name="Image57" width="20" height="20" border="0" id="Image57" :title="lang.i18n_set" @click="set"
            /></a>
        </div>
        <div class="fl pl5">
            <a onfocus="this.blur()"
                ><img src="static/images/15.png" name="Image56" width="20" height="20" border="0" id="Image56" :title="lang.i18n_call" @click="call"
            /></a>
        </div>
    </div>
</template>

<script>
    import { rangeArray } from 'common/util';

    /*
     ["PTZ/Preset"]({ dispatch, commit, state, getters }, { Cmd, Index }) {
            // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}
            //  msg([Cmd,Index]);
            return new Promise((resolve, reject) => {
                Vue.$auth_request({
                    method: "POST",
                    url: "goform/frmPTZPreset",
                    data: JSON.stringify({
                        Dev: getters.preview.dev,
                        Ch: getters.preview.ch,
                        Type: 1,
                        Data: {
                            Cmd,
                            Index,
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

        ["PTZ/FisheyeChanPreset"]({ dispatch, commit, state }, { Type, Preset }) {
            return new Promise((resolve, reject) => {
                Vue.$auth_request({
                    method: "POST",
                    url: "goform/frmFisheyeChanPreset",
                    data: JSON.stringify({
                        Ch: 1,
                        Type,
                        Data: {
                            ChanNum: state.cur_ch,
                            Preset,
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
        name: 'CVPanelPreset',

        data() {
            return {
                options: rangeArray(1, 256),
                preset_no: 0,
                is_fish: this.$store.getters.factory_info.IsOfFishEye == 'y',
                is_NetHIK: this.$store.getters.factory_info.IsofDome == 'y_ex', //网络球机
            };
        },
        mounted() {
            // this.is_NetHIK = true;

            if (this.is_NetHIK) {
                //网络球机
            } else if (this.is_fish) {
            } else {
                let ar = this.para_custom.filterPresetArray || [];
                this.options = this.options.filter((item) => {
                    return !ar.includes(item - 1);
                });
                this.preset_no = this.options[0] - 1;
                msg([this.options, this.preset_no]);
            }
        },
        computed: {
            ptz_chan() {
                return this.$store.getters.ptz.cur_ch;
            },
            preset_num() {
                return this.$store.getters.preview_ptz_ability.MaxPersetNum;
            },
        },
        methods: {
            async set() {
                try {
                    if (this.is_NetHIK) {
                        //网络球机
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmPTZDomePresetControl',
                            Type: 1, //设置
                            Data: { Idx: this.preset_no, Cmd: 1 },
                        });
                    } else if (this.is_fish) {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmFisheyeChanPreset',
                            Type: 1,
                            Data: { Preset: this.preset_no, ChanNum: this.ptz_chan },
                        });
                    } else {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmPTZPreset',
                            Type: 1,
                            Data: { Cmd: 8, Index: this.preset_no },
                        });
                    }
                } catch (e) {}
            },
            async call() {
                // this.is_NetHIK = true
                try {
                    if (this.is_fish) {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmFisheyeChanPreset',
                            Type: 2,
                            Data: { Preset: this.preset_no, ChanNum: this.ptz_chan },
                        });
                    } else if (this.is_NetHIK) {
                        //网络球机
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmPTZDomePresetControl',
                            Type: 1, //调用
                            Data: { Idx: this.preset_no, Cmd: 2 },
                        });
                    } else {
                        let ret = await this.$store.dispatch('request', {
                            url: 'goform/frmPTZPreset',
                            Type: 1,
                            Data: { Cmd: 39, Index: this.preset_no },
                        });
                    }
                } catch (e) {}
            },
        },
        preset_num(n, o) {
            this.options = rangeArray(1, n);
        },
    };
</script>
