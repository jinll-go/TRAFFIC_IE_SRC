<template>
    <div class="main_right_mid xx1">
        <CVPanelPtz ref="ptz"></CVPanelPtz>
        <CVPanelControl :mode="head" ref="control" :slideridentity="slidername"></CVPanelControl>

        <div class="w100 mt15">
            <button
                class="btn1"
                style="display:block;margin:0 auto;width:106px;"
                onmouseover="this.className='btn2'"
                onmouseout="this.className='btn1'"
                v-tr="i18n_exit"
                @click="exit"
            ></button>
        </div>
    </div>
</template>

<script>
    import CVPanelPtz from 'components/preview/cv-panel-ptz';
    import CVPanelControl from 'components/preview/cv-panel-control';
    export default {
        name: 'CVModalDialogHead',
        data() {
            return {
                is_fish: this.$store.getters.factory_info.IsOfFishEye == 'y',
                is_NetHIK: this.$store.getters.factory_info.IsofDome == 'y_ex', //网络球机
            };
        },
        created() {
            let name = this.$store.getters.preview.dialog;
            let plugin = this.$store.getters.preview.plugin;
            if (name == 'PRIVACYMASK' && this.plugin_type == 'h5') {
                msg('on privacymask');
                plugin.on('ipc_ptzdome_3d_privacymask_msg', this.setprivacymask);
            }
        },
        beforeDestroy() {
            let plugin = this.$store.getters.preview.plugin;
            if (this.plugin_type == 'h5') {
                msg('off privacymask');
                plugin.off('ipc_ptzdome_3d_privacymask_msg', this.setprivacymask);
            }
        },

        methods: {
            setprivacymask(obj) {
                msg('privacymask', obj);
                let Data = {};
                Data['Rect' + this.$store.getters.ptzextend.privacymask_idx] = {
                    X: parseInt(obj.left * 704),
                    Y: parseInt(obj.top * 576),
                    W: parseInt((obj.right - obj.left) * 704),
                    H: parseInt((obj.bottom - obj.top) * 576),
                };

                this.$store.dispatch('PTZExtend/SetCover', { Type: 1, Data });
            },
            exit() {
                let name = this.$store.getters.preview.dialog;
                if (name == 'SETSCAN') {
                    this.$store.dispatch('PTZExtend/SetScan', { Index: this.$store.getters.ptzextend.SetScanIndex, Type: 1 });
                } else if (name == 'PRIVACYMASK') {
                    if (this.is_NetHIK) {
                        let plugin = this.$store.getters.preview.plugin;
                        if (this.plugin_type == 'ie') {
                            plugin.DrawFuncMode = { mode: 2 };
                        } else if (this.plugin_type == 'h5') {
                            plugin.smartdecoder.attach(plugin.smartdecoder._mask);
                            plugin.smartdecoder.start();
                        }
                    } else if (this.is_fish) {
                    } else {
                        this.$store.dispatch('PTZExtend/SetCover', {
                            Index: this.$store.getters.ptzextend.privacymask_idx,
                            Type: 3,
                        });
                    }
                } else if (name == 'TRACK') {
                    //停止记录轨迹
                    if (this.is_NetHIK) {
                        this.$store.dispatch('request', {
                            url: 'goform/frmPTZDomePatternControl',
                            Type: 1,
                            Data: {
                                Cmd: 1,
                                Idx: this.$store.getters.ptz.track_id,
                            },
                        });
                    } else if (this.is_fish) {
                    } else {
                        this.$store.dispatch('request', {
                            url: 'goform/frmPTZTrack',
                            Type,
                            Ch: 1,
                            Data: {
                                TrackIndex,
                                Run,
                            },
                        });
                        //dispatch('PTZ/Track',{TrackIndex:this.$store.getters.ptz.track_id,Type:0,Run:0})
                    }
                }
                this.$store.commit('preview/ptz_state_changed', true);
                this.$store.commit('preview/dialog_changed', '');
            },
        },
        computed: {
            head() {
                //msg(["轨迹设置dialog",this.$store.getters.preview.dialog])
                return this.$store.getters.preview.dialog;
            },
            slidername() {
                if (this.$store.getters.preview.dialog == 'TRACK') {
                    return 'trackset_slider';
                } else {
                    return 'speed_slider';
                }
            },
        },
        components: {
            CVPanelPtz,
            CVPanelControl,
        },
    };
</script>
