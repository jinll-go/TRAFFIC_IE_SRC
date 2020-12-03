<template>
    <div :class="cls_container">
        <div :class="cls_cz" v-if="ui_custom.voicecom.visible && show_voicetalk">
            <a onfocus="this.blur()">
                <img :src="voice_talk_url" name="Image47" id="Image47" border="0" :title="lang.i18n_voiceCom" @click="voiceComSwitch" />
            </a>
        </div>
        <div :class="cls_cz" v-if="show_voice">
            <a onfocus="this.blur()">
                <img :src="voice_open_url" name="Image471" border="0" id="Image471" :title="lang.i18n_voiceSwitcher" @click="VolumneSwitch" />
            </a>
        </div>
        <div :class="cls_cz">
            <a onfocus="this.blur()">
                <img src="static/images/6.png" name="Image48" border="0" id="Image48" :title="lang.i18n_capture" @click="capturePic" />
            </a>
        </div>
        <div :class="cls_cz" v-if="ui_custom.fullscreen.visible">
            <a onfocus="this.blur()">
                <img src="static/images/7.png" name="Image49" border="0" id="Image49" :title="lang.i18n_fullscreen" @click="showFullScreen" />
            </a>
        </div>
        <div :class="cls_cz" v-if="ui_custom.record.visible && show_record">
            <a>
                <img :src="record_state_url" name="Image50" border="0" id="Image50" :title="lang.i18n_record" @click="doRecord" />
            </a>
        </div>
    </div>
    <!--


    <div :class="this.$store.getters.is_honey ? 'w100 shortcutbar_container' : 'w100'">
        <div :class="this.$store.getters.is_honey ? 'cz shortcutbar_cz2' : 'cz'" id="TalkClose" v-if="ui_custom.voicecom.visible && !plugintype_is_flash">
            <a onfocus="this.blur()">
                <img :src="voice_talk_url" name="Image47" id="Image47" border="0" :title="lang.i18n_voiceCom" @click="voiceComSwitch" />
            </a>
        </div>

        <div class="cz" :class="this.$store.getters.is_honey ? 'cz shortcutbar_cz2' : 'cz'">
            <a onfocus="this.blur()">
                <img src="static/images/6.gif" name="Image48" border="0" id="Image48" :title="lang.i18n_capture" @click="capturePic" />
            </a>
        </div>
        <div
            class="cz"
            :class="this.$store.getters.is_honey ? 'cz shortcutbar_cz2' : 'cz'"
            v-if="ui_custom.fullscreen.visible && !plugintype_is_flash && !$store.is_fisheye"
        >
            <a onfocus="this.blur()">
                <img src="static/images/7.gif" name="Image49" border="0" id="Image49" :title="lang.i18n_fullscreen" @click="showFullScreen" />
            </a>
        </div>
        <div :class="this.$store.getters.is_honey ? 'cz shortcutbar_cz3' : 'cz'" v-if="ui_custom.record.visible && !plugintype_is_flash && !$store.is_fisheye">
            <a>
                <img :src="record_state_url" name="Image50" border="0" id="Image50" :title="lang.i18n_record" @click="doRecord" />
            </a>
        </div>
    </div>-->
</template>

<script>
    export default {
        name: 'CVPanelShortcutBar',
        computed: {
            cls_container() {
                return {
                    w100: true,
                    shortcutbar_container: this.$store.getters.is_honey,
                    shortcutbar_box: this.$store.getters.is_honey,
                };
            },
            cls_cz() {
                return {
                    cz: true,
                    shortcutbar_cz2: this.$store.getters.is_honey,
                };
            },
            show_voicetalk() {
                if (this.can_use_axplugins) {
                    return true;
                } else if (this.plugin_type == 'flash') {
                    return false;
                } else if (this.plugin_type == 'h5') {
                    return this.is_https;
                }
            },
            show_voice() {
                if (this.can_use_axplugins) {
                    return true;
                } else if (this.plugin_type == 'flash') {
                    return true;
                } else if (this.plugin_type == 'h5') {
                    return true;
                }
            },
            show_record() {
                if (this.can_use_axplugins && this.$store.getters.is_normal) {
                    return true;
                } else {
                    return false;
                }
            },
            is_https() {
                return window.location.protocol.includes('https');
            },
            voice_talk_url() {
			return this.$store.getters.voice_talk_state ? 'static/images/5.png' : 'static/images/5b.png';
		},
		voice_open_url() {
			return this.$store.getters.preview.voice_state ? 'static/images/27.png' : 'static/images/28.png';
		},
		record_state_url() {
			return this.$store.getters.record_state ? 'static/images/34a.png' : 'static/images/34.png';
		},
		alarm_state_url() {
			let obj = this.$store.getters.config.alarm_list;
			let ar = obj.filter((i) => {
				return i.State == 'true' || i.Status;
			});

			return ar.length ? 'static/images/32.png' : 'static/images/32a.png';
		},
		plugintype_is_flash() {
			return this.plugin_type == 'flash';
		},
		can_use_axplugins() {
			return this.$store.getters.base.canuse_axplugins;
		},
	},
	methods: {
		doRecord() {
			this.$store.dispatch(`${this.plugin_type}_click_record_button`, {});
		},
		showFullScreen() {
			this.$store.dispatch(`${this.plugin_type}_click_fullscreen`, {});
		},
		capturePic() {
			this.$store.dispatch(`${this.plugin_type}_click_capturePic`, {});
		},
		voiceComSwitch() {
			this.$store.dispatch(`${this.plugin_type}_click_voicetalk`, {});
		},

            VolumneSwitch() {
                this.$store.dispatch(`${this.plugin_type}_click_voice`, {});
            },
        },
    };
</script>
