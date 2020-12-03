<template>
    <div class="pb_container ">
        <div class="pb_middle text_center clearfix">
            <div class="w100" :style="'height:' + plugin_height">
                <CVPlugin
                    identity="playback"
                    type="PLAYBACK"
                    @playstatechanged="playstate_changed"
                    @voicestatechanged="voicestate_changed"
                    @speedchanged="speed_changed"
                ></CVPlugin>
            </div>

            <div class="w100">
                <CVPlayerControlBar
                    :showSmart="ui_custom.showSmart.visible"
                    :showCapture="ui_custom.showCapture.visible"
                    :showBackup="showBackup"
                    :playstate="playstate"
                    :voicestate="voicestate"
                    :speed="speed"
                ></CVPlayerControlBar>
            </div>
        </div>
        <div class="pb_left m_l_bg" :style="'height:' + height">
            <div :is="leftmenu" z_id="playback_tree"></div>
        </div>
        <div class="pb_right " :style="'height:' + height">
            <div class="main_right pt10 pl5">
                <div class="w100 pt10 text_center">
                    <div class="date clearfix" style="height:225px">
                        <CVInput ref="cn_date" :style="{ width: '202px' }" :autofocus="false" value="" :readonly="true"></CVInput>
                    </div>
                </div>

                <div class="w100 mt15 pt10 text_center">
                    <button :class="button_style" :style="{ width: '140px' }" v-tr="i18n_search" @click="search"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CVPlayerControlBar from 'components/playercontrolbar/cv-player-controlbar';

    import CVInput from 'components/input/input';

    import CVLeftMenu from 'components/leftmenu/cv-left-menu';

    import style from 'mixin/style';
    import { LocalTimeToUTC, pad } from 'common/util';

    export default {
        name: 'CVFramePlayback',
        mixins: [style],
        data() {
            return {
                leftmenu: '',
                playstate: 'STOP',
                voicestate: undefined,
                speed: undefined,
            };
        },
        mounted() {
            //缓存组件 第一次mounted、
            this.init_subs();

            /* if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                this.$store.commit('playback/add_channel', { ch: 1, dev: 1 });
            } else {*/
            this.leftmenu = 'CVLeftMenu';
            //}
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
            init_subs() {
                if (this.$refs.cn_date) {
                    if ((this.$store.getters.current_frame == 'CVFramePBSlider' || this.$store.getters.current_frame == 'CVFramePlayback') && this.activated) {
                        let dateControl = this.$refs.cn_date.$el.children[0];
                        //let dateControl2 = this.$refs.cn_date2.$el.children[0];
                        dateControl.value = new Date().format(this.$store.getters.base.date_format);
                        dateControl.isDateOnly = true;
                        dateControl.AlwaysShow = true;
                        this.calendar.show(dateControl);
                    }
                }
            },
            search() {
                // if (!(this.$store.getters.is_tyconew || this.$store.getters.is_dongshun)) {
                if (this.$store.getters.pb_ch_list.length == 0) {
                    alert(this.lang.i18n_check_channel_first);
                    return;
                }
                //  }
                if (this.playstate != 'STOP') {
                    alert(this.lang.i18n_stop_playback_first);
                    return;
                }

                let dateControl = this.$refs.cn_date.$el.children[0];
                let date = dateControl.value.split('-');

                date[0] = parseInt(date[0], 10);
                date[1] = parseInt(date[1], 10);
                date[2] = parseInt(date[2], 10);

                //let dd = new Date(date[0], date[1] - 1, date[2], 0, 0, 0);
                //let startTime = Date.UTC(dd.getUTCFullYear(), dd.getUTCMonth(), dd.getUTCDate(), dd.getUTCHours(), dd.getUTCMinutes(), dd.getUTCSeconds()) / 1000;

                //let startTime = LocalTimeToUTC(new Date(date[0], date[1] - 1, date[2], 0, 0, 0));
                //let stopTime = LocalTimeToUTC(new Date(date[0], date[1] - 1, date[2], 23, 59, 59));

                let localDTBeg = [...date, 0, 0, 0].map((item) => pad(item)).join('');
                let localDTEnd = [...date, 23, 59, 59].map((item) => pad(item)).join('');
                msg(localDTBeg, localDTEnd);
                // this.$store.getters.pb_ch_list.forEach(item => {
                //  msg([item.dev,item.ch]);
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmVideoRecordsQuery',
                        Type: 0,
                        Dev: 1,
                        Ch: 1,
                        Data: {
                            Channels: [1],
                            DeviceLocalDateTimeStart: localDTBeg,
                            DeviceLocalDateTimeStop: localDTEnd,
                            QueryType: 255,
                        },
                    })
                    .then((result) => {
                        if (result.Result == -655365) {
                        } else {
                            this.$store.dispatch(`${this.plugin_type}_draw_records`, {
                                DeviceLocalDateTimeStart: localDTBeg,
                                SearchResults: result.Data.SearchResults,
                            });
                        }
                    })
                    .catch((e) => {
                        error(e);
                    });
                // });
            },
        },

        computed: {
            activated() {
                return this.$store.getters.playback_activated;
            },
            width() {
                this.init_subs();
                return this.$store.getters.content_rect.width + 'px';
            },
            height() {
                this.init_subs();
                if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                    return this.$store.getters.content_rect.height - 91 - 30 - 10 - 6 - 16 + 'px';
                } else {
                    return this.$store.getters.content_rect.height - 76 + 'px';
                }
            },
            plugin_height() {
                if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                    return this.$store.getters.content_rect.height - 91 - 30 - 10 - 6 - 41 - 16 + 'px';
                } else {
                    return this.$store.getters.content_rect.height - 76 - 41 + 'px';
                }
            },
            calendar() {
                return this.$store.getters.calendar;
            },
            showBackup() {
                if (this.$store.getters.is_tyconew || this.$store.getters.is_dongshun) {
                    return false;
                } else {
                    return this.ui_custom.showBackup.visible;
                }
            },
            /*  parent_container() {
                return [`${this.plugin_type}-parentDiv`, 'w100'];
            },
            video_area_style() {
                return [`${this.plugin_type}-childDiv2`];
            },
            searchbar_style() {
                return [`${this.plugin_type}-childDiv1`];
            },*/
        },
        watch: {
            width(n) {
                //宽度改变,resize 检索条
                let c = this.$store.getters.pb.drawer;
                if (c) {
                    c.Resize(this.$store.getters.content_rect.width - 158 - 222, 80);
                }
            },
            activated(newVal, oldVal) {
                if (newVal) {
                    this.init_subs();
                } else {
                    this.calendar.hide();
                }

                //关闭声音
                if (this.$store.getters.plugin_type == 'flash') {
                    if (this.$store.getters.playback_plugin && this.$store.getters.pb_voice_state) {
                        this.$store.getters.playback_plugin.PbSetVolumn(newVal ? 1 : 0);
                    }
                }
            },
        },
        components: {
            CVPlayerControlBar,
            CVInput,
            CVLeftMenu,
        },
    };
</script>
<style scoped>
    .h5-parentDiv {
        width: 100%;
        position: relative;
    }
    .h5-childDiv1 {
        background-color: black;
        width: 100%;
        position: absolute;
        bottom: 0px;
        left: 0px;
    }
    .h5-childDiv2 {
        background-color: black;
        position: absolute;
        top: 1px;
        left: 0;
        right: 0;
        bottom: 81px;
    }
    .flash-childDiv1,
    .ie-childDiv1 {
        display: none;
    }
    .flash-childDiv2,
    .ie-childDiv2 {
        width: 100%;
        height: 100%;
    }
</style>
