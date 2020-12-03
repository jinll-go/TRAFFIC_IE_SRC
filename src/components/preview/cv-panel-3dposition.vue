
<template>
    <div class="w100 pt2" name="position3d" id="position3d">
    <div name="ptz" class="flc"><label v-tr="i18n_3dposition"></label></div>
        <div class="fl ">
            <select name="3DSelect" :disabled="!!disabled" id="3DSelect" class="textc" style="width:40px;" v-model="mode">
        <option :value="0" v-tr="i18n_close"><!--关闭--></option>
        <option :value="1" v-tr="i18n_open"><!--开启--></option>
      </select>
    </div>
      </div>

</template>

<script>
    import { addEvent, removeEvent } from 'common/util';
    export default {
        name: 'CV3DPosition',
        model: {
            //清除默认的v-model绑定
            prop: 'mode',
            event: 'input',
        },
        props: ['disabled', 'mode'],
        data() {
            return {
                ipc3dcb: null,
            };
        },
        mounted() {
            this.mode = 0;
            this.$emit('input', this.mode);
        },
        methods: {
            set3dposition(obj) {
                msg('3d', obj);
                this.$store.dispatch('PTZExtend/3DPosition', {
                    StartX: Math.round(obj.left * 65536),
                    StartY: Math.round(obj.top * 65536),
                    StopX: Math.round(obj.right * 65536),
                    StopY: Math.round(obj.bottom * 65536),
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
                                    this.set3dposition(obj);
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
                            msg('on 3dposition');
                            plugin.on('ipc_ptzdome_3d_privacymask_msg', this.set3dposition);
                        } else {
                            msg('off 3dposition');
                            plugin.off('ipc_ptzdome_3d_privacymask_msg', this.set3dposition);
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
