
<template>
    <div class="w100 pt2">
    <div name="ptz" class="flc"><label v-tr="i18n_mannual_track"></label></div>
        <div class="fl ">
            <select class="textc" :disabled="!!disabled" style="width:50px;" v-model="mode">
        <option :value="0" v-tr="i18n_close"><!--关闭--></option>
        <option :value="1" v-tr="i18n_open"><!--开启--></option>
      </select>
    </div>
      </div>

</template>
<script>
    import { addEvent, removeEvent } from 'common/util';
    export default {
        name: 'CVMannualTrack',
        model: {
            //清除默认的v-model绑定
            prop: 'mode',
            event: 'input',
        },
        props: ['disabled', 'mode'],
        data() {
            return {
                mode: 0,
                ipc3dcb: null,
            };
        },
        mounted() {
            this.mode = 0;
            this.$emit('input', this.mode);
        },
        methods: {
            setManualTrack(obj) {
                this.$store.dispatch('request', {
                    url: 'goform/frmPTZDomeManualTrack',
                    Type: 1,
                    Ch: this.$store.getters.preview.ch,
                    Data: {
                        StartX: Math.round(obj.left * 10000),
                        StartY: Math.round(obj.top * 10000),
                        StopX: Math.round(obj.right * 10000),
                        StopY: Math.round(obj.bottom * 10000),
                    },
                });
            },
            doactions(newVal) {
                let plugin = this.$store.getters.preview_plugin;
                if (plugin) {
                    if (this.plugin_type == 'ie') {
                        plugin.open_3D_operation = newVal ? true : false;
                        if (newVal) {
                            //监听3D定位
                            if (!this.ipc3dcb) {
                                this.ipc3dcb = (obj) => {
                                    msg(obj.left, obj.top, obj.right, obj.bottom);
                                    Object.keys(obj).forEach((element) => {
                                        obj[element] = obj[element] / 65535;
                                    });
                                    this.setManualTrack(obj);
                                };
                            }
                            plugin.AddPluginEvent({
                                event_name: 'ipc_draw_3d_msg',
                                func: this.ipc3dcb,
                            });
                            addEvent(plugin, 'ipc_draw_3d_msg', this.ipc3dcb);
                        } else {
                            plugin.RemovePluginEvent('ipc_draw_3d_msg');
                            removeEvent(plugin, 'ipc_draw_3d_msg', this.ipc3dcb);
                        }
                    } else if (this.plugin_type == 'h5') {
                        if (newVal) {
                            plugin.smartdecoder.stop();
                            plugin.smartdecoder.attach(plugin.smartdecoder._mask, '3dposition');
                            msg('on manualtrack');
                            plugin.on('ipc_ptzdome_3d_privacymask_msg', this.setManualTrack);
                        } else {
                            msg('off manualtrack');
                            plugin.off('ipc_ptzdome_3d_privacymask_msg', this.setManualTrack);
                            plugin.smartdecoder.attach(plugin.smartdecoder._mask);
                            plugin.smartdecoder.start();
                        }
                    }
                }
            },
        },
        beforeDestroy() {
            this.doactions(0);
        },
        watch: {
            mode(newVal) {
                this.doactions(newVal);
                this.$emit('input', newVal);
            },
        },
    };
</script>
