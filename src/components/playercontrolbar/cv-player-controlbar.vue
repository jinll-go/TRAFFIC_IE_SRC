<template>
    <div class="play clearfix">
        <div class="fl pl20 pt2">
            <div class="play_1" v-for="(item, idx) of actions" :key="idx" v-show="item.visible">
                <a @click="PlayVideo(item.cmd)" onfocus="this.blur()"> <img :src="item.url" width="32" height="32" border="0" :title="item.title"/></a>
            </div>
        </div>

        <div class="fr pr20 pt2">
            <div class="play_1" id="VoiceOpen" @click="PlayVideo('voice')">
                <a onfocus="this.blur()">
                    <img :src="voice_url" name="Image33" width="32" height="32" border="0" id="Image33" :title="lang.i18n_voiceSwitcher"
                /></a>
            </div>
            <!-- <div class="play_1" id="VoiceClose" onclick="PlayVideo(9)">
                  <a href="#"  onfocus="this.blur()" >
                        <img src="static/images/28.gif" name="Image34" width="32" height="32" border="0" id="Image34" title="声音开关" /></a></div>-->
        </div>

        <div style="float:right;padding-right:40px;padding-top:2px;">
            <!--<label v-tr="i18n_speed"></label>:-->&nbsp;<label>{{ current_speed }}</label
            >&nbsp;&nbsp;
        </div>
        <!--
        <div style="float:right;padding-top:2px;padding-right:80px;" v-show="showSmart && false">
            <input type="checkbox" id="play_smart" v-model="check_smart" @click="enable_smart" />&nbsp;
            <label for="play_smart" v-tr="i18n_showSmart"></label>
        </div>-->
    </div>
</template>

<script>
    /*
       play [normal fast slow]
       stop
       pause
       frame
       */
    import Vue from 'vue';

    export default {
        name: 'CVPlayerControlBar',
        props: {
            type: {
                type: String,
                default: 'playback', //file
            },
            /*showSmart: {
                type: Boolean,
                default: false,
            },*/
            showCapture: {
                type: Boolean,
                default: false,
            },
            showBackup: {
                type: Boolean,
                default: false,
            },
            playstate: {
                type: String,
                default: 'STOP',
            },
            voicestate: {
                type: Boolean,
                default: false,
            },
            speed: {
                type: Number,
                default: 0,
            },
        },

        computed: {
            actions() {
                return [
                    {
                        cmd: 'play',
                        visible: this.play_visible,
                        url: this.play_url,
                        title: this.lang.i18n_play,
                    },
                    {
                        cmd: 'pause',
                        visible: !this.play_visible,
                        url: this.pause_url,
                        title: this.lang.i18n_pause,
                    },
                    {
                        cmd: 'stop',
                        visible: true,
                        url: this.stop_url,
                        title: this.lang.i18n_stop,
                    },
                    {
                        cmd: 'slow',
                        visible: this.is_ie,
                        url: this.slow_url,
                        title: this.lang.i18n_slow,
                    },
                    {
                        cmd: 'fast',
                        visible: this.is_ie,
                        url: this.fast_url,
                        title: this.lang.i18n_fast,
                    },
                    {
                        cmd: 'capture',
                        visible: this.is_ie && this.showCapture,
                        url: this.capture_url,
                        title: this.lang.i18n_capture,
                    },
                    {
                        cmd: 'backup',
                        visible: this.type == 'playback' && this.is_ie && this.showBackup,
                        url: this.backup_url,
                        title: this.lang.i18n_backup,
                    },
                    {
                        cmd: 'frame',
                        visible: this.is_ie,
                        url: this.frame_url,
                        title: this.lang.i18n_frame,
                    },
                    {
                        cmd: 'fullscreen',
                        visible: this.type == 'playback' && this.plugin_type != 'flash',
                        url: this.fullscreen_url,
                        title: this.lang.i18n_fullscreen,
                    },
                ];
            },
            play_visible() {
                let state = this.playstate;
                msg('state', state);
                if (state == 'PLAY') {
                    return false;
                } else {
                    return true;
                }
            },
            is_dongshun_tyconew() {
                return this.$store.getters.is_tyconew || this.$store.getters.is_dongshun;
            },
            play_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/play.png';
                } else {
                    return 'static/images/19.gif';
                }
            },
            pause_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/pause.png';
                } else {
                    return 'static/images/20b.gif';
                }
            },
            stop_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/stop.png';
                } else {
                    return 'static/images/20.gif';
                }
            },
            fast_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/fast.png';
                } else {
                    return 'static/images/21.gif';
                }
            },
            slow_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/slow.png';
                } else {
                    return 'static/images/22.gif';
                }
            },
            capture_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/capture.png';
                } else {
                    return 'static/images/23.gif';
                }
            },
            frame_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/frame.png';
                } else {
                    return 'static/images/25.gif';
                }
            },
            backup_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/backup.png';
                } else {
                    return 'static/images/24.gif';
                }
            },
            fullscreen_url() {
                if (this.is_dongshun_tyconew) {
                    return 'static/images/fullscreen.png';
                } else {
                    return 'static/images/26.gif';
                }
            },
            voice_url() {
                let voice_state = this.voicestate;
                msg('voice_state', voice_state);
                if (this.is_dongshun_tyconew) {
                    if (voice_state != 0) {
                        return 'static/images/voice_open.png';
                    } else {
                        return 'static/images/voice_closed.png';
                    }
                } else {
                    if (voice_state != 0) {
                        return 'static/images/27.gif';
                    } else {
                        return 'static/images/28.gif';
                    }
                }

                /*  if (voice_state != 0) {
                    return 'static/images/27.gif';
                } else {
                    return 'static/images/28.gif';
                }*/
            },
            current_speed() {
                let trans = this.lang;
                let str = '';
                let speed = this.speed;
                msg('speed', speed);
                switch (speed) {
                    case 0:
                        str = trans['i18n_normalSpeed'];
                        break;
                    case -1:
                        str = trans['i18n_2partSpeed'];
                        break;
                    case -2:
                        str = trans['i18n_4partSpeed'];
                        break;
                    case -3:
                        str = trans['i18n_8partSpeed'];
                        break;
                    case -4:
                        str = trans['i18n_16partSpeed'];
                        break;
                    case 1:
                        str = trans['i18n_2Speed'];
                        break;
                    case 2:
                        str = trans['i18n_4Speed'];
                        break;
                    case 3:
                        str = trans['i18n_8Speed'];
                        break;
                    case 4:
                        str = trans['i18n_16Speed'];
                        break;
                }
                return str;
            },
            is_ie() {
                return this.plugin_type == 'ie';
            },
        },

        methods: {
            /*enable_smart(evt) {
                      //   msg(evt.target);
                      let plugin = this.$store.getters.playback_plugin;
                      if (!plugin) return;
                      if (this.is_ie) {
                          plugin.DisplaySmart(evt.target.checked);
    		} else {
                          if (evt.target.checked) {
                              plugin.EnableSmartDisplay({ type: 1, param: 0x1 | 0x2 });
                          } else {
                              plugin.DisableSmartDisplay({ type: 1, param: 0x1 | 0x2 });
                          }
                      }
    	},
    */
            PlayVideo(type) {
                this.$store.dispatch(`${this.plugin_type}_${this.type}player_action_trigger`, { cmd: type });
            },
        },
    };
</script>
