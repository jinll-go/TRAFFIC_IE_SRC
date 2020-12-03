<template>
    <div class="select_bg">
        <div class="select_style">
            <select v-model="streamidx">
                <option v-for="item of opts" :value="item.val" v-if="item.show">
                    {{ item.text }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    export default {
        name: 'CVStreamSelect',
        data() {
            return {
                opts: [],
                default_stream: this.$store.getters.preview.default_stream,
                streamidx: -1,
            };
        },
        created() {
            this.$store
                .dispatch('request', {
                    url: 'goform/frmVideoCompressAbility',
                    Type: 0,
                    Data: { AbilityType: 0 },
                })
                .then((r) => {
                    if (r.Result == 0) {
                        this.opts = r.Data.BaudRate.map((item) => {
                            let obj = { val: item[1] };
                            switch (item[1]) {
                                case 0:
                                    obj.text = this.lang.i18n_main_stream;
                                    //this.ui_custom.mainStream.visible = true;
                                    obj.show = this.ui_custom.mainStream.visible;
                                    break;
                                case 1:
                                    obj.text = this.lang.i18n_sub_stream; //this.ui_custom.subStream.visible = true;
                                    obj.show = this.ui_custom.subStream.visible;
                                    break;
                                case 2:
                                    obj.text = this.lang.i18n_EventStream;
                                    //this.ui_custom.eventStream.visible = true;
                                    obj.show = this.ui_custom.eventStream.visible;
                                    break;
                                case 3:
                                    obj.text = this.lang.i18n_thirdStream;
                                    obj.show = this.ui_custom.thirdStream.visible;
                                    break;
                                case 4:
                                    obj.text = this.lang.i18n_fourthStream;
                                    // this.ui_custom.thirdStream.visible = true;
                                    obj.show = this.ui_custom.fourthStream.visible;
                                    break;
                                case 5:
                                    obj.text = this.lang.i18n_fifthStream;
                                    // this.ui_custom.thirdStream.visible = true;
                                    obj.show = this.ui_custom.fifthStream.visible;
                                    break;
                            }
                            return obj;
                        });

                        /*
                        码流能力 support的时候，允许fontsize的自定义定制生效，
                        不强制 码流 和码流对应的fontsize visible同步
                        */
                        let main_support = this.opts.find((obj) => {
                            return obj.val == 0;
                        });
                        if (main_support) {
                            // this.$UI['CVConfigVideoShow'].mainOSDFontSize.visible = this.ui_custom.mainStream.visible;
                        } else {
                            this.$UI['CVConfigVideoShow'].mainOSDFontSize.visible = false;
                        }

                        let sub_support = this.opts.find((obj) => {
                            return obj.val == 1;
                        });
                        if (sub_support) {
                            // this.$UI['CVConfigVideoShow'].subOSDFontSize.visible = this.ui_custom.subStream.visible;
                        } else {
                            this.$UI['CVConfigVideoShow'].subOSDFontSize.visible = false;
                        }

                        let third_support = this.opts.find((obj) => {
                            return obj.val == 3;
                        });
                        if (third_support) {
                            // this.$UI['CVConfigVideoShow'].thirdOSDFontSize.visible = this.ui_custom.thirdStream.visible;
                        } else {
                            this.$UI['CVConfigVideoShow'].thirdOSDFontSize.visible = false;
                        }

                        let fourth_support = this.opts.find((obj) => {
                            return obj.val == 4;
                        });
                        if (fourth_support) {
                            // this.$UI["CVConfigVideoShow"].fourthOSDFontSize.visible = this.ui_custom.fourthStream.visible;
                        } else {
                            this.$UI['CVConfigVideoShow'].fourthOSDFontSize.visible = false;
                        }

                        let fifth_support = this.opts.find((obj) => {
                            return obj.val == 5;
                        });
                        if (fifth_support) {
                            // this.$UI["CVConfigVideoShow"].fifthOSDFontSize.visible = this.ui_custom.fifthStream.visible;
                        } else {
                            this.$UI['CVConfigVideoShow'].fifthOSDFontSize.visible = false;
                        }
                    }
                });
        },
        mounted() {
            msg('default_stream', this.default_stream);
            this.streamidx = this.default_stream;
        },
        watch: {
            streamidx(n, o) {
                msg('streamidx', n);
                this.$store.dispatch(`${this.plugin_type}_switch_stream`, { val: parseInt(n, 10), op: 'open' });
            },
        },
    };
</script>
