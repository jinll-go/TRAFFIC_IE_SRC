<template>
    <div class="hide_div" :style="{ height: height }">
        <div class="div_opacity"></div>
        <div class="text_center bkcolor Plugin_W_adaptive">
            <div class="text_right">
                <img src="static/images/17.gif" @click="hide" />
            </div>
            <div>
                <div class="w100 Plugin_H">
                    <CVPlugin
                        identity="person"
                        type="PLAYBACK"
                        class="full"
                        showbar="0"
                        @playstatechanged="playstate_changed"
                        @voicestatechanged="voicestate_changed"
                        @speedchanged="speed_changed"
                    ></CVPlugin>
                </div>

                <div class="w100 play" style="width: 100%">
                    <div class="play_1" v-show="play_visible || Status">
                        <a onfocus="this.blur()" @click="PlayVideo('play')">
                            <img src="static/images/19.gif" name="Image24" width="32" height="32" border="0" :title="lang.i18n_play" />
                        </a>
                    </div>

                    <div class="play_1" v-show="!play_visible && !Status">
                        <a onfocus="this.blur()" @click="PlayVideo('pause')">
                            <img src="static/images/20b.gif" name="Image26" width="32" height="32" border="0" :title="lang.i18n_pause" />
                        </a>
                    </div>
                    <div class="play_1">
                        <a onfocus="this.blur()" @click="PlayVideo('stop')">
                            <img src="static/images/20.gif" name="Image25" width="32" height="32" border="0" :title="lang.i18n_stop" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CVDialogPersonPlayback',
        props: {
            height: {
                type: String,
                default: '100%',
            },
            playcontext: {
                type: Object,
                default: {},
            },
        },
        data() {
            return {
                playstate: 'STOP',
                voicestate: undefined,
                speed: undefined,
                utctime: 0,
            };
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
            hide() {
                this.PlayVideo('stop');
                //this.$store.commit('person/isShowDialog', false);
                this.$emit('dialoghide');
            },
            ie_action_trigger(type) {
                let plugin = this.$store.getters.person.plugin;
                if (plugin) {
                    switch (type) {
                        case 'play':
                            if (this.Status) {
                                //暂停恢复
                                plugin.PlayBackStart();
                            } else {
                                //stop时正常播放
                                plugin.PlayByRange(
                                    $.extend(
                                        true,
                                        {
                                            TransProto: 0,
                                            streamType: 0,
                                            port: this.$store.getters.rtsp_port,
                                            ip: this.$store.getters.ip,
                                            usrname: this.$store.getters.tokenA,
                                            pwd: this.$store.getters.tokenB,
                                            dev: 1,
                                            ch: 1,
                                        },
                                        this.playcontext
                                    )
                                );
                            }
                            break;
                        case 'pause':
                            plugin.PlayBackPause();
                            break;
                        case 'stop':
                            plugin.PlayBackStop();
                            break;
                    }
                }
            },
            flash_action_trigger(type) {
                let plugin = this.$store.getters.person_plugin;
                if (type == 'play') {
                } else if (type == 'pause') {
                } else if (type == 'stop') {
                }
            },
            person_utctime_tick(x) {
                this.utctime = x.utctime;
            },
            h5_action_trigger(type) {
                let plugin = this.$store.getters.person_plugin;

                if (plugin) {
                    switch (type) {
                        case 'play':
                            plugin.on(CVH5Lib.Events.PLAYER_CURRENT_UTCTIME, this.person_utctime_tick);

                            plugin.play({
                                url: get_ws_url(this.$store.getters.ip),
                                protocols: ['video-stream'],
                                cmd: {
                                    Type: 1,
                                    Ch: 0,
                                    Dev: 0,
                                    Data: {
                                        StartTime: this.utctime == 0 ? this.playcontext.utc_begintime : this.utctime,
                                        StopTime: this.playcontext.utc_endtime,
                                        Cmd: 0,
                                        Audio: true,
                                        Video: true,
                                        Smart: false,
                                    },
                                },
                            });
                            break;
                        case 'pause':
                            plugin.pause();
                            break;
                        case 'stop':
                            plugin.off(CVH5Lib.Events.PLAYER_CURRENT_UTCTIME, this.person_utctime_tick);
                            plugin.stop();
                            break;
                    }
                }
            },
            PlayVideo(type) {
                this[`${this.plugin_type}_action_trigger`](type);
            },
        },
        computed: {
            play_visible() {
                return this.playstate == 'STOP';
            },
            Status() {
                return this.playstate == 'PAUSE';
            },
        },
    };
</script>
