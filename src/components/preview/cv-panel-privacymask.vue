<template>
    <div class="w100 pt2" name="disSection" id="divmask">
        <div name="ptz" class="flc">
            <label v-tr="i18n_selMask"><!--隐私遮蔽--></label>
        </div>
        <div class="fl ">
            <select name="select4" id="maskIndexSelect" class="textc" style="width:40px;" v-model="index">
                <option :value="opt" v-for="opt in count">{{ opt }}</option>
            </select>
        </div>

        <div class="fl ">
            <select name="selmask" id="selmask" class="textc" style="width:50px;" :disabled="!!disabled" v-model="enable">
                <option :value="1" v-tr="i18n_open"><!--开启--></option>
                <option :value="0" v-tr="i18n_close"><!--关闭--></option>
            </select>
        </div>

        <div class="fl " v-show="enable">
            <a onfocus="this.blur()">
                <img src="static/images/35.gif" name="Image89" width="22" height="22" border="0" id="Image89" :title="lang.i18n_set" @click="set" />
            </a>
        </div>
        <!--<div class="fl pl5" style="display:none">
			<a    onfocus="this.blur()" >
			      <img src="static/images/15.gif" name="Image90" width="22" height="22" border="0" id="Image90" title="结束编辑" />
			</a>
  		</div>-->
    </div>
</template>

<script>
    import Vue from 'vue';
    import CVModalDialogHead from 'components/preview/cv-modal-dialog-head';

    export default {
        name: 'CVPrivacyMask',
        props: ['disabled'],
        data() {
            return {
                count: 8,
                index: this.$store.getters.ptzextend.privacymask_idx,
            };
        },
        mounted() {
            this.head_dialog = null;
            this.GetInfo(1);
        },
        methods: {
            async GetInfo(idx) {
                let ret = await this.$store.dispatch('PTZExtend/SetCover', { Type: 0 });
                if (ret.Result == 0) {
                    let list = [];
                    if (this.$store.getters.factory_info.IsofDome == 'y_ex') {
                        let i = 1;
                        while (i < 10) {
                            if (ret.Data['Rect' + i]) {
                                list.push(ret.Data['Rect' + i].Enable);
                                i++;
                            } else {
                                break;
                            }
                        }
                    } else {
                        list = ret.Data.CoverEnable;
                    }
                    this.count = list.length;
                    this.$store.commit('PTZExtend/privacymask_changed', list);
                }
            },
            async set() {
                if (this.disabled) return;
                this.$store.commit('PTZExtend/privacymask_index_changed', this.index);
                this.$store.commit('preview/dialog_changed', 'PRIVACYMASK');

			/*	if(this.head_dialog){
 				this.head_dialog.$destroy();
 				this.head_dialog = null;
 			}
 			this.head_dialog = new Vue({el:".mask",store:this.$store,render:h=>h(CVModalDialogHead)});
 			this.head_dialog.opened = true;
			*/
                let plugin = this.$store.getters.preview.plugin;
                if (this.$store.getters.factory_info.IsofDome == 'y_ex') {
                    if (this.plugin_type == 'ie') {
                        plugin.DrawFuncMode = { mode: 3, cover: [0, 0, 0, 0] };
                    } else if (this.plugin_type == 'h5') {
                        plugin.smartdecoder.stop();
                        plugin.smartdecoder.attach(plugin.smartdecoder._mask, '3dposition');
                    }
                } else {
                    let ret = await this.$store.dispatch('PTZExtend/SetCover', { Index: this.index, Type: 2 });
                }
            },
        },
        watch: {
            index(newVal) {
                // if (this.$store.getters.factory_info.IsofDome != "y_ex") {
                this.GetInfo(newVal);
                // }
            },
        },
        computed: {
            enable: {
                get() {
                    return this.$store.getters.ptzextend.privacymask[this.index - 1];
                },
                async set(v) {
                    let ret = await this.$store.dispatch('PTZExtend/SetCover', {
                        Type: 1,
                        Index: this.index,
                        Enable: v,
                        Data: {
                            ['Rect' + this.index]: {
                                Enable: v,
                            },
                        },
                    });
                    if (ret.Result == 0) {
                        let maskcode = this.$store.getters.ptzextend.privacymask;
                        msg(['maskcode', maskcode, this.index, v]);
                        //通过maskcode[0] = 1 来更改数组. 视图不能响应
                        this.$set(maskcode, this.index - 1, v);
                        this.$store.commit('PTZExtend/privacymask_changed', maskcode);
                    }
                },
            },
        },
        components: {
            CVModalDialogHead,
        },
    };
</script>
