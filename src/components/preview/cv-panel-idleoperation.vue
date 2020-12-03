
<template>
   
     <div class="w100 pt2" name="disSection" id="dividel">
        <div name="ptz" class="flc ">
            <label v-tr="i18n_idleOperation"><!--空闲操作--></label>
        </div>
        <div class="fl ">
		  <select name="select2" id="idelOpSelect" class="textc" style="width:60px;" v-model="type">
		    <option :value="0" v-tr="i18n_noAction"><!--无动作--></option>
		    <option :value="1" v-tr="i18n_preset"><!--预置点--></option>
		    <option :value="2" v-tr="i18n_cruise"><!--巡航--></option>
		    <option :value="3" v-tr="i18n_track"><!--轨迹--></option>
		    <option :value="4" v-tr="i18n_twoPointScan"><!--两点扫描--></option>
                </select>
            </div>
        <div class="fl pl5">
		  	<a onfocus="this.blur()">
                <img src="static/images/16.png" name="Image87" width="20" height="20" border="0" id="Image87" :title="lang.i18n_set" @click="set" />
            </a>
        </div>
            <div class="fl pl5">
		  	<a onfocus="this.blur()">
                <img src="static/images/15.png" name="Image88" width="20" height="20" border="0" id="Image88" :title="lang.i18n_call" @click="call" />
            </a>
          </div>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
	name: 'CVIdleOperation',
	data() {
		return {};
	},
	mounted() {
		let that = this;
		(async function() {
			let ret = await that.$store.dispatch('PTZExtend/IdleOperation', { Type: 0, Data: {} });
			if (ret.Result == 0) {
				msg(ret.Data);
				that.$store.commit('PTZExtend/guardpos_changed', ret.Data);
			}
		})();
	},
	computed: {
		type: {
			get: function() {
				return this.$store.getters.ptzextend.guardpos.Type;
			},
			set: function(v) {
				this.$store.commit('PTZExtend/guardpos_changed', { Type: v });
			},
		},
		lang() {
			return this.$store.getters.current_language;
		},
	},
	methods: {
		set() {
			if (this.$store.getters.ptzextend.guardpos.Type == 0) {
				this.$store.dispatch('PTZExtend/IdleOperation', { Type: 1, Data: { Index: 0, IdleTime: 0, Type: 0 } });
				return;
			}
			this.$store.commit('preview/dialog_changed', 'IDLEOPERATION');
			/*if(this.head_dialog){
 				this.head_dialog.$destroy();
 				this.head_dialog = null;
 			}
 			this.head_dialog = new Vue({el:".mask",store:this.$store,render:h=>h(CVModalDialogIdle)});
 			this.head_dialog.opened = true;*/
		},
		call() {
			let that = this;
			(async function() {
				let ret = await that.$store.dispatch('PTZExtend/IdleOperation', { Type: 2, Data: {} });
			})();
		},
	},
};
</script>


